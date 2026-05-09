/* ================================================================
   Smart Digital — Shared Auth + Credits + Mini Dashboard
   ----------------------------------------------------------------
   Replaces every per-app firebase-auth.js. All paid apps store
   their plan & credit data inside the same `users` collection
   (the one ExamCraft already uses) under a per-app namespace map,
   e.g. users/{uid}.bizwrite = { plan, total, used, remaining,
   demoUsed, planLabel, purchasedOn }. Per-app history goes into
   subcollection users/{uid}/{appKey}_history.

   Each app must set window.SD_APP_CONFIG before loading this file:

     window.SD_APP_CONFIG = {
       appKey:           'bizwrite',          // namespace under users/{uid}
       resource:         'kit',               // singular noun
       resourcePlural:   'kits',              // plural noun
       planEmoji:        '🛍️',
       historyTitle:     'Recent Kits',
       totalField:       'kitsTotal',         // alias for app.js compat
       usedField:        'kitsUsed',
       remainingField:   'kitsRemaining',
       reserveFnName:    'reserveKitCredit',  // exposed on window
       releaseFnName:    'releaseKitCredit',
       saveHistoryFnName:'saveBizwriteHistory',
       pendingGenerateFn:'generateDescriptions',
       postUpdateHookName:'updateGenerateButton',
       historyTitleFor:  (data) => data.businessName || '—',
       historyMetaFor:   (data) => data.outputLang  || ''
     };

   Then include this file AFTER firebase-config.js and BEFORE app.js.
   ================================================================ */

(function () {
  'use strict';

  const SD = window.SD_APP_CONFIG;
  if (!SD || !SD.appKey) {
    console.error('[sd-account] window.SD_APP_CONFIG.appKey is required.');
    return;
  }

  const APP_KEY        = SD.appKey;
  const RESOURCE       = SD.resource       || 'credit';
  const RESOURCE_PLURAL = SD.resourcePlural || (RESOURCE + 's');
  const PLAN_EMOJI     = SD.planEmoji      || '🎟️';
  const HISTORY_TITLE  = SD.historyTitle   || 'Recent Activity';
  const HISTORY_SUB    = `${APP_KEY}_history`;
  const DEMO_LIMIT     = typeof SD.demoLimit === 'number' ? SD.demoLimit : 1;

  const TOTAL_KEY     = SD.totalField     || 'creditsTotal';
  const USED_KEY      = SD.usedField      || 'creditsUsed';
  const REMAINING_KEY = SD.remainingField || 'creditsRemaining';

  const PENDING_FLAG = SD.pendingGenerateFlag || '_pendingGenerate';
  const PENDING_FN   = SD.pendingGenerateFn   || null;
  const POST_HOOK    = SD.postUpdateHookName  || null;

  const titleFor = SD.historyTitleFor || ((d) => d.title || d.name || '—');
  const metaFor  = SD.historyMetaFor  || ((d) => d.subtitle || '');

  window.currentUserData = null;

  // ----------------------------------------------------------------
  // Helpers
  // ----------------------------------------------------------------
  function callPostHook() {
    if (POST_HOOK && typeof window[POST_HOOK] === 'function') {
      try { window[POST_HOOK](); } catch (_) {}
    }
  }

  function projectAppData(rootData) {
    const app = (rootData && rootData[APP_KEY]) || {};
    const merged = {
      uid:        rootData.uid,
      name:       rootData.name        || '',
      email:      rootData.email       || '',
      phone:      rootData.phone       || '',
      photo:      rootData.photo       || '',
      authMethod: rootData.authMethod  || 'email',
      plan:       app.plan        || null,
      planLabel:  app.planLabel   || null,
      demoUsed:   app.demoUsed    || 0,
      purchasedOn: app.purchasedOn || null,
      // Generic accessors
      creditsTotal:     app.total     || 0,
      creditsUsed:      app.used      || 0,
      creditsRemaining: app.remaining || 0
    };
    // Per-app aliases so existing app.js code keeps working
    merged[TOTAL_KEY]     = merged.creditsTotal;
    merged[USED_KEY]      = merged.creditsUsed;
    merged[REMAINING_KEY] = merged.creditsRemaining;
    return merged;
  }

  function extractCreditCount(planInfo) {
    if (typeof planInfo.credits === 'number') return planInfo.credits;
    const candidates = ['papers', 'letters', 'kits', 'docs', 'descriptions', 'resumes', 'scripts', 'translations'];
    for (const k of candidates) {
      if (typeof planInfo[k] === 'number') return planInfo[k];
    }
    return 0;
  }

  function extractPlanLabel(planInfo) {
    return planInfo.optionLabel || planInfo.label || planInfo.planLabel || planInfo.planId || 'Plan';
  }

  // ----------------------------------------------------------------
  // Firestore: load / create user doc
  // ----------------------------------------------------------------
  async function loadOrCreateUser(user) {
    try {
      const ref  = window.db.collection('users').doc(user.uid);
      const snap = await ref.get();

      if (!snap.exists) {
        const newDoc = {
          uid:        user.uid,
          name:       user.displayName || '',
          email:      user.email       || '',
          photo:      user.photoURL    || '',
          phone:      '',
          authMethod: user.providerData?.[0]?.providerId === 'google.com' ? 'google' : 'email',
          createdAt:  firebase.firestore.FieldValue.serverTimestamp(),
          [APP_KEY]: {
            plan: null, planLabel: null,
            total: 0, used: 0, remaining: 0,
            demoUsed: 0, purchasedOn: null
          }
        };
        await ref.set(newDoc);
        window.currentUserData = projectAppData(newDoc);
      } else {
        const data = snap.data();
        // Bootstrap the per-app namespace if missing (existing user, first
        // time visiting this app)
        if (!data[APP_KEY]) {
          await ref.update({
            [APP_KEY]: {
              plan: null, planLabel: null,
              total: 0, used: 0, remaining: 0,
              demoUsed: 0, purchasedOn: null
            }
          });
          data[APP_KEY] = {
            plan: null, planLabel: null,
            total: 0, used: 0, remaining: 0,
            demoUsed: 0, purchasedOn: null
          };
        }
        window.currentUserData = projectAppData(data);
      }
      updateCreditsDisplay();
      callPostHook();
    } catch (err) {
      console.error(`[sd-account:${APP_KEY}] Firestore load error — check Firebase Console → Firestore → Rules.`, err);
      // Minimal fallback so UI still renders
      window.currentUserData = projectAppData({
        uid: user.uid,
        name: user.displayName || '',
        email: user.email || '',
        photo: user.photoURL || '',
        [APP_KEY]: { plan: null, total: 0, used: 0, remaining: 0, demoUsed: 0 }
      });
      updateCreditsDisplay();
      callPostHook();
    }
  }

  // ----------------------------------------------------------------
  // Apply plan after payment
  // ----------------------------------------------------------------
  async function applyPlanToUser(planInfo) {
    if (!window.auth.currentUser) return;
    const credits = extractCreditCount(planInfo);
    const planLabel = extractPlanLabel(planInfo);
    try {
      const ref = window.db.collection('users').doc(window.auth.currentUser.uid);
      await ref.update({
        [`${APP_KEY}.plan`]:        planInfo.planId || planLabel,
        [`${APP_KEY}.planLabel`]:   planLabel,
        [`${APP_KEY}.total`]:       firebase.firestore.FieldValue.increment(credits),
        [`${APP_KEY}.remaining`]:   firebase.firestore.FieldValue.increment(credits),
        [`${APP_KEY}.purchasedOn`]: new Date().toISOString()
      });
      const snap = await ref.get();
      window.currentUserData = projectAppData(snap.data());
      updateCreditsDisplay();
      callPostHook();
    } catch (err) {
      console.error(`[sd-account:${APP_KEY}] applyPlanToUser error:`, err);
      throw err;
    }
  }

  // ----------------------------------------------------------------
  // Reserve / Release credit (transactional)
  // ----------------------------------------------------------------
  async function reserveCredit() {
    if (!window.auth.currentUser) return { reserved: false };

    const ref = window.db.collection('users').doc(window.auth.currentUser.uid);
    let nextRoot = null;

    await window.db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) throw new Error('User profile not found.');
      const data = snap.data();
      const app = data[APP_KEY] || {};
      const remaining = app.remaining || 0;
      if (remaining <= 0) {
        const err = new Error(`No ${RESOURCE} credits remaining.`);
        err.code = `${APP_KEY}/no-credits`;
        throw err;
      }
      tx.update(ref, {
        [`${APP_KEY}.used`]:      (app.used || 0) + 1,
        [`${APP_KEY}.remaining`]: remaining - 1
      });
      nextRoot = { ...data, [APP_KEY]: { ...app, used: (app.used || 0) + 1, remaining: remaining - 1 } };
    });

    if (nextRoot) {
      window.currentUserData = projectAppData(nextRoot);
      updateCreditsDisplay();
      callPostHook();
    }
    return { reserved: true };
  }

  async function releaseCredit() {
    if (!window.auth.currentUser) return;
    try {
      const ref = window.db.collection('users').doc(window.auth.currentUser.uid);
      let nextRoot = null;
      await window.db.runTransaction(async (tx) => {
        const snap = await tx.get(ref);
        if (!snap.exists) return;
        const data = snap.data();
        const app = data[APP_KEY] || {};
        const used = app.used || 0;
        const remaining = app.remaining || 0;
        tx.update(ref, {
          [`${APP_KEY}.used`]:      Math.max(0, used - 1),
          [`${APP_KEY}.remaining`]: remaining + 1
        });
        nextRoot = { ...data, [APP_KEY]: { ...app, used: Math.max(0, used - 1), remaining: remaining + 1 } };
      });
      if (nextRoot) {
        window.currentUserData = projectAppData(nextRoot);
        updateCreditsDisplay();
        callPostHook();
      }
    } catch (err) {
      console.error(`[sd-account:${APP_KEY}] releaseCredit error:`, err);
    }
  }

  // ----------------------------------------------------------------
  // Demo usage
  // ----------------------------------------------------------------
  async function incrementDemoUsed() {
    if (!window.auth.currentUser) return;
    try {
      const ref = window.db.collection('users').doc(window.auth.currentUser.uid);
      await ref.update({
        [`${APP_KEY}.demoUsed`]: firebase.firestore.FieldValue.increment(1)
      });
      if (window.currentUserData) {
        window.currentUserData.demoUsed = (window.currentUserData.demoUsed || 0) + 1;
      }
      updateCreditsDisplay();
      callPostHook();
    } catch (err) {
      console.error(`[sd-account:${APP_KEY}] incrementDemoUsed error:`, err);
    }
  }

  async function releaseDemoUse() {
    if (!window.auth.currentUser) return;
    try {
      const ref = window.db.collection('users').doc(window.auth.currentUser.uid);
      await window.db.runTransaction(async (tx) => {
        const snap = await tx.get(ref);
        if (!snap.exists) return;
        const data = snap.data();
        const app = data[APP_KEY] || {};
        tx.update(ref, {
          [`${APP_KEY}.demoUsed`]: Math.max(0, (app.demoUsed || 1) - 1)
        });
      });
      if (window.currentUserData) {
        window.currentUserData.demoUsed = Math.max(0, (window.currentUserData.demoUsed || 1) - 1);
      }
      updateCreditsDisplay();
      callPostHook();
    } catch (err) {
      console.error(`[sd-account:${APP_KEY}] releaseDemoUse error:`, err);
    }
  }

  // ----------------------------------------------------------------
  // History
  // ----------------------------------------------------------------
  async function saveHistory(meta) {
    if (!window.auth.currentUser) return;
    try {
      await window.db
        .collection('users')
        .doc(window.auth.currentUser.uid)
        .collection(HISTORY_SUB)
        .add({
          date: new Date().toISOString(),
          ...meta
        });
    } catch (err) {
      console.error(`[sd-account:${APP_KEY}] saveHistory error:`, err);
    }
  }

  async function loadRecentHistory() {
    const listEl = document.getElementById('sd-md-history-list');
    if (!listEl) return;
    listEl.innerHTML = '<div class="sd-md-history-empty">Loading...</div>';
    try {
      const snap = await window.db
        .collection('users')
        .doc(window.auth.currentUser.uid)
        .collection(HISTORY_SUB)
        .orderBy('date', 'desc')
        .limit(5)
        .get();

      if (snap.empty) {
        listEl.innerHTML = '<div class="sd-md-history-empty">Nothing here yet.</div>';
        return;
      }
      listEl.innerHTML = snap.docs.map((doc) => {
        const d = doc.data();
        const date = d.date
          ? new Date(d.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
          : '—';
        const title = escapeHtml(String(titleFor(d) || '—'));
        const meta = escapeHtml(String(metaFor(d) || ''));
        return `<div class="sd-md-history-item">
          <span class="sd-md-hi-dot"></span>
          <div class="sd-md-hi-info">
            <span class="sd-md-hi-title">${title}</span>
            <span class="sd-md-hi-meta">${meta ? meta + ' · ' : ''}${date}</span>
          </div>
        </div>`;
      }).join('');
    } catch (err) {
      console.error(`[sd-account:${APP_KEY}] loadRecentHistory error:`, err);
      listEl.innerHTML = '<div class="sd-md-history-empty">Could not load history.</div>';
    }
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  // ----------------------------------------------------------------
  // Mini Dashboard
  // ----------------------------------------------------------------
  function ensureDashboardMarkup() {
    if (document.getElementById('sd-mini-dashboard')) return;
    const overlay = document.createElement('div');
    overlay.className = 'sd-dashboard-overlay';
    overlay.id = 'sd-dashboard-overlay';
    overlay.addEventListener('click', closeDashboard);

    const panel = document.createElement('div');
    panel.className = 'sd-dashboard';
    panel.id = 'sd-mini-dashboard';
    panel.innerHTML = `
      <div class="sd-md-top">
        <h3 class="sd-md-title">My Dashboard</h3>
        <button class="sd-md-close" type="button" aria-label="Close">✕</button>
      </div>

      <div class="sd-md-user-row">
        <div class="sd-md-avatar" id="sd-md-avatar">U</div>
        <div>
          <div class="sd-md-user-name" id="sd-md-user-name">User</div>
          <div class="sd-md-user-email" id="sd-md-user-email"></div>
        </div>
      </div>

      <div class="sd-md-plan-card">
        <div class="sd-md-plan-top">
          <span class="sd-md-plan-icon" id="sd-md-plan-icon">${PLAN_EMOJI}</span>
          <div>
            <div class="sd-md-plan-name" id="sd-md-plan-name">Free Demo</div>
            <div class="sd-md-plan-sub" id="sd-md-plan-sub">1 free demo included</div>
          </div>
          <span class="sd-md-plan-badge" id="sd-md-plan-badge">DEMO</span>
        </div>
        <div class="sd-md-usage-bar-wrap">
          <div class="sd-md-usage-bar-track">
            <div class="sd-md-usage-bar-fill" id="sd-md-usage-bar"></div>
          </div>
          <span class="sd-md-usage-bar-label" id="sd-md-usage-label"></span>
        </div>
      </div>

      <div class="sd-md-stats-row">
        <div class="sd-md-stat-box">
          <span class="sd-md-stat-val" id="sd-md-stat-used">0</span>
          <span class="sd-md-stat-lbl">Used</span>
        </div>
        <div class="sd-md-stat-box">
          <span class="sd-md-stat-val" id="sd-md-stat-remaining">0</span>
          <span class="sd-md-stat-lbl">Left</span>
        </div>
        <div class="sd-md-stat-box">
          <span class="sd-md-stat-val" id="sd-md-stat-total">0</span>
          <span class="sd-md-stat-lbl">Total</span>
        </div>
      </div>

      <div class="sd-md-history-section">
        <div class="sd-md-section-title">${escapeHtml(HISTORY_TITLE)}</div>
        <div id="sd-md-history-list" class="sd-md-history-list">
          <div class="sd-md-history-empty">Nothing here yet.</div>
        </div>
      </div>

      <button class="sd-md-cta-btn" id="sd-md-cta-btn" type="button">
        View Plans &amp; Pricing →
      </button>
      <button class="sd-md-signout" id="sd-md-signout" type="button">
        Sign Out
      </button>
    `;
    document.body.appendChild(overlay);
    document.body.appendChild(panel);

    panel.querySelector('.sd-md-close').addEventListener('click', closeDashboard);
    panel.querySelector('#sd-md-signout').addEventListener('click', () => {
      closeDashboard();
      signOutUser();
    });
    panel.querySelector('#sd-md-cta-btn').addEventListener('click', () => {
      closeDashboard();
      if (typeof window.showPage === 'function')      window.showPage('pricing');
      else if (typeof window.switchTab === 'function') window.switchTab('pricing');
      else {
        const target = document.getElementById('page-pricing') || document.querySelector('[data-page="pricing"]');
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  async function openDashboard() {
    ensureDashboardMarkup();
    const u = window.currentUserData;
    const user = window.auth.currentUser;
    if (!u || !user) {
      console.warn(`[sd-account:${APP_KEY}] openDashboard called before user data loaded.`);
      return;
    }

    const displayName = u.name || user.displayName || 'User';
    const avatarEl = document.getElementById('sd-md-avatar');
    if (user.photoURL) {
      avatarEl.outerHTML = `<img class="sd-md-avatar" id="sd-md-avatar" src="${user.photoURL}" alt="" />`;
    } else {
      const initial = displayName.charAt(0).toUpperCase();
      avatarEl.outerHTML = `<div class="sd-md-avatar" id="sd-md-avatar">${initial}</div>`;
    }
    document.getElementById('sd-md-user-name').textContent  = displayName;
    document.getElementById('sd-md-user-email').textContent = u.email || user.email || '';

    const hasPlan = !!u.plan;
    const used = hasPlan ? (u.creditsUsed || 0) : (u.demoUsed || 0);
    const total = hasPlan ? (u.creditsTotal || 0) : DEMO_LIMIT;
    const remaining = hasPlan ? (u.creditsRemaining || 0) : Math.max(0, DEMO_LIMIT - (u.demoUsed || 0));

    document.getElementById('sd-md-plan-name').textContent = u.planLabel || (hasPlan ? 'Active Plan' : 'Free Demo');
    document.getElementById('sd-md-plan-sub').textContent  = hasPlan
      ? `${remaining} ${remaining === 1 ? RESOURCE : RESOURCE_PLURAL} remaining`
      : `${remaining} free demo${remaining === 1 ? '' : 's'} included`;
    const badgeEl = document.getElementById('sd-md-plan-badge');
    badgeEl.textContent = hasPlan ? 'ACTIVE' : 'DEMO';
    badgeEl.style.background = hasPlan ? '#059669' : '#f59e0b';

    document.getElementById('sd-md-stat-used').textContent      = used;
    document.getElementById('sd-md-stat-remaining').textContent = remaining;
    document.getElementById('sd-md-stat-total').textContent     = total;

    const fill = total > 0 ? Math.round((used / total) * 100) : 0;
    const bar = document.getElementById('sd-md-usage-bar');
    bar.style.width = `${Math.min(fill, 100)}%`;
    bar.style.background = fill >= 90 ? '#dc2626' : fill >= 60 ? '#f59e0b' : '#2563eb';
    document.getElementById('sd-md-usage-label').textContent = `${used} / ${total}`;

    const cta = document.getElementById('sd-md-cta-btn');
    cta.textContent = hasPlan && remaining > 0 ? `Buy More ${RESOURCE_PLURAL} →` : 'View Plans & Pricing →';

    await loadRecentHistory();
    document.getElementById('sd-mini-dashboard').classList.add('open');
    document.getElementById('sd-dashboard-overlay').classList.add('open');
  }

  function closeDashboard() {
    const panel = document.getElementById('sd-mini-dashboard');
    const overlay = document.getElementById('sd-dashboard-overlay');
    if (panel)   panel.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
  }

  // ----------------------------------------------------------------
  // Header credits badge
  // ----------------------------------------------------------------
  function updateCreditsDisplay() {
    const badge = document.getElementById('creditsBadge');
    if (!badge) return;
    const u = window.currentUserData;
    if (!u) return;

    const remaining = u.creditsRemaining || 0;
    const hasPlan = !!u.plan;
    const demoUsed = u.demoUsed || 0;

    const demoLeft = Math.max(0, DEMO_LIMIT - demoUsed);
    if (hasPlan && remaining > 0) {
      badge.textContent      = `${remaining} ${remaining === 1 ? RESOURCE : RESOURCE_PLURAL} left`;
      badge.style.background = '#2563eb';
    } else if (hasPlan && remaining <= 0) {
      badge.textContent      = 'Credits used';
      badge.style.background = '#dc2626';
    } else if (demoLeft > 0) {
      badge.textContent      = `${demoLeft} free demo${demoLeft === 1 ? '' : 's'}`;
      badge.style.background = '#f59e0b';
    } else {
      badge.textContent      = 'Demo used — Buy plan';
      badge.style.background = '#dc2626';
    }
    badge.style.color = '#fff';
  }

  // ----------------------------------------------------------------
  // Auth flows
  // ----------------------------------------------------------------
  async function signInWithGoogle() {
    const errEl = document.getElementById('loginError') || document.getElementById('regError');
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await window.auth.signInWithPopup(provider);
      await loadOrCreateUser(result.user);
      updateAuthUI(result.user);
      closeAuthModal();
      runPendingGenerate();
    } catch (err) {
      console.error('Google sign-in error:', err);
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') return;
      if (errEl) errEl.textContent = err.message || 'Google sign-in failed.';
    }
  }

  async function registerWithEmail({ name, email, password }) {
    if (!name || !email || !password) throw new Error('All fields are required.');
    if (password.length < 6) throw new Error('Password must be at least 6 characters.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Invalid email format.');
    try {
      const cred = await window.auth.createUserWithEmailAndPassword(email, password);
      await cred.user.updateProfile({ displayName: name });
      await loadOrCreateUser(cred.user);
      // Patch the name in case loadOrCreateUser captured an older snapshot
      if (window.currentUserData) window.currentUserData.name = name;
      const ref = window.db.collection('users').doc(cred.user.uid);
      await ref.update({ name }).catch(() => {});
      updateAuthUI(cred.user);
      closeAuthModal();
      runPendingGenerate();
      return cred.user;
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        throw new Error('An account with this email already exists. Please sign in.');
      }
      throw err;
    }
  }

  async function loginWithEmail(email, password) {
    if (!email || !password) throw new Error('Enter email and password.');
    try {
      const cred = await window.auth.signInWithEmailAndPassword(email, password);
      await loadOrCreateUser(cred.user);
      updateAuthUI(cred.user);
      closeAuthModal();
      runPendingGenerate();
      return cred.user;
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-login-credentials') {
        throw new Error('Invalid email or password. Please check and try again.');
      }
      if (err.code === 'auth/wrong-password')    throw new Error('Wrong password. Please try again.');
      if (err.code === 'auth/too-many-requests') throw new Error('Too many attempts. Please try again later.');
      throw err;
    }
  }

  function runPendingGenerate() {
    if (window[PENDING_FLAG]) {
      window[PENDING_FLAG] = false;
      if (PENDING_FN && typeof window[PENDING_FN] === 'function') {
        try { window[PENDING_FN](); } catch (e) { console.error(e); }
      }
    }
  }

  function signOutUser() {
    window.auth.signOut().then(() => {
      window.currentUserData = null;
      updateAuthUI(null);
      callPostHook();
    });
  }

  // ----------------------------------------------------------------
  // Auth modal helpers (the same DOM structure all apps already use)
  // ----------------------------------------------------------------
  function openAuthModal(mode) {
    const modal = document.getElementById('authModal');
    if (!modal) return;
    showAuthTab(mode || 'login');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
  function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (!modal) return;
    modal.style.display = 'none';
    document.body.style.overflow = '';
    ['regName', 'regEmail', 'regPhone', 'regPassword', 'loginIdentifier', 'loginEmail', 'loginPassword'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    document.querySelectorAll('.auth-error, .auth-success').forEach((el) => { el.textContent = ''; });
  }
  function showAuthTab(tab) {
    document.querySelectorAll('.auth-tab-btn').forEach((b) => b.classList.remove('active'));
    document.querySelectorAll('.auth-form-panel').forEach((p) => p.classList.remove('active'));
    document.getElementById('authTab-' + tab)?.classList.add('active');
    document.getElementById('authPanel-' + tab)?.classList.add('active');
  }
  function togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.type = input.type === 'password' ? 'text' : 'password';
    btn.textContent = input.type === 'password' ? 'Show' : 'Hide';
  }

  async function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('regName')?.value.trim();
    const email = document.getElementById('regEmail')?.value.trim();
    const password = document.getElementById('regPassword')?.value;
    const errorEl = document.getElementById('regError');
    const succEl = document.getElementById('regSuccess');
    if (errorEl) errorEl.textContent = '';
    if (succEl)  succEl.textContent  = '';
    try {
      await registerWithEmail({ name, email, password });
      if (succEl) succEl.textContent = 'Account created!';
    } catch (err) {
      if (errorEl) errorEl.textContent = err.message;
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    const email = (document.getElementById('loginEmail') || document.getElementById('loginIdentifier'))?.value.trim();
    const password = document.getElementById('loginPassword')?.value;
    const errorEl = document.getElementById('loginError');
    if (errorEl) errorEl.textContent = '';
    try {
      await loginWithEmail(email, password);
    } catch (err) {
      if (errorEl) errorEl.textContent = err.message;
    }
  }

  function authModalOverlayClick(event) {
    if (event.target === document.getElementById('authModal')) closeAuthModal();
  }

  function toggleUserMenu() {
    // Legacy hook — older HTML may still call this. Open the dashboard.
    openDashboard();
  }

  // ----------------------------------------------------------------
  // Header user / auth UI
  // ----------------------------------------------------------------
  function updateAuthUI(user) {
    const authBtns = document.getElementById('authButtonsGroup');
    const userPanel = document.getElementById('userPanel');
    const userName = document.getElementById('userName');

    if (user) {
      if (authBtns) authBtns.style.display = 'none';
      if (userPanel) userPanel.style.display = 'flex';

      const displayName = (window.currentUserData?.name || user.displayName || 'User').split(' ')[0];
      if (userName) userName.textContent = displayName;

      const userAvatar = document.getElementById('userAvatar');
      if (userAvatar) {
        if (user.photoURL) {
          userAvatar.outerHTML = `<img class="user-avatar" id="userAvatar" src="${user.photoURL}" alt="avatar" />`;
        } else {
          const initial = displayName.charAt(0).toUpperCase();
          userAvatar.outerHTML = `<div class="user-avatar" id="userAvatar">${initial}</div>`;
        }
      }
    } else {
      if (authBtns) authBtns.style.display = 'flex';
      if (userPanel) userPanel.style.display = 'none';
    }
    updateCreditsDisplay();
  }

  // ----------------------------------------------------------------
  // Auth state listener
  // ----------------------------------------------------------------
  window.auth.onAuthStateChanged(async (user) => {
    if (user) {
      await loadOrCreateUser(user);
      updateAuthUI(user);
    } else {
      window.currentUserData = null;
      updateAuthUI(null);
    }
    callPostHook();
  });

  // ----------------------------------------------------------------
  // Expose API on window (with per-app aliases from config)
  // ----------------------------------------------------------------
  window.applyPlanToUser     = applyPlanToUser;
  window.incrementDemoUsed   = incrementDemoUsed;
  window.releaseDemoUse      = releaseDemoUse;
  window.signOutUser         = signOutUser;
  window.signInWithGoogle    = signInWithGoogle;
  window.registerWithEmail   = registerWithEmail;
  window.loginWithEmail      = loginWithEmail;
  window.openAuthModal       = openAuthModal;
  window.closeAuthModal      = closeAuthModal;
  window.showAuthTab         = showAuthTab;
  window.togglePasswordVisibility = togglePasswordVisibility;
  window.handleRegister      = handleRegister;
  window.handleLogin         = handleLogin;
  window.authModalOverlayClick = authModalOverlayClick;
  window.updateAuthUI        = updateAuthUI;
  window.updateCreditsDisplay = updateCreditsDisplay;
  window.toggleUserMenu      = toggleUserMenu;
  window.openDashboard       = openDashboard;
  window.closeDashboard      = closeDashboard;

  // Generic credit functions
  window.reserveCredit = reserveCredit;
  window.releaseCredit = releaseCredit;
  window.saveHistory   = saveHistory;

  // Per-app aliases (so existing app.js code keeps working)
  if (SD.reserveFnName)     window[SD.reserveFnName]     = reserveCredit;
  if (SD.releaseFnName)     window[SD.releaseFnName]     = releaseCredit;
  if (SD.saveHistoryFnName) window[SD.saveHistoryFnName] = saveHistory;
})();

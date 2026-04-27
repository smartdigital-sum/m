// ================================================================
// Smart Digital ExamCraft — Auth & Firestore Logic
// ================================================================

window.currentUserData = null;

function normalizePhoneNumber(phone) {
  const compact = String(phone || '').trim().replace(/[\s()-]/g, '');
  const digits = compact.replace(/\D/g, '');

  if (/^[6-9]\d{9}$/.test(digits)) {
    return `+91${digits}`;
  }
  if (/^0[6-9]\d{9}$/.test(digits)) {
    return `+91${digits.slice(1)}`;
  }
  if (/^91[6-9]\d{9}$/.test(digits)) {
    return `+${digits}`;
  }
  if (/^\+[1-9]\d{1,14}$/.test(compact)) {
    return `+${digits}`;
  }
  if (/^[1-9]\d{1,14}$/.test(digits)) {
    return `+${digits}`;
  }

  return '';
}

function getPhoneLookupCandidates(phone) {
  const normalizedPhone = normalizePhoneNumber(phone);
  const rawPhone = String(phone || '').trim();
  const compactPhone = rawPhone.replace(/[\s()-]/g, '');
  const candidates = [];
  const seen = new Set();

  const addCandidate = (field, value) => {
    if (!value) return;
    const key = `${field}:${value}`;
    if (seen.has(key)) return;
    seen.add(key);
    candidates.push({ field, value });
  };

  addCandidate('phoneNormalized', normalizedPhone);
  addCandidate('phone', rawPhone);
  addCandidate('phone', compactPhone);

  if (normalizedPhone) {
    addCandidate('phone', normalizedPhone);
    addCandidate('phone', normalizedPhone.slice(1));

    if (normalizedPhone.startsWith('+91') && normalizedPhone.length === 13) {
      addCandidate('phone', normalizedPhone.slice(3));
      addCandidate('phone', `0${normalizedPhone.slice(3)}`);
    }
  }

  return { normalizedPhone, candidates };
}

async function findUserDocByPhone(phone) {
  const { candidates } = getPhoneLookupCandidates(phone);

  for (const candidate of candidates) {
    const snap = await window.db.collection('users')
      .where(candidate.field, '==', candidate.value)
      .limit(2)
      .get();

    if (snap.size > 1) {
      throw new Error("Multiple accounts are linked to this phone number. Please contact support.");
    }
    if (!snap.empty) {
      return snap.docs[0];
    }
  }

  return null;
}

// ================================================================
// REGISTRATION — Email, Name, Phone, Password
// ================================================================
async function registerWithEmail(data) {
  const { name, email, phone, password } = data;
  const normalizedPhone = normalizePhoneNumber(phone);

  // Validate inputs
  if (!name || !email || !phone || !password) {
    throw new Error("All fields are required.");
  }
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Invalid email format.");
  }
  if (!normalizedPhone) {
    throw new Error("Invalid phone number. Use 10-digit Indian number or E.164 format.");
  }

  try {
    const existingPhoneDoc = await findUserDocByPhone(phone);
    if (existingPhoneDoc) {
      throw new Error("An account with this phone number already exists. Please sign in instead.");
    }

    // Create user with email and password
    const userCredential = await window.auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Update display name
    await user.updateProfile({ displayName: name });

    // Check if user doc already exists (from a previous attempt)
    const userRef = window.db.collection('users').doc(user.uid);
    const snap = await userRef.get();
    if (!snap.exists) {
      // Create Firestore document
      await userRef.set({
        uid:             user.uid,
        name:            name,
        email:           email,
        phone:           normalizedPhone,
        phoneNormalized: normalizedPhone,
        photo:           user.photoURL || '',
        authMethod:      'email',
        plan:            null,
        planLabel:       null,
        papersTotal:     0,
        papersUsed:      0,
        papersRemaining: 0,
        demoUsed:        0,
        includesAnswers: false,
        purchasedOn:     null,
        expiresOn:       null,
        createdAt:       firebase.firestore.FieldValue.serverTimestamp()
      });
    }

    window.currentUserData = {
      uid: user.uid,
      name, email, phone: normalizedPhone, phoneNormalized: normalizedPhone,
      photo: '',
      plan: null, planLabel: null,
      papersTotal: 0, papersUsed: 0, papersRemaining: 0,
      demoUsed: 0, includesAnswers: false,
      purchasedOn: null, expiresOn: null
    };

    updateCreditsDisplay();
    updateAuthUI(user);
    closeAuthModal();
    return user;
  } catch (err) {
    console.error("Registration error:", err);
    throw err;
  }
}

// ================================================================
// LOGIN — Email or Phone + Password
// ================================================================
async function loginWithPhoneOrEmail(identifier, password) {
  // identifier can be an email or a phone number
  if (!identifier || !password) {
    throw new Error("Enter email/phone and password.");
  }

  try {
    let isPhone = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

    if (isPhone) {
      const normalizedIdentifier = normalizePhoneNumber(identifier);
      if (!normalizedIdentifier) {
        throw new Error("Invalid phone number. Use 10-digit Indian number or E.164 format.");
      }

      // --- PHONE LOGIN: query Firestore using normalized and legacy phone formats ---
      const userDocSnap = await findUserDocByPhone(identifier);
      if (!userDocSnap) {
        throw new Error("No account found with this phone number.");
      }

      const userDoc = userDocSnap.data();
      const userEmail = userDoc.email;

      if (!userEmail) {
        throw new Error("Account linked to this phone has no email for password login.");
      }

      // Sign in with the email & password from Firestore
      const userCredential = await window.auth.signInWithEmailAndPassword(userEmail, password);
      await setLoginSession(userCredential.user, normalizedIdentifier, 'email');
      return userCredential.user;

    } else {
      // --- EMAIL LOGIN ---
      const userCredential = await window.auth.signInWithEmailAndPassword(identifier, password);
      await setLoginSession(userCredential.user, identifier, 'email');
      return userCredential.user;
    }
  } catch (err) {
    console.error("Login error:", err);
    // Provide friendly messages
    if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-login-credentials') {
      throw new Error("Invalid credentials. Please check your email/phone and password.");
    }
    if (err.code === 'auth/wrong-password') {
      throw new Error("Wrong password. Please try again.");
    }
    if (err.code === 'auth/too-many-requests') {
      throw new Error("Too many attempts. Please try again later.");
    }
    throw err;
  }
}

// Helper: After successful email/password sign in, sync Firestore and update UI
async function setLoginSession(user, identifier, method) {
  await loadOrCreateUser(user);
  updateAuthUI(user);
  closeAuthModal();
}

// ================================================================
// GOOGLE SIGN-IN
// ================================================================
async function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('email');
  provider.addScope('profile');

  try {
    const result = await window.auth.signInWithPopup(provider);
    const user   = result.user;
    await loadOrCreateUser(user);
    updateAuthUI(user);
    closeAuthModal();
  } catch (err) {
    console.error('Google sign-in error:', err);
    if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
      return; // User simply closed the popup — no toast needed
    }
    if (err.code === 'auth/unauthorized-domain') {
      showToast('This domain is not authorised. Please contact support.', 'error');
    } else {
      showToast('Google sign-in failed. Please try again.', 'error');
    }
  }
}


// ================================================================
// SIGN OUT
// ================================================================
function signOutUser() {
  window.auth.signOut().then(() => {
    window.currentUserData = null;
    updateAuthUI(null);
  });
}

// ================================================================
// AUTH STATE LISTENER
// ================================================================
window.auth.onAuthStateChanged(async (user) => {
  if (user) {
    await loadOrCreateUser(user);
    updateAuthUI(user);
  } else {
    window.currentUserData = null;
    updateAuthUI(null);
  }
});

// ================================================================
// LOAD OR CREATE USER IN FIRESTORE
// ================================================================
async function loadOrCreateUser(user) {
  try {
    const ref  = window.db.collection('users').doc(user.uid);
    const snap = await ref.get();

    if (!snap.exists) {
      const newUser = {
        uid:             user.uid,
        name:            user.displayName || '',
        email:           user.email || '',
        phone:           '',
        phoneNormalized: '',
        photo:           user.photoURL  || '',
        authMethod:      user.providerData?.[0]?.providerId === 'google.com' ? 'google' : 'email',
        plan:            null,
        planLabel:       null,
        papersTotal:     0,
        papersUsed:      0,
        papersRemaining: 0,
        demoUsed:        0,
        includesAnswers: false,
        purchasedOn:     null,
        expiresOn:       null,
        createdAt:       firebase.firestore.FieldValue.serverTimestamp()
      };
      await ref.set(newUser);
      window.currentUserData = newUser;
    } else {
      window.currentUserData = snap.data();
      // Ensure auth method is set
      if (!window.currentUserData.authMethod) {
        window.currentUserData.authMethod = user.providerData?.[0]?.providerId === 'google.com' ? 'google' : 'email';
      }

      const normalizedPhone = normalizePhoneNumber(window.currentUserData.phone);
      if (normalizedPhone && window.currentUserData.phoneNormalized !== normalizedPhone) {
        await ref.update({ phoneNormalized: normalizedPhone });
        window.currentUserData.phoneNormalized = normalizedPhone;
      }
    }

    updateCreditsDisplay();
  } catch (err) {
    console.error("Firestore load error:", err);
  }
}

// ================================================================
// APPLY PLAN AFTER PAYMENT
// ================================================================
async function applyPlanToUser(planInfo) {
  if (!window.auth.currentUser) return;
  try {
    const ref    = window.db.collection('users').doc(window.auth.currentUser.uid);
    const papers = typeof planInfo.papers === 'number' ? planInfo.papers : 9999;

    const update = {
      plan:            planInfo.planId,
      planLabel:       planInfo.optionLabel,
      papersTotal:     papers,
      papersRemaining: papers,
      includesAnswers: planInfo.includesAnswers,
      purchasedOn:     new Date().toISOString(),
      expiresOn:       planInfo.expiresOn || null
    };

    await ref.update(update);
    window.currentUserData = { ...window.currentUserData, ...update };
    updateCreditsDisplay();
  } catch (err) {
    console.error("Firestore applyPlan error:", err);
  }
}

async function upgradeCurrentPlanAnswers() {
  if (!window.auth.currentUser || !window.currentUserData?.plan) return;
  try {
    const ref = window.db.collection('users').doc(window.auth.currentUser.uid);
    const update = { includesAnswers: true };

    await ref.update(update);
    window.currentUserData = { ...window.currentUserData, ...update };
    updateCreditsDisplay();
  } catch (err) {
    console.error("Firestore answer-upgrade error:", err);
  }
}

// ================================================================
// CREDIT RESERVATION + HISTORY
// ================================================================
async function reservePaperCredit() {
  if (!window.auth.currentUser || !window.currentUserData?.plan) return { reserved: false };

  try {
    const ref = window.db.collection('users').doc(window.auth.currentUser.uid);
    let nextUserData = null;

    await window.db.runTransaction(async (transaction) => {
      const snap = await transaction.get(ref);
      if (!snap.exists) {
        const err = new Error("User profile not found.");
        err.code = 'examcraft/missing-user';
        throw err;
      }

      const userData = snap.data();
      const isUnlimited = userData.papersTotal === 9999;
      const papersUsed = userData.papersUsed || 0;
      const papersRemaining = userData.papersRemaining || 0;

      if (!isUnlimited && papersRemaining <= 0) {
        const err = new Error("No paper credits remaining.");
        err.code = 'examcraft/no-credits';
        throw err;
      }

      nextUserData = {
        papersUsed: papersUsed + 1
      };

      if (!isUnlimited) {
        nextUserData.papersRemaining = papersRemaining - 1;
      }

      transaction.update(ref, nextUserData);
    });

    if (nextUserData && window.currentUserData) {
      window.currentUserData = { ...window.currentUserData, ...nextUserData };
      updateCreditsDisplay();
    }

    return { reserved: true };
  } catch (err) {
    if (err.code !== 'examcraft/no-credits') {
      console.error("Firestore credit reservation error:", err);
    }
    throw err;
  }
}

async function releaseReservedPaperCredit() {
  if (!window.auth.currentUser || !window.currentUserData?.plan) return;

  try {
    const ref = window.db.collection('users').doc(window.auth.currentUser.uid);
    let nextUserData = null;

    await window.db.runTransaction(async (transaction) => {
      const snap = await transaction.get(ref);
      if (!snap.exists) return;

      const userData = snap.data();
      const isUnlimited = userData.papersTotal === 9999;
      const papersUsed = userData.papersUsed || 0;
      const papersRemaining = userData.papersRemaining || 0;

      nextUserData = {
        papersUsed: Math.max(0, papersUsed - 1)
      };

      if (!isUnlimited) {
        nextUserData.papersRemaining = papersRemaining + 1;
      }

      transaction.update(ref, nextUserData);
    });

    if (nextUserData && window.currentUserData) {
      window.currentUserData = { ...window.currentUserData, ...nextUserData };
      updateCreditsDisplay();
    }
  } catch (err) {
    console.error("Firestore credit release error:", err);
  }
}

async function saveGeneratedPaperHistory(meta) {
  if (!window.auth.currentUser || !window.currentUserData?.plan) return;

  try {
    const ref = window.db.collection('users').doc(window.auth.currentUser.uid);
    await ref.collection('history').add({
      date:        new Date().toISOString(),
      board:       meta.board,
      class:       meta.cls,
      subject:     meta.subject,
      topic:       meta.topic,
      withAnswers: meta.withAnswers || false
    });
  } catch (err) {
    console.error("Firestore history save error:", err);
  }
}

// ================================================================
// INCREMENT DEMO USAGE
// ================================================================
async function incrementDemoUsed() {
  if (!window.auth.currentUser) return;
  try {
    const ref = window.db.collection('users').doc(window.auth.currentUser.uid);
    await ref.update({ demoUsed: firebase.firestore.FieldValue.increment(1) });
    if (window.currentUserData) {
      window.currentUserData.demoUsed = (window.currentUserData.demoUsed || 0) + 1;
    }
    updateCreditsDisplay();
  } catch (err) {
    console.error("Firestore incrementDemo error:", err);
  }
}

// ================================================================
// UPDATE CREDITS BADGE
// ================================================================
function updateCreditsDisplay() {
  const badge = document.getElementById('creditsBadge');
  if (!badge) return;

  const u = window.currentUserData;
  if (!u) return;

  if (u.plan) {
    if (u.papersTotal === 9999) {
      badge.textContent      = '∞ Unlimited';
      badge.style.background = '#059669';
    } else {
      badge.textContent      = `${u.papersRemaining} / ${u.papersTotal} left`;
      badge.style.background = u.papersRemaining > 0 ? '#2563EB' : '#dc2626';
    }
    return;
  }

  const demoLeft = 2 - (u.demoUsed || 0);
  if (demoLeft > 0) {
    badge.textContent      = `${demoLeft} free demo${demoLeft > 1 ? 's' : ''} left`;
    badge.style.background = '#f59e0b';
  } else {
    badge.textContent      = 'Demo used — Buy plan';
    badge.style.background = '#dc2626';
  }
}

// ================================================================
// MINI DASHBOARD
// ================================================================
async function openDashboard() {
  const u = window.currentUserData;
  const user = window.auth.currentUser;
  if (!u || !user) return;

  const displayName = u.name || user.displayName || 'User';
  const avatarEl = document.getElementById('md-avatar');

  if (user.photoURL) {
    avatarEl.outerHTML = `<img class="md-avatar" id="md-avatar" src="${user.photoURL}" alt="" />`;
  } else {
    const initial = displayName.charAt(0).toUpperCase();
    avatarEl.outerHTML = `<div class="md-avatar" id="md-avatar">${initial}</div>`;
  }

  document.getElementById('md-user-name').textContent  = displayName;
  document.getElementById('md-user-email').textContent = u.email || user.email || '';

  // Phone field
  const phoneEl = document.getElementById('md-user-phone');
  if (phoneEl) phoneEl.textContent = u.phone ? '📞 ' + u.phone : '';

  const hasPlan     = !!u.plan;
  const isUnlimited = u.papersTotal === 9999;
  const planName    = u.planLabel || 'Free Demo';
  const planIcon    = !hasPlan ? '🎟️' : u.plan === 'school' ? '🏫' : u.plan === 'group' ? '👥' : '👤';
  const planBadge   = hasPlan ? 'ACTIVE' : 'DEMO';
  const planSub     = hasPlan
    ? `${isUnlimited ? 'Legacy unlimited plan' : `${u.papersRemaining || 0} credits remaining`} · ${u.includesAnswers ? 'Answers included' : 'Question-only pack'}`
    : '2 free demo papers included';

  document.getElementById('md-plan-icon').textContent  = planIcon;
  document.getElementById('md-plan-name').textContent  = planName;
  document.getElementById('md-plan-sub').textContent   = planSub;
  document.getElementById('md-plan-badge').textContent = planBadge;
  document.getElementById('md-plan-badge').style.background = hasPlan ? '#059669' : '#f59e0b';

  let used, remaining, total;
  if (!hasPlan) {
    used      = u.demoUsed || 0;
    remaining = Math.max(0, 2 - used);
    total     = 2;
  } else if (isUnlimited) {
    used      = u.papersUsed || 0;
    remaining = '∞';
    total     = '∞';
  } else {
    used      = u.papersUsed || 0;
    remaining = u.papersRemaining || 0;
    total     = u.papersTotal || 0;
  }

  document.getElementById('md-stat-used').textContent      = used;
  document.getElementById('md-stat-remaining').textContent = remaining;
  document.getElementById('md-stat-total').textContent     = total;

  const fill = isUnlimited ? 40
    : !hasPlan ? Math.round(((u.demoUsed || 0) / 2) * 100)
    : total > 0 ? Math.round((used / total) * 100) : 0;
  document.getElementById('md-usage-bar').style.width   = `${Math.min(fill, 100)}%`;
  document.getElementById('md-usage-bar').style.background = fill >= 90 ? '#dc2626' : fill >= 60 ? '#f59e0b' : '#2563EB';
  document.getElementById('md-usage-label').textContent = isUnlimited ? `${used} generated` : `${used} of ${total} used`;

  const ctaBtn = document.getElementById('md-cta-btn');
  if (hasPlan && (isUnlimited || remaining > 0)) {
    ctaBtn.textContent = 'Buy More Papers →';
  } else {
    ctaBtn.textContent = 'View Plans & Pricing →';
  }

  await loadRecentHistory();
  document.getElementById('miniDashboard').classList.add('open');
  document.getElementById('dashboardOverlay').classList.add('open');
}

function closeDashboard() {
  document.getElementById('miniDashboard').classList.remove('open');
  document.getElementById('dashboardOverlay').classList.remove('open');
}

async function loadRecentHistory() {
  const listEl = document.getElementById('md-history-list');
  listEl.innerHTML = '<div class="md-history-empty">Loading...</div>';
  try {
    const snap = await window.db
      .collection('users')
      .doc(window.auth.currentUser.uid)
      .collection('history')
      .orderBy('date', 'desc')
      .limit(5)
      .get();

    if (snap.empty) {
      listEl.innerHTML = '<div class="md-history-empty">No papers generated yet.</div>';
      return;
    }
    listEl.innerHTML = snap.docs.map(doc => {
      const d = doc.data();
      const date = d.date ? new Date(d.date).toLocaleDateString('en-IN', { day:'2-digit', month:'short' }) : '—';
      return `<div class="md-history-item">
        <span class="md-hi-dot"></span>
        <div class="md-hi-info">
          <span class="md-hi-subject">${d.subject || '—'} — ${d.class || d.cls || '—'}</span>
          <span class="md-hi-meta">${d.board || '—'} · ${date}${d.withAnswers ? ' · ✅ Ans' : ''}</span>
        </div>
      </div>`;
    }).join('');
  } catch (err) {
    listEl.innerHTML = '<div class="md-history-empty">Could not load history.</div>';
  }
}

// ================================================================
// AUTH MODAL UI HELPERS
// ================================================================
function openAuthModal(mode) {
  const modal = document.getElementById('authModal');
  if (modal) {
    showAuthTab(mode || 'login');
    modal.classList.add('open');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.classList.remove('open');
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
  // Clear form fields
  const regName = document.getElementById('regName');
  const regEmail = document.getElementById('regEmail');
  const regPhone = document.getElementById('regPhone');
  const regPass = document.getElementById('regPassword');
  const loginIdentifier = document.getElementById('loginIdentifier');
  const loginPass = document.getElementById('loginPassword');
  if (regName) regName.value = '';
  if (regEmail) regEmail.value = '';
  if (regPhone) regPhone.value = '';
  if (regPass) regPass.value = '';
  if (loginIdentifier) loginIdentifier.value = '';
  if (loginPass) loginPass.value = '';
}

function showAuthTab(tab) {
  document.querySelectorAll('.auth-tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.auth-form-panel').forEach(panel => panel.classList.remove('active'));

  const tabBtn = document.getElementById('authTab-' + tab);
  const panel  = document.getElementById('authPanel-' + tab);
  if (tabBtn) tabBtn.classList.add('active');
  if (panel)  panel.classList.add('active');
}

function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input) {
    if (input.type === 'password') {
      input.type = 'text';
      btn.textContent = 'Hide';
    } else {
      input.type = 'password';
      btn.textContent = 'Show';
    }
  }
}

async function handleRegister(event) {
  event.preventDefault();
  const name     = document.getElementById('regName').value.trim();
  const email    = document.getElementById('regEmail').value.trim();
  const phone    = document.getElementById('regPhone').value.trim();
  const password = document.getElementById('regPassword').value;
  const errorEl  = document.getElementById('regError');
  const successEl = document.getElementById('regSuccess');

  if (errorEl) errorEl.textContent = '';
  if (successEl) successEl.textContent = '';

  try {
    await registerWithEmail({ name, email, phone, password });
    if (successEl) successEl.textContent = 'Account created successfully!';
  } catch (err) {
    if (errorEl) errorEl.textContent = err.message;
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const identifier = document.getElementById('loginIdentifier').value.trim();
  const password   = document.getElementById('loginPassword').value;
  const errorEl    = document.getElementById('loginError');

  if (errorEl) errorEl.textContent = '';

  try {
    await loginWithPhoneOrEmail(identifier, password);
  } catch (err) {
    if (errorEl) errorEl.textContent = err.message;
  }
}

// ================================================================
// UPDATE AUTH UI (header)
// ================================================================
function updateAuthUI(user) {
  const authBtns   = document.getElementById('authButtonsGroup');
  const userPanel  = document.getElementById('userPanel');
  const userAvatar = document.getElementById('userAvatar');
  const userName   = document.getElementById('userName');

  if (user) {
    if (authBtns)  authBtns.style.display   = 'none';
    if (userPanel) userPanel.style.display  = 'flex';
    const displayName = (window.currentUserData?.name || user.displayName || 'User').split(' ')[0];
    if (userName)   userName.textContent = displayName;

    // Avatar: use photoURL if available, otherwise show first initial
    if (userAvatar) {
      if (user.photoURL) {
        userAvatar.outerHTML = `<img class="user-avatar" id="userAvatar" src="${user.photoURL}" alt="avatar" />`;
      } else {
        const initial = displayName.charAt(0).toUpperCase();
        userAvatar.outerHTML = `<div class="user-avatar" id="userAvatar">${initial}</div>`;
      }
    }
  } else {
    if (authBtns)  authBtns.style.display   = 'flex';
    if (userPanel) userPanel.style.display  = 'none';
  }
  updateCreditsDisplay();
}

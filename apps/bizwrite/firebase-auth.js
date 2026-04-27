// ================================================================
// Smart Digital BizWrite — Auth & Firestore Logic
// ================================================================
// Firestore collection: 'bizwriteUsers'
// User schema: { uid, name, email, photo, authMethod, plan,
//   planLabel, kitsTotal, kitsUsed, kitsRemaining,
//   demoUsed, purchasedOn, createdAt }
// ================================================================

window.currentUserData = null;

async function signInWithGoogle() {
  const errEl = document.getElementById('loginError') || document.getElementById('regError');
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await window.auth.signInWithPopup(provider);
    await loadOrCreateBizwriteUser(result.user);
    updateAuthUI(result.user);
    closeAuthModal();
    if (window._pendingGenerate) {
      window._pendingGenerate = false;
      generateDescriptions();
    }
  } catch (err) {
    console.error('Google sign-in error:', err);
    if (errEl) errEl.textContent = err.message;
  }
}

async function registerWithEmail(data) {
  const { name, email, password } = data;

  if (!name || !email || !password) throw new Error('All fields are required.');
  if (password.length < 6) throw new Error('Password must be at least 6 characters.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Invalid email format.');

  try {
    const cred = await window.auth.createUserWithEmailAndPassword(email, password);
    const user = cred.user;
    await user.updateProfile({ displayName: name });

    const ref = window.db.collection('bizwriteUsers').doc(user.uid);
    const snap = await ref.get();
    if (!snap.exists) {
      await ref.set({
        uid: user.uid,
        name,
        email,
        photo: '',
        authMethod: 'email',
        plan: null,
        planLabel: null,
        kitsTotal: 0,
        kitsUsed: 0,
        kitsRemaining: 0,
        demoUsed: 0,
        purchasedOn: null,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    }

    window.currentUserData = {
      uid: user.uid,
      name,
      email,
      photo: '',
      authMethod: 'email',
      plan: null,
      planLabel: null,
      kitsTotal: 0,
      kitsUsed: 0,
      kitsRemaining: 0,
      demoUsed: 0
    };

    updateCreditsDisplay();
    updateAuthUI(user);
    closeAuthModal();

    if (window._pendingGenerate) {
      window._pendingGenerate = false;
      generateDescriptions();
    }
    return user;
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
    await loadOrCreateBizwriteUser(cred.user);
    updateAuthUI(cred.user);
    closeAuthModal();

    if (window._pendingGenerate) {
      window._pendingGenerate = false;
      generateDescriptions();
    }
    return cred.user;
  } catch (err) {
    if (
      err.code === 'auth/user-not-found' ||
      err.code === 'auth/invalid-credential' ||
      err.code === 'auth/invalid-login-credentials'
    ) {
      throw new Error('Invalid email or password. Please check and try again.');
    }
    if (err.code === 'auth/wrong-password') throw new Error('Wrong password. Please try again.');
    if (err.code === 'auth/too-many-requests') throw new Error('Too many attempts. Please try again later.');
    throw err;
  }
}

function signOutUser() {
  window.auth.signOut().then(() => {
    window.currentUserData = null;
    updateAuthUI(null);
    if (typeof updateGenerateButton === 'function') updateGenerateButton();
  });
}

window.auth.onAuthStateChanged(async (user) => {
  if (user) {
    await loadOrCreateBizwriteUser(user);
    updateAuthUI(user);
  } else {
    window.currentUserData = null;
    updateAuthUI(null);
  }
  if (typeof updateGenerateButton === 'function') updateGenerateButton();
});

async function loadOrCreateBizwriteUser(user) {
  try {
    const ref = window.db.collection('bizwriteUsers').doc(user.uid);
    const snap = await ref.get();

    if (!snap.exists) {
      const newUser = {
        uid: user.uid,
        name: user.displayName || '',
        email: user.email || '',
        photo: user.photoURL || '',
        authMethod: user.providerData?.[0]?.providerId === 'google.com' ? 'google' : 'email',
        plan: null,
        planLabel: null,
        kitsTotal: 0,
        kitsUsed: 0,
        kitsRemaining: 0,
        demoUsed: 0,
        purchasedOn: null,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      };
      await ref.set(newUser);
      window.currentUserData = newUser;
    } else {
      window.currentUserData = snap.data();
    }
    updateCreditsDisplay();
  } catch (err) {
    console.error('Firestore load error:', err);
  }
}

async function applyPlanToUser(planInfo) {
  if (!window.auth.currentUser) return;
  try {
    const ref = window.db.collection('bizwriteUsers').doc(window.auth.currentUser.uid);
    await ref.update({
      plan: planInfo.planId,
      planLabel: planInfo.label,
      kitsTotal: firebase.firestore.FieldValue.increment(planInfo.kits),
      kitsRemaining: firebase.firestore.FieldValue.increment(planInfo.kits),
      purchasedOn: new Date().toISOString()
    });
    const snap = await ref.get();
    window.currentUserData = snap.data();
    updateCreditsDisplay();
    if (typeof updateGenerateButton === 'function') updateGenerateButton();
  } catch (err) {
    console.error('Firestore applyPlan error:', err);
    throw err;
  }
}

async function reserveKitCredit() {
  if (!window.auth.currentUser) return { reserved: false };

  const ref = window.db.collection('bizwriteUsers').doc(window.auth.currentUser.uid);
  let nextData = null;

  await window.db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new Error('User profile not found.');

    const data = snap.data();
    const remaining = data.kitsRemaining || 0;
    if (remaining <= 0) {
      const err = new Error('No BizWrite credits remaining.');
      err.code = 'bizwrite/no-credits';
      throw err;
    }
    nextData = {
      kitsUsed: (data.kitsUsed || 0) + 1,
      kitsRemaining: remaining - 1
    };
    tx.update(ref, nextData);
  });

  if (nextData) {
    window.currentUserData = { ...window.currentUserData, ...nextData };
    updateCreditsDisplay();
  }
  return { reserved: true };
}

async function releaseKitCredit() {
  if (!window.auth.currentUser) return;
  try {
    const ref = window.db.collection('bizwriteUsers').doc(window.auth.currentUser.uid);
    await window.db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) return;
      const data = snap.data();
      tx.update(ref, {
        kitsUsed: Math.max(0, (data.kitsUsed || 1) - 1),
        kitsRemaining: (data.kitsRemaining || 0) + 1
      });
    });
    const snap = await ref.get();
    window.currentUserData = snap.data();
    updateCreditsDisplay();
  } catch (err) {
    console.error('Credit release error:', err);
  }
}

async function incrementDemoUsed() {
  if (!window.auth.currentUser) return;
  try {
    const ref = window.db.collection('bizwriteUsers').doc(window.auth.currentUser.uid);
    await ref.update({ demoUsed: firebase.firestore.FieldValue.increment(1) });
    if (window.currentUserData) {
      window.currentUserData.demoUsed = (window.currentUserData.demoUsed || 0) + 1;
    }
    updateCreditsDisplay();
  } catch (err) {
    console.error('incrementDemoUsed error:', err);
  }
}

async function releaseDemoUse() {
  if (!window.auth.currentUser) return;
  try {
    const ref = window.db.collection('bizwriteUsers').doc(window.auth.currentUser.uid);
    await window.db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) return;
      const data = snap.data();
      tx.update(ref, {
        demoUsed: Math.max(0, (data.demoUsed || 1) - 1)
      });
    });
    const snap = await ref.get();
    window.currentUserData = snap.data();
    updateCreditsDisplay();
  } catch (err) {
    console.error('Demo release error:', err);
  }
}

async function saveBizwriteHistory(meta) {
  if (!window.auth.currentUser) return;
  try {
    await window.db
      .collection('bizwriteUsers')
      .doc(window.auth.currentUser.uid)
      .collection('history')
      .add({
        date: new Date().toISOString(),
        businessName: meta.businessName || '',
        businessType: meta.businessType || '',
        outputLang: meta.outputLang || 'English',
        sections: meta.sections || [],
        mode: meta.mode || 'paid'
      });
  } catch (err) {
    console.error('saveBizwriteHistory error:', err);
  }
}

function updateCreditsDisplay() {
  const badge = document.getElementById('creditsBadge');
  const u = window.currentUserData;
  if (!badge || !u) return;

  const demoUsed = u.demoUsed || 0;
  const remaining = u.kitsRemaining || 0;
  const hasPlan = !!u.plan;

  badge.style.color = '#fff';
  if (hasPlan && remaining > 0) {
    badge.textContent = `${remaining} kit${remaining !== 1 ? 's' : ''} left`;
    badge.style.background = '#2563eb';
  } else if (hasPlan && remaining <= 0) {
    badge.textContent = 'Credits used';
    badge.style.background = '#dc2626';
  } else if (demoUsed < 1) {
    badge.textContent = '1 free demo';
    badge.style.background = '#f59e0b';
  } else {
    badge.textContent = 'Demo used';
    badge.style.background = '#dc2626';
  }

  if (typeof updateGenerateButton === 'function') {
    updateGenerateButton();
  }
}

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
  ['regName', 'regEmail', 'regPassword', 'loginEmail', 'loginPassword'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.querySelectorAll('.auth-error, .auth-success').forEach((el) => {
    el.textContent = '';
  });
}

function showAuthTab(tab) {
  document.querySelectorAll('.auth-tab-btn').forEach((btn) => btn.classList.remove('active'));
  document.querySelectorAll('.auth-form-panel').forEach((panel) => panel.classList.remove('active'));
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
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const errorEl = document.getElementById('regError');
  const succEl = document.getElementById('regSuccess');
  if (errorEl) errorEl.textContent = '';
  if (succEl) succEl.textContent = '';
  try {
    await registerWithEmail({ name, email, password });
    if (succEl) succEl.textContent = 'Account created!';
  } catch (err) {
    if (errorEl) errorEl.textContent = err.message;
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errorEl = document.getElementById('loginError');
  if (errorEl) errorEl.textContent = '';
  try {
    await loginWithEmail(email, password);
  } catch (err) {
    if (errorEl) errorEl.textContent = err.message;
  }
}

function authModalOverlayClick(event) {
  if (event.target === document.getElementById('authModal')) {
    closeAuthModal();
  }
}

function toggleUserMenu() {
  const dropdown = document.getElementById('userDropdown');
  if (dropdown) dropdown.classList.toggle('open');
}

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

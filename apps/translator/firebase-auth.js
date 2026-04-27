// ================================================================
// Smart Digital LipiAntar — Auth & Firestore Logic
// ================================================================
// Firestore collection: 'lipiantarUsers'
// User schema: { uid, name, email, photo, authMethod, plan,
//   planLabel, docsTotal, docsUsed, docsRemaining,
//   demoUsed, purchasedOn, createdAt }
// ================================================================

window.currentUserData = null;

// ================================================================
// GOOGLE SIGN-IN
// ================================================================
async function signInWithGoogle() {
  const errEl = document.getElementById('loginError') || document.getElementById('regError');
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await window.auth.signInWithPopup(provider);
    await loadOrCreateLipiantarUser(result.user);
    updateAuthUI(result.user);
    closeAuthModal();
    if (window._pendingTranslate) {
      window._pendingTranslate = false;
      handleTranslate();
    }
  } catch (err) {
    console.error('Google sign-in error:', err);
    if (errEl) errEl.textContent = err.message;
  }
}

// ================================================================
// REGISTRATION — Name, Email, Password
// ================================================================
async function registerWithEmail(data) {
  const { name, email, password } = data;

  if (!name || !email || !password) throw new Error("All fields are required.");
  if (password.length < 6)          throw new Error("Password must be at least 6 characters.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Invalid email format.");

  try {
    const cred = await window.auth.createUserWithEmailAndPassword(email, password);
    const user = cred.user;
    await user.updateProfile({ displayName: name });

    const ref  = window.db.collection('lipiantarUsers').doc(user.uid);
    const snap = await ref.get();
    if (!snap.exists) {
      await ref.set({
        uid:          user.uid,
        name,
        email,
        photo:        '',
        authMethod:   'email',
        plan:         null,
        planLabel:    null,
        docsTotal:    0,
        docsUsed:     0,
        docsRemaining:0,
        demoUsed:     0,
        purchasedOn:  null,
        createdAt:    firebase.firestore.FieldValue.serverTimestamp()
      });
    }

    window.currentUserData = {
      uid: user.uid, name, email, photo: '', authMethod: 'email',
      plan: null, planLabel: null,
      docsTotal: 0, docsUsed: 0, docsRemaining: 0, demoUsed: 0
    };

    updateCreditsDisplay();
    updateAuthUI(user);
    closeAuthModal();

    if (window._pendingTranslate) {
      window._pendingTranslate = false;
      handleTranslate();
    }
    return user;
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      throw new Error("An account with this email already exists. Please sign in.");
    }
    throw err;
  }
}

// ================================================================
// LOGIN — Email + Password
// ================================================================
async function loginWithEmail(email, password) {
  if (!email || !password) throw new Error("Enter email and password.");
  try {
    const cred = await window.auth.signInWithEmailAndPassword(email, password);
    await loadOrCreateLipiantarUser(cred.user);
    updateAuthUI(cred.user);
    closeAuthModal();

    if (window._pendingTranslate) {
      window._pendingTranslate = false;
      handleTranslate();
    }
    return cred.user;
  } catch (err) {
    if (
      err.code === 'auth/user-not-found' ||
      err.code === 'auth/invalid-credential' ||
      err.code === 'auth/invalid-login-credentials'
    ) {
      throw new Error("Invalid email or password. Please check and try again.");
    }
    if (err.code === 'auth/wrong-password')    throw new Error("Wrong password. Please try again.");
    if (err.code === 'auth/too-many-requests') throw new Error("Too many attempts. Please try again later.");
    throw err;
  }
}

// ================================================================
// SIGN OUT
// ================================================================
function signOutUser() {
  window.auth.signOut().then(() => {
    window.currentUserData = null;
    updateAuthUI(null);
    updateTranslateBtn();
  });
}

// ================================================================
// AUTH STATE LISTENER
// ================================================================
window.auth.onAuthStateChanged(async (user) => {
  if (user) {
    await loadOrCreateLipiantarUser(user);
    updateAuthUI(user);
  } else {
    window.currentUserData = null;
    updateAuthUI(null);
  }
  updateTranslateBtn();
});

// ================================================================
// LOAD OR CREATE USER IN FIRESTORE
// ================================================================
async function loadOrCreateLipiantarUser(user) {
  try {
    const ref  = window.db.collection('lipiantarUsers').doc(user.uid);
    const snap = await ref.get();

    if (!snap.exists) {
      const newUser = {
        uid:          user.uid,
        name:         user.displayName || '',
        email:        user.email       || '',
        photo:        user.photoURL    || '',
        authMethod:   user.providerData?.[0]?.providerId === 'google.com' ? 'google' : 'email',
        plan:         null,
        planLabel:    null,
        docsTotal:    0,
        docsUsed:     0,
        docsRemaining:0,
        demoUsed:     0,
        purchasedOn:  null,
        createdAt:    firebase.firestore.FieldValue.serverTimestamp()
      };
      await ref.set(newUser);
      window.currentUserData = newUser;
    } else {
      window.currentUserData = snap.data();
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
    const ref = window.db.collection('lipiantarUsers').doc(window.auth.currentUser.uid);
    await ref.update({
      plan:         planInfo.planId,
      planLabel:    planInfo.label,
      docsTotal:    firebase.firestore.FieldValue.increment(planInfo.docs),
      docsRemaining:firebase.firestore.FieldValue.increment(planInfo.docs),
      purchasedOn:  new Date().toISOString()
    });
    const snap = await ref.get();
    window.currentUserData = snap.data();
    updateCreditsDisplay();
    updateTranslateBtn();
  } catch (err) {
    console.error("Firestore applyPlan error:", err);
    throw err;
  }
}

// ================================================================
// RESERVE DOC CREDIT (Firestore transaction)
// ================================================================
async function reserveDocCredit() {
  if (!window.auth.currentUser) return { reserved: false };

  const ref = window.db.collection('lipiantarUsers').doc(window.auth.currentUser.uid);
  let nextData = null;

  await window.db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new Error("User profile not found.");

    const data      = snap.data();
    const remaining = data.docsRemaining || 0;
    if (remaining <= 0) {
      const err  = new Error("No document credits remaining.");
      err.code   = 'lipi/no-credits';
      throw err;
    }
    nextData = {
      docsUsed:      (data.docsUsed || 0) + 1,
      docsRemaining: remaining - 1
    };
    tx.update(ref, nextData);
  });

  if (nextData) {
    window.currentUserData = { ...window.currentUserData, ...nextData };
    updateCreditsDisplay();
  }
  return { reserved: true };
}

// Release a reserved credit if translation fails
async function releaseDocCredit() {
  if (!window.auth.currentUser) return;
  try {
    const ref = window.db.collection('lipiantarUsers').doc(window.auth.currentUser.uid);
    await window.db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) return;
      const data = snap.data();
      tx.update(ref, {
        docsUsed:      Math.max(0, (data.docsUsed || 1) - 1),
        docsRemaining: (data.docsRemaining || 0) + 1
      });
    });
    const snap = await ref.get();
    window.currentUserData = snap.data();
    updateCreditsDisplay();
  } catch (err) {
    console.error("Credit release error:", err);
  }
}

// ================================================================
// INCREMENT DEMO USED
// ================================================================
async function incrementDemoUsed() {
  if (!window.auth.currentUser) return;
  try {
    const ref = window.db.collection('lipiantarUsers').doc(window.auth.currentUser.uid);
    await ref.update({ demoUsed: firebase.firestore.FieldValue.increment(1) });
    if (window.currentUserData) {
      window.currentUserData.demoUsed = (window.currentUserData.demoUsed || 0) + 1;
    }
    updateCreditsDisplay();
  } catch (err) {
    console.error("incrementDemoUsed error:", err);
  }
}

// ================================================================
// SAVE TRANSLATION HISTORY TO FIRESTORE
// ================================================================
async function saveTranslationHistory(meta) {
  if (!window.auth.currentUser) return;
  try {
    await window.db
      .collection('lipiantarUsers')
      .doc(window.auth.currentUser.uid)
      .collection('history')
      .add({
        date:   new Date().toISOString(),
        src:    meta.src    || '',
        tgt:    meta.tgt    || '',
        tone:   meta.tone   || 'official',
        mode:   meta.mode   || 'free',
        words:  meta.words  || 0
      });
  } catch (err) {
    console.error("saveTranslationHistory error:", err);
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

  const demoUsed  = u.demoUsed      || 0;
  const remaining = u.docsRemaining || 0;
  const hasPlan   = !!u.plan;

  if (hasPlan && remaining > 0) {
    badge.textContent      = `${remaining} doc${remaining !== 1 ? 's' : ''} left`;
    badge.style.background = '#2563EB';
  } else if (hasPlan && remaining <= 0) {
    badge.textContent      = 'Credits used';
    badge.style.background = '#dc2626';
  } else if (demoUsed < 1) {
    badge.textContent      = '1 free demo';
    badge.style.background = '#f59e0b';
  } else {
    badge.textContent      = 'Demo used — Buy plan';
    badge.style.background = '#dc2626';
  }
}

// ================================================================
// AUTH MODAL UI HELPERS
// ================================================================
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
  ['regName', 'regEmail', 'regPassword', 'loginEmail', 'loginPassword'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.querySelectorAll('.auth-error, .auth-success').forEach(e => e.textContent = '');
}

function authModalOverlayClick(event) {
  if (event.target === document.getElementById('authModal')) closeAuthModal();
}

function showAuthTab(tab) {
  document.querySelectorAll('.auth-tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.auth-form-panel').forEach(p => p.classList.remove('active'));
  const btn   = document.getElementById('authTab-'   + tab);
  const panel = document.getElementById('authPanel-' + tab);
  if (btn)   btn.classList.add('active');
  if (panel) panel.classList.add('active');
}

function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.type      = input.type === 'password' ? 'text' : 'password';
  btn.textContent = input.type === 'password' ? 'Show' : 'Hide';
}

async function handleRegister(event) {
  event.preventDefault();
  const name     = document.getElementById('regName').value.trim();
  const email    = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const errorEl  = document.getElementById('regError');
  const succEl   = document.getElementById('regSuccess');
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
  const email    = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errorEl  = document.getElementById('loginError');
  if (errorEl) errorEl.textContent = '';
  try {
    await loginWithEmail(email, password);
  } catch (err) {
    if (errorEl) errorEl.textContent = err.message;
  }
}

// ================================================================
// UPDATE AUTH UI (header)
// ================================================================
function updateAuthUI(user) {
  const authBtns  = document.getElementById('authButtonsGroup');
  const userPanel = document.getElementById('userPanel');
  const userName  = document.getElementById('userName');

  if (user) {
    if (authBtns)  authBtns.style.display  = 'none';
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
    if (authBtns)  authBtns.style.display  = 'flex';
    if (userPanel) userPanel.style.display = 'none';
  }
  updateCreditsDisplay();
}

// ================================================================
// HELPER — get doc credits from Firestore user data
// ================================================================
function getFirestoreCredits() {
  return window.currentUserData?.docsRemaining || 0;
}

function getDemoUsed() {
  return window.currentUserData?.demoUsed || 0;
}

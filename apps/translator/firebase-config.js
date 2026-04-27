// ================================================================
// Smart Digital LipiAntar — Firebase Configuration
// ----------------------------------------------------------------
// Uses the same Firebase project as ExamCraft for shared auth.
// Users' translation credits are stored in the 'lipiantarUsers' collection.
// ================================================================

const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyBu64L4iI-nBT1bExayJ1iBupjZUZy7g7I",
  authDomain:        "smartdigital-examcraft.firebaseapp.com",
  projectId:         "smartdigital-examcraft",
  storageBucket:     "smartdigital-examcraft.firebasestorage.app",
  messagingSenderId: "284927686646",
  appId:             "1:284927686646:web:829c5bb8ae6a56a8aa79d7"
};

firebase.initializeApp(FIREBASE_CONFIG);

window.auth = firebase.auth();
window.db   = firebase.firestore();

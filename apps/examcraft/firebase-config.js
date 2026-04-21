// ================================================================
// Smart Digital ExamCraft — Firebase Configuration
// ----------------------------------------------------------------
// SETUP STEPS:
//  1. Go to https://console.firebase.google.com
//  2. Create a project → Add a Web App → copy config below
//  3. Enable Authentication → Google provider
//  4. Enable Firestore Database → Start in test mode (for now)
// ================================================================

const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyBu64L4iI-nBT1bExayJ1iBupjZUZy7g7I",
  authDomain:        "smartdigital-examcraft.firebaseapp.com",
  projectId:         "smartdigital-examcraft",
  storageBucket:     "smartdigital-examcraft.firebasestorage.app",
  messagingSenderId: "284927686646",
  appId:             "1:284927686646:web:829c5bb8ae6a56a8aa79d7",
  measurementId:     "G-YBT1W0QL7T"
};

firebase.initializeApp(FIREBASE_CONFIG);

window.auth = firebase.auth();
window.db   = firebase.firestore();

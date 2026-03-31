/* ═══════════════════════════════════════════════
   FIREBASE-INIT.JS — Global Firebase connection
   Timtim by Aritri
═══════════════════════════════════════════════ */

// ⚠️ IMPORTANT: REPLACE THIS CONFIG WITH YOUR ACTUAL FIREBASE PROJECT CONFIG
// 1. Go to console.firebase.google.com
// 2. Click "Add App" -> "Web"
// 3. Copy the firebaseConfig object here:
const firebaseConfig = {
  apiKey: "AIzaSyD65l4ejf_78PsVTgssPZN4qSKtCHSh46s",
  authDomain: "timtim-vs2-main-10726303-20a19.firebaseapp.com",
  projectId: "timtim-vs2-main-10726303-20a19",
  storageBucket: "timtim-vs2-main-10726303-20a19.firebasestorage.app",
  messagingSenderId: "607783612543",
  appId: "1:607783612543:web:96f8aeaf5e657c02468f4a"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Export global references
window.FB = {
  db: firebase.firestore(),
  storage: firebase.storage(),
  auth: firebase.auth(),
  serverTimestamp: firebase.firestore.FieldValue.serverTimestamp
};

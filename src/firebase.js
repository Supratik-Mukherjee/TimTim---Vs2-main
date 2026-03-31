import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD65l4ejf_78PsVTgssPZN4qSKtCHSh46s",
  authDomain: "timtim-vs2-main-10726303-20a19.firebaseapp.com",
  projectId: "timtim-vs2-main-10726303-20a19",
  storageBucket: "timtim-vs2-main-10726303-20a19.firebasestorage.app",
  messagingSenderId: "607783612543",
  appId: "1:607783612543:web:96f8aeaf5e657c02468f4a"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAgg42Uv_0bMHnm9A5gob_vtsx42lEtIHU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "factory-machine-monitoring.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://factory-machine-monitoring-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "factory-machine-monitoring",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "factory-machine-monitoring.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "986931001302",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:986931001302:web:2617880cdd3ae6d5db1677"
};

if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes('YOUR_API_KEY') || firebaseConfig.apiKey === 'AIzaSy...') {
  console.warn('Firebase API key looks missing or placeholder. Set VITE_FIREBASE_API_KEY in .env or update src/firebase.js with a valid Web API key.');
}

// Initialize Firebase (safe for HMR / re-imports)
let app;
try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
} catch (error) {
  console.error("Firebase initialization error:", error);
}

export const auth = getAuth(app);
export const database = getDatabase(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;

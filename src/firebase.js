import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgg42Uv_0bMHnm9A5gob_vtsx42lEtIHU",
  authDomain: "factory-machine-monitoring.firebaseapp.com",
  databaseURL: "https://factory-machine-monitoring-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "factory-machine-monitoring",
  storageBucket: "factory-machine-monitoring.firebasestorage.app",
  messagingSenderId: "986931001302",
  appId: "1:986931001302:web:2617880cdd3ae6d5db1677"
};

// Initialize Firebase (safe for HMR / re-imports)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);
export default app;

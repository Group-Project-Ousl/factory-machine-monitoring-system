import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAgg42Uv_0bMHnm9A5gob_vtsx42lEtIHU",
  authDomain: "factory-machine-monitoring.firebaseapp.com",
  databaseURL: "https://factory-machine-monitoring-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "factory-machine-monitoring",
  storageBucket: "factory-machine-monitoring.firebasestorage.app",
  messagingSenderId: "986931001302",
  appId: "1:986931001302:web:2617880cdd3ae6d5db1677"
};

// initialize app
initializeApp(firebaseConfig);

// ensure you export the initialized app:
// e.g. after initializeApp(firebaseConfig) assign to a variable and export it:
export const firebaseApp = initializeApp(firebaseConfig);

// optional: provide a default export so old default-importing code still works
export default firebaseApp;

// get Firestore and Auth instances
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
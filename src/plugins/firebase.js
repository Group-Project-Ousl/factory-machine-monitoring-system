import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDfJfJfJfJfJfJfJfJfJfJfJfJfJfJfJfJf',
  authDomain: 'factory-machine-monitoring-system.firebaseapp.com',
  projectId: 'factory-machine-monitoring-system',
  storageBucket: 'factory-machine-monitoring-system.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:123456789'
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
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBVUeOL8isK7Nf4bpTbLW19NfHCnr16YNo",
  authDomain: "babaji-achar.firebaseapp.com",
  databaseURL: "https://babaji-achar-default-rtdb.firebaseio.com",
  projectId: "babaji-achar",
  storageBucket: "babaji-achar.appspot.com",
  messagingSenderId: "1055070676948",
  appId: "1:1055070676948:web:b5fd68e1e48e6e291b1841"
};

// Singleton pattern: initialize only if no apps exist, otherwise use existing.
// This prevents duplicate initialization errors and is safe for Vercel/SSR.
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getDatabase(app);

// Initialize Firebase Authentication and get a reference to the service
import { getAuth, GoogleAuthProvider } from "firebase/auth";
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;

// lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_OlAUUDfd-gSBl8hAWQR2xwK2z_4aFFg",
  authDomain: "sss-surplus-marketplace.firebaseapp.com",
  projectId: "sss-surplus-marketplace",
  storageBucket: "sss-surplus-marketplace.firebasestorage.app",
  messagingSenderId: "692045473386",
  appId: "1:692045473386:web:0ef6101c791db6c567cc13",
  measurementId: "G-G9BQH87YJ5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics (only in browser environment)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Initialize Auth providers
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Configure Facebook provider
facebookProvider.setCustomParameters({
  display: 'popup'
});

export default app;


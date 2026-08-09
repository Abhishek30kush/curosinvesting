import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

export const hasValidFirebaseConfig = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

if (!hasValidFirebaseConfig) {
  console.warn(
    "⚠️ Firebase environment variables (VITE_FIREBASE_*) are missing. Please add them in Vercel project settings."
  );
}

const safeConfig = hasValidFirebaseConfig ? firebaseConfig : {
  apiKey: "AIzaSyPlaceholderKeyForDeploymentValidationOnly",
  authDomain: "curosinvesting-placeholder.firebaseapp.com",
  projectId: "curosinvesting-placeholder",
  storageBucket: "curosinvesting-placeholder.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:0000000000000000000000"
};

let app;
try {
  app = getApps().length ? getApp() : initializeApp(safeConfig);
} catch (error) {
  console.error("Firebase init error:", error);
}

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;


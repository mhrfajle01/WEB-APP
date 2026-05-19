import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCU19D5-5lLb3C1qWv6Hp2Sq1WWSQJZhsU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "blogapp-79c0d.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "blogapp-79c0d",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "blogapp-79c0d.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "988068283454",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:988068283454:web:0f628604cf5f2ad994bd6f"
};

// Check if config is present (useful for debugging blank page)
if (!firebaseConfig.apiKey) {
  console.error("Firebase API Key is missing! Check your environment variables on Vercel.");
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

let analytics = null;
try {
  analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
} catch (error) {
  console.warn("Firebase Analytics failed to initialize:", error);
}

export { analytics };
export default app;

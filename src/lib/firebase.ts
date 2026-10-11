import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase configuration
// Custom authDomain: 'accounticca.com' ensures Google Sign-In displays:
// "Choose an account to continue to accounticca.com"
const firebaseConfig = {
  apiKey: "AIzaSyD0HcNrqIDq_tNPhPX4zO73aYrE8e1z-gg",
  authDomain: "accounticca.com",
  projectId: "gen-lang-client-0396222608",
  storageBucket: "gen-lang-client-0396222608.firebasestorage.app",
  messagingSenderId: "425825496026",
  appId: "1:425825496026:web:f1564f14d5ae5ba920eee3",
  measurementId: "G-P4WQ33CP7G"
};

// Fallback configuration for project domain
const fallbackFirebaseConfig = {
  ...firebaseConfig,
  authDomain: "gen-lang-client-0396222608.firebaseapp.com"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const fallbackApp = initializeApp(fallbackFirebaseConfig, 'fallbackApp');

// Initialize Firestore with specific database ID
export const db = getFirestore(app, "ai-studio-accounticcainsig-89414606-29ba-4643-944b-e0ac41725d03");

// Initialize Auth
export const auth = getAuth(app);
export const fallbackAuth = getAuth(fallbackApp);

// Authentication Providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope('email');
facebookProvider.addScope('public_profile');
facebookProvider.setCustomParameters({
  display: 'popup'
});

// Initialize Analytics (supported in browser environment)
export let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Ignore analytics init failure in non-supported environments
  });
}



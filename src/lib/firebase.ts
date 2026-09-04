import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD0HcNrqIDq_tNPhPX4zO73aYrE8e1z-gg",
  authDomain: "gen-lang-client-0396222608.firebaseapp.com",
  projectId: "gen-lang-client-0396222608",
  storageBucket: "gen-lang-client-0396222608.firebasestorage.app",
  messagingSenderId: "425825496026",
  appId: "1:425825496026:web:f1564f14d5ae5ba920eee3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with specific database ID
export const db = getFirestore(app, "ai-studio-accounticcainsig-89414606-29ba-4643-944b-e0ac41725d03");

// Initialize Auth
export const auth = getAuth(app);

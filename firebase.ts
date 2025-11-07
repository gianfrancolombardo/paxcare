import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Default configuration in case environment variables are not set
const defaultFirebaseConfig = {
    apiKey: "AIzaSyDXep9XweqO5H-SwKYArVW4Dx5uCLSWGDI",
    authDomain: "paxcare-34553.firebaseapp.com",
    projectId: "paxcare-34553",
    storageBucket: "paxcare-34553.firebasestorage.app",
    messagingSenderId: "1055848218057",
    appId: "1:1055848218057:web:114ea64b3ca41ad38afc18"
};

// Use environment variables if they exist, otherwise fall back to the default config
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || defaultFirebaseConfig.apiKey,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || defaultFirebaseConfig.authDomain,
  projectId: process.env.FIREBASE_PROJECT_ID || defaultFirebaseConfig.projectId,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || defaultFirebaseConfig.storageBucket,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || defaultFirebaseConfig.messagingSenderId,
  appId: process.env.FIREBASE_APP_ID || defaultFirebaseConfig.appId,
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

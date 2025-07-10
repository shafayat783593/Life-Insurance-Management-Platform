// firebase.config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// const firebaseConfig = {
//     apiKey: "AIzaSyBbn9pCid-pfBBQ5iYJpmWlVQSSrAqkChM",
//     authDomain: "insurance-management-8aa90.firebaseapp.com",
//     projectId: "insurance-management-8aa90",
//     storageBucket: "insurance-management-8aa90.firebasestorage.app",
//     messagingSenderId: "73362571581",
//     appId: "1:73362571581:web:30a58f1ae3c3339d1e4554"
//   };
  
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);



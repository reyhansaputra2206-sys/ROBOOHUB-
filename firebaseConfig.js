import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCRshrJJEHLojBmXoUT-gmVr35pBMVKaNk",
  authDomain: "robohub-7340c.firebaseapp.com",
  projectId: "robohub-7340c",
  storageBucket: "robohub-7340c.firebasestorage.app",
  messagingSenderId: "288663897535",
  appId: "1:288663897535:web:9e6f2a73b4b565b12c0d0a"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
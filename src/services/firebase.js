import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "skyproperties-cf5c7.firebaseapp.com",
  databaseURL: "https://skyproperties-cf5c7-default-rtdb.firebaseio.com",
  projectId: "skyproperties-cf5c7",
  storageBucket: "skyproperties-cf5c7.appspot.com",
  messagingSenderId: "685192866695",
  appId: "YOUR_APP_ID",
  measurementId: "G-512433452"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

export default app;

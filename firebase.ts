import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCbq--2gbEETJR8dBIRQStsPJrCp0713c0",
    authDomain: "appchurch-5f467.firebaseapp.com",
    projectId: "appchurch-5f467",
    storageBucket: "appchurch-5f467.appspot.com",
    messagingSenderId: "941050422184",
    appId: "1:941050422184:web:2c898b04a4d1c1d260f39d"
  };

const app = initializeApp(firebaseConfig);

// Get Firebase Storage and Firestore instances
const storage = getStorage(app);
const db = getFirestore(app);
const auth = getAuth(app);
const firestore = getFirestore(app);
export { storage, db,auth ,app, firestore };
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyApIIp95YkGet2KS_UGL1_5z2rmDbx5zQI",
  authDomain: "church-1656a.firebaseapp.com",
  projectId: "church-1656a",
  storageBucket: "church-1656a.appspot.com",
  messagingSenderId: "264969583812",
  appId: "1:264969583812:web:614789140d6521713fdd91"
};

const app = initializeApp(firebaseConfig);

// Get Firebase Storage and Firestore instances
const storage = getStorage(app);
const db = getFirestore(app);
const auth = getAuth(app);
export { storage, db,auth  };
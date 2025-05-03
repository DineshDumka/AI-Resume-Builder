import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyDJq7IXAOZEaITJVQrOXH6hOk9vAHCYdwo",
  authDomain: "codetogether-bf7e1.firebaseapp.com",
  projectId: "codetogether-bf7e1",
  storageBucket: "codetogether-bf7e1.appspot.com",
  messagingSenderId: "621583802793",
  appId: "1:621583802793:web:43de1b427150ee02f024b8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { firebaseConfig, auth, app, db, storage };
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Add this if you're using Firestore

const firebaseConfig = {
  apiKey: "AIzaSyCJm_t_MHJgr1jXoPP5qd2k9Y120PEafHc",
  authDomain: "college-compass-1b882.firebaseapp.com",
  projectId: "college-compass-1b882",
  storageBucket: "college-compass-1b882.appspot.com", // ✅ correct format
  messagingSenderId: "1000745713167",
  appId: "1:1000745713167:web:425108cd38be2414842d7a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // Add this to use Firestore

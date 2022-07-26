// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBsLGtCvFnZvqKVXZASL5mYYjJz29iDMOc",
  authDomain: "next-fairpay-app.firebaseapp.com",
  projectId: "next-fairpay-app",
  storageBucket: "next-fairpay-app.appspot.com",
  messagingSenderId: "1011679256017",
  appId: "1:1011679256017:web:c84330ed6829ae2b9494f0",
  measurementId: "G-DT7KLZ4XGP"
};

// Initialize Firebase
const app  = initializeApp(firebaseConfig);
const firestoreInstance = getFirestore(app)

export const firestore = firestoreInstance;
export default app
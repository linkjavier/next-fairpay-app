// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore();
export { db }

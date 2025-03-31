import { initializeApp, getApp, getApps } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAG8hjGemExLv9yNlD5CFLUsqaTBavwMuI",
  authDomain: "crocodilo-95b86.firebaseapp.com",
  projectId: "crocodilo-95b86",
  storageBucket: "crocodilo-95b86.firebasestorage.app",
  messagingSenderId: "84684014007",
  appId: "1:84684014007:web:c8ef5fb740fd6acea86832",
  measurementId: "G-P1Y9541GF5"
};



// Initialize Firebase
const app = !getApps.length ?  initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
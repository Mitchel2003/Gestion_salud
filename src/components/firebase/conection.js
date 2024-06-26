/*--------------------------------------------------conecction with database--------------------------------------------------*/
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getFirestore, collection, doc, addDoc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, orderBy, limit, startAt, startAfter, Timestamp} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { getAuth, signOut,signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendEmailVerification, sendPasswordResetEmail, confirmPasswordReset, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCjKw582WVzAgwxfsYqQsi-2j0wCxtvHAo",
    authDomain: "gestionsalud-2003.firebaseapp.com",
    projectId: "gestionsalud-2003",
    storageBucket: "gestionsalud-2003.appspot.com",
    messagingSenderId: "230825792921",
    appId: "1:230825792921:web:31b62b2e4005df4e866f08",
    measurementId: "G-XBY19E9TQG"
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { db, auth, collection, doc, addDoc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, orderBy, limit, startAt, startAfter,    //first level
        signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, Timestamp,    //second level
        sendEmailVerification, sendPasswordResetEmail, confirmPasswordReset, onAuthStateChanged    //third level
    };
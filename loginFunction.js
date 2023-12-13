/*--------------------------------------------------conecction--------------------------------------------------*/
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCjKw582WVzAgwxfsYqQsi-2j0wCxtvHAo",
  authDomain: "gestionsalud-2003.firebaseapp.com",
  projectId: "gestionsalud-2003",
  storageBucket: "gestionsalud-2003.appspot.com",
  messagingSenderId: "230825792921",
  appId: "1:230825792921:web:31b62b2e4005df4e866f08",
  measurementId: "G-XBY19E9TQG"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

console.log("Conecction successfully to Firebase")


/*--------------------------------------------------tools--------------------------------------------------*/

  const userEmail = document.getElementById("userName");
  const userPassword = document.getElementById("userPassword");

document.getElementById("loginForm").addEventListener("submit", async function (event) {

  event.preventDefault();
  const getUser=userEmail.value;
  const getPassword=userPassword.value;

  try {
    await addDoc(collection(firestore, "user"), {
      user:getUser, password:getPassword
    });
  } catch (error) {
    console.log("try again " + error);
  }


});

/*--------------------------------------------------------------------------------------------------------------*/

/*animation of entry*/
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  loginForm.style.animation = "animEntry 0.7s ease";
})



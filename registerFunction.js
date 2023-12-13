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


/*--------------------------------------------------tool for register--------------------------------------------------*/

const name = document.getElementById("userName");
const lastName = document.getElementById("userLastName");
const numberDocument = document.getElementById("userDocument");
const address = document.getElementById("userAddress");
const numberPhone = document.getElementById("userNumberPhone");
const position = document.getElementById("userPosition");

document.getElementById("registerForm").addEventListener("submit", async function (event) {

  event.preventDefault();
  const getName = name.value;
  const getLastName = lastName.value;
  const getNumberDocument = numberDocument.value;
  const getAddress = address.value;
  const getNumberPhone = numberPhone.value;
  const getPosition = position.value;

  try {
    await addDoc(collection(firestore, "user"), {
      name: getName, lastName: getLastName, document:getNumberDocument, address:getAddress, phone:getNumberPhone, position:getPosition 
    });
  } catch (error) {
    console.log("can't has been send register to firebase: " + error);
  }

});








/*--------------------------------------------------------------------------------------------------------------*/
/*animation of entry*/
document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("registerForm");
  registerForm.style.animation = "animEntry 0.7s ease";
})
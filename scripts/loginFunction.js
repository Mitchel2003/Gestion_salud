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
/*--------------------------------------------------tools--------------------------------------------------*/

/*--------------------------------------------------visual--------------------------------------------------*/
document.addEventListener("DOMContentLoaded", function () {
    window.addEventListener("load", function () {
        const background = new Image();
        background.src = "imag/background_optimized.webp";
        background.onload = function () {
            //background and spawn
            document.body.style.backgroundImage = `url(${background.src})`;//alert: are not single quotes
            document.querySelector('.mainContainer').classList.add('loaded');
    };
  });
});

    //change between sign and register
    const container=document.querySelector('.mainContainer');
    const signButton=document.querySelector('.signContainer header');
    const registerButton=document.querySelector('.registerContainer header');
    registerButton.addEventListener('click', () =>{
      container.classList.add('active');
    })
    signButton.addEventListener('click', () =>{
      container.classList.remove('active');
    })



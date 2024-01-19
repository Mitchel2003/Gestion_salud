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
//login user
document.querySelector('.signContainer').addEventListener('submit', async function (event){
    event.preventDefault();
    const userEmail = document.querySelector('.signContainer input[type="text"]').value;
    const password = document.querySelector('.signContainer input[type="password"]').value;

    Swal.fire({
        title:'starting the session',
        text:'Now, contact the administrator to give you access',
        icon:'success',
        backdrop: true,
        toast:true
    });
});

//forgot your password
document.querySelector('.signContainer button[type="button"]').addEventListener('click', function (event) {
    Swal.fire({
        title:'starting the session',
        text:'Now, contact the administrator to give you access',
        icon:'success',
        backdrop: true,
        toast:true
    });
});

//register user
document.querySelector('.registerContainer').addEventListener('submit', async function (event){
    event.preventDefault();
    const name = document.querySelector('.registerContainer input[type="text"]').value;
    const email = document.querySelector('.registerContainer input[type="email"]').value;
    const password = document.querySelector('.registerContainer input[type="password"]').value;
    const access = document.querySelector('.registerContainer select').value;

    try{
        await addDoc(collection(firestore, "user"),{
            name:name,
            email:email,
            password:password,
            access:access
        });

        Swal.fire({
            title:'Request submitted',
            text:'Now, contact the administrator to give you access',
            icon:'success',
            backdrop: true,
            toast:true
        });
    }catch(error){
        console.log("can`t has been send to bd"+ error);
    }
});

/*--------------------------------------------------visual--------------------------------------------------*/
//load background and spawn of body
window.addEventListener("load", function () {
    const background = new Image();
    background.src = "imag/background_optimized.webp";
    background.onload = function () {
        document.body.style.backgroundImage = `url(${background.src})`;
        document.querySelector('.mainContainer').classList.add('loaded');
    };
});

//change between sign and register
const container=document.querySelector('.mainContainer');
const signButton=document.querySelector('.signContainer header');
const registerButton=document.querySelector('.registerContainer header');
registerButton.addEventListener('click', () =>{
    container.classList.add('active');
});
signButton.addEventListener('click', () =>{
    container.classList.remove('active');
});



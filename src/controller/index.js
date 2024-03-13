// imports
import { loadElements } from "../components/utils/view.js";
import { addActive, removeActive } from "../components/utils/anim.js";
import { registerUser } from "../components/models/userModel.js";
import { registerTokenPassword } from "../components/models/userForgotPassword.js";
import { getInputRegister } from "../components/utils/tools/getValue.js";

/*--------------------------------------------------runtime--------------------------------------------------*/
const container = document.querySelector('.mainContainer');
const signButton = document.querySelector('.signContainer header');
const registerButton = document.querySelector('.registerContainer header');

//view
window.addEventListener("load", () => {
    loadElements(container);
});

//transitions addEventListener
registerButton.addEventListener('click', () => {
    addActive(container);
});
signButton.addEventListener('click', () => {
    removeActive(container);
});
/*--------------------------------------------------tools--------------------------------------------------*/
const signContainer = document.querySelector('.signContainer');
const registerContainer = document.querySelector('.registerContainer');
const forgotPassword = document.querySelector('.signContainer button[type="button"]');

signContainer.addEventListener('submit', async function (event) {
    
});
registerContainer.addEventListener('submit', async function (event) {
    event.preventDefault();
    const { name, email, password, access } = getInputRegister();
    await registerUser(name, email, password, access);
});
forgotPassword.addEventListener('click', async function (event) {
    await registerTokenPassword(event);
});


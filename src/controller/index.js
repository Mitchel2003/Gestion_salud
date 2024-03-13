// imports
import { loadElements } from "../components/utils/view.js";
import { addActive, removeActive } from "../components/utils/anim.js";
import { loginUser, registerUser } from "../components/models/userModel.js";
import { registerTokenPassword } from "../components/models/userForgotPassword.js";

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
    event.preventDefault();
    const { user, password } = (await import('../components/utils/tools/values.js')).getInputLogin();
    await loginUser(user, password);
});
registerContainer.addEventListener('submit', async function (event) {
    event.preventDefault();
    const { name, email, password, access } = (await import('../components/utils/tools/values.js')).getInputRegister();//AC #203
    await registerUser(name, email, password, access);
});
forgotPassword.addEventListener('click', async function (event) {
    event.preventDefault();
    await registerTokenPassword();
});

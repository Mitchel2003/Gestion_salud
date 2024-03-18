import { addActive, removeActive } from "../components/utils/anim.js";
/*--------------------------------------------------runtime--------------------------------------------------*/
const container = document.querySelector('.mainContainer');
const signButton = document.querySelector('.signContainer header');
const registerButton = document.querySelector('.registerContainer header');

//view
window.addEventListener("load", async () => {
    (await import('../components/utils/view.js')).loadElements(container);
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
    await (await import('../components/models/userModel.js')).loginUser(user, password);
});
registerContainer.addEventListener('submit', async function (event) {
    event.preventDefault();
    const { name, email, password, access } = (await import('../components/utils/tools/values.js')).getInputRegister();//AC #203
    await (await import('../components/models/userModel.js')).registerUser(name, email, password, access);
});
forgotPassword.addEventListener('click', async function (event) {
    event.preventDefault();
    await (await import('../components/models/userForgotPassword.js')).requestResetPassword();
});
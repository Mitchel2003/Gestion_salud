import { SetClassList, StatusIconEye } from "../components/utils/view.js";
import { StatusConnection } from "../components/firebase/authentication.js";
/*--------------------------------------------------runtime--------------------------------------------------*/
const container = document.querySelector('.mainContainer');
window.addEventListener("load", async () => { (await import('../components/utils/view.js')).loadElements(container); });

//iterators
let status = new StatusConnection();
let setSection = new SetClassList('.registerContainer header', '.signContainer header', 'active', container);
let observerIconEye_section_login = new StatusIconEye('#eyeIcon-login', '#password-login');
let observerIconEye_section_register = new StatusIconEye('#eyeIcon-register', '#password-register');
/*--------------------------------------------------tools--------------------------------------------------*/
const signContainer = document.querySelector('.signContainer');
const registerContainer = document.querySelector('.registerContainer');
const forgotPassword = document.querySelector('.signContainer button[type="button"]');
signContainer.addEventListener('submit', async function (event) {
    event.preventDefault();
    const { user, password } = (await import('../components/utils/values.js')).getInputLogin();
    await (await import('../components/models/userModel.js')).loginUser(user, password);
});
registerContainer.addEventListener('submit', async function (event) {
    event.preventDefault();
    const { name, email, password, access } = (await import('../components/utils/values.js')).getInputRegister();//AC #203
    await (await import('../components/models/userModel.js')).registerUser(name, email, password, access);
});
forgotPassword.addEventListener('click', async function (event) {
    event.preventDefault();
    await (await import('../components/models/userModel.js')).requestResetPassword();
});
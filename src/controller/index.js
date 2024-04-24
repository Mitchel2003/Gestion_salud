import { SetClassList, SetIconEye } from "../components/utils/view.js";
import { StatusConnection } from "../components/firebase/authentication.js";
/*--------------------------------------------------runtime--------------------------------------------------*/
const container = document.querySelector('.mainContainer');
window.addEventListener("load", async () => { (await import('../components/utils/view.js')).loadElements(container); });

//iterators
let status = new StatusConnection();
let fillSelectEntity = new AppennedItemSelect('');
let setSection = new SetClassList('.registerContainer header', '.signContainer header', 'active', container);

const srcIconOpen = "./src/components/images/eye-open.webp", srcIconClose = "./src/components/images/eye-close.webp";
let observerIconEye_section_login = new SetIconEye('#eyeIcon-login', '#password-login', srcIconOpen, srcIconClose );
let observerIconEye_section_register = new SetIconEye('#eyeIcon-register', '#password-register', srcIconOpen, srcIconClose );
/*--------------------------------------------------tools--------------------------------------------------*/
const signContainer = document.querySelector('.signContainer');
const registerContainer = document.querySelector('.registerContainer');
const forgotPassword = document.querySelector('.signContainer button[type="button"]');
signContainer.addEventListener('submit', async function (event) {
    event.preventDefault();
    const { user, password } = (await import('../components/utils/values.js')).getInputLogin();
    await (await import('../components/models/userModel.js')).loginUser(user, password);
});
registerContainer.addEventListener('submit', async function (event) { //working here...
    event.preventDefault();
    const { name, email, password, access, entity } = (await import('../components/utils/values.js')).getInputRegister();//AC #203
    await (await import('../components/models/userModel.js')).registerUser(name, email, password, access, entity);
});
forgotPassword.addEventListener('click', async function (event) {
    event.preventDefault();
    await (await import('../components/models/userModel.js')).requestResetPassword();
});
import { addActive, removeActive } from "../components/utils/view.js";
import { StatusConnection } from "../components/firebase/authentication.js";
/*--------------------------------------------------runtime--------------------------------------------------*/
const container = document.querySelector('.mainContainer');
window.addEventListener("load", async () => { (await import('../components/utils/view.js')).loadElements(container); });

//iterators
let status = new StatusConnection();
document.querySelector('.registerContainer header').addEventListener('click',() => {addActive(container)});
document.querySelector('.signContainer header').addEventListener('click',() => {removeActive(container)});
(await import('../components/utils/view.js')).changeStatusIconEye();

//temp
const menu = document.querySelector('.select-menu'),
select = menu.querySelector('.select-btn'),
options = menu.querySelectorAll('.option'),
showText = menu.querySelector('.btn-text');

select.addEventListener('click', () => {menu.classList.toggle('viewOptions')})

options.forEach((item) => {
    item.addEventListener('click', () => { let option = item.querySelector('.option-text').innerText; showText.innerText = option;  })
})
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
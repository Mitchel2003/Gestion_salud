import { addActive, removeActive } from "../components/utils/view.js";
/*--------------------------------------------------runtime--------------------------------------------------*/
const container = document.querySelector('.mainContainer');
const signButton = document.querySelector('.signContainer header');
const registerButton = document.querySelector('.registerContainer header');
const eyeIcon = document.getElementById('eyeIcon');
//view
window.addEventListener("load", async () => {
    (await import('../components/utils/view.js')).loadElements(container);
});

//anim onClick
registerButton.addEventListener('click', () => {
    addActive(container);
});
signButton.addEventListener('click', () => {
    removeActive(container);
});
eyeIcon.onclick = function (){//working here...
    const input = document.querySelector('.input-box input');
    if (input.type === "password") { input.type = "text"; }
    else { input.type = "password"; }
};

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
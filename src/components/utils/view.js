export function loadElements(container) {//init()
    const background = new Image();
    background.src = "./src/components/images/background_login.webp";
    background.onload = function () {
        document.body.style.backgroundImage = `url(${background.src})`;//setBackground
        container.classList.add('loaded');//animStart
    };
}
export function onLoadWhile() {//fix anim loading...
    const load = document.querySelector('.loadContainer');
    load.classList.add('show');
} export function offLoadWhile() {
    const load = document.querySelector('.loadContainer');
    load.classList.remove('show');
}
export function addActive(container) {//fix anim transition login-register
    container.classList.add('active');
} export function removeActive(container) {
    container.classList.remove('active');
}
export function changeStatusIconEye() {//fix anim on/off iconEye (AC #206)
    const iconLogin = document.getElementById('eyeIcon-login');
    const iconRegister = document.getElementById('eyeIcon-register');
    iconLogin.addEventListener('click', () => { setInputPassword(document.querySelector('.input-box-login input'), iconLogin); });
    iconRegister.addEventListener('click', () => { setInputPassword(document.querySelector('.input-box-register input'), iconRegister); });
} function setInputPassword(input, icon) {
    if (input.type === "password") { input.type = "text"; icon.src = "./src/components/images/eye-open.webp"; }
    else { input.type = "password"; icon.src = "./src/components/images/eye-close.webp"; }
}
/*--------------------------------------------------tools--------------------------------------------------*/
export function goToHome() {//send to...
    window.location.href = 'https://mitchel2003.github.io/Gestion_salud/';
} export function goToVerifyAction() {
    window.location.href = './src/public/verifyAction.html';
}
export function cleanInputRegister() {
    const name = document.querySelector('.registerContainer input[type="text"]');
    const email = document.querySelector('.registerContainer input[type="email"]');
    const password = document.querySelector('.input-box-register input');
    name.value = "";
    email.value = "";
    password.value = "";
}
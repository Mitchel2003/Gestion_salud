export function loadElements(container) {//init()
    const background = new Image();
    background.src = "./src/components/images/background_optimized.webp";
    background.onload = function () {
        document.body.style.backgroundImage = `url(${background.src})`;//setBackground
        document.getElementById('eyeIcon-login').classList.add('hide');//setVisibleIcon
        document.getElementById('eyeIcon-register').classList.add('hide');
        container.classList.add('loaded');//animStart
    };
}
//fix anim loading...
export function onLoadWhile() {
    const load = document.querySelector('.loadContainer');
    load.classList.add('show'); load.classList.add('onSoft');
} export function offLoadWhile() {
    const load = document.querySelector('.loadContainer');
    load.classList.add('offSoft');
    setTimeout(() => { load.classList.remove('show'); load.classList.remove('onSoft'); load.classList.remove('offSoft'); }, 1000);
}
//fix anim login-register
export function addActive(container) {
    container.classList.add('active');
} export function removeActive(container) {
    container.classList.remove('active');
}
export function controllerIconEye() {
    const eyeIcon_login = document.getElementById('eyeIcon-login');
    const eyeIcon_register = document.getElementById('eyeIcon-register');
    document.querySelector('.input-box-login').addEventListener('mouseover', () => { eyeIcon_login.classList.remove('hide'); });
    document.querySelector('.input-box-login').addEventListener('mouseout', () => { eyeIcon_login.classList.add('hide'); });
    document.querySelector('.input-box-register').addEventListener('mouseover', () => { eyeIcon_register.classList.remove('hide'); });
    document.querySelector('.input-box-register').addEventListener('mouseout', () => { eyeIcon_register.classList.add('hide'); });
    eyeIcon_login.addEventListener('click', () => { setInputPassword(document.querySelector('.input-box-login input'), eyeIcon_login); });
    eyeIcon_register.addEventListener('click', () => { setInputPassword(document.querySelector('.input-box-register input'), eyeIcon_register); });
}
export function setInputPassword(input, icon) {
    if (input.type === "password") { input.type = "text"; icon.src = "./src/components/images/eye-open.png"; }
    else { input.type = "password"; icon.src = "./src/components/images/eye-close.png"; }
}
/*--------------------------------------------------tools--------------------------------------------------*/
export function goToHome() {
    window.location.href = 'https://mitchel2003.github.io/Gestion_salud/';
}
export function goToSession() {
    window.location.href = './src/public/session.html';
}
export function cleanInputRegister() {
    const name = document.querySelector('.registerContainer input[type="text"]');
    const email = document.querySelector('.registerContainer input[type="email"]');
    const password = document.querySelector('.registerContainer input[type="password"]');
    name.value = "";
    email.value = "";
    password.value = "";
}
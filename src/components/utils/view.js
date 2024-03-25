export function loadElements(container) {//before init()
    const background = new Image();
    background.src = "./src/components/images/background_optimized.webp";
    background.onload = function () {
        document.body.style.backgroundImage = `url(${background.src})`;
        document.getElementById('eyeIcon').classList.add('hide');//hide icon-eye
        container.classList.add('loaded');
    };
};
//anim login-register
export function addActive(container) {
    container.classList.add('active');
}
export function removeActive(container) {
    container.classList.remove('active');
}
export function setInputPassword(icon) {
    const input = document.querySelector('.input-box input');
    if (input.type === "password") { input.type = "text"; icon.src = "./src/components/images/eye-open.png"; }
    else { input.type = "password"; icon.src = "./src/components/images/eye-close.png"; }
};

//actions
export function goToHome() {
    window.location.href = 'https://mitchel2003.github.io/Gestion_salud/';
}
export function goToSession() {
    window.location.href = './src/public/session.html';
}

//clean inputs
export function cleanInputRegister() {
    const name = document.querySelector('.registerContainer input[type="text"]');
    const email = document.querySelector('.registerContainer input[type="email"]');
    const password = document.querySelector('.registerContainer input[type="password"]');
    name.value = "";
    email.value = "";
    password.value = "";
}
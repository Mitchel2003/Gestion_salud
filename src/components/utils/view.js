export function loadElements(container) {//init()
    const background = new Image();
    background.src = "./src/components/images/background_login.webp";
    background.onload = function () {
        document.body.style.backgroundImage = `url(${background.src})`;//setBackground
        container.classList.add('loaded');//animStart
    };
}
//fix anim loading...
export function onLoadWhile() { document.querySelector('.loadContainer').classList.add('show'); }
export function offLoadWhile() { document.querySelector('.loadContainer').classList.remove('show'); }

//fix anim switch login/register
export function addActive(container) { container.classList.add('active'); }
export function removeActive(container) { container.classList.remove('active'); }

export function changeStatusIconEye() {//fix anim on/off iconEye (AC #206)
    const iconLogin = document.getElementById('eyeIcon-login');
    const iconRegister = document.getElementById('eyeIcon-register');
    iconLogin.addEventListener('click', () => { setInput(document.querySelector('#bx-password-login input'), iconLogin); });
    iconRegister.addEventListener('click', () => { setInput(document.querySelector('#bx-password-register input'), iconRegister); });
}
function setInput(input, icon) {
    if (input.type === "password") { input.type = "text"; icon.src = "./src/components/images/eye-open.webp"; }
    else { input.type = "password"; icon.src = "./src/components/images/eye-close.webp"; }
}
/*--------------------------------------------------tools--------------------------------------------------*/
export function goToHome() {//send to...
    window.location.href = 'https://mitchel2003.github.io/Gestion_salud/';
}
export function goToSession() {
    let url = new URL(window.location.href);
    url.pathname = './src/public/session.html';
    window.location.href = url.toString();
}
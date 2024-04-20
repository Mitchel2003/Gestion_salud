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
export class SetClassList {//onClick
    constructor(turnOn, turnOff, container, classList) {
        this.on = turnOn;
        this.off = turnOff;
        this.add = this.addClass.bind(this, container, classList);
        this.remove = this.removeClass.bind(this, container, classList);
        this.listenClick();
    }
    listenClick() {
        this.on.addEventListener('click', this.add );
        this.off.addEventListener('click', this.remove );
    }
    addClass(element, classList) { element.classList.add(classList); }
    removeClass(element, classList) { element.classList.remove(classList); }
    destroy() { 
        this.on.removeEventListener('click', this.add ); 
        this.off.removeEventListener('click', this.remove );
    }
}
export function goToHome() {//send to...
    let url = new URL(window.location.href);
    url.pathname = './Gestion_salud/index.html';
    window.location.href = url.toString();
}
export function goToSession() {
    let url = new URL(window.location.href);
    url.pathname = './Gestion_salud/src/public/session.html';
    window.location.href = url.toString();
}
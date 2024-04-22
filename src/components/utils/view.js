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

export class StatusIconEye {//fix anim on/off iconEye (AC #206)
    constructor(eye, input, iconOpen, iconClose) {
        this.icon = document.querySelector(eye);
        this.input = document.querySelector(input);
        this.open = iconOpen;
        this.close = iconClose;
        this.observer();
    }
    observer() {
        this.icon.addEventListener('click', () => this.setInput(this.icon, this.input, this.open, this.close) );
    }
    setInput(icon, input, open, close) {
        if (input.type === "password") { input.type = "text"; icon.src = open; }
        else { input.type = "password"; icon.src = close; }
    }
}
export class SetClassList {//at onClick
    constructor(turnOn, turnOff, classList, container) {
        this.on = document.querySelector(turnOn);
        this.off = document.querySelector(turnOff);
        this.add = this.addClass.bind(this, container, classList);
        this.remove = this.removeClass.bind(this, container, classList);
        this.listenClick();
    }
    listenClick() {
        this.on.addEventListener('click', this.add);
        this.off.addEventListener('click', this.remove);
    }
    addClass(element, classList) { element.classList.add(classList); }
    removeClass(element, classList) { element.classList.remove(classList); }
    destroy() {
        this.on.removeEventListener('click', this.add);
        this.off.removeEventListener('click', this.remove);
    }
}
/*--------------------------------------------------tools--------------------------------------------------*/
export function goToHome() {//send to...
    window.location.href = 'https://mitchel2003.github.io/Gestion_salud/';
}
export function goToSession() {
    let url = new URL(window.location.href);
    url.pathname = './Gestion_salud/src/public/session.html';
    window.location.href = url.toString();
}
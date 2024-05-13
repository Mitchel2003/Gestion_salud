export function loadElements(container) {//init()
    const background = new Image();
    background.src = "./src/components/images/background_login.webp";
    background.onload = async function () {
        document.body.style.backgroundImage = `url(${background.src})`;//setBackground
        container.classList.add('loaded');//animStart
    };
}
//fix anim loading...
export function onLoadWhile() { document.querySelector('.loadContainer').classList.add('show'); }
export function offLoadWhile() { document.querySelector('.loadContainer').classList.remove('show'); }

export async function appennedItemSelect(selectContext) {
    const { getDataByRequest } = await import('../firebase/query.js');
    const select = document.querySelector(selectContext);
    const data = await getDataByRequest();
    data.forEach((e) => {
        const option = document.createElement('option');
        option.value = e.id; option.textContent = e.id;
        select.appendChild(option);
    });
}
/*--------------------------------------------------class--------------------------------------------------*/
export function toggleClassList_onClick(turnOn, turnOff, classList, container) {//on/off at on click
    const on = document.querySelector(turnOn), off = document.querySelector(turnOff);
    on.addEventListener('click', () => { container.classList.toggle(classList); });
    off.addEventListener('click', () => { container.classList.toggle(classList); });
}
export function setIconEye(iconContainer, inputContainer, iconOpen, iconClose) {//on/off iconEye at on click
    const icon = document.querySelector(iconContainer), input = document.querySelector(inputContainer);
    icon.addEventListener('click', () => {
        if (input.type === "password") { input.type = "text"; icon.src = iconOpen; }
        else { input.type = "password"; icon.src = iconClose; }
    });
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
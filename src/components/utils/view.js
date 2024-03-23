export function loadElements(container) {//before init()
    const background = new Image();
    background.src = "./src/components/images/background_optimized.webp";
    background.onload = function () {
        document.body.style.backgroundImage = `url(${background.src})`;
        container.classList.add('loaded');
    };
};
//change between sign and register "animation"
export function addActive(container) {
    container.classList.add('active');
}
export function removeActive(container) {
    container.classList.remove('active');
}

//actions
export function goToHome() {
    window.location.href = 'https://mitchel2003.github.io/Gestion_salud/';
}
export function goToSession() {
    window.location.href = './src/public/session.html';
}

//clean inputs
export function cleanInputRegister() {
    const name=document.querySelector('.registerContainer input[type="text"]');
    const email=document.querySelector('.registerContainer input[type="email"]');
    const password=document.querySelector('.registerContainer input[type="password"]');
    name.value="";
    email.value="";
    password.value="";
}
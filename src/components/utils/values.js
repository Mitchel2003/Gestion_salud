export function getInputRegister() {
    const name=document.querySelector('.registerContainer input[type="text"]').value;
    const email=document.querySelector('.registerContainer input[type="email"]').value;
    const password=document.querySelector('#bx-password-register input').value;
    const access=document.querySelector('.registerContainer #select-access').value;
    const entity=document.querySelector('.registerContainer #select-entity').value;
    return {name, email, password, access, entity};
}
export function getInputLogin() {
    const user=document.querySelector('.signContainer input[type="email"]').value;
    const password=document.querySelector('#bx-password-login input').value;
    return {user, password};
}
export function cleanInputRegister() {
    const name = document.querySelector('.registerContainer input[type="text"]');
    const email = document.querySelector('.registerContainer input[type="email"]');
    const password = document.querySelector('#bx-password-register input');
    name.value = "";
    email.value = "";
    password.value = "";
    //and scroll
    document.classList.remove('active');
}
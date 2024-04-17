export function getInputRegister() {
    const name=document.querySelector('.registerContainer input[type="text"]').value;
    const email=document.querySelector('.registerContainer input[type="email"]').value;
    const password=document.querySelector('.input-box-register input').value;
    const access=document.querySelector('.registerContainer #userPosition').value;
    const entity=document.querySelector('.registerContainer #userEntity').value;
    return {name, email, password, access, entity};
}
export function getInputLogin() {
    const user=document.querySelector('.signContainer input[type="email"]').value;
    const password=document.querySelector('.input-box-login input').value;
    return {user, password};
}
export function cleanInputRegister() {
    const name = document.querySelector('.registerContainer input[type="text"]');
    const email = document.querySelector('.registerContainer input[type="email"]');
    const password = document.querySelector('.input-box-register input');
    name.value = "";
    email.value = "";
    password.value = "";
}
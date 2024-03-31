export function getInputRegister() {
    const name=document.querySelector('.registerContainer input[type="text"]').value;
    const email=document.querySelector('.registerContainer input[type="email"]').value;
    const password=document.querySelector('.input-box-register input').value;
    const access=document.querySelector('.registerContainer select').value;
    return {name, email, password, access};
}
export function getInputLogin() {
    const user=document.querySelector('.signContainer input[type="email"]').value;
    const password=document.querySelector('.input-box-login input').value;
    return {user, password};
}
export function getInputRegister() {
    const name=document.querySelector('.registerContainer input[type="text"]').value;
    const email=document.querySelector('.registerContainer input[type="email"]').value;
    const password=document.querySelector('.registerContainer input[type="password"]').value;
    const access=document.querySelector('.registerContainer select').value;
    return {name, email, password, access};
}
export function getInputLogin() {
    const user=document.querySelector('.signContainer input[type="email"]').value;
    const password=document.querySelector('.signContainer input[type="password"]').value;
    return {user, password};
}
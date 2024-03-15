export function cleanInputRegister() {
    const name=document.querySelector('.registerContainer input[type="text"]');
    const email=document.querySelector('.registerContainer input[type="email"]');
    const password=document.querySelector('.registerContainer input[type="password"]');
    name.value="";
    email.value="";
    password.value="";
}
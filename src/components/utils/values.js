/*--------------------------------------------------login--------------------------------------------------*/
export function getInputLogin() {
    const user = document.querySelector('.signContainer input[type="email"]').value;
    const password = document.querySelector('#bx-password-login input').value;
    return { user, password };
}
export function getInputRegister() {
    const name = document.querySelector('.registerContainer input[type="text"]').value;
    const email = document.querySelector('.registerContainer input[type="email"]').value;
    const password = document.querySelector('#bx-password-register input').value;
    const access = document.querySelector('.registerContainer #select-access').value;
    const entity = document.querySelector('.registerContainer #select-entity').value;
    return { name, email, password, access, entity };
}
/*-------------------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------session forms--------------------------------------------------*/
export function getInputCreateReport(context){
    const name = context.querySelector('.registerContainer input[type="text"]').value;
    const email = document.querySelector('.registerContainer input[type="email"]').value;
    const password = document.querySelector('#bx-password-register input').value;
    const access = document.querySelector('.registerContainer #select-access').value;
    const entity = document.querySelector('.registerContainer #select-entity').value;
    return { name, email, password, access, entity };
}
/*-------------------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------server--------------------------------------------------*/
export function getInputResetPassword() {
    const password = document.querySelector('#password-login').value;
    const confirmPassword = document.querySelector('#password-register').value;
    return { password, confirmPassword };
}
export async function getSearchParams(res = null) {
    if (res) {
        const decodeURL = decodeURIComponent(res);
        const url = new URL(decodeURL);
        let userName = url.searchParams.get('name');
        let userEmail = url.searchParams.get('email');
        let userAccess = url.searchParams.get('access');
        let userEntity = url.searchParams.get('entity');
        return { userName, userEmail, userAccess, userEntity };
    } else {
        const query = (await import('../firebase/query.js')).getQueryParams();
        let oobCode = query.oobCode;
        return { oobCode };
    }
}
/*-------------------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------clean windown--------------------------------------------------*/
export function cleanInputRegister() {
    const name = document.querySelector('.registerContainer input[type="text"]');
    const email = document.querySelector('.registerContainer input[type="email"]');
    const password = document.querySelector('#bx-password-register input');
    name.value = "";
    email.value = "";
    password.value = "";
}
/*-------------------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------globals--------------------------------------------------*/
export function elementById(nameContainer) { return document.getElementById(nameContainer) }
export function elementByClass(nameContainer) { return document.querySelector(nameContainer) }
/*-------------------------------------------------------------------------------------------------------------------*/
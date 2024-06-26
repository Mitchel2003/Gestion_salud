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
export function getInputCreateReport(context) {
    const id_device = context.querySelector('#create-report-idDevice').value;
    const time = context.querySelector('#create-report-time').value;
    const date = context.querySelector('#create-report-date').value;
    const subject = context.querySelector('#create-report-subject').value;
    const typeMaintenance = context.querySelector('#create-report-maintenance').value;
    const description = context.querySelector('#create-report-description').value;
    const avaliable = context.querySelector('#create-report-avaliable').checked;
    return {
        time: time,
        date: date,
        subject: subject,
        avaliable: avaliable,
        id_device: id_device,
        description: description,
        typeMaintenance: typeMaintenance
    };
}
export function getInputCreateDevice(context) {
    const serial = context.querySelector('#create-device-serial').value;
    const id_departament = context.querySelector('#create-device-departament').value;
    const warranty = context.querySelector('#create-device-warranty').value;
    const specifications = context.querySelector('#create-device-specifications').value;
    const avaliable = context.querySelector('#create-device-avaliable').checked;
    return {
        serial: serial,
        warranty: warranty,
        avaliable: avaliable,
        specifications: specifications,
        id_departament: id_departament
    };
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
export function cleanInputCreateReport(e) {
    const time = e.querySelector('#create-report-time').value = '';
    const date = e.querySelector('#create-report-date').value = '';
    const subject = e.querySelector('#create-report-subject').value = '';
    const id_device = e.querySelector('#create-report-idDevice').value = '';
    const description = e.querySelector('#create-report-description').value = '';
}
export function cleanInputCreateDevice(e) {
    const serial = e.querySelector('#create-device-serial').value = '';
    const specifications = e.querySelector('#create-device-specifications').value = '';
}
/*-------------------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------globals--------------------------------------------------*/
export function elementById(nameContainer) { return document.getElementById(nameContainer) }
export function elementByClass(nameContainer) { return document.querySelector(nameContainer) }
/*-------------------------------------------------------------------------------------------------------------------*/
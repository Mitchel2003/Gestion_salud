import { customAlert, selectIcon, alertButtonAction } from "../utils/alerts.js";
import { onSession, offSession } from "../firebase/authentication.js";
import { onLoadWhile, offLoadWhile } from "../utils/view.js";

export async function loginUser(user, password) {
    try {
        onLoadWhile();
        const { access, key } = await (await import('../firebase/query.js')).getDocumentUser(user);
        if (!(await (await import('../firebase/query.js')).isFoundDocumentReference(user))) {
            const { title, message, typeAlert } = (await import('../utils/alerts.js')).messageEmailNotFound();
            customAlert(title, message, selectIcon(typeAlert));
            offLoadWhile();
            return;
        }
        await onSession(user, password);//AC #208

        if (!key) {
            const { title, message, typeAlert } = (await import('../utils/alerts.js')).messageAccessNotFound();
            customAlert(title, message, selectIcon(typeAlert));
            await offSession();
            offLoadWhile();
            return;
        }
        (await import('../firebase/authentication.js')).preparateSessionWithAccess(access);
        offLoadWhile();
    } catch (error) { offLoadWhile(); (await import('../utils/alerts.js')).exceptionsLoginUser(error); }
}
export async function registerUser(name, email, password, access) {
    try {
        onLoadWhile();
        const getAuthMethod = await import('../firebase/authentication.js');
        const getAlert = await import('../utils/alerts.js');
        await getAuthMethod.createUser(email, password);
        await getAuthMethod.updateDataUser(name);
        await getAuthMethod.verificationEmailAddress(email, access);
        (await import('../utils/view.js')).cleanInputRegister();

        const { title, message, typeAlert } = getAlert.messageEmailVerify();
        customAlert(title, message, selectIcon(typeAlert));
        await offSession();
        offLoadWhile();
    } catch (error) { offLoadWhile(); (await import('../utils/alerts.js')).exceptionsRegisterUser(error); }
}
export async function requestResetPassword() {
    try {
        const getAlert = await import('../utils/alerts.js');
        const { title, message, typeAlert } = getAlert.messageRestorePassword();
        const email = await getAlert.alertInput(title, message, selectIcon(typeAlert));
        onLoadWhile();

        if (!(await (await import('../firebase/query.js')).isFoundDocumentReference(email))) {
            const { title, message, typeAlert } = getAlert.messageEmailNotFound();
            customAlert(title, message, selectIcon(typeAlert));
            offLoadWhile();
            return;
        }
        await (await import('../firebase/authentication.js')).sendToEmailResetPassword(email);

        const { title2, message2, typeAlert2 } = getAlert.messageTokenSubmitted();
        customAlert(title2, message2, selectIcon(typeAlert2));
        offLoadWhile();
    } catch (error) { offLoadWhile(); (await import('../utils/alerts.js')).exceptionsResetPassword(error); }
}

/*--------------------------------------------------on session--------------------------------------------------*/
export async function modeAuxiliary() {

    //side bar
    document.getElementById('menu-action').addEventListener('click', () => { document.querySelector('.side-bar').classList.add('spawn'); });
    document.getElementById('close-action').addEventListener('click', () => { document.querySelector('.side-bar').classList.remove('spawn'); });

    // timeOut
    let time;
    document.addEventListener('visibilitychange', async () => await handleTimeOut(time));
    document.removeEventListener('visibilitychange', async () => await handleTimeOut(time));
    // resetTimeInactivity(timeInactivity);
}
export async function modeAuditor() {

}
export async function modeAdmin() {

}
async function handleTimeOut(temp) {
    if (document.visibilityState === 'visible') { (await import('../firebase/authentication.js')).disableTimeInactivity(temp); }
    else { (await import('../firebase/authentication.js')).enableTimeInactivity(temp); }
}
/*--------------------------------------------------server--------------------------------------------------*/
export async function modeVerifyEmail(res) {
    onLoadWhile();
    const decodeURL = decodeURIComponent(res);
    const url = new URL(decodeURL);
    const userEmail = url.searchParams.get('email');
    const userAccess = url.searchParams.get('access');

    if (await (await import('../firebase/query.js')).isFoundDocumentReference(userEmail)) {
        const { title, message, typeAlert } = (await import('../utils/alerts.js')).messageTokenVerifyExpired();
        const response = await alertButtonAction(title, message, selectIcon(typeAlert));
        if (response) { (await import('../utils/view.js')).goToHome(); }
        offLoadWhile();
        return;
    }
    await (await import('../firebase/authentication.js')).appenedDocumentReference(userEmail, userAccess);

    const { title, message, typeAlert } = (await import('../utils/alerts.js')).messageUserSubmitted();
    const response = await alertButtonAction(title, message, selectIcon(typeAlert));
    if (response) { (await import('../utils/view.js')).goToHome(); }
    await offSession();
    offLoadWhile();
}
export async function modeChangePassword() {
    const resetButton = document.getElementById('resetPassword_form');
    resetButton.addEventListener('submit', async function (event) {//AC #204
        try {
            event.preventDefault();
            onLoadWhile();
            const query = (await import('../routes/routes.js')).getQueryParams();
            const oobCode = query.oobCode;
            const password = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (checkSamePasswords(password, confirmPassword)) {
                const { title, message, typeAlert } = (await import('../utils/alerts.js')).messagePasswordNotSame();
                customAlert(title, message, selectIcon(typeAlert));
                offLoadWhile(); return;
            } if (checkSizeAllowed(password)) {
                const { title, message, typeAlert } = (await import('../utils/alerts.js')).messagePasswordSizeShort();
                customAlert(title, message, selectIcon(typeAlert));
                offLoadWhile(); return;
            }
            await (await import('../firebase/authentication.js')).validateResetPassword(oobCode, password);

            const { title, message, typeAlert } = (await import('../utils/alerts.js')).messageResetPasswordSuccess();
            const request = await alertButtonAction(title, message, selectIcon(typeAlert));
            if (request) { (await import('../utils/view.js')).goToHome(); }
            await offSession();
            offLoadWhile();
        } catch (error) { offLoadWhile(); (await import('../utils/alerts.js')).exceptionsChangePassword(error); }
    });
}
/*--------------------------------------------------tools--------------------------------------------------*/
function checkSamePasswords(item_1, item_2) {
    if (item_1 !== item_2) { return item_1; }
}
function checkSizeAllowed(item) {
    if (item.length < 6) { return item; }
}

// class UIManager {
//   constructor() {
//     this.initListeners();
//   }
//   initListeners() {
//     document.getElementById('menu-action').addEventListener('click', this.toggleSideBar.bind(this, true));
//     document.getElementById('close-action').addEventListener('click', this.toggleSideBar.bind(this, false));
//   }
//   toggleSideBar(open) {
//     const sideBar = document.querySelector('.side-bar');
//     open ? sideBar.classList.add('spawn') : sideBar.classList.remove('spawn');
//   }
// }
// export default UIManager;
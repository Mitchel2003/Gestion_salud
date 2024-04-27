import { onSession, offSession } from "../firebase/authentication.js";
import { onLoadWhile, offLoadWhile } from "../utils/view.js";
import { showMessage } from "../utils/alerts.js";

const getAlert = await import('../utils/alerts.js');

export async function loginUser(user, password) {
    try {
        onLoadWhile();
        const getQuery = await import('../firebase/query.js');
        const getAuth = await import('../firebase/authentication.js');

        await onSession(user, password);//AC #208
        const { entity } = await getAuth.getProfileUser();
        const { key } = await getQuery.getDocumentUser(user, entity);

        if (!(await getQuery.isFoundDocumentReference(user, entity))) {
            await showMessage('messageEmailNotFound', 'default');
            await offSession(); offLoadWhile(); return;
        } if (!key) {
            await showMessage('messageAccessNotFound', 'default');
            await offSession(); offLoadWhile(); return;
        }

        (await import('../utils/view.js')).goToSession();
        offLoadWhile();
    } catch (error) { offLoadWhile(); await getAlert.exceptionsLoginUser(error); }
}
export async function registerUser(name, email, password, access, entity) {
    try {
        onLoadWhile();
        const getAuth = await import('../firebase/authentication.js');
        await getAuth.createUser(email, password);
        await getAuth.updateDataUser(name, entity);
        await getAuth.verificationEmailAddress(name, email, access, entity);
        (await import('../utils/values.js')).cleanInputRegister();

        await showMessage('messageEmailVerify', 'default');
        await offSession();
        offLoadWhile();
    } catch (error) { offLoadWhile(); await getAlert.exceptionsRegisterUser(error); }
}
export async function requestResetPassword() {
    try {
        const email = await showMessage('messageRestorePassword', 'alertInput');
        onLoadWhile();
        await (await import('../firebase/authentication.js')).sendToEmailResetPassword(email);
        await showMessage('messageTokenSubmitted', 'default');
        offLoadWhile();
    } catch (error) { offLoadWhile(); await getAlert.exceptionsResetPassword(error); }
}
/*--------------------------------------------------server--------------------------------------------------*/
export async function modeVerifyEmail(res) {
    onLoadWhile();
    const decodeURL = decodeURIComponent(res);
    const url = new URL(decodeURL);
    const userName = url.searchParams.get('name');
    const userEmail = url.searchParams.get('email');
    const userAccess = url.searchParams.get('access');
    const userEntity = url.searchParams.get('entity');

    const getQuery = await import('../firebase/query.js');
    const getView = await import('../utils/view.js');

    if (await getQuery.isFoundDocumentReference(userEmail, userEntity)) {
        const response = await showMessage('messageTokenVerifyExpired', 'alertButtonAction');
        if (response) { getView.goToHome(); }
        offLoadWhile(); return;
    }
    await (await import('../firebase/authentication.js')).appenedDocumentReference(userName, userEmail, userAccess, userEntity);

    const response = await showMessage('messageUserSubmitted', 'alertButtonAction');
    if (response) { getView.goToHome(); }
    await offSession();
    offLoadWhile();
}
export async function modeChangePassword() {
    const getView = await import("../utils/view.js");
    const srcIconOpen = "../../src/components/images/eye-open.webp", srcIconClose = "../../src/components/images/eye-close.webp";
    let observerIconEye_newPassword = new getView.IconEye('#eyeIcon-1', '#password-login', srcIconOpen, srcIconClose);
    let observerIconEye_confirmPassword = new getView.IconEye('#eyeIcon-2', '#password-register', srcIconOpen, srcIconClose);

    document.getElementById('resetPassword_form').addEventListener('submit', async function (event) {//AC #204
        try {
            event.preventDefault();
            onLoadWhile();
            const query = (await import('../firebase/query.js')).getQueryParams();
            const oobCode = query.oobCode;
            const password = document.querySelector('#password-login').value;
            const confirmPassword = document.querySelector('#password-register').value;

            if (checkSamePasswords(password, confirmPassword)) {
                await showMessage('messagePasswordNotSame', 'default');
                offLoadWhile(); return;
            }
            if (checkSizeAllowed(password)) {
                await showMessage('messagePasswordSizeShort', 'default');
                offLoadWhile(); return;
            }
            await (await import('../firebase/authentication.js')).validateResetPassword(oobCode, password);

            const request = await showMessage('messageResetPasswordSuccess', 'alertButtonAction');
            if (request) { (await import('../utils/view.js')).goToHome(); }
            await offSession();
            offLoadWhile();
        } catch (error) { offLoadWhile(); await showMessage('messageTokenExpired', 'default'); }
    });
}
/*--------------------------------------------------tools--------------------------------------------------*/
function checkSamePasswords(item_1, item_2) {
    if (item_1 !== item_2) { return item_1; }
}
function checkSizeAllowed(item) {
    if (item.length < 6) { return item; }
}

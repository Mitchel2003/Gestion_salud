import { onSession, offSession } from "../firebase/authentication.js";
import { onLoadWhile, offLoadWhile } from "../utils/view.js";
import { showMessage } from "../utils/alerts.js";
/*--------------------------------------------------controllers--------------------------------------------------*/
const getAlert = await import('../utils/alerts.js');
export async function loginUser(user, password) {
    try {
        onLoadWhile();
        const {getProfileUser, getDocumentUser} = await import('../firebase/query.js');
        await onSession(user, password);//AC #208
        const { entity } = getProfileUser();
        const { key, access: userFound } = await getDocumentUser(user, entity);

        if (!userFound) {
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
        if (!access || !entity) { await showMessage('messageSelectEmpty', 'default'); offLoadWhile(); return; }
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
        if (email) { await (await import('../firebase/authentication.js')).sendToEmailResetPassword(email); await showMessage('messageTokenSubmitted', 'default'); }
        offLoadWhile();
    } catch (error) { offLoadWhile(); await getAlert.exceptionsResetPassword(error); }
}
/*--------------------------------------------------server--------------------------------------------------*/
export async function modeVerifyEmail(res) {
    onLoadWhile();
    const {getDocumentUser} = await import('../firebase/query.js');
    const {getSearchParams} = await import('../utils/values.js');
    const {goToHome} = await import('../utils/view.js');

    const { userName, userEmail, userAccess, userEntity } = await getSearchParams(res);
    const { access: userFound } = await getDocumentUser(userEmail, userEntity);
    if (userFound) {
        const response = await showMessage('messageTokenVerifyExpired', 'alertButtonAction');
        if (response) goToHome();
        offLoadWhile(); return;
    }
    await (await import('../firebase/authentication.js')).appenedDocumentReference(userName, userEmail, userAccess, userEntity);

    const response = await showMessage('messageUserSubmitted', 'alertButtonAction');
    if (response) goToHome();
    await offSession();
    offLoadWhile();
}
export async function modeChangePassword() {
    const {getSearchParams, getInputResetPassword, elementById} = await import("../utils/values.js");
    const {setIconEye, goToHome} = await import("../utils/view.js");

    const srcIconOpen = "../../src/components/images/eye-open.webp";
    const srcIconClose = "../../src/components/images/eye-close.webp";
    setIconEye('#eyeIcon-1', '#password-login', srcIconOpen, srcIconClose);
    setIconEye('#eyeIcon-2', '#password-register', srcIconOpen, srcIconClose);

    elementById('resetPassword_form').addEventListener('submit', async function (event) {//AC #204
        try { event.preventDefault();
            onLoadWhile();
            const { oobCode } = await getSearchParams();
            const { password, confirmPassword } = getInputResetPassword();

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
            if (request) goToHome();
            await offSession();
            offLoadWhile();
        } catch (error) { offLoadWhile(); await showMessage('messageTokenExpired', 'default'); }
    });
}
/*--------------------------------------------------tools--------------------------------------------------*/
function checkSamePasswords(item_1, item_2) { if (item_1 !== item_2) return item_1 }
function checkSizeAllowed(item) { if (item.length < 6) return item }
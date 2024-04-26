import { onSession, offSession } from "../firebase/authentication.js";
import { onLoadWhile, offLoadWhile } from "../utils/view.js";
import { showMessageAlert } from "../utils/alerts.js";

const getAlert = await import('../utils/alerts.js');

export async function loginUser(user, password) {//working here...
    try {
        onLoadWhile();
        await onSession(user, password);//AC #208

        const getQuery = await import('../firebase/query.js');
        const { entity } = getQuery.getProfileUser();
        const { key } = await getQuery.getDocumentUser(user, entity);

        if (!(await getQuery.isFoundDocumentReference(user, entity))) {
            await showMessageAlert('messageEmailNotFound');
            offLoadWhile();
            return;
        }
        

        if (!key) {
            await showMessageAlert('messageAccessNotFound');
            await offSession();
            offLoadWhile();
            return;
        }
        (await import('../utils/view.js')).goToSession();
        offLoadWhile();
    } catch (error) { offLoadWhile(); getAlert.exceptionsLoginUser(error); }
}
export async function registerUser(name, email, password, access, entity) {
    try {
        onLoadWhile();
        const getAuth = await import('../firebase/authentication.js');
        await getAuth.createUser(email, password);
        await getAuth.updateDataUser(name, entity);
        await getAuth.verificationEmailAddress(name, email, access, entity);
        (await import('../utils/values.js')).cleanInputRegister();

        await showMessageAlert('messageEmailVerify');
        await offSession();
        offLoadWhile();
    } catch (error) { offLoadWhile(); getAlert.exceptionsRegisterUser(error); }
}
export async function requestResetPassword() {
    try {
        const email = await showMessageAlert('messageRestorePassword');
        onLoadWhile();

        const getQuery = await import('../firebase/query.js');
        const getAuth = await import('../firebase/authentication.js');

        if ( !(await getQuery.isFoundDocumentReference(email)) ) {
            await showMessageAlert('messageEmailNotFound');
            offLoadWhile();
            return;
        }
        await getAuth.sendToEmailResetPassword(email);
        await showMessageAlert('messageTokenSubmitted');
        offLoadWhile();
    } catch (error) { offLoadWhile(); getAlert.exceptionsResetPassword(error); }
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
        const response = await showMessageAlert('messageTokenVerifyExpired');
        if (response) { getView.goToHome(); }
        offLoadWhile();
        return;
    }
    await (await import('../firebase/authentication.js')).appenedDocumentReference(userName, userEmail, userAccess, userEntity );

    const response = await showMessageAlert('messageUserSubmitted');
    if (response) { getView.goToHome(); }
    await offSession();
    offLoadWhile();
}
export async function modeChangePassword() {
    const getView = await import("../utils/view.js");

    const srcIconOpen = "../../src/components/images/eye-open.webp", srcIconClose = "../../src/components/images/eye-close.webp"; 
    let observerIconEye_newPassword = new getView.IconEye('#eyeIcon-1', '#password-login', srcIconOpen, srcIconClose);
    let observerIconEye_confirmPassword = new getView.IconEye('#eyeIcon-2', '#password-register',srcIconOpen ,srcIconClose);
    
    document.getElementById('resetPassword_form').addEventListener('submit', async function (event) {//AC #204
        try {
            event.preventDefault();
            onLoadWhile();
            const query = (await import('../firebase/query.js')).getQueryParams();
            const oobCode = query.oobCode;
            const password = document.querySelector('#password-login').value;
            const confirmPassword = document.querySelector('#password-register').value;

            if (checkSamePasswords(password, confirmPassword)) {
                await showMessageAlert('messagePasswordNotSame');
                offLoadWhile(); return;
            }
            if (checkSizeAllowed(password)) {
                await showMessageAlert('messagePasswordSizeShort');
                offLoadWhile(); return;
            }
            await (await import('../firebase/authentication.js')).validateResetPassword(oobCode, password);

            const request = await showMessageAlert('messageResetPasswordSuccess');
            if (request) { (await import('../utils/view.js')).goToHome(); }
            await offSession();
            offLoadWhile();
        } catch (error) { offLoadWhile(); getAlert.exceptionsChangePassword(); }
    });
}
/*--------------------------------------------------tools--------------------------------------------------*/
function checkSamePasswords(item_1, item_2) {
    if (item_1 !== item_2) { return item_1; }
}
function checkSizeAllowed(item) {
    if (item.length < 6) { return item; }
}

import { customAlert, selectIcon } from "../utils/alerts.js";
import { onSession, offSession } from "../firebase/query.js";
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
    } catch (error) { (await import('../utils/alerts.js')).exceptionsLoginUser(error); offLoadWhile(); }
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
    } catch (error) { (await import('../utils/alerts.js')).exceptionsRegisterUser(error); offLoadWhile(); }
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
        await (await import('../firebase/query.js')).sendToEmailResetPassword(email);

        const { title2, message2, typeAlert2 } = getAlert.messageTokenSubmitted();
        customAlert(title2, message2, selectIcon(typeAlert2));
        offLoadWhile();
    } catch (error) { (await import('../utils/alerts.js')).exceptionsResetPassword(error); offLoadWhile(); }
}


export async function modeAuxiliary() {
    const getAuthentication = await import('../firebase/authentication.js');
    let inactivityTime;

    //side bar
    document.getElementById('menu-action').addEventListener('click', () => { document.querySelector('.side-bar').classList.add('spawn'); });
    document.getElementById('close-action').addEventListener('click', () => { document.querySelector('.side-bar').classList.remove('spawn'); });

    //inactivity time
    getAuthentication.resetTimeInactivity(inactivityTime);
    document.addEventListener('mousemove', getAuthentication.resetTimeInactivity(inactivityTime));
    document.addEventListener('keypress', getAuthentication.resetTimeInactivity(inactivityTime));
}
export async function modeAuditor() {

}
export async function modeAdmin() {

}
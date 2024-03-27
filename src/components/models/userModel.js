import { customAlert, selectIcon } from "../utils/alerts.js";
import { onSession, offSession } from "../firebase/query.js";
import { onLoadWhile, offLoadWhile } from "../utils/view.js";

export async function loginUser(user, password) {
    try {
        onLoadWhile();
        const getAlert = await import('../utils/alerts.js');
        const { key } = await (await import('../firebase/query.js')).getDocumentUser(user);
        if (!(await (await import('../firebase/query.js')).isFoundDocumentReference(user))) {
            const { title, message, typeAlert } = getAlert.messageEmailNotFound();
            customAlert(title, message, selectIcon(typeAlert)); offLoadWhile();
            return;
        } await onSession(user, password);
        if (!key) {
            const { title, message, typeAlert } = getAlert.messageAccessNotFound();
            customAlert(title, message, selectIcon(typeAlert));
            await offSession(); offLoadWhile();
            return;
        }
        //go to session
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
        (await import('../utils/view.js')).removeActive(document.querySelector('.mainContainer'));

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
            customAlert(title, message, selectIcon(typeAlert)); offLoadWhile();
            return;
        }
        await (await import('../firebase/query.js')).sendToEmailResetPassword(email);

        const { title2, message2, typeAlert2 } = getAlert.messageTokenSubmitted();
        customAlert(title2, message2, selectIcon(typeAlert2));
        offLoadWhile();
    } catch (error) { (await import('../utils/alerts.js')).exceptionsResetPassword(error); offLoadWhile(); }
}
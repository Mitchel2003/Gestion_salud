import { customAlert, selectIcon } from "../utils/alerts.js";
import { offSession, onSession } from "../firebase/query.js";

export async function loginUser(user, password) {
    try {
        const getAlert = await import('../utils/alerts.js');
        if (!(await (await import('../firebase/query.js')).isFoundDocumentReference(user))) {
            const { title, message, typeAlert } = getAlert.messageEmailNotFound();
            customAlert(title, message, selectIcon(typeAlert)); 
            return;
        }
        const { key } = await (await import('../firebase/query.js')).getDocumentUser(user);
        if (!key) {
            const { title, message, typeAlert } = getAlert.messageEmailWithoutAccess();
            customAlert(title, message, selectIcon(typeAlert)); 
            return;
        }
        await onSession(user, password);
        console.log("signIn successfull");
    } catch (error) { (await import('../utils/alerts.js')).exceptionsLoginUser(error); }
}
export async function registerUser(name, email, password, access) {
    try {
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
    } catch (error) { (await import('../utils/alerts.js')).exceptionsRegisterUser(error); }
}
export async function requestResetPassword() {
    try {
        const getAlert = await import('../utils/alerts.js');
        const { title, message, typeAlert } = getAlert.messageRestorePassword();
        const email = await getAlert.alertInput(title, message, selectIcon(typeAlert));

        if (!(await (await import('../firebase/query.js')).isFoundDocumentReference(email))) {
            const { title, message, typeAlert } = getAlert.messageEmailNotFound();
            customAlert(title, message, selectIcon(typeAlert));
            return;
        }
        await (await import('../firebase/query.js')).sendToEmailResetPassword(email);

        const { title2, message2, typeAlert2 } = getAlert.messageTokenSubmitted();
        customAlert(title2, message2, selectIcon(typeAlert2));
    } catch (error) { (await import('../utils/alerts.js')).exceptionsResetPassword(error); }
}
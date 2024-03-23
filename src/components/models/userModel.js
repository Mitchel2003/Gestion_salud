import { customAlert, selectIcon } from "../utils/alerts.js";
import { offSession, onSession } from "../firebase/query.js";
import { auth } from "../firebase/conection.js";

export async function loginUser(user, password) {
    try {
        const userContext = await onSession(user, password);
        console.log(userContext);

    } catch (error) { (await import('../utils/alerts.js')).exceptionsLoginUser(error); }
}
export async function registerUser(name, email, password, access) {
    try {
        const getAuthMethod = await import('../firebase/authentication.js');
        const getAlert = await import('../utils/alerts.js');

        await getAuthMethod.createUser(auth, email, password);
        await getAuthMethod.updateDataUser(auth, name);
        await getAuthMethod.verificationEmailAddress(auth, email, access);

        (await import('../utils/view.js')).cleanInputRegister();
        (await import('../utils/view.js')).removeActive(document.querySelector('.mainContainer'));

        const { title, message, typeAlert } = getAlert.messageEmailVerify();
        customAlert(title, message, selectIcon(typeAlert));
        await offSession();
    } catch (error) { (await import('../utils/alerts.js')).exceptionsRegisterUser(error); }
}
export async function requestResetPassword() {//working here... debugging
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
    } catch (error) { (await import('../utils/alerts.js')).exceptionsRequestResetPassword(error); }
}
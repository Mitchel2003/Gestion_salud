import { auth, createUserWithEmailAndPassword, updateProfile } from "../firebase/conection.js";
import { exceptionsRegisterUser } from "../utils/alerts.js";
import { customAlert, selectIcon } from "../utils/alerts.js";

export async function loginUser(user, password) {
    try {
        const getQuery = await import('../firebase/query.js');
        const getAlert = await import('../utils/alerts.js');

        if (!(await getQuery.onSession(user, password))) {
            const { title, message, typeAlert } = getAlert.messageUserNotFound();
            customAlert(title, message, selectIcon(typeAlert));
            return;
        }
        if (!(await getQuery.isFoundAccess())) {
            const { title, message, typeAlert } = getAlert.messageUserWithoutAccess();
            customAlert(title, message, selectIcon(typeAlert));
            (await import('../firebase/query.js')).offSession();
            return;
        }

        //send to session
        (await import('../utils/view.js')).goToSession();
    } catch (error) {
        throw new Error('login_user: ' + error);
    }
}
export async function registerUser(name, email, password, access) {
    try {
        const getAuthMethod = await import('../firebase/authentication.js');
        const getAlert = await import('../utils/alerts.js');

        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        const userProfile = await updateProfile(auth.currentUser, { displayName: name });
        console.log(userCredentials);

        //clean view
        (await import('../utils/cleaner.js')).cleanInputRegister();
        (await import('../utils/view.js')).removeActive(document.querySelector('.mainContainer'));

        if (!(await getAuthMethod.checkEmailAddress(auth))) {
            const { title, message, typeAlert } = getAlert.messageEmailCheckout();
            customAlert(title, message, selectIcon(typeAlert));
            return;
        }
        const { title, message, typeAlert } = getAlert.messageUserSubmitted();
        customAlert(title, message, selectIcon(typeAlert));

    } catch (error) {
        exceptionsRegisterUser(error);
    }
}
export async function requestResetPassword() {
    try {
        const getAlert = await import('../utils/alerts.js');
        const { title, message, typeAlert } = getAlert.messageRestorePassword();
        const email = await getAlert.alertInput(title, message, selectIcon(typeAlert));

        if (!(await isFoundEmail(email))) {
            const { title, message, typeAlert } = getAlert.messageUserNotFound();
            customAlert(title, message, selectIcon(typeAlert));
            return;
        }
        await (await import('../firebase/query.js')).sendToEmailResetPassword(email);

        const { title2, message2, typeAlert2 } = getAlert.messageTokenSubmitted();
        customAlert(title2, message2, selectIcon(typeAlert2));
    } catch (error) {
        throw new Error('request_resetPassword: ' + error);
    }
}
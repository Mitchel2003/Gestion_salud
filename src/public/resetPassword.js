import { validateResetPassword, offSession } from '../components/firebase/query.js';
import { customAlert, selectIcon } from '../components/utils/alerts.js';

const form = document.getElementById('resetPassword_form');

form.addEventListener('submit', async function (event) {
    event.preventDefault();
    const getAlerts = await import('../components/utils/alerts.js');

    const oobCode = getCodeOob();
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (checkSamePasswords(password, confirmPassword)) {
        const { title, message, typeAlert } = getAlerts.messagePasswordNotSame();
        customAlert(title, message, selectIcon(typeAlert));
        return;
    }
    if (checkSizeAllowed(password)) {
        const { title, message, typeAlert } = getAlerts.messagePasswordSizeShort();
        customAlert(title, message, selectIcon(typeAlert));
        return;
    }

    if (!(await validateResetPassword(oobCode, password))) {
        const { title, message, typeAlert } = getAlerts.messageTokenExpired();
        customAlert(title, message, selectIcon(typeAlert));
        throw new Error('Token expired');
    }

    const { title, message, typeAlert } = getAlerts.messageResetPasswordSuccess();
    const request = await getAlerts.alertButtonAction(title, message, selectIcon(typeAlert));
    if (request) {
        (await import('../components/utils/view.js')).goToHome();
    }
    await offSession();
});
/*--------------------------------------------------tools--------------------------------------------------*/
function checkSamePasswords(item_1, item_2) {
    if (item_1 !== item_2) { return item_1; }
}
function checkSizeAllowed(newPassword) {
    if (newPassword.length <= 6) { return newPassword; }
}
function getCodeOob() {
    const queryString = window.location.search;
    const searchParams = new URLSearchParams(queryString);
    return searchParams.get('oobCode');
}
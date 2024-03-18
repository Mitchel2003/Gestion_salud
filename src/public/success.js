import { validateResetPassword } from '../components/firebase/query.js';
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

    try {
        if (oobCode) {
            await validateResetPassword(oobCode, password);
        }
    } catch (error) {
        const { title, message, typeAlert } = (await import('../components/utils/alerts.js')).messageTokenExpired();
        customAlert(title, message, selectIcon(typeAlert));
        return;
    }

    const { title, message, typeAlert } = getAlerts.messageResetPasswordSuccess();
    customAlert(title, message, selectIcon(typeAlert));

    // //send to login with sweetAlert message, button to go
    // window.location.href = 'https://mitchel2003.github.io/Gestion_salud/';
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




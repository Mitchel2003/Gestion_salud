import { validateResetPassword } from '../components/firebase/query.js';
import { customAlert, selectIcon } from '../components/utils/alerts.js';

try {
    const form = document.getElementById('resetPassword_form');

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        const getAlerts = await import('../components/utils/alerts.js');

        const oobCode = getCodeOob();
        const password = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!(await areEqualsPasswords(password, confirmPassword))) {
            const { title, message, typeAlert } = getAlerts.messagePasswordNotSame();
            customAlert(title, message, selectIcon(typeAlert));
            return;
        }
        if (!(await isAllowedSize(password))) {
            const { title, message, typeAlert } = getAlerts.messagePasswordSizeShort();
            customAlert(title, message, selectIcon(typeAlert));
            return;
        }

        if (oobCode) {
            await validateResetPassword(oobCode, password);
        }

        const { title, message, typeAlert } = getAlerts.messageResetPasswordSuccess();
        customAlert(title, message, selectIcon(typeAlert));



        // //send to login with sweetAlert message, button to go
        // window.location.href = 'https://mitchel2003.github.io/Gestion_salud/';
    });
} catch (error) {
    const { title, message, typeAlert } = (await import('../components/utils/alerts.js')).messageTokenExpired();
    customAlert(title, message, selectIcon(typeAlert));

    console.log(error);
}


async function areEqualsPasswords(item_1, item_2) {
    if (item_1 !== item_2) {
        return true;
    } return false;
}
async function isAllowedSize(newPassword) {
    if (newPassword.length <= 6) {
        return true;
    } return false;
}
async function checkoutError(error) {
    if (error.code === 'auth/invalid-action-code') {
        const { title, message, typeAlert } = (await import('../components/utils/alerts.js')).messageTokenExpired();
        customAlert(title, message, selectIcon(typeAlert));
        return;
    }
}
function getCodeOob() {
    const queryString = window.location.search;
    const searchParams = new URLSearchParams(queryString);
    return searchParams.get('oobCode');
}




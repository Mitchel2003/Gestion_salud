import { validateResetPassword } from '../components/firebase/query.js';
import { customAlert, selectIcon } from '../components/utils/alerts.js';

try {
    const form = document.getElementById('resetPassword_form');

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        const getAlerts=await import('../components/utils/alerts.js');

        const obbCode = getCodeObb();
        const password = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        await areEqualsPasswords(password, confirmPassword, getAlerts);
        await isAllowedSize(password, getAlerts);

        if (await validateResetPassword(obbCode, password)) {
            const { title, message, typeAlert } = getAlerts.messageResetPasswordSuccess();
            customAlert(title, message, selectIcon(typeAlert)); 
        }

        // const { title, message, typeAlert } = (await import('../components/utils/alerts.js')).messageTokenExpired();
        // customAlert(title, message, selectIcon(typeAlert)); 

        // //send to login with sweetAlert message, button to go
        // window.location.href = 'https://mitchel2003.github.io/Gestion_salud/';
    });
} catch (error) {
    checkoutError(error);
    console.log(error);
}


async function areEqualsPasswords(item_1, item_2, alerts) {
    if (item_1 !== item_2) {
        const { title, message, typeAlert } = alerts.messagePasswordNotSame();
        customAlert(title, message, selectIcon(typeAlert));
        return;
    }
}
async function isAllowedSize(newPassword, alerts) {
    if (newPassword.length <= 6) {
        const { title, message, typeAlert } = alerts.messagePasswordSizeShort();
        customAlert(title, message, selectIcon(typeAlert));
        return;
    }
}
async function checkoutError(error) {
    if (error.code === 'auth/invalid-action-code') {
        const { title, message, typeAlert } = (await import('../components/utils/alerts.js')).messageTokenExpired();
        customAlert(title, message, selectIcon(typeAlert));
        return;
    }
}
function getCodeObb() {
    const queryString = window.location.search;
    const searchParams = new URLSearchParams(queryString);
    return searchParams.get('oobCode');
}




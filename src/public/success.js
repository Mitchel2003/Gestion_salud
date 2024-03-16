import { validateResetPassword } from '../components/firebase/query.js';
import { customAlert, selectIcon } from '../components/utils/alerts.js';

try {
    const form = document.getElementById('resetPassword_form');

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        const obbCode = getCodeObb();
        const password = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        await checkoutPassword(password, confirmPassword);

        if (!(await validateResetPassword(obbCode, password))) {
            console.log("something whats wrong");
        }

        const { title, message, typeAlert } = (await import('../components/utils/alerts.js')).messageResetPasswordSuccess();
        customAlert(title, message, selectIcon(typeAlert));

        // //send to login with sweetAlert message, button to go
        // window.location.href = 'https://mitchel2003.github.io/Gestion_salud/';
    });
} catch (error) {
    checkoutError(error);
}


// fetch('URL_DE_TU_API', {
//     method: 'POST',
//     body: JSON.stringify({ oobCode, newPassword }),
//     headers: {
//         'Content-Type': 'application/json'
//     }
// }).then(response => {
//     if (response.ok) {

//     } else {

//     }
// }).catch(error => {
//     console.error('Error:', error);
// });


async function checkoutPassword(item_1, item_2) {
    if (item_1 !== item_2) {
        const { title, message, typeAlert } = (await import('../components/utils/alerts.js')).messagePasswordNotSame();
        customAlert(title, message, selectIcon(typeAlert));
        return;
    }
}
async function checkoutError(error) {
    if (error.code === 'auth/invalid-action-code') {
        const { title, message, typeAlert } = (await import('../components/utils/alerts.js')).messageTokenExpired();
        customAlert(title, message, selectIcon(typeAlert));
    } return;
}
function getCodeObb() {
    const queryString = window.location.search;
    const searchParams = new URLSearchParams(queryString);
    return searchParams.get('oobCode');
}




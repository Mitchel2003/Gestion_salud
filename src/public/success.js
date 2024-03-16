import { validateResetPassword } from '../components/firebase/query.js';
import { customAlert, selectIcon } from '../components/utils/alerts.js';

try {
    console.log("message receive");

    const form=document.getElementById('resetPassword_form');

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        
        const password = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        await checkoutPassword(password, confirmPassword);

        console.log("first checkpoint");

        const obbCode = getCodeObb();
        await validateResetPassword(obbCode, password);

        console.log("second checkpoint");

        const { title, message, typeAlert } = (await import('../components/utils/alerts.js')).messageResetPasswordSuccess();
        customAlert(title, message, selectIcon(typeAlert));


        console.log("endpoint");
        // //send to login with sweetAlert message, button to go
        // window.location.href = 'https://mitchel2003.github.io/Gestion_salud/';
    });

} catch (error) {
    console.log(error);
}


async function checkoutPassword(item_1, item_2) {
    if (item_1 !== item_2) { 
        const { title, message, typeAlert } = (await import('../components/utils/alerts.js')).messagePasswordNotSame();
        customAlert(title, message, selectIcon(typeAlert));
        return; 
    }
}
function getCodeObb() {
    const queryString = window.location.search;
    const searchParams = new URLSearchParams(queryString);
    return searchParams.get('oobCode');
}



import { alertButtonAction, customAlert, selectIcon } from '../components/utils/alerts.js';

const query = getQueryParams();
const continueURL = query.continueUrl;
const pageContext = setContext(continueURL);
document.body.innerHTML = pageContext;

await setFunctions(continueURL);

function setContext(res) {//AC #205
    if (res) {
        document.title = "Verify email";
        return `   
        <div class="container p-4">
            <div class="row">
                <div class="col-md-6 offset-md-3">
                    <div class="card">
                        <div class="card-body text-center">
                            <h2 class="mb-4">Your email has been verified</h2>
                            <p class="mb-0">You can now sign in with your new account</p>
                        </div>
                    </div>
                </div>
            </div>    
        </div>
        `;
    } else {
        document.title = "Reset password";
        return `
        <div class="container p-4">
            <div class="row">
                <div class="col-md-6 offset-md-3">
                    <div class="card">
                        <div class="card-body text-center">
                            <h2 class="mb-4">Enter your new password</h2>
                            <form id="resetPassword_form">
                                <div class="form-group">
                                    <input type="password" class="form-control" id="newPassword" placeholder="Password" required>
                                </div>
                                <div class="form-group">
                                    <input type="password" class="form-control" id="confirmPassword" placeholder="Confirm password" required>
                                </div>
                                <button type="submit" class="btn btn-primary btn-block">Reset Password</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div> 
        </div>
        `;
    }
}
async function setFunctions(res) {
    if (res) {//verifyEmail
        const decodeURL = decodeURIComponent(res);
        const url = new URL(decodeURL);
        const userEmail = url.searchParams.get('email');
        const userAccess = url.searchParams.get('access');

        if (await (await import('../components/firebase/query.js')).isFoundDocumentReference(userEmail)) {
            const { title, message, typeAlert } = (await import('../components/utils/alerts.js')).messageTokenVerifyExpired();
            const response = await alertButtonAction(title, message, selectIcon(typeAlert));
            if (response) { (await import('../components/utils/view.js')).goToHome(); }
            return;
        }
        await (await import('../components/firebase/authentication.js')).appenedDocumentReference(userEmail, userAccess);

        const { title, message, typeAlert } = (await import('../components/utils/alerts.js')).messageUserSubmitted();
        const response = await alertButtonAction(title, message, selectIcon(typeAlert));
        if (response) { (await import('../components/utils/view.js')).goToHome(); }
        await (await import('../components/firebase/query.js')).offSession();

    } else {//resetPassword
        const form = document.getElementById('resetPassword_form');
        form.addEventListener('submit', async function (event) {//AC #204
            try {
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
                await (await import('../components/firebase/query.js')).validateResetPassword(oobCode, password);

                const { title, message, typeAlert } = getAlerts.messageResetPasswordSuccess();
                const request = await getAlerts.alertButtonAction(title, message, selectIcon(typeAlert));
                if (request) { (await import('../components/utils/view.js')).goToHome(); }
                await (await import('../components/firebase/query.js')).offSession();

            } catch (error) {
                const { title, message, typeAlert } = (await import('../components/utils/alerts.js')).messageTokenExpired();
                customAlert(title, message, selectIcon(typeAlert));
            }
        });
    }
}
/*--------------------------------------------------tools--------------------------------------------------*/
function checkSamePasswords(item_1, item_2) {
    if (item_1 !== item_2) { return item_1; }
}
function checkSizeAllowed(newPassword) {
    if (newPassword.length < 6) { return newPassword; }
}
function getCodeOob() {
    const queryString = window.location.search;
    const searchParams = new URLSearchParams(queryString);
    return searchParams.get('oobCode');
}
function getQueryParams() {
    const queryString = window.location.search;
    const searchParams = new URLSearchParams(queryString);
    return Object.fromEntries(searchParams.entries());
}
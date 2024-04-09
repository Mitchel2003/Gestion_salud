import { customAlert, selectIcon, alertButtonAction } from '../utils/alerts.js';
import { onLoadWhile, offLoadWhile } from '../utils/view.js';

onLoadWhile();
await fixContext();

async function fixContext(){
    const query = getQueryParams();
    const verify = query.continueUrl;
    const reset = query.oobCode;
    const access = query.key;
    if (verify || reset) { await managementAccount(verify); return; }
    await managementSession(access);
}
async function managementAccount(compare){
    if (compare) { const getContext = applyContext('verify'); document.body.innerHTML = getContext; await modeVerifyEmail(compare); 
    }else { const getContext = applyContext('reset'); document.body.innerHTML =  getContext; await modeChangePassword(); }
}async function managementSession(access){
    const getUserModel = await import('../models/userModel.js');
    if (access === 'auxiliary') { const getContext = applyContext('auxiliary'); document.body.innerHTML = getContext; await getUserModel.modeAuxiliary(); }
    else if (access === 'auditor') { const getContext = applyContext('auditor'); document.body.innerHTML = getContext; await getUserModel.modeAuditor(); }
    else { const getContext =  applyContext('admin'); document.body.innerHTML = getContext; await getUserModel.modeAdmin(); }
}
function applyContext(res) {//AC #205
    if (res === 'verify') {
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
    }
    if (res === 'reset') {
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
    if (res === 'auxiliary') {
        document.title = "Session";
        return `
        <nav>
            <ul class="side-bar">
                <li id="close-action"><a href="#"><svg xmlns="http://www.w3.org/2000/svg" height="26" viewBox="0 -960 960 960" width="26"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></a></li>
                <li><a href="#">inicio</a></li>
                <li><a href="#">about</a></li>
                <li><a href="#">blog</a></li>
            </ul>
            <ul>
                <li><a href="#">coding</a></li>
                <li><a href="#">inicio</a></li>
                <li><a href="#">about</a></li>
                <li><a href="#">blog</a></li>
                <li id="menu-action"><a href="#"><svg xmlns="http://www.w3.org/2000/svg" height="26" viewBox="0 -960 960 960" width="26"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg></a></li>
            </ul>
        </nav>
        `;
    }
    if (res === 'auditor') {
        document.title = "Session";
        return `
        
        `;
    }
    if (res === 'admin') {
        document.title = "Session";
        return `
        
        `;
    }
}
async function modeVerifyEmail(res){
    const decodeURL = decodeURIComponent(res);
    const url = new URL(decodeURL);
    const userEmail = url.searchParams.get('email');
    const userAccess = url.searchParams.get('access');

    if (await (await import('../firebase/query.js')).isFoundDocumentReference(userEmail)) {
        const { title, message, typeAlert } = (await import('../utils/alerts.js')).messageTokenVerifyExpired();
        const response = await alertButtonAction(title, message, selectIcon(typeAlert));
        if (response) { (await import('../utils/view.js')).goToHome(); }
        offLoadWhile();
        return;
    }
    await (await import('../firebase/authentication.js')).appenedDocumentReference(userEmail, userAccess);

    const { title, message, typeAlert } = (await import('../utils/alerts.js')).messageUserSubmitted();
    const response = await alertButtonAction(title, message, selectIcon(typeAlert));
    if (response) { (await import('../utils/view.js')).goToHome(); }
    await (await import('../firebase/query.js')).offSession();
    offLoadWhile();
}
async function modeChangePassword(){
    offLoadWhile();
    document.getElementById('resetPassword_form').addEventListener('submit', async function (event) {//AC #204
        try {
            event.preventDefault();
            const getAlerts = await import('../utils/alerts.js');
            const oobCode = getCodeOob();
            const password = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (checkSamePasswords(password, confirmPassword)) {
                const { title, message, typeAlert } = getAlerts.messagePasswordNotSame();
                customAlert(title, message, selectIcon(typeAlert));
                return;
            }if (checkSizeAllowed(password)) {
                const { title, message, typeAlert } = getAlerts.messagePasswordSizeShort();
                customAlert(title, message, selectIcon(typeAlert));
                return;
            }
            await (await import('../firebase/query.js')).validateResetPassword(oobCode, password);
            
            const { title, message, typeAlert } = getAlerts.messageResetPasswordSuccess();
            const request = await alertButtonAction(title, message, selectIcon(typeAlert));
            if (request) { (await import('../utils/view.js')).goToHome(); }
            await (await import('../firebase/query.js')).offSession();
        } catch (error) {
            const { title, message, typeAlert } = (await import('../utils/alerts.js')).messageTokenExpired();
            customAlert(title, message, selectIcon(typeAlert));
        }
    });
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
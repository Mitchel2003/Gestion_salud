import { customAlert, selectIcon } from '../../components/utils/alerts.js';
import { auth } from '../../components/firebase/conection.js';

//side bar
document.getElementById('menu-action').addEventListener('click', () => { document.querySelector('.side-bar').classList.add('spawn'); });
document.getElementById('close-action').addEventListener('click', () => {  document.querySelector('.side-bar').classList.remove('spawn'); });


//analizing this... working here...

const userContext = await auth.currentUser;
await validateSession(userContext);
const { access } = getUserInfo(userContext);
setPageAccess(access);

//need get userCurrent, get from firestore the access for take a way

const container = document.querySelector('.card');
container.addEventListener('submit', async function (event) {
    event.preventDefault();
    await (await import('../components/firebase/query.js')).offSession();
    (await import('../components/utils/view.js')).goToHome();
});

async function validateSession(user) {
    if (!user) { (await import('../../components/utils/alerts.js')).messageSessionFailed(); (await import('../../components/utils/view.js')).goToHome(); return; }
}
function getUserInfo(user) { return { email: user.email, access: user.access, key: user.key }; }
function setPageAccess(access) {
    if (access === 'admin') { giveAccessAdmin(); }
    else if (access === 'auditor') { giveAccessAuditor(); }
    else { giveAccessAuxiliary(); }
}
function giveAccessAdmin() {//design page responsive
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
function giveAccessAuditor() {
    return `   
        <div class="container p-4">
            <div class="row">
                <div class="col-md-6 offset-md-3">
                    <div class="card">
                        <div class="card-body text-center">
                            <h2 class="mb-4">Close session</h2>
                            <form id="resetPassword_form">
                                <button type="submit" class="btn btn-primary btn-block">SignOff</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>  
        `;

}
function giveAccessAuxiliary() {

}
import { TimerOut, observerSessionActive } from '../firebase/authentication.js';
import { onLoadWhile, offLoadWhile } from '../utils/view.js';
import { getDocumentUser } from '../firebase/query.js';
/*--------------------------------------------------runtime--------------------------------------------------*/
onLoadWhile();
await fixContext();

let time = new TimerOut(300000);//timeOut 10 minuts
/*--------------------------------------------------methods--------------------------------------------------*/
async function fixContext() {
    const { email, entity } = await observerSessionActive();
    const { access } = await getDocumentUser(email, entity);
    await managementSession(access);
}
async function managementSession(access) {
    const road = getUserContext(access);
    insertHtml(road);
    if (access === 'auxiliary') { await (await import('../models/sessionModel.js')).modeAuxiliary(); }
    else if (access === 'auditor') { await (await import('../models/sessionModel.js')).modeAuditor(); }
    else if (access === 'admin') { await (await import('../models/sessionModel.js')).modeAdmin(); }
    offLoadWhile();
}
function getUserContext(res) {//AC #205
    document.title = "Session";
    if (res === 'auxiliary') {
        return `
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <h1 class="navbar-brand">Dashboard</h1>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="nav nav-tabs navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="#">Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Driver device</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Control departaments</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">User management</a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="" role="button" data-bs-toggle="dropdown" aria-expanded="false"> 
                                Documents 
                            </a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="">Finding data</a></li>
                                <li><a class="dropdown-item" href="">Device information</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item" href="">Filters</a></li>
                            </ul>
                        </li>                            
                    </ul>
                </div>
                <a class="user-options mt-lg-0"> <span class="bx bxs-user-circle fs-1"></span> </a>
            </div>
        </nav>
        
        <ul class="side-bar">
            <li class="close-options">
                <h4 class="text-center mb-0 fs-4">Options</h4>
                <span class="bx bx-x fs-1"></span> 
            </li>
            <li><a>Your profile</a></li>
            <li><a>Management accounts</a></li>
            <li><a>Settings</a></li>
        </ul>
        `;
    } if (res === 'auditor') {
        return `
        
        `;
    } if (res === 'admin') {
        return `
        
        `;
    }
}
/*--------------------------------------------------tools--------------------------------------------------*/
export function insertHtml(data) { document.body.insertAdjacentHTML('afterbegin', data); }
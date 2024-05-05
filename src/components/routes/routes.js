import { TimerOut, observerSessionActive } from '../firebase/authentication.js';
import { onLoadWhile, offLoadWhile } from '../utils/view.js';
import { getDocumentUser } from '../firebase/query.js';
/*--------------------------------------------------runtime--------------------------------------------------*/
onLoadWhile();
await fixContext();

let time = new TimerOut(300000);//timeOut 5 minuts
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
                        <li class="nav-link active" id="nav-home" role="button" data-bs-toggle="tab" data-bs-target="#home" aria-current="home" aria-selected="true">
                            Home
                        </li>
                        <li class="nav-link" id="nav-driver-device" role="button" data-bs-toggle="tab" data-bs-target="#driver-device" aria-current="driver-device">
                            Driver device
                        </li>
                        <li class="nav-link" id="nav-control-departaments" role="button" data-bs-toggle="tab" data-bs-target="#control-departaments" aria-current="control-departaments">
                            Control departaments
                        </li>
                        <li class="nav-link" id="nav-user-management" role="button" data-bs-toggle="tab" data-bs-target="#user-management" aria-current="user-management">
                            User management
                        </li>
                        <li class="dropdown">
                            <a class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Documents
                            </a>
                            <ul class="dropdown-menu">
                                <li class="dropdown-item" id="nav-finding-data" role="button" data-bs-toggle="tab" data-bs-target="#finding-data" aria-current="finding-data">
                                    Finding data
                                </li>
                                <li class="dropdown-item" id="nav-device-information" role="button" data-bs-toggle="tab" data-bs-target="#device-information" aria-current="device-information">
                                    Device information
                                </li>
                                <hr class="dropdown-divider">
                                <li class="dropdown-item" id="nav-filters" role="button" data-bs-toggle="tab" data-bs-target="#filters" aria-current="filters">
                                    Filters
                                </li>
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

        <div class="tab-content" id="nav-tabContent">
            <div class="tab-panel fade show active p-3" id="home" role="tabpanel" aria-labelledby="nav-home">
                <div class="container-fluid">
                    <h2>hello world</h2>
                </div>
            </div>
        </div>
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
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
        <nav class="bg-body-tertiary navbar navbar-expand-lg">
            <div class="container-fluid">
                
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <h1 class="navbar-brand mb-0">Dashboard</h1>

                <div class="navbar-collapse mx-2 collapse" id="navbarSupportedContent">
                    <ul class="nav nav-tabs navbar-nav" role="tablist">
                        <button class="nav-link active" id="nav-home" type="button" role="tab" data-bs-toggle="tab" data-bs-target="#home" aria-current="home" aria-selected="true">
                            Home
                        </button>
                        <button class="nav-link" id="nav-driver-device" type="button" role="tab" data-bs-toggle="tab" data-bs-target="#driver-device" aria-current="driver-device" aria-selected="false">
                            Driver device
                        </button>

                        <button class="nav-link" id="nav-control-departaments" type="button" role="tab" data-bs-toggle="tab" data-bs-target="#control-departaments" aria-current="control-departaments" aria-selected="false">
                            Control departaments
                        </button>

                        <button class="nav-link" id="nav-user-management" type="button" role="tab" data-bs-toggle="tab" data-bs-target="#user-management" aria-current="user-management" aria-selected="false">
                            User management
                        </button>

                        <li class="dropdown text-center">
                            <a class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Documents
                            </a>
                            <ul class="dropdown-menu text-center">

                                <button class="dropdown-item" id="nav-finding-data" type="button" role="tab" data-bs-toggle="tab" data-bs-target="#finding-data" aria-current="finding-data" aria-selected="false">
                                    Finding data
                                </button>

                                <button class="dropdown-item" id="nav-device-information" type="button" role="tab" data-bs-toggle="tab" data-bs-target="#device-information" aria-current="device-information" aria-selected="false">
                                    Device information
                                </button>

                                <hr class="dropdown-divider">

                                <button class="dropdown-item" id="nav-filters" type="button" role="tab" data-bs-toggle="tab" data-bs-target="#filters" aria-current="filters" aria-selected="false">
                                    Filters
                                </button>
                            </ul>
                        </li>
                    </ul>
                </div>
                <a class="user-options mt-1 collapse show" id="navbarSupportedContent"> <span class="bx bxs-user-circle fs-1"></span> </a>
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

            <div class="tab-panel p-3 fade collapse show active" id="home" role="tabpanel" aria-labelledby="nav-home">
                <div class="container-fluid">
                    <div class="accordion" id="accordionExample1">
                        <div class="accordion-item">
                            <h2 class="accordion-header">
                                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                    Accordion Item #1
                                </button>
                            </h2>

                            <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionExample1">
                                <div class="accordion-body">
                                    <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="tab-panel p-3 fade collapse" id="driver-device" role="tabpanel" aria-labelledby="nav-driver-device">
                <div class="container-fluid bg-body-tertiary bg-opacity-50 rounded-2">
                    <div class="row">

                        <div class="col-lg-8 col-md-8 col-sm-12">
                            <div class="scroll-container overflow-auto" style="max-height: 83vh;">
                                <div id="empty-item">
                                    <h4>Empty</h4>
                                    <p>nothing here</p>
                                </div>
                            </div>
                        </div>

                        <div class="bg-body-tertiary bg-opacity-50 rounded-2 col-lg-4 col-md-4 col-sm-12">
                            <div class="scroll-container overflow-auto" style="max-height: 83vh;">
                                <div id="empty-item">
                                    <h4>Empty</h4>
                                    <p>nothing here</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                    
            </div>

            <div class="tab-panel fade collapse p-3" id="control-departaments" role="tabpanel" aria-labelledby="nav-control-departaments">
                <h1>control-departaments</h1>
            </div>

            <div class="tab-panel fade collapse p-3" id="user-management" role="tabpanel" aria-labelledby="nav-user-management">
                <h1>user-management</h1>
            </div>

            <div class="tab-panel fade collapse p-3" id="finding-data" role="tabpanel" aria-labelledby="nav-finding-data">
                <h1>finding-data</h1>
            </div>

            <div class="tab-panel fade collapse p-3" id="device-information" role="tabpanel" aria-labelledby="nav-device-information">
                <h1>device-information</h1>
            </div>

            <div class="tab-panel fade collapse p-3" id="filters" role="tabpanel" aria-labelledby="nav-filters">
                <h1>filters</h1>
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
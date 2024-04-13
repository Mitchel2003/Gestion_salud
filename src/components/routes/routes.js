import { onLoadWhile, offLoadWhile } from '../utils/view.js';
import { checkSessionActive } from '../firebase/authentication.js';
import { getDocumentUser } from '../firebase/query.js';

//working here...
// document.addEventListener('DOMContentLoaded', async () => { await fixContext(); });
/*--------------------------------------------------methods--------------------------------------------------*/
async function fixContext(){
    onLoadWhile();
    const user = checkSessionActive();//AC #209
    const { access } = await getDocumentUser(user);
    await managementSession(access);
}
async function managementSession(access){
    if (access === 'auxiliary') { const getContext = userContext(access); document.body.innerHTML = getContext; await (await import('../models/userModel.js')).modeAuxiliary(); offLoadWhile(); }
    else if (access === 'auditor') { const getContext = userContext(access); document.body.innerHTML = getContext; await (await import('../models/userModel.js')).modeAuditor(); offLoadWhile(); }
    else { const getContext = userContext(access); document.body.innerHTML = getContext; await (await import('../models/userModel.js')).modeAdmin(); offLoadWhile(); }
}
function userContext(res) {//AC #205
    if (res === 'auxiliary') {
        document.title = "Session";
        appenedBackgroundImage('../components/images/background_session.webp');
        return `
        <nav>
            <ul class="side-bar">
                <li id="close-action"><a><svg xmlns="http://www.w3.org/2000/svg" height="26" viewBox="0 -960 960 960" width="26"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></a></li>
                <li><a>inicio</a></li>
                <li><a>Management accounts</a></li>
                <li><a>Settings</a></li>
            </ul>
            <ul>
                <li><a>Dashboard</a></li>
                <li class="options"><a>Home</a></li>
                <li class="options"><a>Manager</a></li>
                <li class="options"><a>blog</a></li>
                <li id="menu-action"><a><svg xmlns="http://www.w3.org/2000/svg" height="26" viewBox="0 -960 960 960" width="26"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg></a></li>
            </ul>
        </nav>

        <!-- screen loading... -->
        <div class="loadContainer">
          <div class="load">
            <div class="frame_1"></div>
            <div class="frame_2"></div>
          </div>
        </div>
        `;
    } if (res === 'auditor') {
        document.title = "Session";
        return `
        
        `;
    } if (res === 'admin') {
        document.title = "Session";
        return `
        
        `;
    }
}


/*--------------------------------------------------tools--------------------------------------------------*/
function appenedBackgroundImage(address){
    const background = new Image();
    background.src = address;
    document.body.style.backgroundImage = `url(${background.src})`;
}
export function getQueryParams() {
    const queryString = window.location.search;
    const searchParams = new URLSearchParams(queryString);
    return Object.fromEntries(searchParams.entries());
}
import { onLoadWhile, offLoadWhile } from '../utils/view.js';
import { checkSessionActive } from '../firebase/authentication.js';
import { TimerOut } from '../firebase/authentication.js';
/*--------------------------------------------------runtime--------------------------------------------------*/
onLoadWhile();
await fixContext();

let time = new TimerOut(5000);//timeOut
/*--------------------------------------------------methods--------------------------------------------------*/
async function fixContext(){
    const user = await checkSessionActive();
    const { access } = await (await import('../firebase/query.js')).getDocumentUser(user);
    await managementSession(access);
}
async function managementSession(access){
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
function insertHtml(data){
    document.body.insertAdjacentHTML('afterbegin', data);
}
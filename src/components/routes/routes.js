import { onLoadWhile, offLoadWhile } from '../utils/view.js';
import { checkSessionActive } from '../firebase/authentication.js';
import { getDocumentUser } from '../firebase/query.js';
/*--------------------------------------------------runtime--------------------------------------------------*/
onLoadWhile();
await fixContext();

//timeOut
let timeInactivity;
document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'visible') { clearTimeout(timeInactivity); }
    else { (await import('../firebase/authentication.js')).startTimerInactivity(timeInactivity); }
});
/*--------------------------------------------------methods--------------------------------------------------*/
async function fixContext(){
    const user = await checkSessionActive();
    const { access } = await getDocumentUser(user);
    await managementSession(access);
}
async function managementSession(access){
    const road = getUserContext(access); 
    insertHtml(road);
    if (access === 'auxiliary') { await (await import('../models/userModel.js')).modeAuxiliary(); }
    else if (access === 'auditor') { await (await import('../models/userModel.js')).modeAuditor(); }
    else if (access === 'admin') { await (await import('../models/userModel.js')).modeAdmin(); }
    offLoadWhile();
}
function getUserContext(res) {//AC #205
    if (res === 'auxiliary') {
        document.title = "Session";
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
function insertHtml(data){
    document.body.insertAdjacentHTML('afterbegin', data);
}
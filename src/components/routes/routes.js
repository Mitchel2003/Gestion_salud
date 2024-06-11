import { TimerOut, observerSessionActive, StatusConnection } from '../firebase/authentication.js';
import { onLoadWhile, offLoadWhile } from '../utils/view.js';
import { getDocumentUser } from '../firebase/query.js';
/*--------------------------------------------------runtime--------------------------------------------------*/
onLoadWhile();
await fixContext();

let status = new StatusConnection();
let time = new TimerOut(900000);//timeOut 5 minuts "300000"
/*--------------------------------------------------methods--------------------------------------------------*/
async function fixContext() {
    const { email, entity } = await observerSessionActive();
    const { access } = await getDocumentUser(email, entity);
    await managementSession(access);
}
async function managementSession(access) {
    await insertHtml(access);
    if (access === 'auxiliary') { await (await import('../models/sessionModel.js')).modeAuxiliary(); }
    else if (access === 'auditor') { await (await import('../models/sessionModel.js')).modeAuditor(); }
    else if (access === 'admin') { await (await import('../models/sessionModel.js')).modeAdmin(); }
    offLoadWhile();
}
/*--------------------------------------------------tools--------------------------------------------------*/
async function insertHtml(data) {
    const road = (await import('../layout/currentUser.js')).getUserContext(data);
    document.body.insertAdjacentHTML('afterbegin', road);
}
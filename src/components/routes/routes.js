import { TimerOut, observerSessionActive, StatusConnection } from '../firebase/authentication.js';
import { controllerSubmitFormRequest } from '../models/sessionModel.js';
import { onLoadWhile, offLoadWhile } from '../utils/view.js';
import { getDocumentUser } from '../firebase/query.js';
/*--------------------------------------------------runtime--------------------------------------------------*/
onLoadWhile();
await fixContext();

let status = new StatusConnection();
let time = new TimerOut(900000);//timeOut 5 minuts "300000"
/*-------------------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------methods to session--------------------------------------------------*/
async function fixContext() {
    const { email, entity } = await observerSessionActive();
    const { access } = await getDocumentUser(email, entity);
    await managementSession(access);
}
async function managementSession(access) {
    await insertHtml(access);
    const imp = await import('../models/sessionModel.js');
    if (access === 'auxiliary') await imp.modeAuxiliary();
    else if (access === 'auditor') await imp.modeAuditor();
    else if (access === 'admin') await imp.modeAdmin();
    offLoadWhile();
}
async function insertHtml(data) {
    const { getUserContext } = await import('../layout/currentUser.js');
    const road = getUserContext(data);
    document.body.insertAdjacentHTML('afterbegin', road);
}
/*-------------------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
/**
 * Allows us handle the submit action of request through a form button clicked, this button have this fuction(handlerCustomRequest) inner on click
 * @param {HTMLElement} e - Correspond to button from form clicked by user; this action allow create, modify and delete as appropriate
 */
window.handleCustomRequest = async (e) => { e.preventDefault(); await controllerSubmitFormRequest(e) };
/*-------------------------------------------------------------------------------------------------------------------*/
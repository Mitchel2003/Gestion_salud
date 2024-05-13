import { onLoadWhile, offLoadWhile, ClassList_OnClick } from '../utils/view.js';
import { getProfileUser, getDataByRequest } from '../firebase/query.js';

export async function modeAuxiliary() {
    const side_bar = document.querySelector('.side-bar');
    side_bar.addEventListener("mouseleave", () => { side_bar.classList.remove('spawn'); });
    let navbar = new ClassList_OnClick('.user-options', '.close-options span', 'spawn', side_bar);
    let loadData = new Section('.nav-tabs');
}
export async function modeAuditor() {

}
export async function modeAdmin() {

}
/*--------------------------------------------------controllers--------------------------------------------------*/
class Section {//AC #212
    static currentContext;
    constructor(data) {
        this.navigator = document.querySelector(data);
        this.observer();
    }
    observer() {
        this.navigator.addEventListener('click', async (e) => {
            const section = e.target.ariaCurrent;
            if (!section) { return } else { Section.currentContext = section }
            await setContent(Section.currentContext);
        });
    }
}
/*--------------------------------------------------interface--------------------------------------------------*/
async function setContent(sectionContext) {
    onLoadWhile();
    const { obj: data } = getContextRequest(sectionContext);
    const { entity: companyContext } = getProfileUser();

    const keys = Object.keys(data);
    keys.map(async (id, index) => {
        const array = data[id];
        const currentContainer = document.getElementById(array.id_container);
        const res = await getDataByRequest({ data: { req: id, entity: companyContext, order: array.order, limit: array.limit } });
        if (res) { currentContainer.querySelector('.empty').classList.toggle('d-none') }
        if (index === keys.length - 1) { offLoadWhile(); }
        await createItems(res, id, array, currentContainer);
    });

}
export async function createItems(getQuery, idReq, arrayReq, currentContainer) {
    getQuery.forEach(async (e) => {
        const answerData = e.data();
        const itemToInsert = await getCardContent(answerData, idReq, arrayReq);
        currentContainer.insertAdjacentHTML('afterbegin', itemToInsert);
    });
}
async function getCardContent(queryData, idReq, arrayReq) {
    const cards = await import('../layout/cards.js');
    if (idReq.includes('user')) { }
    if (idReq.includes('departament')) { }
    if (idReq.includes('device')) { return cards.cardDevice(queryData, arrayReq); }
    if (idReq.includes('finding')) { return cards.cardFinding(queryData, arrayReq); }
}
function getContextRequest(currentSection, queryLimit = 3) {
    let references;
    if (currentSection.includes('user')) {
        references = {
            user: { id_container: 'user-list', order: 'access', limit: queryLimit, icon: 'bx bxs-id-card' }
        };
    }
    if (currentSection.includes('departaments')) {
        references = {
            departament: { id_container: 'departament-list', order: 'name-room', limit: queryLimit, icon: 'bx bx-buildings' }
        };
    }
    if (currentSection.includes('device')) {
        references = {
            device_references: { id_container: 'device-list', order: 'serial', limit: queryLimit, icon: 'bx bx-desktop' },
            finding_references: { id_container: 'reports', order: 'date', limit: queryLimit, icon: 'bx bx-file' }
        };
    }
    if (currentSection.includes('finding')) {
        references = {
            finding_references: { id_container: 'finding-list', order: 'date', limit: queryLimit, icon: 'bx bx-file' }
        };
    } return { obj: references }
}
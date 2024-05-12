import { getProfileUser, getDataByRequest } from '../firebase/query.js';
import { onLoadWhile, offLoadWhile } from '../utils/view.js';

export async function modeAuxiliary() {
    //need use less addEventListener for themes of optimization
    document.querySelector('.user-options').addEventListener('click', () => { document.querySelector('.side-bar').classList.add('spawn'); });
    document.querySelector('.close-options span').addEventListener('click', () => { document.querySelector('.side-bar').classList.remove('spawn') });
    document.querySelector('.side-bar').addEventListener("mouseleave", () => { document.querySelector('.side-bar').classList.remove('spawn'); });

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
    const { obj: data } = getContextRequest(sectionContext);
    const { entity: companyContext } = getProfileUser();

    const keys = Object.keys(data);
    keys.map(async (id) => {
        const array = data[id];
        const currentContainer = document.getElementById(array.id_container);
        const cardEmpty = currentContainer.querySelector('.empty');
        const res = await getDataByRequest({ data: { req: id, entity: companyContext, order: array.order, limit: array.limit } });
        if (!res) { cardEmpty.classList.add('collapse'); return } else { cardEmpty.classList.remove('collapse') }
        await createItems(res, id, array);
    });
}
export async function createItems(getQuery, idReq, arrayReq) {
    const container = document.getElementById(arrayReq.id_container);
    getQuery.forEach(async (e) => {
        const answerData = e.data();
        const itemToInsert = await getCardContent(answerData, idReq, arrayReq);
        container.insertAdjacentHTML('afterbegin', itemToInsert);
    });
}
async function getCardContent(queryData, idReq, arrayReq) {
    const cards = await import('../layout/cards.js');
    if (idReq.includes('user')) { }
    if (idReq.includes('departament')) { }
    if (idReq.includes('device')) { return cards.cardDevice(queryData, arrayReq); }
    if (idReq.includes('finding')) { return cards.cardFinding(queryData, arrayReq); }
}
function getContextRequest(currentSection, queryLimit = 5) {
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
            device_references: { id_container: 'device-list', order: 'avaliable', limit: queryLimit, icon: 'bx bx-desktop' },
            finding_references: { id_container: 'reports', order: 'date', limit: queryLimit, icon: 'bx bx-file' }
        };
    }
    if (currentSection.includes('finding')) {
        references = {
            finding_references: { id_container: 'finding-list', order: 'date', limit: queryLimit, icon: 'bx bx-file' }
        };
    } return { obj: references }
}
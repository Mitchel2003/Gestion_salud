import { onLoadWhile, offLoadWhile, toggleClassList_onClick } from '../utils/view.js';
import { getProfileUser, getDataByRequest } from '../firebase/query.js';
/*--------------------------------------------------mode--------------------------------------------------*/
export async function modeAuxiliary() {
    const side_bar = document.querySelector('.side-bar');
    toggleClassList_onClick('.user-options', '.close-options span', 'spawn', side_bar);
    side_bar.addEventListener('pointerleave', () => { side_bar.classList.remove('spawn') });

    await handlerSection('.nav-tabs');
}
/*--------------------------------------------------controllers--------------------------------------------------*/
async function handlerSection(navigator) {
    const nav = document.querySelector(navigator);
    nav.addEventListener('click', async (e) => {
        const section = e.target.ariaCurrent;
        if (!section) { return }
        await setContent(section);
    });
}
/*--------------------------------------------------tools--------------------------------------------------*/
async function setContent(sectionContext) {
    onLoadWhile();
    const index = getIndexRequest(sectionContext);
    const array = fieldsReference(index);
    const containers = array['id_container'];

    containers.map((e, i) => {
        const colletion = array['id_collection'].find(i);
        const { obj: data } = getArrayRequest(i, e, array['id_collection']);
    });


    const { entity: companyContext } = getProfileUser();

    const keys = Object.keys(data);
    keys.map(async (id, index) => {
        const array = data[id];
        const containerToFill = document.getElementById(array.id_container);
        const cardEmptyByDefault = containerToFill.querySelector('.empty');

        const res = await getDataByRequest({ req: id, entity: companyContext, order: array.order, limit: array.limit, configQuery: array.configQuery });
        if (res && !cardEmptyByDefault.className.includes('d-none')) { cardEmptyByDefault.classList.toggle('d-none') }
        if (index === keys.length - 1) { offLoadWhile(); /*appenedLoadMore(res, containerToFill);*/ }
        await createItems(res, id, array, containerToFill);
    });
}
function getIndexRequest(context) {//preparate index for work with array[]; we can get a correspondent request
    const array = ['home', 'handler-device', 'control-departaments', 'user-management', 'finding-data', 'device-information', 'filters'];
    array.filter((e, index) => { if (e === context) { return index; } });
}
function fieldsReference(i) {//ids containers and collections to queryDocuments; 
    const array = [
        { id_container: ['id_container_home'], id_collection: ['id_collection_home'] },
        { id_container: ['device-list', 'reports'], id_collection: ['device_references', 'finding_references'] },
        { id_container: ['id_container_departament'], id_collection: ['id_collection_departament'] }
    ]; return array[i];
}

async function createItems(getQuery, idReq, arrayReq, containerContext) {
    getQuery.forEach(async (e) => {
        const answerData = e.data();
        const itemToInsert = await getCardContent(answerData, idReq, arrayReq);
        containerContext.insertAdjacentHTML('afterbegin', itemToInsert);
    });
}
async function getCardContent(queryData, idReq, arrayReq) {
    const cards = await import('../layout/cards.js');
    if (idReq.includes('user')) { }
    if (idReq.includes('departament')) { }
    if (idReq.includes('device')) { return cards.cardDevice(queryData, arrayReq); }
    if (idReq.includes('finding')) { return cards.cardFinding(queryData, arrayReq); }
}


function getArrayRequest(indexSearch, containerToFill, collectionToSearch,configQuery = null) {
    if (!configQuery) { configQuery = getDefaultQuery(indexSearch); }
    const array = [
        { device_references: { id_container: containerToFill, icon: 'bi bi-display', where: configQuery.where, pagination: configQuery.pagination } },
        { departament: { id_container: containerToFill, icon: 'bx bx-buildings', where: configQuery.where, pagination: configQuery.pagination } },
        { user: { id_container: containerToFill, icon: 'bx bxs-id-card', where: configQuery.where, pagination: configQuery.pagination } },
        { finding_references: { id_container: containerToFill, icon: 'bi bi-file-earmark-text', where: configQuery.where, pagination: configQuery.pagination } }
    ]
    Object.keys(array).map((value, index) => { if (value === collectionToSearch) { return array[index]; } });
}
function getDefaultQuery(index) {
    const array = [
        { where: ['empty'], pagination: ['empty'] },
        { where: ['avaliable', '!=', 'true'], pagination: ['avaliable', 5] },
        { where: ['empty'], pagination: ['empty'] }
    ]; return array[index];
}
function getCollectionToSearch(params) {
    array = []
}
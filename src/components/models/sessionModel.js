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
    const { entity: companyContext } = getProfileUser();
    const indexSection = getIndexRequest(sectionContext);
    const arrayContainer = containerToFill(indexSection);
    const arrayCollection = collectionToSearch(indexSection);

    arrayContainer.map((container, index) => {
        const collection = arrayCollection[index];
        const array = getArrayRequest(indexSection, container, collection);//(1), (device_list), (device_reference)

        
        
    });


    

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
function containerToFill(i) {//ids containers and collections to queryDocuments; 
    const array = [
        ['id_container_home'],
        ['device-list', 'reports'],
        ['id_container_departament']
    ]; return array[i];
}
function collectionToSearch() {
    const array = [
        ['id_collection_home'],
        ['device_reference', 'finding_references'],
        ['id_container_departament']
    ]; return array[i];
}

function getArrayRequest(indexSection, containerToFill, collectionToSearch, configQuery = null) {
    if (!configQuery) { configQuery = getDefaultQuery(indexSection); }
    const array = [
        { device_references: { id_container: containerToFill, icon: 'bi bi-display', where: configQuery.where, pagination: configQuery.pagination } },
        { departament: { id_container: containerToFill, icon: 'bx bx-buildings', where: configQuery.where, pagination: configQuery.pagination } },
        { user: { id_container: containerToFill, icon: 'bx bxs-id-card', where: configQuery.where, pagination: configQuery.pagination } },
        { finding_references: { id_container: containerToFill, icon: 'bi bi-file-earmark-text', where: configQuery.where, pagination: configQuery.pagination } }
    ]
    array.map((e, index) => { if (e === collectionToSearch) { return array[index]; } }); //working here...
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

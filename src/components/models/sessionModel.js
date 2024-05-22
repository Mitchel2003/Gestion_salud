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
    const { entity } = getProfileUser();
    const indexSection = getIndexRequest(sectionContext);
    const arrayContainer = containerToFill(indexSection);
    const arrayCollection = collectionToSearch(indexSection);

    arrayContainer.map(async (container, index) => {
        const collection = arrayCollection[index];
        const obj = getRequest(indexSection, collection);
        const objSimplified = fixConfigQuery(index, obj);
        console.log(objSimplified);

        const res = await getDataByRequest({
            req: collection,
            entity: entity,
            where: objSimplified.where, 
            pagination: objSimplified.pagination 
        });
        const elementContainer = document.getElementById(container);
        const cardEmpty = elementContainer.querySelector('.empty');

        if (res && !cardEmpty.className.includes('d-none')) { cardEmpty.classList.toggle('d-none') }
        if (index === arrayContainer.length - 1) { offLoadWhile(); }
        /*appenedLoadMore(res, containerToFill);*/
        await createItems(res, obj, container);
    });
}
function fixConfigQuery(object, index) {
    const arrayWhere, arrayPagination
    if (index === 2) { return { ...object.where.slice(6, 9), ...object.pagination.slice(4, 6) } }
    if (index === 1) { return { ...object.where.slice(3, 6), ...object.pagination.slice(2, 4) } }
    return { ...object.where.slice(0, 3), ...object.pagination.slice(0, 2) }
}

async function createItems(query, arrayRequest, container) {
    query.forEach(async (e) => {
        const answerData = e.data();
        const itemToInsert = await getCardContent(answerData, arrayRequest, container);
        document.getElementById(container).insertAdjacentHTML('afterbegin', itemToInsert);
    });
}
async function getCardContent(data, array, nameContainer) {
    const { cardDevice, cardFinding } = await import('../layout/cards.js');
    const obj = {
        //list
        user: { method: '...' },
        device: { method: cardDevice(data, array) },
        finding: { method: cardFinding(data, array) },
        departament: { method: '...' },

        //subList
        reports: { method: cardFinding(data, array) }
    }
    Object.keys(obj).map((e) => { if (nameContainer.includes(e)) { return obj[e].method; } });
}

function getRequest(indexSection, collectionToSearch, configQuery = null) {
    if (!configQuery) { configQuery = getDefaultQuery(indexSection); }
    const obj = { device_references: { icon: 'bi bi-display' }, finding_references: { icon: 'bi bi-file-earmark-text' }, departament: { icon: 'bx bx-buildings' }, user: { icon: 'bx bxs-id-card' } };
    let request; Object.keys(obj).map((value) => { if (value === collectionToSearch) { request = { ...obj[value], ...configQuery } } }); return request;
}
function getDefaultQuery(index) {
    const array = [
        { where: ['empty'], pagination: ['empty'] },
        { where: ['avaliable', '!=', 'true', 'date', '!=', ''], pagination: ['avaliable', 5, 'date', 5] },
        { where: ['empty'], pagination: ['empty'] }
    ]; return array[index];
}
function containerToFill(i) {//ids containers
    const array = [
        ['id_container_home'],
        ['device-list', 'reports'],
        ['id_container_departament']
    ]; return array[i];
}
function collectionToSearch(i) {//collections to request into database
    const array = [
        ['id_collection_home'],
        ['device_references', 'finding_references'],
        ['id_container_departament']
    ]; return array[i];
}
function getIndexRequest(context) {//preparate index for work with array[]; we can get a correspondent request
    const array = ['home', 'handler-device', 'control-departaments', 'user-management', 'finding-data', 'device-information', 'filters'];
    let num; array.map((value, index) => { if (value === context) { num = index } }); return num;
}
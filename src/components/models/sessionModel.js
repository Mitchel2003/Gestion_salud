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

        console.log(obj.where[index!=0?3:0]);
        const res = await getDataByRequest({ 
            req: collection,
            entity: entity,
            where: { ar_1: obj.where[index!=0?3:0], operation: obj.where[index!=0?4:1], ar_2: obj.where[index!=0?5:2]},
            pagination: { order: obj.pagination[index!=0?2:0], limit: obj.pagination[index!=0?3:1]}
        });
        

        //preparate to fill
        const elementContainer = document.getElementById(container);
        const cardEmpty = elementContainer.querySelector('.empty');

        if (res && !cardEmpty.className.includes('d-none')) { cardEmpty.classList.toggle('d-none') }
        if (index === arrayContainer.length - 1) { offLoadWhile(); }
        /*appenedLoadMore(res, containerToFill);*/
        await createItems(res, obj, container);
    });
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
    const obj = {
        device_references: { icon: 'bi bi-display', where: configQuery.where, pagination: configQuery.pagination },
        finding_references: { icon: 'bi bi-file-earmark-text', where: configQuery.where, pagination: configQuery.pagination },
        departament: { icon: 'bx bx-buildings', where: configQuery.where, pagination: configQuery.pagination },
        user: { icon: 'bx bxs-id-card', where: configQuery.where, pagination: configQuery.pagination }
    };
    let request = null;
    Object.keys(obj).map((e) => { if (e === collectionToSearch) { request = obj[e]; } }); return request;
}
function getDefaultQuery(index) {//missing queryDefault; currently just have for one collection
    const array = [
        { where: ['empty'], pagination: ['empty'] },
        { where: ['avaliable', '!=', 'true', 'date', '!=', '' ], pagination: ['avaliable', 5, 'date', 5 ] },
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
function collectionToSearch(i) {//collections to request
    const array = [
        ['id_collection_home'],
        ['device_reference', 'finding_references'],
        ['id_container_departament']
    ]; return array[i];
}
function getIndexRequest(context) {//preparate index for work with array[]; we can get a correspondent request
    const array = ['home', 'handler-device', 'control-departaments', 'user-management', 'finding-data', 'device-information', 'filters'];
    let index;
    array.map((e, i) => { if (e === context) { index = i } });
    return index;
}
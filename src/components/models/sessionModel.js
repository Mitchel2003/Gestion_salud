import { onLoadWhile, offLoadWhile, toggleClassList_onClick } from '../utils/view.js';
import { getProfileUser, getDataByRequest } from '../firebase/query.js';
import { cardDevice, cardFinding } from '../layout/cards.js';
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
        const data = getRequest(indexSection, collection);
        const arrayConfig = fixQueryConfig(data, index);

        const res = await getDataByRequest({ req: collection, entity: entity, queryConfig: arrayConfig });

        const elementContainer = document.getElementById(container);
        const cardEmpty = elementContainer.querySelector('.empty');
        if (res && !cardEmpty.className.includes('d-none')) { cardEmpty.classList.toggle('d-none') }
        if (index === arrayContainer.length - 1) { offLoadWhile(); }
        createItems(res, container, data.icon);
        /*appenedLoadMore(res, containerToFill);*/
    });
}
function fixQueryConfig(data, index) {
    let indexW = [0, 3], indexP = [0, 2];
    if (index === 2) { indexW = [6, 9], indexP = [4, 6] }
    if (index === 1) { indexW = [3, 6], indexP = [2, 4] }
    return [...data.where.slice(indexW[0], indexW[1]), ...data.pagination.slice(indexP[0], indexP[1])]
}

function createItems(query, container, icon) {
    query.forEach((e) => {
        const item = getCardContent(e.data(), container, icon);
        document.getElementById(container).insertAdjacentHTML('afterbegin', item);
    });
}
function getCardContent(value, nameContainer, icon) {
    const metaData = {
        user: '',
        device: () => cardDevice(value, icon),
        finding: () => cardFinding(value, icon),
        departament: '',
        reports: () => cardFinding(value, icon)
    }
    for (const key in metaData) { if (nameContainer.includes(key)) { return metaData[key]() } }
}

function getRequest(indexSection, collectionToSearch, configQuery = null) {
    if (!configQuery) { configQuery = getDefaultQuery(indexSection); }
    const metaData = { device_references: { icon: 'bi bi-display' }, finding_references: { icon: 'bi bi-file-earmark-text' }, departament: { icon: 'bx bx-buildings' }, user: { icon: 'bx bxs-id-card' } };
    let request; Object.keys(metaData).map((value) => { if (value === collectionToSearch) { request = { ...metaData[value], ...configQuery } } }); return request;
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
function getIndexRequest(context) {//preparate index for work with array[]; we can got a correspondent request
    const array = ['home', 'handler-device', 'control-departaments', 'user-management', 'finding-data', 'device-information', 'filters'];
    return array.findIndex(value => value === context);
}
import { onLoadWhile, offLoadWhile, toggleClassList_onClick } from '../utils/view.js';
import { getProfileUser, DataByRequest } from '../firebase/query.js';
import { cardDevice, cardFinding } from '../layout/cards.js';
/*--------------------------------------------------mode--------------------------------------------------*/
export async function modeAuxiliary() {
    const side_bar = document.querySelector('.side-bar');
    toggleClassList_onClick('.user-options', '.close-options span', 'spawn', side_bar);
    side_bar.addEventListener('pointerleave', () => { side_bar.classList.remove('spawn') });

    await handlerSection('.nav-tabs');
}
/*--------------------------------------------------controllers--------------------------------------------------*/
async function handlerSection(navbar) {
    const navigator = document.querySelector(navbar);
    navigator.addEventListener('click', async (e) => {
        const section = e.target.ariaCurrent;
        if (!section) { return };
        await Section.loadCurrentSection(section);
    });
}
/*--------------------------------------------------classes--------------------------------------------------*/
class Section {
    static async loadCurrentSection(section) { await Section.init(section) }
    static async loadContainerLeft(section) { await Section.init(section) }
    static async loadContainerRight(section) { await Section.init(section) }

    static async init(section, handlerFormat = null) {
        try {
            onLoadWhile();
            const { indexSection, arrayContainer, arrayCollection, entity } = this.currentCredentials(section);
            arrayContainer.map(async (container, index) => {//AC #002
                if (handlerFormat && index != 0) { return }

                const collection = arrayCollection[index];
                const metaData = this.getRequest(indexSection, collection);
                const arrayConfig = this.fixQueryConfig(index, metaData);

                const res = await DataByRequest.get({ req: collection, entity: entity, queryConfig: arrayConfig }, handlerFormat);

                const elementContainer = document.getElementById(container);
                this.toggleCardEmpty(elementContainer, res);

                if (!handlerFormat) { this.cleanContainer(elementContainer) }//for load more function.
                if (index === arrayContainer.length - 1) { offLoadWhile(); }
                this.createItems(res, container, metaData.icon);
            });
        } catch (error) { console.error('Error fetching documents:', error); throw error }
    }
    /*--------------------------------------------------actions kit--------------------------------------------------*/
    static createItems(query, container, icon) {
        query.forEach((e) => {
            const item = this.setContentCard(e.data(), container, icon);
            document.getElementById(container).insertAdjacentHTML('afterbegin', item);
        });
    }
    static setContentCard(value, nameContainer, icon) {
        const metaData = { user: '', device: () => cardDevice(value, icon), finding: () => cardFinding(value, icon), departament: '', reports: () => cardFinding(value, icon) }
        for (const key in metaData) { if (nameContainer.includes(key)) { return metaData[key]() } }
    }
    /*--------------------------------------------------modularization tools--------------------------------------------------*/
    /*call other methods according at context*/
    static currentCredentials(currentSection) {
        const { entity } = getProfileUser();
        const index = this.getIndexRequest(currentSection);
        const containers = this.containerToFill(index);
        const collections = this.collectionToSearch(index);
        return { indexSection: index, arrayContainer: containers, arrayCollection: collections, entity };
    }
    /*return a object "metaData" that mean the config of the snapshotDocument request by (getDocs) through at query() with a config specific, the above methods belongs to the backend from firebase*/
    static getRequest(indexSection, collectionToSearch, configQuery = null) {
        if (!configQuery) { configQuery = this.getDefaultQuery(indexSection); }
        const metaData = { device_references: { icon: 'bi bi-display' }, finding_references: { icon: 'bi bi-file-earmark-text' }, departament: { icon: 'bx bx-buildings' }, user: { icon: 'bx bxs-id-card' } };
        return { ...metaData[collectionToSearch], ...configQuery };
    }
    /*preparate index for work with array[]; we can got a correspondent request*/
    static getIndexRequest(context) {//AC #007
        const array = ['home', 'handler-device', 'control-departaments', 'user-management', 'finding-data', 'filters'];
        return array.findIndex(value => value === context);
    }
    /*while we dont have filters in the queries, we need make the pagination and ordenament in standard mode*/
    static getDefaultQuery(index) {
        const array = [
            { where: ['empty'], pagination: ['empty'] },
            { where: ['avaliable', '!=', 'true', 'date', '!=', ''], pagination: ['avaliable', 5, 'date', 5] },
            { where: ['empty'], pagination: ['empty'] }
        ]; return array[index];
    }
    /*for optimize the code and logic better, according to index we can get a queryConfig specific*/
    static fixQueryConfig(index, data) {
        let indexW = [0, 3], indexP = [0, 2];
        if (index === 2) { indexW = [6, 9], indexP = [4, 6] }
        if (index === 1) { indexW = [3, 6], indexP = [2, 4] }
        return [...data.where.slice(indexW[0], indexW[1]), ...data.pagination.slice(indexP[0], indexP[1])]
    }
    /*contains all containers of each section by him id, sorted according to navigator bar*/
    static containerToFill(i) { const array = [['id_container_home'], ['device-list', 'reports'], ['id_container_departament']]; return array[i] }
    /*contains all collections to search in database, sorted according to navigator bar*/
    static collectionToSearch(i) { const array = [['id_collection_home'], ['device_references', 'finding_references'], ['id_container_departament']]; return array[i] }
    /*this is intended to inspect the card empty by default, if have response from database then change visivility at display: none;*/
    static toggleCardEmpty(container, response) { const card_empty = container.querySelector('.empty'); if (response && !card_empty.className.includes('d-none')) { card_empty.classList.toggle('d-none') } }
    /*remove all cards into container of context*/
    static cleanContainer(container) { const cards = container.querySelectorAll('.card-body'); cards.forEach(card => card.remove()) }//AC #001
}
/* --------------------------------------------------addComentary-------------------------------------------------- */
/*
#001: at moment of reload the section we could find case various; on click the main navbar "sections", the differents
parts of the current section are loads; however, at on click for example "laod more" in the list of element to the right
of the windown, we not load everyone elements in the section, just will be loaded the section to the left for show according information.

#002: **Mejor manejo de Promesas**:
Al usar un bucle `for...of` or `map` en lugar de `forEach`, evitamos el problema de que `forEach` no maneja Promesas de manera predecible.
Esto garantiza que las tarjetas se crean y se insertan en secuencia; anteriormente un supuesto "problema" al momento de rellenar los containers,
el orden en que se plasmaban las targetas no iba de acuerdo con el orden de la consulta especificada, el problema radicaba en que el forEach
no me controlaba las promesas, por tanto, podria estar ejecutandose una consulta en
"const res = await DataByRequest.get({ req: collection, entity: entity, queryConfig: arrayConfig }, filter);", pero el for no esperaba por el,
encontonces se saltaba al siguiente ciclo.


snapshot:
we have a query limit of five; then according at obtained query, we change status of the "loadMore" between (show/hide);
if (res.data().length < arrayConfig[4]) { showButtonLoadMore(); loadMore(); } //working here...

const initDocument = DataByRequest.getLastDocument();
console.log(initDocument);
*/
import { onLoadWhile, offLoadWhile, toggleClassList_onClick } from '../utils/view.js';
import { getProfileUser, DataByRequest, DataByDocument } from '../firebase/query.js';
import { cardDevice, cardFinding, cardDetails } from '../layout/cards.js';
/*--------------------------------------------------mode--------------------------------------------------*/
export async function modeAuxiliary() {
    const side_bar = elementByClass('.side-bar');
    toggleClassList_onClick('.user-options', '.close-options span', 'spawn', side_bar);
    side_bar.addEventListener('pointerleave', () => { side_bar.classList.remove('spawn') });

    await handlerSection(elementByClass('.nav-tabs'));
}
/*--------------------------------------------------controllers--------------------------------------------------*/
async function handlerSection(nav) { nav.addEventListener('click', async (e) => { e.target.ariaCurrent ? await Section.loadCurrentSection(e.target.ariaCurrent) : '' }) }
/*--------------------------------------------------classes--------------------------------------------------*/
class Section {
    static async loadCurrentSection(section) { await Section.init(section) }
    static async loadMoreDetails(section, handler) { await Section.init(section, handler) }
    static async loadContainerRight(section) { await Section.init(section) }

    static async init(section, handlerFormat = null) {
        try {
            onLoadWhile();
            const { indexSection, arrayContainer, arrayCollection, entity } = this.currentCredentials(section);
            await this.eventToContainer(arrayContainer[0], section);

            arrayContainer.map(async (container, index) => {//AC #002
                let routeByFormat = this.routerRequest(index, handlerFormat); if (routeByFormat) return; //allow or deny the code flow according search

                const { metaData, collection, arrayConfig } = this.preparateRequest(index, indexSection, arrayCollection, handlerFormat);
                const res = await this.typeRequest(section, collection, entity, arrayConfig, handlerFormat);

                this.toggleVisibilityCardEmpty(elementById(container), res);//card empty by default
                if (!handlerFormat || !handlerFormat.moreDetails) this.cleanContainer(elementById(container));//for function load more.
                if (index === arrayContainer.length - 1) offLoadWhile();
                this.createItems(res, container, metaData.icon);
            });
        } catch (error) { console.error('Error fetching documents:', error); throw error }
    }
    /*--------------------------------------------------actions kit--------------------------------------------------*/
    static async eventToContainer(container, section) {
        elementById(container).addEventListener('click', async (e) => {
            e.preventDefault();
            const arrayCard = getTargetCard(e.target);
            if (e.target.textContent === 'more details') { return await this.loadMoreDetails(section, { moreDetails: arrayCard }) }
            // this.loadSeeReports(array);
        });
    }
    static async typeRequest(section, collection, entity, arrayConfig, handlerFormat = null) { return handlerFormat ? await DataByDocument.get(handlerFormat.moreDetails, entity, section) : await DataByRequest.get({ req: collection, entity: entity, queryConfig: arrayConfig }) }
    static createItems(query, container, icon) {
        query.forEach((e) => {
            const item = this.setContentCard(e.data(), container, icon);
            elementById(container).insertAdjacentHTML('afterbegin', item);
        });
    }
    static setContentCard(value, nameContainer, icon) {//show moreDetails target
        const metaData = { user: '', device: () => cardDevice(value, icon), finding: () => cardFinding(value, icon), departament: '', reports: () => cardFinding(value, icon), moreDetails: () => cardDetails(value, icon) }
        for (const key in metaData) { if (nameContainer.includes(key)) { return metaData[key]() } }
    }
    static preparateRequest(index_lopp, index_section, array_collections, configQuery = null) {//working here...
        const collection = array_collections[index_lopp];
        const metaData = this.getRequest(index_section, collection, configQuery ? configQuery.query : null);
        let arrayConfig;
        if (configQuery ? configQuery.query : false) arrayConfig = this.fixQueryConfig(index_lopp, metaData);
        return { metaData, collection, arrayConfig }
    }
    static routerRequest(i, format) {
        if (!format) return false;
        //i send id for get the element "key" at context
        //indexContainerToWork is a section number that send in the handler format, with this i can handle the section to change status "list[0], formats[1]"
        const id = format.idReq, indexContainerToWork = format.indexContainer;
        const array = [ format.query, format.list, format.moreDetails ]
        if(indexContainerToWork != i) return; 
        return array[id];
        //format.query: actions in list (filter)
        //format.list: actions in list (to the right of windown)
        //format.moreDetails: actions in formats (to the left of windown) "moreDetails"
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
        return { ...metaData[collectionToSearch], ...configQuery };//return object with keys; icon, where and paginatión
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
    static toggleVisibilityCardEmpty(container, response) { const card_empty = container.querySelector('.empty'); if (response && !card_empty.className.includes('d-none')) { card_empty.classList.toggle('d-none') } }
    /*remove all cards into container of context*/
    static cleanContainer(container) { const cards = container.querySelectorAll('.card-body'); cards.forEach(card => card.remove()) }//AC #001
}
function getTargetCard(button) { return JSON.parse(button.closest('.card').getAttribute('data-card')) }//closest to select card parent from button

/*for simplify*/
function elementById(nameContainer) { return document.getElementById(nameContainer) }
function elementByClass(nameContainer) { return document.querySelector(nameContainer) }
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
if (res.data().length < arrayConfig[4]) { showButtonLoadMore(); loadMore(); }

const initDocument = DataByRequest.getLastDocument();
console.log(initDocument);
*/
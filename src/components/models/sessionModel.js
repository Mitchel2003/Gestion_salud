import { onLoadWhile, offLoadWhile, toggleClassList_onClick } from '../utils/view.js';
import { getProfileUser, DataByRequest, DataByDocument } from '../firebase/query.js';
import { cardDevice, cardFinding, cardDetails } from '../layout/cards.js';
import { elementById, elementByClass } from '../utils/values.js';
/*--------------------------------------------------mode--------------------------------------------------*/
export async function modeAuxiliary() {
    const side_bar = elementByClass('.side-bar');
    toggleClassList_onClick('.user-options', '.close-options span', 'spawn', side_bar);
    side_bar.addEventListener('pointerleave', () => { side_bar.classList.remove('spawn') });

    await handlerSection(elementByClass('.nav-tabs'));
}
/*--------------------------------------------------controllers--------------------------------------------------*/
async function handlerSection(nav) {
    nav.addEventListener('click', async (e) => {
        e.target.ariaCurrent ? await Section.loadCurrentSection(e.target.ariaCurrent) : '';
        eventContainer(Section.getContainerSection(0), Section.getCurrentSection());
    })
}
async function eventContainer(container, section) {
    elementById(container).addEventListener('click', async (e) => {
        e.preventDefault();
        const card = e.target;
        const arrayCard = Section.getTargetCard(card);
        if (card.classList.contains('btn-outline-primary')) return await Section.actionMoreDetails(section, { idFormat: 2, moreDetails: arrayCard })
        if (card.classList.contains('btn-outline-success') || card.classList.contains('btn-outline-danger')) return await Section.actionSeeReports(section, { idFormat: 1, seeReports: arrayCard, query: { where: ['date', '!=', ''], pagination: ['date', 5] } })
    });
}
/*--------------------------------------------------classes--------------------------------------------------*/
class Section {
    static loopIndex;
    static loopContainer;
    static handlerFormat;
    static currentEntity;
    static currentSection;
    static arrayContainerSection;
    static async loadCurrentSection(section) { await Section.init(section) }
    static async actionMoreDetails(section, handler) { await Section.init(section, handler) }
    static async actionSeeReports(section, handler) { await Section.init(section, handler) }

    /**
     * Initialize a query from database to section context (contain mode default and fixed).
     * @param {string} section - The section context to operate
     * @param {object} [handlerFormat = null] - The format is optional for fix request, default is null; could have propierties like moreDetails for example
     * @return {innerHTML} defines the content of the current section
     */
    static async init(section, handler = null) {
        const { indexSection, arrayContainer, arrayCollection, entity } = this.currentCredentials(section);
        Section.arrayContainerSection = arrayContainer;
        Section.currentSection = section;
        Section.currentEntity = entity;
        Section.handlerFormat = handler;
        onLoadWhile();
        let promise = arrayContainer.map(async (container, index) => {//AC #002
            this.loopIndex = index;
            this.loopContainer = container;
            let route = this.handleRoute(); if (route === null) return;

            const { metaData, collection, arrayConfig } = this.preparateRequest(indexSection, arrayCollection);
            const res = await this.routeRequest(route, collection, arrayConfig);
            const res =
                this.toggleVisibilityCardEmpty(elementById(container), res);
            this.clearContainerConditionally(elementById(container), handler);
            this.createItems(res, container, metaData.icon, handler);
        });
        await Promise.all(promise);
        offLoadWhile();
    }
    /*--------------------------------------------------actions kit--------------------------------------------------*/
    /**
     * Redirect to correct request checking the handler
     * @param {string} collection - Is the name of collection to search into database
     * @param {array} arrayConfig - Contain the current config to fix the query(method created by firebase) for container in context; is a array with lenght of 5, the three first are to "where", and the last two is for "pagination"
     * @param {object} [handler = null] - Is present for take a decision, if exist so query a document instead of query compound.
     * @return {object} a snapshot (object) from database "firebase firestore"
     */
    static async routeRequest(route, collection, arrayConfig) { //working here...
        const build = typeof route === 'string' ? { req: collection, queryConfig: arrayConfig } : { req: route, nameSection: this.currentSection };
        const array = { entity: this.currentEntity, ...build };
        return await DataByRequest.get(array, );
    }
    /**
     * Create the cards that will fill the container in context through a loop; with "snapshot" received, we can go through the data got from database "querySnapshot or documentSnapshot"
     * @param {Object} snapshot - Contain data obtained from database, is represented with a querySnapshot or documentSnapshot format, depending on the request sent
     * @param {String} nameContainer - This name represent the container specific (loop context) of the current section we are in
     * @param {String} icon - Correspond to a propierty of object, contain data static of the card specific
     * @param {Object} handler - Is an optional object that could have properties that redirect card format; this way we show in the current container a card different to default
     * @return {innerHTML} insert cards in the current container, this depends on the loop the container is in
     * @const {object} data - is converted to element that contain all data from query received, this format the snapshot as iterable element, regardless of type document obtained (querySanpshot or documentSnapshot)
     * @const {HTMLElement} card - mean the card format selected for show in the current container of the section
     */
    static createItems(snapshot, nameContainer, icon, handler = null) {
        const data = snapshot.forEach ? snapshot.docs.map(e => e.data()) : [snapshot];
        data.forEach(item => {
            const card = this.setContentCard(item, nameContainer, icon, handler);
            elementById(nameContainer).insertAdjacentHTML('afterbegin', card);
        });
    }
    static setContentCard(value, nameContainer, icon, handler = null) {
        const metaData = {
            /*formats with handler*/
            moreDetails: () => cardDetails(value, icon),

            /*associated with container(0) in a context section (ex: id_container="device-list")*/
            user: () => "cardUser(value, icon)",
            device: () => cardDevice(value, icon),
            finding: () => cardFinding(value, icon),
            departament: () => "cardDepartament(value, icon)",


            reports: () => cardFinding(value, icon)
        }
        for (const [key, method] of Object.entries(metaData)) {
            if (handler ? handler[key] : null) return method();
            else if (nameContainer.includes(key)) return method();
        }
    }
    static preparateRequest(index_section, array_collections) {
        const collection = array_collections[this.loopIndex];
        const metaData = this.getRequest(index_section, collection, this.handlerFormat ? this.handlerFormat.query : null);
        const arrayConfig = this.fixQueryConfig(metaData);
        return { metaData, collection, arrayConfig }
    }
    static handleRoute() {
        const format = this.handlerFormat;
        const array = [
            format.query,
            format.seeReports,
            format.moreDetails,
            format.loadMore
        ]
        if (!format) return "allow";
        if (format && this.loopIndex != 1) return null; //number "1" is equal to side left in the current section
        this.controllerPositionSubnavbar(this.loopContainer);
        return array[format.idFormat];
    }
    /**
     * For control when iterating over the options in the side right, in same case like that;
     * @example the user wish show "more details" about the card selected (side right);
     * so maybe that the subnavbar (side left) its on section "create something" (static),
     * we need redirect to main section in subnavbar because its the unique that have the capacity
     * to change cards depending the iteraction of user, this way we show the data of specific card
     * @param {string} mainSection - Is the name of the main section in the subnavbar
     */
    static controllerPositionSubnavbar(mainSection) { const element = elementById('nav-' + mainSection); element.click() }


    /*--------------------------------------------------modularization tools--------------------------------------------------*/
    static currentCredentials(currentSection) {
        const { entity } = getProfileUser();
        const index = this.getIndexRequest(currentSection);
        const containers = this.containerToFill(index);
        const collections = this.collectionToSearch(index);
        return { indexSection: index, arrayContainer: containers, arrayCollection: collections, entity };
    }
    static getRequest(indexSection, collectionToSearch, configQuery = null) {
        if (!configQuery) { configQuery = this.getDefaultQuery(indexSection); }
        const metaData = { device_references: { icon: 'bi bi-display' }, finding_references: { icon: 'bi bi-file-earmark-text' }, departament: { icon: 'bx bx-buildings' }, user: { icon: 'bx bxs-id-card' } };
        return { ...metaData[collectionToSearch], ...configQuery };//return object with keys; icon, where and paginatión
    }
    static getIndexRequest(context) {//AC #007
        const array = ['home', 'handler-device', 'control-departaments', 'user-management', 'finding-data', 'filters'];
        return array.findIndex(value => value === context);
    }
    static getDefaultQuery(index) {
        const array = [
            { where: ['empty'], pagination: ['empty'] },
            { where: ['avaliable', '!=', 'true', 'date', '!=', ''], pagination: ['avaliable', 5, 'date', 5] },
            { where: ['empty'], pagination: ['empty'] }
        ]; return array[index];
    }
    /*for optimize the code and logic better, according to index we can get a queryConfig specific*/
    static fixQueryConfig(data) {
        let indexW = [0, 3], indexP = [0, 2];
        if (!data.where || !data.pagination) return;
        if (this.loopIndex === 2) { indexW = [6, 9], indexP = [4, 6] }
        if (this.loopIndex === 1) { indexW = [3, 6], indexP = [2, 4] }        
        return [...data.where.slice(indexW[0], indexW[1]), ...data.pagination.slice(indexP[0], indexP[1])]
    }
    /*contains all containers of each section by him id, sorted according to navigator bar*/
    static containerToFill(i) { const array = [['id_container_home'], ['device-list', 'reports'], ['id_container_departament']]; return array[i] }
    /*contains all collections to search in database, sorted according to navigator bar*/
    static collectionToSearch(i) { const array = [['id_collection_home'], ['device_references', 'finding_references'], ['id_container_departament']]; return array[i] }
    /*set the card empty by default 'display: flex;' to 'display: none;' this intended to inspect the card empty by default, if we have response from database then change visivility at display: none;*/
    static toggleVisibilityCardEmpty(container, response) { const card_empty = container.querySelector('.empty'); if (response && !card_empty.className.includes('d-none')) { card_empty.classList.toggle('d-none') } }
    /*Cleans the specified container based on the provided handlerFormat
      @param {HTMLElement} container - The container to potentially clean.
      @param {Object} handler - The format handler which includes propierty loadMore.*/
    static clearContainerConditionally(container, handlerFormat = null) { if (handlerFormat ? handlerFormat.loadMore || handlerFormat.moreDetails : true) this.cleanContainer(container) }
    /*Clean the specified provide container #addComentary: 001
      @param {HTMLElement} container - The container to potentially clean.*/
    static cleanContainer(container) { const cards = container.querySelectorAll('.card-body'); cards.forEach(card => card.remove()) }

    //getters and setters
    static getCurrentSection() { return Section.currentSection }
    static getContainerSection(index) { return Section.arrayContainerSection[index] }
    static getTargetCard(button) { return JSON.parse(button.closest('.card').getAttribute('data-card')) }//closest to select card parent from button
}
/* --------------------------------------------------addComentary-------------------------------------------------- */
/*
#001: at moment of reload the section we could find case various; on click the main navbar "sections", the differents
parts of the current section are loads; however, at on click for example "load more" in the list of element to the right
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
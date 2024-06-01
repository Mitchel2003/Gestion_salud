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
async function handlerSection(nav) {
    nav.addEventListener('click', async (e) => {
        e.target.ariaCurrent ? await Section.loadCurrentSection(e.target.ariaCurrent) : '';
        eventContainer(Section.getContainerSection(0), Section.getCurrentSection());
    })
}
async function eventContainer(container, section) {
    elementById(container).addEventListener('click', async (e) => {
        e.preventDefault();
        const arrayCard = getTargetCard(e.target);
        if (e.target.textContent === 'more details') { return await Section.loadMoreDetails(section, { idFormat: 2, idContainer: 1, moreDetails: arrayCard }) }
        // this.loadSeeReports(array);
    });
}
/*--------------------------------------------------classes--------------------------------------------------*/
class Section {
    static currentSection;
    static arrayContainerSection;
    static async loadCurrentSection(section) { await Section.init(section) }
    static async loadMoreDetails(section, handler) { await Section.init(section, handler) }

    /**
     * Initialize a query from database to section context (contain mode default and fixed).
     * @param {string} section - The section context to operate
     * @param {object} [handlerFormat = null] - The format is optional for fix request, default is null; could have propierties like moreDetails for example
     * @return {innerHTML} defines the content of the current section
     */
    static async init(section, handlerFormat = null) {
        const { indexSection, arrayContainer, arrayCollection, entity } = this.currentCredentials(section);
        Section.arrayContainerSection = arrayContainer;
        Section.currentSection = section;
        onLoadWhile();
        let promise = arrayContainer.map(async (container, index) => {//AC #002
            let route = this.handleRoute(index, handlerFormat); if (route === null) return; //allow or deny the code flow according search

            const { metaData, collection, arrayConfig } = this.preparateRequest(index, indexSection, arrayCollection, handlerFormat);
            const res = await this.routeRequest(section, collection, entity, arrayConfig, handlerFormat);
            this.toggleVisibilityCardEmpty(elementById(container), res);
            this.clearContainerConditionally(elementById(container), handlerFormat);
            this.createItems(res, container, metaData.icon, handlerFormat);
        });
        await Promise.all(promise);
        offLoadWhile();
    }
    /*--------------------------------------------------actions kit--------------------------------------------------*/
    /**
     * Redirect to correct request checking the handler
     * @param {string} section - Contain the name of the current section for a decide later
     * @param {string} collection - Is the name of collection to search into database
     * @param {string} entity - Is the name of entity in context, is the entity in which the user is subscribed
     * @param {array} arrayConfig - Contain the current config to fix the query(method created by firebase) for container in context; is a array with lenght of 5, the three first are to "where", and the last two is for "pagination"
     * @param {object} [handler = null] - Is present for take a decision, if exist so query a document instead of query compound.
     * @return {object} a snapshot (object) from database "firebase firestore"
     */
    static async routeRequest(section, collection, entity, arrayConfig, handler = null) {
        return handler ?
            await DataByDocument.get(handler.moreDetails, entity, section) :
            await DataByRequest.get({ req: collection, entity: entity, queryConfig: arrayConfig });
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
        const data = snapshot.forEach ? snapshot.docs.map(e => e.data()) : [snapshot.data()];
        data.forEach(item => {
            const card = this.setContentCard(item, nameContainer, icon, handler);
            elementById(nameContainer).insertAdjacentHTML('afterbegin', card);
        });
    }
    /**
     * This module have the function of return a card format depending of nameContainer in a loop context (according to current section) or using a handler sent to config a specific card
     * @param {snapshot} value - Contain one of much documents from database coresponding to a snapshot, this is a data that belong to one document (ex: device with UID:10001)
     * @param {string} nameContainer - Is the name of the current container in loop context main (ex: handler-device:{ div-right:"device-list", div-left:"reports" } )
     * @param {string} icon - Contain el nameClass to call a icon from Bootstrap-icons
     * @param {object} [handler = null] - Is optional and correspond a propierties that configure the card returned
     * @return {HTMLElement} execute a method that return a DOMElement
     * @const {object} metaData - is a object with keys that initially correspond to names of containers got from currect section, thats why we into loop for/of used "nameContainer.includes()" because if(!handler).then(nameContainer contain the key to search
     * @example
     * nameContainer = "device-list" => index(0); so the method returned is 'device: () => cardDevice(value, icon)' respectively.
     * nameContainer = "reports" => index(1); so the method returned is 'reports: () => cardFinding(value, icon)' respectively.
     * {with format included} = handler contains moreDetails; so the method returned is 'handler[key]' respectively
     */
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
    /**Configure the query basing into index of current container that are filling
     * @param {number} index_lopp - Contain the current index of loop section; remember that one section have minime two containers, then if (containers.lenght === 2) index_loop could be (0 or 1);
     * @param {number} index_section - Just like we talk about indexs into containers of current section, also we have indexs for current section in context ("home" === 0, "handler-device" === 1 ...); then, this data refers at index of the current section
     * @param {array} array_collections - This list contain the names of the collections to query documents into database; then, depending of container to fill (index = 0 or 1), we get the collection specific according to index position (['device_references', 'finding_references'])
     * @param {object} [configQuery = null] - Is optional, this is for queries specifics according to format preset
     * @return {object} we obtained a config default for query 
     * @const {object} metaData - is equal to { query: {where: [], pagination: []} }
     * @const {array} arrayConfig - is equals to say ["name", "!=", "pedro", "name", "5"] that represent ...where and ...pagination
     */
    static preparateRequest(index_lopp, index_section, array_collections, configQuery = null) {
        const collection = array_collections[index_lopp];
        const metaData = this.getRequest(index_section, collection, configQuery ? configQuery.query : null); //query 
        const arrayConfig = this.fixQueryConfig(index_lopp, metaData);
        return { metaData, collection, arrayConfig }
    }
    /**
     * Cleans the specified container based on the provided handlerFormat condition
     * @param {number} i - Represent the current index of loop definied by the section context (handler-device: ["device_list", "reports"])
     * @param {object} [format = null] - we will use this handler to decide; if(!format).then(continue flow), if(format but (indexToFill="1") != (indexLoop="0")).then(stop flow)
      =>index = this is a section number that we receive in format "list[0](left), formats[1](right)"
      =>id = for get the element "key" at context (array)

      propierties:
      .query = actions in list (filter),
      .list = actions in list (to the right of windown)
      .moreDetails = actions in formats (to the left of windown) "moreDetails"*/
    static handleRoute(i, format = null) {
        let index = format ? format.idContainer : null;
        if (!format) return "allow";
        if (format && index != i) return null;
        const array = [format.query, format.list, format.moreDetails, format.loadMore]
        const id = format.idFormat;
        return array[id];
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
        if (!data.where || !data.pagination) return;//edited here...
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

}
function getTargetCard(button) { return JSON.parse(button.closest('.card').getAttribute('data-card')) }//closest to select card parent from button

/*for simplify*/
function elementById(nameContainer) { return document.getElementById(nameContainer) }
function elementByClass(nameContainer) { return document.querySelector(nameContainer) }
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
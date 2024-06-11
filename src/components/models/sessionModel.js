import { onLoadWhile, offLoadWhile, toggleClassList_onClick } from '../utils/view.js';
import { getProfileUser, DataByRequest } from '../firebase/query.js';
import { cardDevice, cardFinding, cardDetails } from '../layout/cards.js';
import { elementById, elementByClass } from '../utils/values.js';

/*--------------------------------------------------mode--------------------------------------------------*/
/**
 * Controller sesion of the user with auxiliary access
 * @returns {method} allow the interactivity on the section in context and their containers respective
 */
export async function modeAuxiliary() {
    controllerSideBar(elementByClass('.side-bar'));
    await handlerSection(elementByClass('.nav-tabs'));
}
/*--------------------------------------------------controllers--------------------------------------------------*/
/**
 * Is used to coordinate the contain of section that user click on; this way we can fill the specific containers through a snapshot corresponding
 * @param {HTMLElement} nav - Correspond to element main navbar
 * @returns {method} apply a event on click over the options in main navbar, so if user click
 */
async function handlerSection(nav) {
    nav.addEventListener('click', async (e) => {
        let item = e.target.ariaCurrent;
        if (item) { await Section.loadCurrentSection(item); eventContainer(Section.getContainerSection(0)) }
    });
}
/**
 * Allow coordinate the data obtained of the card click on by user in the "container" specific; the buttons into cards execute their logic a according to the card its in
 * @param {string} container - Correspond to container name for add event on click in their cards
 * @returns {method} A action according to button clicked, execute a request with data belong to the card selected
 * @example In the side right on current section we can see a container with cards and buttons of actions, this buttons have a fuction where are send the data of the card in context
 */
async function eventContainer(container) {
    elementById(container).addEventListener('click', async (e) => {
        e.preventDefault();
        const card = e.target;
        const section = Section.getCurrentSection();
        const arrayData = Section.getTargetCard(card);
        if (card.className.includes('primary')) return await Section.actionMoreDetails(section, { moreDetails: arrayData, query: 'not apply here' })
        if (card.className.includes('danger') ||
            card.className.includes('success')) return await Section.actionSeeReports(section, { seeReports: arrayData, query: { where: ['date', '!=', ''], pagination: ['date', 5] } })
    });
    /*for delete "id" on the handler (this id we using to get arrayData)*/
}
/*-------------------------------------------------------------------------------------------------------------------*/

class Section {
    static arrayContainer;
    static arrayCollection;
    static currentEntity;
    static currentSection;
    static handlerFormat;
    static indexSection;

    /*--------------------------------------------------initialize--------------------------------------------------*/
    static async loadCurrentSection(section) { await Section.init(section) }
    static async actionMoreDetails(section, handler) { await Section.init(section, handler) }
    static async actionSeeReports(section, handler) { await Section.init(section, handler) }
    /**
     * Initialize a query data to database for fill the section in context (contain mode default and fixed).
     * @param {string} section - The section context to operate
     * @param {object} [handler = null] - The format is optional for fix request, default is null; could have propierties like moreDetails for example
     * @returns {method} this define the content present into containers of current section
     * @const {number} loopIndex - this represent the index of container that loop is in
     * @example handler-device => containers['device-list', 'reports'] => index [0, 1]
     * @const {string} loopContainer - is the name container that loop is in
     * @example handler-device => containers['device-list', 'reports']
     * @const {string} loopCollection - is the name of collection through wich obtain the data request to fill the current container, we use to find the data location
     * @example handler-device => containers['device-list', 'reports'] => collections ['device_references', 'finding_references']
     */
    static async init(section, handler = null) {
        onLoadWhile();
        this.updateCredentials(section, handler);
        let promise = this.arrayContainer.map(async (loopContainer, loopIndex) => {//AC #002
            let loopCollection = this.arrayCollection[loopIndex];
            let route = this.handleRoute(loopIndex, loopContainer); if (route === null) return;
            const { dataDefault, arrayConfig } = this.preparateRequest(loopIndex, loopCollection);
            const res = await this.routeRequest(route, loopCollection, arrayConfig);
            this.clearContainerConditionally(loopContainer, res);
            this.createItems(res, loopContainer, dataDefault);
        });
        await Promise.all(promise);
        offLoadWhile();
    }
    /*-------------------------------------------------------------------------------------------------------------------*/

    /*--------------------------------------------------update credentials--------------------------------------------------*/
    /**
     * Intend to define escential data to build the queries corresponding to user iteractivity, call data according at context
     * @param {string} currentSection - Is the name of the current section
     * @param {object} [handlerFormat = null] - Is optional and contain keys that coordinate a request data specific, according to context
     * @returns {method} get a object with propierties like indexSection and collections "correspond to a container asignated" this way, we get the data from database and fill containers in the section
     * @example
     * Sections = [home:0], [handler-device:1], [control-departaments:2], [user-management:3], [finding-data:4], [filters:5]
     */
    static updateCredentials(currentSection, handlerFormat) {
        const { entity: currentEntity } = getProfileUser();
        Section.handlerFormat = handlerFormat;
        Section.currentEntity = currentEntity;
        Section.currentSection = currentSection;
        Section.indexSection = this.getIndexSection(this.currentSection);
        Section.arrayCollection = this.collectionToSearch(this.indexSection);
        Section.arrayContainer = this.containerToFill(this.indexSection);
    }
    /**
     * Through param "context" that represent the name of the current section clicked by the user (main navbar); we can work more easy
     * @param {string} context - Contain name of the section in context
     * @return {number} we get a number that represent the index of the current section in which the user is locate
     */
    static getIndexSection(context) {
        const array = ['home', 'handler-device', 'control-departaments', 'user-management', 'finding-data', 'filters'];
        return array.findIndex(value => value === context);
    }
    /**
     * Contain all collections to search data; the index position its associated by the correspond container; sorted according to navigator bar
     * @returns {array} returns an array with collections that belongs to containers in current section, this way each container is filled according to collection referenced, return shorted [0],[1]
     */
    static collectionToSearch() {
        const array = [['id_collection_home'], ['device_references', 'finding_references'], ['id_container_departament']];
        return array[this.indexSection]
    }
    /**
     * Contain all containers of each section, we can select them by id; sorted according to navigator bar
     * @returns {array} returns an array with containers that belongs to current section, return shorted [0],[1]
     */
    static containerToFill() {
        const array = [['id_container_home'], ['device-list', 'reports'], ['id_container_departament']];
        return array[this.indexSection];
    }
    /*-------------------------------------------------------------------------------------------------------------------*/

    /*--------------------------------------------------handler route--------------------------------------------------*/
    /**
     * Helps me control the flow of the current loop (containers in current section), through (allow/deny) we can fill a container specific by using a handler (handlerFormat)
     * @param {number} loopIndex - this represent the index of container that loop is in
     * @param {string} loopContainer - is the name container that loop is in
     * @return {string} by default throws a string 'allow', but if its request then return "null" or "idFormat = number"
     * @const {object} [format = null] - we will use this handler to decide; if(!format).then(continue flow), if(format but indexLoop != indexContainer[1](side left)  ).then(stop flow)
     * @const {array} array - is a array of propierties that belongs at format; at least one of these properties must contain data, remember that if exist handlerFormat its because we intend a request, we await a format according to a requerided action
     */
    static handleRoute(loopIndex, loopContainer) {
        const handler = this.handlerFormat;
        if (!handler) return "allow";
        if (handler && loopIndex != 1) return null; //number "1" is equal to side left in the current section
        this.controllerPositionSubnavbar(loopContainer);
        return handler[Object.keys(handler)[0]]; //the first element into object corresponding to the request by user
    }
    /**
     * For control when iterating over the options in the side right (scroll container), in same case like that;
     * @param {string} mainSection - Is the name of the main section in the subnavbar
     * @example addComentary: 003
     */
    static controllerPositionSubnavbar(mainSection) {
        const element = elementById('nav-' + mainSection);
        element.click();
    }
    /*-------------------------------------------------------------------------------------------------------------------*/

    /*--------------------------------------------------preparate request--------------------------------------------------*/
    /**
     * Configure the query basing into index of current container that we are filling (loopIndex)
     * @param {number} loopIndex - Is the number of the current index in the loop
     * @param {string} loopCollection - Is the name of the collection through which query data to database
     * @returns {object} we get a object configured by default (or by this.handlerFormat.query) to set a request
     * @const {object} data - is equal to { query: {where: [], pagination: []} }
     * @const {array} arrayConfig - is equals to say ["name", "!=", "pedro", "name", "5"] that represent 'where' and 'pagination'
     */
    static preparateRequest(loopIndex, loopCollection) {
        const config = this.handlerFormat ? this.handlerFormat.query : null;
        const data = this.getRequest(loopCollection, config);
        const arrayConfig = this.fixQueryConfig(data, loopIndex);
        return { dataDefault: data.icon, arrayConfig }
    }
    /**
     * This method allows us to configure the request that we send to Firebase method "getDocs()" with which we obtain the snapshot "documentSnapshot" or "querySnapshot"
     * @param {string} collectionToSearch - Contain name of the collection to query in database, with this name we can inspect the keys of object "data" to get static data customized (example: icon)
     * @param {object} [query = null] - Have three status, could be this;
     * @example
     * null = when go through containers into current section (like 'home'); remember that we have a query default to main sections
     * string = when request a documentSnapshot (dont need 'where' or 'pagination')
     * object = to build a specific query, intend be a object like this { where: ['avaliable', '!=', 'true'], pagination: ['avaliable', 5] }
     * @returns {object} we get a object with keys {icon, where, pagination} to fix the query() method that we will use to send a specific request. The above method belong to the backend of firebase
     * @const {object} data - is a object with keys that corresponding to specific collection, contain a default config like 'icon'
     */
    static getRequest(collectionToSearch, query = null) {
        const data = {
            device_references: { icon: 'bi bi-display' },
            finding_references: { icon: 'bi bi-file-earmark-text' },
            departament: { icon: 'bx bx-buildings' },
            user: { icon: 'bx bxs-id-card' }
        };
        if (!query) query = this.getDefaultQuery(this.indexSection);
        return { ...data[collectionToSearch], ...query };
    }
    /**
     * While we dont have handler in the query "example: filters", we need make the pagination and ordenament in standard mode, this method returns a default query
     * @param {number} index - is the index that belongs to main loop
     * @returns {object} a object with keys ('where' lenght = 3) and ('pagination' lenght = 2)
     * @const {array} array - with a index we can obtain a object to config the query
     */
    static getDefaultQuery(index) {
        const array = [
            { where: ['empty'], pagination: ['empty'] },
            { where: ['avaliable', '!=', 'true', 'date', '!=', ''], pagination: ['avaliable', 5, 'date', 5] },
            { where: ['empty'], pagination: ['empty'] }
        ]; return array[index];
    }
    /**
     * This includes a logic to get the query config specific according to index in current loop
     * @param {object} data - Is a object with properties 'where:[]' and 'pagination:[]'
     * @param {number} loopIndex - This represent the number of the current index in the loop
     * @returns {array} an array with the current config based on an index that belongs to the context container
     */
    static fixQueryConfig(data, loopIndex) {
        let indexW = [0, 3], indexP = [0, 2];
        if (!data.where || !data.pagination) return;
        if (loopIndex === 2) { indexW = [6, 9], indexP = [4, 6] }
        if (loopIndex === 1) { indexW = [3, 6], indexP = [2, 4] }
        return [...data.where.slice(indexW[0], indexW[1]), ...data.pagination.slice(indexP[0], indexP[1])]
    }
    /*-------------------------------------------------------------------------------------------------------------------*/

    /*--------------------------------------------------route request--------------------------------------------------*/
    /**
     * Prepare the request according at "route" defined by the handler received; this way we can send a request to the database and get the assigned snapshot
     * @param {array} [route = 'allow'] - Naturaly have a value default like string, but if user iterate over options into list of cards (side right) so its a array with data for deep search (example: array.lenght = 2)
     * @param {string} collection - Is the name of collection to search into database
     * @param {array} arrayConfig - Contain the current config to fix the query(method created by firebase) for container in context; is a array with lenght of 5, the three first are to "where", and the last two is for "pagination"
     * @returns {object} a querySnapshot or documentSnapshot from database
     */
    static async routeRequest(route, collection, arrayConfig) {
        const type = this.handlerFormat ? this.handlerFormat.document : false;
        const build = typeof route === 'string' ? { req: collection, queryConfig: arrayConfig } : { req: route };
        return await DataByRequest.get({ section: this.currentSection, entity: this.currentEntity, isDocument: type, ...build });
    }
    /*-------------------------------------------------------------------------------------------------------------------*/

    /*--------------------------------------------------clear container conditionally--------------------------------------------------*/
    /**
     * Cleans the specified container based on the provided handlerFormat, then according to finding data received, the text "nothing found" wil be removed
     * @param {string} container - The name container to clean.
     * @param {snapshot} res - Contain data response of the request in context of the loop
     * @returns {method} apply at behavior to containers to organize the visual presentation
     */
    static clearContainerConditionally(container, res) {
        const element = elementById(container);
        const card_empty = element.querySelector('.empty');
        if (res && !card_empty.className.includes('d-none')) card_empty.classList.toggle('d-none');
        if (this.handlerFormat ? this.handlerFormat.loadMore || this.handlerFormat.moreDetails : true) this.cleanContainer(element);
    }
    /**
     * Clean the specified container
     * @param {HTMLElement} container - Is the container to clear cards, correspond to DOM element
     * @returns {method} remove all cards into current container
     * @example addComentary: 001
     */
    static cleanContainer(container) {
        const cards = container.querySelectorAll('.card-body');
        cards.forEach(card => card.remove());
    }
    /*-------------------------------------------------------------------------------------------------------------------*/

    /*--------------------------------------------------create items--------------------------------------------------*/
    /**
     * Create the cards that will fill the container in context through a loop; with "snapshot" received, we can go through the data got from database "querySnapshot or documentSnapshot"
     * @param {Object} snapshot - Contain data obtained from database, is represented with a querySnapshot or documentSnapshot format, depending on the request sent
     * @param {string} container - Is the name container belongs to current loop, is one of the containers to fill in section context (example: "home")
     * @param {string} icon - Is a name class to insert a icon in the card context, correspond to bootstrap icons
     * @returns {HTMLElement} insert cards in the current container, this depends on the loop the container is in
     * @const {object} data - is converted to element that contain all data from query received, this format the snapshot as iterable element, regardless of type document obtained (querySanpshot or documentSnapshot)
     * @const {HTMLElement} card - mean the card format selected for show in the current container of the section
     */
    static createItems(snapshot, container, icon) {
        const data = snapshot.forEach ? snapshot.docs.map(e => e.data()) : [snapshot];
        data.forEach(item => {
            const card = this.setContentCard(item, container, icon);
            elementById(container).insertAdjacentHTML('afterbegin', card);
        });
    }
    /**
     * This module have the function that return a card format depending of name container in the loop context, according to current section; or using a handler sent to config a specific card
     * @param {object} value - Contain one of much documents from database coresponding to a snapshot, this is a data that belong to one document (ex: device with UID:10001)
     * @param {string} nameContainer - Is the name of container in context to insert the data obtained from database
     * @param {string} icon - Contain el nameClass to call a icon from Bootstrap-icons
     * @returns {HTMLElement} execute a method that return a DOMElement
     * @const {object} data - is a object with keys that initially correspond to names of containers got from currect section, thats why we into loop for/of used "nameContainer.includes()" because if(!handler).then(nameContainer contain the key to search
     * @example
     * nameContainer = "device-list" => index(0); so the method returned is 'device: () => cardDevice(value, icon)' respectively.
     * nameContainer = "reports" => index(1); so the method returned is 'reports: () => cardFinding(value, icon)' respectively.
     * {with format included} = handler contains moreDetails; so the method returned is 'handler[key]' respectively
     */
    static setContentCard(value, nameContainer, icon) {
        const data = {
            /*formats with handler*/
            moreDetails: () => cardDetails(value, icon),

            /*associated with index(0)*/
            user: () => "cardUser(value, icon)",
            device: () => cardDevice(value, icon),
            finding: () => cardFinding(value, icon),
            departament: () => "cardDepartament(value, icon)",

            /*associated with index(1)*/
            reports: () => cardFinding(value, icon)
        }
        for (const [key, method] of Object.entries(data)) {
            if (this.handlerFormat ? this.handlerFormat[key] : null) return method()
            else if (nameContainer.includes(key)) return method()
        }
    }
    /*-------------------------------------------------------------------------------------------------------------------*/

    /*--------------------------------------------------getters--------------------------------------------------*/
    /**
     * On click a button in any card, we can take him the data to operate more actions through the information obtained about card in context
     * @param {target} button - correspond to data of the card clicked by user
     * @returns {array} returns an array that contain the UID of one or a lot documents according to query deep that we need
     */
    static getTargetCard(button) { return JSON.parse(button.closest('.card').getAttribute('data-card')) }
    static getContainerSection(index) { return Section.arrayContainer[index] }
    static getCurrentSection() { return Section.currentSection }
    /*-------------------------------------------------------------------------------------------------------------------*/
}

/**
 * Control the status of side-bar into section applying a toggle on click, also have a 'pointer leave' event to close when the mouse out of bar
 * @param {HTMLElement} params - This element correspond to sideBar
 * @returns {method} apply a behavior to sidebar
 */
function controllerSideBar(side_bar) {
    toggleClassList_onClick('.user-options', '.close-options span', 'spawn', side_bar);
    side_bar.addEventListener('pointerleave', () => { side_bar.classList.remove('spawn') });
}

/*--------------------------------------------------addComentary--------------------------------------------------*/
/**
 * #001: at moment of reload the section we could find case various; on click the main navbar "sections", the differents
 * parts of the current section are loads; however, at on click for example "load more" in the list of element to the right
 * of the windown, we not load everyone elements in the section, just will be loaded the section to the left for show according information.
 * 
 * #002: **Mejor manejo de Promesas**:
 * Al usar un bucle `for...of` or `map` en lugar de `forEach`, evitamos el problema de que `forEach` no maneja Promesas de manera predecible.
 * Esto garantiza que las tarjetas se crean y se insertan en secuencia; anteriormente un supuesto "problema" al momento de rellenar los containers,
 * el orden en que se plasmaban las targetas no iba de acuerdo con el orden de la consulta especificada
 * 
 * #003: the user wish show "more details" about the card selected (side right); so maybe that the subnavbar (side left)
 * its on section "create something" (static), we need redirect to main section in subnavbar because its the unique that have the capacity
 * to change cards depending the iteraction of user, this way we show the data of specific card
 */
/* ------------------------------------------------------------------------------------------------------------------- */

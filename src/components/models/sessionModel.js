/*--------------------------------------------------imports--------------------------------------------------*/
import { cardDevice, cardDepartament, cardFinding, cardDetails, cardDevicesOnDepartament } from '../layout/cards.js';
import { onLoadWhile, offLoadWhile, toggleClassList_onClick } from '../utils/view.js';
import { elementById, elementByClass } from '../utils/values.js';
import { DataByRequest } from '../firebase/query.js';
import { showMessage } from '../utils/alerts.js';
/*-------------------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------mode--------------------------------------------------*/
/** Controller sesion of the user with auxiliary access, allow interactivity into content of current sesion */
export async function modeAdmin() {
    controllerSideBar(elementByClass('.side-bar'));
    await handlerSection(elementByClass('.nav-tabs'));
}
/*-------------------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------controllers--------------------------------------------------*/
/**
 * Control the status of side-bar into section applying a toggle on click, also have a 'pointer leave' event to close when the mouse out of bar
 * @param {HTMLElement} params - This element correspond to sideBar
 */
function controllerSideBar(side_bar) {
    toggleClassList_onClick('.user-options', '.close-options span', 'spawn', side_bar);
    side_bar.addEventListener('pointerleave', () => { side_bar.classList.remove('spawn') });
}
/**
 * Is used to coordinate the contain of section that user click on; this way we can request data and fill the specific containers through a snapshot received
 * @param {HTMLElement} nav - Correspond to element main navbar
 */
async function handlerSection(nav) {
    nav.addEventListener('click', async (e) => {
        let item = e.target.ariaCurrent; if (!item || item === 'home') return;
        await Section.loadCurrentSection(item);
        await eventContainer(Section.getContainerSection(0));
    });
}
/**
 * Allow coordinate the data obtained of the card click on by user in the "container" specific; the buttons into cards execute their logic a according to the card its in
 * @param {string} container - Correspond to container name for add event on click in their cards
 * @example In the side right on current section we can see a container with cards and buttons of actions, this buttons have a fuction where are send the data of the card in context
 */
async function eventContainer(container) {
    elementById(container).addEventListener('click', async (e) => {
        e.preventDefault();
        const card = e.target.getAttribute('request'); if (!card) return;
        const arrayData = Section.getTargetCard(e.target);
        const customObj = buildRequest(card, arrayData);
        return await Section.actionByRequest(customObj);
    });
}
/**
 * This create the handler format to request data query from database; helps me to build a custom key depending to action button clicked
 * @param {string} req - This is the name of the request clicked by the user, correspond to action of the button
 * @param {array} array - Correspond to data from card in context example [101, 10001]
 * @returns {object} returns an object with keys like { customKey: [], query: '', document: boolean }
 * @example addComentary: 006
 */
function buildRequest(req, array) {
    let data = {};
    data[req] = array ? array : 'loadMore'; //better explained in example ^°^
    switch (req) {
        case 'seeReports':
            data.index = 1; data.document = false;
            data.query = { where: ['date', '!=', ''], pagination: ['date', 5] };
            break;
        case 'moreDetails':
            data.index = 1; data.document = true;
            data.query = 'nothing here';
            break;
        case 'loadMore':
            data.index = 0; data.document = false;
            data.query = { where: ['avaliable', '!=', ''], pagination: ['avaliable', 5] }
            break;
        default: break;
    }
    return data;
}
/*-------------------------------------------------------------------------------------------------------------------*/
/**
 * Is designed to handle behavior into current section that user its in; it are compound of the following mechanisms:
 * @example
 * init(); 'its the main controller'
 * updateCredentials(); 'handle the static variables over the present class'
 * handleRoute(); 'allow control the flow of the request; by default allow fill the containers into current section, but with request we can omit the flow on containers off focus'
 * preparateRequest(); 'prepares us a request basing on existence of a handle param, contain a config default to fill containers static defined on the differents sections'
 * routeRequest(); 'configure a route for send request to the database (document or query) depending to the status of the handler in case that exist'
 * clearContainerConditionally(); 'through to the inspect of actions events, we can know if clear container or not do it'
 * @example to reload the section, we need clear the data in the containers to get the new snapshot query
 * createItems(); 'Finally, this allows us create a card to each document finding in the snapshot of the request query by the user'
 */
export class Section {
    /*-------------------------on loop (index, container)-------------------------*/
    static loop_index;
    static loop_container;
    /*-----------------------------------------------------------------------------*/

    /*-----save limit() of the requested query to operate property loadMore...-----*/
    static extensionQuerySnapshot = []
    /*-----------------------------------------------------------------------------*/

    /*----------containers and collections to operate into current section----------*/
    static arrayContainer;
    static arrayCollection;
    /*-----------------------------------------------------------------------------*/

    /*-name and index of the current section; also the handler to specific request-*/
    static currentSection;
    static handlerFormat;
    static indexSection;
    /*-----------------------------------------------------------------------------*/

    /*--------------------------------------------------initialize--------------------------------------------------*/
    static async loadCurrentSection(section) { await Section.init(section) }
    static async actionByRequest(handler) { await Section.init(null, handler) }
    /**
     * Initialize a query data to database for fill the section in context (contain mode default and fixed). Define the content present into containers of current section
     * @param {string} [section = null] - Is the section in context to operate; will be null if we are trying a request in the current section
     * @param {object} [handler = null] - The format is optional for fix request, default is null; could have propierties like moreDetails for example
     * @const {number} loopIndex - this represent the index of container that loop is in ([0, 1])
     * @const {string} loopContainer - is the name container that loop is in (['device-list', 'reports'])
     * @const {string} loopCollection - is the name of collection through wich obtain the data request to fill the current container, we use to find the data location (['device_references', 'finding_references'])
     * @example addComentary: 002
     */
    static async init(section = null, handler = null) {
        try {
            onLoadWhile();
            this.updateCredentials(section, handler);
            let promise = this.arrayContainer.map(async (loopContainer, loopIndex) => {//better explained in example ^°^
                let loopCollection = this.arrayCollection[loopIndex];
                let route = this.handleRoute(loopIndex, loopContainer); if (route === null) return;
                const { dataDefault, arrayQuery } = this.preparateRequest(loopIndex, loopCollection);
                const addressRequest = { routeDeep: route, routeRelative: loopCollection };
                const res = await this.routeRequest(addressRequest, loopIndex, arrayQuery);
                this.loop_index = loopIndex; this.loop_container = loopContainer;
                this.clearContainerConditionally(res);
                this.createItems(res, dataDefault);
            });
            await this.actionsExtraSection();
            await Promise.all(promise);
            offLoadWhile();
        } catch (error) { console.log(error) }
    }
    /*-------------------------------------------------------------------------------------------------------------------*/

    /*--------------------------------------------------update credentials--------------------------------------------------*/
    /**
     * Intend to define escential data to build the queries corresponding to user iteractivity, call data according at context
     * @param {string} [section = null] - Is the name of the current section, may be null, its mean that request action is to current section
     * @param {object} [handler = null] - Is optional and contain keys that coordinate a request data specific, according to context
     * @example Sections = [home:0], [handler-device:1], [control-departaments:2], [user-management:3], [finding-data:4], [filters:5]
     */
    static updateCredentials(section, handler) {
        if (section) Section.currentSection = section;
        if (!handler) Section.extensionQuerySnapshot = [];
        Section.indexSection = this.getIndexSection(this.currentSection);
        Section.arrayCollection = this.collectionToSearch();
        Section.arrayContainer = this.containerToFill();
        Section.handlerFormat = handler;
    }
    /**
     * Through param "context" that represent the name of the current section clicked by the user (main navbar); we can work more easy
     * @param {string} context - Contain name of the section in context
     * @return {number} we get a number that represent the index of the current section in which the user is locate
     */
    static getIndexSection(context) {
        const array = [
            'home',
            'handler-device',
            'control-departaments'
        ];
        return array.findIndex(value => value === context);
    }
    /**
     * Contain all collections to search data; the index position its associated by the correspond container; sorted according to navigator bar
     * @returns {array} returns an array with collections that belongs to containers in current section, this way each container is filled according to collection referenced, return shorted [0],[1]
     */
    static collectionToSearch() {
        const array = [
            ['nothing'],
            ['device_references', 'finding_references'],
            ['departament', 'device_references']
        ];
        return array[this.indexSection]
    }
    /**
     * Contain all containers of each section, we can select them by id; sorted according to navigator bar
     * @returns {array} returns an array with containers that belongs to current section, return shorted [0],[1]
     */
    static containerToFill() {
        const array = [
            ['nothing'],
            ['device-list', 'reports'],
            ['departament-list', 'devices-on-departament']
        ];
        return array[this.indexSection];
    }
    /*-------------------------------------------------------------------------------------------------------------------*/

    /*--------------------------------------------------handler route--------------------------------------------------*/
    /**
     * Helps me control the flow of the current loop (containers in current section), through (allow/deny) we can fill a container specific by using a handler (handlerFormat)
     * @param {number} loopIndex - this represent the index of container that loop is in
     * @param {string} loopContainer - is the name container that loop is in
     * @return {string} by default throws a string 'allow', but if exist request so return "null" or "array[]"
     * @const {object} [handler = null] - we will use this handler to decide; if(!handler).then(continue flow default)
     */
    static handleRoute(loopIndex, loopContainer) {
        const handler = this.handlerFormat;
        if (!handler) return "allow";
        if (handler && loopIndex != handler.index) return null;
        this.controllerPositionSubnavbar(loopContainer);
        return handler[Object.keys(handler)[0]]; //[0] corresponding to customized key
    }
    /**
     * For control when iterating over the options in the side right (scroll container), in same case like that;
     * @param {string} mainSection - Is the name of the main section in the subnavbar
     * @example addComentary: 003
     */
    static controllerPositionSubnavbar(mainSection) {
        const element = elementById('nav-' + mainSection);
        if (element) element.click();
    }
    /*-------------------------------------------------------------------------------------------------------------------*/

    /*--------------------------------------------------preparate request--------------------------------------------------*/
    /**
     * Configure the query basing into index of current container that we are filling (loopIndex)
     * @param {number} loopIndex - Is the number of the current index in the loop
     * @param {string} loopCollection - Is the name of the collection through which query data to database
     * @returns {object} we get a object configured by default (or by this.handlerFormat.query) to set a request
     * @const {object} data - is equal to { where: [], pagination: [], icon: '' }
     * @const {array} arrayConfig - is equals to say ["name", "!=", "pedro", "name", "5"] that represent 'where' and 'pagination'
     */
    static preparateRequest(loopIndex, loopCollection) {
        const config = this.handlerFormat?.query ?? null;
        const data = this.getRequest(loopCollection, config);
        const arrayConfig = this.fixQueryConfig(data, loopIndex);
        return { dataDefault: data.icon, arrayQuery: arrayConfig }
    }
    /**
     * This method allows us to configure the request that we send to Firebase method "getDocs()" with which we obtain the snapshot "documentSnapshot" or "querySnapshot"
     * @param {string} collectionToSearch - Contain name of the collection to query in database, with this name we can inspect the keys of object "data"
     * @param {object} [query = null] - Have three status, could be this;
     * @returns {object} we get a object with keys {icon, where, pagination} to fix the query() method that we will use to send a specific request
     * @const {object} data - is a object with keys that corresponding to specific collection, contain a default config like 'icon'
     * @example addComentary: 005
     */
    static getRequest(collectionToSearch, query = null) {
        const data = {
            device_references: { icon: 'bi bi-display' },
            finding_references: { icon: 'bi bi-file-earmark-text' },
            departament: { icon: 'bx bx-buildings' },
            user: { icon: 'bx bxs-id-card' }
        };
        if (!query) query = this.getDefaultQuery();
        return { ...data[collectionToSearch], ...query };
    }
    /**
     * While we dont have handler in the query "example: filters", we need make the pagination and ordenament in standard mode, this method returns a default query
     * @returns {object} a object with keys ('where' lenght = 3) and ('pagination' lenght = 2)
     * @const {array} array - with a index we can obtain a object to config the query
     * @const {number} this.indexSection - is the index that belongs to current section in context, for example 'home' or 'handler-device'
     */
    static getDefaultQuery() {
        const array = [
            { Home:'nothing' },
            { where: ['avaliable', '!=', '', 'date', '!=', ''], pagination: ['avaliable', 5, 'date', 5] },
            { where: ['name_room', '!=', '', 'avaliable', '!=', '' ], pagination: ['name_room', 5, 'avaliable', 5] }
        ]; return array[this.indexSection];
    }
    /**
     * This includes a logic to get the query config according to extension of data (where and pagination)
     * @param {object} data - Is an object with optional properties like 'where:[]' and 'pagination:[]'
     * @param {number} loopIndex - This represent the number of the current index in the loop
     * @returns {array} an array with the current config based into index of the loop in execute, gives us [length = 5]
     */
    static fixQueryConfig(data, loopIndex) {
        const where = data.where;
        const pagination = data.pagination;
        if (!where || !pagination) return;
        if (where.length > 3) return this.sortQuery(data, loopIndex);
        return [...data.where, ...data.pagination]
    }
    /**
     * Helps us to return a config query corresponding to the index of loop in context
     * @param {object} data - 'where:[]' and 'pagination:[]'
     * @param {number} index - Correspond to the index of the loop its we in
     * @returns {array} an array with the current config based on an index that belongs to the context container
     */
    static sortQuery(data, index) {
        this.saveExtensionLimit(data.pagination, index);
        let index_where = [0, 3], index_pagination = [0, 2];
        if (index === 1) { index_where = [3, 6]; index_pagination = [2, 4] }
        return [
            ...data.where.slice(index_where[0], index_where[1]),
            ...data.pagination.slice(index_pagination[0], index_pagination[1])
        ]
    }
    /**
     * This intend save the length of the requested queries, this way we can know if a request dont have more results, then we could do hide the button (load more...)
     * @param {array} pagination - This is an array with length of 2; this represent values to build the orderBy() and limit(), both methods from firebase
     * @param {number} index - This is the index in which its in locate the current loop in execute
     */
    static saveExtensionLimit(pagination, index) {
        const documentsExpected = pagination[1];
        this.extensionQuerySnapshot[index] = documentsExpected;
    }
    /*-------------------------------------------------------------------------------------------------------------------*/

    /*--------------------------------------------------route request--------------------------------------------------*/
    /**
     * Prepare the request according at "route" defined by the handler received; this way we can send a request to the database and get the assigned snapshot
     * @param {object} addressRequest - {routeDeep: [] or "", routeRelative:  ""} to direct the query to database
     * @param {number} index - This is the container index in which we are (device-list[0] reports[1])
     * @param {array} arrayQueryConfig - Contain the current config to fix the query(method created by firebase) for container in context; is a array with lenght of 5 "where" and "pagination"
     * @returns {snapshot} a querySnapshot or documentSnapshot from database
     * @example 
     * route deep is represented like a array with data for deep search (departament, 101, device, 10001) in database
     * route relative correspond to string with name of collection to search (user, departament, device_references, finding_references)
     */
    static async routeRequest(addressRequest, index, arrayQuery) {
        const { routeDeep, routeRelative } = addressRequest;
        const build = typeof routeDeep === 'string' ? { req: routeRelative } : { req: routeDeep };
        const action = this.handlerFormat ? Object.keys(this.handlerFormat)[0] : false;
        const typeSnapshot = this.handlerFormat?.document ?? false;
        const id = this.handlerFormat?.index ?? index;
        return await DataByRequest.get({
            ...build,
            index: id,
            nameRequest: action,
            isDocument: typeSnapshot,
            queryConfig: arrayQuery
        });
    }
    /*-------------------------------------------------------------------------------------------------------------------*/

    /*--------------------------------------------------clear container conditionally--------------------------------------------------*/
    /**
     * Cleans the specified container based on the provided handlerFormat, then according to finding data received, the text "nothing found" wil be removed
     * @param {snapshot} res - Contain data response of the request in context of the loop
     */
    static clearContainerConditionally(res) {
        const element = elementById(this.loop_container);
        this.setToggle_cardEmpty(element, res);
        this.cleanContainer(element);
    }
    /**
     * Set the visibility of the card by default "nothing found" depending to data found in the snapshot
     * @param {HTMLElement} container - Is the container to clean
     * @param {snapshot} res - Is the response of the request snapshot from firebase, with these we can inspect the response from firebase
     * @example addComentary: 004
     */
    static setToggle_cardEmpty(container, res) {
        const card = container.querySelector('.empty');
        const numDocuments = res.docs?.length ?? res.id;
        const isCardVisible = !card.className.includes('d-none');
        if (numDocuments != 0) isCardVisible ? card.classList.toggle('d-none') : '';
        else isCardVisible ? '' : card.classList.toggle('d-none');
    }
    /**
     * Remove all cards into current container according to data received by the handler, clean the specified container
     * @param {HTMLElement} container - Is the container to clear cards, correspond to DOM element
     * @example addComentary: 001
     */
    static cleanContainer(container) {
        const cards = container.querySelectorAll('.card-body');
        const handler = this.handlerFormat;
        const allow = handler ?
            handler.seeReports ||
            handler.moreDetails ||
            handler.loadMore.allowClean : true;
        if (allow) cards.forEach(card => card.remove());
    }
    /*-------------------------------------------------------------------------------------------------------------------*/

    /*--------------------------------------------------create items--------------------------------------------------*/
    /**
     * Create the cards that will fill the container in context through a loop; with "snapshot" received, we can go through the data got from database "querySnapshot or documentSnapshot"
     * @param {Object} snapshot - Contain data obtained from database, is represented with a querySnapshot or documentSnapshot format, depending on the request sent
     * @param {string} icon - Is a name class to insert a icon in the card context, correspond to bootstrap icons
     * @const {array} data - is converted to element that contain all data from query received, this allow sort the data as iterable element, regardless of type document obtained (querySanpshot or documentSnapshot)
     * @const {HTMLElement} card - mean the card format selected for show in the current container of the section
     * @example addComentary: 007
     */
    static createItems(snapshot, icon) {
        const element = elementById(this.loop_container);
        const btnReference = element.querySelector('#load-more');
        const data = (snapshot.docs ?? [snapshot]).reverse() //better explained in example ^°^
        data.forEach(item => {
            const doc = { snapshot: item, data: item.data() }
            const card = this.setContentCard(doc, icon);
            btnReference.insertAdjacentHTML('beforebegin', card);
        });
        this.handleLoadMore(btnReference, snapshot);
    }
    /**
     * This module have the function that return a card format depending of name container in the loop context, according to current section; or using a handler sent to config a specific card
     * @param {object} value - Contain one of much documents from database coresponding to a snapshot, snapshot: (contain id document) and data: (contain attributes)
     * @param {string} icon - Contain el nameClass to call a icon from Bootstrap-icons
     * @const {object} data - is a object with keys that initially correspond to names of containers got from currect section, thats why we into loop for/of used "nameContainer.includes()" because if(!handler).then(nameContainer contain the key to search
     * @example
     * nameContainer = "device-list" => index(0); so the method returned is 'device: () => cardDevice(value, icon)'
     * nameContainer = "reports" => index(1); so the method returned is 'reports: () => cardFinding(value, icon)'
     * this.handlerFormat = handler contains moreDetails; so the method returned is 'handler[key]'
     */
    static setContentCard(value, icon) {
        const handler = this.handlerFormat;
        const data = {
            /*formats with handler*/
            moreDetails: () => cardDetails(value, icon),
            'devices-on-departament': () => cardDevicesOnDepartament(value, icon),

            /*associated with index(0)*/
            user: () => "cardUser(value, icon)",
            device: () => cardDevice(value, icon),
            finding: () => cardFinding(value, icon),
            departament: () => cardDepartament(value, icon),

            /*associated with index(1)*/
            reports: () => cardFinding(value, icon)
        }
        for (const [key, method] of Object.entries(data)) {
            if (handler ? handler[key] : null) return method();
            if (this.loop_container.includes(key)) return method();
        }
    }
    /**
     * This intend control the behavior of spawn of the load more button, this through inspect and compared the length of the snapshot with the extension of the pagination saved {pagination: 'limit'}; this represent the maximum number of documents provided by the request
     * @param {HTMLElement} loadMore - This is the element 'loadMore' to enable and disable; its are present into container of context
     * @param {snapshot} snapshot - Correspond to result of the query from the database; could be a documentSnapshot or querySnapshot
     */
    static handleLoadMore(loadMore, snapshot) {
        const query = snapshot.docs || [];
        const isCardVisible = !loadMore.className.includes('d-none');
        const data = query.length < this.extensionQuerySnapshot[this.loop_index];
        if (data) isCardVisible ? loadMore.classList.toggle('d-none') : '';
        else isCardVisible ? '' : loadMore.classList.toggle('d-none');
    }
    /*-------------------------------------------------------------------------------------------------------------------*/

    /*--------------------------------------------------actions extras--------------------------------------------------*/
    static async actionsExtraSection() {
        const data = [
            'async () => await this.something()',
            async () => await this.extraHandlerDevice(),
            async () => await this.extraControlDepartaments()
        ];
        await data[this.indexSection]();
    }
    static async extraHandlerDevice(){ await this.fillSelect_createDevice() }
    static async extraControlDepartaments(){ /*nothing*/ }

    static async fillSelect_createDevice() {
        const { getCollectionDepartament } = await import('../firebase/query.js');//get docs from collection
        const departaments = await getCollectionDepartament();

        const currentSection = elementById(this.currentSection);//reference "select" into DOM
        const select = currentSection.querySelector('#create-device-departament');

        const defaultOption = select.querySelector('option[value=""]');//keep default option and clear select (to items accumulated)
        select.innerHTML = ''; select.appendChild(defaultOption);
        departaments.forEach((e) => { select.appendChild(this.optionDepartament(e.id)) });
    }
    static optionDepartament(e){
        const option = document.createElement('option');
        option.value = e; option.textContent = e;
        return option;
    }
    /*-------------------------------------------------------------------------------------------------------------------*/

    /*--------------------------------------------------getters--------------------------------------------------*/
    /**
     * On click a button in any card, we can take him the data to operate more actions through the information obtained about card in context
     * @param {HTMLElement} button - correspond to data of the card clicked by user
     * @returns {array} returns an array that contain the UIDs of the documents according to query deep that we need, another case will be null
     */
    static getTargetCard(button) { return JSON.parse(button.closest('.card').getAttribute('data-card')) }
    /**
     * On click to submit in a form of request, we obtain the type of the action to operate (for example 'create'), this way send data to database
     * @param {HTMLElement} button - Correspond to button 'submit' into form with an attribute "action-button" to direct the action requested by the user
     * @returns {string} returns a string that contain the name of the current query requested by user, for example "Create report"
     */
    static getTargetButton(button) { return JSON.parse(button.getAttribute('ref')) }
    /**
     * Method get to container section
     * @param {number} index - This is the number of the container requested, remember that a section is compound by [0][1]
     * @returns {string} returns the id name of the container basings us an index specific
     */
    static getContainerSection(index) { return Section.arrayContainer[index] }
    /**
     * Method get to current section in context ("home", "handler-device", "control-departaments") etc
     * @returns {string} returns the name of the current container in which user its are
     */
    static getCurrentSection() { return Section.currentSection }
    /*-------------------------------------------------------------------------------------------------------------------*/
}

/*--------------------------------------------------button actions--------------------------------------------------*/
/**
 * Helps us to resolve a requested submit by the user
 * @param {HTMLElement} e - This element correspond to button into request form, contain an attribute "action-btn" with the value of type request
 */
export async function controllerSubmitFormRequest(e) {
    const btn = e.target;
    const req = btn.getAttribute('action-btn'); if (!req) return;
    const attributeRef = Section.getTargetButton(btn) ?? null;
    if (!attributeRef) return await ActionButton.resolve(req);
    await ActionButton.modify(req, attributeRef);
}

class ActionButton {
    static request;
    static index_request;
    static reference = {};
    /*--------------------------------------------------resolve--------------------------------------------------*/
    /**
     * This resolve a form submit according to the type of request, example ["create-report"]
     * @param {string} request - This mean the name of the type request clicked by the user
     */
    static async resolve(request) {
        this.request = request;
        this.index_request = this.getIndexResolve();
        try {
            onLoadWhile();
            const object = await this.getValues();
            if (!object) return offLoadWhile();
            await this.documentPath(object);
            await this.clearFields();
            await this.actionDone();
            await this.reloadSection();
            offLoadWhile();
        } catch (e) { offLoadWhile(); console.log(e); return await showMessage('messageErrorSubmitCheckConnection') }
    }
    /**
     * To get the index corresponding to current request
     * @returns {number} returns the index associated to the request, this allows us to submit the form in a method corresponding
     */
    static getIndexResolve() {
        const array = ['create-report', 'create-device'];
        return array.findIndex(value => value === this.request);
    }
    /**
     * This intend get the values from form in an object
     * @returns {object} returns an object that contain all values from the form diligenced
     * @example addComentary: 008
     */
    static async getValues() {
        const element = elementById(this.request);
        const imp = await import('../utils/values.js');
        const data = [
            () => imp.getInputCreateReport(element),
            () => imp.getInputCreateDevice(element)
        ];
        const fieldValues = data[this.index_request]();
        return await this.checkCompletedFields(fieldValues);
    }
    /**
     * Inspect the "keys" of an param obtained (obj) that represent the different fields filled by the user; we check if some its empty
     * @param {object} obj this correspond to data on the fields of current format
     * @returns {object} returns an object that represent the values of each field from format
     */
    static async checkCompletedFields(obj) {
        const empty = Object.keys(obj).some(key => obj[key] === '');
        if (empty) return await showMessage('messageFieldEmpty');
        return obj;
    }
    /**
     * Execute the submit according to current context and an index_request
     * @param {object} values - Correspond to data from diligenced form, this data is represented into keys
     */
    static async documentPath(values) {
        const imp = await import('../firebase/query.js');
        const data = [
            async () => await imp.createReport(values),
            async () => await imp.createDevice(values)
        ];
        await data[this.index_request]();
    }
    /**
     * Allow show a message 'operation done' according to request specific
     * @returns {message} get a message that comunicate to the user about state of request
     */
    static async actionDone() {
        const data = ['messageCreateReportDone', 'messageCreateDeviceDone'];
        return await showMessage(data[this.index_request], 'alertButtonActionConfirm');
    }
    static async clearFields() {/** To clear the the form */
        const element = elementById(this.request);
        const imp = await import('../utils/values.js');
        const data = [
            () => imp.cleanInputCreateReport(element),
            () => imp.cleanInputCreateDevice(element),
        ];
        data[this.index_request]();
    }
    /*-------------------------------------------------------------------------------------------------------------------*/

    /*--------------------------------------------------modify--------------------------------------------------*/
    /**
     * This resolve an action for a document in context, this according to the type of request, example ["delete-report, update-report"]
     * @param {string} request - This mean the name of the type request clicked by the user
     * @param {object} reference - Correspond to additional data to operate changes into database
     */
    static async modify(request, reference) {
        this.request = request;
        this.reference = reference;
        this.index_request = this.getIndexModify();
        try {
            onLoadWhile();
            await this.routeModify();
            await this.modifyDone();
            await this.reloadSection();
            offLoadWhile();
        } catch (e) { offLoadWhile(); return await showMessage('messageErrorSubmitCheckConnection') }
    }
    static getIndexModify() {
        const array = ['delete-report'];
        return array.findIndex(value => value === this.request);
    }
    static async routeModify() {
        const imp = await import('../firebase/query.js');
        const data = [imp.deleteReport(this.reference)];
        data[this.index_request]
    }
    static async modifyDone() {/** Allow show a message 'operation done' according to request specific */
        const data = ['messageReportDeleted'];
        return await showMessage(data[this.index_request], 'alertButtonActionConfirm');
    }
    static async reloadSection() {
        let section = Section.getCurrentSection();
        await Section.loadCurrentSection(section);
    }
    /*-------------------------------------------------------------------------------------------------------------------*/
}
/*-------------------------------------------------------------------------------------------------------------------*/

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
 * 
 * #004:
 *      const numDocuments = res.docs?.length ?? res.id;
 * I use this sintaxis because we await a snapshot that could be 'querySnapshot' or 'documentSnapshot', these two have different formats;
 * res.docs correspond to 'querySnapshot' and res.id correspond to UID of the document 'documentSnapshpt'
 * 
 * #005:
 * null = when go through containers into current section (like 'home'); remember that we have a query default to main sections
 * string = when request a documentSnapshot (dont need 'where' or 'pagination')
 * object = to build a specific query, intend be a object like this { where: ['avaliable', '!=', 'true'], pagination: ['avaliable', 5] }
 * 
 * #006: with this string we cant continue the flow in handlerRoute() "handler[0] != null => continue" and in the routeRequest() we have a comparation "route (type) = 'string' => req: collectionContext"
 * 
 * #007: the dilem here is that the snapshot received by firebase firestore have this structure:
 * 
 *              ["103", "102", "101"]
 * 
 *       then, when we trying insert targets with this values, way through will its on this way:
 * 
 *              [103]
 *                -
 *              [102]
 *                -
 *              [101]
 * 
 *      this if we insert data from down side (button)
 * 
 *      so, the last element printed, always be the first document with applied filter "snapshot query configurated" example:
 *      if its a filter of "Avaliable" so:
 *      
 *             [not avaliable]
 *                     -
 *             [not avaliable]
 *                     - 
 *               [avaliable]
 * 
 *      because this i need convert the snapshot data in reverse()
 * 
 * #008: El problema se debe a la evaluación inmediata de las expresiones dentro del arreglo. Usar funciones anónimas para diferir la ejecución
 * de las funciones hasta que realmente las necesites es una práctica más profesional y eficiente. Esto no solo mejora el rendimiento, sino que
 * también evita errores al acceder a elementos del DOM que podrían no estar disponibles al momento de la evaluación inicial.
 * 
 * Cuando creas un arreglo o un objeto en JavaScript, todas las expresiones dentro de ese arreglo u objeto se evalúan inmediatamente. En tu caso,
 * las funciones imp.getInputCreateReport(element) y imp.getInputCreateDevice(element) se ejecutan de inmediato y sus resultados se almacenan en
 * el arreglo data.
 */
/* ------------------------------------------------------------------------------------------------------------------- */
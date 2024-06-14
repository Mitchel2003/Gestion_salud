import { db, auth, collection, doc, getDoc, getDocs, query, where, orderBy, limit, startAfter } from "./conection.js";
import { Section } from "../models/sessionModel.js";
/*--------------------------------------------------getters--------------------------------------------------*/
/**
 * Helps us to get data of the present instancie to work about the session
 * @returns We get a object with properties like entity and email of current user
 */
export function getProfileUser() {
    const user = auth.currentUser;
    return { email: user.email, entity: user.photoURL };
}
/**
 * Its a method that search a user document, if exist then get data like (access, key)
 * @param {string} user - Correspond to email of current user
 * @param {string} entity - Mean the entity that user its in
 * @returns {object} initially return a false if dont find a user with this email, else return a object with keys (access and key)
 */
export async function getDocumentUser(user, entity) {
    let access, key;
    const ask = query(getCollectionUser(entity), where("email", "==", user));
    const querySnapshot = await getDocs(ask);
    if (!querySnapshot) { return !querySnapshot.empty; }
    querySnapshot.forEach((doc) => { const value = doc.data(); access = value.access; key = value.key; });
    return { access, key };
}
/*-------------------------------------------------------------------------------------------------------------------*/
/** A request could be querySnapshot or documentSnapshot */
export class DataByRequest {
    static lastDocumentVisible = [];
    static section;
    static request;
    static handler;
    static entity;
    /*--------------------------------------------------DataByRequest.get--------------------------------------------------*/
    /**
     * This allow redirect a request by a query config sent
     * @param {object} [data = null] - is a object {section, entity, isDocument = boolean, ...query} with config to direct the query, this allow update a variables that operate in this class
     * @param {object} [handler = null] - correspond to query config for complex fetch to database, I use this param for the filter algoritm
     * @returns {snapshot} - get a await data query from database
     */
    static async get(data = null, handler = null) {
        if (!data) return await getDocs(getCollection()); //by default
        this.updateCredentials(data, handler);
        const { isDocument } = this.request;
        if (isDocument) return await this.getDocumentRequest();
        return await this.getQueryRequest(data.id);
    }
    /*-------------------------------------------------------------------------------------------------------------------*/

    /*--------------------------------------------------update credentials--------------------------------------------------*/
    /**
     * Define the variables that we will use to redirect the query that returns a snapshot element
     * @param {object} data - Correspond to request for execute the fetch into database
     * @param {object} handler - Is the query config sent to direct a complex snapshot, this way we can get data applying filters
     * @returns {method} set data to use
     */
    static updateCredentials(data, handler) {
        const section = Section.getCurrentSection();
        const { entity } = getProfileUser();
        if (this.section != section) this.lastDocumentVisible = [];
        DataByRequest.section = section;
        DataByRequest.handler = handler;
        DataByRequest.entity = entity;
        DataByRequest.request = data;
    }
    /*-------------------------------------------------------------------------------------------------------------------*/

    /*--------------------------------------------------document request--------------------------------------------------*/
    /**
     * Prepare a documentRequest and get documentSnapshot from database (get a specific document)
     * @returns {documentSnapshot} get a await data query from database "document"
     */
    static async getDocumentRequest() {
        const locationDocument = this.preparateDocument();
        return await getDoc(doc(getCollection(), this.entity, ...locationDocument));
    }
    /**
     * This prepare a deep fetch into database to get a document specific through array size that corresponds to depth of the document location
     * @returns {array} get a array data to configure doc()
     * @const {array} req - is a array that represent each specific document for access to inner collections, then we can access more and more depth
     * @example [101: departament, 10001: device, 10001-1: finding]
     */
    static preparateDocument() {
        const { req } = this.request;
        let prepare = this.section.includes('user') ? ['user', req[0].toString()] : ['departament', req[0].toString()]; //user and departament
        if (req.length === 2) return [...prepare, 'device', req[1].toString()] //device
        if (req.length === 3) return [...prepare, 'device', req[1].toString(), 'finding', req[2].toString()] //finding
        return prepare;
    }
    /*-------------------------------------------------------------------------------------------------------------------*/

    /*--------------------------------------------------query request--------------------------------------------------*/
    /**
     * Prepare a queryRequest and get querySnapshot from database (get a lot documents "bigData"); also keep the last document of snapshot result for apply pagination
     * @returns {querySnapshot} - get a await data query from database "big data"
     */
    static async getQueryRequest(id) {
        //if is by request.id then who i do for save the last document in the array[] according to the container
        const querySnapshot = this.preparateQuery();
        const res = await getDocs(querySnapshot);
        this.lastDocumentVisible[id] = res.docs[res.docs.length - 1];
        console.log(this.lastDocumentVisible); //WORKING HERE...
        return res;
    }
    /**
     * This prepare a query compound, we use 'where' to apply filter, 'orderBy' to format orden of querySnapshot and 'limit' to pagination; also have a conditional to 'loadMore' taking the last document shown in the container[0] (side right)
     * @returns {querySnapshot} get a await data query from database
     * @const {array} queryConfig - is a array with the configuration of 'where' and 'pagination' - .lenght is equal to 5
     * @example ['avaliable', '!=', 'true', 'avaliable', 5]
     */
    static preparateQuery() {
        const { req, queryConfig } = this.request;
        const config = [
            where(queryConfig[0], queryConfig[1], queryConfig[2]),
            orderBy(queryConfig[3]),
            limit(queryConfig[4]),
        ];
        if (this.isLoadMore()) config.push(startAfter(this.handler.lastVisible));
        if (this.isDeepCollection(req)) return this.getDeepQuery(req, config);
        return query(this.getSubCollection(req), ...config);
    }
    /**
     * This method simplify the logic, intend do query with a start position saved into "lastVisible" to obtain restant data from database "pagination"
     * @returns {boolean} a boolean; return "something" if value "handler.lastVisible" contain something, else return "null"
     */
    static isLoadMore() { return this.handler ? this.handler.lastVisible : null }
    /**
     * Allow return a boolean according to request received; if "req" is an array, so the requeride documents is located at a deeper level
     * @param {string} req - Naturally is a string, but if the query it's more deeper level, so its a array with values like [101, 10001] that correspond to document each time more deep
     * @returns {boolean} return "true" if the request is a array, else return "false"
     */
    static isDeepCollection(req) { return Array.isArray(req) }
    /**
     * This intend build a query() basing in an array with a length corresponding to level of depth, this deep query its works by referencing the order in which collections are found in the database
     * @param {array} request - Array with the documents to access in depth into database
     * @param {array} configuration - Is an array with the builders of the query (where, orderBy, limit)
     * @returns {querySnapshot} - returns a configurated deep query
     */
    static getDeepQuery(request, configuration) {
        const deepSnapshot = this.prepareDeepQuery(request);
        return query(this.buildSubCollection(deepSnapshot), ...configuration);
    }
    /**
     * Allows us preparate the depth of the query(), this through the length of the array
     * @param {array} request - Is an array like (example: 101, 10001)
     * @returns {array} we get an array to complement building of the query with a depth specific
     * @example addComentary: 001
     */
    static prepareDeepQuery(request){
        let prepare = ['departament', request[0].toString(), 'device'];
        if (request.length === 2) return [...prepare, request[1].toString(), 'finding'];
        return prepare
    }
    /*-------------------------------------------------------------------------------------------------------------------*/

    /*--------------------------------------------------tools--------------------------------------------------*/
    /**
     *
     */
    static buildSubCollection(array){ return collection(getCollection(), this.entity, ...array) }
    /**
     * This method simplify the code through access to subcollection in context
     * @param {string} subCollection - Is the name of the sub collection to inspect
     * @returns {collection} a element collection from firebase to build query
     * @example main => entity => device_references     
     */
    static getSubCollection(subCollection) { return collection(getCollection(), this.entity, subCollection) }
    static getLastDocument() { return DataByRequest.lastDocumentVisible }
    /*-------------------------------------------------------------------------------------------------------------------*/
}
/*--------------------------------------------------tools modularization--------------------------------------------------*/
export function getCollection() { return collection(db, 'main') }
export function getCollectionUser(entityContext) { return collection(getCollection(), entityContext, 'user') }
export function getQueryParams() { const searchParams = new URLSearchParams(window.location.search); return Object.fromEntries(searchParams.entries()) }
/*-------------------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------addComentary--------------------------------------------------*/
/**
 * #001:
 * device: in this section, at on click the cards (side right), could be show findings according
 * departament: in this section, at on click the cards (side right), could be show devices according 
 */
/* ------------------------------------------------------------------------------------------------------------------- */


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
 * 
 * @param {string} user - Correspond to 
 * @param {*} entity 
 * @returns 
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
    static lastDocumentVisible;
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
        return await this.getQueryRequest();
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
        if (this.section != section) this.lastDocumentVisible = null;
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
    static async getQueryRequest() {
        const querySnapshot = this.preparateQuery();
        const res = await getDocs(querySnapshot);
        this.lastDocumentVisible = res.docs[res.docs.length - 1];
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
        if (this.handler ? this.handler.lastVisible : false) config.push(startAfter(this.handler.lastVisible));
        return query(this.getSubCollection(req), ...config);
    }
    /*-------------------------------------------------------------------------------------------------------------------*/

    /*--------------------------------------------------tools--------------------------------------------------*/
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
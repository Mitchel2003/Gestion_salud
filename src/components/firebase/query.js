import { db, auth, collection, doc, getDoc, getDocs, query, where, orderBy, limit, startAfter } from "./conection.js";
/*--------------------------------------------------booleans and getters--------------------------------------------------*/
export function getProfileUser() {
    const user = auth.currentUser;
    return { email: user.email, entity: user.photoURL };
}
export async function getDocumentUser(user, entity) {
    let access, key;
    const ask = query(getCollectionUser(entity), where("email", "==", user));
    const querySnapshot = await getDocs(ask);
    if (!querySnapshot) { return !querySnapshot.empty; }
    querySnapshot.forEach((doc) => { const value = doc.data(); access = value.access; key = value.key; });
    return { access, key };
}
export class DataByRequest { //could be querySnapshot or documentSnapshot
    static lastDocumentVisible;
    static section;
    static request;
    static handler;
    static entity;
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
    /**
     * prepare a documentRequest and get documentSnapshot from database (get a specific document)
     * @returns {documentSnapshot} get a await data query from database "document"
     */
    static async getDocumentRequest() {
        const documentSnapshot = this.preparateDocument();
        return await getDoc(documentSnapshot);
    }
    /**
     * prepare a queryRequest and get querySnapshot from database (get a lot documents "bigData"); also keep the last document of snapshot result for apply pagination
     * @returns {querySnapshot} - get a await data query from database "big data"
     */
    static async getQueryRequest() {
        const querySnapshot = this.preparateQuery();
        const res = await getDocs(querySnapshot);
        this.lastDocumentVisible = res.docs[res.docs.length - 1];
        return res;
    }
    /**
     * this prepare a deep fetch into database to get a document specific through array size "request" that correspond to deep location document (that corresponds to depth of the document location )
     * @returns {querySnapshot} - get a await data query from database
     */
    static preparateDocument() {
        const { req, nameSection } = this.request;
        let prepare = nameSection.includes('user') ? ['user', req[0].toString()] : ['departament', req[0].toString()]; //user and departament
        if (req.length === 2) return [...prepare, 'device', req[1].toString()] //device
        if (req.length === 3) return [...prepare, 'device', req[1].toString(), 'finding', req[2].toString()] //finding
        return doc(getCollection(), this.entity, ...prepare);
    }
    static preparateQuery() {
        const { queryConfig } = this.request;
        const config = [
            where(queryConfig[0], queryConfig[1], queryConfig[2]),
            orderBy(queryConfig[3]),
            limit(queryConfig[4]),
        ];
        if (this.handler ? this.handler.lastVisible : false) config.push(startAfter(this.handler.lastVisible));
        return query(this.getSubCollection(), ...config);
    }
    static updateCredentials(data, handler) {
        DataByRequest.request = data;
        DataByRequest.handler = handler;
        DataByRequest.entity = data.entity;
        /*working in this*/if (this.section === null || this.section != data.section) { this.lastDocumentVisible = null; this.section = data.section }
    }
    /*------------------------------tools------------------------------*/
    static getSubCollection() { return collection(getCollection(), this.request.entity, this.request.req) }
    static getLastDocument() { return DataByRequest.lastDocumentVisible }
}
/*--------------------------------------------------tools modularization--------------------------------------------------*/
export function getCollection() { return collection(db, 'main') }
export function getCollectionUser(entityContext) { return collection(getCollection(), entityContext, 'user') }
export function getQueryParams() { const searchParams = new URLSearchParams(window.location.search); return Object.fromEntries(searchParams.entries()) }
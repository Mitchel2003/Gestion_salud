import { db, auth, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, orderBy, limit, startAfter, Timestamp } from "./conection.js";
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
    static entity;
    /*--------------------------------------------------DataByRequest.get--------------------------------------------------*/
    /**
     * This allow redirect a request by a query config sent
     * @param {object} [data = null] - is a object {section, entity, isDocument = boolean, ...query} with config to direct the query, this allow update a variables that operate in this class
     * @returns {snapshot} - get a await data query from database according a request sent
     * @const {number} data.index - correspond to index of container in context
     */
    static async get(data = null) {
        if (!data) return await getDocs(getCollection()); //by default
        this.updateCredentials(data);
        const { isDocument } = this.request;
        if (isDocument) return await this.getDocumentRequest();
        return await this.getQueryRequest(data.index);
    }
    /*-------------------------------------------------------------------------------------------------------------------*/

    /*--------------------------------------------------update credentials--------------------------------------------------*/
    /**
     * Define the variables that we will use to redirect the query that returns a snapshot element
     * @param {object} data - Correspond to request for execute the fetch into database
     * @returns {method} set data to use
     */
    static updateCredentials(data) {
        const section = Section.getCurrentSection();
        const { entity } = getProfileUser();
        if (this.section != section) this.lastDocumentVisible = [];
        DataByRequest.section = section;
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
     * @param {number} index - Correspond to index of the container in which we are [0][1]
     * @returns {querySnapshot} - get a await data query from database "big data"
     */
    static async getQueryRequest(index) {
        const querySnapshot = this.preparateQuery(index);
        const res = await getDocs(querySnapshot);
        this.lastDocumentVisible.push(res.docs[res.docs.length - 1]);
        return res;
    }
    /**
     * This prepare a query compound, we use 'where' to apply filter, 'orderBy' to format orden of querySnapshot and 'limit' to pagination; also have a conditional to 'loadMore' taking the last document shown in the container[0] (side right)
     * @param {number} index - Is the index that we will use to indicate the last document "to pagination"; its are relacioned with the container (side left or right);
     * @returns {querySnapshot} get a await data query from database
     * @const {array} queryConfig - is a array with the configuration of 'where' and 'pagination' - .lenght is equal to 5
     * @example ['avaliable', '!=', 'true', 'avaliable', 5]
     */
    static preparateQuery(index) {
        const { req, queryConfig } = this.request;
        const config = [
            where(queryConfig[0], queryConfig[1], queryConfig[2]),
            orderBy(queryConfig[3]),
            limit(queryConfig[4]),
        ];
        if (this.isLoadMore()) config.push(startAfter(this.lastDocumentVisible[index]));
        if (this.isDeepCollection(req)) return this.getDeepQuery(req, config);
        return query(getSubCollection(req), ...config);
    }
    /**
     * This method simplify the logic, intend do query with a start position saved into "lastVisible" to obtain restant data from database "pagination"
     * @returns {boolean} a boolean; return "something" if value "handler.lastVisible" contain something, else return "null"
     */
    static isLoadMore() {
        const { nameRequest } = this.request;
        const value = nameRequest === 'loadMore';
        return value;
    }
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
    static prepareDeepQuery(request) {
        let prepare = ['departament', request[0].toString(), 'device'];
        if (request.length === 2) return [...prepare, request[1].toString(), 'finding'];
        return prepare
    }
    /*-------------------------------------------------------------------------------------------------------------------*/

    /*--------------------------------------------------tools--------------------------------------------------*/
    static buildSubCollection(array) { return collection(getCollection(), this.entity, ...array) }
    static getLastDocument() { return DataByRequest.lastDocumentVisible }
    /*-------------------------------------------------------------------------------------------------------------------*/

    /*--------------------------------------------------getters--------------------------------------------------*/
    static getEntity() { return DataByRequest.entity }
    /*-------------------------------------------------------------------------------------------------------------------*/
}
/*--------------------------------------------------tools modularization--------------------------------------------------*/
export function getCollection() { return collection(db, 'main') }
export function getCollectionUser(entityContext) { return collection(getCollection(), entityContext, 'user') }
export async function getCollectionDepartament() { return await getDocs(getSubCollection('departament')) } //to call all departments over entity we its in
/**
 * This method simplify the code through access to subcollection in context
 * @param {string} subCollection - Is the name of the sub collection to inspect
 * @returns {collection} an element collection from firebase to build query
 * @example main => entity => device_references     
 */
export function getSubCollection(subCollection) { return collection(getCollection(), DataByRequest.getEntity(), subCollection) }
export function getQueryParams() { const searchParams = new URLSearchParams(window.location.search); return Object.fromEntries(searchParams.entries()) }
/*-------------------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------resolve request--------------------------------------------------*/
/**
 * Allows us create a report document with them respective references
 * @param {object} fields - Correspond to data from form diligenced to create report
 */
export async function createReport({time, date, subject, avaliable, id_device, description, typeMaintenance}) {
    const { getTimestampFromDateTime } = await import('../utils/convert.js');//Convert to timestamp the date and time selected by user
    const timestamp = getTimestampFromDateTime(date, time);
    const dateTimestamp = Timestamp.fromDate(new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6));

    const collection = getSubCollection('device_references');/*get data device_references to obtain path tools*/
    const device_references = await getDoc(doc(collection, id_device));
    const {id_departament, name_departament, serial} = device_references.data();

    const toDeepDevice = [id_departament, 'device', id_device];/*query global data from device (length_finding) and get "length" od reports*/
    const docReference = doc(getSubCollection('departament'), ...toDeepDevice);
    const snapshot = await getDoc(docReference);
    const dataDevice = snapshot.data();
    let length_finding = dataDevice?.length_finding ?? 0;
    length_finding++; //increment 1 more

    const uid_report = `${id_device}-${length_finding}`;/*define uid to create report*/
    await setDoc(doc(getSubCollection('finding_references'), uid_report), {/*create document on collection findign_references*/
        subject: subject,
        info: description,
        date: dateTimestamp,
        id_device: id_device,
        type: typeMaintenance,
        serial_device: serial,
        id_departament: id_departament,
        name_departament: name_departament,
    });
    await setDoc(doc(getSubCollection('departament'), ...toDeepDevice, 'finding', uid_report ), {/*create document finding on depth level collection*/
        subject: subject,
        info: description,
        date: dateTimestamp,
        id_device: id_device,
        type: typeMaintenance,
    });
    await updateDoc(doc(getSubCollection('device_references'), id_device), { avaliable: avaliable });//update avaliable device_references
    await updateDoc(doc(getSubCollection('departament'), ...toDeepDevice), { avaliable: avaliable, lastReport: dateTimestamp, length_finding: length_finding });//update avaliable device (collection deep)
}
/**
 * Allows us delet a report document with them respective references
 * @param {object} reference - Correspond to references for locate data target
 */
export async function deleteReport({id_device, id_report}){
    const collection = getSubCollection('device_references');//get data device_references to obtain path tools
    const device_references = await getDoc(doc(collection, id_device));
    const {id_departament} = device_references.data();

    const toDeepDevice = [id_departament, 'device', id_device];//get global data "length_finding" to chage status
    const docReference = doc(getSubCollection('departament'), ...toDeepDevice);
    const snapshot = await getDoc(docReference);
    const dataDevice = snapshot.data();
    let length_finding = dataDevice?.length_finding ?? 0;

    const [device, report] = id_report.split('-');//logic to reset id_report (only if the report deleted is the last)
    const numberReport = parseInt(report, 10);
    if(numberReport === length_finding) length_finding--; //decrement 1 less

    await deleteDoc(doc(getSubCollection('finding_references'), id_report));//delete report from finding_references
    await deleteDoc(doc(getSubCollection('departament'), ...toDeepDevice, 'finding', id_report));//delete report from finding (deep collection)
    await updateDoc(doc(getSubCollection('departament'), ...toDeepDevice), { length_finding: length_finding });//update info global associated with this device
}
/**
 * Allows us create a device document with them respective references
 * @param {object} fields - Correspond to data from form diligenced to create device
 */
export async function createDevice({serial, warranty, avaliable, specifications, id_departament}) {
    const docReference = doc(getSubCollection('departament'), id_departament);//get global data 'length_device' to change status
    const snapshot = await getDoc(docReference);
    const dataDepartament = snapshot.data();
    let length_device = dataDepartament?.length_device ?? 0;
    length_device++; //inclement 1 more

    const uid_device = (10000 + length_device).toString();
    const toDeepDevice = [id_departament, 'device', uid_device];
    await setDoc(doc(getSubCollection('departament'), ...toDeepDevice), {//create device document
        serial: serial,
        length_finding: 0,
        warranty: warranty,
        avaliable: avaliable,
        specifications: specifications
    });
    await setDoc(doc(getSubCollection('device_references'), uid_device), {//create device_references
       serial: serial,
       avaliable: avaliable,
       id_departament: id_departament,
       name_departament: dataDepartament.name_room
    });
    await updateDoc(doc(getSubCollection('departament'), id_departament), { length_device: length_device });//update global data departament
}
/**
 * 
 * @param {*} param 
 */
export async function createDepartament({data}){
    //query how many departments exist to increment in 1++
    const snapshot = await getDocs(getSubCollection('departament'));

    // let cantDepartaments = 0;
    // snapshot.forEach((e) = { cantDepartaments++ })

    // let id_departament = 100 + cantDepartament + 1;
}
/*-------------------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------addComentary--------------------------------------------------*/
/**
 * #001:
 * device: in this section, at on click the cards (side right), could be show findings according
 * departament: in this section, at on click the cards (side right), could be show devices according 
 */
/* ------------------------------------------------------------------------------------------------------------------- */

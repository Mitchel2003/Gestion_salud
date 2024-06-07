import { db, auth, collection, getDoc, getDocs, query, where, orderBy, limit, doc } from "./conection.js";
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
export class DataByRequest { //return querySnapshot "getDocs"
    static request;
    static handler;
    static lastDocumentVisible;
    
    static async get(array = null, handler = null) {
        DataByRequest.request = array;
        DataByRequest.handler = handler;

        if (!array) return await getDocs(getCollection());
        await this.isDocumentRequest(); //could be querySnapshot or documentSnapshot
        return await getDoc(doc(getCollection(), entity, ...this.preparateDocument(array, section)));
        
        const querySnapshot = this.buildQuery(this.getSubCollection(array), array, handler);
        const response = await getDocs(querySnapshot);
        this.lastDocumentVisible = response.docs[response.docs.length - 1]; return response;
    }
    static isDocumentRequest(){
        if (this.handler ? this.handler.document : false) return true;
    }
    static preparateQuery(subCollection, array, filter = null) {
        const { queryConfig } = array;
        const config = [
            where(queryConfig[0], queryConfig[1], queryConfig[2]),
            orderBy(queryConfig[3]),
            limit(queryConfig[4]),
        ];
        if (filter ? filter.lastVisible : false) { config.push(startAfter(filter.lastVisible)) }
        return query(subCollection, ...config);
    }
    static preparateDocument(array, section) {
        let prepare = section.includes('user') ? ['user', array[0].toString()] : ['departament', array[0].toString()]; //user and departament
        if (array.length === 2) return [...prepare, 'device', array[1].toString()] //device
        if (array.length === 3) return [...prepare, 'device', array[1].toString(), 'finding', array[2].toString()] //finding
        return prepare;
    }
    /*------------------------------tools------------------------------*/
    static getSubCollection(array) { return collection(getCollection(), array.entity, array.req) }
    static getLastDocument() { return DataByRequest.lastDocumentVisible }
}
// export class DataByDocument { //return documentSnapshot "getDoc"
//     static async get(array, entity, section) { return await getDoc(doc(getCollection(), entity, ...this.preparateDocument(array, section))) }
// }
/*--------------------------------------------------tools modularization--------------------------------------------------*/
export function getCollection() { return collection(db, 'main') }
export function getCollectionUser(entityContext) { return collection(getCollection(), entityContext, 'user') }
export function getQueryParams() { const searchParams = new URLSearchParams(window.location.search); return Object.fromEntries(searchParams.entries()) }
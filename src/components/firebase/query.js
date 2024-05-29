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
    static lastDocumentVisible;
    static async get(array = null, filter = null) {
        if (!array) return await getDocs(getCollection());
        const querySnapshot = this.buildQuery(this.getSubCollection(array), array, filter);
        const response = await getDocs(querySnapshot);
        this.lastDocumentVisible = response.docs[response.docs.length - 1]; return response;
    }
    static buildQuery(subCollection, array, filter = null) {
        const { queryConfig } = array;
        const config = [
            where(queryConfig[0], queryConfig[1], queryConfig[2]),
            orderBy(queryConfig[3]),
            limit(queryConfig[4]),
        ];
        if (filter) { config.push(startAfter(filter.lastVisible)) }
        return query(subCollection, ...config);
    }
    static getSubCollection(array) { return collection(getCollection(), array.entity, array.req) }
    static getLastDocument() { return DataByRequest.lastDocumentVisible }
}
export class DataByDocument { //return documentSnapshot "getDoc"
    static async get(array, entity, section) {
        return await getDoc(getReferenceEntity(entity), ...this.preparateDocument(array, section))
    }
    static preparateDocument(array, section) {
        let prepare = section.includes('user') ? ['user', array[0].toString()] : ['departament', array[0].toString()]; //user and departament
        if (array.length === 2) return [...prepare, 'device', array[1].toString()] //device
        if (array.length === 3) return [...prepare, 'device', array[1].toString(), 'finding', array[2].toString()] //finding
        return prepare;
    }
}
/*--------------------------------------------------tools modularization--------------------------------------------------*/
export function getCollection() { return collection(db, 'main') }
export function getCollectionUser(entityContext) { return collection(getCollection(), entityContext, 'user') }
export function getReferenceEntity(entityContext) { return doc(getCollection(), entityContext) }
export function getQueryParams() { const searchParams = new URLSearchParams(window.location.search); return Object.fromEntries(searchParams.entries()) }
/* --------------------------------------------------addComentary-------------------------------------------------- */
/*
snapshot:
export async function getDataByRequest(array = null, filter = null) {
    let querySnapshot;
    if (!array) { return await getDocs(getCollection()); };
    const { query, where, orderBy, limit, startAfter } = await import('./conection.js');
    const subCollection = collection(getCollection(), array.entity, array.req);

    if(!filter){ querySnapshot = query(subCollection, where(array.queryConfig[0], array.queryConfig[1], array.queryConfig[2]), orderBy(array.queryConfig[3]), limit(array.queryConfig[4])) }
    else { querySnapshot = query(subCollection, where(array.queryConfig[0], array.queryConfig[1], array.queryConfig[2]), orderBy(array.queryConfig[3]), startAfter(filter.lastVisible), limit(array.queryConfig[4])) }
    return await getDocs(querySnapshot);
}
*/
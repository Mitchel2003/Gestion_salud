import { db, auth, collection, doc, getDocs, query, where, orderBy, limit } from "./conection.js";
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

export class DataByRequest {
    static lastDocumentVisible;

    static async get(array = null, filter = null) {
        if (!array) return await getDocs(getCollection());
        const subCollection = this.getSubCollection(array);
        const querySnapshot = this.buildQuery(subCollection, array, filter);
        const response = await getDocs(querySnapshot);
        this.lastDocumentVisible = response.docs[response.docs.length - 1];
        return response;
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


// export async function getDataByRequest(array = null, filter = null) {
//     let querySnapshot;
//     if (!array) { return await getDocs(getCollection()); };
//     const { query, where, orderBy, limit, startAfter } = await import('./conection.js');
//     const subCollection = collection(getCollection(), array.entity, array.req);

//     if(!filter){ querySnapshot = query(subCollection, where(array.queryConfig[0], array.queryConfig[1], array.queryConfig[2]), orderBy(array.queryConfig[3]), limit(array.queryConfig[4])) }
//     else { querySnapshot = query(subCollection, where(array.queryConfig[0], array.queryConfig[1], array.queryConfig[2]), orderBy(array.queryConfig[3]), startAfter(filter.lastVisible), limit(array.queryConfig[4])) }
//     return await getDocs(querySnapshot);
// }
/*--------------------------------------------------tools modularization--------------------------------------------------*/
export function getCollection() {
    const collectionReference = collection(db, 'main');
    return collectionReference;
}
export function getCollectionUser(entityContext) {
    const documentReference = doc(getCollection(), entityContext);
    const subCollection = collection(documentReference, 'user');
    return subCollection;
}
export function getQueryParams() {
    const queryString = window.location.search;
    const searchParams = new URLSearchParams(queryString);
    return Object.fromEntries(searchParams.entries());
}

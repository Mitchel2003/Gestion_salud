import { db, auth, collection, doc, getDocs } from "./conection.js";
/*--------------------------------------------------booleans and getters--------------------------------------------------*/
export function getProfileUser() {
    const user = auth.currentUser;
    return { email: user.email, entity: user.photoURL };
}
export async function getDocumentUser(user, entity) {
    let access, key;
    const { query, where } = await import('./conection.js');
    const ask = query(getCollectionUser(entity), where("email", "==", user));
    const querySnapshot = await getDocs(ask);
    if (!querySnapshot) { return !querySnapshot.empty; }
    querySnapshot.forEach((doc) => { const value = doc.data(); access = value.access; key = value.key; });
    return { access, key };
}

// export class DataByRequest {
//     static lastDocumentVisible;
//     static async get(array = null) {
//         if (!array) { return await getDocs(getCollection()); };
//         const { query, where, orderBy, limit } = await import('./conection.js');
//         const subCollection = collection(getCollection(), array.entity, array.req);
//         const querySnapshot = query(subCollection, where(array.queryConfig[0], array.queryConfig[1], array.queryConfig[2]), orderBy(array.queryConfig[3]), limit(array.queryConfig[4]));

//         const snapshot = await getDocs(querySnapshot);
//         this.lastDocumentVisible = snapshot.docs[snapshot.docs.length - 1];
//         return snapshot;
//     }
//     getLastItem() { return DataByRequest.lastDocumentVisible }
// }

// async function loadMore(res, lastDocument){


// }

export async function getDataByRequest(array = null, filter = null) {
    let querySnapshot;
    if (!array) { return await getDocs(getCollection()); };
    const { query, where, orderBy, limit, startAfter } = await import('./conection.js');
    const subCollection = collection(getCollection(), array.entity, array.req);
    
    if(!filter){ querySnapshot = query(subCollection, where(array.queryConfig[0], array.queryConfig[1], array.queryConfig[2]), orderBy(array.queryConfig[3]), limit(array.queryConfig[4])) }
    else { querySnapshot = query(subCollection, where(filter.queryConfig[0], filter.queryConfig[1], filter.queryConfig[2]), orderBy(filter.queryConfig[3]), startAfter(filter.lastVisible), limit(filter.queryConfig[4])) }
    return await getDocs(querySnapshot);
}
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

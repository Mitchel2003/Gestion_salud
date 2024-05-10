import { db, auth, collection, doc, getDocs, query, where } from "./conection.js";
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
export async function getDataByRequest(request = null) {
    if (request) { return await getDocumentSubCollection(request); };
    return await getDocs(getCollection());
}
/*--------------------------------------------------tools modularization--------------------------------------------------*/
async function getDocumentSubCollection({data: array}) {
    const documentReference = doc(getCollection(), array.entity);
    const subCollection = collection(documentReference, array.req)
        .orderBy(array.filter)
        .limit(array.limit);
    return await getDocs(subCollection);
}
// export async function pullQuery(object, deep, condicion) {//apply condicion, apropiade for get small data
//     const init = doc(db, 'main', object['1']);
//     let collectionContext;

//     switch (deep) {
//         case 1://user and departament
//             collectionContext = collection(init, object['2']);
//             break;
//         case 2://device
//             const subDocument = doc(init, object['2'], object['3']);
//             collectionContext = collection(subDocument, object['4']);
//             break;
//         case 3://finding
//             break;

//         default:
//             const ask = query(collection(init, object['2']), where(condicion['p1'], condicion['o1'], condicion['p2']));
//             const querySnapshot = await getDocs(ask);
//             return querySnapshot;
//             break;
//     }
// }
async function filterQuery(object) {
    if (object) {
        const ask = query(collection(init, object['2']), where(condicion['p1'], condicion['o1'], condicion['p2']));
    }
}






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

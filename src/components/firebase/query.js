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
    if(!querySnapshot){return !querySnapshot.empty;}
    querySnapshot.forEach((doc) => { const value = doc.data(); access = value.access; key = value.key; });
    return { access, key };
}
export async function getDataByRequest(request = null) {
    const initialCollection = collection(db, 'main');//collection default
    if(request){ requestAddress(request, initialCollection); return; };
    const querySnapshot = await getDocs(initialCollection);
    return querySnapshot;
}
/*--------------------------------------------------tools modularization--------------------------------------------------*/
export async function requestAddress(array) {
    const initCollection = doc(db, 'main', array['data'].entity);
    const deep = array['deep'];
    

    if (deep === 1) {//user and departament
        const subCollection = collection(init, array['data'].first_level);
        const querySnapshot = await getDocs(subCollection);
        return querySnapshot;
    }
    if (deep === 2) {//device
        const subCollection = collection(init, 'device');
        const querySnapshot = await getDocs(subCollection);
        return querySnapshot;
    }
    if (deep === 3) {//finding

    }

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
async function getDataByReference(){

}





export function getCollection(context) {
    const collectionReference = collection(db, context);
    return collectionReference;
}
export function getCollectionUser(entityContext) {
    const documentReference = doc(getCollection('main'), entityContext);
    const subCollection = collection(documentReference, 'user');
    return subCollection;
}
export function getQueryParams() {
    const queryString = window.location.search;
    const searchParams = new URLSearchParams(queryString);
    return Object.fromEntries(searchParams.entries());
}

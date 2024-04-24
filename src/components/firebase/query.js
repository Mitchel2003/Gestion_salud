import { collection, db, doc, getDocs, query, where } from "./conection.js";
/*--------------------------------------------------booleans and getters--------------------------------------------------*/
export async function isFoundDocumentReference(user) {
    const ask = query(await getCollection("userInfo"), where("email", "==", user));
    const querySnapshot = await getDocs(ask);
    return !querySnapshot.empty;
}
export async function getDocumentUser(user) {
    let access, key;
    const ask = query(await getCollection("userInfo"), where("email", "==", user));
    const querySnapshot = await getDocs(ask);
    querySnapshot.forEach((doc) => { const value = doc.data(); access = value.access; key = value.key; });
    return { access, key };
}
export async function getDataCollection(object) {//for big data query (listCollections contain min 2 elements)
    const key = Object.keys(object);
    if (key.includes('2')) { await checkExtensionData(object); return; }

    //query all entities
    const ask = await getCollection("main");
    const querySnapshot = await getDocs(ask);
    return querySnapshot;
}
export async function checkExtensionData(data){
    if(data['2'] === ''){ await isBigData(data); } //at fetch in collection
    else{ isSmallData(); } //at fetch in document
}
export async function isBigData(object){
    const init = doc(db, 'main', object['1'])
    const subCollection = collection(init, object['2']);
    const querySnapshot = await getDocs(subCollection);
    return querySnapshot;
}
export async function isSmallData(){
    
}

/*--------------------------------------------------tools modularization--------------------------------------------------*/
export async function getCollection(context) {
    const collectionReference = await collection(db, context);
    return collectionReference;
}
export function getQueryParams() {
    const queryString = window.location.search;
    const searchParams = new URLSearchParams(queryString);
    return Object.fromEntries(searchParams.entries());
}

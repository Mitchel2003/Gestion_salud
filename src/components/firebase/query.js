import { db, getDocs, query, where } from "./conection.js";
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
    querySnapshot.forEach((doc)=>{ const value = doc.data(); access = value.access; key = value.key; });
    return { access, key };
}
/*--------------------------------------------------tools modularization--------------------------------------------------*/
export async function getCollection(context) {
    const collectionReference = await (await import('./conection.js')).collection(db, context);
    return collectionReference;
}
export function getQueryParams() {
    const queryString = window.location.search;
    const searchParams = new URLSearchParams(queryString);
    return Object.fromEntries(searchParams.entries());
}

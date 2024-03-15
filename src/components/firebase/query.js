import { getDocs, query, where } from "./conection.js";
/*--------------------------------------------------booleans--------------------------------------------------*/
export async function isFoundEmail(emailContext) {
    const ask = query(await getCollection("user"), where("email", "==", emailContext));
    const querySnapshot = await getDocs(ask);
    return !querySnapshot.empty;
}
export async function isFoundAccess(emailContext) {
    const ask = query(await getCollection("user"),
        where("email", "==", emailContext),
        where("key", "==", true));
    const querySnapshot = await getDocs(ask);
    return !querySnapshot.empty;
}
export async function isCredentialValid(user, password) {
    const ask = query(await getCollection("user"),
        where("email", "==", user),
        where("password", "==", password));
    const querySnapshot = await getDocs(ask);
    return !querySnapshot.empty;
}
export async function resetPassword (email) {
    return await (await import('../firebase/conection.js')).sendPasswordResetEmail((await import('./conection.js')).auth, email);
}
/*--------------------------------------------------tools modularization--------------------------------------------------*/
export async function getCollection(context) {
    const collectionReference = (await import('../firebase/conection.js')).collection((await import('./conection.js')).db, context);
    return collectionReference;
}

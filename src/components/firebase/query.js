import { auth, getDocs, query, where } from "./conection.js";
/*--------------------------------------------------booleans and getters--------------------------------------------------*/
export async function isFoundAccess() {
    const user = await auth.currentUser;
    const key = user.key;
    return key;
}
export async function isFoundDocumentReference(user) {
    const ask = query(await getCollection("userInfo"), where("email", "==", user));
    const querySnapshot = await getDocs(ask);
    return !querySnapshot.empty;
}
export async function getDocumentUser(user) {
    const ask = query(await getCollection("userInfo"), where("email", "==", user));
    const querySnapshot = await getDocs(ask);
    return { access: querySnapshot.access, key: querySnapshot.key };
}

/*--------------------------------------------------on/off session--------------------------------------------------*/
export async function onSession(email, password) {
    return await (await import('../firebase/conection.js')).signInWithEmailAndPassword(auth, email, password);
}
export async function offSession() {
    return await (await import('../firebase/conection.js')).signOut(auth);
}
/*--------------------------------------------------resetPassword--------------------------------------------------*/
export async function sendToEmailResetPassword(email) {
    return await (await import('../firebase/conection.js')).sendPasswordResetEmail(auth, email);
}
export async function validateResetPassword(obbCode, newPassword) {
    return await (await import('../firebase/conection.js')).confirmPasswordReset(auth, obbCode, newPassword);
}
/*--------------------------------------------------tools modularization--------------------------------------------------*/
export async function getCollection(context) {
    const collectionReference = await (await import('./conection.js')).collection((await import('./conection.js')).db, context);
    return collectionReference;
}

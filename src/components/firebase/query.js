import { auth } from "./conection.js";
/*--------------------------------------------------booleans--------------------------------------------------*/
export async function isFoundAccess() {
    const user = await auth.currentUser;
    const key = user.key;
    return key;
}
/*--------------------------------------------------on/off session--------------------------------------------------*/
export async function onSession(email, password) {
    await (await import('../firebase/conection.js')).signInWithEmailAndPassword(auth, email, password)
        .then(() => { return true; })
        .catch(() => { return false; });
}
export async function offSession() {
    await (await import('../firebase/conection.js')).signOut(auth)
        .then(() => { /*session closed*/ })
        .catch((error) => { throw new Error(error); });
}
/*--------------------------------------------------resetPassword--------------------------------------------------*/
export async function sendToEmailResetPassword(email) {
    await (await import('../firebase/conection.js')).sendPasswordResetEmail(auth, email);
}
export async function validateResetPassword(obbCode, newPassword) {
    if (!obbCode && !newPassword) { return }
    await (await import('../firebase/conection.js')).confirmPasswordReset(auth, obbCode, newPassword);
}
/*--------------------------------------------------tools creation--------------------------------------------------*/
//access: access, key: false
/*--------------------------------------------------tools modularization--------------------------------------------------*/
export async function getCollection(context) {
    const collectionReference = (await import('../firebase/conection.js')).collection((await import('./conection.js')).db, context);
    return collectionReference;
}

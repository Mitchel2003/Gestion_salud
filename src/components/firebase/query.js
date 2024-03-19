import { auth, getDocs, query, where } from "./conection.js";
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

/*--------------------------------------------------on/off session--------------------------------------------------*/
export async function onSession(email, password) {
    await (await import('../firebase/conection.js')).signInWithEmailAndPassword(auth, email, password)
        .then(() => { window.location.href = './src/public/session.html'; })
        .catch((error) => { console.log(error); });
}
export async function offSession() {
    await (await import('../firebase/conection.js')).signOut(auth)
        .then(() => {/*nothing*/ })
        .catch((error) => { console.log(error); });
}

/*--------------------------------------------------resetPassword--------------------------------------------------*/
export async function sendToEmailResetPassword(email) {
    await (await import('../firebase/conection.js')).sendPasswordResetEmail(auth, email);
}
export async function validateResetPassword(obbCode, newPassword) {
    if (!obbCode && !newPassword) { return }
    try { await (await import('../firebase/conection.js')).confirmPasswordReset(auth, obbCode, newPassword); }
    catch (error) { throw new Error('Token expired, generate a new token'); }
}

/*--------------------------------------------------tools modularization--------------------------------------------------*/
export async function getCollection(context) {
    const collectionReference = (await import('../firebase/conection.js')).collection((await import('./conection.js')).db, context);
    return collectionReference;
}

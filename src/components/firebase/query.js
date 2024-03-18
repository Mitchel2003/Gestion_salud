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

/*--------------------------------------------------functions--------------------------------------------------*/
export async function resetPassword(email) {
    return await (await import('../firebase/conection.js')).sendPasswordResetEmail((await import('./conection.js')).auth, email);
}
export async function validateResetPassword(obbCode, newPassword) {
    if (!obbCode && !newPassword) { return }
    return await (await import('../firebase/conection.js')).confirmPasswordReset((await import('./conection.js')).auth, obbCode, newPassword);
}
export async function onSession(email, password) {
    await (await import('../firebase/conection.js')).signInWithEmailAndPassword((await import('./conection.js')).auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            window.location.href = './src/public/session.html';
        })
        .catch((error) => {
            console.log(error.message + error.code);
        });
}
/*--------------------------------------------------tools modularization--------------------------------------------------*/
export async function getCollection(context) {
    const collectionReference = (await import('../firebase/conection.js')).collection((await import('./conection.js')).db, context);
    return collectionReference;
}

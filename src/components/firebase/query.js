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

/*--------------------------------------------------signIn and signOut--------------------------------------------------*/
export async function onSession(email, password) {
    await (await import('../firebase/conection.js')).signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            window.location.href = './src/public/session.html';
        })
        .catch((error) => {
            console.log(error);
        });
}
export async function offSession() {
    await (await import('../firebase/conection.js')).signOut(auth)
    .then(() => {
        window.location.href = 'https://mitchel2003.github.io/Gestion_salud/';
    }).catch((error) => {
        console.log(error); 
    });
}

/*--------------------------------------------------resetPassword--------------------------------------------------*/
export async function sendToEmailResetPassword(email) {
    return await (await import('../firebase/conection.js')).sendPasswordResetEmail(auth, email);
}
export async function validateResetPassword(obbCode, newPassword) {
    if (!obbCode && !newPassword) { return }
    return await (await import('../firebase/conection.js')).confirmPasswordReset(auth, obbCode, newPassword);
}

/*--------------------------------------------------tools modularization--------------------------------------------------*/
export async function getCollection(context) {
    const collectionReference = (await import('../firebase/conection.js')).collection((await import('./conection.js')).db, context);
    return collectionReference;
}

import { getCollection } from './query.js';
import { auth, onAuthStateChanged } from "./conection.js";

export async function createUser(email, password) {
    return await (await import('./conection.js')).createUserWithEmailAndPassword(auth, email, password);
}
export async function updateDataUser(name) {
    return await (await import('./conection.js')).updateProfile(auth.currentUser, { displayName: name });
}
export async function verificationEmailAddress(userEmail, userAccess) {
    const redirect = `https://mitchel2003.github.io/Gestion_salud/src/public/emailVerified.html?mode=verifyEmail&email=${encodeURIComponent(userEmail)}&access=${encodeURIComponent(userAccess)}`;
    return await (await import('./conection.js')).sendEmailVerification(auth.currentUser, { url: redirect });
}
export async function appenedDocumentReference(email, access) {
    return await (await import('./conection.js')).addDoc(await getCollection("userInfo"), { email: email, access: access, key: false });
}
/*--------------------------------------------------in session--------------------------------------------------*/
export function preparateSessionWithAccess(value) {
    let url = new URL(window.location.href);
    url.pathname = './Gestion_salud/src/public/session.html';
    url.searchParams.set('key', value);
    window.location.href = url.toString();
}
export function checkSessionActive() {
    onAuthStateChanged(auth, async (user) => { 
        try { let data = user.uid; }
        catch (error) { await (await import('../utils/alerts.js')).exceptionsSignOut(error); } 
    });
}
export function resetTimeInactivity(temp) {
    console.log(temp);
    clearTimeout(temp);
    console.log(temp);
    temp = setTimeout(async () => {
        await offSession();
    }, 5000);
}

/*--------------------------------------------------on/off session--------------------------------------------------*/
export async function onSession(email, password) {
    return await (await import('./conection.js')).signInWithEmailAndPassword(auth, email, password);
}export async function offSession() {
    return await (await import('./conection.js')).signOut(auth);
}
/*--------------------------------------------------resetPassword--------------------------------------------------*/
export async function sendToEmailResetPassword(email) {
    return await (await import('./conection.js')).sendPasswordResetEmail(auth, email);
}export async function validateResetPassword(obbCode, newPassword) {
    return await (await import('./conection.js')).confirmPasswordReset(auth, obbCode, newPassword);
}
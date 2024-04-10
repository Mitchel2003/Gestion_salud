import { getCollection } from './query.js';
import { auth, signOut, onAuthStateChanged } from "./conection.js";

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
    url.pathname = './Gestion_salud/src/public/verifyAction.html';
    url.searchParams.set('key', value);
    window.location.href = url.toString();
}
export async function checkSessionActive() {
    onAuthStateChanged(auth, async (user) => { 
        try { let data = user.uid; console.log(data); }
        catch (error) { await (await import('../utils/alerts.js')).exceptionsSignOut(error); } 
    });
}
// const {title, message, typeAlert} = (await import('../utils/alerts.js')).messageSessionFailed();
// await alertButtonAction(title, message, selectIcon(typeAlert));
// (await import('../utils/view.js')).goToHome();

export function resetTimeInactivity(temp) {
    clearTimeout(temp);
    temp = setTimeout(async () => {
        await logOutUser();
    }, 30000);
}
async function logOutUser() {
    return await signOut(auth);
}
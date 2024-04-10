import { getCollection } from './query.js';
import { auth, onAuthStateChanged } from "./conection.js";
import { alertButtonAction, selectIcon } from '../utils/alerts.js';

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
export function preparateSessionWithAccess(value) {
    let url = new URL(window.location.href);
    url.pathname = './Gestion_salud/src/public/verifyAction.html';
    url.searchParams.set('key', value);
    window.location.href = url.toString();
}
export async function checkSessionActive(){ //auth error
    onAuthStateChanged(auth, async (user) => {
        let data = user.uid;
        if(!data){
            const {title, message, typeAlert} = (await import('../utils/alerts.js')).messageSessionFailed();
            await alertButtonAction(title, message, selectIcon(typeAlert));
            (await import('../utils/view.js')).goToHome();
            return;
        }
    });
}
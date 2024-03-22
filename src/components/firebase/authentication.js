import { getCollection } from './query.js';

export async function verificationEmailAddress(auth, userEmail) {
    const redirect= 'https://mitchel2003.github.io/Gestion_salud/src/public/emailVerified.html?mode=verifyEmail&email=${userEmail}';
    return await (await import('./conection.js')).sendEmailVerification(auth.currentUser, {url: redirect});
}
export async function createUser(auth, email, password) {
    return await (await import('./conection.js')).createUserWithEmailAndPassword(auth, email, password);
}
export async function updateDataUser(auth, name, access) {
    return await (await import('./conection.js')).updateProfile(auth.currentUser, { displayName: name, photoURL:access });
}
export async function appenedDocumentReference(email, access) {
    await (await import('./conection.js')).addDoc(getCollection("userInfo"), { email: email, access: access, key: false });
}

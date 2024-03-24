import { getCollection } from './query.js';

export async function createUser(auth, email, password) {
    return await (await import('./conection.js')).createUserWithEmailAndPassword(auth, email, password);
}
export async function updateDataUser(auth, name) {
    return await (await import('./conection.js')).updateProfile(auth.currentUser, { displayName: name });
}
export async function verificationEmailAddress(auth, userEmail, userAccess) {
    const redirect = `https://mitchel2003.github.io/Gestion_salud/src/public/emailVerified.html?mode=verifyEmail&email=${encodeURIComponent(userEmail)}&access=${encodeURIComponent(userAccess)}`;
    return await (await import('./conection.js')).sendEmailVerification(auth.currentUser, { url: redirect });
}
export async function appenedDocumentReference(email, access) {
    return await (await import('./conection.js')).addDoc(await getCollection("userInfo"), { email: email, access: access, key: false });
}
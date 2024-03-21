import { getCollection } from './query.js';

export async function verificationEmailAddress(auth) {
    return await (await import('../firebase/conection.js')).sendEmailVerification(auth.currentUser);
}
export async function updateDataUser(auth, name, access) {
    return await (await import('../firebase/conection.js')).updateProfile(auth.currentUser, { displayName: name, photoURL: access });
}
export async function createUser(auth, email, password) {
    return await (await import('../firebase/conection.js')).createUserWithEmailAndPassword(auth, email, password);
}
export async function appenedDocumentReference(email, access) {
    await addDoc(getCollection("userInfo"), {
        email: email,
        access: access,
        key: false
    });
}

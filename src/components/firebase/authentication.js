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
export async function checkSessionActive() {//AC #209
    return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) { resolve(user.email); }
            else { await (await import('../utils/alerts.js')).exceptionsSignOut(); }
        });
    });
}
export class TimerOut {
    constructor(duration) {
        this.duration = duration;
        this.timerID = null;
        this.setupChangeVisibility();
    }
    setupChangeVisibility() {
        document.addEventListener('visibilitychange', async () => {
            if (document.visibilityState === 'visible') { this.cancelTimerOut(); }
            else { this.startTimeOut(); }
        });
    }
    startTimeOut() {
        this.cancelTimerOut();
        this.timerID = setTimeout(async () => { await offSession(); }, this.duration);
    }
    cancelTimerOut() {
        if (this.timerID !== null) { clearTimeout(this.timerID); this.timerID = null; }
    }
}
/*--------------------------------------------------on/off session--------------------------------------------------*/
export async function onSession(email, password) {
    return await (await import('./conection.js')).signInWithEmailAndPassword(auth, email, password);
} export async function offSession() {
    return await (await import('./conection.js')).signOut(auth);
}
/*--------------------------------------------------resetPassword--------------------------------------------------*/
export async function sendToEmailResetPassword(email) {
    return await (await import('./conection.js')).sendPasswordResetEmail(auth, email);
} export async function validateResetPassword(obbCode, newPassword) {
    return await (await import('./conection.js')).confirmPasswordReset(auth, obbCode, newPassword);
}
import { auth, onAuthStateChanged } from "./conection.js";
/*--------------------------------------------------backend firebase--------------------------------------------------*/
export async function createUser(email, password) {
    return await (await import('./conection.js')).createUserWithEmailAndPassword(auth, email, password);
}
export async function updateDataUser(name, entity) {
    return await (await import('./conection.js')).updateProfile(auth.currentUser, { displayName: name, photoURL: entity });
}
export async function verificationEmailAddress(userName, userEmail, userAccess, userEntity) {
    const redirect = `https://mitchel2003.github.io/Gestion_salud/src/public/verifyAction.html?mode=verifyEmail&name=${encodeURIComponent(userName)}&email=${encodeURIComponent(userEmail)}&access=${encodeURIComponent(userAccess)}&entity=${encodeURIComponent(userEntity)}`;
    return await (await import('./conection.js')).sendEmailVerification(auth.currentUser, { url: redirect });
}
export async function appenedDocumentReference(name, email, access, entity) {
    return await (await import('./conection.js')).addDoc((await import("./query.js")).getCollectionUser(entity), { name: name, email: email, access: access, key: false });
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
/*--------------------------------------------------controller session--------------------------------------------------*/
export async function observerSessionActive() {//AC #209
    return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
            const getAlert = await import('../utils/alerts.js');
            const getView = await import('../utils/view.js');
            if (!user) { await getAlert.showMessage('messageSessionFailed', 'alertButtonAction'); getView.goToHome(); }
            else { resolve({ email: user.email, entity: user.photoURL }); }
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
export class StatusConnection {//AC #210
    constructor() {
        this.update = this.updateStatus.bind(this);
        this.listenStatus();
    }
    listenStatus() {
        window.addEventListener('offline', this.update);
        window.addEventListener('online', this.update);
    }
    updateStatus() {
        if (navigator.onLine) { return new Promise(async (resolve) => { resolve(await (await import('../utils/alerts.js')).showMessage('messageStatusOnline', 'alertToast')); }); }
        else { alert('Offline, check your connection'); }
    }
}
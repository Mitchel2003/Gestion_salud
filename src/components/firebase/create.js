import { auth, createUserWithEmailAndPassword, updateProfile } from "./conection.js";
import { exceptionsCreateUser, exceptionsCreateUserProfile } from "../utils/alerts.js";

export async function createUser(name, email, password, access) {
    await createUserWithEmailAndPassword(auth, email, password)
        .then(async () => { await createUserProfile(name, access); })
        .catch((error) => { exceptionsCreateUser(error); });
}
/*--------------------------------------------------tools modularization--------------------------------------------------*/
async function createUserProfile(name, access) {
    await updateProfile(auth.currentUser, { name: name, access: access, key: false })
        .then(async () => { /*await (await import('./query.js')).offSession();*/ })
        .catch((error) => { exceptionsCreateUserProfile(error); });
}
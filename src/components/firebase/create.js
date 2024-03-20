import { auth, createUserWithEmailAndPassword, updateProfile } from "./conection.js";
import { exceptionsCreateUser, exceptionsCreateUserProfile } from "../utils/alerts.js";

export async function createUser(name, email, password, access) {//working here...
    return await createUserWithEmailAndPassword(auth, email, password)
        .then(async () => { await createUserProfile(name, access); response=true;})
        .catch((error) => { exceptionsCreateUser(error); });
}
/*--------------------------------------------------tools modularization--------------------------------------------------*/
async function createUserProfile(name, access) {
    await updateProfile(auth.currentUser, { name: name, access: access, key: false })
        .then(() => { /*nothing*/ })
        .catch((error) => { exceptionsCreateUserProfile(error); });
}
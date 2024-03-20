import { auth, createUserWithEmailAndPassword, updateProfile } from "./conection.js";

export async function createUser(name, email, password, access) {
    const response = await createUserWithEmailAndPassword(auth, email, password)
        .then(async () => { await createUserProfile(name, access); })
        .catch((error) => { throw new Error('createUser:' + error); });
    return response;
}
/*--------------------------------------------------tools modularization--------------------------------------------------*/
async function createUserProfile(name, access) {
    await updateProfile(auth.currentUser, { name: name, access: access, key: false })
        .then(() => { /*successfull*/ })
        .catch((error) => { throw new Error('createUserProfile:' + error); });
}
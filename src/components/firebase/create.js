import { auth, createUserWithEmailAndPassword } from "./conection.js";//working here...
import { getCollection } from "./query.js";

export async function saveUserData(name, email, access) {
    await addDoc(await getCollection("user"), {
        name: name,
        email: email,
        access: access,
        key: false
    });
}
export async function createUser(name, email, password, access) {
    await (await import('./conection.js')).createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
            updateUserProfile(name, access);
        })
        .catch((error) => {
            throw new Error(error);
        });
}
/*--------------------------------------------------tools modularization--------------------------------------------------*/
async function updateUserProfile(name, access) {
    await (await import('./conection.js')).updateProfile(auth.currentUser, {
        name: name, access:access, key:false
    }).then(() => {
        // Profile updated!
        // ...
    }).catch((error) => {
        // An error occurred
        // ...
    });


    const name = userCredential.user;
    const access = userCredential.user;
    const key = userCredential.user;
}
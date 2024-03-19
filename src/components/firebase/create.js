import { auth, createUserWithEmailAndPassword, updateProfile } from "./conection.js";
// import { getCollection } from "./query.js";

// export async function saveUserData(name, email, access) {
//     await addDoc(await getCollection("user"), {
//         name: name,
//         email: email,
//         access: access,
//         key: false
//     });
// }
export async function createUser(name, email, password, access) {
    await createUserWithEmailAndPassword(auth, email, password)
        .then(async () => {
            await createUserProfile(name, access);
        })
        .catch((error) => {
            throw new Error(error);
        });
}
/*--------------------------------------------------tools modularization--------------------------------------------------*/
async function createUserProfile(name, access) {
    await updateProfile(auth.currentUser, { name: name, access: access, key: false })
        .then(() => {/*successfull*/})
        .catch((error) => { throw new Error('createUserProfile'); });
}
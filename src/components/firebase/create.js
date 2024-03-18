import { addDoc } from "./conection.js";
import { getCollection } from "./query.js";

export async function saveUserData(name, email, access) {
    await addDoc(await getCollection("user"), {
        name: name,
        email: email,
        access: access,
        key: false
    });
}
export async function createUser(auth, email, password) {
    await (await import('./conection.js')).createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
        })
        .catch((error) => {
            console.log(error.message + error.code);
        });
}
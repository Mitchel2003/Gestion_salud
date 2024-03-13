import { doc, addDoc, setDoc } from "./conection.js";
import { getCollection } from "./query.js";

export async function createUser(name, email, password, access) {
    const documentReference = doc(getCollection("user"), email);
    await setDoc(documentReference, {
        name: name,
        email: email,
        password: password,
        access: access,
        key: false
    });
}
export async function createTokenPassword(email, token) {
    await addDoc(getCollection("tokenPassword"), {
        userEmail: email,
        token: token,
        isUsed: false,
        date: new Date().getTime()
    });
}

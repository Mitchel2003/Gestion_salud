import { addDoc } from "./conection.js";
import { getCollection } from "./query.js";

export async function createUser(name, email, password, access) {
    await addDoc(getCollection("user"), {
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
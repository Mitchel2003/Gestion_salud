import { db, collection, getDocs, query, where } from "./conection.js";
import { TIME_WITH_SUBTRACTION } from "../models/userForgotPassword.js";
/*--------------------------------------------------booleans--------------------------------------------------*/
export async function isFoundEmail(emailContext) {
    const ask = query(getCollection("user"), where("email", "==", emailContext));
    const querySnapshot = await getDocs(ask);
    return !querySnapshot.empty;
}
export async function isFoundToken(emailContext) {
    const ask = query(getCollection("tokenPassword"),
        where("userEmail", "==", emailContext),
        where("isUsed", "==", false),
        where("date", ">=", TIME_WITH_SUBTRACTION()));
    const querySnapshot = await getDocs(ask);

    if (querySnapshot.empty) {
        return !querySnapshot.empty;
    }
    return querySnapshot;
}
export async function isFoundAccess(emailContext) {
    const ask = query(getCollection("user"),
        where("email", "==", emailContext),
        where("key", "==", true));
    const querySnapshot = await getDocs(ask);
    return !querySnapshot.empty;
}
export async function isCredentialValid(user, password) {
    const ask = query(getCollection("user"),
        where("email", "==", user),
        where("password", "==", password));
    const querySnapshot = await getDocs(ask);
    return !querySnapshot.empty;
}
/*--------------------------------------------------getters--------------------------------------------------*/
export async function getTokenPassword(querySnapshot) {//async await AC #202
    let valueToken;
    let valueIsUsed;

    getDocumentQuery(querySnapshot).forEach(({ token, isUsed }) => {
        valueToken = token;
        valueIsUsed = isUsed;
    });
    return { valueToken, valueIsUsed };
}
/*--------------------------------------------------tools query--------------------------------------------------*/
export function getCollection(context) {
    const collectionReference = collection(db, context);
    return collectionReference;
}
export function getDocumentQuery(query) {
    const array = query.docs.map(doc => doc.data());
    return array;
}
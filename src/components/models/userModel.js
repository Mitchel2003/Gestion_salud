import { createUser } from "../firebase/create.js";
import { isFoundEmail } from "../firebase/query.js";
import {customAlert, messageEmailUsed, messageUserSubmitted, selectIcon} from "../utils/alerts.js";
import { cleanInputRegister } from "../utils/tools/clean.js";

export async function registerUser(name, email, password, access) {
    try {
        if (await isFoundEmail(email)) {
            const {title, message, typeAlert} = messageEmailUsed();
            customAlert(title, message, selectIcon(typeAlert));
            return;
        }

        createUser(name, email, password, access);

        const {title, message, typeAlert} = messageUserSubmitted();
        customAlert(title, message, selectIcon(typeAlert));

        cleanInputRegister();
    } catch (error) {
        console.log(error);
    }
}
export async function loginUser(user, password) {
    try {
        if (!(await isFoundEmail(email))) {
            const {title, message, typeAlert} = messageEmailUsed();
            customAlert(title, message, selectIcon(typeAlert));
            return;
        }

        queryCredentials(password);
        
        const {title, message, typeAlert} = messageUserSubmitted();
        customAlert(title, message, selectIcon(typeAlert));

        cleanInputRegister();
    } catch (error) {
        console.log(error);
    }
}
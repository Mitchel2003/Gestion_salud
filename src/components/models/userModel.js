import { isFoundEmail } from "../firebase/query.js";
import {customAlert, selectIcon} from "../utils/alerts.js";

export async function registerUser(name, email, password, access) {
    try {
        const getAlert=await import('../utils/alerts.js');

        if (await isFoundEmail(email)) {
            const {title, message, typeAlert} = getAlert.messageEmailUsed();
            customAlert(title, message, selectIcon(typeAlert));
            return;
        }

        await (await import('../firebase/create.js')).createUser(name, email, password, access);

        const {title, message, typeAlert} = getAlert.messageUserSubmitted();
        customAlert(title, message, selectIcon(typeAlert));
        (await import('../utils/tools/cleaner.js')).cleanInputRegister();
        
    } catch (error) {
        console.log(error);
    }
}
export async function loginUser(user, password) {
    try {
        const getQuery=await import('../firebase/query.js');
        const getAlert=await import('../utils/alerts.js');

        if (!(await isFoundEmail(user))) {
            const {title, message, typeAlert} = getAlert.messageUserNotFound();
            customAlert(title, message, selectIcon(typeAlert));
            return;
        }
        if (!(await getQuery.isCredentialValid(user, password))){
            const {title, message, typeAlert} = getAlert.messagePasswordIncorrect();
            customAlert(title, message, selectIcon(typeAlert));
            return;
        }
        if (!(await getQuery.isFoundAccess(user))) {
            const {title, message, typeAlert} = getAlert.messageUserWithoutAccess();
            customAlert(title, message, selectIcon(typeAlert));
            return;
        }

        //...
    } catch (error) {
        console.log(error);
    }
}
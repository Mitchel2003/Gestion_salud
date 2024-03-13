import { createTokenPassword } from "../firebase/create.js";
import { isFoundEmail, isFoundToken } from "../firebase/query.js";
import { alertInput, customAlert, messageRestorePassword, messageTokenFound, messageUserNotFound, selectIcon } from "../utils/alerts.js";

export async function registerTokenPassword(event) {
    event.preventDefault();

    try {
        const { title, message, typeAlert } = messageRestorePassword();
        const email = await alertInput(title, message, selectIcon(typeAlert));

        if (!(await isFoundEmail(email))) {
            const { title, message, typeAlert } = messageUserNotFound();
            customAlert(title, message, selectIcon(typeAlert));
            return;
        }

        if (await isFoundToken(email)) {
            const { title, message, typeAlert } = messageTokenFound();
            customAlert(title, message, selectIcon(typeAlert));
            return;
        }    


        //get token...

        await createTokenPassword(email, token); //need token for continue...

    } catch (error) {
        console.log(error);
    }
}

/*statics*/
export function TIME_WITH_SUBTRACTION() {//return timeContext - 15 min
    const timeContext = new Date().getTime();
    const timeSubtraction = timeContext - (15 * 60 * 1000);
    return timeSubtraction;
}



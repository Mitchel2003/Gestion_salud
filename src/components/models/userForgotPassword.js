import { isFoundEmail } from "../firebase/query.js";
import { customAlert, selectIcon } from "../utils/alerts.js";
import { sendToEmailResetPassword } from "../firebase/query.js";

export async function requestResetPassword(){
    try{
        const getAlert = await import('../utils/alerts.js');
        const { title, message, typeAlert } = getAlert.messageRestorePassword();
        const email = await getAlert.alertInput(title, message, selectIcon(typeAlert));

        if (!(await isFoundEmail(email))) {
            const { title, message, typeAlert } = getAlert.messageUserNotFound();
            customAlert(title, message, selectIcon(typeAlert));
            return;
        }

        await sendToEmailResetPassword(email);

        const { title2, message2, typeAlert2 } = getAlert.messageTokenSubmitted();
        customAlert(title2, message2, selectIcon(typeAlert2));
    }catch(error){
        console.log(error);
    }
}
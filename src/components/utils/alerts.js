export function customAlert(title, message, icon) {//alert default
    Swal.fire({
        title: title,
        text: message,
        icon: icon,
        allowEscapeKey: true,
        allowEnterKey: false,
        allowOutsideClick: false,
        customClass: { popup: 'customAlert' },
    });
}
export function alertToast(title, message, icon) {
    Swal.fire({
        title: title,
        text: message,
        icon: icon,
        timer: 3000,
        toast: true,
        position: 'top-end',
        customClass: { popup: 'customAlert' },
    });
}
export function selectIcon(item) {
    if (item === "s") { return "success"; }
    else if (item === "w") { return "warning"; }
    else if (item === "q") { return "question"; }
    else if (item === "i") { return "info"; }
    else { return "error"; }
}
/*--------------------------------------------------user action--------------------------------------------------*/
export async function alertInput(title, message, icon) {
    const { value: email } = await Swal.fire({
        title: title,
        text: message,
        icon: icon,
        toast: true,
        showCancelButton: true,
        cancelButtonColor: "#ff6d6d",
        confirmButtonColor: "#6eb5f8",
        confirmButtonText: "Send token",
        inputPlaceholder: "Email",
        input: "email",
        inputValue: ""
    }); return email;
}
export async function alertButtonAction(title, message, icon) {
    const { value: request } = await Swal.fire({
        title: title,
        text: message,
        icon: icon,
        allowOutsideClick: false,
        allowEscapeKey: true,
        allowEnterKey: false,
        showCancelButton: true,
        cancelButtonColor: "#d33",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Go to home",
        customClass: { popup: 'customAlert' }
    }); return request;
}
/*--------------------------------------------------exceptions--------------------------------------------------*/
export function exceptionsLoginUser(error) {
    if (error.code === 'auth/invalid-login-credentials') {
        const { title, message, typeAlert } = messageCredentialsIncorrects();
        customAlert(title, message, selectIcon(typeAlert));
        return;
    } if (error.code === 'auth/too-many-requests') {
        const { title, message, typeAlert } = messageManyRequests();
        customAlert(title, message, selectIcon(typeAlert));
        return;
    }
    const { title, typeAlert } = messageTempUnknow();
    customAlert(title, error, selectIcon(typeAlert));
    return;
}
export function exceptionsRegisterUser(error) {
    if (error.code === 'auth/email-already-in-use') {
        const { title, message, typeAlert } = messageEmailUsed();
        customAlert(title, message, selectIcon(typeAlert));
        return;
    } if (error.code === 'auth/invalid-email') {
        const { title, message, typeAlert } = messageEmailUnknow();
        customAlert(title, message, selectIcon(typeAlert));
        return;
    } if (error.code === 'auth/weak-password') {
        const { title, message, typeAlert } = messagePasswordSizeShort();
        customAlert(title, message, selectIcon(typeAlert));
        return;
    }
    const { title, typeAlert } = messageTempUnknow();
    customAlert(title, error.code, selectIcon(typeAlert));
    return;
}
export function exceptionsResetPassword(error) {
    if (error.code === 'auth/too-many-requests') {
        const { title, message, typeAlert } = messageManyRequests();
        customAlert(title, message, selectIcon(typeAlert));
        return;
    } if (error.code === 'invalid-argument') {/*nothing*/ return; }
    const { title, typeAlert } = messageTempUnknow();
    customAlert(title, error.code, selectIcon(typeAlert));
    return;
}

/* ---responses personalized (shorteners)--- */
export function exceptionsChangePassword() {
    const { title, message, typeAlert } = messageTokenExpired();
    customAlert(title, message, selectIcon(typeAlert)); return;
}
export function exceptionsConnectionEthernet() {
    const { title, message, typeAlert } = messageStatusOnline();
    alertToast(title, message, selectIcon(typeAlert)); return;
}
export async function exceptionsSignOut() {
    const { title, message, typeAlert } = messageSessionFailed();
    await alertButtonAction(title, message, selectIcon(typeAlert));
    (await import('./view.js')).goToHome(); return;
}
/* ---view message--- */
export async function showMessage(text, alert) {
    const { title, message, typeAlert } = getMessageAlert(text);
    if (alert === 'alertInput') { const value = await alertInput(title, message, selectIcon(typeAlert)); return value; }
    else if(alert === 'alertButtonAction'){ const value = await alertButtonAction(title, message, selectIcon(typeAlert)); return value; }
    else { customAlert(title, message, selectIcon(typeAlert)); return; }
}
/*--------------------------------------------------text--------------------------------------------------*/
function getMessageAlert(type) {
    let title, message, typeAlert;
    //successfull
    if (type === 'messageUserSubmitted') { title = "User submitted"; message = "Now, contact the administrator to give you access"; typeAlert = "s"; }
    if (type === 'messageEmailVerify') { title = "Pre-registration successfull"; message = "Checkout your mailbox and validate this email to continue"; typeAlert = "s"; }
    if (type === 'messageResetPasswordSuccess') { title = "Reset password success"; message = "Now, you can entry to app"; typeAlert = "s"; }
    if (type === 'messageTokenSubmitted') { title = "Token generated"; message = "Check your email to continue reset password"; typeAlert = "s"; }
    if (type === 'messageStatusOnline') { title = "Online"; message = "Connection restored"; typeAlert = "s"; }
    //warning
    if (type === 'messageEmailNotFound') { title = "Email unknow"; message = "If the account has been registered before, checkout you mailbox"; typeAlert = "w"; }
    if (type === 'messageAccessNotFound') { title = "Without access"; message = "It has been found that this account does not have access; comunicate with the management"; typeAlert = "w"; }
    if (type === 'messageSessionFailed') { title = "Session expired"; message = "Try login again"; typeAlert = "w"; }
    if (type === 'messageManyRequests') { title = "Too many attempts"; message = "Retry in other moment"; typeAlert = "w"; }
    if (type === 'messageCredentialsIncorrects') { title = "Credentials incorrects"; message = "The email or password may not be correct"; typeAlert = "w"; }
    if (type === 'messageRestorePassword') { title = "Restore password"; message = "Enter a registered email to send token"; typeAlert = "q"; }
    if (type === 'messageSelectAccessEmpty') { title = "Field access empty"; message = "choose one of the available accesses"; typeAlert = "q"; }
    if (type === 'messageSelectEntityEmpty') { title = "Field entity empty"; message = "choose one of the available entities"; typeAlert = "q"; }
    //error
    if (type === 'messageEmailUsed') { title = "Email is used"; message = "Please, retry with other email address"; typeAlert = "e"; }
    if (type === 'messageEmailUnknow') { title = "Email invalid"; message = "Please check email, retry with an email valid"; typeAlert = "e"; }
    if (type === 'messagePasswordNotSame') { title = "Passwords not same"; message = "Please, retry"; typeAlert = "e"; }
    if (type === 'messagePasswordSizeShort') { title = "Password so short"; message = "Please, retry with 6 or more caracters"; typeAlert = "e"; }
    if (type === 'messageTokenExpired') { title = "Token expired"; message = "Try to generate another token"; typeAlert = "e"; }
    if (type === 'messageTokenVerifyExpired') { title = "Token expired"; message = "This account has already been verified"; typeAlert = "e"; }
    if (type === 'messageTempUnknow') { title = "Exception Unknow"; typeAlert = "e"; }
    return { title, message, typeAlert };
}
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
        timer: 5000,
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
/*--------------------------------------------------view message--------------------------------------------------*/
export async function showMessage(text, alert) {
    const { title, message, typeAlert } = getMessageAlert(text);
    if (alert === 'alertToast') { alertToast(title, message, selectIcon(typeAlert)); return; }
    else if (alert === 'alertInput') { const value = await alertInput(title, message, selectIcon(typeAlert)); return value; }
    else if (alert === 'alertButtonAction') { const value = await alertButtonAction(title, message, selectIcon(typeAlert)); return value; }
    else { customAlert(title, message, selectIcon(typeAlert)); return; }
}
/*--------------------------------------------------exceptions (fetch)--------------------------------------------------*/
export async function exceptionsLoginUser(error) {
    if (error.code === 'auth/invalid-login-credentials') { await showMessage('messageCredentialsIncorrects', 'default'); return; }
    if (error.code === 'auth/too-many-requests') { await showMessage('messageManyRequests', 'default'); return; }
    await showMessage('messageTempUnknow', 'default');
}
export async function exceptionsRegisterUser(error) {
    if (error.code === 'auth/email-already-in-use') { await showMessage('messageEmailUsed', 'default'); return; }
    if (error.code === 'auth/invalid-email') { await showMessage('messageEmailUnknow', 'default'); return; }
    if (error.code === 'auth/weak-password') { await showMessage('messagePasswordSizeShort', 'default'); return; }
    await showMessage('messageTempUnknow', 'default');
}
export async function exceptionsResetPassword(error) {
    if (error.code === 'auth/too-many-requests') { await showMessage('messageManyRequests', 'default'); return; }
    if (error.code === 'auth/invalid-email') { await showMessage('messageEmailUnknow', 'default'); return; }
    if (error.code === 'invalid-argument') { /*nothing*/ return; }
    await showMessage('messageTempUnknow', 'default');
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
    if (type === 'messageSelectEmpty') { title = "Field select empty"; message = "please check the selects, this information is obligatory"; typeAlert = "w"; }
    if (type === 'messageRestorePassword') { title = "Restore password"; message = "Enter a registered email to send token"; typeAlert = "q"; }
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
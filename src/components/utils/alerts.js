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
export function alertTimer(title, message, icon) {
    Swal.fire({
        title: title,
        text: message,
        icon: icon,
        allowOutsideClick: false,
        allowEscapeKey: true,
        allowEnterKey: false,
        timerProgressVar: true,
        timer: 5000,
        footer: 'Redirecting...',
        customClass: { popup: 'customAlert' }
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
    });return email;
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
    });return request;
}
/*--------------------------------------------------text--------------------------------------------------*/
export function messageUserSubmitted() {//successfull
    const title = "User submitted";
    const message = "Now, contact the administrator to give you access";
    const typeAlert = "s";
    return { title, message, typeAlert };
}
export function messageEmailVerify() {
    const title = "Pre-registration successfull";
    const message = "Checkout your mailbox and validate this email to continue";
    const typeAlert = "s";
    return { title, message, typeAlert };
}
export function messageResetPasswordSuccess() {
    const title = "Reset password success";
    const message = "Now, you can entry to app";
    const typeAlert = "s";
    return { title, message, typeAlert };
}
export function messageTokenSubmitted() {
    const title2 = "Token generated";
    const message2 = "Check your email to continue reset password";
    const typeAlert2 = "s";
    return { title2, message2, typeAlert2 };
}
/*--------------------------------------------------*/
export function messageEmailNotFound() {//warning
    const title = "Email unknow";
    const message = "If the account has been registered, checkout you mailbox";
    const typeAlert = "w";
    return { title, message, typeAlert };
}
export function messageAccessNotFound() {
    const title = "Without access";
    const message = "It has been found that this account does not have access; comunicate with the management";
    const typeAlert = "w";
    return { title, message, typeAlert };
}
export function messageSessionFailed() {
    const title = "Session expired";
    const message = "Try login again";
    const typeAlert = "w";
    return { title, message, typeAlert };
}
export function messageManyRequests() {
    const title = "Too many attempts";
    const message = "Retry in other moment";
    const typeAlert = "w";
    return { title, message, typeAlert };
}
export function messageCredentialsIncorrects() {
    const title = "Credentials incorrects";
    const message = "The email or password may not be correct";
    const typeAlert = "w";
    return { title, message, typeAlert };
}
export function messageRestorePassword() {
    const title = "Restore password";
    const message = "Enter a registered email to send token";
    const typeAlert = "q";
    return { title, message, typeAlert };
}
/*--------------------------------------------------*/
export function messageEmailUsed() {//error
    const title = "Email is used";
    const message = "Please, retry with other email address";
    const typeAlert = "e";
    return { title, message, typeAlert };
}
export function messageEmailUnknow() {
    const title = "Email invalid";
    const message = "Please check email, retry with an email valid";
    const typeAlert = "e";
    return { title, message, typeAlert };
}
export function messagePasswordNotSame() {
    const title = "Passwords not same";
    const message = "Please, retry";
    const typeAlert = "e";
    return { title, message, typeAlert };
}
export function messagePasswordSizeShort() {
    const title = "Password so short";
    const message = "Please, retry with 6 or more caracters";
    const typeAlert = "e";
    return { title, message, typeAlert };
}
export function messageTokenExpired() {
    const title = "Token expired";
    const message = "Try to generate another token";
    const typeAlert = "e";
    return { title, message, typeAlert };
}
export function messageTokenVerifyExpired() {
    const title = "Token expired";
    const message = "This account has already been verified";
    const typeAlert = "e";
    return { title, message, typeAlert };
}
export function messageTempUnknow() {
    const title = "Exception Unknow";
    const typeAlert = "e";
    return { title, typeAlert };
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
export async function exceptionsChangePassword(error) {
    const { title, message, typeAlert } = messageTokenExpired();
    customAlert(title, message, selectIcon(typeAlert));
    return;
}
export async function exceptionsSignOut(error) {
    const { title, message, typeAlert } = messageSessionFailed();
    alertTimer(title, message, selectIcon(typeAlert));
    (await import('./view.js')).goToHome();
    return;
}
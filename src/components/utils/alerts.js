export function customAlert(title, message, icon) {//alert default
    Swal.fire({
        title: title,
        text: message,
        icon: icon,
        toast: true,
    });
}
export function selectIcon(item) {
    if (item === "s")
        return "success";
    else if (item === "w")
        return "warning";
    else
        return "error";
}
/*--------------------------------------------------user action--------------------------------------------------*/
export async function alertInput(title, message, icon) {
    const { value: email } = await Swal.fire({
        title: title,
        text: message,
        icon: icon,
        toast: true,

        showCancelButton: true,
        cancelButtonColor: "#d33",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Send token",
        input: "email",
        inputValue: ""
    });
    return email;
}
export async function alertButtonAction(title, message, icon) {
    const { value: request } = await Swal.fire({
        title: title,
        text: message,
        icon: icon,

        showCancelButton: true,
        cancelButtonColor: "#d33",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Go to home"
    });
    return request;
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

export function messageUserNotFound() {//warning
    const title = "User not found";
    const message = "This user not has been registered, try restore another moment";
    const typeAlert = "w";
    return { title, message, typeAlert };
}
export function messageEmailWithoutVerify() {
    const title = "Without verify";
    const message = "This email account not has been verified, check your mailbox";
    const typeAlert = "w";
    return { title, message, typeAlert };
}
export function messageEmailWithoutAccess() {
    const title = "Without access";
    const message = "Please, comunicate with the management";
    const typeAlert = "w";
    return { title, message, typeAlert };
}
export function messageManyLoginRequests() {
    const title = "Too many attempts";
    const message = "Retry in other moment";
    const typeAlert = "w";
    return { title, message, typeAlert };
}
export function messageRestorePassword() {
    const title = "Restore password";
    const message = "Enter a registered email to send token";
    const typeAlert = "w";
    return { title, message, typeAlert };
}

/*--------------------------------------------------*/

export function messageEmailUsed() {//error
    const title = "Email is used";
    const message = "Please, retry with other email address";
    const typeAlert = "e";
    return { title, message, typeAlert };
}
export function messageEmailNotFound() {
    const title = "Email unknow";
    const message = "If has been registered, checkout you mailbox and validate the account";
    const typeAlert = "e";
    return { title, message, typeAlert };
}
export function messageEmailStrange() {
    const title = "Email invalid";
    const message = "checkout and retry with a email valid";
    const typeAlert = "e";
    return { title, message, typeAlert };
}
export function messageCredentialsIncorrects() {
    const title = "Credentials incorrects";
    const message = "The email or password may not be correct";
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
    if(error.code === 'auth/invalid-login-credentials'){
        const { title, message, typeAlert } = messageCredentialsIncorrects();
        customAlert(title, message, selectIcon(typeAlert));
        return;
    }
    if(error.code === 'auth/invalid-email'){
        const { title, message, typeAlert } = messageEmailStrange();
        customAlert(title, message, selectIcon(typeAlert));
        return;
    }
    if(error.code === 'auth/too-many-requests'){
        const { title, message, typeAlert } = messageManyLoginRequests();
        customAlert(title, message, selectIcon(typeAlert));
        return;
    }
    const { title, typeAlert } = messageTempUnknow();
    customAlert(title, error.code, selectIcon(typeAlert));
}
export function exceptionsRegisterUser(error) {
    if (error.code === 'auth/email-already-in-use') {
        const { title, message, typeAlert } = messageEmailUsed();
        customAlert(title, message, selectIcon(typeAlert));
        return;
    }
    if (error.code === 'auth/invalid-email') {
        const { title, message, typeAlert } = messageEmailStrange();
        customAlert(title, message, selectIcon(typeAlert));
        return;
    }
    if (error.code === 'auth/weak-password') {
        const { title, message, typeAlert } = messagePasswordSizeShort();
        customAlert(title, message, selectIcon(typeAlert));
        return;
    }
    const { title, typeAlert } = messageTempUnknow();
    customAlert(title, error.code, selectIcon(typeAlert));
}
export function exceptionsResetPassword(error) {
    const { title, typeAlert } = messageTempUnknow();
    customAlert(title, error.code, selectIcon(typeAlert));
    return;
}
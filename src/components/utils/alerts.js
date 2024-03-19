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
/*--------------------------------------------------utilies--------------------------------------------------*/
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
export function messageTokenSubmitted() {
    const title2 = "Token generated";
    const message2 = "Check your email to continue reset password";
    const typeAlert2 = "s";
    return { title2, message2, typeAlert2 };
}
export function messageResetPasswordSuccess() {
    const title = "Reset password success";
    const message = "Now, you can entry to app";
    const typeAlert = "s";
    return { title, message, typeAlert };
}

export function messageUserNotFound() {//warning
    const title = "User not found";
    const message = "This user not has been registered, try restore another moment";
    const typeAlert = "w";
    return { title, message, typeAlert };
}
export function messageUserWithoutAccess() {
    const title = "Without access";
    const message = "Please, comunicate with the management";
    const typeAlert = "w";
    return { title, message, typeAlert };
}
export function messageRestorePassword() {
    const title = "Restore password";
    const message = "Enter a registered email to send token";
    const typeAlert = "w";
    return { title, message, typeAlert };
}

export function messagePasswordIncorrect() {//error
    const title = "Password incorrect";
    const message = "Please, check field";
    const typeAlert = "e";
    return { title, message, typeAlert };
}
export function messageEmailUsed() {
    const title = "Email is used";
    const message = "Please, retry with other email address";
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
    const title = "Expired";
    const message = "Try to generate another token";
    const typeAlert = "e";
    return { title, message, typeAlert };
}
export function customAlert(title, message, icon) {//alert default
    Swal.fire({
        title: title,
        text: message,
        icon: icon,
        toast: true,
    });
}
export async function alertInput(title, message, icon) {
    const {value:email} = await Swal.fire({
        title: title,
        text: message,
        icon: icon,
        toast: true,

        confirmButtonText:"send token",
        input: "email",
        inputValue: ""
    });
    return email;
}
export function selectIcon(item) {
    if(item==="s")
        return "success";
    else if(item==="w")
        return "warning";
    else
        return "error";
}
/*--------------------------------------------------text--------------------------------------------------*/
/*---------------success---------------*/
export function messageUserSubmitted() {
    const title="User submitted";
    const message="Now, contact the administrator to give you access";
    const typeAlert="s";
    return {title, message, typeAlert};
}
export function messageTokenSubmitted() {
    const title2="Token generated";
    const message2="Check your email to continue reset password";
    const typeAlert2="s";
    return {title2, message2, typeAlert2};
}
export function messageResetPasswordSuccess() {
    const title2="Reset password success";
    const message2="Now, you can entry to app";
    const typeAlert2="s";
    return {title2, message2, typeAlert2};
}

/*---------------warning---------------*/
export function messageUserNotFound() {
    const title="User not found";
    const message="This user not has been registered, try restore another moment";
    const typeAlert="w";
    return {title, message, typeAlert};
}
export function messageUserWithoutAccess() {
    const title="Without access";
    const message="Please, comunicate with the management";
    const typeAlert="w";
    return {title, message, typeAlert};
}
export function messageRestorePassword() {
    const title="Restore password";
    const message="Enter a registered email to send token";
    const typeAlert="w";
    return {title, message, typeAlert};
}
export function messageTokenFound() {
    const title="A token has already been found";
    const message="Please, chech your email";
    const typeAlert="w";
    return {title, message, typeAlert};
}
export function messageTokenExpired() {
    const title="Expired";
    const message="Try to generate another token";
    const typeAlert="w";
    return {title, message, typeAlert};
}

/*---------------error---------------*/
export function messagePasswordIncorrect() {
    const title="Password incorrect";
    const message="Please, check field";
    const typeAlert="e";
    return {title, message, typeAlert};
}
export function messageEmailUsed() {
    const title="Email is used";
    const message="Please, retry with other email address";
    const typeAlert="e";
    return {title, message, typeAlert};
}
export function messagePasswordNotSame() {
    const title="Passwords not same";
    const message="Please, retry";
    const typeAlert="e";
    return {title, message, typeAlert};
}
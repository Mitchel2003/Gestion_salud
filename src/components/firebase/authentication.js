export async function checkEmailAddress(auth){
    return await (await import('../firebase/conection.js')).sendEmailVerification(auth.currentUser);
}
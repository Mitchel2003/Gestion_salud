import { getCollection } from './query.js';
import { auth, onAuthStateChanged } from "./conection.js";

export async function createUser(email, password) {
    return await (await import('./conection.js')).createUserWithEmailAndPassword(auth, email, password);
}
export async function updateDataUser(name) {
    return await (await import('./conection.js')).updateProfile(auth.currentUser, { displayName: name });
}
export async function verificationEmailAddress(userEmail, userAccess) {
    const redirect = `https://mitchel2003.github.io/Gestion_salud/src/public/emailVerified.html?mode=verifyEmail&email=${encodeURIComponent(userEmail)}&access=${encodeURIComponent(userAccess)}`;
    return await (await import('./conection.js')).sendEmailVerification(auth.currentUser, { url: redirect });
}
export async function appenedDocumentReference(email, access) {
    return await (await import('./conection.js')).addDoc(await getCollection("userInfo"), { email: email, access: access, key: false });
}
/*--------------------------------------------------in session--------------------------------------------------*/
export async function checkSessionActive() {//AC #210
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            try { resolve(user.email); }
            catch (error) { await (await import('../utils/alerts.js')).exceptionsSignOut(); reject(null); }
        });
    });
}
export async function handleTimeOut(temp) {
    if (document.visibilityState === 'visible') { document.removeEventListener('visibilitychange', async () => { await handleTimeOut(time); }) }
    else { clockTimerInactivity(temp); }
} function clockTimerInactivity(temp) {
    clearTimeout(temp);
    temp = setTimeout(async () => { await offSession(); }, 10000);
}
/*--------------------------------------------------on/off session--------------------------------------------------*/
export async function onSession(email, password) {
    return await (await import('./conection.js')).signInWithEmailAndPassword(auth, email, password);
} export async function offSession() {
    return await (await import('./conection.js')).signOut(auth);
}
/*--------------------------------------------------resetPassword--------------------------------------------------*/
export async function sendToEmailResetPassword(email) {
    return await (await import('./conection.js')).sendPasswordResetEmail(auth, email);
} export async function validateResetPassword(obbCode, newPassword) {
    return await (await import('./conection.js')).confirmPasswordReset(auth, obbCode, newPassword);
}


// Para lograr retornar el dato `user.email` desde la función `checkSessionActive()` y utilizarlo fuera de ella sin recurrir directamente al uso de `new Promise` para envolver el llamado a `onAuthStateChanged`, puedes mantener el patrón `async/await` mediante la adecuación de tu función para que retorne explícitamente lo que necesitas. Sin embargo, en este caso particular, es importante señalar que `onAuthStateChanged` no retorna una promesa con el valor del usuario, sino un método para desuscribirse del listener. Este comportamiento es típico de los observadores, donde `onAuthStateChanged` está diseñado para ejecutarse cada vez que el estado de autenticación cambia, lo que no se alinea directamente con el patrón `async/await`.

// A pesar de tu preferencia por evitar `new Promise`, este es precisamente uno de los casos en los que su uso es adecuado para convertir un patrón basado en eventos o callbacks a promesas, lo que facilita el uso de `async/await`. A continuación, una manera de hacerlo que mantiene tu estructura de código limpia y permite esperar por el resultado de `user.email`:

// ```javascript
// export async function checkSessionActive() {
//     // Retorna una nueva promesa
//     return new Promise((resolve, reject) => {
//         onAuthStateChanged(auth, async (user) => {
//             if(user) {
//                 // Si hay usuario, resuelve la promesa con el email del usuario
//                 resolve(user.email);
//             } else {
//                 // Si no hay usuario, maneja el caso como prefieras (p. ej., resolviendo con null)
//                 // Aquí realizas la llamada a exceptionsSignOut y luego rechazas o resuelves según corresponda
//                 await (await import('../utils/alerts.js')).exceptionsSignOut();
//                 resolve(null); // O rechaza con un error si prefieres manejarlo de esa forma
//             }
//         });
//     });
// }
// ```

// Con esto, puedes utilizar `checkSessionActive()` en otro lugar de tu código de la siguiente manera:

// ```javascript
// async function otroContexto() {
//     try {
//         const userEmail = await checkSessionActive();
//         if (userEmail) {
//             console.log(`El email del usuario es: ${userEmail}`);
//             // Aquí puedes usar userEmail como necesites
//         } else {
//             console.log('No hay un usuario activo.');
//         }
//     } catch (error) {
//         console.error('Ocurrió un error:', error);
//     }
// }
// ```

// Este enfoque aprovecha `async/await` para trabajar de manera más intuitiva con operaciones asincrónicas, manteniendo tus intenciones iniciales. Aunque prefieras evitar promesas explícitas, en algunos casos como este, son una herramienta adecuada para adaptar ciertas APIs a un flujo de trabajo más declarativo y lineal.

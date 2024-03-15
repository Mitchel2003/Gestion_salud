//for initializing webpack of server: webpack-dev-server --mode development yes

/*--------------------------------------------------tools and source--------------------------------------------------*/
// function getImportAnim(action) {//load difered
//     import('./components/anim.js')
//         .then((anim) => {
//             if(action==="addActive"){
//                 anim.addActive();
//             }else{
//                 anim.removeActive();
//             }
//         })
//         .catch((error) => {
//             console.log(error);
//         });
// }

//------------------work with sweet Alert------------------
Swal.fire({
	// title:
	// text:
	// html:
	// icon:
	// confirmButtonText:
	// footer:
	// width:
	// padding:
	// background:
	// grow:
	// backdrop:
	// timer:
	// timerProgressBar:
	// toast:
	// position:
	// allowOutsideClick:
	// allowEscapeKey:
	// allowEnterKey:
	// stopKeydownPropagation:

	// input:
	// inputPlaceholder:
	// inputValue:
	// inputOptions:
	
	//  customClass:
	// 	container:
	// 	popup:
	// 	header:
	// 	title:
	// 	closeButton:
	// 	icon:
	// 	image:
	// 	content:
	// 	input:
	// 	actions:
	// 	confirmButton:
	// 	cancelButton:
	// 	footer:	

	// showConfirmButton:
	// confirmButtonColor:
	// confirmButtonAriaLabel:

	// showCancelButton:
	// cancelButtonText:
	// cancelButtonColor:
	// cancelButtonAriaLabel:
	
	// buttonsStyling:
	// showCloseButton:
	// closeButtonAriaLabel:

	// imageUrl:
	// imageWidth:
	// imageHeight:
	// imageAlt:
});

<<<<<<< HEAD

//-----------------setDocument in Firebase-----------------
import { doc, addDoc, setDoc } from "./conection.js";
export async function createUser(name, email, password, access) {
    const documentReference = doc(getCollection("user"), email);
    await setDoc(documentReference, {
        name: name,
        email: email,
        password: password,
        access: access,
        key: false
    });
}
=======
//---------------get user Data from firebase---------------
// async function loadUser(name) {
//     const userDoc = doc(db, `user/${name}`);
//     const snapshot = await getDocs(userDoc);
//     return {
//         id: snapshot.id,
//         ...snapshot.data(),
//     };
// }
>>>>>>> master

//-----------get tokenPassword code for firebase-----------
export async function getTokenPassword(querySnapshot) {//async await AC #202
    let valueToken;
    let valueIsUsed;

    getDocumentQuery(querySnapshot).forEach(({ token, isUsed }) => {
        valueToken = token;
        valueIsUsed = isUsed;
    });
    return { valueToken, valueIsUsed };
}

//---------------get UID of user in firebase---------------
export async function getUID_User(userContext) {
    const ask = query(getCollection("user"), where("email", "==", userContext));
    const querySnapshot = await getDocs(ask);
    if (querySnapshot.empty) {return;}
    return querySnapshot.docs[0].id;
}

//-----------get data (context:getTokenPassword)-----------
export function getDocumentQuery(query) {
    const array = query.docs.map(doc => doc.data());
    return array;
}

//-------logic createToken with 15 minuts for expire-------
export async function registerTokenPassword() {
    try {
        const getAlert = await import('../utils/alerts.js');

        const { title, message, typeAlert } = getAlert.messageRestorePassword();
        const email = await getAlert.alertInput(title, message, selectIcon(typeAlert));

        if (!(await isFoundEmail(email))) {
            const { title, message, typeAlert } = getAlert.messageUserNotFound();
            customAlert(title, message, selectIcon(typeAlert));
            return;
        }
        if (await isFoundToken(email)) {
            const { title, message, typeAlert } = getAlert.messageTokenFound();
            customAlert(title, message, selectIcon(typeAlert));
            return;
        }

        // //token generated with UID...
        // const token = await (await import('../firebase/query.js')).getUID_User(email);
        // await createTokenPassword(email, token); //need token for continue...

        await app.auth().sendPasswordResetEmail(email);

        const { title2, message2, typeAlert2 } = getAlert.messageTokenSubmitted();
        customAlert(title2, message2, selectIcon(typeAlert2));
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

//-----------resetPassword with firebase (steps)-----------
https://codingpr.com/react-firebase-password-reset-feature/
//---------------------------------------------------------









/*--------------------------------------------------addComentary in code--------------------------------------------------*/
#201: el hecho de que haya una animacion explicita que señale un comportamiento, no cambia el estado estandar del elemento en referencia;
es decir, si ponemos en contexto la siguiente animacion 

//css
	@keyframes animEntry{
    		from{
        			opacity: 0; transform: translateY(-30px);
    		}
    		to{
        			opacity: 1; transform: translateY(0);
    		}
	}

y la aplicamos de la siguiente manera

//css
	.loginContainer{
    		background-color: #fff; 
    		border-radius: 10px; 
    		padding: 20px; 
    		box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); 
    		width: 300px;
	}
	.loginContainer.loaded{
    		animation: animEntry 2s ease;
	}
//javaScript
	window.addEventListener("load", function () {
    		const background = new Image();
    		background.src = "imag/background_optimized.webp";
    		background.onload = function () {
      			document.body.style.backgroundImage = `url(${background.src})`;
      			document.getElementById("loginContainer").classList.add("loaded");
    		};
  	});

en la parte del codigo .loginContainer.loaded{} una vez realizada la animacion, el contenedor queda visible no porque la animacion se lo esté pidiendo, sino porque el default es "1";
es decir, si nosotros ponemos antes del loaded esto -> "opacity:0;" de este modo:

//css
	.loginContainer{
		opacity:0;
    		background-color: #fff; 
    		border-radius: 10px; 
    		padding: 20px; 
    		box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); 
    		width: 300px;
	}

la ejecucion de la animacion que esté en el "loaded" se realizará con normalidad, pero volverá a estar en el estado "0" despues de la animacion; por tanto,
señalo la importancia de especificar en el "loaded" como queremos que este el contenedor

//css
	.loginContainer{
    		opacity: 0;
    		background-color: #fff; 
    		border-radius: 10px; 
    		padding: 20px; 
    		box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); 
    		width: 300px;
	}
	.loginContainer.loaded{
    		animation: animEntry 2s ease;/*addNote "code #201"*/
    		opacity: 1;
	}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
#202: async without await: en esta ilustracion vemos la funcion con el async pero sin el await; lo que sucede es que esta es una funcion 
que pretende usar como parametro un elemento "promesa", el parametro que le introducimos es un getDocs de FireBase "querySnapshot";
por eso, si quisieramos por ejemplo implementar un if() tendria que verse algo así "(await getTokenPassword(querySnapshot)) esto dentro de un 
metodo async".

el metodo "getTokenPassword" aun sin tener promesas intrinsecas en el codigo, necesita de un async, para que de algun modo no halla
errores inesperados al momento de ejecutar el metodo, dado que necesitamos el parametro

lo podriamos usar de esta manera

export async function isFoundToken(emailContext) {
	
    const ask = query(getCollection("tokenPassword"),
        where("userEmail", "==", emailContext),
        where("isUsed", "==", "false"),
        where("date", ">=", TIME_WITH_SUBTRACTION()));
    const querySnapshot = await getDocs(ask);

    if (querySnapshot.empty) {
        return !querySnapshot.empty;
    }

    const result = await getTokenPassword(querySnapshot);

    return result;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
#203: al  importar dentro de un metodo "carga diferida" necesitamos poner await, luego una vez finalizada esa llegada, se importa el modulo en especifico

const {name, email, password, access} = (await import('../components/utils/tools/getValue.js')).getInputRegister();

export function getInputRegister() {
    const name=document.querySelector('.registerContainer input[type="text"]').value;
    const email=document.querySelector('.registerContainer input[type="email"]').value;
    const password=document.querySelector('.registerContainer input[type="password"]').value;
    const access=document.querySelector('.registerContainer select').value;
    return {name, email, password, access};
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*--------------------------------------------------tips--------------------------------------------------*/
				OPTIMIZAR PAGINA WEB

Optimizar un proyecto web implica mejorar su rendimiento, eficiencia y experiencia del usuario. Aquí hay algunas estrategias generales para lograr una optimización efectiva:

1. **Carga Asincrónica de Recursos:**
   - Utiliza el atributo `async` para cargar scripts de manera asíncrona.
   - Coloca los scripts al final del documento HTML para evitar bloquear la renderización.

2. **Compresión y Minificación de Recursos:**
   - Comprime imágenes y utiliza formatos eficientes como WebP.
   - Minimiza y combina archivos CSS y JavaScript.

3. **Caching:**
   - Aprovecha el almacenamiento en caché del navegador para recursos estáticos.
   - Utiliza técnicas como "Cache Busting" para evitar problemas con versiones en caché.

4. **Reducción de Solicitudes HTTP:**
   - Reduce la cantidad de archivos solicitados para disminuir el tiempo de carga.
   - Combina archivos CSS y JS siempre que sea posible.

5. **Carga Diferida (Lazy Loading):**
   - Carga imágenes y scripts solo cuando el usuario los necesita.
   - Utiliza el atributo `loading="lazy"` para imágenes.

6. **Optimización del CSS:**
   - Evita reglas redundantes y no utilizadas.
   - Utiliza la propiedad `will-change` para optimizar animaciones.

7. **JavaScript Eficiente:**
   - Evita el uso excesivo de librerías y frameworks.
   - Optimiza el código JS para evitar bucles innecesarios y reduce la complejidad ciclomática.

8. **Responsive Web Design:**
   - Asegúrate de que tu diseño sea responsive para diferentes tamaños de pantalla.
   - Utiliza medios de consulta para cargar estilos específicos según el dispositivo.

9. **Optimización del Servidor:**
   - Configura adecuadamente la compresión GZIP en el servidor.
   - Ajusta el tiempo de espera y la configuración del servidor para mejorar la respuesta.

10. **Monitorización y Pruebas:**
    - Utiliza herramientas como Lighthouse, PageSpeed Insights y WebPageTest para evaluar el rendimiento.
    - Realiza pruebas de carga y mide el tiempo de carga en condiciones del mundo real.

Recuerda que la optimización es un proceso continuo y puede depender de las características específicas de tu aplicación. Profundizar en cada uno de estos puntos y adaptarlos a las necesidades de tu proyecto puede mejorar significativamente el rendimiento general.





OPTIMIZAR FIRESTORE

Firestore está diseñado para ser escalable y manejar eficientemente consultas, incluso cuando
hay una gran cantidad de documentos. Sin embargo, siempre es bueno considerar las mejores prácticas y optimizar cuando sea posible.

Aquí hay algunas sugerencias adicionales que podrías considerar:

Índices compuestos: Asegúrate de tener índices compuestos configurados para tus consultas. Firestore crea índices automáticamente 
para las consultas que realizas, pero si estás ejecutando consultas más complejas, podría ser útil revisar la consola de Firebase 
para asegurarte de que los índices compuestos estén creados.

Paginación: Si estás preocupado por la cantidad de documentos que se devuelven en una sola consulta, podrías implementar la 
paginación en tu aplicación. Firestore proporciona funciones de paginación que te permiten obtener un número limitado de documentos a la vez.

Cache: Aprovecha la funcionalidad de caché de Firestore si es posible. Firestore tiene un sistema de caché incorporado que puede 
significativamente el rendimiento al reducir la necesidad de realizar consultas de red.

Estructura de datos eficiente: Diseña tu estructura de datos de manera que puedas realizar consultas de manera eficiente. Puedes ajustar 
tu estructura de datos para facilitar las consultas frecuentes.

Recuerda que en Firestore, la eficiencia y el rendimiento suelen depender de la forma en que estructuras tus datos y cómo realizas tus
consultas. Es una buena práctica ajustar la estructura de tus datos según las necesidades de consulta específicas de tu aplicación.

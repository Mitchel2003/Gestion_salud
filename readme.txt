/*--------------------------------------------------tips--------------------------------------------------*/
//for initializing webpack of server: webpack-dev-server --mode development yes
//implements: bcrypt, jsonwebtoken, dotenv
//production: react router, stackblitz, vite
//page for find backgrounds hd: uhdpaper.com


mira, estoy intentando hacer un cierre de session cuando el usuario permanezca cierto tiempo fuera de la pestaña, ya sea que se encuentre en otra pestaña del navegador o se esté la pagina en segundo plano, estaba manejando eso de este modo "let time; document.addEventListener('visibilitychange', async () => { await (await import('../firebase/authentication.js')).handleTimeOut(time); });"  este metodo handleTimeOut es este "export async function handleTimeOut(temp) {
    if (document.visibilityState === 'visible') { }
    else { clockTimerInactivity(temp); }
} function clockTimerInactivity(temp) {
    clearTimeout(temp);
    temp = setTimeout(async () => { await offSession(); }, 10000);
}" la verdad no se si pueda lograr esto usando este simple metodo de visibilitychange, quizas halla un mejor modo de hacer las cosas, necesito que cuando salga de la pagina, empieze el contador y que si regresa antes de que se cumpla el tiempo de expiracion entonces el temporalizador se apage, de este modo cuando vuelva a abandonar, el temporalizador empieze desde cero !animo, necesito tu 100%, dame todo tu potencial!



//analizing this... working here...

const userContext = await auth.currentUser;
await validateSession(userContext);
const { access } = getUserInfo(userContext);
setPageAccess(access);

//need get userCurrent, get from firestore the access for take a way

const container = document.querySelector('.card');
container.addEventListener('submit', async function (event) {
    event.preventDefault();
    await (await import('../components/firebase/query.js')).offSession();
    (await import('../components/utils/view.js')).goToHome();
});

function getUserInfo(user) { return { email: user.email, access: user.access, key: user.key }; }
function setPageAccess(access) {
    if (access === 'admin') { giveAccessAdmin(); }
    else if (access === 'auditor') { giveAccessAuditor(); }
    else { giveAccessAuxiliary(); }
}


para css= widt = 20 dvw;

Para mejorar la fluidez y optimización de la animación, te recomendaría seguir los siguientes pasos:

1. En lugar de animar propiedades como `height` y `width`, utiliza `transform` para escalar el tamaño del input. Esto es más eficiente en términos de rendimiento ya que `transform` no afecta al flujo del documento.
2. Evita usar propiedades como `margin-left`, `margin-top` y `margin-bottom` para mover el input. En su lugar, utiliza `transform` con `translate` para realizar desplazamientos.
3. En lugar de cambiar la propiedad `border` en el hover, considera aplicar un efecto de sombra utilizando `box-shadow` para mejorar la apariencia visual.
4. Utiliza valores absolutos o relativos en lugar de porcentajes en propiedades como `width` y `margin-left` para que la animación sea más predecible y no dependa del tamaño del contenedor.
5. Experimenta con la función `cubic-bezier` en lugar de `ease` para lograr una animación más suave y personalizada.

Siguiendo estas recomendaciones y optimizando el código CSS, deberías poder lograr una animación más fluida y profesional. ¡Espero que estos consejos te sean útiles y te ayuden a alcanzar tus objetivos! ¡Mucho ánimo en tu trabajo!


/*--------------------------------------------------tools and source--------------------------------------------------*/
function getImportAnim(action) {//load difered
    import('./components/anim.js')
        .then((anim) => {
            if(action==="addActive"){
                anim.addActive();
            }else{
                anim.removeActive();
            }
        })
        .catch((error) => {
            console.log(error);
        });
}
//-----------------appened background image-----------------
function appenedBackgroundImage(address){
    const background = new Image();
    background.src = address;
    document.body.style.backgroundImage = `url(${background.src})`;
}
//-----------------add values to url-----------------
export function preparateSessionWithAccess(value) {
    let url = new URL(window.location.href);
    url.pathname = './Gestion_salud/src/public/session.html';
    url.searchParams.set('key', value);
    window.location.href = url.toString();
}
//-----------------appened styles to html-----------------
function appenedStyles(src){
    const style = document.createElement('link');
    style.rel = "stylesheet";
    style.href = src;
    document.head.appendChild(style);
}
//-----------------where in Firebase-----------------
export async function isFoundEmail(emailContext) {
    const ask = query(await getCollection("user"), where("email", "==", emailContext));
    const querySnapshot = await getDocs(ask);
    return !querySnapshot.empty;
}
export async function isFoundAccess(emailContext) {
    const ask = query(await getCollection("user"),
        where("email", "==", emailContext),
        where("key", "==", true));
    const querySnapshot = await getDocs(ask);
    return !querySnapshot.empty;
}

//-----------------addDocument in Firebase-----------------
export async function saveUserData(name, email, access) {
    await addDoc(await getCollection("user"), {
        name: name,
        email: email,
        access: access,
        key: false
    });
}

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

//---------------get user Data from firebase---------------
 async function loadUser(name) {
     const userDoc = doc(db, `user/${name}`);
     const snapshot = await getDocs(userDoc);
     return {
         id: snapshot.id,
         ...snapshot.data(),
     };
 }

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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
#204: en esta porcion de codigo he optado por el empleo de metodos para formalizar excepciones; entrando contexto, diferentes partes de codigo precisamente
poseen un metodo personalizado de excepciones "exceptions... from alerts.js", en este caso en particular es un poco diferente; al momento notificar al usuario
puntos tales como passwordSizeShort o passwordNotSame, el backend de firebase no me lanza una excepcion especifica como para yo poder captarla en un metodo "if"
por tanto, vi necesario el uso de metodos para comprobar las entradas; queda el codigo un poco mas largo pero todo sea por un bien mayor...
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
#205: en este metodo recibo un parametro "data" el cual refiere al valor de "continueUrl" el cual se halla intrinseco en el link que devuelve FireBase para
la verificacion de email; entonces, la logica es la siguiente "if const continueUrl=null" si se cumple lo anterior entonces es que estamos en el contexto de
de una solicitud de resetPassword y no en una confirmacion de email; en este orden de ideas pensé en esta alternativa.
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
#206: en la implementacion visual de metodos como addActive;

    export function addActive(container) {//fix anim transition login-register
        container.classList.add('active');
    } export function removeActive(container) {
        container.classList.remove('active');
    }

cuya funcionalidad es la de ocultar y mostrar la session de registro, encontramos clave el uso overflow:hiden; en ese orden de ideas, ocurre
que elemento que se encuentra oculto "hide" se desplaza y es presentado al usuario en una suave transicion; ahora bien, en un caso particular
como en el de eyeIcon encontrabamos el uso del "display:none", entonces es aqui querido amigo cuando se complica la cosa; porque antes de la
transicion hay que ajustar el display, recuerda esto, las animaciones no funcionan muy bien con cambios en el display.
no es solo un comentario, es un detalle que puede ahorrar un dolor de cabeza.

he simplificado las cosas, he puesto un hover para el container del input, al momento de "mouseover" sobre el container entonces muestra el icono,
en javaScript tan solo me he encargado de operar el cambio del tipo de input, para que muestre u oculte la conttraseña
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
#207: en este apartado se me presentaba un problema; resulta que cuando utilizaba la alerta default de sweetAlert, el contenido de la pantalla
se desajustaba; me veia obligado a utilizar el atributo "toast: true", este presentaba un screen informativo mas pequeño, me ayudo a huir del problema;

pero no bastó, yo necesitaba el alert normal, el detalle era que al momento de solicitar la alerta, se añadia a mi pagina unos styles propios de la
documentacion de sweetAlert, estos modificaban el contenido con un class "body.swal2-height-auto {height: auto !important;}" que se interponía con ese
!important; la solucion fue poner el atributo height desde el body, para lograr de este modo interponerme en el efecto del class de sweetAlert. 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
#208: Se que en algun momento te abras preguntado, porque el onSession esta entre 2 if(), porque no simplemente lo ponemos al final de los dos if(), y
la cuestion es la siguiente; si es if() de consultar "key" (true or false) se evalua primero que el onSession(), entonces primero se evaluará la existencia
de acceso para ese email ingresado, en caso de estar la contraseña incorrecta es un problema, porque entonces tiene que ser usuario habilitado para que le 
aparezca mensaje de contraseña incorrecta.
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
#209: en este caso particular, es importante señalar que `onAuthStateChanged` no retorna una promesa con el valor del usuario, sino un método para
desuscribirse del listener. Este comportamiento es típico de los observadores, donde `onAuthStateChanged` está diseñado para ejecutarse cada vez que
el estado de autenticación cambia, lo que no se alinea directamente con el patrón `async/await;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*--------------------------------------------------tips--------------------------------------------------*/
### OPTIMIZAR PAGINA WEB

Optimizar un proyecto web implica mejorar su rendimiento, eficiencia y experiencia del usuario. Aquí hay algunas estrategias generales para lograr una
optimización efectiva:

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

Recuerda que la optimización es un proceso continuo y puede depender de las características específicas de tu aplicación. Profundizar en cada uno de estos
puntos y adaptarlos a las necesidades de tu proyecto puede mejorar significativamente el rendimiento general.


### OPTIMIZAR FIRESTORE

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


/*--------------------------------------------------patrones de diseño--------------------------------------------------*/
### Singleton

La lógica detrás del patrón Singleton es asegurar que una clase tenga única y exclusivamente una instancia y proporcionar un punto
de acceso global a dicha instancia. El ejemplo anterior logra esto mediante:

1. **Encapsulamiento de la Creación:** El constructor es esencialmente privado (se utiliza un truco mediante el chequeo de la 
existencia de una instancia) para que no se pueda instanciar la clase libremente.

2. **Acceso Controlado:** Se proporciona un acceso global mediante la exposición de la instancia única a través de la misma clase.

En el contexto de JavaScript, esto implica que cualquier tipo de propiedad o método que quieras que sea compartido y único a través
de tu aplicación, puede ser parte del Singleton. Algunos ejemplos incluyen:

- Configuraciones globales (por ejemplo, configuraciones de una aplicación).
- Conexiones a bases de datos (por ejemplo, una conexión única a MongoDB).
- Manejadores de cache.
- Factories que crean objetos específicos y deben ser únicos para garantizar consistencia.

### Consejos al Usar Singleton

- **Uso Justificado:** Asegúrate de que el uso del Singleton es justificado. El mal uso puede llevar a problemas de diseño, como
dificultades en testing dado que el estado persiste entre tests, y puede aumentar el acoplamiento entre clases.
- **Inmutabilidad:** Considera hacer inmutables las propiedades del Singleton si es posible, para evitar cambios de estado no deseados.
- **Lazy Initialization:** En algunos casos, es útil crear la instancia del Singleton solo cuando es realmente necesitada. Esto se
puede lograr mediante la verificación de la existencia de la instancia dentro de un método estático que cree y retorne la instancia en
caso de ser necesario.

class Singleton {
  // La instancia del Singleton se guarda en una variable estática.
  static instancia;

  // El constructor es privado para evitar la creación directa de objetos.
  constructor() {
    if(Singleton.instancia) {
      return Singleton.instancia;
    }
    
    // Inicializa cualquier lógica o propiedades aquí.
    this.estado = 'inicial';
    // Guarda la primera (y única) instancia creada.
    Singleton.instancia = this;
  }

  // Métodos o propiedades adicionales aquí.
  mostrarEstado() {
    console.log(this.estado);
  }

  // Otros métodos...
}

// Probando el Singleton.
const instanciaA = new Singleton();
const instanciaB = new Singleton();

console.log(instanciaA === instanciaB); // true, ambas variables apuntan al mismo objeto.

instanciaA.mostrarEstado(); // Muestra 'inicial'.


import { addActive, removeActive } from "../components/utils/view.js";
import { StatusConnection } from "../components/firebase/authentication.js";
/*--------------------------------------------------runtime--------------------------------------------------*/
const container = document.querySelector('.mainContainer');
window.addEventListener("load", async () => { (await import('../components/utils/view.js')).loadElements(container); });

//iterators
let status = new StatusConnection();
document.querySelector('.registerContainer header').addEventListener('click',() => {addActive(container)});
document.querySelector('.signContainer header').addEventListener('click',() => {removeActive(container)});
(await import('../components/utils/view.js')).changeStatusIconEye();

//temp
const menu = document.querySelector('.menu-access'),
select = menu.querySelector('.input-access'),
boxOptions = menu.querySelector('.box-options-access'),
options = menu.querySelectorAll('.option-access'),
showText = menu.querySelector('.text-access');

select.addEventListener('click', () => {setToggle();})

if(document.querySelector('.menu-access.viewOptions')){
    document.addEventListener('click', (e) => {
        const value=document.querySelector
        if(!){}
    });
}
options.forEach((item) => {
    item.addEventListener('click', () => {
        let option = item.querySelector('.text-option').innerText;
        showText.innerText = option;
        showText.classList.add('setColor');
        setToggle();
    });
});

function removeOptions(){
    menu.classList.remove('viewOptions')
}
function setToggle(){
    menu.classList.toggle('viewOptions')
}





¡Entendido! Para lograr lo que necesitas, vamos a implementar una lógica en JavaScript que escuche eventos de clics en el documento. Si el clic se realiza fuera de las opciones del combo box, entonces aplicaremos la clase que has definido para ocultar las opciones. Suponiendo que tu clase se llama `.ocultar`, te muestro una manera profesional de implementarlo:

1. **Estructura HTML Básica (Ejemplo):** Supongamos que tienes un combo box con un `id` `miComboBox` y quieres aplicar la clase `ocultar` a un elemento que contiene las opciones, por ejemplo, un `div` con `id` `opcionesComboBox`.

```html
<div id="miComboBox">
  <div id="opcionesComboBox">
    <!-- Supongamos que aquí van tus opciones -->
  </div>
</div>
```

2. **CSS**: Asegúrate de que tu clase `.ocultar` esté definida correctamente en tu archivo CSS para hacer invisible el elemento, algo como:

```css
.ocultar {
  display: none;
}
```

3. **JavaScript**: Vamos a añadir un escuchador de eventos de clic al documento. Si el clic se realiza fuera del combo box, aplicaremos la clase `.ocultar`.

```javascript
document.addEventListener('click', function(e) {
  var miComboBox = document.getElementById('miComboBox');
  var opcionesComboBox = document.getElementById('opcionesComboBox');
  
  // Verificar si el clic fue fuera del `miComboBox`
  if (!miComboBox.contains(e.target)) {
    // Si el clic fue fuera, añadir la clase `.ocultar` a `opcionesComboBox`
    opcionesComboBox.classList.add('ocultar');
  } else {
    // Si el clic fue dentro del combo box, podrías manejarlo de otra manera
    // Por ejemplo, asegurándote de que las opciones se muestren
    opcionesComboBox.classList.remove('ocultar');
  }
});
```

Recuerda que este código es un modelo básico. Podría necesitar adaptaciones dependiendo de la estructura exacta de tu HTML y de lo que específicamente buscas lograr con las interacciones dentro del combo box. La clave está en la detección del clic fuera del elemento de interés (`miComboBox`) para aplicar la clase `.ocultar` y gestionar la visibilidad de las opciones.
/*--------------------------------------------------tools--------------------------------------------------*/
const signContainer = document.querySelector('.signContainer');
const registerContainer = document.querySelector('.registerContainer');
const forgotPassword = document.querySelector('.signContainer button[type="button"]');
signContainer.addEventListener('submit', async function (event) {
    event.preventDefault();
    const { user, password } = (await import('../components/utils/values.js')).getInputLogin();
    await (await import('../components/models/userModel.js')).loginUser(user, password);
});
registerContainer.addEventListener('submit', async function (event) {
    event.preventDefault();
    const { name, email, password, access } = (await import('../components/utils/values.js')).getInputRegister();//AC #203
    await (await import('../components/models/userModel.js')).registerUser(name, email, password, access);
});
forgotPassword.addEventListener('click', async function (event) {
    event.preventDefault();
    await (await import('../components/models/userModel.js')).requestResetPassword();
});
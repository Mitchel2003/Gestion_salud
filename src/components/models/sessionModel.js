export async function modeAuxiliary() {
    //side bar
    document.getElementById('menu-action').addEventListener('click', () => { document.querySelector('.side-bar').classList.add('spawn'); });
    document.getElementById('close-action').addEventListener('click', () => { document.querySelector('.side-bar').classList.remove('spawn'); });
}
export async function modeAuditor() {

}
export async function modeAdmin() {

}
export async function modeAuxiliary() {
    document.querySelector('.user-options').addEventListener('click', (e) => {e.preventDefault; document.querySelector('.side-bar').classList.add('spawn'); });
    document.getElementById('close-options').addEventListener('click', () => { document.querySelector('.side-bar').classList.remove('spawn'); });
}
export async function modeAuditor() {

}
export async function modeAdmin() {

}
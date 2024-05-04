export async function modeAuxiliary() {
    //need use less addEventListener for themes of optimization
    document.querySelector('.user-options').addEventListener('click', () => { document.querySelector('.side-bar').classList.add('spawn'); });
    document.querySelector('.close-options span').addEventListener('click', () => { document.querySelector('.side-bar').classList.remove('spawn') });
    document.querySelector('.side-bar').addEventListener("mouseleave", () => { document.querySelector('.side-bar').classList.remove('spawn'); });
    
    
    
}
export async function modeAuditor() {

}
export async function modeAdmin() {

}
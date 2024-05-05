export async function modeAuxiliary() {
    //need use less addEventListener for themes of optimization
    document.querySelector('.user-options').addEventListener('click', () => { document.querySelector('.side-bar').classList.add('spawn'); });
    document.querySelector('.close-options span').addEventListener('click', () => { document.querySelector('.side-bar').classList.remove('spawn') });
    document.querySelector('.side-bar').addEventListener("mouseleave", () => { document.querySelector('.side-bar').classList.remove('spawn'); });

    let currentSection = new Section('.nav-tabs');
}
export async function modeAuditor() {

}
export async function modeAdmin() {

}
/*--------------------------------------------------controllers--------------------------------------------------*/
class Section{
    constructor(data){
        this.element = document.querySelector(data);
        this.observer();
    }
    observer(){
        this.element.addEventListener('click', async (e) => {
            const currentContext = e.target.ariaCurrent;
            if(!currentContext){return}
            await updateCurrentContext();
        });
    }
}
/*--------------------------------------------------interface--------------------------------------------------*/
async function updateCurrentContext(){
    //rpoperties .d-none for change visibility
}
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
    static currentContext;
    constructor(data){
        this.context = null;
        this.element = document.querySelector(data);
        this.observer();
    }
    observer(){
        this.element.addEventListener('click', (e) => {
            const section = e.target.ariaCurrent;
            if(!section){return}
            if(Section.currentContext === section){ /*refresh*/ return;}

            this.context = section;
            Section.currentContext = this.context;

            //need get documents of colection call especific

            //first thing that in section we have; containers, ids, addEventsListeners(), 
            //then at change of section, we could remove addEventsListeners()

            //remember, the colapse of the containers in section corresponds to bootstrap; i just need drive the events;
            //for themes of optimization

            setContentCurrentContext(section);
        });
    }
}
/*--------------------------------------------------interface--------------------------------------------------*/
function setCurrentContext(section){
    
    const searchStructure = document.querySelector(`.${section}`);//search container from body
    if(!searchStructure){ createStructure(section); return; }//here add structure to document
    
    //set visibility
    checkState(section);   
}
// function checkState(section) {
//     const element = document.querySelector(section);
//     if(!element){return}
    
// }
// function createStructure(data){
//     const road = getStructureContext(data);
//     document.body.insertAdjacentHTML('beforeend', road);
// }
// function getStructureContext(text) {
//     if(text === 'home'){
//         return `
//         <div class="home">
            
//         </div>
//         `;
//     }
// }
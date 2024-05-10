import { getProfileUser, getDataByRequest } from '../firebase/query.js';

export async function modeAuxiliary() {
    //need use less addEventListener for themes of optimization
    document.querySelector('.user-options').addEventListener('click', () => { document.querySelector('.side-bar').classList.add('spawn'); });
    document.querySelector('.close-options span').addEventListener('click', () => { document.querySelector('.side-bar').classList.remove('spawn') });
    document.querySelector('.side-bar').addEventListener("mouseleave", () => { document.querySelector('.side-bar').classList.remove('spawn'); });

    let loadData = new CurrentSection('.nav-tabs');
}
export async function modeAuditor() {

}
export async function modeAdmin() {

}
/*--------------------------------------------------controllers--------------------------------------------------*/
class CurrentSection{//AC #212
    static currentContext;
    constructor(data){
        this.context = null;
        this.element = document.querySelector(data);
        this.observer();
    }
    observer(){
        this.element.addEventListener('click', async (e) => {
            const section = e.target.ariaCurrent;
            if(!section){return}
            this.context = section;
            CurrentSection.currentContext = this.context;
            await setContent(CurrentSection.currentContext);
        });
    }
}
/*--------------------------------------------------interface--------------------------------------------------*/
async function setContent(context){ //working here...
    const { entity, collection, filter, limit, icon } = await preparateRequest(context);
    const elements = await getDataByRequest({ data:{entity: entity, req:collection, filter: filter, limit: limit} });

    elements.forEach((e) => { let appennedDevice = new Div(e.id_device, e.serial, e.avaliable, icon); });
}
async function preparateRequest(currentSection) {
    let collection, filter = 'avaliable', limit = 5, icon;
    const {entity} = getProfileUser();
    switch (currentSection) {
        case currentSection.includes('device'): collection = 'device_references'; icon='bx bx-desktop'; break;
        case currentSection.includes('finding'): collection = 'finding_references'; break;
        case currentSection.includes('departaments'): collection = 'departament'; break;
        case currentSection.includes('user'): collection = 'user'; break;
        default: break;
    } return { entity, collection, filter, limit, icon }
}

class Div{
    constructor(id, serial, avaliable, icon){
        this.id = id;
        this.device = serial;
        this.enable = avaliable;
        this.icon = icon;
        this.createElements();
    }
    createElements(){

    }
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
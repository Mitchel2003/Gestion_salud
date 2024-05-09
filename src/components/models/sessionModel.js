export async function modeAuxiliary() {
    //need use less addEventListener for themes of optimization
    document.querySelector('.user-options').addEventListener('click', () => { document.querySelector('.side-bar').classList.add('spawn'); });
    document.querySelector('.close-options span').addEventListener('click', () => { document.querySelector('.side-bar').classList.remove('spawn') });
    document.querySelector('.side-bar').addEventListener("mouseleave", () => { document.querySelector('.side-bar').classList.remove('spawn'); });

    let section = new Section('.nav-tabs');
    // setContentCurrentContext(section.currentContext);
    
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
        this.element.addEventListener('click', async (e) => {
            const section = e.target.ariaCurrent;
            if(!section){return}
            this.context = section;
            Section.currentContext = this.context;
            
            // await setContentSection(section)
        });
    }
}
/*--------------------------------------------------interface--------------------------------------------------*/
async function setContentSection(context){
    let lastVisibleDocument = null;
    const queryLimit = 10; // Cambia este valor según tus necesidades
    await requestQuery(context, {}, "collection");

}
async function requestQuery(context, request, typeSearch) {//working here...
    //need request 5 documents from database "for example"
    switch (context) {
        case 'handler-device':
            await (await import('../firebase/query.js')).getDataByRequest()
            break;
    
        default:
            break;
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
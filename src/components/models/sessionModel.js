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
async function setContent(context){
    await requestDataQuery(context);
}
async function requestDataQuery(CurrentSection) {//working here...
    //need request 5 documents from database "for example"    
    const {entity} = (await import('../firebase/query.js')).getProfileUser();

    'handler-device'

    const response = await (await import('../firebase/query.js')).getDataByRequest({ deep: true, data:{ entity: entity, req:'device' } });
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
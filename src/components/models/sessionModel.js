import { getProfileUser, getDataByRequest } from '../firebase/query.js';
import { onLoadWhile, offLoadWhile } from '../utils/view.js';

export async function modeAuxiliary() {
    //need use less addEventListener for themes of optimization
    document.querySelector('.user-options').addEventListener('click', () => { document.querySelector('.side-bar').classList.add('spawn'); });
    document.querySelector('.close-options span').addEventListener('click', () => { document.querySelector('.side-bar').classList.remove('spawn') });
    document.querySelector('.side-bar').addEventListener("mouseleave", () => { document.querySelector('.side-bar').classList.remove('spawn'); });

    let loadData = new Section('.nav-tabs');
}
export async function modeAuditor() {

}
export async function modeAdmin() {

}
/*--------------------------------------------------controllers--------------------------------------------------*/
class Section{//AC #212
    static currentContext;
    constructor(data){
        this.navigator = document.querySelector(data);
        this.observer();
    }
    observer(){
        this.navigator.addEventListener('click', async (e) => {
            const section = e.target.ariaCurrent;
            if(!section){return}
            Section.currentContext = section;
            await setContent(Section.currentContext);
        });
    }
}
/*--------------------------------------------------interface--------------------------------------------------*/
async function setContent(context){
    onLoadWhile();
    const { searchCollection, companyContext, orderBy, querylimit, icon } = await preparateRequest(context);
    const query = await getDataByRequest({ data:{req:searchCollection, entity: companyContext, filter: orderBy, limit: querylimit} });

    const turn = 'right';
    const currentContainer = document.getElementById(`${context}-${turn}`);
    const elementEmpty = currentContainer.querySelector('.empty');
    if (currentContainer.contains(elementEmpty)) { currentContainer.removeChild(elementEmpty); }// working here...

    query.forEach((e) => {
        const data = e.data();
        const container = createElement(data.id_device, data.serial, data.avaliable, icon);
        currentContainer.insertAdjacentHTML('afterbegin', container);
    });
    offLoadWhile();
}
async function preparateRequest(currentSection) {
    let searchCollection, icon, orderBy = 'avaliable', querylimit = 5;
    const {entity: companyContext} = getProfileUser();
    if(currentSection.includes('user')){ searchCollection = 'user'; icon='bx bxs-id-card'; }
    if(currentSection.includes('device')){ searchCollection = 'device_references'; icon='bx bx-desktop'; }
    if(currentSection.includes('finding')){ searchCollection = 'finding_references'; icon='bx bx-file'; }
    if(currentSection.includes('departaments')){ searchCollection = 'departament'; icon='bx bx-buildings'; }
    return { searchCollection, companyContext, orderBy, querylimit, icon }
}

function createElement(id, serial, status, icon) {
    return `
        <div class="card" style="width: 18rem;">
            <span class="${icon} fs-2"></span>
            <div class="card-body">
                <h5 class="card-title">ID: ${id} </h5>
                <p class="card-text">Serial: ${serial}</p>
                <p class="card-text">Available: <span class="fs-5"> ${status?'&#x1F7E2;':'&#x1F534;'} </span> </p>
                <a href="" class="btn btn-primary">more details</a>
            </div>
        </div>
    `;
}
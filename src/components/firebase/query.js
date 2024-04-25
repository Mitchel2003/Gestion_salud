import { collection, db, doc, getDocs, query, where } from "./conection.js";
/*--------------------------------------------------booleans and getters--------------------------------------------------*/
export async function isFoundDocumentReference(user) {
    const ask = query(await getCollection("userInfo"), where("email", "==", user));
    const querySnapshot = await getDocs(ask);
    return !querySnapshot.empty;
}
export async function getDocumentUser(user) {
    let access, key;
    const ask = query(await getCollection("userInfo"), where("email", "==", user));
    const querySnapshot = await getDocs(ask);
    querySnapshot.forEach((doc) => { const value = doc.data(); access = value.access; key = value.key; });
    return { access, key };
}
export async function getDataByRequest(request, typeSearch) {
    if (typeSearch === 'query') { pullQuery(request); return; }
    if (typeSearch === 'collection') { pullCollection(request); return; }
    // if (key.includes('2')) { await checkExtensionData(object); return; }

    //query all entities
    const ask = await getCollection("main");
    const querySnapshot = await getDocs(ask);
    return querySnapshot;
}

async function checkExtensionData(data){
    if(data['2'] === ''){ await isBigData(data); } //at fetch in collection
    else{ isSmallData(); } //at fetch in document
}
async function isBigData(object){
    const init = doc(db, 'main', object['1'])
    const subCollection = collection(init, object['2']);
    const querySnapshot = await getDocs(subCollection);
    return querySnapshot;
}
async function isSmallData(){
    
}

/*--------------------------------------------------tools modularization--------------------------------------------------*/
export async function getCollection(context) {
    const collectionReference = await collection(db, context);
    return collectionReference;
}
export async function pullCollection(object, deep) {//this is apropiade for 
    const init = doc(db, 'main', object['1']);
    
    if (deep === 1) {//user and departament
        const subCollection = collection(init, object['2']);
        const querySnapshot = await getDocs(subCollection);
        return querySnapshot;
    }
    if (deep === 2) {//device
        
        const querySnapshot = await getDocs(subCollection);
        return querySnapshot;
    }
    if (deep === 3) {//finding
        
    }
    
}
export async function pullQuery(object, deep, condicion){//get document apply condicion
    const init = doc(db, 'main', object['1']);
    let collectionContext;

    switch (deep) {
        case 1://user and departament
            collectionContext = collection(init, object['2']);
            break;
        case 2://device
            const subDocument = doc(init, object['2'], object['3']);
            collectionContext = collection(subDocument, object['4']);
            break;
        case 3://finding
            break;

        default:
            const ask = query(collection(init, object['2']), where(condicion['p1'], condicion['o1'], condicion['p2']));
            const querySnapshot = await getDocs(ask);
            return querySnapshot;
            break;
    }
}
async function filterQuery(object){
    if(object){
        const ask = query(collection(init, object['2']), where(condicion['p1'], condicion['o1'], condicion['p2']));
    }
}

export function getQueryParams() {
    const queryString = window.location.search;
    const searchParams = new URLSearchParams(queryString);
    return Object.fromEntries(searchParams.entries());
}

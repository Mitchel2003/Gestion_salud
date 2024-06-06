import {timeStampToDate} from '../utils/convert.js';

export function cardDevice(data, icon) {
    return `
        <div class="card card-body container-fluid" data-card='${JSON.stringify([ data.id_departament, data.id_device ])}' style="background: url('../components/images/bg-list.svg') no-repeat center; background-size: cover;">
            <div class="row flex-direction">
                <div class="col-lg-9 col-md-9 col-sm-9 align-items-start me-auto">
                    <h5 class="card-title m-0">ID: ${data.id_device}</h5>
                    <p class="card-text m-0">Serial: ${data.serial}</p>
                    <p class="card-text m-0">Available: <span class="fs-5"> ${data.avaliable ? '&#x2705;' : '&#x26D4;'} </span> </p>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-3 d-flex justify-content-end">
                    <i class="${icon} text-primary fs-1"></i>
                </div>
            </div>

            <div class="d-flex m-0">
                <a href="" class="btn ${data.avaliable ? 'btn-outline-success' : 'btn-outline-danger'} container-fluid rounded-end-0">see reports</a>
                <a href="" class="btn btn-outline-primary container-fluid rounded-start-0">more details</a>
            </div>
        </div>
    `;
}
export function cardFinding(data, icon) {
    return `
        <div class="card card-body container-fluid border border-4 text-white ${data.type === 'preventive' ? 'border-primary-subtle' : 'border-warning-subtle'}" style="background: url('../components/images/bg-temp.svg') no-repeat center; background-size: cover;">
                <div class="row">
                    <div class="col-lg-0 col-md-1 col-sm-1 text-start">
                        <i class="${icon} ${data.type === 'preventive' ? 'text-primary' : 'text-warning'} fs-1"></i>
                    </div>
                    <div class="col-lg-12 col-md-11 col-sm-11 d-flex align-items-center me-auto">
                        <h6 class="card-title m-0 me-auto">ID: ${data.id_finding}</h6>
                        <h6 class="card-title m-0">Device: ${data.id_device}</h6>
                    </div>
                    
                </div>
                <div class="row align-items-center">
                    <div class="col-lg-12 col-md-12 col-sm-12 d-flex me-auto">
                        <p class="card-text m-0 me-auto">Subject: ${data.subject}</p>
                        <p class="card-text m-0">Type: ${data.type}</p>
                        <p>${data.type === 'preventive' ? '&#x1F537;' : '&#x1F536;'}</p>    
                    </div>
                </div>
                <a href="" class="btn border border-2 ${data.type === 'preventive' ? 'btn-outline-primary border-primary-subtle' : 'btn-outline-warning border-warning-subtle'}">show more</a>
        </div>
    `;
}
export function cardDetails(snapshot, icon) {
    const data = snapshot.data();
    const time = timeStampToDate(data.lastReport);
    return `
        <div class="card card-body container-fluid border border-4 border-primary-subtle shadow-lg p-3 bg-body rounded" style="background: linear-gradient(135deg, #3498db 0%, #8e44ad 100%); color: #fff;">
            <div class="row">
                <div class="col-lg-1 col-md-2 col-sm-2">
                    <i class="${icon} text-warning fs-1"></i>
                </div>
                <div class="col-lg-11 col-md-10 col-sm-10 d-flex align-items-end">
                    <h2 class="card-title fw-bold text-start">Device Details</h2>
                    <h3 class="card-title fw-bold ms-auto"> ID: ${snapshot.id}</h3>
                </div>
            </div>

            <hr class="mt-auto" style="border-top: 1px solid rgba(255,255,255,0.5);">

            <div class="row">
                <div class="col-8 d-flex">
                    <p><strong>Serial:</strong> ${data.serial}</p>
                </div>
                <div class="col-4 d-flex">
                    <p class="ms-auto"><strong>Avaliable:</strong> ${data.avaliable ? '&#x2705;' : '&#x26D4;'}</p>
                </div>
            </div>
            <div class="row">
                <div class="col-7 d-flex">
                    <p class="text-start"><strong>Date last report:</strong> ${time.day}/${time.month}/${time.year} - ${time.hour}:${time.minutes}:${time.seconds}</p>
                </div>
                <div class="col-5 d-flex">
                    <p class="ms-auto"><strong>Warranty:</strong> ${data.garantie === 'empty'? `&#x1F534;`:`${data.garantie} &#x1F535;`}</p>
                </div>
            </div>

            <hr class="mt-auto" style="border-top: 1px solid rgba(255,255,255,0.5);">

            <div class="container border border-primary rounded p-3" style="background-color: rgba(255, 255, 255, 0.1);">
                <div class="row">
                    <div class="col-12">
                        <h4 class="text-start mb-3" style="color: #85e7f8;"><i class="bi bi-info-circle fs-3 text-info"></i> Device Description</h4>
                        <p class="text-start" style="font-size: 1.1em;">${data.specifications}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}
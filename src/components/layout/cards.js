export function cardDevice(data, queryArray) {
    return `
        <div class="card card-body container-fluid">
            <div class="row">
                <div class="col-lg-9 col-md-9 col-sm-9 align-items-start me-auto">
                    <h5 class="card-title m-0">ID: ${data.id_device}</h5>
                    <p class="card-text m-0">Serial: ${data.serial}</p>
                    <p class="card-text m-0">Available: <span class="fs-5"> ${data.avaliable ? '&#x2705;' : '&#x26D4;'} </span> </p>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-3 d-flex justify-content-end">
                    <i class="${queryArray.icon} text-primary fs-1"></i>
                </div>
            </div>

            <div class="d-flex m-0">
                <a href="" class="btn ${data.avaliable ? 'btn-outline-success' : 'btn-outline-danger'} container-fluid">see reports</a>
                <a href="" class="btn btn-outline-primary container-fluid">more details</a>
            </div>
        </div>
    `;
}
export function cardFinding(data, queryArray) {
    return `
        <div class="card card-body container-fluid border border-4 ${data.type === 'preventive'?'border-primary-subtle':'border-warning-subtle'}">
                <div class="row">
                    <div class="col-lg-11 col-md-11 col-sm-10 d-flex align-items-center me-auto order-2 order-sm-1">
                        <h6 class="card-title m-0 me-auto">ID: ${data.id_finding}</h6>
                        <h6 class="card-title m-0">Device: ${data.id_device}</h6>
                    </div>
                    <div class="col-lg-1 col-md-1 col-sm-2 d-flex justify-content-end order-1 order-sm-2">
                        <i class="${queryArray.icon} ${data.type === 'preventive'?'text-primary':'text-warning'} fs-1"></i>
                    </div>
                </div>
                <div class="row align-items-center">
                    <div class="col-lg-12 col-md-12 col-sm-12 d-flex me-auto">
                        <p class="card-text m-0 me-auto">Subject: ${data.subject}</p>
                        <p class="card-text m-0">Type: ${data.type}</p>
                        <p>${data.type === 'preventive'?'&#x1F537;':'&#x1F536;'}</p>    
                    </div>
                </div>
                <a href="" class="btn border border-1 ${data.type === 'preventive'?'btn-outline-primary border-primary-subtle':'btn-outline-warning border-warning-subtle'}">show more</a>
        </div>
    `;
}
export function cardDevice(data, queryArray) {
    return `
        <div class="card container-fluid">
            <span class="${queryArray.icon} fs-2"></span>
            <div class="card-body">
                <h5 class="card-title">ID: ${data.id_device} </h5>
                <p class="card-text">Serial: ${data.serial}</p>
                <p class="card-text">Available: <span class="fs-5"> ${data.avaliable ? '&#x2705;' : '&#x26D4;'} </span> </p>
                <a href="" class="btn btn-primary">more details</a>
            </div>
        </div>
    `;
}
export function cardFinding(data, queryArray) {
    return `
        <div class="card container-fluid">
            <span class="${queryArray.icon} fs-2"></span>
            <div class="card-body">
                <h5 class="card-title">ID: ${data.id_finding} </h5>
                <p class="card-text">Device: ${data.serial_device}</p>
                <p class="card-text">Subject: ${data.subject}</p>
                <p class="card-text">Type: ${data.type}</p>
                <a href="" class="btn btn-primary">more details</a>
            </div>
        </div>
    `;
}
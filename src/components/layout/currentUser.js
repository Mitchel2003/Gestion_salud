/*--------------------------------------------------return html--------------------------------------------------*/
export function getUserContext(res) {//AC #205
    document.title = "Session";
    if (res === 'admin') {
        return `
        <nav class="bg-body-tertiary navbar navbar-expand-lg">
            <div class="container-fluid">
                
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <h1 class="navbar-brand mb-0">Dashboard</h1>

                <div class="navbar-collapse mx-2 collapse" id="navbarSupportedContent">
                    <ul class="nav nav-tabs navbar-nav" role="tablist">
                        <button class="nav-link active" id="nav-home" type="button" role="tab" data-bs-toggle="tab" data-bs-target="#home" aria-current="home" aria-selected="true">
                            Home
                        </button>

                        <button class="nav-link" id="nav-handler-device" type="button" role="tab" data-bs-toggle="tab" data-bs-target="#handler-device" aria-current="handler-device" aria-selected="false">
                            Handler device
                        </button>

                        <button class="nav-link" id="nav-control-departaments" type="button" role="tab" data-bs-toggle="tab" data-bs-target="#control-departaments" aria-current="control-departaments" aria-selected="false">
                            Control departaments
                        </button>

                        <button class="nav-link" id="nav-user-management" type="button" role="tab" data-bs-toggle="tab" data-bs-target="#user-management" aria-current="user-management" aria-selected="false">
                            User management
                        </button>

                        <li class="dropdown text-center">
                            <a class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Documents
                            </a>
                            <ul class="dropdown-menu text-center">
                                <button class="dropdown-item" id="nav-finding-data" type="button" role="tab" data-bs-toggle="tab" data-bs-target="#finding-data" aria-current="finding-data" aria-selected="false">
                                    Finding data
                                </button>
                                <button class="dropdown-item" id="nav-device-information" type="button" role="tab" data-bs-toggle="tab" data-bs-target="#device-information" aria-current="device-information" aria-selected="false">
                                    Device information
                                </button>
                                <hr class="dropdown-divider">
                                <button class="dropdown-item" id="nav-filters" type="button" role="tab" data-bs-toggle="tab" data-bs-target="#filters" aria-current="filters" aria-selected="false">
                                    Filters
                                </button>
                            </ul>
                        </li>
                    </ul>
                </div>

                <a class="user-options mt-1 collapse show" id="navbarSupportedContent"> <span class="bx bxs-user-circle fs-1"></span> </a>
            </div>
        </nav>


        <ul class="side-bar">
            <li class="close-options">
                <h4 class="text-center mb-0 fs-4">Options</h4>
                <span class="bx bx-x fs-1"></span>
            </li>
            <li><a>Your profile</a></li>
            <li><a>Management accounts</a></li>
            <li><a>Settings</a></li>
        </ul>

        <div class="tab-content" id="nav-tabContent">   <!-- content of section -->

            <!-- Home -->
            <div class="tab-panel p-3 fade collapse show active" id="home" role="tabpanel" aria-labelledby="nav-home">
                <div class="container-fluid p-0 rounded-2">
                    <div class="top-0 start-0 d-flex align-items-center" style="background: rgba(24, 29, 56, 0.7);">
                        <div class="container">
                            <div class="row justify-content-start">
                                <div class="col-sm-10 col-lg-8">
                                    <h5 class="text-primary mb-3 animated slideInDown">Sofware gestion salud</h5>
                                    <h1 class="display-3 text-white animated slideInDown">The Best Online Learning Platform</h1>
                                    <p class="fs-5 text-white mb-4 pb-2">Sofware destinado al manejo de informes y reportes asociados a equipos, promete manejo de datos</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Handler device -->
            <div class="tab-panel p-3 fade collapse" id="handler-device" role="tabpanel" aria-labelledby="nav-handler-device">

                <!-- hd top -->
                <div class="row">

                    <!-- hd navbar -->
                    <div class="col-lg-8 col-md-8 col-sm-5 align-items-end d-flex order-2 order-sm-1">
                        <nav class="navbar navbar-expand-lg p-0 bg-primary-subtle border border-primary-subtle bg-opacity-75 rounded-top-2">
                            <div class="nav nav-tabs navbar-collapse" id="subnavbar-handler-device" role="tablist">
                                <button class="nav-link active" id="nav-reports" type="button" role="tab" data-bs-toggle="tab" data-bs-target="#reports" aria-current="reports" aria-selected="true">
                                    Reports
                                </button>

                                <button class="nav-link" id="nav-create-report" type="button" role="tab" data-bs-toggle="tab" data-bs-target="#create-report" aria-current="create-report" aria-selected="false">
                                    Create report
                                </button>

                                <button class="nav-link" id="nav-add-device" type="button" role="tab" data-bs-toggle="tab" data-bs-target="#add-device" aria-current="add-device" aria-selected="false">
                                    Add device
                                </button>
                            </div>
                        </nav>
                    </div>

                    <!-- hd search -->
                    <div class="col-lg-4 col-md-4 col-sm-7 mb-1 d-flex order-1 order-sm-2">
                        <button class="btn btn-lg btn-warning rounded-end-0 rounded-start-4 ms-auto" type="button"> <span class="bx bx-filter-alt mt-1 fs-5"></span> </button>
                        <input class="form-control w-100 rounded-0" type="search" placeholder="Search device" aria-label="Search">
                        <button class="btn btn-lg btn-info rounded-start-0 " type="submit"> <span class="bx bx-search fs-5"></span> </button>
                    </div>
                </div>

                <!-- hd container -->
                <div class="container-fluid rounded-2 bg-body-tertiary bg-opacity-50">
                    <div class="row">

                        <!-- container left -->
                        <div class="col-lg-8 col-md-8 col-sm-6 p-1">
                            <div class="scroll-container overflow-auto rounded-2" style="max-height: 75vh;">
                                <!-- content section left -->
                                <div class="tab-content" id="nav-tabContent-handlerDevice">
                                    <div class="tab-panel fade collapse show active" id="reports" role="tabpanel" aria-labelledby="nav-reports">

                                        <div class="empty card rounded-3 border-0 align-items-center shadow" style="background: url('../components/images/bg-not-found.svg') no-repeat center; background-size: cover;">
                                            <div class="w-75 text-center text-black py-5">
                                                <i class="bi bi-info-circle-fill text-danger fs-1"></i>
                                                <h5 class="card-title mb-3 fs-5">Nothing here</h5>
                                                <p class="card-text">Please, create something to see here</p>
                                            </div>
                                        </div>

                                        <div request='loadMore' class="card d-none" id="load-more">
                                            <button request="loadMore" class="btn btn-secondary container-fluid p-0">load more...</button>
                                        </div>
                                    </div>

                                    <div class="tab-panel fade collapse" id="create-report" role="tabpanel" aria-labelledby="nav-create-report">

                                        <div class="card card-body border border-4 border-primary-subtle shadow-lg p-3 bg-body rounded" style="background: url('../components/images/bg-create-report.svg') no-repeat center; color: #fff;">
                                            <h2 class="card-title fw-bold text-start mb-3">Report Form</h2>
                                            <form>
                                                <div class="row">
                                                    <div class="col-lg-3 col-md-3 col-sm-3 mb-2 order-sm-3">
                                                        <label for="create-report-time" class="form-label">Time</label>
                                                        <input type="time" class="form-control" id="create-report-time">
                                                    </div>
                                                    <div class="col-lg-3 col-md-4 col-sm-4 mb-2 order-sm-2">
                                                        <label for="create-report-date" class="form-label">Date</label>
                                                        <input type="date" class="form-control" id="create-report-date">
                                                    </div>
                                                    <div class="col-lg-6 col-md-5 col-sm-5 mb-2 order-sm-1">
                                                        <label for="create-report-idDevice" class="form-label">Device ID</label>
                                                        <input type="text" class="form-control" id="create-report-idDevice" placeholder="Enter Device ID">
                                                    </div>
                                                </div>

                                                <div class="row">
                                                    <div class="col-lg-6 col-md-5 col-sm-5 mb-2 order-sm-2">
                                                        <label for="create-report-maintenance" class="form-label">Maintenance</label>
                                                        <select class="form-select" id="create-report-maintenance">
                                                            <option value="" selected disabled>Choose a type</option>
                                                            <option value="preventive">Preventive</option>
                                                            <option value="corrective">Corrective</option>
                                                        </select>
                                                    </div>
                                                    <div class="col-lg-6 col-md-7 col-sm-7 mb-2 order-sm-1">
                                                        <label for="create-report-subject" class="form-label">Subject</label>
                                                        <input type="text" class="form-control" id="create-report-subject" placeholder="Enter Subject">
                                                    </div>
                                                </div>

                                                <div class="row">
                                                    <div class="col-12 mb-3">
                                                        <label for="create-report-description" class="form-label">Description</label>
                                                        <textarea class="form-control" id="create-report-description" rows="2" placeholder="Enter Description"></textarea>
                                                    </div>
                                                </div>

                                                <div class="d-flex">
                                                    <button type="button" class="btn btn-primary" action-btn="create-report" onclick="handleCustomRequest(event)">Submit Report</button>
                                                    <div class="form-check form-switch ms-auto">
                                                        <label class="form-check-label fs-5" for="create-report-avaliable">Avaliable</label>
                                                        <input class="form-check-input fs-4" type="checkbox" role="switch" id="create-report-avaliable" checked>
                                                    </div>
                                                </div>
                                            </form>                                    
                                        </div>
                                        
                                    </div>

                                    <div class="tab-panel fade collapse" id="add-device" role="tabpanel" aria-labelledby="nav-add-device">
                                        
                                        <div class="card card-body border border-4 border-primary-subtle shadow-lg p-3 bg-body rounded" style="background: url('../components/images/bg-create-report.svg') no-repeat center; color: #fff;">
                                            <h2 class="card-title fw-bold text-start mb-3">Device Form</h2>
                                            <form>
                                                <div class="row">
                                                    <div class="col-lg-3 col-md-4 col-sm-4 mb-2 order-sm-2">
                                                        <label for="create-device-departament" class="form-label">Departament</label>
                                                        <select class="form-select" id="create-device-departament">
                                                            <option value="" selected disabled>Choose a departament</option>
                                                            <!-- load content -->
                                                        </select>
                                                    </div>
                                                    <div class="col-lg-6 col-md-4 col-sm-4 mb-2 order-sm-1">
                                                        <label for="create-device-serial" class="form-label">Serial</label>
                                                        <input type="text" class="form-control" id="create-device-serial" placeholder="Enter serial">
                                                    </div>
                                                    <div class="col-lg-3 col-md-4 col-sm-4 mb-2 order-sm-3">
                                                        <label for="create-device-warranty" class="form-label">Warranty</label>
                                                        <select class="form-select" id="create-device-warranty">
                                                            <option value="" selected disabled>Choose a time</option>
                                                            <option value="preventive">Not apply</option>
                                                            <option value="12 months">12 months</option>
                                                            <option value="24 months">24 months</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div class="row">
                                                    <div class="col-12 mb-3">
                                                        <label for="create-device-description" class="form-label">Description</label>
                                                        <textarea class="form-control" id="create-device-description" rows="3" placeholder="Enter Description"></textarea>
                                                    </div>
                                                </div>

                                                <div class="d-flex">
                                                    <button type="button" class="btn btn-primary" action-btn="create-device" onclick="handleCustomRequest(event)">Submit device</button>
                                                    <div class="form-check form-switch ms-auto">
                                                        <label class="form-check-label fs-5" for="create-device-avaliable">Avaliable</label>
                                                        <input class="form-check-input fs-4" type="checkbox" role="switch" id="create-device-avaliable" checked>
                                                    </div>
                                                </div>
                                            </form>                                    
                                        </div>

                                    </div>
                                    
                                </div>
                            </div>
                        </div>

                        <!-- container right -->
                        <div class="col-lg-4 col-md-4 col-sm-6 p-1 rounded-2 bg-body-tertiary bg-opacity-75">
                            <div class="d-flex px-1 d-sm-none">
                                <div class="me-auto">
                                    <i class="bi bi-pc-display text-primary fs-1"></i>
                                </div>
                                <div class="d-flex align-items-center">
                                    <h3>Devices</h3>
                                </div>
                            </div>
                            <div id="device-list" class="scroll-container overflow-auto p-0 rounded-2" style="max-height: 75vh;">
                                
                                <div class="empty card rounded-3 border-0 align-items-center shadow" style="background: url('../components/images/bg-not-found.svg') no-repeat center; background-size: cover;">
                                    <div class="w-75 text-center text-black py-5">
                                        <i class="bi bi-info-circle-fill text-danger fs-1"></i>
                                        <h5 class="card-title mb-3 fs-5">Nothing here</h5>
                                        <p class="card-text">Please, create something to see here</p>
                                    </div>
                                </div>

                                <div class="card d-none" id="load-more">
                                    <button request="loadMore" class="btn btn-primary container-fluid p-0">load more...</button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="tab-panel fade collapse p-3" id="control-departaments" role="tabpanel" aria-labelledby="nav-control-departaments">
                <h1>control-departaments</h1>
            </div>

            <div class="tab-panel fade collapse p-3" id="user-management" role="tabpanel" aria-labelledby="nav-user-management">
                <h1>user-management</h1>
            </div>

            <div class="tab-panel fade collapse p-3" id="finding-data" role="tabpanel" aria-labelledby="nav-finding-data">
                <h1>finding-data</h1>
            </div>

            <div class="tab-panel fade collapse p-3" id="device-information" role="tabpanel" aria-labelledby="nav-device-information">
                <h1>device-information</h1>
            </div>

            <div class="tab-panel fade collapse p-3" id="filters" role="tabpanel" aria-labelledby="nav-filters">
                <h1>filters</h1>
            </div>
        </div>
        `;
    } if (res === 'auditor') {
        return `
        
        `;
    } if (res === 'auxiliary') {
        return `
        
        `;
    }
}
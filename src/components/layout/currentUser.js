/*--------------------------------------------------return html--------------------------------------------------*/
export function getUserContext(res) {//AC #205
    document.title = "Session";
    if (res === 'auxiliary') {
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
                <div class="container-fluid">
                    <div class="accordion" id="accordionExample1">
                        <div class="accordion-item">
                            <h2 class="accordion-header">
                                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                    Accordion Item #1
                                </button>
                            </h2>
                            <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionExample1">
                                <div class="accordion-body">
                                    <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
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
                            <div class="nav nav-tabs navbar-collapse" id="navbarHandlerDevice" role="tablist">
                                <button class="nav-link active" id="nav-reports" type="button" role="tab" data-bs-toggle="tab" data-bs-target="#reports" aria-current="reports" aria-selected="true">
                                    Reports
                                </button>

                                <button class="nav-link" id="nav-add-report" type="button" role="tab" data-bs-toggle="tab" data-bs-target="#add-report" aria-current="add-report" aria-selected="false">
                                    Add report
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
                                        <div class="empty">
                                            <h4>Empty</h4>
                                            <p>nothing here</p>
                                        </div>
                                    </div>
                                    <div class="tab-panel fade collapse" id="add-report" role="tabpanel" aria-labelledby="nav-add-report">
                                        <div class="empty">
                                            <h4>Empty number 2</h4>
                                            <p>nothing here again</p>
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
                                <div class="empty">
                                    <h4>Empty</h4>
                                    <p>nothing here</p>
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
    } if (res === 'admin') {
        return `
        
        `;
    }
}
var CustomerController = function (CommonAjaxService) {

    var getCustomerGroupId = 0;
    var getRouteId = 0;
    var getAreaId = 0;

    var init = function () {

        getCustomerGroupId = $("#CustomerGroupId").val() || 0;
        getRouteId = $("#RouteId").val() || 0;
        getAreaId = $("#AreaId").val() || 0;

        GetCustomerGroupComboBox();
        GetRouteComboBox();
        GetAreaComboBox();


        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';

        if (parseInt(getId) == 0 && getOperation == '') {
            GetBranchList();
            GetGridDataList();
            
        };


        $('.btnsave').click('click', function () {
            var getId = $('#Id').val();
            var status = "Save";
            if (parseInt(getId) > 0) {
                status = "Update";
            }
            Confirmation("Are you sure? Do You Want to " + status + " Data?",
                function (result) {
                    if (result) {
                        save();
                    }
                });
        });


        $('.btnDelete').on('click', function () {

            Confirmation("Are you sure? Do You Want to Delete Data?",
                function (result) {
                    
                    if (result) {
                        SelectData();
                    }
                });
        });
        $('#CustomerAdvancePost').on('click', function () {

            Confirmation("Are you sure? Do You Want to Post Data?",
                function (result) {
                    
                    if (result) {
                        SelectCustomerAdvanceData();
                    }
                });
        });
        $('#CustomerCreditLimitPost').on('click', function () {

            Confirmation("Are you sure? Do You Want to Post Data?",
                function (result) {
                    
                    if (result) {
                        SelectCustomerCreditLimitData();
                    }
                });
        });

        $("#indexSearch").on('click', function () {
            var branchId = $("#Branchs").data("kendoComboBox").value();

            if (branchId == "") {
                ShowNotification(3, "Please Select Branch Name First!");
                return;
            }
            const gridElement = $("#GridDataList");
            if (gridElement.data("kendoGrid")) {
                gridElement.data("kendoGrid").destroy();
                gridElement.empty();
            }

            GetGridDataList();

        });

        $('#btnPrevious').click('click', function () {
            var getId = $('#Id').val();
            if (parseInt(getId) > 0) {
                window.location.href = "/DMS/Customer/NextPrevious?id=" + getId + "&status=Previous";
            }
        });
        $('#btnNext').click('click', function () {
            var getId = $('#Id').val();
            if (parseInt(getId) > 0) {
                window.location.href = "/DMS/Customer/NextPrevious?id=" + getId + "&status=Next";
            }
        });

        // Handle file input change to preview image
        $("#imageUpload").on("change", function (event) {
            $("#imageUpload").prop("disabled", true);
            var file = event.target.files[0];

            if (!file) {
                console.error("No file selected!");
                return;
            }

            var reader = new FileReader();

            reader.onload = function (e) {
                console.log("File loaded successfully!"); // Debugging

                // Update the preview image and make it visible
                $("#imagePreview").attr("src", e.target.result).show();
                $("#deleteImageBtn").show();
            };

            reader.onerror = function (error) {
                console.error("Error reading file:", error);
            };

            reader.readAsDataURL(file);
        });

        $("#deleteImageBtn").on("click", function () {
            $(this).addClass("clicked");
            $("#imagePreview").attr("src", "").hide(); // Hide preview
            $("#ImagePath").val(""); // Clear hidden field
            $("#deleteImageBtn").hide();
            $("#imageUpload").val("");// Hide delete button
            $("#imageUpload").prop("disabled", false);

        });

        var operation = $("#Operation").val();
        var imagePath = $("#ImagePath").val();
        if (operation == "update" && imagePath !== null) {
            
            $("#imageUpload").prop("disabled", true);
        };

        $("#btnCustomerAdvance").on('click', function () {
            GridDataListofCustomerAdvance();

        })
        $("#btnCustomerCreditLimit").on('click', function () {
            GridDataListofCustomerCreditLimit();

        })

    };

    function GetCustomerGroupComboBox() {
        var CampaignComboBox = $("#CustomerGroupId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [
                { field: "Code", title: "Code", width: 100 },
                { field: "Name", title: "Name", width: 150 },
            ],
            filter: "contains",
            filterFields: ["Code", "Name"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetCustomerGroupList"
                }
            },
            placeholder: "Select Customer Group",
            value: "",
            dataBound: function (e) {
                if (getCustomerGroupId) {
                    this.value(parseInt(getCustomerGroupId));
                }
            },
            change: function (e) {
                
            }
        }).data("kendoMultiColumnComboBox");
    };

    function GetRouteComboBox() {
        var CampaignComboBox = $("#RouteId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [
                { field: "Code", title: "Code", width: 100 },
                { field: "Name", title: "Name", width: 150 },
            ],
            filter: "contains",
            filterFields: ["Code", "Name"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetCustomerRouteList"
                }
            },
            placeholder: "Select Route",
            value: "",
            dataBound: function (e) {
                if (getRouteId) {
                    this.value(parseInt(getRouteId));
                }
            },
            change: function (e) {
                
            }
        }).data("kendoMultiColumnComboBox");
    };

    function GetAreaComboBox() {
        var CampaignComboBox = $("#AreaId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [
                { field: "Code", title: "Code", width: 100 },

                { field: "Name", title: "Name", width: 150 },

            ],
            filter: "contains",
            filterFields: ["Name"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetAreaList"
                }
            },
            placeholder: "Select Area",
            value: "",
            dataBound: function (e) {
                if (getAreaId) {
                    this.value(parseInt(getAreaId));
                }
            },
            change: function (e) {
                
            }
        }).data("kendoMultiColumnComboBox");
    };

    function SelectCustomerCreditLimitData() {

        var IDs = [];

        var selectedRows = $("#GridDataListofCustomerCreditLimit").data("kendoGrid").select();

        if (selectedRows.length === 0) {
            ShowNotification(3, "You are requested to Select checkbox!");
            return;
        }

        selectedRows.each(function () {
            var dataItem = $("#GridDataListofCustomerCreditLimit").data("kendoGrid").dataItem(this);
            IDs.push(dataItem.Id);
        });

        var model = {
            IDs: IDs
        };

        var filteredData = [];
        var dataSource = $("#GridDataListofCustomerCreditLimit").data("kendoGrid").dataSource;
        var rowData = dataSource.view().filter(x => IDs.includes(x.Id));
        //filteredData = rowData.filter(x => x.IsPost === "True" && IDs.includes(x.Id));
        filteredData = rowData.filter(x => x.IsPost === true && IDs.includes(x.Id));

        if (filteredData.length > 0) {
            ShowNotification(3, "Data has already been Posted.");
            return;
        }

        var url = "/DMS/CustomerCreditLimit/MultiplePost";

        CommonAjaxService.multiplePost(url, model, postDone, postfail);
    };
    function SelectCustomerAdvanceData() {

        var IDs = [];

        var selectedRows = $("#GridDataListofCustomerAdvance").data("kendoGrid").select();

        if (selectedRows.length === 0) {
            ShowNotification(3, "You are requested to Select checkbox!");
            return;
        }

        selectedRows.each(function () {
            var dataItem = $("#GridDataListofCustomerAdvance").data("kendoGrid").dataItem(this);
            IDs.push(dataItem.Id);
        });

        var model = {
            IDs: IDs
        };

        var filteredData = [];
        var dataSource = $("#GridDataListofCustomerAdvance").data("kendoGrid").dataSource;
        var rowData = dataSource.view().filter(x => IDs.includes(x.Id));
        //filteredData = rowData.filter(x => x.IsPost === "True" && IDs.includes(x.Id));
        filteredData = rowData.filter(x => x.IsPost === true && IDs.includes(x.Id));

        if (filteredData.length > 0) {
            ShowNotification(3, "Data has already been Posted.");
            return;
        }

        var url = "/DMS/CustomerAdvance/MultiplePost";

        CommonAjaxService.multiplePost(url, model, customerAdvancePostDone, customerAdvancePostfail);
    };
    function customerAdvancePostDone(result) {

        var grid = $('#GridDataListofCustomerAdvance').data('kendoGrid');
        if (grid) {
            grid.dataSource.read();
        }
        if (result.Status == 200) {
            ShowNotification(1, result.Message);
            $(".btnsave").hide();
            $(".btnPost").hide();
            $(".sslPush").show();
        }
        else if (result.Status == 400) {
            ShowNotification(3, result.Message);
        }
        else {
            ShowNotification(2, result.Message);
        }
    };
    function customerAdvancePostfail(err) {

        console.log(err);
        ShowNotification(3, "Something gone wrong");
    };
    function postDone(result) {

        var grid = $('#GridDataListofCustomerCreditLimit').data('kendoGrid');
        if (grid) {
            grid.dataSource.read();
        }
        if (result.Status == 200) {
            ShowNotification(1, result.Message);
            $(".btnsave").hide();
            $(".btnPost").hide();
            $(".sslPush").show();
        }
        else if (result.Status == 400) {
            ShowNotification(3, result.Message);
        }
        else {
            ShowNotification(2, result.Message);
        }
    };
    function postfail(err) {

        console.log(err);
        ShowNotification(3, "Something gone wrong");
    };
    function SelectData() {
        
        var IDs = [];

        var selectedRows = $("#GridDataList").data("kendoGrid").select();

        if (selectedRows.length === 0) {
            ShowNotification(3, "You are requested to Select checkbox!");
            return;
        }

        selectedRows.each(function () {
            var dataItem = $("#GridDataList").data("kendoGrid").dataItem(this);
            IDs.push(dataItem.Id);
        });

        var model = {
            IDs: IDs
        };

        var url = "/DMS/Customer/Delete";

        CommonAjaxService.deleteData(url, model, deleteDone, saveFail);
    };

    var GetGridDataList = function () {
        
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            autoSync: true,
            pageSize: 10,
            transport: {
                read: {
                    url: "/DMS/CustomerJournal/GetGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false
                },
                parameterMap: function (options) {
                    
                    if (options.sort) {
                        options.sort.forEach(function (param) {
                            if (param.field === "Code") {
                                param.field = "H.Code";
                            }
                            if (param.field === "Name") {
                                param.field = "H.Name";
                            }

                            if (param.field === "Comments") {
                                param.field = "H.Comments";
                            }
                            if (param.field === "Status") {
                                param.field = "H.IsActive";
                            }
                        });
                    }

                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (param) {
                            if (param.field === "Code") {
                                param.field = "H.Code";
                            }
                            if (param.field === "Name") {
                                param.field = "H.Name";
                            }

                            if (param.field === "Comments") {
                                param.field = "H.Comments";
                            }
                            if (param.field === "Status") {
                                param.field = "H.IsActive";
                            }
                        });
                    }
                    return options;
                }
            },
            batch: true,
            schema: {
                data: "Items",
                total: "TotalCount"
            }
        });

        $("#GridDataList").kendoGrid({
            dataSource: gridDataSource,
            pageable: {
                refresh: true,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true,
                pageSizes: [10, 20, 50, "all"]
            },
            noRecords: true,
            messages: {
                noRecords: "No Record Found!"
            },
            scrollable: true,
            filterable: {
                extra: true,
                operators: {
                    string: {
                        startswith: "Starts with",
                        endswith: "Ends with",
                        contains: "Contains",
                        doesnotcontain: "Does not contain",
                        eq: "Is equal to",
                        neq: "Is not equal to",
                        gt: "Is greater than",
                        lt: "Is less than"
                    }
                }
            },
            sortable: true,
            resizable: true,
            reorderable: true,
            groupable: true,
            toolbar: ["excel", "pdf"],
            excel: {
                fileName: "Customers.xlsx",
                filterable: true
            },
            pdf: {
                fileName: `Customers_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`,
                allPages: true,
                avoidLink: true,
                filterable: true
            },
            pdfExport: function (e) {
                
                $(".k-grid-toolbar").hide();
                $(".k-grouping-header").hide();
                $(".k-floatwrap").hide();

                

                var branchName = "All Branch Name";
                var companyName = "All Company Name";
                var companyAddress = "All Company Address";

                var grid = e.sender;

                // Hide the "Action" and checkbox columns
                var actionColumnIndex = grid.columns.findIndex(col => col.title === "Action");
                var selectionColumnIndex = grid.columns.findIndex(col => col.selectable === true);

                if (actionColumnIndex == 0 || actionColumnIndex > 0) {
                    var actionVisibility = [
                        grid.columns[actionColumnIndex].hidden,
                    ];

                    grid.hideColumn(actionColumnIndex);
                }
                if (selectionColumnIndex == 0 || selectionColumnIndex > 0) {
                    var selectableVisibility = [
                        grid.columns[selectionColumnIndex].hidden
                    ];

                    grid.hideColumn(selectionColumnIndex);
                }


                var fileName = `Customers_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`;

                var numberOfColumns = e.sender.columns.filter(column => !column.hidden && column.field).length;
                var columnWidth = 100;
                var totalWidth = numberOfColumns * columnWidth;

                e.sender.options.pdf = {
                    //paperSize: [totalWidth, 2800],
                    paperSize: "A2",
                    margin: { top: "4cm", left: "1cm", right: "1cm", bottom: "4cm" },
                    landscape: true,
                    allPages: true,
                    template: `
                            <div style="position: absolute; top: 1cm; left: 1cm; right: 1cm; text-align: center; font-size: 12px; font-weight: bold;">
                                <div>Branch Name :- ${branchName}</div>
                                <div>Company Name :- ${companyName}</div>
                                <div>Company Address :- ${companyAddress}</div>
                            </div> `
                };

                e.sender.options.pdf.fileName = fileName;

                setTimeout(function () {
                    window.location.reload();
                }, 1000);
            },
            columns: [
                {
                    selectable: true, width: 35
                },
                {
                    title: "Action",
                    width: 170,
                    template: function (dataItem) {
                        
                        return `
            <a href="/DMS/Customer/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit" title="Edit Credit Limit">
                <i class="fas fa-pencil-alt"></i>
            </a>
           <a href="/DMS/CustomerCreditLimit/Index/${dataItem.Id}?Name=${encodeURIComponent(dataItem.Name)}&Code=${encodeURIComponent(dataItem.Code)}"
   class="btn btn-success btn-sm mr-2" 
   title="View Credit Limit Details">
   <i class="fas fa-th-list"></i>
</a>
            <a href="/DMS/CustomerAdvance/Index/${dataItem.Id}?Name=${encodeURIComponent(dataItem.Name)}&Code=${encodeURIComponent(dataItem.Code)}" class="btn bg-info btn-sm mr-2" title="View Advance">
                <i class="fas fa-th-list"></i>
            </a>
            <a style='background-color: darkgreen;' href='#' onclick='ReportPreview(${dataItem.Id})' class='btn btn-success btn-sm mr-2 edit' title='Report Preview'>
                        <i class='fas fa-print'></i>
            </a>`;
                    }
                },
                { field: "Id", width: 50, hidden: true, sortable: true },
                { field: "Code", title: "Code", width: 150, sortable: true },
                { field: "Name", title: "Name", sortable: true, width: 200 },
                { field: "CustomerGroupName", title: "Customer Group Name", sortable: true, width: 200 },
                { field: "RouteName", title: "Route Name", sortable: true, width: 200 },
                { field: "AreaName", title: "Area Name", sortable: true, width: 200 },
                { field: "TelephoneNo", title: "Telephone No.", sortable: true, width: 200 },
                { field: "Email", title: "Email", sortable: true, width: 200 },
                { field: "TINNo", title: "TIN No.", sortable: true, width: 200 },
                { field: "BINNo", title: "BIN No.", sortable: true, width: 200 },
                { field: "NIDNo", title: "NID No.", sortable: true, width: 200 },
                { field: "Comments", title: "Comments", sortable: true, width: 200 },
                { field: "BranchName", title: "Branch Name", sortable: true, width: 200 },
                {
                    field: "Status", title: "Status", sortable: true, width: 100,
                    filterable: {
                        ui: function (element) {
                            element.kendoDropDownList({
                                dataSource: [
                                    { text: "Active", value: "1" },
                                    { text: "Inactive", value: "0" }
                                ],
                                dataTextField: "text",
                                dataValueField: "value",
                                optionLabel: "Select Option"
                            });
                        }
                    }
                }
            ],
            editable: false,
            selectable: "multiple row",
            navigatable: true,
            columnMenu: true
        });

    };


    var GridDataListofCustomerAdvance = function () {
        
        var getCustomerId = $("#Id").val();
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            autoSync: true,
            pageSize: 10,
            transport: {
                read: {
                    url: "/DMS/CustomerAdvance/GetGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false,
                    data: { getCustomerId: getCustomerId }
                },
                parameterMap: function (options) {
                    
                    if (options.sort) {
                        options.sort.forEach(function (param) {
                            if (param.field === "Id") {
                                param.field = "H.Id";
                            }

                            if (param.field === "AdvanceEntryDate") {
                                param.field = "H.AdvanceEntryDate";
                            }
                            if (param.field === "AdvanceAmount") {
                                param.field = "H.AdvanceAmount";
                            }
                            if (param.field === "PaymentDate") {
                                param.field = "H.PaymentDate";
                            }
                            if (param.field === "DocumentNo") {
                                param.field = "H.DocumentNo";
                            }
                            if (param.field === "BankName") {
                                param.field = "H.BankName";
                            }
                            if (param.field === "CustomerName") {
                                param.field = "C.Name";
                            }
                            if (param.field === "Status") {
                                param.field = "H.IsPost";
                            }
                        });
                    }

                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (param) {
                            if (param.field === "Id") {
                                param.field = "H.Id";
                            }
                            if (param.field === "AdvanceEntryDate") {
                                param.field = "H.AdvanceEntryDate";
                            }
                            if (param.field === "AdvanceAmount") {
                                param.field = "H.AdvanceAmount";
                            }
                            if (param.field === "PaymentDate") {
                                param.field = "H.PaymentDate";
                            }
                            if (param.field === "DocumentNo") {
                                param.field = "H.DocumentNo";
                            }
                            if (param.field === "BankName") {
                                param.field = "H.BankName";
                            }
                            if (param.field === "CustomerName") {
                                param.field = "C.Name";
                            }
                            if (param.field === "Status") {
                                param.field = "H.IsPost";
                            }
                        });
                    }
                    return options;
                }
            },
            batch: true,
            schema: {
                data: "Items",
                total: "TotalCount"
            }
        });


        $("#GridDataListofCustomerAdvance").kendoGrid({
            dataSource: gridDataSource,
            pageable: {
                refresh: true,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true,
                pageSizes: [10, 20, 50, "all"]
            },
            noRecords: true,
            messages: {
                noRecords: "No Record Found!"
            },
            scrollable: true,
            filterable: {
                extra: true,
                operators: {
                    string: {
                        startswith: "Starts with",
                        endswith: "Ends with",
                        contains: "Contains",
                        doesnotcontain: "Does not contain",
                        eq: "Is equal to",
                        neq: "Is not equal to",
                        gt: "Is greater than",
                        lt: "Is less than"
                    }
                }
            },
            sortable: true,
            resizable: true,
            reorderable: true,
            groupable: true,
            toolbar: ["excel", "pdf", "search"],
            search: ["CustomerName", "BankName", "DocumentNo"],
            excel: {
                fileName: "Products.xlsx",
                filterable: true
            },
            pdf: {
                fileName: `Products_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`,
                allPages: true,
                avoidLink: true,
                filterable: true
            },
            pdfExport: function (e) {
                
                $(".k-grid-toolbar").hide();
                $(".k-grouping-header").hide();
                $(".k-floatwrap").hide();

                

                var branchName = "All Branch Name";
                var companyName = "All Company Name";
                var companyAddress = "All Company Address";

                var grid = e.sender;

                // Hide the "Action" and checkbox columns
                var actionColumnIndex = grid.columns.findIndex(col => col.title === "Action");
                var selectionColumnIndex = grid.columns.findIndex(col => col.selectable === true);

                if (actionColumnIndex == 0 || actionColumnIndex > 0) {
                    var actionVisibility = [
                        grid.columns[actionColumnIndex].hidden,
                    ];

                    grid.hideColumn(actionColumnIndex);
                }
                if (selectionColumnIndex == 0 || selectionColumnIndex > 0) {
                    var selectableVisibility = [
                        grid.columns[selectionColumnIndex].hidden
                    ];

                    grid.hideColumn(selectionColumnIndex);
                }


                var fileName = `Products_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`;

                var numberOfColumns = e.sender.columns.filter(column => !column.hidden && column.field).length;
                var columnWidth = 100;
                var totalWidth = numberOfColumns * columnWidth;

                e.sender.options.pdf = {
                    //paperSize: [totalWidth, 2800],
                    paperSize: "A2",
                    margin: { top: "4cm", left: "1cm", right: "1cm", bottom: "4cm" },
                    landscape: true,
                    allPages: true,
                    template: `
                            <div style="position: absolute; top: 1cm; left: 1cm; right: 1cm; text-align: center; font-size: 12px; font-weight: bold;">
                                <div>Branch Name :- ${branchName}</div>
                                <div>Company Name :- ${companyName}</div>
                                <div>Company Address :- ${companyAddress}</div>
                            </div> `
                };

                e.sender.options.pdf.fileName = fileName;

                setTimeout(function () {
                    window.location.reload();
                }, 1000);
            },
            columns: [
                {
                    selectable: true, width: 30
                },
                {
                    title: "Action",
                    width: 60,
                    template: function (dataItem) {
                        
                        
                        return `
                                <a href="/DMS/CustomerAdvance/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                                    <i class="fas fa-pencil-alt"></i>
                                </a>`;
                    }
                },

                { field: "Id", width: 50, hidden: true, sortable: true },
                { field: "CustomerName", title: "Customer", sortable: true, width: 200 },
                { field: "BankName", title: "Bank Name", sortable: true, width: 200 },
                {
                    field: "AdvanceEntryDate", title: "Advance Entry Date", sortable: true, width: 150, template: '#= kendo.toString(kendo.parseDate(AdvanceEntryDate), "yyyy-MM-dd") #',
                    filterable:
                    {
                        ui: "datepicker"
                    }
                },
                { field: "AdvanceAmount", title: "Advance Amount", sortable: true, width: 200 },
                {
                    field: "PaymentDate", title: "Payment Date", sortable: true, width: 150, template: '#= kendo.toString(kendo.parseDate(PaymentDate), "yyyy-MM-dd") #',
                    filterable:
                    {
                        ui: "datepicker"
                    }
                },
                { field: "DocumentNo", title: "Document No.", sortable: true, width: 200 },
                {
                    field: "Status", title: "Status", sortable: true, width: 100,
                    filterable: {
                        ui: function (element) {
                            element.kendoDropDownList({
                                dataSource: [
                                    { text: "Posted", value: "1" },
                                    { text: "Not-posted", value: "0" }
                                ],
                                dataTextField: "text",
                                dataValueField: "value",
                                optionLabel: "Select Option"
                            });
                        }
                    }
                }


            ],
            editable: false,
            selectable: "multiple row",
            navigatable: true,
            columnMenu: true
        });





    };


    var GridDataListofCustomerCreditLimit = function () {
        
        var getCustomerId = $("#Id").val();
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            autoSync: true,
            pageSize: 10,
            transport: {
                read: {
                    url: "/DMS/CustomerCreditLimit/GetGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false,
                    data: { getCustomerId: getCustomerId }
                },
                parameterMap: function (options) {
                    
                    if (options.sort) {
                        options.sort.forEach(function (param) {
                            if (param.field === "Id") {
                                param.field = "H.Id";
                            }
                            if (param.field === "CustomerName") {
                                param.field = "C.Name";
                            }
                            if (param.field === "BranchName") {
                                param.field = "BF.Name";
                            }

                            if (param.field === "LimitEntryDate") {
                                param.field = "H.LimitEntryDate";
                            }
                            if (param.field === "CreditLimit") {
                                param.field = "H.CreditLimit";
                            }
                            if (param.field === "Status") {
                                param.field = "H.IsPost";
                            }


                        });
                    }

                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (param) {
                            if (param.field === "Id") {
                                param.field = "H.Id";
                            }
                            if (param.field === "CustomerName") {
                                param.field = "C.Name";
                            }
                            if (param.field === "BranchName") {
                                param.field = "BF.Name";
                            }
                            if (param.field === "LimitEntryDate") {
                                param.field = "H.LimitEntryDate";
                            }
                            if (param.field === "CreditLimit") {
                                param.field = "H.CreditLimit";
                            }
                            if (param.field === "Status") {
                                param.field = "H.IsPost";
                            }

                        });
                    }
                    return options;
                }
            },
            batch: true,
            schema: {
                data: "Items",
                total: "TotalCount"
            }
        });


        $("#GridDataListofCustomerCreditLimit").kendoGrid({
            dataSource: gridDataSource,
            pageable: {
                refresh: true,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true,
                pageSizes: [10, 20, 50, "all"]
            },
            noRecords: true,
            messages: {
                noRecords: "No Record Found!"
            },
            scrollable: true,
            filterable: {
                extra: true,
                operators: {
                    string: {
                        startswith: "Starts with",
                        endswith: "Ends with",
                        contains: "Contains",
                        doesnotcontain: "Does not contain",
                        eq: "Is equal to",
                        neq: "Is not equal to",
                        gt: "Is greater than",
                        lt: "Is less than"
                    }
                }
            },
            sortable: true,
            resizable: true,
            reorderable: true,
            groupable: true,
            toolbar: ["excel", "pdf", "search"],
            search: ["CustomerName", "BranchName", "LimitEntryDate", "CreditLimit"],
            excel: {
                fileName: "Products.xlsx",
                filterable: true
            },
            pdf: {
                fileName: `Products_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`,
                allPages: true,
                avoidLink: true,
                filterable: true
            },
            pdfExport: function (e) {
                
                $(".k-grid-toolbar").hide();
                $(".k-grouping-header").hide();
                $(".k-floatwrap").hide();

                

                var branchName = "All Branch Name";
                var companyName = "All Company Name";
                var companyAddress = "All Company Address";

                var grid = e.sender;

                // Hide the "Action" and checkbox columns
                var actionColumnIndex = grid.columns.findIndex(col => col.title === "Action");
                var selectionColumnIndex = grid.columns.findIndex(col => col.selectable === true);

                if (actionColumnIndex == 0 || actionColumnIndex > 0) {
                    var actionVisibility = [
                        grid.columns[actionColumnIndex].hidden,
                    ];

                    grid.hideColumn(actionColumnIndex);
                }
                if (selectionColumnIndex == 0 || selectionColumnIndex > 0) {
                    var selectableVisibility = [
                        grid.columns[selectionColumnIndex].hidden
                    ];

                    grid.hideColumn(selectionColumnIndex);
                }


                var fileName = `Products_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`;

                var numberOfColumns = e.sender.columns.filter(column => !column.hidden && column.field).length;
                var columnWidth = 100;
                var totalWidth = numberOfColumns * columnWidth;

                e.sender.options.pdf = {
                    //paperSize: [totalWidth, 2800],
                    paperSize: "A2",
                    margin: { top: "4cm", left: "1cm", right: "1cm", bottom: "4cm" },
                    landscape: true,
                    allPages: true,
                    template: `
                            <div style="position: absolute; top: 1cm; left: 1cm; right: 1cm; text-align: center; font-size: 12px; font-weight: bold;">
                                <div>Branch Name :- ${branchName}</div>
                                <div>Company Name :- ${companyName}</div>
                                <div>Company Address :- ${companyAddress}</div>
                            </div> `
                };

                e.sender.options.pdf.fileName = fileName;

                setTimeout(function () {
                    window.location.reload();
                }, 1000);
            },
            columns: [
                {
                    selectable: true, width: 30
                },
                {
                    title: "Action",
                    width: 50,
                    template: function (dataItem) {
                        
                        
                        return `
                                <a href="/DMS/CustomerCreditLimit/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                                    <i class="fas fa-pencil-alt"></i>
                                </a>`;
                    }
                },

                { field: "Id", width: 50, hidden: true, sortable: true },
                { field: "CustomerName", title: "Customer", sortable: true, width: 200 },
                { field: "BranchName", title: "Branch", sortable: true, width: 200 },
                {
                    field: "LimitEntryDate", title: "Limit Entry Date", sortable: true, width: 200, template: '#= kendo.toString(kendo.parseDate(LimitEntryDate), "yyyy-MM-dd") #', filterable: {
                        ui: "datepicker"
                    }
                },
                { field: "CreditLimit", title: "CreditLimit", sortable: true, width: 200 },
                {
                    field: "Status", title: "Status", sortable: true, width: 100,
                    filterable: {
                        ui: function (element) {
                            element.kendoDropDownList({
                                dataSource: [
                                    { text: "Posted", value: "1" },
                                    { text: "Not-posted", value: "0" }
                                ],
                                dataTextField: "text",
                                dataValueField: "value",
                                optionLabel: "Select Option"
                            });
                        }
                    }
                }


            ],
            editable: false,
            selectable: "multiple row",
            navigatable: true,
            columnMenu: true
        });



    };


    function save() {
        var validator = $("#frmEntry").validate();
        var formData = new FormData();
        var model = serializeInputs("frmEntry");

        var result = validator.form();

        if (!result) {
            validator.focusInvalid();
            return;
        }

        // Append form fields to FormData
        for (var key in model) {
            formData.append(key, model[key]);
        }

        // Handle checkbox value
        formData.append("IsActive", $('#IsActive').prop('checked'));

        if (parseInt(model.CustomerGroupId) == 0) {
            ShowNotification(3, 'Customer Group is Required.');
            return;
        }
        if (parseInt(model.RouteId) == 0) {
            ShowNotification(3, 'Route is Required.');
            return;
        }
        if (parseInt(model.AreaId) == 0) {
            ShowNotification(3, 'Area is Required.');
            return;
        }

        // Check if delete button was clicked to remove image
        var deleteImageClicked = $("#deleteImageBtn").hasClass("clicked");
        if (deleteImageClicked) {
            formData.append("ImagePath", "");  // Mark image for deletion
            $("#imagePreview").remove();
            $("#ImagePath").val("");
        }

        var fileInput = document.getElementById("imageUpload");
        if (fileInput.files.length > 0) {
            var file = fileInput.files[0];

            // ✅ Validate file size (Max 25MB)
            if (file.size > 26214400) { // 25MB in bytes
                ShowNotification(3, "Image size cannot exceed 25MB.");
                return;
            }

            formData.append("file", file);
        } else if (!deleteImageClicked) {
            var existingImagePath = $("#ImagePath").val();
            if (existingImagePath) {
                formData.append("ImagePath", existingImagePath);
            }
        }

        var url = "/DMS/Customer/CreateEdit";

        CommonAjaxService.finalImageSave(url, formData, saveDone, saveFail);
    };

    // Handle the image delete button click

    function saveDone(result) {
        
        if (result.Status == 200) {

            if (result.Data.Operation == "add") {
                ShowNotification(1, result.Message);
                $(".divSave").hide();
                $(".divUpdate").show();
                $("#Code").val(result.Data.Code);
                $("#Id").val(result.Data.Id);
                $("#Operation").val("update");
                $("#CreatedBy").val(result.Data.CreatedBy);
                $("#CreatedOn").val(result.Data.CreatedOn);
            }
            else {
                ShowNotification(1, result.Message);
                $("#LastModifiedBy").val(result.Data.LastModifiedBy);
                $("#LastModifiedOn").val(result.Data.LastModifiedOn);
                setTimeout(function () {
                    location.reload();
                }, 700);

                $("#imageUpload").prop("disabled", true);
            }

            if (result.Data.ImagePath) {
                var imagePath = result.Data.ImagePath;
                if (!imagePath.startsWith("http") && !imagePath.startsWith("/")) {
                    imagePath = "/" + imagePath; // Ensure it starts with "/"
                }
                $("#imagePreview").attr("src", imagePath + "?t=" + new Date().getTime()).show();
                $("#deleteImageBtn").show();
                $("#ImagePath").val(imagePath); // Update hidden field with new path
            }
            else {
                $("#imagePreview").hide();
                $("#deleteImageBtn").hide();
            }
        }
        else if (result.Status == 400) {
            ShowNotification(3, result.Message);
        }
        else {
            ShowNotification(2, result.Message);
        }
    }

    function GetBranchList() {
        var branch = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/Common/Common/GetBranchList?value=",
                    dataType: "json",
                    success: function (data) {

                        for (var i = 0; i < data.length; i++) {
                            if (data[i].Id === 0 && data[i].Code === 'N/A') {
                                data[i].Id = '';
                                data[i].Name = 'All';
                            }
                        }
                        branch.data(data);
                    }
                }
            }
        });

        $("#Branchs").kendoComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            dataSource: branch,
            filter: "contains",
            suggest: true
        });
    };
    function saveFail(result) {
        
        
        ShowNotification(3, "Query Exception!");
    };


    function deleteDone(result) {
        
        var grid = $('#GridDataList').data('kendoGrid');
        if (grid) {
            grid.dataSource.read();
        }
        if (result.Status == 200) {
            ShowNotification(1, result.Message);
        }
        else if (result.Status == 400) {
            ShowNotification(3, result.Message);
        }
        else {
            ShowNotification(2, result.Message);
        }
    };

    function fail(err) {
        
        
        ShowNotification(3, "Something gone wrong");
    };

    return {
        init: init
    }


}(CommonAjaxService);

function ReportPreview(id) {
    
    const form = document.createElement('form');
    form.method = 'post';
    form.action = '/DMS/CustomerJournal/ReportPreview';
    form.target = '_blank';
    const inputVal = document.createElement('input');
    inputVal.type = 'hidden';
    inputVal.name = 'Id';
    inputVal.value = id;

    form.appendChild(inputVal);

    document.body.appendChild(form);

    form.submit();
    form.remove();

};

function DevitCredit(branchId,FromDate,ToDate) {

    const form = document.createElement('form');
    form.method = 'post';
    form.action = '/DMS/Customer/DevitCredit';
    form.target = '_blank';
    const inputVal = document.createElement('input');
    inputVal.type = 'hidden';
    inputVal.name = 'Id';
    inputVal.value = id;

    form.appendChild(inputVal);

    document.body.appendChild(form);

    form.submit();
    form.remove();

};


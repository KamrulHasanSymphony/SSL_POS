var BranchProfileController = function (CommonService, CommonAjaxService) {
    var getEnumTypeId = 0;
    var getAreaId = 0;
    var getParentId = 0;
    var getName = "";

    var init = function () {

        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';

        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();
        };

        getEnumTypeId = $("#EnumTypeId").val() || 0;
        getAreaId = $("#AreaId").val() || 0;
        getParentId = $("#ParentId").val() || 0;
        getName = $("#Name").val() || 0;
        GetBranchProfileComboBox();
        GetAreaComboBox();
        if (getOperation == 'add') {
            
            GetParentComboBox();
        }
        else if (getOperation == "update") {
            
            GetUpdateParentComboBox(getName);
        }


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

        $('#btnPrevious').click('click', function () {
            var getId = $('#Id').val();
            if (parseInt(getId) > 0) {
                window.location.href = "/DMS/BranchProfile/NextPrevious?id=" + getId + "&status=Previous";
            }
        });
        $('#btnNext').click('click', function () {
            var getId = $('#Id').val();
            if (parseInt(getId) > 0) {
                window.location.href = "/DMS/BranchProfile/NextPrevious?id=" + getId + "&status=Next";
            }
        });


        $('#btnBranchAdvance').on('click', function () {
            GetGridDataListofBranchAdvance()
        });

        $('#btnBranchCreditLimit').on('click', function () {
            GetGridDataListofBranchCreditLimit()
        });


    };

    function GetBranchProfileComboBox() {
        var BranchProfileComboBox = $("#EnumTypeId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [
                { field: "Name", title: "Enum Name", width: 150 },
            ],
            filter: "contains",
            filterFields: ["Id", "Name"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetBranchProfileList?value=Branch"
                }
            },
            placeholder: "Select Type ", // Set the placeholder
            value: "",
            dataBound: function (e) {
                
                if (getEnumTypeId) {
                    this.value(parseInt(getEnumTypeId));
                }
            },
            change: function (e) {
                
            }
        }).data("kendoMultiColumnComboBox");
    };

    function GetAreaComboBox() {
        var AreaComboBox = $("#AreaId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            //dataValueField: "Id",
            height: 400,
            columns: [
                { field: "Name", title: "Name", width: 150 },
                { field: "ZipCode", title: "ZipCode", width: 100 },
                { field: "ThanaId", title: "ThanaId", width: 100 },

            ],
            filter: "contains",
            filterFields: ["Name"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetAreaList"
                }
            },
            placeholder: "Select Area ", // Set the placeholder
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

    function GetParentComboBox() {
        var ParentComboBox = $("#ParentId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [
                { field: "Id", title: "Id", width: 100 },
                { field: "Code", title: "Code", width: 100 },
                { field: "Name", title: "Name", width: 150 },
                { field: "Email", title: "Email", width: 150 },

            ],
            filter: "contains",
            filterFields: ["Code", "Name"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetBranchList"
                }
            },
            placeholder: "Select Parent ", 
            value: "",
            dataBound: function (e) {
                
                if (getParentId) {
                    this.value(parseInt(getParentId));
                }
            },

        }).data("kendoMultiColumnComboBox");
    };

    function GetUpdateParentComboBox(getName) {
        var ParentComboBox = $("#ParentId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [
                { field: "Id", title: "Id", width: 100 },
                { field: "Code", title: "Code", width: 100 },
                { field: "Name", title: "Name", width: 150 },
                { field: "Email", title: "Email", width: 150 },

            ],
            filter: "contains",
            filterFields: ["Code", "Name"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetBranchList"
                },
                schema: {
                    parse: function (response) {
                        return response.filter(item => item.Name !== getName);
                    }
                }
            },
            placeholder: "Select Parent ",
            value: "",
            dataBound: function (e) {

                if (getParentId) {
                    this.value(parseInt(getParentId));
                }
            },

        }).data("kendoMultiColumnComboBox");
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

        var url = "/DMS/BranchProfile/Delete";

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
                    url: "/DMS/BranchProfile/GetGridData",
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
                            if (param.field === "BanglaName") {
                                param.field = "H.BanglaName";
                            }
                            if (param.field === "DistributorCode") {
                                param.field = "H.DistributorCode";
                            }
                            if (param.field === "TelephoneNo") {
                                param.field = "H.TelephoneNo";
                            }

                            if (param.field === "AreaName") {
                                param.field = "A.Name";
                            }
                            if (param.field === "Email") {
                                param.field = "H.Email";
                            }
                            if (param.field === "VATRegistrationNo") {
                                param.field = "H.VATRegistrationNo";
                            }
                            if (param.field === "BIN") {
                                param.field = "H.BIN";
                            }

                            if (param.field === "TINNO") {
                                param.field = "H.TINNO";
                            }
                            if (param.field === "Comments") {
                                param.field = "H.Comments";
                            }

                            if (param.field === "Status") {
                                let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";

                                if (statusValue.startsWith("a")) {
                                    param.value = 1;
                                } else if (statusValue.startsWith("i")) {
                                    param.value = 0;
                                } else {
                                    param.value = null;
                                }

                                param.field = "H.IsActive";
                                param.operator = "eq";
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
                            if (param.field === "BanglaName") {
                                param.field = "H.BanglaName";
                            }
                            if (param.field === "DistributorCode") {
                                param.field = "H.DistributorCode";
                            }
                            if (param.field === "TelephoneNo") {
                                param.field = "H.TelephoneNo";
                            }

                            if (param.field === "AreaName") {
                                param.field = "A.Name";
                            }
                            if (param.field === "Email") {
                                param.field = "H.Email";
                            }
                            if (param.field === "VATRegistrationNo") {
                                param.field = "H.VATRegistrationNo";
                            }
                            if (param.field === "BIN") {
                                param.field = "H.BIN";
                            }

                            if (param.field === "TINNO") {
                                param.field = "H.TINNO";
                            }
                            if (param.field === "Comments") {
                                param.field = "H.Comments";
                            }

                            if (param.field === "Status") {
                                let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";

                                if (statusValue.startsWith("a")) {
                                    param.value = 1;
                                } else if (statusValue.startsWith("i")) {
                                    param.value = 0;
                                }
                                else if (statusValue == "1") {
                                    param.value = 1;
                                }
                                else if (statusValue == "0") {
                                    param.value = 0;
                                }
                                else {
                                    param.value = null;
                                }

                                param.field = "H.IsActive";
                                param.operator = "eq";
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
            toolbar: ["excel", "pdf", "search"],
            search: {
                fields: ["Code", "Name","BanglaName", "AreaName", "Email", "Comments", "Status", "VATRegistrationNo", "BIN","TINNO"]
            },
            excel: {
                fileName: "BranchProfile.xlsx",
                filterable: true
            },
            columns: [
                {
                    selectable: true, width: 40
                },
                {
                    title: "Action",
                    width: 170,
                    template: function (dataItem) {
                        
                        return `
                                <a href="/DMS/BranchProfile/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                                    <i class="fas fa-pencil-alt"></i></a>
                                    <a href="/DMS/BranchCreditLimit/Index/${dataItem.Id}" class="btn btn-success btn-sm mr-2" title="Branch Credit Limit List">
                                 <i class="fas fa-th-list"></i>
                                   </a> <a class='btn bg-info btn-sm mr-2' title='Branch Advance List' href='/DMS/BranchAdvance/Index/${dataItem.Id}'>
                                    <i class='fas fa-th-list'></i>
                                </a>
                                 <a style='background-color: darkgreen;' href='#' onclick='ReportPreview(${dataItem.Id})' class='btn btn-success btn-sm mr-2 edit' title='Report Preview'>
                                    <i class='fas fa-print'></i>
                                </a>
                                `;
                    }
                },
                { field: "Id", width: 50, hidden: true, sortable: true },
                { field: "Code", title: "Branch Code", width: 130, sortable: true },
                { field: "DistributorCode", title: "Distributor Code", sortable: true, width: 150 },
                { field: "Name", title: "Distributor Name", sortable: true, width: 200 },
                { field: "BanglaName", title: "Distributor Bangla Name", sortable: true, width: 200 },
                { field: "AreaName", title: "Area Name", sortable: true, width: 200 },
                { field: "TelephoneNo", title: "Telephone No.", sortable: true, width: 130 },
                { field: "VATRegistrationNo", title: "VAT Registration No.", sortable: true, width: 180 },
                { field: "BIN", title: "BIN", sortable: true, width: 130 },
                { field: "TINNO", title: "TIN No.", width: 130, sortable: true },
                { field: "Email", title: "Email", width: 250, sortable: true },
                { field: "Comments", title: "Comments", sortable: true, width: 200 },

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

    var GetGridDataListofBranchAdvance = function () {
        var getBranchId = $("#Id").val()
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
                    url: "/DMS/BranchAdvance/GetGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false,
                    data: { getBranchId: getBranchId }
                },
                parameterMap: function (options) {
                    if (options.sort) {
                        options.sort.forEach(function (param) {
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
                            if (param.field === "Status") {
                                param.field = "H.IsPost";
                            }

                        });
                    }

                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (param) {
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

        $("#GridDataListofBranchAdvance").kendoGrid({
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
            search: {
                fields: ["AdvanceEntryDate", "AdvanceAmount", "PaymentDate"]
            },
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
                    selectable: true, width: 50
                },
                {
                    title: "Action",
                    width: 90,
                    template: function (dataItem) {
                        
                        return `
                                <a href="/DMS/BranchAdvance/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                                    <i class="fas fa-pencil-alt"></i>
                                </a>`;
                    }
                },

                { field: "Id", width: 50, hidden: true, sortable: true },

                {
                    field: "AdvanceEntryDate", title: "Advance Entry Date", sortable: true, width: 135, template: '#= kendo.toString(kendo.parseDate(AdvanceEntryDate), "yyyy-MM-dd") #',
                    filterable:
                    {
                        ui: "datepicker"
                    }
                },
                { field: "AdvanceAmount", title: "Advance Amount", sortable: true, width: 200 },

                {
                    field: "PaymentDate", title: "Payment Date", sortable: true, width: 135, template: '#= kendo.toString(kendo.parseDate(PaymentDate), "yyyy-MM-dd") #',
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


    var GetGridDataListofBranchCreditLimit = function () {
        var getBranchId = $("#Id").val()
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
                    url: "/DMS/BranchCreditLimit/GetGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false,
                    data: { getBranchId: getBranchId }
                },
                parameterMap: function (options) {
                    if (options.sort) {
                        options.sort.forEach(function (param) {
                            if (param.field === "Id") {
                                param.field = "H.Id";
                            }
                            if (param.field === "LimitEntryDate") {
                                param.field = "H.LimitEntryDate";
                            }
                            if (param.field === "SelfCreditLimit") {
                                param.field = "H.SelfCreditLimit";
                            }
                            if (param.field === "OtherCreditLimit") {
                                param.field = "H.OtherCreditLimit";
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
                            if (param.field === "LimitEntryDate") {
                                param.field = "H.LimitEntryDate";
                            }
                            if (param.field === "SelfCreditLimit") {
                                param.field = "H.SelfCreditLimit";
                            }
                            if (param.field === "OtherCreditLimit") {
                                param.field = "H.OtherCreditLimit";
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

        $("#GridDataListofBranchCreditLimit").kendoGrid({
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
            search: ["LimitEntryDate", "SelfCreditLimit", "OtherCreditLimit"],
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
                                <a href="/DMS/BranchCreditLimit/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                                    <i class="fas fa-pencil-alt"></i>
                                </a>`;
                    }
                },

                { field: "Id", width: 50, hidden: true, sortable: true },
                {
                    field: "LimitEntryDate", title: "Limit Entry Date", sortable: true, width: 200, template: '#= kendo.toString(kendo.parseDate(LimitEntryDate), "yyyy-MM-dd") #', filterable: {
                        ui: "datepicker"
                    }
                },

                { field: "SelfCreditLimit", title: "Self Credit Limit", sortable: true, width: 200 },
                { field: "OtherCreditLimit", title: "Other Credit Limit", sortable: true, width: 200 },
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
        var isDropdownValid1 = CommonService.validateDropdown("#ParentId", "#titleError1", "Parent is required");
        var isDropdownValid2 = CommonService.validateDropdown("#EnumTypeId", "#titleError2", "Enum Type is required");
        var isDropdownValid2 = CommonService.validateDropdown("#AreaId", "#titleError3", "Area is required");
        var isDropdownValid = isDropdownValid1 && isDropdownValid2;
        var validator = $("#frmEntry").validate();
        var model = serializeInputs("frmEntry");

        var result = validator.form();
        var area = $("#AreaId").val();
        model.AreaId = area;
        var Parent = $("#ParentId").val();
        model.ParentId = Parent;
        if (!result || !isDropdownValid) {
            if (!result) {
                validator.focusInvalid();
            }
            return;
        }

        if ($('#IsActive').prop('checked')) {
            model.IsActive = true;
        }

        var url = "/DMS/BranchProfile/CreateEdit";

        CommonAjaxService.finalSave(url, model, saveDone, saveFail);
    };



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
            }
        }
        else if (result.Status == 400) {
            ShowNotification(3, result.Message);
        }
        else {
            ShowNotification(2, result.Message);
        }
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


}(CommonService, CommonAjaxService);
document.addEventListener("DOMContentLoaded", function () {
    var container = document.querySelector(".sslPrintC");
    if (container) {
        var id = container.getAttribute("data-id");
        if (id) {
            var btn = document.createElement("a");
            btn.href = ".";
            btn.style.backgroundColor = "skyblue";

            btn.style.marginLeft = "10px";
            btn.style.border = "none";
            /*btn.style.borderRadius = "10px"; */
            btn.className = "btn btn-success btn-sm mr-2 edit";
            btn.title = "Report Preview";
            btn.innerHTML = "<i class='fas fa-print'></i>";
            btn.onclick = function (e) {
                e.preventDefault();
                ReportPreview(id);
            };
            container.appendChild(btn);
        }
    }
});


function ReportPreview(id) {
    
    const form = document.createElement('form');
    form.method = 'post';
    form.action = '/DMS/BranchProfile/ReportPreview';
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


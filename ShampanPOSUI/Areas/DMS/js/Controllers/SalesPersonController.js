var SalesPersonController = function (CommonAjaxService) {
    var getEnumTypeId = 0;
    var getBranchId = 0;
    var getParentId = 0;
    var getName = "";
    var init = function () {

        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';

        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();
        };
        getEnumTypeId = $("#EnumTypeId").val() || 0;
        getBranchId = $("#BranchId").val() || 0;
        getParentId = $("#ParentId").val() || 0;
        
        /*var getId = $("#Id").val() || 0;*/
        /*var getOperation = $("#Operation").val() || '';*/

        getName = $("#Name").val() || 0;


        //if (parseInt(getId) == 0 && getOperation == '') {
        //    GetGridDataList();
        //};
        ///* GetBranchProfileComboBox();*/
        GetEnumTypeComboBox();
        GetParentComboBox();

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

        $(document).on('click', '.edit-disabled', function () {
            kendo.alert("You can only edit records with today's date.");
        });

        $('#routeDelete').on('click', function () {

            Confirmation("Are you sure? Do You Want to Delete Data?",
                function (result) {
                    
                    if (result) {
                        SelectRouteData();
                    }
                });
        });

        $('#visitHistoryDelete').on('click', function () {

            Confirmation("Are you sure? Do You Want to Delete Data?",
                function (result) {
                    
                    if (result) {
                        SelectVisitHistoryData();
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

        // Handle file input change to preview image
        $("#imageUpload").on("change", function (event) {

            //$("#imageUpload").prop("disabled", false); 
            var file = event.target.files[0];

            if (!file) {
                console.error("No file selected!");
                return;
            }

            var reader = new FileReader();

            reader.onload = function (e) {
                console.log("File loaded successfully!");

                $("#imagePreview").attr("src", e.target.result).show();
                $("#deleteImageBtn").show();
                $("#ImagePath").val(e.target.result);
            };

            reader.onerror = function (error) {
                console.error("Error reading file:", error);
            };

            reader.readAsDataURL(file);
        });

        $("#deleteImageBtn").on("click", function () {
            $(this).addClass("clicked");
            $("#imagePreview").attr("src", "").hide();
            $("#ImagePath").val("");
            $("#deleteImageBtn").hide();
            $("#imageUpload").val("");
            $("#imageUpload").prop("disabled", false);
        });

        //// Handle file input change to preview image
        //$("#imageUpload").on("change", function (event) {
        //    $("#imageUpload").prop("disabled", true);
        //    var file = event.target.files[0];

        //    if (!file) {
        //        console.error("No file selected!");
        //        return;
        //    }

        //    var reader = new FileReader();

        //    reader.onload = function (e) {
        //        console.log("File loaded successfully!"); // Debugging

        //        // Update the preview image and make it visible
        //        $("#imagePreview").attr("src", e.target.result).show();
        //        $("#deleteImageBtn").show();
        //    };

        //    reader.onerror = function (error) {
        //        console.error("Error reading file:", error);
        //    };

        //    reader.readAsDataURL(file);
        //});

        //$("#deleteImageBtn").on("click", function () {
        //    $(this).addClass("clicked");
        //    $("#imagePreview").attr("src", "").hide(); // Hide preview
        //    $("#ImagePath").val(""); // Clear hidden field
        //    $("#deleteImageBtn").hide();
        //    $("#imageUpload").val("");// Hide delete button
        //    $("#imageUpload").prop("disabled", false);

        //});

        var operation = $("#Operation").val();
        var imagePath = $("#ImagePath").val();
        if (operation == "update" && imagePath !== null) {
            
            $("#imageUpload").prop("disabled", false);
        }


        $("#btnSalePersonRoute").on('click', function () {
            SalePersonRouteGetGridDataList();
            console.log("Working");

        })

        $("#btnSalePersonVisitHistory").on('click', function () {
            SalePersonVisitHistoryGetGridDataList();
            console.log("Working");

        })
    };
    function GetBranchProfileComboBox() {
        var BranchComboBox = $("#BranchId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [
                { field: "Code", title: "Branch Code", width: 100 },
                { field: "Name", title: "Branch Name", width: 150 },

            ],
            filter: "contains",
            filterFields: ["Code", "Name"],
            dataSource: {
                transport: {
                    read: "/SalesPerson/GetBranchList"
                }
            },
            placeholder: "Select Branch",
            value: "",
            dataBound: function (e) {
                
                if (getBranchId) {
                    this.value(parseInt(getBranchId));
                }
            },
            change: function (e) {
                
            }
        }).data("kendoMultiColumnComboBox");
    };

    function GetEnumTypeComboBox() {
        var EnumTypeComboBox = $("#EnumTypeId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [

                { field: "Name", title: "Name", width: 150 },
            ],
            filter: "contains",
            filterFields: ["Name"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetCompanyTypeList?value=SalesPerson"
                }
            },
            placeholder: "Select Type",
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

    function GetParentComboBox() {
        var ParentComboBox = $("#ParentId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [
                { field: "Code", title: "Code", width: 100 },
                { field: "Name", title: "Name", width: 150 },
                { field: "BanglaName", title: "BanglaName", width: 200 },
            ],
            filter: "contains",
            filterFields: ["Code", "Name", "BanglaName"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetSalePersonParentList"
                }
            },
            placeholder: "Select Sale Person",
            value: "",
            dataBound: function (e) {
                
                if (getParentId) {
                    this.value(parseInt(getParentId));
                }
            },
            change: function (e) {
                
            }
        }).data("kendoMultiColumnComboBox");
    };

    function GetUpdateParentComboBox(getName) {
        var ParentComboBox = $("#ParentId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [
                { field: "Code", title: "Manager Code", width: 100 },
                { field: "Name", title: "Line Manager Name", width: 138 },

            ],
            filter: "contains",
            filterFields: ["Code", "Name"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetSalePersonParentList"
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

        var url = "/DMS/SalesPerson/Delete";

        CommonAjaxService.deleteData(url, model, deleteDone, saveFail);
    };


    function SelectRouteData() {
        
        var IDs = [];

        var selectedRows = $("#GridDataListoSalePersonRoute").data("kendoGrid").select();

        if (selectedRows.length === 0) {
            ShowNotification(3, "You are requested to Select checkbox!");
            return;
        }

        selectedRows.each(function () {
            var dataItem = $("#GridDataListoSalePersonRoute").data("kendoGrid").dataItem(this);
            IDs.push(dataItem.Id);
        });

        var model = {
            IDs: IDs
        };

        var url = "/DMS/SalePersonRoute/Delete";

        CommonAjaxService.deleteData(url, model, deleteRouteDone, saveFail);
    };


    function SelectVisitHistoryData() {
        
        var IDs = [];

        var selectedRows = $("#GridDataListofSalePersonVisitHistory").data("kendoGrid").select();

        if (selectedRows.length === 0) {
            ShowNotification(3, "You are requested to Select checkbox!");
            return;
        }

        selectedRows.each(function () {
            var dataItem = $("#GridDataListofSalePersonVisitHistory").data("kendoGrid").dataItem(this);
            IDs.push(dataItem.Id);
        });

        var model = {
            IDs: IDs
        };

        var url = "/DMS/SalePersonVisitHistrie/Delete";

        CommonAjaxService.deleteData(url, model, deleteVisitHistoryDone, saveFail);
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
                    url: "/DMS/SalesPerson/GetGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false
                },
                parameterMap: function (options) {
                    
                    if (options.sort) {
                        options.sort.forEach(function (param) {
                            if (param.field === "Id") {
                                param.field = "H.Id";
                            }
                            if (param.field === "Code") {
                                param.field = "H.Code";
                            }
                            if (param.field === "Name") {
                                param.field = "H.Name";
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
                            if (param.field === "Id") {
                                param.field = "H.Id";
                            }
                            if (param.field === "Code") {
                                param.field = "H.Code";
                            }
                            if (param.field === "Name") {
                                param.field = "H.Name";
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
            search: ["Code", "Name"],
            excel: {
                fileName: "SalesPersons.xlsx",
                filterable: true
            },
            pdf: {
                fileName: `SalesPersons_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`,
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

                var actionColumnIndex = grid.columns.findIndex(col => col.title === "Action");
                var selectionColumnIndex = grid.columns.findIndex(col => col.selectable === true);

                if (actionColumnIndex >= 0) {
                    grid.hideColumn(actionColumnIndex);
                }
                if (selectionColumnIndex >= 0) {
                    grid.hideColumn(selectionColumnIndex);
                }

                var fileName = `SalesPersons_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`;

                e.sender.options.pdf = {
                    paperSize: "A2",
                    margin: { top: "4cm", left: "1cm", right: "1cm", bottom: "4cm" },
                    landscape: true,
                    allPages: true,
                    template: `
                        <div style="position: absolute; top: 1cm; left: 1cm; right: 1cm; text-align: center; font-size: 12px; font-weight: bold;">
                            <div>Branch Name :- ${branchName}</div>
                            <div>Company Name :- ${companyName}</div>
                            <div>Company Address :- ${companyAddress}</div>
                        </div>`
                };

                e.sender.options.pdf.fileName = fileName;

                setTimeout(function () {
                    window.location.reload();
                }, 1000);
            },
            columns: [
                {
                    selectable: true, width: 20
                },
                {
                    title: "Action",
                    width: 60,
                    template: function (dataItem) {
                        return "<a class='btn btn-primary btn-sm mr-2 edit' title='Modify' href='/DMS/SalesPerson/Edit/" + dataItem.Id + "'>" +
                            "<i class='fas fa-pencil-alt'></i>" + "</a>"
                            //+ "<a class='btn btn-success btn-sm mr-2' title='Route List' href='/DMS/SalePersonRoute/Index/" + dataItem.Id + "'>" +
                            //"<i class='fas fa-th-list'></i>" +
                            //"</a>" +
                            //"<a class='btn bg-info btn-sm mr-2' title='Visit List' href='/DMS/SalePersonVisitHistrie/Index/" + dataItem.Id + "'>" +
                            //"<i class='fas fa-clipboard-list'></i>" +
                            //"</a>"
                            +
                            "<a style='background-color: darkgreen;' href='#' onclick='ReportPreview(" + dataItem.Id + ")' class='btn btn-success btn-sm mr-2 edit' title='Report Preview'>" +
                            "<i class='fas fa-print'></i>" +
                            "</a>";
                    }

                },
                { field: "Id", width: 50, hidden: true, sortable: true },
                { field: "Code", title: "Code", width: 150, sortable: true },
                { field: "Name", title: "Name", sortable: true, width: 200 },
                { field: "Type", title: "Type", sortable: true, width: 200 },
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



    var SalePersonRouteGetGridDataList = function () {

        //var val = $("#SalePersonId").val();
        //
        //if (val == 0 || val == null) {
        //    salePersonId = 0;
        //}
        //else {
        //    salePersonId = val;
        //}
        var getSalePersonId = $("#Id").val();

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
                    url: "/DMS/SalePersonRoute/GetGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false,
                    data: { getSalePersonId: getSalePersonId }
                },
                parameterMap: function (options) {
                    
                    if (options.sort) {
                        options.sort.forEach(function (param) {
                            if (param.field === "Id") {
                                param.field = "H.Id";
                            }
                            if (param.field === "BranchId") {
                                param.field = "H.BranchId";
                            }
                            if (param.field === "SalePersonName") {
                                param.field = "SP.Name";
                            }
                            if (param.field === "BranchName") {
                                param.field = "B.Name";
                            }
                            if (param.field === "RouteName") {
                                param.field = "R.Name";
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
                            if (param.field === "Id") {
                                param.field = "H.Id";
                            }
                            if (param.field === "BranchId") {
                                param.field = "H.BranchId";
                            }
                            if (param.field === "SalePersonName") {
                                param.field = "SP.Name";
                            }
                            if (param.field === "BranchName") {
                                param.field = "B.Name";
                            }
                            if (param.field === "RouteName") {
                                param.field = "R.Name";
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
                    return options;
                }
            },
            batch: true,
            schema: {
                data: "Items",
                total: "TotalCount"
            }
        });

        $("#GridDataListoSalePersonRoute").kendoGrid({
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
            search: ["SalePersonName", "BranchName", "RouteName"],
            excel: {
                fileName: "Routes.xlsx",
                filterable: true
            },
            pdf: {
                fileName: `Routes_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`,
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

                var actionColumnIndex = grid.columns.findIndex(col => col.title === "Action");
                var selectionColumnIndex = grid.columns.findIndex(col => col.selectable === true);

                if (actionColumnIndex >= 0) {
                    grid.hideColumn(actionColumnIndex);
                }
                if (selectionColumnIndex >= 0) {
                    grid.hideColumn(selectionColumnIndex);
                }

                var fileName = `Routes_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`;

                e.sender.options.pdf = {
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
                                <a href="/DMS/SalePersonRoute/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                                    <i class="fas fa-pencil-alt"></i>
                                </a>`;
                    }
                },
                { field: "Id", width: 50, hidden: true, sortable: true },

                { field: "BranchId", title: "Branch Id", hidden: true, sortable: true, width: 200 },
                { field: "SalePersonName", title: "SalePerson", hidden: true, sortable: true, width: 200 },
                { field: "BranchName", title: "Branch", sortable: true, hidden: true, width: 200 },
                { field: "RouteId", title: "Route Id", hidden: true, sortable: true, width: 200 },
                { field: "RouteName", title: "Route", sortable: true, width: 200 },
                { field: "SalePersonId", title: "SalePerson Id", hidden: true, sortable: true, width: 200 },

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

    var SalePersonVisitHistoryGetGridDataList = function () {
        var getSalePersonId = $("#Id").val();

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
                    url: "/DMS/SalePersonVisitHistrie/GetGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false,
                    data: { getSalePersonId: getSalePersonId }
                },
                parameterMap: function (options) {
                    
                    if (options.sort) {
                        options.sort.forEach(function (param) {
                            if (param.field === "Id") {
                                param.field = "H.Id";
                            }
                            if (param.field === "BranchName") {
                                param.field = "Bp.Name";
                            }
                            if (param.field === "SalePersonName") {
                                param.field = "so.Name";
                            }

                            if (param.field === "VisitDate" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "H.Date";
                            }
                            if (param.field === "RouteName") {
                                param.field = "r.Name";
                            }
                            if (param.field === "CustomerName") {
                                param.field = "c.Name";
                            }
                            if (param.field === "Visited") {
                                param.field = "d.IsVisited";
                            }

                        });
                    }

                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (param) {
                            if (param.field === "Id") {
                                param.field = "H.Id";
                            }
                            if (param.field === "BranchName") {
                                param.field = "Bp.Name";
                            }
                            if (param.field === "SalePersonName") {
                                param.field = "so.Name";
                            }

                            if (param.field === "VisitDate" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "CONVERT(VARCHAR(10), H.Date, 120)";
                            }
                            if (param.field === "RouteName") {
                                param.field = "r.Name";
                            }
                            if (param.field === "CustomerName") {
                                param.field = "c.Name";
                            }
                            if (param.field === "Visited") {
                                param.field = "d.IsVisited";
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

        $("#GridDataListofSalePersonVisitHistory").kendoGrid({
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
            search: ["SalePersonName", "BranchName", "RouteName"],
            excel: {
                fileName: "SalePersonVisitHistries.xlsx",
                filterable: true
            },
            pdf: {
                fileName: `SalePersonVisitHistries_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`,
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

                var actionColumnIndex = grid.columns.findIndex(col => col.title === "Action");
                var selectionColumnIndex = grid.columns.findIndex(col => col.selectable === true);

                if (actionColumnIndex >= 0) {
                    grid.hideColumn(actionColumnIndex);
                }
                if (selectionColumnIndex >= 0) {
                    grid.hideColumn(selectionColumnIndex);
                }

                var fileName = `SalePersonVisitHistries_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`;

                e.sender.options.pdf = {
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
                        var today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
                        var visitDate = kendo.toString(kendo.parseDate(dataItem.VisitDate), "yyyy-MM-dd");

                        if (visitDate === today) {
                            return `
                <a href="/DMS/SalePersonVisitHistrie/Edit/${dataItem.Id}?SalePersonId=${dataItem.SalePersonId}&routeId=${dataItem.RouteId}" 
                    class="btn btn-primary btn-sm edit">
                    <i class="fas fa-pencil-alt"></i>
                </a>`;
                        } else {
                            return `
                <button class="btn btn-primary btn-sm edit-disabled" >
                    <i class="fas fa-pencil-alt"></i>
                </button>`;
                        }
                    }
                    //template: function (dataItem) {
                    //    
                    //    
                    //    return `
                    //            <a href="/DMS/SalePersonVisitHistrie/Edit/${dataItem.Id}?SalePersonId=${dataItem.SalePersonId}?routeId=${dataItem.RouteId}" class="btn btn-primary btn-sm mr-2 edit"><i class="fas fa-pencil-alt"></i></a>`;
                    //}
                },
                { field: "Id", width: 50, hidden: true, sortable: true },

                /* { field: "BranchId", title: "Branch Id", hidden: true, sortable: true, width: 200 },*/
                { field: "SalePersonName", title: "SalePerson", hidden: true, sortable: true, width: 200 },
                /*  { field: "BranchName", title: "Branch", sortable: true, width: 200 },*/
                { field: "RouteId", title: "Route Id", hidden: true, sortable: true, width: 200 },
                { field: "RouteName", title: "Route", sortable: true, width: 200 },
                { field: "SalePersonId", title: "SalePerson Id", hidden: true, sortable: true, width: 200 },
                {
                    field: "VisitDate", title: "Visit Date", sortable: true, width: 135, template: '#= kendo.toString(kendo.parseDate(VisitDate), "yyyy-MM-dd") #',
                    filterable:
                    {
                        ui: "datepicker"
                    }
                }


            ],
            editable: false,
            selectable: "multiple row",
            navigatable: true,
            columnMenu: true
        });
    };
    // Function to show notification
   
    

    function save() {
         
        
        var validator = $("#frmEntry").validate();
        var formData = new FormData();
        var model = serializeInputs("frmEntry");


        if (model.Name == "") {
            ShowNotification(3, "Name Is Required.");
            return;
        }
        if (parseInt(model.ParentId) < 0 || model.ParentId == "") {
            ShowNotification(3, "Parent Is Required.");
            return;
        }
        if (parseInt(model.EnumTypeId) == 0 || model.EnumTypeId == "") {
            ShowNotification(3, "Enum Type Is Required.");
            return;
        }
        if (model.Mobile == "") {
            ShowNotification(3, "Mobile Is Required.");
            return;
        }
        //if (model.EmailAddress == "") {
        //    ShowNotification(3, "Email Address Is Required.");
        //    return;
        //}

                       

        var result = validator.form();
        
        var isDropdownValid1 = CommonService.validateDropdown("#ParentId", "#titleError1", "Parent is required");
        var isDropdownValid2 = CommonService.validateDropdown("#EnumTypeId", "#titleError2", "Enum is required");

        var isDropdownValid = isDropdownValid1 && isDropdownValid2
        if (!result || !isDropdownValid) {
            if (!result) {
                validator.focusInvalid();
            }
            return;
        }

        for (var key in model) {
            formData.append(key, model[key]);
        }

        // Handle checkbox value
        formData.append("IsActive", $('#IsActive').prop('checked'));


        // Check if delete button was clicked to remove image
        var deleteImageClicked = $("#deleteImageBtn").hasClass("clicked");
        if (deleteImageClicked) {
            formData.append("ImagePath", "");
            $("#imagePreview").remove();
            $("#ImagePath").val("");
        }

        var fileInput = document.getElementById("imageUpload");
        if (fileInput.files.length > 0) {
            var file = fileInput.files[0];

            if (file.size > 26214400) {
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

        //// Check if delete button was clicked to remove image
        //var deleteImageClicked = $("#deleteImageBtn").hasClass("clicked");
        //if (deleteImageClicked) {
        //    formData.append("ImagePath", "");  // Mark image for deletion
        //    $("#imagePreview").remove();
        //    $("#ImagePath").val("");
        //}

        //var fileInput = document.getElementById("imageUpload");
        //if (fileInput.files.length > 0) {
        //    var file = fileInput.files[0];

        //    // ✅ Validate file size (Max 25MB)
        //    if (file.size > 26214400) { // 25MB in bytes
        //        ShowNotification(3, "Image size cannot exceed 25MB.");
        //        return;
        //    }

        //    formData.append("file", file);
        //} else if (!deleteImageClicked) {
        //    var existingImagePath = $("#ImagePath").val();
        //    if (existingImagePath) {
        //        formData.append("ImagePath", existingImagePath);
        //    }
        //}


        var url = "/DMS/SalesPerson/CreateEdit";

        CommonAjaxService.finalImageSave(url, formData, saveDone, saveFail);
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



    function deleteRouteDone(result) {
        
        var grid = $('#GridDataListoSalePersonRoute').data('kendoGrid');
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

    function deleteVisitHistoryDone(result) {
        
        var grid = $('#GridDataListofSalePersonVisitHistory').data('kendoGrid');
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
        
        
        ShowNotification(3, "Something went wrong");
    };

    return {
        init: init
    };

}(/*CommonService,*/CommonAjaxService);
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
    form.action = '/DMS/SalesPerson/ReportPreview';
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

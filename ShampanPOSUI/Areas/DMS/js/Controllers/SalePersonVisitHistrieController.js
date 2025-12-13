var SalePersonVisitHistrieController = function (CommonService, CommonAjaxService) {
    var getBranchId = 0;
    var getRouteId = 0;
    var getSalePersonId = 0;
    var init = function () {
        getBranchId = $("#BranchId").val() || 0;
        getRouteId = $("#RouteId").val() || 0;
        getSalePersonId = $("#SalePersonId").val() || 0;
        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';
        var getYearValue = $('#YearPeriod').val();
        if (parseInt(getId) == 0 && getOperation == '') {
            GetBranchList();
            GetGridDataList();
            GetAllGridDataList();
        };
        var isIndex = $("#IsIndex").val() === "true";

        if (!isIndex) {
            //GetBranchComboBox();
            GetSalePersonComboBox();
            //GetRouteComboBox();
            updateRouteComboBox(getSalePersonId, getBranchId)
        }
        console.log($("#Operation").val())
        if ($("#Operation").val() == "update") {
            updateRouteComboBox(getSalePersonId, getBranchId)
        }



        $("#indexSearch").on('click', function () {
            var branchId = $("#Branchs").data("kendoComboBox").value();

            if (branchId == "") {
                ShowNotification(3, "Please Select Branch Name First!");
                return;
            }
            const gridElement = $("#AllGridDataList");
            if (gridElement.data("kendoGrid")) {
                gridElement.data("kendoGrid").destroy();
                gridElement.empty();
            }

            GetAllGridDataList();

        });

        var $table = $('#fiscalYearDetails');

        $('.btnsave').click('click', function () {

            var getId = $('#Id').val();
            var status = "Save";
            if (parseInt(getId) > 0) {
                status = "Update";
            }
            Confirmation("Are you sure? Do You Want to " + status + " Data?",
                function (result) {
                    if (result) {
                        save($table);
                    }
                });
        });

        $('.NewButton ').on('click', function () {
            $("#dtHeader").show();
        })
        $('.btnDelete').on('click', function () {

            Confirmation("Are you sure? Do You Want to Delete Data?",
                function (result) {

                    if (result) {
                        SelectData();
                    }
                });
        });

        $("#YearLock").on('click', function () {
            if ($(this).is(':checked')) {
                $(".MonthLock").attr('checked', true);
            }
            else {
                $(".MonthLock").attr('checked', false);
            }
        });

        $(".MonthLock").on('click', function () {
            if ($('.MonthLock:checkbox:not(:checked)').length > 0) {
                $(".YearLock").attr('checked', false);
            }
            else {
                $(".YearLock").attr('checked', true);
            }
        });

        $("#Year").on('change', function () {

            var year = $('#Year').val();
            var yearStartDate = $('#YearStart').val();
            var updatedYearStartDate = yearStartDate.replace(/^(\d{4})/, year.toString());
            $('#YearStart').val(updatedYearStartDate);
            var startDate = new Date(updatedYearStartDate);

            var endDate = new Date(startDate);
            endDate.setFullYear(startDate.getFullYear() + 1);

            endDate.setMonth(endDate.getMonth());
            endDate.setDate(0);


            var updatedYearEndDate = endDate.toISOString().split('T')[0]; // Get date in 'YYYY-MM-DD' format


            $('#YearEnd').val(updatedYearEndDate);
        });

        $("#btnFDt").on('click', function () {
            $('#fiscalYearDetails').show();
            //$("#dtMHeader").show();


            var yearStart = $('#YearStart').val();
            var yearEnd = $('#YearEnd').val();

            // Correcting the URL construction to ensure proper formatting
            let url = '/DMS/SalePersonVisitHistrie/FiscalYearSet?YearStart=' + yearStart + '&YearEnd=' + yearEnd;
            $('#fiscalYearDetails').html('');
            $.get(url, function (data) {

                $('#fiscalYearDetails').append(data);

            }).fail(function (xhr, status, error) {
                $('#fiscalYearDetails').html('<div class="error-message">Failed to load data. Please try again later.</div>');
            });
        });
        $('#YearLock').change(function () {
            var isChecked = $(this).prop('checked');

            // Lock or unlock all MonthLock checkboxes based on YearLock checkbox
            $('.PeriodLock').each(function () {
                $(this).prop('checked', isChecked);
                $(this).prop('disabled', isChecked); // Optionally disable the checkbox
            });
        });

    };
    function GetBranchComboBox() {
        var BranchComboBox = $("#BranchId").kendoMultiColumnComboBox({
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
                    read: "/Common/Common/GetBranchList"
                }
            },
            placeholder: "Select Branch", // Set the placeholder
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

    function GetRouteComboBox() {
        var RouteComboBox = $("#RouteId").kendoMultiColumnComboBox({
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
                    read: "/Common/Common/GetCustomerRouteList"
                }
            },
            placeholder: "Select Route Type ", // Set the placeholder
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
    function GetSalePersonComboBox() {
        var RouteComboBox = $("#SalePersonId").kendoMultiColumnComboBox({
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
                    read: "/Common/Common/GetSalePersonList"
                }
            },
            value: "",
            dataBound: function (e) {

                if (getSalePersonId) {
                    this.value(parseInt(getSalePersonId));
                }
            },
            change: function (e) {

            }
        }).data("kendoMultiColumnComboBox");
    };





    function updateRouteComboBox(salePersonId, branchId) {

        // If no SalePersonId or BranchId is selected, do not attempt to update the Customer ComboBox
        if (!salePersonId || !branchId) {
            return;
        }


        var RouteComboBox = $("#RouteId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "RouteId",
            height: 400,
            columns: [

                { field: "Name", title: "Name", width: 175 },

            ],
            filter: "contains",
            filterFields: ["Name"],
            placeholder: "Select Route",
            dataSource: {
                transport: {
                    read: {
                        url: "/Common/Common/GetRouteBySalePersonAndBranch",
                        data: {
                            salePersonId: salePersonId,
                            branchId: branchId
                        },
                        dataType: "json"
                    }
                }
            },
            placeholder: "Select Route Type ", // Set the placeholder
            value: "",
            dataBound: function (e) {

                if (getRouteId) {
                    this.value(parseInt(getRouteId));
                }
            },
            change: function (e) {

            }
        }).data("kendoMultiColumnComboBox");

    }




    function SelectData() {

        var IDs = [];

        var selectedRows = $("#FiscalYearsGrid").data("kendoGrid").select();

        if (selectedRows.length === 0) {
            ShowNotification(3, "You are requested to Select checkbox!");
            return;
        }

        selectedRows.each(function () {
            var dataItem = $("#FiscalYearsGrid").data("kendoGrid").dataItem(this);
            IDs.push(dataItem.Id);
        });

        var model = {
            IDs: IDs
        };

        var url = "/DMS/SalePersonVisitHistrie/Delete";

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


                        return `
                                <a href="/DMS/SalePersonVisitHistrie/Edit/${dataItem.Id}?SalePersonId=${dataItem.SalePersonId}?routeId=${dataItem.RouteId}" class="btn btn-primary btn-sm mr-2 edit"><i class="fas fa-pencil-alt"></i></a>`;
                    }
                },
                { field: "Id", width: 50, hidden: true, sortable: true },

                /* { field: "BranchId", title: "Branch Id", hidden: true, sortable: true, width: 200 },*/
                { field: "SalePersonName", title: "SalePerson", sortable: true, width: 200 },
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


    $('body').on('click', '.btnDelete-FiscalYear', function (e) {

        var data = $(this).attr('id');
        var id = data.split('~')[0];
        var url = "/SalePersonVisitHistrie/DeleteItem?id=" + id + "";

        Confirmation("Are you sure? Do You Want to Delete Data?",
            function (result) {

                if (result) {

                    $.ajax({
                        type: 'POST',
                        url: url,
                        success: function (response) {

                            if (response.status == "200") {
                                ShowNotification(1, response.message);
                            }
                            else {
                                ShowNotification(3, response.message);
                            }
                            if (response.status == "200") {
                                setTimeout(function () {
                                    window.location.reload();
                                }, 1000);
                            }
                        },
                        error: function (error) {

                            ShowNotification(3, response.message);
                        }
                    });
                }
            });
    });



    var GetAllGridDataList = function () {
        var branchId = $("#Branchs").data("kendoComboBox").value();
        console.log(branchId)
        //var branchId = '1';
        var FromDate = $('#FromDate').val();
        var ToDate = $('#ToDate').val();
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
                    url: "/DMS/SalePersonVisitHistrie/GetAllGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false,
                    data: { branchId: branchId, fromDate: FromDate, toDate: ToDate }
                },
                parameterMap: function (options) {
                    if (options.sort) {
                        options.sort.forEach(function (param) {
                          
                            if (param.field === "RouteName") {
                                param.field = "R.Name";
                            }
                            if (param.field === "RouteAddress") {
                                param.field = "R.Address";
                            }
                            if (param.field === "SalesPersonName") {
                                param.field = "Sp.Name";
                            }
                            if (param.field === "CustomerName") {
                                param.field = "C.Name";
                            }
                            if (param.field === "CustomerBanglaName") {
                                param.field = "C.BanglaName";
                            }
                            if (param.field === "CustomerAddress") {
                                param.field = "C.Address";
                            }
                            if (param.field === "CustomerBanglaAddress") {
                                param.field = "C.BanglaAddress";
                            }
                            if (param.field === "SaleOrderNo") {
                                param.field = "SO.Code";
                            }
                            //if (param.field === "Date" && param.value) {
                            //    param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                            //    param.field = "H.Date";
                            //}
                            
                            //if (param.field === "IsVisited") {
                            //    let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";

                            //    if (statusValue.startsWith("y")) {
                            //        param.value = 1;
                            //    } else if (statusValue.startsWith("n")) {
                            //        param.value = 0;
                            //    } else {
                            //        param.value = null;
                            //    }

                            //    param.field = "D.IsVisited";
                            //    param.operator = "eq";
                            //}

                        });
                    }

                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (param) {
                            if (param.field === "RouteName") {
                                param.field = "R.Name";
                            }
                            if (param.field === "RouteAddress") {
                                param.field = "R.Address";
                            }
                            if (param.field === "SalesPersonName") {
                                param.field = "Sp.Name";
                            }
                            if (param.field === "CustomerName") {
                                param.field = "C.Name";
                            }
                            //if (param.field === "CustomerBanglaName") {
                            //    param.field = "C.BanglaName";
                            //}
                            if (param.field === "CustomerAddress") {
                                param.field = "C.Address";
                            }
                            //if (param.field === "CustomerBanglaAddress") {
                            //    param.field = "C.BanglaAddress";
                            //}
                            //if (param.field === "SaleOrderNo") {
                            //    param.field = "SO.Code";
                            //}
                            //if (param.field === "Date" && param.value) {
                            //    param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                            //    param.field = "H.Date";
                            //}

                            //if (param.field === "IsVisited") {
                            //    let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";

                            //    if (statusValue.startsWith("y")) {
                            //        param.value = 1;
                            //    } else if (statusValue.startsWith("n")) {
                            //        param.value = 0;
                            //    } else {
                            //        param.value = null;
                            //    }

                            //    param.field = "D.IsVisited";
                            //    param.operator = "eq";
                            //}
                        });
                    }
                    return options;
                }
            },
            batch: true,
            schema: {
                data: "Items",
                total: "TotalCount"
            },
            model: {

                fields: {
                }
            }
            ,
            aggregate: [
            ]
        });

        $("#AllGridDataList").kendoGrid({
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
            search: ['RouteName', 'RouteAddress', 'CustomerName', 'CustomerAddress', 'SalesPersonName'],
            excel: {
                fileName: "Sale Person Visit Histroy.xlsx",
                filterable: true
            },
            columns: [
                { field: "Id", width: 50, hidden: true, sortable: true },
                { field: "RouteName", title: "Route Name", sortable: true, width: 200 },
                { field: "RouteAddress", title: "Route Address", sortable: true, width: 200 },
                { field: "CustomerName", title: "Customer Name", sortable: true, width: 200 },
                { field: "CustomerAddress", title: "Customer Address", sortable: true, width: 200 },
                { field: "Date", title: "Date", sortable: true, width: 200 },
                { field: "SalesPersonName", title: "Sale Person", sortable: true, width: 200 }

            ],
            editable: false,
            selectable: "multiple row",
            navigatable: true,
            columnMenu: true
        });

        $("#AllGridDataList").on("click", ".k-header .k-checkbox", function () {
            var isChecked = $(this).is(":checked");
            var grid = $("#AllGridDataList").data("kendoGrid");
            if (isChecked) {
                grid.tbody.find(".k-checkbox").prop("checked", true);
            } else {
                grid.tbody.find(".k-checkbox").prop("checked", false);
            }
        });
    };





    function save() {
        var visited;
        var validator = $("#frmEntry").validate();
        var fiscal = serializeInputs("frmEntry");

        // Validate the form
        var result = validator.form();
        var isDropdownValid1 = CommonService.validateDropdown("#RouteId", "#titleError1", "Route is required");

        if (!result || !isDropdownValid1) {
            if (!result) {
                validator.focusInvalid();
            }
            return;
        }

        fiscal.IsVisited = $(".PeriodLock").prop('checked'); // Get the state of the checkbox

        var SalePersonVisitDetails = [];
        var operation = $("#Operation").val();


        // If operation is 'add', iterate over SalePersonVisitDetails
        if (operation == 'add') {
            $('#SalePersonVisitDetails .card-body').each(function () {
                var row = $(this);

                var detail = {
                    Id: row.find('input[name$=".Id"]').val(),
                    SalePersonVisitHistroyId: row.find('input[name$=".SalePersonVisitHistroyId"]').val(),
                    CustomerId: row.find('input[name$=".CustomerId"]').val(),
                    IsVisited: row.find('input[name$=".IsVisited"]').prop('checked'),
                };

                // Check if IsVisited is checked, if so, disable the checkbox
                if (detail.IsVisited) {
                    row.find('input[name$=".IsVisited"]').prop('disabled', true); // Disable checkbox
                }

                SalePersonVisitDetails.push(detail);
            });
        }
        else {
            $("#dtHeader").hide();

            // If operation is not 'add', iterate over fiscalYearRows
            $('.fiscalYearRow').each(function () {
                var row = $(this);

                var detail = {
                    Id: row.find('input[name$=".Id"]').val(),
                    SalePersonVisitHistroyId: row.find('input[name$=".SalePersonVisitHistroyId"]').val(),
                    CustomerId: row.find('input[name$=".CustomerId"]').val(),
                    IsVisited: row.find('input[name$=".IsVisited"]').prop('checked'), // Get the checked state for each row
                };

                // Check if IsVisited is checked, if so, disable the checkbox
                if (detail.IsVisited) {
                    row.find('input[name$=".IsVisited"]').prop('disabled', true); // Disable checkbox
                }

                SalePersonVisitDetails.push(detail);
            });
        }

        // Assign the SalePersonVisitDetails array to the fiscal object
        fiscal.SalePersonVisitHistrieDetails = SalePersonVisitDetails;

        var url = "/DMS/SalePersonVisitHistrie/CreateEdit";


        // Call the save service
        CommonAjaxService.finalSave(url, fiscal, saveDone, saveFail);
    }
    function saveDone(result) {

        if (result.Status == "200") {
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
        else if (result.Status == "400") {
            ShowNotification(3, result.Message);
        }
        else {
            ShowNotification(2, result.Message);
        }
    };

    function saveFail(result) {

        ShowNotification(3, "Query Exception!");
    }
    function deleteDone(result) {

        var grid = $('#FiscalYearsGrid').data('kendoGrid');
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

    $(document).ready(function () {
        // Iterate through each checkbox and disable it if IsVisited is true
        $(".PeriodLock").each(function () {
            var checkbox = $(this);
            var isVisited = checkbox.prop('checked');
            if (isVisited) {
                checkbox.prop('disabled', true); // Disable the checkbox if IsVisited is true
            }
        });
    });



    $(document).on('change', '.PeriodLock', function () {
        var checkbox = $(this);
        Confirmation("Are you sure? Do You Want to Cheaked?",
            function (result) {


                if (result) {
                    save();
                }
                else {
                    checkbox.prop('checked', false);
                }
            });
    });




    //$(document).on('change', '.PeriodLock', function () {
    //    // Check if the checkbox is already checked
    //    if ($(this).prop('checked')) {
    //        // Disable the checkbox
    //        $(this).prop('disabled', true);
    //    } else {
    //        // Confirmation prompt if the checkbox is not checked
    //        Confirmation("Are you sure? Do You Want to Check it?",
    //            function (result) {
    //                
    //                if (result) {
    //                    // Save action
    //                    save();
    //                }
    //            });
    //    }
    //});


    //$(document).on('change', '.PeriodLock', function () {

    //    save();
    //});
    return {
        init: init
    }


}(CommonService, CommonAjaxService);
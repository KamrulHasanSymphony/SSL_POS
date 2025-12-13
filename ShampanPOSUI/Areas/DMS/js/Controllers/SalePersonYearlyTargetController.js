var SalePersonYearlyTargetController = function (CommonService, CommonAjaxService) {

    var getCustomerId = 0;
    var getSalePersonId = 0;
    var getFiscalYearForSaleId = 0;
    var getRouteId = 0;
    var getCurrencyId = 0;
    var fYear;
    var init = function () {

        if ($("#IsPosted").length) {

            LoadCombo("IsPosted", '/Common/Common/GetBooleanDropDown');
            $("#IsPosted").val('0');

        };

        var IsPost = $('#IsPost').val();

        if (IsPost === 'True') {
            Visibility(true);
        };

        getCustomerId = $("#CustomerId").val() || 0;
        getSalePersonId = $("#SalePersonId").val() || 0;
        getFiscalYearForSaleId = $("#FiscalYearForSaleId").val() || 0;
        getRouteId = $("#RouteId").val() || 0;
        getCurrencyId = $("#CurrencyId").val() || 0;


        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';

        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();
        };
        //$('#YearStart').data('daterangepicker').isInvalidDate = function () {
        //    return true;
        //};
        //$('#YearEnd').data('daterangepicker').isInvalidDate = function () {
        //    return true;
        //};

        GetSalePersonComboBox();
        BranchComboBox();
        FiscalYearForSaleComboBox();

        $("input[name*='MonthlyTarget']").on('change', function () {

            var totalMonthlyTarget = 0;
            $("input[name*='MonthlyTarget']").each(function () {
                var value = parseFloat($(this).val());
                if (!isNaN(value)) {
                    totalMonthlyTarget += value;
                }
            });

            var yearlyTarget = parseFloat($("input[name='YearlyTarget']").val());

            if (totalMonthlyTarget > yearlyTarget || totalMonthlyTarget < yearlyTarget) {
                alert('Total Monthly target should be same as Yearly target!');
            }
        });

        var $table = $('#details');

        var table = initEditTable($table, { searchHandleAfterEdit: false });

        //TotalCalculation();

        $('.NewButton ').on('click', function () {
            $("#dtHeader").show();
        })

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
        $('#btnPost').on('click', function () {

            Confirmation("Are you sure? Do You Want to Post Data?",
                function (result) {

                    if (result) {
                        SelectData();
                    }
                });
        });

        $('.btnPost').on('click', function () {

            Confirmation("Are you sure? Do You Want to Post Data?",
                function (result) {

                    if (result) {
                        var model = serializeInputs("frmEntry");
                        if (model.IsPost == "True") {
                            ShowNotification(3, "Data has already been Posted.");
                        }
                        else {
                            model.IDs = model.Id;
                            var url = "/DMS/SalePersonYearlyTarget/MultiplePost";
                            CommonAjaxService.multiplePost(url, model, postDone, fail);
                        }
                    }
                });
        });


    };

    function GetSalePersonComboBox() {
        var SalePersonComboBox = $("#SalePersonId").kendoMultiColumnComboBox({
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
                    read: "/Common/Common/GetSalePersonList"
                }
            },
            placeholder: "Select Person", // Set the placeholder
            value: "",
            dataBound: function (e) {

                if (getSalePersonId) {
                    this.value(parseInt(getSalePersonId));
                }
            },
            change: function (e) {

            }
        }).data("kendoMultiColumnComboBox");
    }
    function BranchComboBox() {

        var ProductGroupComboBox = $("#Branchs").kendoMultiColumnComboBox({
            dataTextField: "Code",
            dataValueField: "Id",
            height: 400,
            columns: [
                { field: "Code", title: "Code", width: 100 },
                { field: "Name", title: "Name", width: 150 },
                { field: "DistributorCode", title: "DistributorCode", width: 200 },
            ],
            filter: "contains",
            filterFields: ["Code", "Name", "DistributorCode"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetBranchList"
                }
            },
            change: function (e) {

            }
        }).data("kendoMultiColumnComboBox");
    };


    function FiscalYearForSaleComboBox() {

        var FiscalYearForSaleComboBox = $("#FiscalYearForSaleId").kendoMultiColumnComboBox({
            dataTextField: "Year",
            dataValueField: "Id",
            height: 400,
            columns: [
                { field: "Year", title: "Year", width: 100 },
                { field: "YearStart", title: "Year Start", width: 100 },
                { field: "YearEnd", title: "Year End", width: 150 }
            ],
            filter: "contains",
            filterFields: ["YearStart", "YearEnd", "Remarks"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetFiscalYearForSaleList"
                }
            },
            placeholder: "Select Fiscal Year For Sale", // Set the placeholder
            value: "",
            change: function (e) {

                var selectedItem = this.dataItem(this.select()); // Get selected item from the ComboBox

                if (selectedItem) {
                    fYear = selectedItem.Year;
                    // Update YearStart and YearEnd fields with the selected item's YearStart and YearEnd values
                    $("#YearStart").val(selectedItem.YearStart);
                    $("#YearEnd").val(selectedItem.YearEnd);
                }
            },
            dataBound: function (e) {
                if (getFiscalYearForSaleId) {
                    this.value(parseInt(getFiscalYearForSaleId));
                }
            }
        }).data("kendoMultiColumnComboBox");
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
                    url: "/DMS/SalePersonYearlyTarget/GetGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false
                },
                parameterMap: function (options) {

                    if (options.sort) {
                        options.sort.forEach(function (param) {
                            if (param.field === "YearlyTarget") {
                                param.field = "H.YearlyTarget";
                            }
                            
                            
                            if (param.field === "SelfSaleCommissionRate") {
                                param.field = "H.SelfSaleCommissionRate";
                            }
                            if (param.field === "OtherSaleCommissionRate") {
                                param.field = "H.OtherSaleCommissionRate";
                            }
                            if (param.field === "YearStart" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "H.YearStart";
                            }
                            if (param.field === "YearEnd" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "H.YearEnd";
                            }

                            if (param.field === "Status") {
                                let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";

                                if (statusValue.startsWith("p")) {
                                    param.value = 1;
                                } else if (statusValue.startsWith("n")) {
                                    param.value = 0;
                                } else {
                                    param.value = null;
                                }

                                param.field = "H.IsPost";
                                param.operator = "eq";
                            }

                        });
                    }

                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (param) {


                            if (param.field === "YearlyTarget") {
                                param.field = "H.YearlyTarget";
                            }
                            if (param.field === "SelfSaleCommissionRate") {
                                param.field = "H.SelfSaleCommissionRate";
                            }
                            if (param.field === "OtherSaleCommissionRate") {
                                param.field = "H.OtherSaleCommissionRate";
                            }
                            if (param.field === "YearStart" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "H.YearStart";
                            }
                            if (param.field === "YearEnd" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "H.YearEnd";
                            }
                          
                            if (param.field === "Status") {
                                let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";

                                if (statusValue.startsWith("p")) {
                                    param.value = 1;
                                } else if (statusValue.startsWith("n")) {
                                    param.value = 0;
                                } else {
                                    param.value = null;
                                }

                                param.field = "H.IsPost";
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
            },
            model: {

                fields: {
                    InvoiceDateTime: { type: "date" },
                    DeliveryDate: { type: "date" },
                    GrandTotalAmount: { type: "number" },
                    GrandTotalSDAmount: { type: "number" },
                    GrandTotalVATAmount: { type: "number" }
                }
            }
            ,
            aggregate: [
                { field: "GrandTotalAmount", aggregate: "sum" },
                { field: "GrandTotalSDAmount", aggregate: "sum" },
                { field: "GrandTotalVATAmount", aggregate: "sum" }
            ]
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
                fields: ["YearlyTarget", "SelfSaleCommissionRate", "OtherSaleCommissionRate", "YearStart", "YearEnd","Status"]
            },
            excel: {
                fileName: "Products.xlsx",
                filterable: true
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
                                <a href="/DMS/SalePersonYearlyTarget/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                                    <i class="fas fa-pencil-alt"></i>
                                </a>`;
                    }
                },


                { field: "Id", width: 50, hidden: true, sortable: true },
                { field: "YearlyTarget", title: "YearlyTarget", sortable: true, width: 200 },
                { field: "SelfSaleCommissionRate", title: "Self Sale Commission Rate", sortable: true, width: 200 },
                { field: "OtherSaleCommissionRate", title: "Other Sale Commission Rate", sortable: true, width: 200 },
                { field: "YearStart", title: "Year Start", sortable: true, width: 250 },
                { field: "YearEnd", title: "Year End", sortable: true, width: 200 },
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

    function save($table) {

        var isDropdownValid1 = CommonService.validateDropdown("#SalePersonId", "#titleError1", "Sale person is required");
        var isDropdownValid2 = CommonService.validateDropdown("#FiscalYearForSaleId", "#titleError2", "Fiscal Year is required");
        var isDropdownValid = isDropdownValid1 && isDropdownValid2;
        var validator = $("#frmEntry").validate();
        var model = serializeInputs("frmEntry");

        model.Year = fYear;
        var result = validator.form();

        if (!result || !isDropdownValid) {
            if (!result) {
                validator.focusInvalid();
            }
            return;
        }

        var SalePersonYTDetails = [];
        var operation = $("#Operation").val();

        if (operation == 'add') {
            $('#SalePersonVisitDetails .card-body').each(function () {
                var row = $(this);

                var detail = {
                    Id: row.find('input[name$=".Id"]').val(),
                    SalePersonYearlyTargetId: row.find('input[name$=".SalePersonYearlyTargetId"]').val(),
                    SalePersonId: row.find('input[name$=".SalePersonId"]').val(),
                    MonthName: row.find('input[name$=".MonthName"]').val(),
                    MonthStart: row.find('input[name$=".MonthStart"]').val(),
                    MonthEnd: row.find('input[name$=".MonthEnd"]').val(),
                    MonthId: row.find('input[name$=".MonthEnd"]').val(),
                    MonthlyTarget: row.find('input[name$=".MonthlyTarget"]').val(),
                    SelfSaleCommissionRate: row.find('input[name$=".SelfSaleCommissionRate"]').val(),
                    OtherSaleCommissionRate: row.find('input[name$=".OtherSaleCommissionRate"]').val(),
                    Year: fYear
                };


                SalePersonYTDetails.push(detail);
            });
        }
        else {

            //$("#dtHeader").hide();

            $('.fiscalYearRow').each(function () {
                var row = $(this);


                var detail = {
                    Id: row.find('input[name$=".Id"]').val(),
                    SalePersonYearlyTargetId: row.find('input[name$=".SalePersonYearlyTargetId"]').val(),
                    SalePersonId: row.find('input[name$=".SalePersonId"]').val(),
                    MonthName: row.find('input[name$=".MonthName"]').val(),
                    MonthStart: row.find('input[name$=".MonthStart"]').val(),
                    MonthEnd: row.find('input[name$=".MonthEnd"]').val(),
                    MonthId: row.find('input[name$=".MonthEnd"]').val(),
                    MonthlyTarget: row.find('input[name$=".MonthlyTarget"]').val(),
                    SelfSaleCommissionRate: row.find('input[name$=".SelfSaleCommissionRate"]').val(),
                    OtherSaleCommissionRate: row.find('input[name$=".OtherSaleCommissionRate"]').val(),
                    Year: fYear
                };


                SalePersonYTDetails.push(detail);
            });
        }

        model.salePersonYearlyTargetDetailList = SalePersonYTDetails;


        model.YearlyTarget = model.YearlyTarget.replace(/,/g, '');
        model.SelfSaleCommissionRate = model.SelfSaleCommissionRate.replace(/,/g, '');
        model.OtherSaleCommissionRate = model.OtherSaleCommissionRate.replace(/,/g, '');

        var url = "/DMS/SalePersonYearlyTarget/CreateEdit";

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
                //$(".divSave").hide();
                //$(".divUpdate").show();
                //$("#Id").val(result.Id);
                //$("#Operation").val("update");

                //$("#CreatedBy").val(result.Data.CreatedBy);
                //$("#CreatedOn").val(result.Data.CreatedOn);
                window.location.href = "/DMS/SalePersonYearlyTarget/Edit/" + result.Data.Id;
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
        var filteredData = [];
        var dataSource = $("#GridDataList").data("kendoGrid").dataSource;
        var rowData = dataSource.view().filter(x => IDs.includes(x.Id));
        filteredData = rowData.filter(x => x.IsPost === "True" && IDs.includes(x.Id));

        if (filteredData.length > 0) {
            ShowNotification(3, "Data has already been Posted.");
            return;
        }

        var url = "/DMS/SalePersonYearlyTarget/MultiplePost";

        CommonAjaxService.multiplePost(url, model, postDone, fail);
    };


    function postDone(result) {

        var grid = $('#GridDataList').data('kendoGrid');
        if (grid) {
            grid.dataSource.read();
        }
        if (result.Status == 200) {
            ShowNotification(1, result.Message);
            setTimeout(function () {
                window.location.reload();
            }, 600);
        }
        else if (result.Status == 400) {
            ShowNotification(3, result.Message);
        }
        else {
            ShowNotification(2, result.Message);
        }
    };
    function fail(err) {

        console.log(err);
        ShowNotification(3, "Something gone wrong");
    };
    function Visibility(action) {
        $('#frmEntry').find(':input').prop('readonly', action);
        $('#frmEntry').find('table, table *').prop('disabled', action);
        $('#frmEntry').find(':input[type="button"]').prop('disabled', action);
        $('#frmEntry').find(':input[type="checkbox"]').prop('disabled', action);
        $('#frmEntry').find('select').prop('disabled', action);
    };

    $('#YearlyTarget').on('change', function () {
        let yearlyTargetValue = Number($("#YearlyTarget").val());
        let updateMonthlyValue = (yearlyTargetValue / 12.0).toFixed(3)
        $(".item_MonthlyTarget").each(function () {
            let itemMonthlyTarget = $(this);
            itemMonthlyTarget.val(updateMonthlyValue)
        });
    })


    $('#SelfSaleCommissionRate').on('change', function () {
        let SelfSaleCommissionRateValue = Number($("#SelfSaleCommissionRate").val());
        $(".item_SelfSaleCommissionRate").each(function () {
            $(this).val(SelfSaleCommissionRateValue)
        });
    })


    $('#OtherSaleCommissionRate').on('change', function () {
        let OtherSaleCommissionRateValue = Number($("#OtherSaleCommissionRate").val());
        $(".item_OtherSaleCommissionRate").each(function () {
            $(this).val(OtherSaleCommissionRateValue)
        });
    })

    return {
        init: init
    }


}(CommonService, CommonAjaxService);


var SalePersonMonthlyAchievementController = function (CommonService, CommonAjaxService) {
    
    var getSalePersonId = 0;

    var init = function () {

        getSalePersonId = $("#SalePersonId").val() || 0;
        

        GetGridDataList();

        var SalePersonComboBox = $("#cmboSalePerson").kendoMultiColumnComboBox({
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
            placeholder: "Select Person",
            value: "",
            dataBound: function (e) {
                if (getSalePersonId) {
                    this.value(parseInt(getSalePersonId));
                }
            },
            change: function (e) {

            }
        }).data("kendoMultiColumnComboBox");

        var myWindow = $("#myWindow").kendoWindow({
            width: "900px",
            title: "Yearly Target Achievement Process",
            visible: false,
            actions: ["Close"]
        }).data("kendoWindow");

        $("#txtYear").kendoDatePicker({
            start: "decade",
            depth: "decade",
            format: "yyyy",
            value: new Date()
        });
        $("#btnAdd").on("click", function () {
            rowAdd(detailTable);
        });

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

        $('.processButton').on('click', function () {
            $('#myWindow').show();
            myWindow.center().open();
        });

        $('#cancelButton').on('click', function () {
            $('#myWindow').hide();
            myWindow.center().close();
        });

        $('#prcsButton').on('click', function () {           


            Confirmation("Are you sure? Do You Want to Process Data?",
                function (result) {

                    if (result) {
                        ProcessData();
                    }
                });

            $('#myWindow').hide();
            myWindow.center().close();
        });
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
                    url: "/DMS/SalePersonMonthlyAchievement/GetSalePersonMonthlyAchievementGrid",
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
                            if (param.field === "SalePersonName") {
                                param.field = "P.Name";
                            }
                            if (param.field === "Year") {
                                param.field = "H.Year";
                            }
                            if (param.field === "MonthStart") {
                                param.field = "H.MonthStart";
                            }
                            if (param.field === "MonthEnd") {
                                param.field = "H.MonthEnd";
                            }
                            if (param.field === "MonthlySales") {
                                param.field = "H.MonthlySales";
                            }
                            if (param.field === "MonthlyTarget") {
                                param.field = "H.MonthlyTarget";
                            }
                            if (param.field === "SelfSaleCommissionRate") {
                                param.field = "H.SelfSaleCommissionRate";
                            }
                            if (param.field === "OtherSaleCommissionRate") {
                                param.field = "H.OtherSaleCommissionRate";
                            }
                        });
                    }

                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (param) {
                            if (param.field === "Id") {
                                param.field = "H.Id";
                            }
                            if (param.field === "SalePersonName") {
                                param.field = "P.Name";
                            }
                            if (param.field === "Year") {
                                param.field = "H.Year";
                            }
                            if (param.field === "MonthStart") {
                                param.field = "H.MonthStart";
                            }
                            if (param.field === "MonthEnd") {
                                param.field = "H.MonthEnd";
                            }
                            if (param.field === "MonthlySales") {
                                param.field = "H.MonthlySales";
                            }
                            if (param.field === "MonthlyTarget") {
                                param.field = "H.MonthlyTarget";
                            }
                            if (param.field === "SelfSaleCommissionRate") {
                                param.field = "H.SelfSaleCommissionRate";
                            }
                            if (param.field === "OtherSaleCommissionRate") {
                                param.field = "H.OtherSaleCommissionRate";
                            }
                        });
                    }
                    return options;
                }
            },
            batch: true,
            schema: {
                data: "Items",
                total: "TotalCount",
                model: {

                    fields: {

                    }
                }
            }
        });

        $("#SalePersonMonthlyAchievementGrid").kendoGrid({
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
                        gt: "Is greater then",
                        lt: "Is less then"
                    }
                }
            },
            sortable: true,
            resizable: true,
            reorderable: true,
            groupable: true,
            toolbar: ["excel", "pdf", "search"],
            search: {
                fields: ["Id", "SalePersonName", "Year", "MonthStart", "MonthEnd", "MonthlySales", "MonthlyTarget", "SelfSaleCommissionRate","OtherSaleCommissionRate"]
            },
            excel: {
                fileName: "SalePersonMonthlyAchievement.xlsx",
                filterable: true
            },
            //search: {
            //    fields: ["Code", "Name", "ZipCode"]
            //},
            columns: [
                {
                    selectable: true, width: 50
                },
                {
                    title: "Action",
                    width: 150,
                    template: function (dataItem) {
                        return `
                            <a href="/DMS/SalePersonMonthlyAchievement/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit" title="Edit Areas">
                                <i class="fas fa-pencil-alt"></i>
                            </a>`;
                    }
                },
                {
                    field: "Id", width: 150, hidden: true, sortable: true
                },
                {
                    field: "BranchId", width: 150, hidden: true, sortable: true
                },
                {
                    field: "MonthId", width: 150, hidden: true, sortable: true
                },
                {
                    field: "SalePersonId", width: 150, hidden: true, sortable: true
                },
                {
                    field: "SalePersonName", title: "Sale Person", sortable: true
                },
                {
                    field: "MonthlySales", title: "Monthly Sales", sortable: true
                },
                {
                    field: "MonthlyTarget", title: "Monthly Target", sortable: true
                },
                {
                    field: "SelfSaleCommissionRate", title: "Commission Rate", sortable: true
                },
                {
                    field: "OtherSaleCommissionRate", title: "Other Commission Rate", sortable: true
                },
                {
                    field: "Year", title: "Year", sortable: true
                },
                {
                    field: "MonthStart", title: "Month Start", sortable: true
                },
                {
                    field: "MonthEnd", title: "Month End", sortable: true
                }
            ],

            editable: false,
            selectable: "multiple row",
            navigatable: true,
            columnMenu: true
        });

        //Grid Select all checkbox
        $("#SalePersonMonthlyAchievementGrid").on("click", ".k-header .k-checkbox", function () {
            var isChecked = $(this).is(":checked");
            var grid = $("#SalePersonMonthlyAchievementGrid").data("kendoGrid");
            if (isChecked) {
                grid.tbody.find(".k-checkbox").prop("checked", true);
            } else {
                grid.tbody.find(".k-checkbox").prop("checked", false);
            }
        });
    };

    $('body').on('click', '.btnDelete-SalePersonMonthlyAchievement', function (e) {
        
        var data = $(this).attr('id');
        var id = data.split('~')[0];
        var url = "/SalePersonMonthlyAchievement/DeleteItem?id=" + id + "";

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
            placeholder: "Select Person",
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

    function SelectData() {
        
        var IDs = [];

        var selectedRows = $("#SalePersonMonthlyAchievementGrid").data("kendoGrid").select();

        if (selectedRows.length === 0) {
            ShowNotification(3, "You are requested to Select checkbox!");
            return;
        }

        selectedRows.each(function () {
            var dataItem = $("#SalePersonMonthlyAchievementGrid").data("kendoGrid").dataItem(this);
            IDs.push(dataItem.Id);
        });

        var model = {
            IDs: IDs
        };

        var url = "/DMS/Areas/Delete";

        CommonAjaxService.deleteData(url, model, deleteDone, saveFail);
    };
    function ProcessData() {
         
        var salePersonId = $("#cmboSalePerson").val();
        var date = $("#txtYear").val();

        if (salePersonId === 0 || salePersonId === null) {
            ShowNotification(3, "Please Select Sale Person!");
            return;
        }
        if (date === 0 || date === null) {
            ShowNotification(3, "Please Select Date!");
            return;
        }        

        var model = {
            SalePersonId: salePersonId,
            Year: date
        };

        var url = "/DMS/SalePersonMonthlyAchievement/ProcessData";

        CommonAjaxService.finalSave(url, model, saveDone, saveFail);

    }
    function save() {
        

        var isDropdownValid = CommonService.validateDropdown("#SalePersonId", "#titleError1", "Sale person is required");

        var validator = $("#SalePersonMonthlyAchievement_Form").validate();
        var person = serializeInputs("SalePersonMonthlyAchievement_Form");

        var result = validator.form();
        if (!result || !isDropdownValid) {
            if (!result) {
                validator.focusInvalid();
            }
            return;
        }
        var url = "/DMS/SalePersonMonthlyAchievement/CreateEdit"

        // Call the save service
        CommonAjaxService.finalSave(url, person, saveDone, saveFail);
    }

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
                var multiColumnComboBox = $("#cmboSalePerson").data("kendoMultiColumnComboBox");
                multiColumnComboBox.value("");
                $("#txtYear").val("");
                var grid = $("#SalePersonMonthlyAchievementGrid").data("kendoGrid");
                grid.dataSource.read();
                grid.refresh();
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
        
        
        ShowNotification(3, result.message);
    }

    function deleteDone(result) {
        
        var grid = $('#SalePersonMonthlyAchievementGrid').data('kendoGrid');
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
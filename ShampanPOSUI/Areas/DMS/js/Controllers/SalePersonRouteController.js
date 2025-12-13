var SalePersonRouteController = function (CommonService, CommonAjaxService) {
    var getRouteId = 0;
    var getBranchId = 0;
    var getSalePersonId = 0;
    var init = function () {
        
        getRouteId = $("#RouteId").val() || 0;
        getBranchId = $("#BranchId").val() || 0;
        getSalePersonId = $("#SalePersonId").val() || 0;
        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';

        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();
        };      

        //GetBranchProfileComboBox();
        
        var isIndex = $("#IsIndex").val().toLowerCase() === "true";
        
        if (!isIndex) {
            GetSalePersonComboBox();
            //updateRouteComboBox(getSalePersonId, getBranchId)
            GetRouteComboBox();
        }        
        if ($("#Operation").val() == "update") {
            //updateRouteComboBox(getSalePersonId, getBranchId)
            GetRouteComboBox();
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
    };


    function GetRouteComboBox() {
        var RouteComboBox = $("#RouteId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,            
            filter: "contains",
            filterFields: ["Name"],
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
            }
        }).data("kendoMultiColumnComboBox");
    };
    function GetSalePersonComboBox() {
        
        var SalePersonComboBox = $("#SalePersonId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,            
            filter: "contains",
            filterFields: ["Code", "Name"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetSalePersonList"
                }
            },
            placeholder: "Select SalePerson ", // Set the placeholder
            value: "",
            dataBound: function (e) {
                
                if (getSalePersonId) {
                    this.value(parseInt(getSalePersonId));
                }
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

        var url = "/DMS/SalePersonRoute/Delete";

        CommonAjaxService.deleteData(url, model, deleteDone, saveFail);
    };

    var GetGridDataList = function () {
        
        //var val = $("#SalePersonId").val();
        //
        //if (val == 0 || val == null) {
        //    salePersonId = 0;
        //}
        //else {
        //    salePersonId = val;
        //}

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
                                param.field = "H.IsActive";
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
            toolbar: ["excel", "pdf", "search"],
            search: ["SalePersonName", "BranchName","RouteName"],
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
                { field: "SalePersonName", title: "SalePerson", sortable: true, width: 200 },
                { field: "BranchName", title: "Branch", sortable: true, width: 200 },
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

    function save() {
        
        var validator = $("#frmEntry").validate();
        var model = serializeInputs("frmEntry");
        model.SalePersonId = getSalePersonId;
        var result = validator.form();
        var isDropdownValid1 = CommonService.validateDropdown("#RouteId", "#titleError1", "Route is required");

        if (!result || !isDropdownValid1) {
            if (!result) {
                validator.focusInvalid();
            }
            return;
        }

        if ($('#IsActive').prop('checked')) {
            model.IsActive = true;
        }

        var url = "/DMS/SalePersonRoute/CreateEdit";

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
        
        
        ShowNotification(3, "Something went wrong");
    };

    return {
        init: init
    };

}(CommonService, CommonAjaxService);

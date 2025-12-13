var SalePersonCampaignTargetController = function (CommonService, CommonAjaxService) {

    var getSalePersonId = 0;
    var getCampaignId = 0;

    var init = function () {

        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';

        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();
        };      

        var IsPost = $('#IsPost').val();
        if (IsPost === 'True') {
            Visibility(true);
        };

        getSalePersonId = $("#SalePersonId").val() || 0;
        getCampaignId = $("#CampaignId").val() || 0;


        GetCampaignComboBox();
        GetSalePersonComboBox();     


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
                            var url = "/DMS/SalePersonCampaignTarget/MultiplePost";
                            CommonAjaxService.multiplePost(url, model, postDone, fail);
                        }
                    }
                });
        });


    };

    function Visibility(action) {
        $('#frmEntry').find(':input').prop('readonly', action);
        $('#frmEntry').find('table, table *').prop('disabled', action);
        $('#frmEntry').find(':input[type="button"]').prop('disabled', action);
        $('#frmEntry').find(':input[type="checkbox"]').prop('disabled', action);
        $('#frmEntry').find('select').prop('disabled', action);
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
    };

    function GetCampaignComboBox() {
        var CampaignComboBox = $("#CampaignId").kendoMultiColumnComboBox({
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
                    read: "/Common/Common/GetCampaignList"
                }
            },
            placeholder: "Select Campaign",
            value: "",
            dataBound: function (e) {
                if (getCampaignId) {
                    this.value(parseInt(getCampaignId));
                }
            },
            change: function (e) {
                
            }
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
        var filteredData = [];
        var dataSource = $("#GridDataList").data("kendoGrid").dataSource;
        var rowData = dataSource.view().filter(x => IDs.includes(x.Id));
        filteredData = rowData.filter(x => x.IsPost === true && IDs.includes(x.Id));

        if (filteredData.length > 0) {
            ShowNotification(3, "Data has already been Posted.");
            return;
        }

        var url = "/DMS/SalePersonCampaignTarget/MultiplePost";

        CommonAjaxService.multiplePost(url, model, postDone, fail);
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
                    url: "/DMS/SalePersonCampaignTarget/GetGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false
                },
                parameterMap: function (options) {
                    
                    if (options.sort) {
                        options.sort.forEach(function (param) {
                            if (param.field === "SalePersonName") {
                                param.field = "SP.Name";
                            }
                            if (param.field === "CampaignName") {
                                param.field = "cam.Name";
                            }
                            if (param.field === "StartDate" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "H.StartDate";
                            }
                            if (param.field === "EndDate" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "H.EndDate";
                            }
                            if (param.field === "TotalTarget") {
                                param.field === "H.TotalTarget"
                            }
                            if (param.field === "TotalSale") {
                                param.field = "H.TotalSale";
                            }
                            if (param.field === "BranchName") {
                                param.field = "Br.Name";
                            }
                            if (param.field === "SelfSaleCommissionRate") {
                                param.field = "H.SelfSaleCommissionRate";
                            }
                            if (param.field === "OtherSaleCommissionRate") {
                                param.field = "H.OtherSaleCommissionRate";
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
                            if (param.field === "SalePersonName") {
                                param.field = "SP.Name";
                            }
                            if (param.field === "CampaignName") {
                                param.field = "cam.Name";
                            }
                            if (param.field === "StartDate" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "H.StartDate";
                            }
                            if (param.field === "EndDate" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "H.EndDate";
                            }
                            if (param.field === "TotalTarget") {
                                param.field === "H.TotalTarget"
                            }
                            if (param.field === "TotalSale") {
                                param.field = "H.TotalSale";
                            }
                            if (param.field === "BranchName") {
                                param.field = "Br.Name";
                            }
                            if (param.field === "SelfSaleCommissionRate") {
                                param.field = "H.SelfSaleCommissionRate";
                            }
                            if (param.field === "OtherSaleCommissionRate") {
                                param.field = "H.OtherSaleCommissionRate";
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
                    StartDate: { type: "date" },
                    EndDate: { type: "date" },
                    TotalTarget: { type: "number" },
                    TotalSale: { type: "number" },
                    SelfSaleCommissionRate: { type: "number" },
                    OtherSaleCommissionRate: { type: "number" }
                }
            }
            ,
            aggregate: [
                { field: "TotalTarget", aggregate: "sum" },
                { field: "TotalSale", aggregate: "sum" },
                { field: "SelfSaleCommissionRate", aggregate: "sum" },
                { field: "OtherSaleCommissionRate", aggregate: "sum" }
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
                fields: ["SalePersonName", "CampaignName", "StartDate", "TotalTarget", "TotalSale", "SelfSaleCommissionRate", "OtherSaleCommissionRate", "Status", "BranchName"]
            },
            excel: {
                fileName: "SalePersonCampaignTarget.xlsx",
                filterable: true
            },
            pdf: {
                fileName: `SalePersonCampaignTarget_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`,
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


                var fileName = `SalePersonCampaignTarget_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`;

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
                    width: 60,
                    template: function (dataItem) {
                        
                        return `
                                <a href="/DMS/SalePersonCampaignTarget/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                                    <i class="fas fa-pencil-alt"></i>
                                </a>`;
                    }
                },
                { field: "Id", width: 50, hidden: true, sortable: true },
                {
                    field: "StartDate", title: "Start Date", sortable: true, width: 150, template: '#= kendo.toString(kendo.parseDate(StartDate), "yyyy-MM-dd") #',
                    filterable:
                    {
                        ui: "datepicker"
                    }
                },
                {
                    field: "EndDate", title: "End Date", sortable: true, width: 150, template: '#= kendo.toString(kendo.parseDate(EndDate), "yyyy-MM-dd") #',
                    filterable:
                    {
                        ui: "datepicker"
                    }
                }  ,
                { field: "SalePersonName", title: "Sale Person Name", sortable: true, width: 200 },
                { field: "CampaignName", title: "Campaign Name", sortable: true, width: 200 },
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
                ,
                {
                    field: "TotalTarget",
                    title: "Total Target",
                    sortable: true,
                    width: 150,
                    aggregates: ["sum"],
                    format: "{0:n2}",
                    footerTemplate: "#=kendo.toString(sum, 'n2')#",
                    groupFooterTemplate: "#=kendo.toString(sum, 'n2')#",
                    attributes: { style: "text-align: right;" }
                }
                ,
                {
                    field: "TotalSale",
                    title: "Total Sale",
                    sortable: true,
                    width: 150,
                    aggregates: ["sum"],
                    format: "{0:n2}",
                    footerTemplate: "#=kendo.toString(sum, 'n2')#",
                    groupFooterTemplate: "#=kendo.toString(sum, 'n2')#",
                    attributes: { style: "text-align: right;" }
                }                
                ,
                {
                    field: "SelfSaleCommissionRate",
                    title: "Self Sale Commission Rate",
                    sortable: true,
                    width: 220,
                    aggregates: ["sum"],
                    format: "{0:n2}",
                    footerTemplate: "#=kendo.toString(sum, 'n2')#",
                    groupFooterTemplate: "#=kendo.toString(sum, 'n2')#",
                    attributes: { style: "text-align: right;" }
                },
                {
                    field: "OtherSaleCommissionRate",
                    title: "Other Sale Commission Rate",
                    sortable: true,
                    width: 220,
                    aggregates: ["sum"],
                    format: "{0:n2}",
                    footerTemplate: "#=kendo.toString(sum, 'n2')#",
                    groupFooterTemplate: "#=kendo.toString(sum, 'n2')#",
                    attributes: { style: "text-align: right;" }
                },
               
                { field: "BranchName", title: "Branch Name", sortable: true, width: 200 }

            ],
            editable: false,
            selectable: "multiple row",
            navigatable: true,
            columnMenu: true
        });

    };

    function save() {

        var isDropdownValid1 = CommonService.validateDropdown("#SalePersonId", "#titleError1", "Sale Person is required");
        var isDropdownValid2 = CommonService.validateDropdown("#CampaignId", "#titleError2", "Campaign is required");
        var isDropdownValid = isDropdownValid1 && isDropdownValid2;
        var validator = $("#frmEntry").validate();
        var model = serializeInputs("frmEntry");

        var result = validator.form();

        if (!result || !isDropdownValid) {
            if (!result) {
                validator.focusInvalid();
            }
            return;
        }
        model.OtherSaleCommissionRate = model.OtherSaleCommissionRate.replace(/,/g, '');
        model.TotalTarget = model.TotalTarget.replace(/,/g, '');
        model.TotalSale = model.TotalSale.replace(/,/g, '');
        model.SelfSaleCommissionRate = model.SelfSaleCommissionRate.replace(/,/g, '');

        var url = "/DMS/SalePersonCampaignTarget/CreateEdit";

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

    function postDone(result) {
        
        var grid = $('#GridDataList').data('kendoGrid');
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

    function fail(err) {
        
        
        ShowNotification(3, "Something gone wrong");
    };

    return {
        init: init
    }


}(CommonService, CommonAjaxService);


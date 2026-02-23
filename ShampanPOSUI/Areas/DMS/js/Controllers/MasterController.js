var MasterController = function (CommonService, CommonAjaxService) {

    var init = function () {

        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';

        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();
        }

        if (getOperation !== '') {
            GetMasterSupplierComboBox();
            InitSupplierProductGrid();
        }

        $('.btnsave').off('click').on('click', function (e) {
            e.preventDefault();

            var btn = $(this);
            btn.prop("disabled", true);

            Confirmation("Are you sure?", function (result) {
                if (result) {
                    save();
                } else {
                    btn.prop("disabled", false);
                }
            });
        });
    };

    // ================= SUPPLIER COMBO =================

    function GetMasterSupplierComboBox() {
        debugger;
        $("#MasterSupplierId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [
                { field: "Code", title: "Code", width: 100 },
                { field: "Name", title: "Name", width: 150 }
            ],
            filter: "contains",
            autoBind: false,
            dataSource: {
                transport: {
                    read: {
                        url: "/Common/Common/GetMasterSupplierList",
                        dataType: "json"
                    }
                }
            },
            placeholder: "Select Supplier",

            change: function () {

                var supplierId = this.value();
                var grid = $("#departments").data("kendoGrid");

                if (!supplierId) {
                    if (grid) grid.dataSource.data([]);
                    return;
                }

                if (grid) {
                    grid.dataSource.read();
                }
            }

        }).data("kendoMultiColumnComboBox")
            .dataSource.read();
    }

    // ================= GRID =================

    function InitSupplierProductGrid() {
        debugger;
        $("#departments").kendoGrid({
            autoBind: false,
            dataSource: {
                transport: {
                    read: {
                        url: "/Common/Common/GetSupplierProductList",
                        dataType: "json",
                        data: function () {
                            return {
                                value: $("#MasterSupplierId").val()
                            };
                        }
                    }
                },
                schema: {
                    data: function (res) { return res; },
                    total: function (res) { return res.length; }
                },
                pageSize: 10
            },
            pageable: true,
            sortable: true,
            resizable: true,
            columns: [
                { field: "MasterItemCode", title: "Product Code", width: 150 },
                { field: "MasterProductId", title: "Product",hidden:true, width: 120 },
                { field: "MasterItemName", title: "Master Item Name", width: 120 },
                { field: "MasterItemGroupName", title: "Master Item Group Name", width: 120 },
                { field: "MasterItemGroupId", title: "Master Item Group", hidden: true, width: 150 }
            ]
        });
    }



    var GetGridDataList = function () {
        debugger;
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            autoSync: true,
            pageSize: 10,
            //group: { field: "MasterSupplierName" },
            transport: {
                read: {
                    url: "/DMS/MasterSupplierItem/GetGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false
                },
                parameterMap: function (options) {

                    if (options.sort) {
                        options.sort.forEach(function (param) {
                            if (param.field === "Id") {
                                param.field = "M.Id";
                            }

                            if (param.field === "MasterSupplierName") {
                                param.field = "s.Name";
                            }
                            //if (param.field === "MasterProductName") {
                            //    param.field = "p.Name";
                            //}

                            if (param.field === "Status") {
                                let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";

                                if (statusValue.startsWith("a")) {
                                    param.value = 1;
                                } else if (statusValue.startsWith("i")) {
                                    param.value = 0;
                                } else {
                                    param.value = null;
                                }

                                param.field = "M.IsActive";
                                param.operator = "eq";
                            }
                        });
                    }

                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (param) {
                            if (param.field === "Id") {
                                param.field = "M.Id";
                            }

                            if (param.field === "MasterSupplierName") {
                                param.field = "s.Name";
                            }
                            //if (param.field === "MasterProductName") {
                            //    param.field = "p.Name";
                            //}

                            if (param.field === "Status") {
                                let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";

                                if (statusValue.startsWith("a")) {
                                    param.value = 1;
                                } else if (statusValue.startsWith("i")) {
                                    param.value = 0;
                                } else {
                                    param.value = null;
                                }

                                param.field = "M.IsActive";
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
                fields: ["MasterSupplierName"]
            },
            excel: {
                fileName: "MasterSupplierItem.xlsx",
                filterable: true
            },
            pdf: {
                fileName: `MasterSupplierItem_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`,
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


                var fileName = `MasterSupplierItem_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`;

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
                //{
                //    selectable: true, width: 35
                //},
                {
                    title: "Action",
                    width: 10,
                    template: function (dataItem) {

                        return `
            <a href="/DMS/MasterSupplierItem/Edit/${dataItem.MasterSupplierId}" class="btn btn-primary btn-sm mr-2 edit" title="Edit Credit Limit">
                <i class="fas fa-pencil-alt"></i>
            </a>`;
                    }
                },
                { field: "Id", width: 50, hidden: true, sortable: true },
                {
                    field: "MasterSupplierName", title: "Master Supplier Name", sortable: true, width: 200
                },
                //{ field: "MasterProductName", title: "Master Product Name", sortable: true, width: 200 },

                {
                    field: "Status", title: "Status", sortable: true, width: 100, hidden: true,
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
                },


            ],
            editable: false,
            selectable: "multiple row",
            navigatable: true,
            columnMenu: true
        });

    };



    // ================= SAVE =================

    function save() {

        var validator = $("#frmEntry").validate();
        var model = serializeInputs("frmEntry");

        if (!validator.form()) {
            validator.focusInvalid();
            return;
        }

        if (!model.MasterSupplierId) {
            ShowNotification(3, "Please select supplier first");
            return;
        }

        var grid = $("#departments").data("kendoGrid");
        var gridData = grid.dataSource.view();

        var details = [];

        for (var i = 0; i < gridData.length; i++) {

            details.push({
                Id: gridData[i].MasterProductId,
                IsArchive: false
            });
        }

        model.SupplierId = model.MasterSupplierId;   
        model.MasterItemList = details;              

        var url = "/DMS/MasterSupplierItem/CreateEditSupplier";
        CommonAjaxService.finalSave(url, model, saveDone, saveFail);
    }

    function saveDone(result) {

        $("#Id").val(result.Data?.Id || 0);
        $("#Operation").val("update");

        if (result.Success) {
            ShowNotification(1, "Save Successfully");
        } else {
            ShowNotification(3, "Save Failed");
        }

        $(".btnsave").prop("disabled", false);
    }

    function saveFail() {
        ShowNotification(3, "Query Exception!");
        $(".btnsave").prop("disabled", false);
    }

    return {
        init: init
    };

}(CommonService, CommonAjaxService);
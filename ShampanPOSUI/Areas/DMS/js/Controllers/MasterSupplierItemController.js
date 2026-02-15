var MasterSupplierItemController = function (CommonService, CommonAjaxService) {
    var currentMasterItemGroupId = 0;
   
    var init = function () {

        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';
        var getgroup = $("#MasterItemGroupId").val() || 0;
        var getMasterSupplierId = $("#MasterSupplierId").val() || 0;

        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();
        };

        if (getOperation !== '') {

            GetMasterSupplierComboBox();
            GetProductGroupComboBox();
            InitItemsGrid();
            InitAddedItemGrid();
        };
        


        //if (getMasterSupplierId > 0) {
        //    loadAddedItemsBySupplier();
        //}


        $('.btnsave').off('click').on('click', function (e) {
            e.preventDefault();
            debugger;
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
                window.location.href = "/DMS/MasterItem/NextPrevious?id=" + getId + "&status=Previous";
            }
        });
        $('#btnNext').click('click', function () {
            var getId = $('#Id').val();
            if (parseInt(getId) > 0) {
                window.location.href = "/DMS/MasterItem/NextPrevious?id=" + getId + "&status=Next";
            }
        });



    };

    function GetMasterSupplierComboBox() {
        debugger;
        var SupplierComboBox = $("#MasterSupplierId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [
                { field: "Code", title: "Code", width: 100 },
                { field: "Name", title: "Name", width: 150 }
            ],
            filter: "contains",
            filterFields: ["Code", "Name"],
            autoBind: false, // important
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
                var selectedItem = this.dataItem();
                if (selectedItem) {
                    getMasterSupplierId = selectedItem.Id;
                } else {
                    getMasterSupplierId = 0;
                }
            }
        }).data("kendoMultiColumnComboBox");


        // 🔥 force load data
        SupplierComboBox.dataSource.read().then(function () {

            if (getMasterSupplierId && parseInt(getMasterSupplierId) > 0) {
                SupplierComboBox.value(parseInt(getMasterSupplierId));
            }

        });
    }



    function GetProductGroupComboBox() {

        var combo = $("#MasterItemGroupId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            autoBind: false,
            filter: "contains",
            dataSource: {
                transport: {
                    read: {
                        url: "/Common/Common/GetMasterItemGroupList",
                        dataType: "json"
                    }
                }
            },
            change: function () {

                var groupId = this.value();
                var dataItem = this.dataItem();
                var grid = $("#departments").data("kendoGrid");

                if (!groupId) {
                    currentMasterItemGroupId = 0;
                    if (grid) grid.dataSource.data([]);
                    return;
                }

                currentMasterItemGroupId = parseInt(groupId);

                if (grid) {
                    grid.dataSource.read();
                }

                if (dataItem) {
                    $("#MasterItemGroupName").val(dataItem.Name);
                    $("#MasterItemGroupDescription").val(dataItem.Description);
                    $("#MasterItemGroupCode").val(dataItem.Code);
                }
            }

        }).data("kendoMultiColumnComboBox");
    }



    //function GetProductGroupComboBox() {

    //    var combo = $("#MasterItemGroupId").kendoMultiColumnComboBox({
    //        dataTextField: "Name",
    //        dataValueField: "Id",
    //        height: 400,
    //        columns: [
    //            { field: "Code", title: "Code", width: 100 },
    //            { field: "Name", title: "Name", width: 150 },
    //            { field: "Description", title: "Description", width: 150 },
    //        ],
    //        filter: "contains",
    //        filterFields: ["Code", "Name"],
    //        autoBind: false, // important
    //        dataSource: {
    //            transport: {
    //                read: {
    //                    url: "/Common/Common/GetMasterItemGroupList",
    //                    dataType: "json"
    //                }
    //            }
    //        },
    //        placeholder: "Select Product Group",

    //        change: function () {
    //            var dataItem = this.dataItem();
    //            var groupId = this.value();
    //            var grid = $("#departments").data("kendoGrid");

    //            if (!groupId || groupId < 1) {
    //                currentMasterItemGroupId = 0;
    //                if (grid) grid.dataSource.data([]);
    //                return;
    //            }

    //            currentMasterItemGroupId = groupId;

    //            if (grid) {
    //                grid.dataSource.read();
    //            }

    //            if (dataItem) {
    //                $("#MasterItemGroupName").val(dataItem.Name);
    //                $("#Description").val(dataItem.Description);
    //                $("#Code").val(dataItem.Code);
    //            }
    //        }

    //    }).data("kendoMultiColumnComboBox");


    //    // 🔥 Load data first
    //    combo.dataSource.read().then(function () {
    //        debugger;
    //        if (getgroup && parseInt(getgroup) > 0) {
    //            combo.value(parseInt(getgroup));

    //            // 🔥🔥🔥 THIS IS THE MAGIC LINE
    //            combo.trigger("change");
    //        }

    //    });
    //}


    function InitItemsGrid() {
        debugger;
        $("#departments").kendoGrid({
            autoBind: false,
            dataSource: {
                transport: {
                    read: {
                        url: "/Common/Common/GetItemList",
                        dataType: "json",
                        data: function () {
                            return {
                                value: currentMasterItemGroupId
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
            reorderable: true,
            groupable: true,
            columns: [
                { field: "Id", hidden: true },
                { field: "Code", title: "Code", width: 100 },
                { field: "Name", title: "Name", width: 150 },
                { field: "BanglaName", title: "Bangla Name", hidden: true, width: 150 },
                { field: "Description", title: "Description", hidden: true, width: 150 },
                { field: "UOMId", title: "UOM ID", hidden: true, width: 100 },
                { field: "HSCodeNo", title: "HS Code No", width: 150 },
                { field: "VATRate", title: "VAT Rate", width: 100 },
                { field: "SDRate", title: "SD Rate", width: 100 },
                {
                    title: "Action",
                    width: 90,
                    template: `
                    <button type="button" 
                            class="k-button k-primary addToDetails"
                            data-id="#: Id #"
                            data-code="#: Code #"
                            data-name="#: Name #"
                            data-bangla-name="#: BanglaName #"
                            data-description="#: Description #"
                            data-uom-id="#: UOMId #"
                            data-hs-code="#: HSCodeNo #"
                            data-vat-rate="#: VATRate #"
                            data-sd-rate="#: SDRate #">
                        Add
                    </button>`
                }
            ],


            dataBound: function () {
                $("#departments")
                    .off("click", ".addToDetails")
                    .on("click", ".addToDetails", function (e) {

                        e.preventDefault();

                        Addtolist({
                            Id: $(this).data("id"),
                            Code: $(this).data("code"),
                            Name: $(this).data("name"),
                            BanglaName: $(this).data("bangla-name"),
                            Description: $(this).data("description"),
                            UOMId: $(this).data("uom-id"),
                            HSCodeNo: $(this).data("hs-code"),
                            VATRate: $(this).data("vat-rate"),
                            SDRate: $(this).data("sd-rate"),
                            MasterItemGroupName: $("#MasterItemGroupName").val() || ''
                        });
                    });

            }

        });
    }

    function InitAddedItemGrid() {

        var iteamDetailList = JSON.parse($("#iteamDetailList").val() || "[]");

        console.log("Grid Data:", iteamDetailList); 

        $("#AddedItemGrid").kendoGrid({
            dataSource: {
                data: iteamDetailList,
                pageSize: 20,
                schema: {
                    model: {
                        id: "Id",   
                        fields: {
                            Id: { type: "number" },
                            Code: { type: "string" },
                            Name: { type: "string" },
                            MasterItemGroupName: { type: "string" }
                        }
                    }
                }
            },
            columns: [
                { field: "ProductId", hidden: true },
                { field: "Code", title: "Code", width: 100 },
                { field: "Name", title: "Name", width: 150 },
                { field: "MasterItemGroupName", title: "Group", width: 150 },
                {
                    title: "Action",
                    width: 70,
                    template: `
                <button type="button"
                        class="k-button k-danger removeItem">
                    <i class="k-icon k-i-trash"></i>
                </button>`
                }
            ],

            dataBound: function () {

                $(".removeItem").off().on("click", function (e) {
                    e.preventDefault();


                    var grid = $("#AddedItemGrid").data("kendoGrid");


                    var tr = $(this).closest("tr");


                    grid.removeRow(tr);
                });
            }
        });
    }



    function Addtolist(item) {
        debugger;

        var grid = $("#AddedItemGrid").data("kendoGrid");
        if (!grid) {
            kendo.alert("Added Item grid not initialized!");
            return;
        }

        var ds = grid.dataSource;

        // ✅ Correct duplicate check
        var exists = ds.data().some(function (x) {
            return x.Id === item.Id;
        });

        if (exists) {
            //kendo.alert("This supplier is already added!");
            ShowNotification(3, "This supplier is already added!");
            return;
        }

        // Add the new item to the grid, including all necessary fields
        ds.add({
            Id: item.Id,
            Code: item.Code,
            Name: item.Name,
            BanglaName: item.BanglaName,
            UOMId: item.UOMId,
            VATRate: item.VATRate,
            HSCodeNo: item.HSCodeNo,
            SDRate: item.SDRate,
            Description: item.Description,
            MasterItemGroupDescription: item.MasterItemGroupDescription,
            MasterItemGroupCode: item.MasterItemGroupCode,
            MasterItemGroupName: item.MasterItemGroupName,
            MasterItemGroupId: item.MasterItemGroupId
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
                    field: "MasterSupplierName", title: "Master Supplier Name",  sortable: true, width: 200
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





    function save() {
        debugger;
        var validator = $("#frmEntry").validate();
        var formData = new FormData();
        var model = serializeInputs("frmEntry");

        var result = validator.form();

        if (!result) {
            validator.focusInvalid();
            return;
        }

        for (var key in model) {
            formData.append(key, model[key]);
        }

        var masterSupplierId = model.MasterSupplierId;

        if (!masterSupplierId) {
            ShowNotification("Please select supplier first", "warning");
            return; 
        }

        var grid = $("#AddedItemGrid").data("kendoGrid");
        var details = [];
        


        if (grid) {
            var dataItems = grid.dataSource.view();
            debugger;
            for (var i = 0; i < dataItems.length; i++) {
                var item = dataItems[i];

                details.push({
                    Id: item.Id,
                    ProductId: item.Id,
                    Code: item.Code,
                    Name: item.Name,
                    BanglaName: item.BanglaName,
                    UOMId: item.UOMId,
                    VATRate: item.VATRate,
                    HSCodeNo: item.HSCodeNo,
                    SDRate: item.SDRate,
                    Description: item.Description,
                    MasterItemGroupDescription: item.MasterItemGroupDescription,
                    MasterItemGroupCode: item.MasterItemGroupCode,
                    MasterItemGroupName: item.MasterItemGroupName,
                    MasterItemGroupId: item.MasterItemGroupId,
                    MasterSupplierId: masterSupplierId
                });
            }
        }

        if (details.length === 0) {
            ShowNotification(3, "At least one detail entry is required.");
            $(".btnsave").prop("disabled", false);
            return;
        }

        model.MasterItemList = details;

        debugger;


        var url = "/DMS/MasterSupplierItem/CreateEdit";
        CommonAjaxService.finalSave(url, model, saveDone, saveFail);
    }

    function saveDone(result) {
        debugger;
        $("#Id").val(result.Data.Id);
        $("#Operation").val("update");
        var msg = result.Message || "";

        var inserted = 0;
        var skipped = 0;

        var matchInsert = msg.match(/(\d+)\s*added/i);
        var matchSkip = msg.match(/(\d+)\s*skipped/i);

        if (matchInsert) inserted = parseInt(matchInsert[1]);
        if (matchSkip) skipped = parseInt(matchSkip[1]);

        if (inserted > 0) {
            ShowNotification(1, msg);
        }
        else if (skipped >= 0) {
            ShowNotification(3, msg);
        }
        else {
            ShowNotification(2, msg);
        }

        $(".btnsave").prop("disabled", false);
    }

    function saveFail(result) {


        ShowNotification(3, "Query Exception!");
    };


    return {
        init: init
    }


}(CommonService, CommonAjaxService);








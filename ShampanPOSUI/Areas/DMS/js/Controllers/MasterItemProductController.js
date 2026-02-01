var MasterItemProductController = function (CommonService, CommonAjaxService) {
    //var getProductGroupId = 0;
    var currentMasterItemGroupId = 0;

    var init = function () {


       // getProductGroupId = $("#MasterItemGroupId").val() || 0;
        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';

        // Index/List page
        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();
        }

        // Create / Edit page
        if (getOperation !== '') {
            

            GetProductGroupComboBox(); 
            InitItemsGrid();             
            InitAddedItemGrid();         
        };


        $('.btnsave').off('click').on('click', function (e) {
            debugger;
            e.preventDefault();   // 🔥 very important

            var getId = $('#Id').val();
            var status = parseInt(getId) > 0 ? "Update" : "Save";

            Confirmation(
                "Are you sure? Do You Want to " + status + " Data?",
                function (result) {
                    if (result) {
                        save();
                    }
                }
            );
        });






        //$('.btnsave').click('click', function () {
        //    debugger;
        //    var getId = $('#Id').val();
        //    var status = "Save";
        //    if (parseInt(getId) > 0) {
        //        status = "Update";
        //    }
        //    Confirmation("Are you sure? Do You Want to " + status + " Data?",
        //        function (result) {
        //            if (result) {
        //                save();
        //            }
        //        });
        //});


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

    //End Init


    //End


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

        var url = "/DMS/MasterItem/Delete";

        CommonAjaxService.deleteData(url, model, deleteDone, saveFail);
    };



    /* =========================
   PRODUCT GROUP DROPDOWN
========================= */
    function GetProductGroupComboBox() {
        $("#MasterItemGroupId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [
                { field: "Code", title: "Code", width: 100 },
                { field: "Name", title: "Name", width: 150 }
            ],
            filter: "contains",
            filterFields: ["Code", "Name"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetMasterItemGroupList"
                }
            },
            placeholder: "Select Product Group",

            change: function () {
                var combo = this;
                var dataItem = combo.dataItem();
                var groupId = this.value();
                var grid = $("#departments").data("kendoGrid");

                if (!groupId || groupId < 1) {
                    currentMasterItemGroupId = 0;
                    if (grid) grid.dataSource.data([]);
                    return;
                }

                $("#MasterItemGroupName").val(dataItem.Name);

                currentMasterItemGroupId = groupId;
                grid.dataSource.read();
            }
        });
    }



    /* =========================
       LEFT GRID (ITEM LIST)
    ========================= */
    function InitItemsGrid() {
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
                {
                    title: "Action",
                    width: 90,
                    template: `
                <button type="button" 
                        class="k-button k-primary addToDetails"
                        data-id="#: Id #"
                        data-code="#: Code #"
                        data-name="#: Name #">
                    Add
                </button>`
                }
            ],
            dataBound: function () {
                $(".addToDetails").off().on("click", function (e) {
                    e.preventDefault(); // 🔥 stop form submit
                    Addtolist({
                        Id: $(this).data("id"),
                        Code: $(this).data("code"),
                        Name: $(this).data("name")
                    });
                });
            }
        });
    }


    /* =========================
       RIGHT GRID (ADDED ITEMS)
    ========================= */
    function InitAddedItemGrid() {
        $("#AddedItemGrid").kendoGrid({
            dataSource: {
                data: [],
                schema: {
                    model: {
                        id: "ProductId",
                        fields: {
                            Id: { type: "number" },
                            Code: { type: "string" },
                            Name: { type: "string" }
                        }
                    }
                }
            },
            columns: [
                { field: "Id", title: "Id", width: 100 },
                { field: "Code", title: "Code", width: 100 },
                { field: "Name", title: "Name", width: 150 },
                {
                    title: "Action",
                    width: 70,
                    template: `
                    <button type="button"
                            class="k-button k-danger removeItem"
                            title="Remove">
                        <i class="k-icon k-i-trash"></i>
                    </button>`
                }
            ],
            dataBound: function () {
                $(".removeItem").off().on("click", function (e) {
                    e.preventDefault();

                    var grid = $("#AddedItemGrid").data("kendoGrid");
                    var tr = $(this).closest("tr");

                    grid.removeRow(tr); // 🔥 remove row
                });
            }
        });
    }

    function Addtolist(item) {

        var grid = $("#AddedItemGrid").data("kendoGrid");
        if (!grid) {
            kendo.alert("Added Item grid not initialized!");
            return;
        }

        var ds = grid.dataSource;

        // ✅ duplicate check
        var exists = ds.data().some(function (x) {
            return x.MasterItemGroupId === item.Id;
        });

        if (exists) {
            kendo.alert("This item already added!");
            return;
        }

        // ✅ add ONLY to right grid
        ds.add({
            Id: item.Id,
            Code: item.Code,
            Name: item.Name
        });
    }



    //function GetProductGroupComboBox() {
    //    $("#MasterItemGroupId").kendoMultiColumnComboBox({
    //        dataTextField: "Name",
    //        dataValueField: "Id",
    //        height: 400,
    //        columns: [
    //            { field: "Code", title: "Code", width: 100 },
    //            { field: "Name", title: "Name", width: 150 }
    //        ],
    //        filter: "contains",
    //        filterFields: ["Code", "Name"],
    //        dataSource: {
    //            transport: {
    //                read: "/Common/Common/GetMasterItemGroupList"
    //            }
    //        },
    //        placeholder: "Select Product Group",

    //        change: function () {
    //            var groupId = this.value();
    //            var grid = $("#departments").data("kendoGrid");

    //            // ❌ invalid group
    //            if (!groupId || groupId < 1) {
    //                alert("Please select a product group");
    //                grid.dataSource.data([]); // grid clear
    //                currentMasterItemGroupId = 0;
    //                return;
    //            }

    //            // ✅ valid group
    //            currentMasterItemGroupId = groupId;
    //            grid.dataSource.read(); // server call
    //        }
    //    });
    //}

    //function InitItemsGrid() {
    //    $("#departments").kendoGrid({
    //        autoBind: false, // ⛔ page load এ call করবে না
    //        dataSource: {
    //            transport: {
    //                read: {
    //                    url: "/Common/Common/GetItemList",
    //                    dataType: "json",
    //                    data: function () {
    //                        return {
    //                            value: currentMasterItemGroupId
    //                        };
    //                    }
    //                }
    //            },
    //            schema: {
    //                data: res => res,
    //                total: res => res.length
    //            },
    //            pageSize: 10
    //        },
    //        pageable: true,
    //        sortable: true,
    //        resizable: true,
    //        reorderable: true,
    //        groupable: true,
    //        columns: [
    //            { field: "Id", hidden: true },
    //            { field: "Code", title: "Code", width: 100 },
    //            { field: "Name", title: "Name", width: 150 },
    //            {
    //                title: "Action",
    //                width: 90,
    //                template: `
    //            <button class='k-button k-primary addToDetails'
    //                data-id='#: Id #'
    //                data-code='#: Code #'
    //                data-name='#: Name #'>
    //                Add
    //            </button>`
    //            }
    //        ],
    //        dataBound: function () {
    //            $(".addToDetails").off().on("click", function () {
    //                Addtolist({
    //                    Id: $(this).data("id"),
    //                    Code: $(this).data("code"),
    //                    Name: $(this).data("name")
    //                });
    //            });
    //        }
    //    });
    //}



    //function Addtolist(item) {

    //    var grid = $("#AddedItemGrid").data("kendoGrid");
    //    if (!grid) {
    //        kendo.alert("Added Item grid not initialized!");
    //        return;
    //    }

    //    var ds = grid.dataSource;

    //    // ✅ duplicate check
    //    var exists = ds.data().some(function (x) {
    //        return x.ProductId === item.Id;
    //    });

    //    if (exists) {
    //        kendo.alert("This item already added!");
    //        return;
    //    }

    //    // ✅ add item
    //    ds.add({
    //        Id: 0,
    //        MasterItemProductId: $("#Id").val() || 0,
    //        BranchId: $("#BranchId").val() || null,
    //        ProductId: item.Id,
    //        Code: item.Code,
    //        Name: item.Name
    //    });
    //}





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
                    url: "/DMS/MasterItem/GetGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false
                },
                parameterMap: function (options) {
                    
                    if (options.sort) {
                        options.sort.forEach(function (param) {
                            if (param.field === "ID") {
                                param.field = "H.Id";
                            }
                            if (param.field === "Code") {
                                param.field = "H.Code";
                            }
                            if (param.field === "Name") {
                                param.field = "H.Name";
                            }
                            if (param.field === "Description") {
                                param.field = "H.Description";
                            }
                            if (param.field === "Comments") {
                                param.field = "H.Comments";
                            }
                         
                            if (param.field === "ProductGroupName") {
                                param.field = "PG.Name";
                            }
                            if (param.field === "UOMName") {
                                param.field = "uom.Name";
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
                                param.field = "H.ID";
                            }
                            if (param.field === "Code") {
                                param.field = "H.Code";
                            }
                            if (param.field === "Name") {
                                param.field = "H.Name";
                            }
                            if (param.field === "Description") {
                                param.field = "H.Description";
                            }
                            if (param.field === "Comments") {
                                param.field = "H.Comments";
                            }
                            
                            if (param.field === "ProductGroupName") {
                                param.field = "PG.Name";
                            }
                            if (param.field === "UOMName") {
                                param.field = "uom.Name";
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
                fields: ["Code", "Name", "Description", "ProductGroupName","Status"]
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

                

                var companyName = "OSAKA ELECTRIC & INDUSTRIAL CO.";

                var fileName = `Products_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`;

                e.sender.options.pdf = {
                    paperSize: "A4",
                    margin: { top: "4cm", left: "1cm", right: "1cm", bottom: "4cm" },
                    landscape: true,
                    allPages: true,
                    template: `
                            <div style="position: absolute; top: 1cm; left: 1cm; right: 1cm; text-align: center; font-size: 12px; font-weight: bold;">
                                <div>${companyName}</div>
                            </div> `
                };

                e.sender.options.pdf.fileName = fileName;

                setTimeout(function () {
                    window.location.reload();
                }, 1000);
            },
            columns: [
                {
                    selectable: true, width: 40
                },
                {
                    title: "Action",
                    width: 80,
                    template: function (dataItem) {
                        
                        return `
                    <a href="/DMS/MasterItemProduct/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                        <i class="fas fa-pencil-alt"></i>
                    </a>
                            <a href="/DMS/MasterItemProduct/getReport/${dataItem.Id}" 
                               class="btn btn-success btn-sm mr-2 getReport" 
                               title="Report">
                                <i class="fas fa-file-alt"></i>
                            </a>

 `;
                    }
                },
                { field: "Id", width: 50, hidden: true, sortable: true },
                { field: "ProductGroupName", title: "Group Name", sortable: true, width: 200 },
                { field: "Code", title: "Code", width: 150, sortable: true },
                { field: "Name", title: "Name", sortable: true, width: 200 },
                { field: "UOMName", title: "UOM Name", sortable: true, width: 200 },
                { field: "Description", title: "Description", sortable: true, width: 200 },
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
                },
                { field: "CompanyName", title: "Company Name", width: 200, hidden: true, sortable: true },
            ],
            editable: false,
            selectable: "multiple row",
            navigatable: true,
            columnMenu: true
        });

    };


    //function save() {
    //    debugger;

    //    var isDropdownValid1 = CommonService.validateDropdown("#MasterItemGroupId", "#titleError1", "Product Group is required");
    //    var isDropdownValid = isDropdownValid1 && isDropdownValid2;

    //    var validator = $("#frmEntry").validate();
    //    var formData = new FormData();

    //    var model = serializeInputs("frmEntry");
    //    var result = validator.form();

    //    if (!result || !isDropdownValid) {
    //        if (!result) {
    //            validator.focusInvalid();
    //        }
    //        return;
    //    }

    //    for (var key in model) {
    //        formData.append(key, model[key]);
    //    }

    //    // Handle checkbox value
    //    formData.append("IsActive", $('#IsActive').prop('checked'));

    //    var url = "/DMS/MasterItemProduct/CreateEdit";

    //    CommonAjaxService.finalImageSave(url, formData, saveDone, saveFail);
    //}


    //function save() {
    //    debugger; 

    //    var isDropdownValid1 = CommonService.validateDropdown(
    //        "#MasterItemGroupId",
    //        "#titleError1",
    //        "Product Group is required"
    //    );

    //    var validator = $("#frmEntry").validate();
    //    var formData = new FormData();

    //    var model = serializeInputs("frmEntry");
    //    var result = validator.form();

    //    if (!result || !isDropdownValid1) {
    //        if (!result) {
    //            validator.focusInvalid();
    //        }
    //        return;
    //    }

    //    // form fields
    //    for (var key in model) {
    //        formData.append(key, model[key]);
    //    }

    //    // 🔥 RIGHT GRID DATA (CORRECT FIELD NAME)
    //    var addedGrid = $("#AddedItemGrid").data("kendoGrid");
    //    var addedItems = addedGrid ? addedGrid.dataSource.data().toJSON() : [];

    //    formData.append(
    //        "TransferIssueDetailsJson",
    //        JSON.stringify(addedItems)
    //    );

    //    formData.append("IsActive", $('#IsActive').prop('checked'));

    //    var url = "/DMS/MasterItemProduct/CreateEdit";

    //    CommonAjaxService.finalImageSave(
    //        url,
    //        formData,
    //        saveDone,
    //        saveFail
    //    );
    //}

    //function save() {

    //    var isDropdownValid = CommonService.validateDropdown("#MasterItemGroupId","#titleError1","Product Group is required"
    //    );

    //    var validator = $("#frmEntry").validate();
    //    if (!validator.form() || !isDropdownValid) {
    //        validator.focusInvalid();
    //        return;
    //    }

    //    var formData = new FormData();
    //    var model = serializeInputs("frmEntry");

    //    // append form fields
    //    for (var key in model) {
    //        formData.append(key, model[key]);
    //    }

    //    var grid = $("#AddedItemGrid").data("kendoGrid");
    //    if (!grid) {
    //        ShowNotification(3, "Added item grid not found!");
    //        return;
    //    }

    //    var items = grid.dataSource.data().toJSON();
    //    if (!items || items.length === 0) {
    //        ShowNotification(3, "Please add at least one item");
    //        return;
    //    }

    //    formData.append("SelectedMasterItemsJson", JSON.stringify(items));
    //    formData.append("IsActive", $('#IsActive').prop('checked'));

    //    CommonAjaxService.finalImageSave(
    //        "/DMS/MasterItemProduct/CreateEdit",
    //        formData,
    //        saveDone,
    //        saveFail
    //    );
    //}

    function save() {
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

        var department = model.DepartmentId;

        var grid = $("#AddedItemGrid").data("kendoGrid");
        var details = [];



        if (grid) {
            var dataItems = grid.dataSource.view();

            for (var i = 0; i < dataItems.length; i++) {
                var item = dataItems[i];

                details.push({
                    Id: item.Id,
                    MasterItemGroupId: item.MasterItemGroupId,
                    Name : item.Name,
                    Code : item.Code
                });
            }
        }

        if (details.length === 0) {
            ShowNotification(3, "At least one detail entry is required.");
            return;
        }

        model.MasterItemList = details;

        debugger;


        var url = "/DMS/MasterItemProduct/CreateEdit";
        CommonAjaxService.finalSave(url, model, saveDone, saveFail);
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
    form.action = '/DMS/MasterItemProduct/ReportPreview';
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
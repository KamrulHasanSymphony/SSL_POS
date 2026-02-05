var MasterSupplierProductController = function (CommonService, CommonAjaxService) {
    var currentMasterSupplierGroupId = 0;

    var init = function () {
        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';

        // Index/List page
        if (parseInt(getId) == 0 && getOperation == '') {
            //GetGridDataList();
        }

        // Create / Edit page
        if (getOperation !== '') {
            

            GetSupplierGroupComboBox(); 
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
                window.location.href = "/DMS/MasterSupplier/NextPrevious?id=" + getId + "&status=Previous";
            }
        });
        $('#btnNext').click('click', function () {
            var getId = $('#Id').val();
            if (parseInt(getId) > 0) {
                window.location.href = "/DMS/MasterSupplier/NextPrevious?id=" + getId + "&status=Next";
            }
        });



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

        var url = "/DMS/MasterSupplier/Delete";

        CommonAjaxService.deleteData(url, model, deleteDone, saveFail);
    };



    /* =========================
   PRODUCT GROUP DROPDOWN
========================= */
    //function GetSupplierGroupComboBox() {
    //    $("#MasterSupplierGroupId").kendoMultiColumnComboBox({
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
    //                read: "/Common/Common/GetMasterSupplierGroupList"
    //            }
    //        },
    //        placeholder: "Select Product Group",

    //        change: function () {
    //            var combo = this;
    //            var dataItem = combo.dataItem();
    //            var groupId = this.value();
    //            var grid = $("#departments").data("kendoGrid");

    //            if (!groupId || groupId < 1) {
    //                currentMasterSupplierGroupId = 0;
    //                if (grid) grid.dataSource.data([]);
    //                return;
    //            }

    //            $("#MasterSupplierGroupName").val(dataItem.Name);

    //            currentMasterSupplierGroupId = groupId;
    //            grid.dataSource.read();
    //        }
    //    });
    //}


    function GetSupplierGroupComboBox() {
        debugger;
        $("#MasterSupplierGroupId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [
                { field: "Code", title: "Code", width: 100 },
                { field: "Name", title: "Name", width: 150 },
                { field: "Description", title: "Description", width: 150 },
            ],
            filter: "contains",
            filterFields: ["Code", "Name"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetMasterSupplierGroupList"
                }
            },
            placeholder: "Select Product Group",

            change: function () {
                var combo = this;
                var dataItem = combo.dataItem();
                var groupId = this.value();
                var grid = $("#departments").data("kendoGrid");

                // If no group selected or invalid group ID, reset values
                if (!groupId || groupId < 1) {
                    currentMasterSupplierGroupId = 0;
                    if (grid) grid.dataSource.data([]);
                    return;
                }

                // Set the values in corresponding fields
               // $("#Address").val(dataItem.Address);
                $("#MasterSupplierGroupName").val(dataItem.Name);
                $("#Description").val(dataItem.Description);
                $("#Code").val(dataItem.Code);

                currentMasterSupplierGroupId = groupId;

                // Reload grid data after change
                grid.dataSource.read();
            }
        });
    }




    /* =========================
       LEFT GRID (ITEM LIST)
    ========================= */
    //function InitItemsGrid() {
    //    debugger;
    //    $("#departments").kendoGrid({
    //        autoBind: false,
    //        dataSource: {
    //            transport: {
    //                read: {
    //                    url: "/Common/Common/GetSupplierListByGroup",
    //                    dataType: "json",
    //                    data: function () {
    //                        return {
    //                            value: currentMasterSupplierGroupId
    //                        };
    //                    }
    //                }
    //            },
    //            schema: {
    //                data: function (res) { return res; },
    //                total: function (res) { return res.length; }
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
    //            <button type="button"
    //                    class="k-button k-primary addToDetails"
    //                    data-id="#: Id #"
    //                    data-code="#: Code #"
    //                    data-name="#: Name #"
    //                    data-group-name="#: MasterSupplierGroupName #">
    //                Add
    //            </button>`
    //            }
    //        ],
    //        dataBound: function () {
    //            $(".addToDetails").off().on("click", function (e) {
    //                e.preventDefault(); // 🔥 stop form submit
    //                Addtolist({
    //                    Id: $(this).data("id"),
    //                    Code: $(this).data("code"),
    //                    Name: $(this).data("name"),
    //                    MasterSupplierGroupName: $("#MasterSupplierGroupName").val() || ''
    //                });
    //            });
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
                        url: "/Common/Common/GetSupplierListByGroup", 
                        dataType: "json",
                        data: function () {
                            return {
                                value: currentMasterSupplierGroupId 
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
                { field: "BanglaName", title: "Bangla Name",hidden:true, width: 150 },
                { field: "Address", title: "Address", hidden: true, width: 150 },
                { field: "City", title: "City", hidden: true, width: 150 },
                { field: "TelephoneNo", title: "Telephone No", width: 150 },
                { field: "Email", title: "Email", width: 150 },
                { field: "ContactPerson", title: "Contact Person", hidden: true, width: 150 },
                { field: "Action", hidden: true },
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
                    data-address="#: Address #"
                    data-city="#: City #"
                    data-telephone-no="#: TelephoneNo #"
                    data-email="#: Email #"
                    data-contact-person="#: ContactPerson #">
                    
                Add
            </button>`
                }
            ],
            dataBound: function () {
                $(".addToDetails").off().on("click", function (e) {
                    e.preventDefault(); // stop form submit
                    Addtolist({
                        Id: $(this).data("id"),
                        Code: $(this).data("code"),
                        Name: $(this).data("name"),
                        BanglaName: $(this).data("banglaName"),         
                        Address: $(this).data("address"),
                        City: $(this).data("city"),
                        TelephoneNo: $(this).data("telephoneNo"),     
                        Email: $(this).data("email"),
                        ContactPerson: $(this).data("contactPerson"),   
                        Description: $(this).data("description"),   
                        MasterSupplierGroupName: $("#MasterSupplierGroupName").val() || '',
                        MasterSupplierGroupDescription: $("#MasterSupplierGroupDescription").val() || '',
                        MasterSupplierGroupCode: $("#MasterSupplierGroupCode").val() || ''
                    });
                });
            }

        });
    }





    /* =========================
       RIGHT GRID (ADDED ITEMS)
    ========================= */
    //function InitAddedItemGrid() {
    //    debugger;
    //    $("#AddedItemGrid").kendoGrid({
    //        dataSource: {
    //            data: [],
    //            schema: {
    //                model: {
    //                    id: "SupplierId",
    //                    fields: {
    //                        Id: { type: "number" },
    //                        Code: { type: "string" },
    //                        Name: { type: "string" },
    //                        MasterSupplierGroupName: { type: "string" }
    //                    }
    //                }
    //            }
    //        },
    //        columns: [
    //            { field: "Id", title: "Id", width: 100 },
    //            { field: "Code", title: "Code", width: 100 },
    //            { field: "Name", title: "Name", width: 150 },
    //            { field: "MasterSupplierGroupName", title: "Group", width: 150 },
    //            {
    //                title: "Action",
    //                width: 70,
    //                template: `
    //                <button type="button"
    //                        class="k-button k-danger removeItem"
    //                        title="Remove">
    //                    <i class="k-icon k-i-trash"></i>
    //                </button>`
    //            }
    //        ],
    //        dataBound: function () {
    //            $(".removeItem").off().on("click", function (e) {
    //                e.preventDefault();

    //                var grid = $("#AddedItemGrid").data("kendoGrid");
    //                var tr = $(this).closest("tr");

    //                grid.removeRow(tr); // 🔥 remove row
    //            });
    //        }
    //    });
    //}



    function InitAddedItemGrid() {
        debugger;
        $("#AddedItemGrid").kendoGrid({
            dataSource: {
                data: [], // Empty array, will be populated dynamically
                schema: {
                    model: {
                        id: "Id", 
                        fields: {
                            Id: { type: "number" },
                            Code: { type: "string" },
                            Name: { type: "string" },
                            Description: { type: "string" },
                            MasterSupplierGroupName: { type: "string" },
                            MasterSupplierGroupDescription: { type: "string" },
                            MasterSupplierGroupCode: { type: "string" },
                            BanglaName: { type: "string" },
                            Address: { type: "string" },
                            City: { type: "string" },
                            TelephoneNo: { type: "string" },
                            Email: { type: "string" },
                            ContactPerson: { type: "string" },
                       
                        }
                    }
                }
            },
            columns: [
                { field: "Id", title: "Id", width: 100 },
                { field: "Code", title: "Code", width: 100 },
                { field: "Name", title: "Name", width: 150 },
                { field: "Description", title: "Description", hidden: true, width: 150 },
                { field: "MasterSupplierGroupName", title: "Group", width: 150 },
                { field: "MasterSupplierGroupDescription", title: "Description", width: 150 ,hidden:true},
                { field: "MasterSupplierGroupCode", title: "Group Code", width: 150, hidden: true },
                { field: "BanglaName", title: "Bangla Name", width: 150, hidden: true },
                { field: "Address", title: "Address", width: 150, hidden: true },
                { field: "City", title: "City", width: 150, hidden: true },
                { field: "TelephoneNo", title: "Telephone No", width: 150, hidden: true },
                { field: "Email", title: "Email", width: 150, hidden: true },
                { field: "ContactPerson", title: "Contact Person", width: 150, hidden: true },
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
                    grid.removeRow(tr); // Remove row from grid
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
            kendo.alert("This supplier is already added!");
            return;
        }

        // Add the new item to the grid, including all necessary fields
        ds.add({
            Id: item.Id,
            Code: item.Code,
            Name: item.Name,
            BanglaName: item.BanglaName, 
            Address: item.Address, 
            City: item.City, 
            TelephoneNo: item.TelephoneNo, 
            Email: item.Email, 
            ContactPerson: item.ContactPerson,
            Description: item.Description,
            MasterSupplierGroupDescription: item.MasterSupplierGroupDescription, 
            MasterSupplierGroupCode: item.MasterSupplierGroupCode, 
            MasterSupplierGroupName: item.MasterSupplierGroupName, 
            MasterSupplierGroupId: item.MasterSupplierGroupId 
        });
    }



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

        // Append form data to FormData object
        for (var key in model) {
            formData.append(key, model[key]);
        }

        var grid = $("#AddedItemGrid").data("kendoGrid");
        var details = [];

        if (grid) {
            var dataItems = grid.dataSource.view();

            // Loop through the grid items and push them to the details array
            for (var i = 0; i < dataItems.length; i++) {
                var item = dataItems[i];

                details.push({
                    Id: item.Id,                         
                    Code: item.Code,                     
                    Name: item.Name,                     
                    BanglaName: item.BanglaName,        
                    Address: item.Address,                
                    City: item.City,                     
                    TelephoneNo: item.TelephoneNo,        
                    Email: item.Email,                    
                    ContactPerson: item.ContactPerson,   
                    Description: item.Description,   
                    MasterSupplierGroupName: item.MasterSupplierGroupName, 
                    MasterSupplierGroupId: item.MasterSupplierGroupId,
                    MasterSupplierGroupDescription: item.MasterSupplierGroupDescription,
                    MasterSupplierGroupCode: item.MasterSupplierGroupCode
                });
            }
        }

        if (details.length === 0) {
            ShowNotification(3, "At least one detail entry is required.");
            return;
        }

        model.MasterSupplierList = details;

        debugger;

        // Send the data to the server
        var url = "/DMS/MasterSupplierProduct/CreateEdit";
        CommonAjaxService.finalSave(url, model, saveDone, saveFail);
    }





    //function Addtolist(item) {
    //    debugger;

    //    var grid = $("#AddedItemGrid").data("kendoGrid");
    //    if (!grid) {
    //        kendo.alert("Added Item grid not initialized!");
    //        return;
    //    }

    //    var ds = grid.dataSource;

    //    // ✅ CORRECT duplicate check
    //    var exists = ds.data().some(function (x) {
    //        return x.Id === item.Id;
    //    });

    //    if (exists) {
    //        kendo.alert("This supplier already added!");
    //        return;
    //    }

    //    ds.add({
    //        Id: item.Id,
    //        Code: item.Code,
    //        Name: item.Name,
    //        MasterSupplierGroupName: item.MasterSupplierGroupName  
    //    });
    //}




    //function save() {
    //    debugger;
    //    var validator = $("#frmEntry").validate();
    //    var formData = new FormData();
    //    var model = serializeInputs("frmEntry");

    //    //model.MasterSupplierGroupName = $("#MasterSupplierGroupName").val();

    //    var result = validator.form();

    //    if (!result) {
    //        validator.focusInvalid();
    //        return;
    //    }

    //    for (var key in model) {
    //        formData.append(key, model[key]);
    //    }

    //    var department = model.DepartmentId;

    //    var grid = $("#AddedItemGrid").data("kendoGrid");
    //    var details = [];



    //    if (grid) {
    //        var dataItems = grid.dataSource.view();

    //        for (var i = 0; i < dataItems.length; i++) {
    //            var item = dataItems[i];

    //            details.push({
    //                Id: item.Id,
    //                Name: item.Name,
    //                Code: item.Code,
    //                MasterSupplierGroupName: item.MasterSupplierGroupName
    //            });

    //        }
    //    }

    //    if (details.length === 0) {
    //        ShowNotification(3, "At least one detail entry is required.");
    //        return;
    //    }

    //    model.MasterSupplierList = details;

    //    debugger;


    //    var url = "/DMS/MasterSupplierProduct/CreateEdit";
    //    CommonAjaxService.finalSave(url, model, saveDone, saveFail);
    //}

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
    form.action = '/DMS/MasterSupplierProduct/ReportPreview';
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
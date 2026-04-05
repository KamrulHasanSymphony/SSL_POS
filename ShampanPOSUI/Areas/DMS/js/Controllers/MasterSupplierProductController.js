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
            

            //GetSupplierGroupComboBox(); 
            InitItemsGrid();             
            InitAddedItemGrid();         
        };

        $('.btnsave').off('click').on('click', function (e) {
            e.preventDefault();

            var btn = $(this);

            // 🔥 First Validate Form
            var validator = $("#frmEntry").validate();
            var result = validator.form();

            if (!result) {
                validator.focusInvalid();
                return;
            }

            // 🔥 Detail Grid Check
            var grid = $("#AddedItemGrid").data("kendoGrid");
            if (!grid || grid.dataSource.data().length === 0) {
                ShowNotification(3, "Add at least one detail.");
                return;
            }

            // ✅ Only if everything valid → Show Confirmation
            Confirmation("Are you sure you want to save?", function (result) {
                if (result) {
                    btn.prop("disabled", true);
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

    function InitItemsGrid() {
        debugger;
        $("#departments").kendoGrid({
            autoBind: true,
            dataSource: {
                transport: {
                    read: {
                        url: "/Common/Common/GetSupplierListByGroup", 
                        dataType: "json",
              
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
                { field: "Name", title: "Name", width: 100 },
                { field: "MasterSupplierGroupName", title: "Supplier Group", width: 100 },
                { field: "BanglaName", title: "Bangla Name",hidden:true, width: 150 },
                { field: "Address", title: "Address", hidden: true, width: 100 },
                { field: "City", title: "City", hidden: true, width: 100 },
                { field: "TelephoneNo", title: "Telephone No", width: 100 },
                { field: "Email", title: "Email", width: 100 },
                { field: "ContactPerson", title: "Contact Person", hidden: true, width: 100 },
                { field: "Action", hidden: true },

                // ✅ Status column
                {
                    field: "IsAlreadyAdded",
                    title: "Status",
                    width: 90,
                    template: function (dataItem) {

                        if (dataItem.IsAlreadyAdded) {
                            return "<span style='color:green;font-weight:bold'>✔ Added</span>";
                        }

                        return "<span style='color:gray'>New</span>";
                    }
                },
                {
                    title: "Action",
                    width: 90,
                    template: function (dataItem) {

                        if (dataItem.IsAlreadyAdded) {
                            return "<button class='k-button' disabled>Added</button>";
                        }

                        // Use dataItem directly for all attributes
                        return `
                    <button type="button" 
                        class="k-button k-primary addToDetails"
                        data-id="${dataItem.Id}"
                        data-code="${dataItem.Code}"
                        data-name="${dataItem.Name}"
                        data-group="${dataItem.MasterSupplierGroupName}"
                        data-bangla-name="${dataItem.BanglaName}"
                        data-address="${dataItem.Address}"
                        data-city="${dataItem.City}"
                        data-telephone-no="${dataItem.TelephoneNo}"
                        data-email="${dataItem.Email}"
                        data-contact-person="${dataItem.ContactPerson}">
            
                        Add
                    </button>`;
                    }
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
                            Address: $(this).data("address"),
                            City: $(this).data("city"),
                            TelephoneNo: $(this).data("telephoneNo"),
                            Email: $(this).data("email"),
                            ContactPerson: $(this).data("contactPerson"),
                            Description: $(this).data("description"),
                            MasterSupplierGroupName: $(this).data("group")
                            //MasterSupplierGroupName: $("#MasterSupplierGroupName").val() || ''
                        });
                    });
            }



        });
    }




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
                { field: "Id", title: "Id", hidden: true, width: 100 },
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

        var validator = $("#frmEntry").validate();
        var model = serializeInputs("frmEntry");

        var result = validator.form();

        if (!result) {
            validator.focusInvalid();
            $(".btnsave").prop("disabled", false);
            return;
        }

        var grid = $("#AddedItemGrid").data("kendoGrid");
        var details = [];

        if (grid) {
            var dataItems = grid.dataSource.data(); // better than view()

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
            $(".btnsave").prop("disabled", false);
            return;
        }

        model.MasterSupplierList = details;

        var url = "/DMS/MasterSupplierProduct/CreateEdit";
        CommonAjaxService.finalSave(url, model, saveDone, saveFail);
    }

    function saveDone(result) {

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




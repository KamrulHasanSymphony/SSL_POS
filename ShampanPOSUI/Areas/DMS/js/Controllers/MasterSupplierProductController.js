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
    function GetSupplierGroupComboBox() {
        $("#MasterSupplierGroupId").kendoMultiColumnComboBox({
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
                    read: "/Common/Common/GetMasterSupplierGroupList"
                }
            },
            placeholder: "Select Product Group",

            change: function () {
                var combo = this;
                var dataItem = combo.dataItem();
                var groupId = this.value();
                var grid = $("#departments").data("kendoGrid");

                if (!groupId || groupId < 1) {
                    currentMasterSupplierGroupId = 0;
                    if (grid) grid.dataSource.data([]);
                    return;
                }

                $("#MasterSupplierGroupName").val(dataItem.Name);

                currentMasterSupplierGroupId = groupId;
                grid.dataSource.read();
            }
        });
    }



    /* =========================
       LEFT GRID (ITEM LIST)
    ========================= */
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
                {
                    title: "Action",
                    width: 90,
                    template: `
                <button type="button" 
                        class="k-button k-primary addToDetails"
                        data-id="#: Id #"
                        data-code="#: Code #"
                        data-name="#: Name #"
                        data-group-name="#: MasterSupplierGroupName #">
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
                        Name: $(this).data("name"),
                        MasterSupplierGroupName: $("#MasterSupplierGroupName").val() || ''
                    });
                });
            }
        });
    }


    /* =========================
       RIGHT GRID (ADDED ITEMS)
    ========================= */
    function InitAddedItemGrid() {
        debugger;
        $("#AddedItemGrid").kendoGrid({
            dataSource: {
                data: [],
                schema: {
                    model: {
                        id: "SupplierId",
                        fields: {
                            Id: { type: "number" },
                            Code: { type: "string" },
                            Name: { type: "string" },
                            MasterSupplierGroupName: { type: "string" }
                        }
                    }
                }
            },
            columns: [
                { field: "Id", title: "Id", width: 100 },
                { field: "Code", title: "Code", width: 100 },
                { field: "Name", title: "Name", width: 150 },
                { field: "MasterSupplierGroupName", title: "Group", width: 150 },
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

    //function Addtolist(item) {

    //    var grid = $("#AddedItemGrid").data("kendoGrid");
    //    if (!grid) {
    //        kendo.alert("Added Item grid not initialized!");
    //        return;
    //    }

    //    var ds = grid.dataSource;

    //    // ✅ duplicate check
    //    var exists = ds.data().some(function (x) {
    //        return x.MasterSupplierGroupId === item.Id;
    //    });

    //    if (exists) {
    //        kendo.alert("This item already added!");
    //        return;
    //    }

    //    // ✅ add ONLY to right grid
    //    ds.add({
    //        Id: item.Id,
    //        Code: item.Code,
    //        Name: item.Name
    //    });
    //}


    function Addtolist(item) {
        debugger;

        var grid = $("#AddedItemGrid").data("kendoGrid");
        if (!grid) {
            kendo.alert("Added Item grid not initialized!");
            return;
        }

        var ds = grid.dataSource;

        // ✅ CORRECT duplicate check
        var exists = ds.data().some(function (x) {
            return x.Id === item.Id;
        });

        if (exists) {
            kendo.alert("This supplier already added!");
            return;
        }

        ds.add({
            Id: item.Id,
            Code: item.Code,
            Name: item.Name,
            MasterSupplierGroupName: item.MasterSupplierGroupName  
        });
    }




    function save() {
        debugger;
        var validator = $("#frmEntry").validate();
        var formData = new FormData();
        var model = serializeInputs("frmEntry");

        //model.MasterSupplierGroupName = $("#MasterSupplierGroupName").val();

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
                    Name: item.Name,
                    Code: item.Code,
                    MasterSupplierGroupName: item.MasterSupplierGroupName
                });

            }
        }

        if (details.length === 0) {
            ShowNotification(3, "At least one detail entry is required.");
            return;
        }

        model.MasterSupplierList = details;

        debugger;


        var url = "/DMS/MasterSupplierProduct/CreateEdit";
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
var MasterSupplierItemController = function (CommonService, CommonAjaxService) {
    //var getProductGroupId = 0;
    var currentMasterItemGroupId = 0;

    var init = function () {


        // getProductGroupId = $("#MasterItemGroupId").val() || 0;
        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';

        // Index/List page
        if (parseInt(getId) == 0 && getOperation == '') {
            //GetGridDataList();
        }

        // Create / Edit page
        if (getOperation !== '') {


            GetProductGroupComboBox();
            InitItemsGrid();
            InitAddedItemGrid();
        };


        //$('.btnsave').off('click').on('click', function (e) {
        //    debugger;
        //    e.preventDefault();   // 🔥 very important

        //    var getId = $('#Id').val();
        //    var status = parseInt(getId) > 0 ? "Update" : "Save";

        //    Confirmation(
        //        "Are you sure? Do You Want to " + status + " Data?",
        //        function (result) {
        //            if (result) {
        //                save();
        //            }
        //        }
        //    );
        //});


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
                { field: "Name", title: "Name", width: 150 },
                { field: "Description", title: "Description", width: 150 },

            ],
            filter: "contains",
            filterFields: ["Code", "Name"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetMasterItemGroupList"
                }
            },
            placeholder: "Select Product Group",

            //change: function () {
            //    var combo = this;
            //    var dataItem = combo.dataItem();
            //    var groupId = this.value();
            //    var grid = $("#departments").data("kendoGrid");

            //    if (!groupId || groupId < 1) {
            //        currentMasterItemGroupId = 0;
            //        if (grid) grid.dataSource.data([]);
            //        return;
            //    }

            //    $("#MasterItemGroupName").val(dataItem.Name);
            //    $("#Description").val(dataItem.Description);
            //    $("#Code").val(dataItem.Code);


            //    currentMasterItemGroupId = groupId;
            //    grid.dataSource.read();
            //}

            change: function () {
                var dataItem = this.dataItem();
                var groupId = this.value();
                var grid = $("#departments").data("kendoGrid");

                if (!groupId || groupId < 1) {
                    currentMasterItemGroupId = 0;
                    if (grid) grid.dataSource.data([]);
                    return;
                }

                currentMasterItemGroupId = groupId;

                // 🔥 FORCE reload
                if (grid) {
                    grid.dataSource.read();
                }

                $("#MasterItemGroupName").val(dataItem.Name);
                $("#Description").val(dataItem.Description);
                $("#Code").val(dataItem.Code);
            }
        });
    }


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
            //dataBound: function () {
            //    $(".addToDetails").off().on("click", function (e) {
            //        e.preventDefault(); // 🔥 stop form submit
            //        Addtolist({
            //            Id: $(this).data("id"),
            //            Code: $(this).data("code"),
            //            Name: $(this).data("name"),
            //            BanglaName: $(this).data("bangla-name"),
            //            Description: $(this).data("description"),
            //            UOMId: $(this).data("uom-id"),
            //            HSCodeNo: $(this).data("hs-code"),
            //            VATRate: $(this).data("vat-rate"),
            //            SDRate: $(this).data("sd-rate"),
            //            MasterItemGroupName: $("#MasterItemGroupName").val() || '',
            //            MasterItemGroupDescription: $("#MasterItemGroupDescription").val() || '',
            //            MasterItemGroupCode: $("#MasterItemGroupCode").val() || ''
            //        });
            //    });
            //}

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
        $("#AddedItemGrid").kendoGrid({
            dataSource: {
                data: [], // Initialize empty data
                schema: {
                    model: {
                        id: "ProductId",
                        fields: {
                            Id: { type: "number" },
                            Code: { type: "string" },
                            Name: { type: "string" },
                            MasterItemGroupName: { type: "string" },
                            MasterItemGroupDescription: { type: "string" },
                            MasterItemGroupCode: { type: "string" },
                            BanglaName: { type: "string" },
                            Description: { type: "string" },
                            UOMId: { type: "number" },
                            HSCodeNo: { type: "string" },
                            VATRate: { type: "string" },
                            SDRate: { type: "string" },
                        }
                    }
                }
            },
            columns: [
                { field: "Id", title: "Id", width: 100 },
                { field: "Code", title: "Code", width: 100 },
                { field: "Name", title: "Name", width: 150 },
                { field: "MasterItemGroupName", title: "Group", width: 150 },
                { field: "MasterItemGroupDescription", title: "Description", width: 150, hidden: true },
                { field: "MasterItemGroupCode", title: "Group Code", width: 150, hidden: true },
                { field: "BanglaName", title: "Bangla Name", width: 150, hidden: true },
                { field: "Description", title: "Address", width: 150, hidden: true },
                { field: "UOMId", title: "UOM", width: 150, hidden: true },
                { field: "HSCodeNo", title: "HSCode No", width: 150, hidden: true },
                { field: "VATRate", title: "VAT Rate", width: 150, hidden: true },
                { field: "SDRate", title: "SD Rate", width: 150, hidden: true },
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
                // Attach click event for remove button after data is bound
                $(".removeItem").off().on("click", function (e) {
                    e.preventDefault();

                    // Get the Kendo Grid instance
                    var grid = $("#AddedItemGrid").data("kendoGrid");

                    // Find the closest row (tr) to the clicked remove button
                    var tr = $(this).closest("tr");

                    // Remove the selected row from the grid
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
            kendo.alert("This supplier is already added!");
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
        debugger;
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








    //function saveDone(result) {

    //    if (result.Status == 200) {
    //        if (result.Data.Operation == "add") {
    //            ShowNotification(1, result.Message);
    //            $(".divSave").show();
    //            $(".divUpdate").hide();
    //            $("#Code").val(result.Data.Code);
    //            $("#Id").val(result.Data.Id);
    //            $("#Operation").val("update");
    //            $("#CreatedBy").val(result.Data.CreatedBy);
    //            $("#CreatedOn").val(result.Data.CreatedOn);

    //        }
    //        else {
    //            ShowNotification(1, result.Message);
    //            $("#LastModifiedBy").val(result.Data.LastModifiedBy);
    //            $("#LastModifiedOn").val(result.Data.LastModifiedOn);

    //        }

    //    }
    //    else if (result.Status == 400) {
    //        ShowNotification(3, result.Message);
    //    }
    //    else {
    //        ShowNotification(2, result.Message);
    //    }
    //};

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
var SupplierController = function (CommonService, CommonAjaxService) {
    var getSupplierGroupId = 0;
    var init = function () {

        //SupplierProductController.init();
        getSupplierGroupId = $("#SupplierGroupId").val() || 0;
        
        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';
        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();
        }
        GetSupplierGroupComboBox();
        //GetProductGroupComboBox();
        InitItemsGrid();
        InitAddedItemGrid();

        $('.btnsave').on('click', function (e) {
            debugger;

            e.preventDefault();

            var form = $("#frmEntry");

            var mvcValid = form.valid();

            var customValid = CommonValidationHelper.CheckValidation("#frmEntry");

            if (!mvcValid || !customValid) {
                return false;
            }
            var grid = $("#AddedItemGrid").data("kendoGrid");
            if (!grid || grid.dataSource.data().length === 0) {
                ShowNotification(3, "Add at least one SupplierProduct detail.");
                return;
            }

            var btn = $(this);
            btn.prop("disabled", true);

            var getId = $('#Id').val();
            var status = "Save";
            if (parseInt(getId) > 0) {
                status = "Update";
            }
            Confirmation("Are you sure? Do You Want to " + status + " Data?",

                function (result) {

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
                window.location.href = "/DMS/Supplier/NextPrevious?id=" + getId + "&status=Previous";
            }
        });
        $('#btnNext').click('click', function () {
            var getId = $('#Id').val();
            if (parseInt(getId) > 0) {
                window.location.href = "/DMS/Supplier/NextPrevious?id=" + getId + "&status=Next";
            }
        });

        // Handle file input change to preview image
        $("#imageUpload").on("change", function (event) {

            //$("#imageUpload").prop("disabled", false); 
            var file = event.target.files[0];

            if (!file) {
                console.error("No file selected!");
                return;
            }

            var reader = new FileReader();

            reader.onload = function (e) {
                console.log("File loaded successfully!");

                $("#imagePreview").attr("src", e.target.result).show();
                $("#deleteImageBtn").show();
                $("#ImagePath").val(e.target.result);
            };

            reader.onerror = function (error) {
                console.error("Error reading file:", error);
            };

            reader.readAsDataURL(file);
        });

        $("#deleteImageBtn").on("click", function () {
            $(this).addClass("clicked");
            $("#imagePreview").attr("src", "").hide();
            $("#ImagePath").val("");
            $("#deleteImageBtn").hide();
            $("#imageUpload").val("");
            $("#imageUpload").prop("disabled", false);
        });

        var operation = $("#Operation").val();
        var imagePath = $("#ImagePath").val();
        if (operation == "update" && imagePath !== null) {
            
            $("#imageUpload").prop("disabled", false);
        }
    };

    function GetSupplierGroupComboBox() {
        var CustomerComboBox = $("#SupplierGroupId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [
                { field: "Code", title: "Code", width: 100 },
                { field: "Name", title: "Name", width: 150 },

            ],
            filter: "contains",
            filterFields: ["Code", "Name", "BanglaName"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetSupplierGroupList"
                }
            },
            placeholder: "Select Supplier",
            value: "",
            dataBound: function (e) {
                if (getSupplierGroupId) {
                    this.value(parseInt(getSupplierGroupId));
                }
            },
            change: function (e) {
                
            }
        }).data("kendoMultiColumnComboBox");
    };  



    function GetProductGroupComboBox() {
        debugger;
        var combo = $("#ProductGroupId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            autoBind: false,
            filter: "contains",
            dataSource: {
                transport: {
                    read: {
                        url: "/Common/Common/GetProductGroupList",
                        dataType: "json"
                    }
                }
            },

            change: function () {
                var dataItem = this.dataItem();
                var groupId = this.value();
                var grid = $("#departments").data("kendoGrid");
                debugger;
                if (!groupId) {
                    currentProductGroupId = 0;
                    if (grid) grid.dataSource.data([]);
                    return;
                }

                currentProductGroupId = groupId;

                if (grid) {
                    grid.dataSource.read();
                }

                if (dataItem) {

                    $("#ProductGroupName").val(dataItem.Name);
                    $("#Description").val(dataItem.Description);
                    $("#Code").val(dataItem.Code);
                }
            }
        });
    }


    function InitItemsGrid() {
        debugger;
        $("#departments").kendoGrid({
            autoBind: true,
            toolbar: ["search"],
            search: {
                fields: [
                    { name: "Code", operator: "contains" },
                    { name: "Name", operator: "contains" },
                    { name: "HSCodeNo", operator: "contains" },
                    { name: "VATRate", operator: "contains" },
                    { name: "SDRate", operator: "contains" }
                ]
            },
            dataSource: {
                transport: {
                    read: {
                        url: "/Common/Common/GetProductList",
                        dataType: "json",
                        //data: function () {
                        //    return {
                        //        value: currentProductGroupId
                        //    };
                        //}
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
                { field: "Name", title: "Name", width: 110 },
                { field: "ProductGroupName", title: "Product Group", width: 110 },
                { field: "BanglaName", title: "Bangla Name", hidden: true, width: 150 },
                { field: "Description", title: "Description", hidden: true, width: 150 },
                { field: "UOMId", title: "UOM ID", hidden: true, width: 100 },
                { field: "HSCodeNo", title: "HS Code No", width: 80 },
                { field: "VATRate", title: "VAT Rate", width: 80 },
                { field: "SDRate", title: "SD Rate", width: 80 },
                {
                    title: "Action",
                    width: 90,
                    template: `
                    <button type="button" 
                            class="k-button k-primary addToDetails"
                            data-id="#: Id #"
                            data-code="#: Code #"
                            data-name="#: Name #"
                            data-group="#: ProductGroupName #"
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
                            ProductGroupName: $(this).data("group")
                            //ProductGroupName: $("#ProductGroupName").val() || ''
                        });
                    });

            }

        });
    }



    function InitAddedItemGrid() {


        var iteamDetailList = JSON.parse($("#iteamDetailList").val() || "[]");

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
                            ProductGroupName: { type: "string" },

                        }
                    }
                }
            },
            columns: [
                { field: "Id", hidden: true },
                { field: "ProductId", hidden: true },
                { field: "Code", title: "Code", width: 100 },
                { field: "Name", title: "Name", width: 150 },
                { field: "ProductGroupName", title: "Group", width: 150 },

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
            ProductGroupDescription: item.ProductGroupDescription,
            ProductGroupCode: item.ProductGroupCode,
            ProductGroupName: item.ProductGroupName,
            ProductGroupId: item.ProductGroupId
        });
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

        var url = "/DMS/Supplier/Delete";

        CommonAjaxService.deleteData(url, model, deleteDone, saveFail);
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
                    url: "/DMS/Supplier/GetGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false
                },
                parameterMap: function (options) {
                    
                    if (options.sort) {
                        options.sort.forEach(function (param) {
                            if (param.field === "Code") {
                                param.field = "H.Code";
                            }
                            if (param.field === "Name") {
                                param.field = "H.Name";
                            }
                            if (param.field === "BanglaName") {
                                param.field = "H.BanglaName";
                            }
                            if (param.field === "Address") {
                                param.field = "H.Address";
                            }
                            if (param.field === "SupplierGroupName") {
                                param.field = "SG.Name";
                            }

                            if (param.field === "City") {
                                param.field = "H.City";
                            }
                            if (param.field === "TelephoneNo") {
                                param.field = "H.TelephoneNo";
                            }
                            if (param.field === "Email") {
                                param.field = "H.Email";
                            }
                            if (param.field === "ContactPerson") {
                                param.field = "H.ContactPerson";
                            }
                            if (param.field === "ContactPerson") {
                                param.field = "H.ContactPerson";
                            }
                            if (param.field === "Comments") {
                                param.field = "H.Comments";
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
                            if (param.field === "Code") {
                                param.field = "H.Code";
                            }
                            if (param.field === "Name") {
                                param.field = "H.Name";
                            }
                            if (param.field === "BanglaName") {     
                                param.field = "H.BanglaName";
                              
                            }
                            if (param.field === "Address") {
                                param.field = "H.Address";
                            }

                            if (param.field === "SupplierGroupName") {
                                param.field = "SG.Name";
                            }

                            if (param.field === "City") {
                                param.field = "H.City";
                            }
                            if (param.field === "TelephoneNo") {
                                param.field = "H.TelephoneNo";
                            }
                            if (param.field === "Email") {
                                param.field = "H.Email";
                            }
                            if (param.field === "ContactPerson") {
                                param.field = "H.ContactPerson";
                            }
                            if (param.field === "ContactPerson") {
                                param.field = "H.ContactPerson";
                            }
                            if (param.field === "Comments") {
                                param.field = "H.Comments";
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
                        contains: "Contains",
                        doesnotcontain: "Does not contain",
                        eq: "Is equal to",
                        neq: "Is not equal to"
                    }
                }
            },
            sortable: true,
            resizable: true,
            reorderable: true,
            groupable: true,
            toolbar: ["excel", "pdf", "search"],
            search: {
                fields: ["Code", "Name", "BanglaName", "Address","SupplierGroupName", "City", "TelephoneNo", "ContactPerson","Status"]
            },
            excel: {
                fileName: "Supplier.xlsx",
                filterable: true
            },
            pdf: {
                fileName: `Suppliers_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`,
                allPages: true,
                avoidLinks: true,
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


                var fileName = `Suppliers_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`;

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
                    width: 100,
                    template: function (dataItem) {
                        return `
                            <a href="/DMS/Supplier/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                                <i class="fas fa-pencil-alt"></i>
                            </a>

                        <a href="/DMS/Supplier/getReport/${dataItem.Id}" 
                          class="btn btn-success btn-sm mr-2 getReport" 
                          title="Report">
                           <i class="fas fa-file-alt"></i>
                      </a>


            `;
                    }
                },
                { field: "Id", width: 50, hidden: true, sortable: true },
                { field: "Code", title: "Code", width: 150, hidden: true, sortable: true },
                { field: "Name", title: "Name", sortable: true, width: 200 },
                { field: "BanglaName", title: "Bangla Name", width: 150, hidden: true, sortable: true },
                { field: "SupplierGroupName", title: "Supplier Group Name", width: 150, sortable: true },
                { field: "Address", title: "Address", sortable: true, width: 200 },
                { field: "City", title: "City", sortable: true, width: 200 },
                { field: "TelephoneNo", title: "Telephone No.", sortable: true, width: 200 },
                { field: "Email", title: "Email", sortable: true, hidden: true, width: 200 },
                { field: "ContactPerson", title: "Contact Person", sortable: true, hidden: true, width: 200 },
                { field: "Comments", title: "Comments", sortable: true, hidden: true, width: 200 },

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
        
        var isDropdownValid = CommonService.validateDropdown("#SupplierGroupId", "#titleError1", "Supplier Group is required");
        var validator = $("#frmEntry").validate();
        var formData = new FormData();

        var model = serializeInputs("frmEntry");

        var result = validator.form();

        if (!result || !isDropdownValid) {
            if (!result) {
                validator.focusInvalid();
            }
            return;
        }

        // Append form fields to FormData
        for (var key in model) {
            formData.append(key, model[key]);
        }


        formData.append("IsActive", $('#IsActive').prop('checked'));

        // Check if delete button was clicked to remove image
        var deleteImageClicked = $("#deleteImageBtn").hasClass("clicked");
        if (deleteImageClicked) {
            formData.append("ImagePath", "");
            $("#imagePreview").remove();
            $("#ImagePath").val("");
        }

        var fileInput = document.getElementById("imageUpload");
        if (fileInput.files.length > 0) {
            var file = fileInput.files[0];

            if (file.size > 26214400) {
                ShowNotification(3, "Image size cannot exceed 25MB.");
                return;
            }

            formData.append("file", file);
        } else if (!deleteImageClicked) {
            var existingImagePath = $("#ImagePath").val();
            if (existingImagePath) {
                formData.append("ImagePath", existingImagePath);
            }
        }

        var grid = $("#AddedItemGrid").data("kendoGrid");
        var details = [];
        if (grid) {
            var dataItems = grid.dataSource.view();
            for (var i = 0; i < dataItems.length; i++) {
                var item = dataItems[i];
                details.push({
                    Id: item.Id,
                    ProductId: item.ProductId,
                    Code: item.Code,
                    Name: item.Name,
                    BanglaName: item.BanglaName,
                    UOMId: item.UOMId,
                    VATRate: item.VATRate,
                    HSCodeNo: item.HSCodeNo,
                    SDRate: item.SDRate,
                    Description: item.Description,
                    ProductGroupDescription: item.ProductGroupDescription,
                    ProductGroupCode: item.ProductGroupCode,
                    ProductGroupName: item.ProductGroupName,
                    ProductGroupId: item.ProductGroupId
                });
            }
        }

        if (details.length === 0) {
            ShowNotification(3, "At least one product detail is required.");
            $(".btnsave").prop("disabled", false);
            return;
        }

        //model.MasterItemList = details;
        debugger;
        for (var i = 0; i < details.length; i++) {

            formData.append("MasterItemList[" + i + "].Id", details[i].Id);
            formData.append("MasterItemList[" + i + "].ProductId", details[i].ProductId);
            formData.append("MasterItemList[" + i + "].Code", details[i].Code);
            formData.append("MasterItemList[" + i + "].Name", details[i].Name);
            formData.append("MasterItemList[" + i + "].BanglaName", details[i].BanglaName);
            formData.append("MasterItemList[" + i + "].UOMId", details[i].UOMId);
            formData.append("MasterItemList[" + i + "].VATRate", details[i].VATRate);
            formData.append("MasterItemList[" + i + "].HSCodeNo", details[i].HSCodeNo);
            formData.append("MasterItemList[" + i + "].SDRate", details[i].SDRate);
            formData.append("MasterItemList[" + i + "].Description", details[i].Description);
            formData.append("MasterItemList[" + i + "].ProductGroupDescription", details[i].ProductGroupDescription);
            formData.append("MasterItemList[" + i + "].ProductGroupCode", details[i].ProductGroupCode);
            formData.append("MasterItemList[" + i + "].ProductGroupName", details[i].ProductGroupName);
            formData.append("MasterItemList[" + i + "].ProductGroupId", details[i].ProductGroupId);

        }

        var url = "/DMS/Supplier/CreateEdit";

        CommonAjaxService.finalImageSave(url, formData, saveDone, saveFail);
    };

    //function saveDone(result) {

    //    if (result.Status === 200) {
    //        if (result.Data.Operation === "add") {
    //            ShowNotification(1, result.Message);
    //            $(".btnsave").html('Update');

    //            $(".divSave").hide();

    //            $(".divUpdate").show();
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
    //            setTimeout(function () {
    //                location.reload();
    //            }, 700);

    //            $("#imageUpload").prop("disabled", true);
    //        }
    //        if (result.Data.ImagePath) {
    //            var imagePath = result.Data.ImagePath;
    //            if (!imagePath.startsWith("http") && !imagePath.startsWith("/")) {
    //                imagePath = "/" + imagePath; // Ensure it starts with "/"
    //            }
    //            $("#imagePreview").attr("src", imagePath + "?t=" + new Date().getTime()).show();
    //            $("#deleteImageBtn").show();
    //            $("#ImagePath").val(imagePath); // Update hidden field with new path
    //        }
    //        else {
    //            $("#imagePreview").hide();
    //            $("#deleteImageBtn").hide();
    //        }
    //    }
    //    else if (result.Status == 400) {
    //        ShowNotification(3, result.Message);
    //    }
    //    else {
    //        ShowNotification(2, result.Message);
    //    }
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

    function saveFail(err) {
        
        ShowNotification(3, "Query Exception!");
    }

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
    };
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
    form.action = '/DMS/Supplier/ReportPreview';
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

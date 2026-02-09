var SupplierController = function (CommonService, CommonAjaxService) {
    var getSupplierGroupId = 0;
    var init = function () {
        getSupplierGroupId = $("#SupplierGroupId").val() || 0;
        
        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';
        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();
        }
        GetSupplierGroupComboBox();
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

        //// Handle file input change to preview image
        //$("#imageUpload").on("change", function (event) {
        //    $("#imageUpload").prop("disabled", true);
        //    var file = event.target.files[0];

        //    if (!file) {
        //        console.error("No file selected!");
        //        return;
        //    }

        //    var reader = new FileReader();

        //    reader.onload = function (e) {
        //        console.log("File loaded successfully!"); // Debugging

        //        // Update the preview image and make it visible
        //        $("#imagePreview").attr("src", e.target.result).show();
        //        $("#deleteImageBtn").show();
        //    };

        //    reader.onerror = function (error) {
        //        console.error("Error reading file:", error);
        //    };

        //    reader.readAsDataURL(file);
        //});

        //$("#deleteImageBtn").on("click", function () {
        //    $(this).addClass("clicked");
        //    $("#imagePreview").attr("src", "").hide(); // Hide preview
        //    $("#ImagePath").val(""); // Clear hidden field
        //    $("#deleteImageBtn").hide();
        //    $("#imageUpload").val("");// Hide delete button
        //    $("#imageUpload").prop("disabled", false);

        //});

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

        //// Check if delete button was clicked to remove image
        //var deleteImageClicked = $("#deleteImageBtn").hasClass("clicked");
        //if (deleteImageClicked) {
        //    formData.append("ImagePath", "");  // Mark image for deletion
        //    $("#imagePreview").remove();
        //    $("#ImagePath").val("");
        //}

        //var fileInput = document.getElementById("imageUpload");
        //if (fileInput.files.length > 0) {
        //    var file = fileInput.files[0];

        //    // ✅ Validate file size (Max 25MB)
        //    if (file.size > 26214400) { // 25MB in bytes
        //        ShowNotification(3, "Image size cannot exceed 25MB.");
        //        return;
        //    }

        //    formData.append("file", file);
        //} else if (!deleteImageClicked) {
        //    var existingImagePath = $("#ImagePath").val();
        //    if (existingImagePath) {
        //        formData.append("ImagePath", existingImagePath);
        //    }
        //}

        var url = "/DMS/Supplier/CreateEdit";

        CommonAjaxService.finalImageSave(url, formData, saveDone, saveFail);
    };

    function saveDone(result) {
        
        if (result.Status === 200) {
            if (result.Data.Operation === "add") {
                ShowNotification(1, result.Message);
                $(".btnsave").html('Update');
             
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
                setTimeout(function () {
                    location.reload();
                }, 700);

                $("#imageUpload").prop("disabled", true);
            }
            if (result.Data.ImagePath) {
                var imagePath = result.Data.ImagePath;
                if (!imagePath.startsWith("http") && !imagePath.startsWith("/")) {
                    imagePath = "/" + imagePath; // Ensure it starts with "/"
                }
                $("#imagePreview").attr("src", imagePath + "?t=" + new Date().getTime()).show();
                $("#deleteImageBtn").show();
                $("#ImagePath").val(imagePath); // Update hidden field with new path
            }
            else {
                $("#imagePreview").hide();
                $("#deleteImageBtn").hide();
            }
        }
        else if (result.Status == 400) {
            ShowNotification(3, result.Message);
        }
        else {
            ShowNotification(2, result.Message);
        }
    }

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

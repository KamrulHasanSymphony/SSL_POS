var MasterItemController = function (CommonService, CommonAjaxService) {
    var getProductGroupId = 0;
    var getUOMId = 0;

    var init = function () {
      
        getProductGroupId = $("#ProductGroupId").val() || 0;
        getCtnSize = $("#CtnSize").val() || '';
        getUOMId = $("#UOMId").val() || 0;
        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';

        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();
        };

        if (getOperation !== '') {
            GetProductGroupComboBox();
            GetUOMComboBox();
        };


        $('.btnsave').click('click', function () {
            debugger;
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
                window.location.href = "/DMS/MasterItem/NextPrevious?id=" + getId + "&status=Previous";
            }
        });
        $('#btnNext').click('click', function () {
            var getId = $('#Id').val();
            if (parseInt(getId) > 0) {
                window.location.href = "/DMS/MasterItem/NextPrevious?id=" + getId + "&status=Next";
            }
        });

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


 

        $("#download").on("click", function () {

       
            var url = "/DMS/MasterItem/ExportProductExcel";

            //window.open(url + "?" + params, "_blank");
            window.open(url + "?", "_blank");

        });

        $("#downloadProductStock").on("click", function () {


            var url = "/DMS/MasterItem/ExportProductStockExcel";

            //window.open(url + "?" + params, "_blank");
            window.open(url + "?", "_blank");

        });


        $("#PurchasePriceDownload").on("click", function () {


            var url = "/DMS/MasterItem/ExportPurchasePriceHistoriesExcel";

            //window.open(url + "?" + params, "_blank");
            window.open(url + "?", "_blank");

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

    function GetProductGroupComboBox() {
        var ProductGroupComboBox = $("#ProductGroupId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [
                { field: "Code", title: "Code", width: 100 },
                { field: "Name", title: "Name", width: 150 },
                { field: "Description", title: "Description", width: 200 },
            ],
            filter: "contains",
            filterFields: ["Code", "Name", "Description"],
            dataSource: {
                transport: {
                    //read: "/Common/Common/GetProductGroupList"
                    read: "/Common/Common/GetProductGroupList?value=" + getProductGroupId
                     
                }
            },
            placeholder: "Select Product Group",
            value: "",
            dataBound: function (e) {
             
                if (getProductGroupId) {
                    this.value(parseInt(getProductGroupId));
                }
            },
            change: function (e) {
                
            }
        }).data("kendoMultiColumnComboBox");
    };


    function GetUOMComboBox() {
        var UOMComboBox = $("#UOMId").kendoMultiColumnComboBox({
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
                    read: "/Common/Common/GetUOMList"
                }
            },
            placeholder: "Select UOM",
            value: "",
            dataBound: function (e) {
                
                if (getUOMId) {
                    this.value(parseInt(getUOMId));
                }
            },
            change: function (e) {
                
            }
        }).data("kendoMultiColumnComboBox");
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
                    <a href="/DMS/MasterItem/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                        <i class="fas fa-pencil-alt"></i>
                    </a>
                            <a href="/DMS/MasterItem/getReport/${dataItem.Id}" 
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


    function save() {
        debugger;

        var isDropdownValid1 = CommonService.validateDropdown("#ProductGroupId", "#titleError1", "Product Group is required");
        var isDropdownValid2 = CommonService.validateDropdown("#UOMId", "#titleError2", "UOM is required");
        var isDropdownValid = isDropdownValid1 && isDropdownValid2;

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

        for (var key in model) {
            formData.append(key, model[key]);
        }

        // Handle checkbox value
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



        var url = "/DMS/MasterItem/CreateEdit";

        CommonAjaxService.finalImageSave(url, formData, saveDone, saveFail);
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
                //setTimeout(function () {
                //    location.reload();
                //}, 700);

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
    form.action = '/DMS/MasterItem/ReportPreview';
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
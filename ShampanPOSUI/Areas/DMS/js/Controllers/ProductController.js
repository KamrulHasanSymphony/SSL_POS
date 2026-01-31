var ProductController = function (CommonService, CommonAjaxService) {
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
            GetCTNSIZEComboBox();
            GetUOMComboBox();
        };


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
                window.location.href = "/DMS/Product/NextPrevious?id=" + getId + "&status=Previous";
            }
        });
        $('#btnNext').click('click', function () {
            var getId = $('#Id').val();
            if (parseInt(getId) > 0) {
                window.location.href = "/DMS/Product/NextPrevious?id=" + getId + "&status=Next";
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

        $("#btnProductBatchHistory").on("click", function () {
            GetGridDataListofProductBatchHistory()
        });
        $("#btnProductPurchasePriceBatchHistory").on("click", function () {
            GridDataListofProductPurchasePriceBatchHistory()
        });
        $("#btnProductUOMConversion").on("click", function () {
            GridDataListofProductUOMConversion()
        });
        $("#btnProductStock").on("click", function () {
            GridDataListofProductStock()
        });



        $("#download").on("click", function () {

       
            var url = "/DMS/Product/ExportProductExcel";

            //window.open(url + "?" + params, "_blank");
            window.open(url + "?", "_blank");

        });

        $("#downloadProductStock").on("click", function () {


            var url = "/DMS/Product/ExportProductStockExcel";

            //window.open(url + "?" + params, "_blank");
            window.open(url + "?", "_blank");

        });


        $("#PurchasePriceDownload").on("click", function () {


            var url = "/DMS/Product/ExportPurchasePriceHistoriesExcel";

            //window.open(url + "?" + params, "_blank");
            window.open(url + "?", "_blank");

        });

    };

    //End Init


    $("#btnUpload").click(function () {
        pageSubmit('frmProductImport'); 
    });

    $("#btnProductStockUpload").click(function () {
        pageProductStockSubmit('frmProductStockImport');
    });
    $("#btnPurchaseUpload").click(function () {
        pageProductPurchaseSubmit('frmProductPurchaseImport');
    });


    function pageProductStockSubmit(formId) {
     
        console.log(formId)
        var form = $("#" + formId)[0];



        var fileInput = $("#" + formId + " input[type='file']");
        if (fileInput.get(0).files.length === 0) {
            ShowNotification(3, "Please Select Excel File First");
            return;
        }



        var formData = new FormData(form);
        var url = "/Product/ImportProductStockExcel";
        CommonAjaxService.ImportExcel(url, formData, saveImportExcelDone, saveImportExcelFail);

    }
    function pageProductPurchaseSubmit(formId) {

        console.log(formId)
        var form = $("#" + formId)[0];



        var fileInput = $("#" + formId + " input[type='file']");
        if (fileInput.get(0).files.length === 0) {
            ShowNotification(3, "Please Select Excel File First");
            return;
        }



        var formData = new FormData(form);
        var url = "/Product/PurchaseImportExcel";
        CommonAjaxService.ImportExcel(url, formData, saveImportExcelDone, saveImportExcelFail);

    }
    function pageSubmit(formId) {
     
        console.log(formId)
        var form = $("#" + formId)[0]; 


     
        var fileInput = $("#" + formId + " input[type='file']");
        if (fileInput.get(0).files.length === 0) {
            ShowNotification(3, "Please Select Excel File First");
            return; 
        }
        


        var formData = new FormData(form); 
        var url = "/Product/ImportExcel";
        CommonAjaxService.ImportExcel(url, formData, saveImportExcelDone, saveImportExcelFail);

    }
    function saveImportExcelDone(result) {
     
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
    function saveImportExcelFail(result) {
        ShowNotification(3, "Query Exception!");
    };

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

        var url = "/DMS/Product/Delete";

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


    function GetCTNSIZEComboBox() {
        var CTNSIZEComboBox = $("#CtnSize").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Name",
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
            placeholder: "Select CTN SIZE",
            value: "",
            dataBound: function (e) {
                debugger;
                if (getCtnSize) {
                    this.value(getCtnSize);   // No parseInt needed
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
                    url: "/DMS/Product/GetGridData",
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
                            if (param.field === "UOMId") {
                                param.field = "H.UOMId";
                            }
                            if (param.field === "SalePrice") {
                                param.field = "H.SalePrice";
                            }
                            if (param.field === "PurchasePrice") {
                                param.field = "H.PurchasePrice";
                            }
                            if (param.field === "SDRate") {
                                param.field = "H.SDRate";
                            }
                            if (param.field === "VATRate") {
                                param.field = "H.VATRate";
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
                            if (param.field === "UOMId") {
                                param.field = "H.UOMId";
                            }

                            if (param.field === "SalePrice") {
                                param.field = "H.SalePrice";
                            }
                            if (param.field === "PurchasePrice") {
                                param.field = "H.PurchasePrice";
                            }
                            if (param.field === "SDRate") {
                                param.field = "H.SDRate";
                            }
                            if (param.field === "VATRate") {
                                param.field = "H.VATRate";
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
                fields: ["Code", "Name", "Description", "ProductGroupName", "SDRate", "VATRate", "PurchasePrice","SalePrice","Status"]
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
                    width: 100,
                    template: function (dataItem) {
                        
                        return `
                    <a href="/DMS/Product/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                        <i class="fas fa-pencil-alt"></i>
                    </a>
                            <a href="/DMS/Product/getReport/${dataItem.Id}" 
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
                { field: "UOMId", title: "UOM", sortable: true, width: 130 },
                { field: "Description", title: "Description", sortable: true, width: 200, hidden: true },
                { field: "SalePrice", title: "Sale Price", sortable: true, width: 120 },
                { field: "PurchasePrice", title: "Purchase Price", sortable: true, width: 120 },
                { field: "VATRate", title: "VAT Rate", sortable: true, width: 120 },
                { field: "SDRate", title: "SD Rate", sortable: true, width: 120 },

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


    var GetGridDataListofProductBatchHistory = function () {
        getProductId = $("#Id").val()
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
                    url: "/DMS/ProductBatchHistory/GetGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false,
                    data: { getProductId: getProductId }
                },
                parameterMap: function (options) {
                    
                    if (options.sort) {
                        options.sort.forEach(function (param) {
                            if (param.field === "Id") {
                                param.field = "H.Id";
                            }

                            if (param.field === "BatchNo") {
                                param.field = "H.BatchNo";
                            }
                            if (param.field === "EntryDate") {
                                param.field = "H.EntryDate";
                            }
                            if (param.field === "MFGDate") {
                                param.field = "H.MFGDate";
                            }
                            if (param.field === "CostPrice") {
                                param.field = "H.CostPrice";
                            }
                            if (param.field === "ProductName") {
                                param.field = "P.Name";
                            }
                        });
                    }

                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (param) {
                            if (param.field === "Id") {
                                param.field = "H.Id";
                            }
                            if (param.field === "BatchNo") {
                                param.field = "H.BatchNo";
                            }
                            if (param.field === "EntryDate") {
                                param.field = "H.EntryDate";
                            }
                            if (param.field === "MFGDate") {
                                param.field = "H.MFGDate";
                            }
                            if (param.field === "CostPrice") {
                                param.field = "H.CostPrice";
                            }
                            if (param.field === "ProductName") {
                                param.field = "P.Name";
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

        $("#GridDataListofProductBatchHistory").kendoGrid({
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
            search: ["ProductName", "BatchNo", "EntryDate", "MFGDate", "EXPDate", "CostPrice", "SalesPrice", "PurchasePrice"],
            excel: {
                fileName: "Products.xlsx",
                filterable: true
            },

            pdfExport: function (e) {
                e.preventDefault();

                if (!kendo.drawing || !kendo.drawing.drawDOM) {
                    console.log("Kendo Drawing is not available.");
                    return;
                }

                var companyName = "OSAKA ELECTRIC & INDUSTRIAL CO.";

                var masterPdfContainer = $("<div id='masterPdfContent' style='padding:5px;font-size:11px;position:relative; height: auto; font-family: SolaimanLipi, Nikosh, Vrinda, Arial Unicode MS, sans-serif;'>");
                $("body").append(masterPdfContainer);

                var pdfContainer = $("<div id='pdfContent' style='padding:5px;font-size:9px;position:relative; height: auto; font-family: SolaimanLipi, Nikosh, Vrinda, Arial Unicode MS, sans-serif;'>");

                $.ajax({
                    url: "/DMS/ProductBatchHistory/GetProductBatchHistoryById",
                    type: "GET",
                    dataType: "json",
                    data: { productId: 0 },
                    async: false,
                    success: function (response) {
                        
                        if (response.Items && response.Items.length > 0) {
                            let count = 1;
                            var decimalPlace = 2;
                            let tableHTML = `
                                            <table style="width:100%;border-collapse:collapse;margin-bottom:10px;font-size:9px;word-break:break-word; table-layout: fixed;">
                                                <!-- Thead will be dynamically repeated here -->
                                                <tbody>
                                        `;

                            response.Items.forEach(item => {
                                let fontSize = "7.5px";

                                tableHTML += `
                                <tr style="width:100%;border-collapse:collapse;margin-bottom:10px;font-size:9px;word-break:break-word; table-layout: fixed;">
                                    <td style="border: 1px solid #000; width:2%;  padding: 2px;font-size:${fontSize};">${count++}</td>
                                    <td style="border: 1px solid #000; width:5.6%;padding: 2px;font-size:${fontSize};">${item.ProductGroupCode}</td>
                                    <td style="border: 1px solid #000; width:5.6%;padding: 2px;font-size:${fontSize};">${item.ProductGroupName}</td>
                                    <td style="border: 1px solid #000; width:5.6%;padding: 2px;font-size:${fontSize};">${item.ProductCode}</td>
                                    <td style="border: 1px solid #000; width:5.6%;padding: 2px;font-size:${fontSize};">${item.ProductName}</td>
                                    <td style="border: 1px solid #000; width:5.6%;padding: 2px;font-family: SolaimanLipi, Nikosh, Vrinda, Arial Unicode MS, sans-serif;font-size:${fontSize};">${item.BanglaName}</td>
                                    <td style="border: 1px solid #000; width:5.6%;padding: 2px;font-size:${fontSize};">${item.HSCodeNo}</td>
                                    <td style="border: 1px solid #000; width:5.6%;padding: 2px;font-size:${fontSize};">${item.ProductDescription}</td>
                                    <td style="border: 1px solid #000; width:5.6%;padding: 2px;font-size:${fontSize};">${item.UOMName}</td>
                                    <td style="border: 1px solid #000; width:5.6%;padding: 2px;font-size:${fontSize};">${item.EntryDate}</td>
                                    <td style="border: 1px solid #000; width:5.6%;padding: 2px;font-size:${fontSize};">${item.MFGDate}</td>
                                    <td style="border: 1px solid #000; width:5.6%;padding: 2px;font-size:${fontSize};">${item.EXPDate}</td>

                                    <td style="border: 1px solid #000; width:5.6%;padding: 2px;text-align:right;font-size:${fontSize};">${Number(parseFloat(item.CostPrice).toFixed(parseInt(decimalPlace))).toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) })}</td>
                                    <td style="border: 1px solid #000; width:5.6%;padding: 2px;text-align:right;font-size:${fontSize};">${Number(parseFloat(item.SalesPrice).toFixed(parseInt(decimalPlace))).toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) })}</td>
                                    <td style="border: 1px solid #000; width:5.6%;padding: 2px;text-align:right;font-size:${fontSize};">${Number(parseFloat(item.PurchasePrice).toFixed(parseInt(decimalPlace))).toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) })}</td>
                                    <td style="border: 1px solid #000; width:5.6%;padding: 2px;text-align:right;font-size:${fontSize};">${Number(parseFloat(item.SD).toFixed(parseInt(decimalPlace))).toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) })}</td>
                                    <td style="border: 1px solid #000; width:5.6%;padding: 2px;text-align:right;font-size:${fontSize};">${Number(parseFloat(item.VATRate).toFixed(parseInt(decimalPlace))).toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) })}</td>
                                    <td style="border: 1px solid #000; width:5.6%;padding: 2px;font-size:${fontSize};">${item.Status}</td>
                                </tr>
                            `;
                            });

                            tableHTML += `</tbody></table>`;
                            pdfContainer.append(tableHTML);
                        }
                    }
                });

                masterPdfContainer.append(pdfContainer);

                setTimeout(() => {
                    kendo.drawing.drawDOM($("#masterPdfContent"), {
                        paperSize: "A4",
                        margin: { top: "3cm", left: "1cm", right: "0.3cm", bottom: "2cm" },
                        landscape: true,
                        multiPage: true,
                        template: function (pageIndex, totalPages) {
                            // Add a new <thead> for each page.
                            return `<div style="position: absolute; top:4px; left:38px;right:30px;width: 93.3%; text-align: center;">
                                    <h2 style="font-family: SolaimanLipi;">${companyName}</h2>
                                    <hr style="border-top: 1px solid black;">
                                    <table style="width:100%;border-collapse:collapse;margin-bottom:10px;font-size:9px;word-break:break-word; table-layout: fixed;">
                                       <thead style="display: table-header-group;">
                                         <tr style="background: #ddd; text-align: center;width:100%;border-collapse:collapse;margin-bottom:10px;font-size:9px;word-break:break-word; table-layout: fixed;">
                                            <th style="border: 1px solid #000; padding: 2px;width:2%;text-align:center;">SL</th>
                                            <th style="border: 1px solid #000; padding: 2px;width:5.6%;">Group Code</th>
                                            <th style="border: 1px solid #000; padding: 2px;width:5.6%;">Group Name</th>
                                            <th style="border: 1px solid #000; padding: 2px;width:5.6%;">Product Code</th>
                                            <th style="border: 1px solid #000; padding: 2px;width:5.6%;">Product Name</th>
                                            <th style="border: 1px solid #000; padding: 2px;width:5.6%;">Bangla Name</th>
                                            <th style="border: 1px solid #000; padding: 2px;width:5.6%;">HS Code No.</th>
                                            <th style="border: 1px solid #000; padding: 2px;width:5.6%;">Description</th>
                                            <th style="border: 1px solid #000; padding: 2px;width:5.6%;">UOM Name</th>
                                            <th style="border: 1px solid #000; padding: 2px;width:5.6%;">Entry Date</th>
                                            <th style="border: 1px solid #000; padding: 2px;width:5.6%;">MFG Date</th>
                                            <th style="border: 1px solid #000; padding: 2px;width:5.6%;">EXP Date</th>
                                            <th style="border: 1px solid #000; padding: 2px;width:5.6%;">Cost Price</th>
                                            <th style="border: 1px solid #000; padding: 2px;width:5.6%;">Sales Price</th>
                                            <th style="border: 1px solid #000; padding: 2px;width:5.6%;">Purchase Price</th>
                                            <th style="border: 1px solid #000; padding: 2px;width:5.6%;">SD Rate</th>
                                            <th style="border: 1px solid #000; padding: 2px;width:5.6%;">VAT Rate</th>
                                            <th style="border: 1px solid #000; padding: 2px;width:5.6%;">Status</th>
                                        </tr>
                                      </thead>
                                    </table>
                                </div>`;
                        }
                    }).then(function (group) {
                        return kendo.drawing.exportPDF(group, {});
                    }).then(function (dataURI) {
                        kendo.saveAs({ dataURI: dataURI, fileName: `ProductList_${new Date().toISOString().split('T')[0]}.pdf` });
                        $("#masterPdfContent").remove();
                    }).catch(function (error) {
                        console.log("PDF Export Error:", error);
                    });
                }, 300);
            }
            ,
            columns: [
                {
                    selectable: true, width: 40
                },
                {
                    title: "Action",
                    width: 60,
                    template: function (dataItem) {
                        
                        return `
                              <a href="/DMS/ProductBatchHistory/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                                  <i class="fas fa-pencil-alt"></i>
                              </a>`;

                    }
                },

                { field: "Id", width: 50, hidden: true, sortable: true },
                { field: "ProductName", title: "Name", width: 200, sortable: true },

                //{ field: "EntryDate", title: "Entry Date", sortable: true, width: 150 },
                //{ field: "MFGDate", title: "MFG Date", sortable: true, width: 150 },
                //{ field: "EXPDate", title: "EXP Date", sortable: true, width: 150 },

                { field: "EffectDate", title: "Effect Date", sortable: true, width: 150 },
                { field: "ProductGroupName", title: "Product Group Name", sortable: true, width: 150 },
                { field: "CostPrice", title: "Cost Price", sortable: true, width: 150 },
                { field: "SalesPrice", title: "Sale Price", sortable: true, width: 150 },
                { field: "PurchasePrice", title: "Purchase Price", sortable: true, width: 150 },
                { field: "SD", title: "SD Rate", sortable: true, width: 150 },
                { field: "VATRate", title: "VAT Rate", sortable: true, width: 150 },
            ],
            editable: false,
            selectable: "multiple row",
            navigatable: true,
            columnMenu: true
        });

    };

    var GridDataListofProductPurchasePriceBatchHistory = function () {
        getProductId = $("#Id").val()
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
                    url: "/DMS/ProductPurchasePriceBatchHistorie/GetGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false,
                    data: { getProductId: getProductId }
                },
                parameterMap: function (options) {
                    
                    if (options.sort) {
                        options.sort.forEach(function (param) {
                            if (param.field === "Id") {
                                param.field = "H.Id";
                            }

                            if (param.field === "BatchNo") {
                                param.field = "H.BatchNo";
                            }
                            if (param.field === "EntryDate") {
                                param.field = "H.EntryDate";
                            }
                            if (param.field === "MFGDate") {
                                param.field = "H.MFGDate";
                            }
                            if (param.field === "CostPrice") {
                                param.field = "H.CostPrice";
                            }
                            if (param.field === "ProductName") {
                                param.field = "P.Name";
                            }
                        });
                    }

                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (param) {
                            if (param.field === "Id") {
                                param.field = "H.Id";
                            }
                            if (param.field === "BatchNo") {
                                param.field = "H.BatchNo";
                            }
                            if (param.field === "EntryDate") {
                                param.field = "H.EntryDate";
                            }
                            if (param.field === "MFGDate") {
                                param.field = "H.MFGDate";
                            }
                            if (param.field === "CostPrice") {
                                param.field = "H.CostPrice";
                            }
                            if (param.field === "ProductName") {
                                param.field = "P.Name";
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

        $("#GridDataListofProductPurchasePriceBatchHistory").kendoGrid({
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
            search: ["ProductName", "BatchNo", "EntryDate", "MFGDate", "EXPDate", "CostPrice", "SalesPrice", "PurchasePrice"],
            excel: {
                fileName: "Products.xlsx",
                filterable: true
            },
            columns: [
                {
                    selectable: true, width: 40
                },
                {
                    title: "Action",
                    width: 60,
                    template: function (dataItem) {
                        
                        return `
                              <a href="/DMS/ProductPurchasePriceBatchHistorie/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                                  <i class="fas fa-pencil-alt"></i>
                              </a>`;

                    }
                },

                { field: "Id", width: 50, hidden: true, sortable: true },
                { field: "ProductName", title: "Name", width: 200, sortable: true },

                //{ field: "EntryDate", title: "Entry Date", sortable: true, width: 150 },
                //{ field: "MFGDate", title: "MFG Date", sortable: true, width: 150 },
                //{ field: "EXPDate", title: "EXP Date", sortable: true, width: 150 },

                { field: "EffectDate", title: "Effect Date", sortable: true, width: 150 },
                //{ field: "ProductGroupName", title: "Product Group Name", sortable: true, width: 150 },
                { field: "CostPrice", title: "Cost Price", sortable: true, width: 150 },
                { field: "SalesPrice", title: "Sale Price", sortable: true, width: 150 },
                { field: "PurchasePrice", title: "Purchase Price", sortable: true, width: 150 },
                { field: "SD", title: "SD Rate", sortable: true, width: 150 },
                { field: "VATRate", title: "VAT Rate", sortable: true, width: 150 },
            ],
            editable: false,
            selectable: "multiple row",
            navigatable: true,
            columnMenu: true
        });

    };

    var GridDataListofProductStock = function () {
        getProductId = $("#Id").val();
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
                    url: "/DMS/Product/GetGridDataofProductStock",
                    type: "POST",
                    dataType: "json",
                    cache: false,
                    data: { getProductId: getProductId }
                },
                parameterMap: function (options) {

                    if (options.sort) {
                        options.sort.forEach(function (param) {
                            //if (param.field === "Id") {
                            //    param.field = "H.Id";
                            //}

                            //if (param.field === "BatchNo") {
                            //    param.field = "H.BatchNo";
                            //}
                            //if (param.field === "EntryDate") {
                            //    param.field = "H.EntryDate";
                            //}
                            //if (param.field === "MFGDate") {
                            //    param.field = "H.MFGDate";
                            //}
                            //if (param.field === "CostPrice") {
                            //    param.field = "H.CostPrice";
                            //}
                            //if (param.field === "ProductName") {
                            //    param.field = "P.Name";
                            //}
                        });
                    }

                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (param) {
                            //if (param.field === "Id") {
                            //    param.field = "H.Id";
                            //}
                            //if (param.field === "BatchNo") {
                            //    param.field = "H.BatchNo";
                            //}
                            //if (param.field === "EntryDate") {
                            //    param.field = "H.EntryDate";
                            //}
                            //if (param.field === "MFGDate") {
                            //    param.field = "H.MFGDate";
                            //}
                            //if (param.field === "CostPrice") {
                            //    param.field = "H.CostPrice";
                            //}
                            //if (param.field === "ProductName") {
                            //    param.field = "P.Name";
                            //}
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

        $("#GridDataListofProductStock").kendoGrid({
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
            search: ["ProductName"],
            excel: {
                fileName: "Products.xlsx",
                filterable: true
            },
            columns: [            

                { field: "Id", width: 50, hidden: true, sortable: true },
                { field: "ProductName", title: "Name", width: 200, sortable: true },
                { field: "ProductCode", title: "Code", width: 200, sortable: true },
                { field: "OpeningDate", title: "Opening Date", width: 200, sortable: true },
                { field: "OpeningQuantity", title: "Opening Quantity", width: 200, sortable: true },
                { field: "OpeningValue", title: "Opening Value", width: 200, sortable: true },

                //{ field: "EntryDate", title: "Entry Date", sortable: true, width: 150 },
                //{ field: "MFGDate", title: "MFG Date", sortable: true, width: 150 },
                //{ field: "EXPDate", title: "EXP Date", sortable: true, width: 150 },

                //{ field: "EffectDate", title: "Effect Date", sortable: true, width: 150 },
                //{ field: "ProductGroupName", title: "Product Group Name", sortable: true, width: 150 },
                //{ field: "CostPrice", title: "Cost Price", sortable: true, width: 150 },
                //{ field: "SalesPrice", title: "Sale Price", sortable: true, width: 150 },
                //{ field: "PurchasePrice", title: "Purchase Price", sortable: true, width: 150 },
                //{ field: "SD", title: "SD Rate", sortable: true, width: 150 },
                //{ field: "VATRate", title: "VAT Rate", sortable: true, width: 150 },
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

        var url = "/DMS/Product/CreateEdit";

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
    };

    function saveFail(result) {
        
        
        ShowNotification(3, "Query Exception!");
    };



    var GridDataListofProductUOMConversion = function () {
        getProductId = $("#Id").val()

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
                    url: "/DMS/ProductUOMConversion/GetGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false,
                    data: { getProductId: getProductId }
                },
                parameterMap: function (options) {

                    if (options.sort) {
                        options.sort.forEach(function (param) {

                            if (param.field === "Id") {
                                param.field = "H.Id";
                            }
                            if (param.field === "Name") {
                                param.field = "H.Name";
                            }
                            if (param.field === "Packsize") {
                                param.field = "H.Packsize";
                            }
                            if (param.field === "ConversationFactor") {
                                param.field = "H.ConversationFactor";
                            }
                            
                        });
                    }

                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (param) {

                            if (param.field === "Id") {
                                param.field = "H.Id";
                            }
                            if (param.field === "Name") {
                                param.field = "H.Name";
                            }
                            if (param.field === "Packsize") {
                                param.field = "H.Packsize";
                            }
                            if (param.field === "ConversationFactor") {
                                param.field = "H.ConversationFactor";
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

        $("#GridDataListofProductUOMConversion").kendoGrid({
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
            search: ["Name", "Packsize", "ConversationFactor"],
            excel: {
                fileName: "Products.xlsx",
                filterable: true
            },
            columns: [
                {
                    selectable: true, width: 40
                },
                {
                    title: "Action",
                    width: 60,
                    template: function (dataItem) {

                        return `
                              <a href="/DMS/ProductUOMConversion/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                                  <i class="fas fa-pencil-alt"></i>
                              </a>`;

                    }
                },

                { field: "Id", width: 50, hidden: true, sortable: true },
                { field: "Name", title: "Name", width: 200, sortable: true },
                { field: "Packsize", title: "Pack Size", sortable: true, width: 150 },
                { field: "ConversationFactor", title: "Conversation Factor", sortable: true, width: 150 },

            ],
            editable: false,
            selectable: "multiple row",
            navigatable: true,
            columnMenu: true
        });

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
    form.action = '/DMS/Product/ReportPreview';
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
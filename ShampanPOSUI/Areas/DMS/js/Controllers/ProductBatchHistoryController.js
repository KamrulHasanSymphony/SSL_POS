var ProductBatchHistoryController = function (CommonAjaxService) {
    var getBranchId = 0;
    var getProductId = 0;
    var getPriceCategory = 0;


    var init = function () {

        getBranchId = $("#BranchId").val() || 0;
        getProductId = $("#ProductId").val() || 0;
        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';
     
        getPriceCategory = $("#PriceCategory").val() || 0;


        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();
        };
        var isIndex = $("#IsIndex").val().toLowerCase() === "true";

        if (!isIndex) {
            //GetProductComboBox();
            //GetBranchComboBox();
        }

        GetCustomerCategoryComboBox();



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

    };


    function GetCustomerCategoryComboBox() {

        var CurrencyComboBox = $("#PriceCategory").kendoMultiColumnComboBox({
            dataTextField: "Name",
            //dataValueField: "Id",
            dataValueField: "Name",
            height: 400,
            columns: [
                //{ field: "Code", title: "Code", width: 100 },
                { field: "Name", title: "Name", width: 150 },
            ],
            filter: "contains",
            //filterFields: ["Code", "Name"],
            filterFields: ["Name"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetCustomerCategoryList"
                }
            },
            placeholder: "Select Customer Category",
            value: "",
            dataBound: function (e) {

                if (getPriceCategory) {
                    
                    this.value(getPriceCategory);
                }
            }
        }).data("kendoMultiColumnComboBox");

    }

    //function GetProductComboBox() {

    //    var ProductComboBox = $("#ProductId").kendoMultiColumnComboBox({
    //        dataTextField: "Name",
    //        dataValueField: "Id",
    //        height: 400,
    //        columns: [
    //            { field: "Code", title: "Code", width: 100 },
    //            { field: "Name", title: "Name", width: 150 },
    //            { field: "Description", title: "Description", width: 200 },
    //        ],
    //        filter: "contains",
    //        filterFields: ["Code", "Name", "Description"],
    //        dataSource: {
    //            transport: {
    //                read: "/Common/Common/GetProductList"
    //            }
    //        },
    //        placeholder: "Select Product ", // Set the placeholder
    //        value: "",
    //        dataBound: function (e) {
                
    //            if (getProductId) {
    //                this.value(parseInt(getProductId));
    //            }
    //        }
    //        //change: function (e) {
    //        //    
    //        //}
    //    }).data("kendoMultiColumnComboBox");
    //};
    function GetBranchComboBox() {

        var BranchComboBox = $("#BranchId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [
                { field: "Code", title: "Code", width: 100 },
                { field: "Name", title: "Name", width: 150 },
                { field: "DistributorCode", title: "DistributorCode", width: 200 },
            ],
            filter: "contains",
            filterFields: ["Code", "Name", "DistributorCode"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetBranchList"
                }
            },
            placeholder: "Select Product ", // Set the placeholder
            value: "",
            dataBound: function (e) {
                
                if (getBranchId) {
                    this.value(parseInt(getBranchId));
                }
            }
            //change: function (e) {
            //    
            //}
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

        var url = "/DMS/ProductBatchHistory/Delete";

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
                    data: { productId: 0, tblName : 'ProductSalePriceBatchHistories' },
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
                { field: "EntryDate", title: "Entry Date", sortable: true, width: 150 },
                { field: "MFGDate", title: "MFG Date", sortable: true, width: 150 },
                { field: "EXPDate", title: "EXP Date", sortable: true, width: 150 },
                { field: "EffectDate", title: "Effect Date", sortable: true, width: 150 },
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


    function save() {
     
        var validator = $("#frmEntry").validate();
        var model = serializeInputs("frmEntry");

        var result = validator.form();

        if (!result) {
            validator.focusInvalid();
            return;
        }

        if ($('#IsActive').prop('checked')) {
            model.IsActive = true;
        }

 /*       model.CostPrice = model.CostPrice.replace(/,/g, '');*/
        model.SalesPrice = model.SalesPrice.replace(/,/g, '');
/*        model.PurchasePrice = model.PurchasePrice.replace(/,/g, '');*/
        //model.SD = model.SD.replace(/,/g, '');
        //model.VATRate = model.VATRate.replace(/,/g, '');


        var url = "/DMS/ProductBatchHistory/CreateEdit";

        CommonAjaxService.finalSave(url, model, saveDone, saveFail);
    };

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


}(CommonAjaxService);


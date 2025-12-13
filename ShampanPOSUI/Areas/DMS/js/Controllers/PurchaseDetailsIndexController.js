var PurchaseDetailsIndexController = function (CommonService, CommonAjaxService) {


    var init = function () {
          
        if ($("#IsPosted").length) {
            LoadCombo("IsPosted", '/Common/Common/GetBooleanDropDown');
            $("#IsPosted").val('');
            GetBranchList();
        };
      
        GetGridDetailsDataList();
       
        $("#indexSearch").on('click', function () {
            var branchId = $("#Branchs").data("kendoComboBox").value();

            if (branchId == "") {
                ShowNotification(3, "Please Select Branch Name First!");
                return;
            }
            const gridElement = $("#GridDetailsDataList");
            if (gridElement.data("kendoGrid")) {
                gridElement.data("kendoGrid").destroy();
                gridElement.empty();
            }

            GetGridDetailsDataList();

        });
    };
    function GetBranchList() {
        var branch = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/Common/Common/GetBranchList?value=",
                    dataType: "json",
                    success: function (data) {
                        
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].Id === 0 && data[i].Code === 'N/A') {
                                data[i].Id = '';
                                data[i].Name = 'All';
                            }
                        }
                        branch.data(data);
                    }
                }
            }
        });

        $("#Branchs").kendoComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            dataSource: branch,
            filter: "contains",
            suggest: true
        });
    };
   
    var GetGridDetailsDataList = function () {
        
        // Get values from UI elements
        var branchId = $("#Branchs").data("kendoComboBox").value();
        var FromDate = $('#FromDate').val();
        var ToDate = $('#ToDate').val();
        var IsPosted = $('#IsPosted').val();
        
      
        // Initialize Kendo DataSource
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
                    url: "/Purchase/GetDetailsGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false,
                    data: { branchId: branchId, isPost: IsPosted, fromDate: FromDate, toDate: ToDate }
                },
                parameterMap: function (options) {
                    if (options.sort) {
                        options.sort.forEach(function (param) {
                            if (param.field === "Id") {
                                param.field = "H.Id";
                            }
                            if (param.field === "Code") {
                                param.field = "H.Code";
                            }
                            if (param.field === "SupplierName") {
                                param.field = "S.Name";
                            }
                            if (param.field === "BENumber") {
                                param.field = "H.BENumber";
                            }
                            if (param.field === "InvoiceDateTime" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "H.InvoiceDateTime";
                            }
                            if (param.field === "PurchaseDate" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "H.PurchaseDate";
                            }
                            if (param.field === "GrandTotalAmount") {
                                param.field = "H.GrandTotalAmount";
                            }
                            if (param.field === "GrandTotalSDAmount") {
                                param.field = "H.GrandTotalSDAmount";
                            }
                            if (param.field === "GrandTotalVATAmount") {
                                param.field = "H.GrandTotalVATAmount";
                            }
                            if (param.field === "Comments") {
                                param.field = "H.Comments";
                            }
                            if (param.field === "TransactionType") {
                                param.field = "H.TransactionType";
                            }
                            if (param.field === "Status") {
                                let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";

                                if (statusValue.startsWith("p")) {
                                    param.value = 1;
                                } else if (statusValue.startsWith("n")) {
                                    param.value = 0;
                                } else {
                                    param.value = null;
                                }

                                param.field = "H.IsPost";
                                param.operator = "eq";
                            }
                            if (param.field === "Completed") {
                                let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";

                                if (statusValue.startsWith("c")) {
                                    param.value = 1;
                                } else if (statusValue.startsWith("n")) {
                                    param.value = 0;
                                } else {
                                    param.value = null;
                                }

                                param.field = "H.IsCompleted";
                                param.operator = "eq";
                            }
                            if (param.field === "CurrencyName") {
                                param.field = "c.Name";
                            }
                           
                            if (param.field === "ImportIDExcel") {
                                param.field = "H.ImportIDExcel";
                            }
                            if (param.field === "FiscalYear") {
                                param.field = "H.FiscalYear";
                            }
                            if (param.field === "BranchName") {
                                param.field = "Br.Name";
                            }
                            if (param.field === "CurrencyRateFromBDT") {
                                param.field = "H.CurrencyRateFromBDT";
                            }
                            if (param.field === "FileName") {
                                param.field = "H.FileName";
                            }
                            if (param.field === "CustomHouse") {
                                param.field = "H.CustomHouse";
                            }
                            if (param.field === "BranchAddress") {
                                param.field = "Br.Address";
                            }
                            if (param.field === "SupplierAddress") {
                                param.field = "S.Address";
                            }
                            if (param.field === "PeriodId") {
                                param.field = "H.PeriodId";
                            }
                            if (param.field === "PurchaseOrderId") {
                                param.field = "D.PurchaseOrderId";
                            }
                            if (param.field === "Line") {
                                param.field = "D.Line";
                            }
                            if (param.field === "ProductName") {
                                param.field = "P.Name";
                            }
                            if (param.field === "Quantity") {
                                param.field = "D.Quantity";
                            }
                            if (param.field === "UnitPrice") {
                                param.field = "D.UnitPrice";
                            }
                            if (param.field === "SubTotal") {
                                param.field = "D.SubTotal";
                            }
                            if (param.field === "SD") {
                                param.field = "D.SD";
                            }
                            if (param.field === "SDAmount") {
                                param.field = "D.SDAmount";
                            }
                            if (param.field === "VATRate") {
                                param.field = "D.VATRate";
                            }
                            if (param.field === "VATAmount") {
                                param.field = "D.VATAmount";
                            }
                            if (param.field === "OthersAmount") {
                                param.field = "D.OthersAmount";
                            }
                            if (param.field === "UOMName") {
                                param.field = "Us.Name";
                            }
                            if (param.field === "UOMConversion") {
                                param.field = "D.UOMConversion";
                            }
                            if (param.field === "VATType") {
                                param.field = "D.VATType";
                            }
                        });
                    }

                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (param) {

                            if (param.field === "Id") {
                                param.field = "H.Id";
                            }
                            if (param.field === "Code") {
                                param.field = "H.Code";
                            }
                            if (param.field === "SupplierName") {
                                param.field = "S.Name";
                            }
                            if (param.field === "SupplierAddress") {
                                param.field = "S.Address";
                            }
                            if (param.field === "BENumber") {
                                param.field = "H.BENumber";
                            }
                            if (param.field === "InvoiceDateTime" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "CONVERT(VARCHAR(10), H.InvoiceDateTime, 120)";
                            }
                            if (param.field === "PurchaseDate" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "CONVERT(VARCHAR(10), H.PurchaseDate, 120)";
                            }
                            if (param.field === "GrandTotalAmount") {
                                param.field = "H.GrandTotalAmount";
                            }
                            if (param.field === "GrandTotalSDAmount") {
                                param.field = "H.GrandTotalSDAmount";
                            }
                            if (param.field === "GrandTotalVATAmount") {
                                param.field = "H.GrandTotalVATAmount";
                            }
                            if (param.field === "Comments") {
                                param.field = "H.Comments";
                            }
                            if (param.field === "TransactionType") {
                                param.field = "H.TransactionType";
                            }
                            if (param.field === "Status") {
                                let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";
                                
                                if (statusValue.startsWith("p")) {
                                    param.value = 1;
                                } else if (statusValue.startsWith("not")) {
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

                                param.field = "H.IsPost";
                                param.operator = "eq";
                            }
                            if (param.field === "Completed") {
                                let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";

                                if (statusValue.startsWith("c")) {
                                    param.value = 1;
                                } else if (statusValue.startsWith("n")) {
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

                                param.field = "H.IsCompleted";
                                param.operator = "eq";
                            }
                            if (param.field === "CurrencyName") {
                                param.field = "c.Name";
                            }
                           
                            if (param.field === "ImportIDExcel") {
                                param.field = "H.ImportIDExcel";
                            }
                            if (param.field === "FileName") {
                                param.field = "H.FileName";
                            }
                            if (param.field === "CustomHouse") {
                                param.field = "H.CustomHouse";
                            }
                            if (param.field === "FiscalYear") {
                                param.field = "H.FiscalYear";
                            }
                            if (param.field === "BranchName") {
                                param.field = "Br.Name";
                            }
                            if (param.field === "CurrencyRateFromBDT") {
                                param.field = "H.CurrencyRateFromBDT";
                            }
                           
                            
                            if (param.field === "BranchAddress") {
                                param.field = "Br.Address";
                            }
                            
                            if (param.field === "PeriodId") {
                                param.field = "H.PeriodId";
                            }
                            if (param.field === "PurchaseOrderId") {
                                param.field = "D.PurchaseOrderId";
                            }
                            if (param.field === "Line") {
                                param.field = "D.Line";
                            }
                            if (param.field === "ProductName") {
                                param.field = "P.Name";
                            }
                            if (param.field === "Quantity") {
                                param.field = "D.Quantity";
                            }
                            if (param.field === "UnitPrice") {
                                param.field = "D.UnitPrice";
                            }
                            if (param.field === "SubTotal") {
                                param.field = "D.SubTotal";
                            }
                            if (param.field === "SD") {
                                param.field = "D.SD";
                            }
                            if (param.field === "SDAmount") {
                                param.field = "D.SDAmount";
                            }
                            if (param.field === "VATRate") {
                                param.field = "D.VATRate";
                            }
                            if (param.field === "VATAmount") {
                                param.field = "D.VATAmount";
                            }
                            if (param.field === "OthersAmount") {
                                param.field = "D.OthersAmount";
                            }
                            if (param.field === "UOMName") {
                                param.field = "Us.Name";
                            }
                            if (param.field === "UOMConversion") {
                                param.field = "D.UOMConversion";
                            }
                            if (param.field === "VATType") {
                                param.field = "D.VATType";
                            }
                        });
                    }
                    return options;
                }
            },
            batch: true,
            schema: {
                data: "Items",
                total: "TotalCount",
                model: {
                    fields: {
                        id: { type: "number" },
                        code: { type: "string" },
                        branchName: { type: "string" },
                        customerName: { type: "string" },
                        salePersonName: { type: "string" },
                        routeName: { type: "string" },
                        deliveryAddress: { type: "string" },
                        invoiceDateTime: { type: "date" },
                        deliveryDate: { type: "date" },
                        GrandTotalAmount: { type: "number" },
                        GrandTotalSDAmount: { type: "number" },
                        GrandTotalVATAmount: { type: "number" },
                        comments: { type: "string" },
                        transactionType: { type: "string" },
                        isPost: { type: "boolean" },
                        postBy: { type: "string" },
                        posteOn: { type: "date" },
                        isCompleted: { type: "boolean" },
                        currencyName: { type: "string" },
                        currencyRateFromBDT: { type: "number" },
                        createdBy: { type: "string" },
                        createdOn: { type: "date" },
                        lastModifiedBy: { type: "string" },
                        lastModifiedOn: { type: "date" },
                        status: { type: "string" },
                        distributorCode: { type: "string" },
                        banglaName: { type: "string" },
                        isPosted: { type: "string" },
                        GrdTotalAmount: { type: "string" },
                        GrdTotalSDAmount: { type: "string" },
                        GrdTotalVATAmount: { type: "string" },
                        deliveryPersonName: { type: "string" },
                        driverPersonName: { type: "string" },
                        productName: { type: "string" },
                        productGroupName: { type: "string" },
                        quantity: { type: "number" },
                        unitRate: { type: "number" },
                        UnitPrice: { type: "number" },
                        subTotal: { type: "number" },
                        isInclusiveDuty: { type: "boolean" },
                        SD: { type: "number" },
                        SDAmount: { type: "number" },
                        VATRate: { type: "number" },
                        VATAmount: { type: "number" },
                        lineTotal: { type: "number" },
                        uomName: { type: "string" },
                        uomFromName: { type: "string" },
                        uomConversion: { type: "number" },
                        campaignTypeId: { type: "number" },
                        campaignDetailsId: { type: "number" },
                        campaignHeaderId: { type: "number" }
                    }
                }
            },
            aggregate: [
                
                { field: "Line", aggregate: "sum" },
                { field: "GrandTotalAmount", aggregate: "sum" },
                { field: "GrandTotalSDAmount", aggregate: "sum" },
                { field: "GrandTotalVATAmount", aggregate: "sum" },
                { field: "SDAmount", aggregate: "sum" },
                { field: "VATRate", aggregate: "sum" },
                { field: "SD", aggregate: "sum" },
                { field: "Quantity", aggregate: "sum" },
                { field: "VATAmount", aggregate: "sum" },
                { field: "OthersAmount", aggregate: "sum" },
                { field: "UnitPrice", aggregate: "sum" },
                { field: "CurrencyRateFromBDT", aggregate: "sum" },
                { field: "SubTotal", aggregate: "sum" }
                
            
            ]
        });

        // Initialize Kendo Grid
        $("#GridDetailsDataList").kendoGrid({
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
                        neq: "Is not equal to"
                    }
                }
            },
            sortable: true,
            resizable: true,
            reorderable: true,
            groupable: true,
            toolbar: ["excel", "pdf", "search"],
            search: ["Code", "SupplierName", "SupplierAddress", "Status", "Completed", "BENumber", "PurchaseDate", "InvoiceDateTime", "GrandTotalAmount", "GrandTotalSDAmount", "GrandTotalVATAmount", "Comments", "TransactionType", "CurrencyRateFromBDT", "ImportIDExcel", "FileName", "CustomHouse", "FiscalYear", "BranchName", "BranchAddress", "PurchaseOrderId", "Line", "ProductName", "Quantity", "UnitPrice", "SubTotal", "SD", "SDAmount", "VATRate", "VATAmount", "OthersAmount", "UOMName", "UOMConversion", "VATType","CurrencyName"],
            excel: {
                fileName: `Purchase_Details_${new Date().toISOString().split('T')[0]}.xlsx`,
                filterable: true
            },
            pdf: {
                fileName: `Purchase_Details_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`,
                allPages: true,
                avoidLink: true,
                filterable: true
            },
            pdfExport: function (e) {

                $(".k-grid-toolbar").hide();
                $(".k-grouping-header").hide();
                $(".k-floatwrap").hide();

                

                const dataItems = this.dataSource.view();
                const firstItem = dataItems.length > 0 ? dataItems[0] : {};

                branchName = firstItem.BranchName || "All Branch Name";

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


                var fileName = `Purchase_Details_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`;

                var numberOfColumns = e.sender.columns.filter(column => !column.hidden && column.field).length;
                var columnWidth = 100;
                var totalWidth = numberOfColumns * columnWidth;

                e.sender.options.pdf = {
                    paperSize: [totalWidth, 2800],
                    margin: { top: "4cm", left: "1cm", right: "1cm", bottom: "4cm" },
                    landscape: true,
                    allPages: true,
                    template: `
                            <div style="position: absolute; top: 1cm; left: 1cm; right: 1cm; text-align: center; font-size: 12px; font-weight: bold;">
                                <div>Branch Name :- ${branchName}</div>
                            </div> `
                };

                e.sender.options.pdf.fileName = fileName;

                setTimeout(function () {
                    window.location.reload();
                }, 1000);
            },
            columns: [
                { field: "Code", title: "Code", width: 180, sortable: true },
                { field: "BranchName", title: "Branch Name", width: 180, sortable: true },
                { field: "SupplierName", title: "Supplier Name", width: 180, sortable: true },
                { field: "SupplierAddress", title: "Supplier Address", width: 180, sortable: true },
                { field: "BENumber", title: "BE Number", width: 180, sortable: true },
                {
                    field: "InvoiceDateTime", title: "Invoice Date Time", sortable: true, width: 130, template: '#= kendo.toString(kendo.parseDate(InvoiceDateTime), "yyyy-MM-dd") #',
                    filterable: {
                        ui: "datepicker"
                    }
                },
                {
                    field: "PurchaseDate", title: " Purchase Date", sortable: true, width: 180, template: '#= kendo.toString(kendo.parseDate(PurchaseDate), "yyyy-MM-dd") #',
                    filterable: {
                        ui: "datepicker"
                    }
                },
                //{ field: "CustomerName", title: "Customer Name", width: 180, sortable: true },
                //{ field: "SalePersonName", title: "Sale Person Name", width: 180, sortable: true },
                //{ field: "RouteName", title: "Route Name", width: 180, sortable: true },
                //{ field: "DeliveryAddress", title: "Delivery Address", width: 200, sortable: true },
                //{ field: "InvoiceDateTime", title: "Invoice Date", width: 140, template: '#= kendo.toString(kendo.parseDate(InvoiceDateTime), "yyyy-MM-dd") #' },
                //{ field: "DeliveryDate", title: "Delivery Date", width: 140, template: '#= kendo.toString(kendo.parseDate(DeliveryDate), "yyyy-MM-dd") #' },
                {
                    field: "GrandTotalAmount",
                    title: "Grand Total Amount",
                    sortable: true,
                    width: 180,
                    aggregates: ["sum"],
                    format: "{0:n2}",
                    footerTemplate: "#=kendo.toString(sum, 'n2')#",
                    groupFooterTemplate: "#=kendo.toString(sum, 'n2')#",
                    attributes: { style: "text-align: right;" }
                }
                ,
                {
                    field: "GrandTotalSDAmount",
                    title: "Grand Total SD Amount",
                    sortable: true,
                    width: 200,
                    aggregates: ["sum"],
                    format: "{0:n2}",
                    footerTemplate: "#=kendo.toString(sum, 'n2')#",
                    groupFooterTemplate: "#=kendo.toString(sum, 'n2')#",
                    attributes: { style: "text-align: right;" }
                },
                {
                    field: "GrandTotalVATAmount",
                    title: "Grand Total VAT Amount",
                    sortable: true,
                    width: 200,
                    aggregates: ["sum"],
                    format: "{0:n2}",
                    footerTemplate: "#=kendo.toString(sum, 'n2')#",
                    groupFooterTemplate: "#=kendo.toString(sum, 'n2')#",
                    attributes: { style: "text-align: right;" }
                },
                { field: "Comments", title: "Comments", width: 200, sortable: true },
                { field: "TransactionType", title: "Transaction Type", width: 150, sortable: true },
                {
                    field: "Status", title: "Status", sortable: true, width: 100,
                    filterable: {
                        ui: function (element) {
                            element.kendoDropDownList({
                                dataSource: [
                                    { text: "Posted", value: "1" },
                                    { text: "Not-posted", value: "0" }
                                ],
                                dataTextField: "text",
                                dataValueField: "value",
                                optionLabel: "Select Option"
                            });
                        }
                    }
                },
                {
                    field: "Completed", title: "Completed", sortable: true, width: 130,
                    filterable: {
                        ui: function (element) {
                            element.kendoDropDownList({
                                dataSource: [
                                    { text: "Completed", value: "1" },
                                    { text: "Not-Completed", value: "0" }
                                ],
                                dataTextField: "text",
                                dataValueField: "value",
                                optionLabel: "Select Option"
                            });
                        }
                    }
                },
                { field: "CurrencyName", title: "Currency Name", width: 200, sortable: true },
                {
                    field: "CurrencyRateFromBDT",
                    title: "Currency Rate From BDT",
                    sortable: true,
                    width: 200,
                    aggregates: ["sum"],
                    format: "{0:n2}",
                    footerTemplate: "#=kendo.toString(sum, 'n2')#",
                    groupFooterTemplate: "#=kendo.toString(sum, 'n2')#",
                    attributes: { style: "text-align: right;" }
                },
                { field: "ImportIDExcel", title: "Import ID Excel", width: 200, sortable: true },
                { field: "FileName", title: "File Name", width: 200, sortable: true },
                { field: "CustomHouse", title: "Custom House", width: 200, sortable: true },
                { field: "FiscalYear", title: "FiscalYear", width: 200, sortable: true },
                { field: "PeriodId", title: "Period Id", width: 200, sortable: true },
                { field: "PurchaseOrderId", title: "Purchase Order Id", width: 200, sortable: true },
                {
                    field: "Line",
                    title: "Line",
                    sortable: true,
                    width: 200,
                    aggregates: ["sum"],
                    format: "{0:n2}",
                    footerTemplate: "#=kendo.toString(sum, 'n2')#",
                    groupFooterTemplate: "#=kendo.toString(sum, 'n2')#",
                    attributes: { style: "text-align: right;" }
                },

                /*{ field: "IsCompleted", title: "Is Completed", width: 100, template: '#= IsCompleted ? "Yes" : "No" #' },*/
                { field: "ProductName", title: "Product Name", width: 200, sortable: true },
                {
                    field: "Quantity",
                    title: "Quantity",
                    sortable: true,
                    width: 200,
                    aggregates: ["sum"],
                    format: "{0:n2}",
                    footerTemplate: "#=kendo.toString(sum, 'n2')#",
                    groupFooterTemplate: "#=kendo.toString(sum, 'n2')#",
                    attributes: { style: "text-align: right;" }
                },
                {
                    field: "UnitPrice",
                    title: "Unit Price",
                    sortable: true,
                    width: 200,
                    aggregates: ["sum"],
                    format: "{0:n2}",
                    footerTemplate: "#=kendo.toString(sum, 'n2')#",
                    groupFooterTemplate: "#=kendo.toString(sum, 'n2')#",
                    attributes: { style: "text-align: right;" }
                },
                {
                    field: "SubTotal",
                    title: "Sub Total",
                    sortable: true,
                    width: 200,
                    aggregates: ["sum"],
                    format: "{0:n2}",
                    footerTemplate: "#=kendo.toString(sum, 'n2')#",
                    groupFooterTemplate: "#=kendo.toString(sum, 'n2')#",
                    attributes: { style: "text-align: right;" }
                },
               

                {
                    field: "SD",
                    title: "SD",
                    sortable: true,
                    width: 200,
                    aggregates: ["sum"],
                    format: "{0:n2}",
                    footerTemplate: "#=kendo.toString(sum, 'n2')#",
                    groupFooterTemplate: "#=kendo.toString(sum, 'n2')#",
                    attributes: { style: "text-align: right;" }
                },
                {
                    field: "SDAmount",
                    title: "SD Amount",
                    sortable: true,
                    width: 200,
                    aggregates: ["sum"],
                    format: "{0:n2}",
                    footerTemplate: "#=kendo.toString(sum, 'n2')#",
                    groupFooterTemplate: "#=kendo.toString(sum, 'n2')#",
                    attributes: { style: "text-align: right;" }
                },
                {
                    field: "VATRate",
                    title: "VAT Rate",
                    sortable: true,
                    width: 200,
                    aggregates: ["sum"],
                    format: "{0:n2}",
                    footerTemplate: "#=kendo.toString(sum, 'n2')#",
                    groupFooterTemplate: "#=kendo.toString(sum, 'n2')#",
                    attributes: { style: "text-align: right;" }
                },
                {
                    field: "VATAmount",
                    title: "VAT Amount",
                    sortable: true,
                    width: 200,
                    aggregates: ["sum"],
                    format: "{0:n2}",
                    footerTemplate: "#=kendo.toString(sum, 'n2')#",
                    groupFooterTemplate: "#=kendo.toString(sum, 'n2')#",
                    attributes: { style: "text-align: right;" }
                },
                {
                    field: "OthersAmount",
                    title: "Others Amount",
                    sortable: true,
                    width: 200,
                    aggregates: ["sum"],
                    format: "{0:n2}",
                    footerTemplate: "#=kendo.toString(sum, 'n2')#",
                    groupFooterTemplate: "#=kendo.toString(sum, 'n2')#",
                    attributes: { style: "text-align: right;" }
                },
                { field: "UOMName", title: "UOM Name", width: 200, sortable: true },
                { field: "UOMConversion", title: "UOM Conversion", width: 200, sortable: true }, { field: "VATType", title: "VAT Type", width: 200, sortable: true }
                
            ],
            editable: false,
            selectable: "multiple row",
            navigatable: true,
            columnMenu: true
        });

        $("#GridDetailsDataList").on("click", ".k-header .k-checkbox", function () {
            var isChecked = $(this).is(":checked");
            var grid = $("#GridDetailsDataList").data("kendoGrid");
            if (isChecked) {
                grid.tbody.find(".k-checkbox").prop("checked", true);
            } else {
                grid.tbody.find(".k-checkbox").prop("checked", false);
            }
        });
    };


    return {
        init: init
    }


}(CommonService, CommonAjaxService);




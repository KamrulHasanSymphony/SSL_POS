var SaleOrderDetailsIndexController = function (CommonService, CommonAjaxService) {


    var init = function () {
          
       
        var getOperation = $("#Operation").val() || '';

      
        GetBranchList();
        GenerateDatePicker();
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

    function GenerateDatePicker() {
        $("#FromDate").kendoDatePicker({
            format: "yyyy-MM-dd"
        });
        $("#ToDate").kendoDatePicker({
            format: "yyyy-MM-dd"
        });
    }

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
                    //url: "/SaleOrder/GetDetailsGridData",
                    url: "/DMS/SaleOrder/GetDetailsGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false,
                    data: { branchId: branchId, fromDate: FromDate, toDate: ToDate }
                },
                parameterMap: function (options) {
                    if (options.sort) {
                        options.sort.forEach(function (param) {
                            if (param.field === "Code") {
                                param.field = "H.Code";
                            }
                            if (param.field === "CustomerName") {
                                param.field = "C.Name";
                            }
                            if (param.field === "ProductName") {
                                param.field = "PD.Name";
                            }
                            if (param.field === "UOMName") {
                                param.field = "U.Name";
                            }
                            if (param.field === "CampaignName") {
                                param.field = "CP.Name";
                            }
                            if (param.field === "FreeProductName") {
                                param.field = "PD.Name";
                            }
                            if (param.field === "FreeQuantity") {
                                param.field = "D.FreeQuantity";
                            }
                            if (param.field === "DiscountRate") {
                                param.field = "D.DiscountRate";
                            }
                            if (param.field === "DiscountAmount") {
                                param.field = "D.DiscountAmount";
                            }
                            if (param.field === "DeliveryAddress") {
                                param.field = "H.DeliveryAddress";
                            }
                            if (param.field === "InvoiceDateTime" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "CONVERT(VARCHAR(10), H.InvoiceDateTime, 120)";
                            }
                            if (param.field === "DeliveryDate" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "CONVERT(VARCHAR(10), H.DeliveryDate, 120)";
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
                            if (param.field === "TransactionType") {
                                param.field = "H.TransactionType";
                            }
                            if (param.field === "CurrencyRateFromBDT") {
                                param.field = "H.CurrencyRateFromBDT";
                            }
                            if (param.field === "CustomerName") {
                                param.field = "C.Name";
                            }
                            if (param.field === "SalePersonName") {
                                param.field = "SP.Name";
                            }
                            if (param.field === "RouteName") {
                                param.field = "R.Name";
                            }
                            if (param.field === "CurrencyName") {
                                param.field = "CR.Name";
                            }
                            if (param.field === "BranchName") {
                                param.field = "BR.Name";
                            }
                            if (param.field === "IsCompleted") {
                                let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";

                                if (statusValue.startsWith("y")) {
                                    param.value = 1;
                                } else if (statusValue.startsWith("n")) {
                                    param.value = 0;
                                } else {
                                    param.value = null;
                                }

                                param.field = "H.IsCompleted";
                                param.operator = "eq";
                            }
                            if (param.field === "Quantity") {
                                param.field = "D.Quantity";
                            }
                            if (param.field === "UnitRate") {
                                param.field = "D.UnitRate";
                            }
                            if (param.field === "SubTotal") {
                                param.field = "D.SubTotal";
                            }
                            if (param.field === "IsInclusiveDuty") {
                                param.field = "D.IsInclusiveDuty";
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
                            if (param.field === "LineTotal") {
                                param.field = "D.LineTotal";
                            }
                            if (param.field === "Comments") {
                                param.field = "H.Comments";
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
                            if (param.field === "CustomerName") {
                                param.field = "C.Name";
                            }
                            if (param.field === "ProductName") {
                                param.field = "PD.Name";
                            }
                            if (param.field === "UOMName") {
                                param.field = "U.Name";
                            }
                            if (param.field === "CampaignName") {
                                param.field = "CP.Name";
                            }
                            if (param.field === "FreeProductName") {
                                param.field = "PD.Name";
                            }
                            if (param.field === "FreeQuantity") {
                                param.field = "D.FreeQuantity";
                            }
                            if (param.field === "DiscountRate") {
                                param.field = "D.DiscountRate";
                            }
                            if (param.field === "DiscountAmount") {
                                param.field = "D.DiscountAmount";
                            }
                            if (param.field === "DeliveryAddress") {
                                param.field = "H.DeliveryAddress";
                            }
                            if (param.field === "InvoiceDateTime" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "CONVERT(VARCHAR(10), H.InvoiceDateTime, 120)";
                            }
                            if (param.field === "DeliveryDate" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "CONVERT(VARCHAR(10), H.DeliveryDate, 120)";
                            }
                            if (param.field === "GrandTotalAmount") {
                                //param.field = "H.GrandTotalAmount";
                                param.field = "CONVERT(VARCHAR, H.GrandTotalAmount)";
                            }
                            if (param.field === "GrandTotalSDAmount") {
                                param.field = "H.GrandTotalSDAmount";
                            }
                            if (param.field === "GrandTotalVATAmount") {
                                param.field = "H.GrandTotalVATAmount";
                            }
                            if (param.field === "TransactionType") {
                                param.field = "H.TransactionType";
                            }
                            if (param.field === "CurrencyRateFromBDT") {
                                param.field = "H.CurrencyRateFromBDT";
                            }
                            if (param.field === "CustomerName") {
                                param.field = "C.Name";
                            }
                            if (param.field === "SalePersonName") {
                                param.field = "SP.Name";
                            }
                            if (param.field === "RouteName") {
                                param.field = "R.Name";
                            }
                            if (param.field === "CurrencyName") {
                                param.field = "CR.Name";
                            }
                            if (param.field === "BranchName") {
                                param.field = "BR.Name";
                            }
                            if (param.field === "IsCompleted") {
                                let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";

                                if (statusValue.startsWith("y")) {
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
                            if (param.field === "Quantity") {
                                param.field = "D.Quantity";
                            }
                            if (param.field === "UnitRate") {
                                param.field = "D.UnitRate";
                            }
                            if (param.field === "SubTotal") {
                                param.field = "D.SubTotal";
                            }
                            if (param.field === "IsInclusiveDuty") {
                                param.field = "D.IsInclusiveDuty";
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
                            if (param.field === "LineTotal") {
                                param.field = "D.LineTotal";
                            }
                            if (param.field === "Comments") {
                                param.field = "H.Comments";
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
                        grandTotalAmount: { type: "number" },
                        grandTotalSDAmount: { type: "number" },
                        grandTotalVATAmount: { type: "number" },
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
                        grdTotalAmount: { type: "string" },
                        grdTotalSDAmount: { type: "string" },
                        grdTotalVATAmount: { type: "string" },
                        deliveryPersonName: { type: "string" },
                        driverPersonName: { type: "string" },
                        productName: { type: "string" },
                        productGroupName: { type: "string" },
                        quantity: { type: "number" },
                        unitRate: { type: "number" },
                        subTotal: { type: "number" },
                        isInclusiveDuty: { type: "boolean" },
                        sd: { type: "number" },
                        sdAmount: { type: "number" },
                        vatRate: { type: "number" },
                        vatAmount: { type: "number" },
                        lineTotal: { type: "number" },
                        uomName: { type: "string" },
                        uomFromName: { type: "string" },
                        uomConversion: { type: "number" },
                        campaignTypeId: { type: "number" },
                        campaignDetailsId: { type: "number" },
                        campaignHeaderId: { type: "number" },
                        productName: { type: "string" },
                        campaignName: { type: "string" },
                        freeProductName: { type: "string" },
                        freeQuantity: { type: "number" },
                        discountRate: { type: "number" },
                        discountAmount: { type: "number" },
                    }
                }
            },
            aggregate: [ 
                { field: "Quantity", aggregate: "sum" },
                { field: "LineTotal", aggregate: "sum" },
                { field: "GrandTotalAmount", aggregate: "sum" },
                { field: "GrandTotalSDAmount", aggregate: "sum" },
                { field: "GrandTotalVATAmount", aggregate: "sum" },
                { field: "SDAmount", aggregate: "sum" },
                { field: "VATRate", aggregate: "sum" },
                { field: "SD", aggregate: "sum" },
                { field: "UnitRate", aggregate: "sum" },
                { field: "VATAmount", aggregate: "sum" },
                { field: "FreeQuantity", aggregate: "sum" },
                { field: "DiscountRate", aggregate: "sum" },
                { field: "DiscountAmount", aggregate: "sum" },
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
            search: ["Code", "BranchName", "CustomerName", "ProductName", "UOMName", "CampaignName", "FreeProductName", "FreeQuantity", "DiscountRate", "DiscountAmount", "SalePersonName", "RouteName", "DeliveryAddress", "InvoiceDateTime", "DeliveryDate", "GrandTotalAmount", "GrandTotalSDAmount", "GrandTotalVATAmount", "Comments", "TransactionType", "IsCompleted", "Quantity", "UnitRate", "SubTotal", "SD", "SDAmount", "VATRate", "VATAmount", "LineTotal", "UOMName", "CurrencyName"],
            excel: {
                fileName: `SaleOrder_Details_${new Date().toISOString().split('T')[0]}.xlsx`,
                filterable: true
            },
            pdf: {
                fileName: `SaleOrder_Details_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`,
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


                var fileName = `SaleOrder_Details_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`;

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
                { field: "Code", title: "Code", width: 190, sortable: true },
                { field: "BranchName", title: "Branch Name", width: 180, hidden: true, sortable: true },
                {
                    field: "OrderDate", title: "Order Date", sortable: true, width: 150, template: '#= kendo.toString(kendo.parseDate(OrderDate), "yyyy-MM-dd") #',
                    filterable:
                    {
                        ui: "datepicker"
                    }
                },
                { field: "CustomerName", title: "Customer Name", width: 180, sortable: true },
                { field: "ProductName", title: "Product Name", width: 180, sortable: true },
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
    
   
                { field: "UnitRate", title: "Unit Rate", width: 140, format: "{0:n2}" },
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
                    field: "LineTotal",
                    title: "Line Total",
                    sortable: true,
                    width: 200,
                    aggregates: ["sum"],
                    format: "{0:n2}",
                    footerTemplate: "#=kendo.toString(sum, 'n2')#",
                    groupFooterTemplate: "#=kendo.toString(sum, 'n2')#",
                    attributes: { style: "text-align: right;" }
                },
                { field: "DeliveryAddress", title: "Delivery Address", width: 200, sortable: true },
                {
                    field: "DeliveryDate", title: "Delivery Date", sortable: true, width: 150, template: '#= kendo.toString(kendo.parseDate(DeliveryDate), "yyyy-MM-dd") #',
                    filterable:
                    {
                        ui: "datepicker"
                    }
                },
                { field: "Comments", title: "Comments", width: 200, hidden: true, sortable: true },
                { field: "TransactionType", title: "Transaction Type", width: 150, hidden: true, sortable: true }
                //{
                //    field: "IsCompleted", title: "Is Completed", width: 100, template: '#= IsCompleted ? "Yes" : "No" #',
                //    filterable: {
                //        ui: function (element) {
                //            element.kendoDropDownList({
                //                dataSource: [
                //                    { text: "Y", value: "1" },
                //                    { text: "N", value: "0" }
                //                ],
                //                dataTextField: "text",
                //                dataValueField: "value",
                //                optionLabel: "Select Option"
                //            });
                //        }
                //    }
                //}

                
            ],
            editable: false,
            selectable: "row",
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




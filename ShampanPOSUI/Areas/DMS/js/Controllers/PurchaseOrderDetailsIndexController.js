var PurchaseOrderDetailsIndexController = function (CommonService, CommonAjaxService) {


    var init = function () {
          
        //if ($("#IsPosted").length) {
        //    LoadCombo("IsPosted", '/Common/Common/GetBooleanDropDown');
        //    $("#IsPosted").val('');
        //    GetBranchList();
        //};


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
                    //url: "/PurchaseOrder/GetDetailsGridData",
                    url: "/DMS/PurchaseOrder/GetDetailsGridData",

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
                            if (param.field === "PurchaseOrderCode") {
                                param.field = "H.Code";
                            }
                            if (param.field === "SupplierCode") {
                                param.field = "s.Code";
                            }
                            if (param.field === "ProductCode") {
                                param.field = "P.Code";
                            }
                            if (param.field === "VATRate") {
                                param.field = "D.VATRate";
                            }
                            if (param.field === "SupplierName") {
                                param.field = "s.Name";
                            }
                            if (param.field === "SupplierAddress") {
                                param.field = "s.Address";
                            }
                            if (param.field === "UnitPrice") {
                                param.field = "D.UnitPrice";
                            }
                            if (param.field === "SubTotal") {
                                param.field = "D.SubTotal";
                            }

                            if (param.field === "BENumber") {
                                param.field = "H.BENumber";
                            }
                            if (param.field === "OrderDate" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "H.OrderDate";
                            }
                            if (param.field === "DeliveryDateTime" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "H.DeliveryDateTime";
                            }

                            if (param.field === "Comments") {
                                param.field = "H.Comments";
                            }
                            if (param.field === "TransactionType") {
                                param.field = "H.TransactionType";
                            }
                            if (param.field === "ProductName") {
                                param.field = "P.Name";
                            }
                     
                            if (param.field === "BranchName") {
                                param.field = "br.Name";
                            }
                            if (param.field === "BranchAddress") {
                                param.field = "br.Address";
                            }
                        });
                    }

                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (param) {
                            if (param.field === "Id") {
                                param.field = "H.Id";
                            }
                            if (param.field === "PurchaseOrderCode") {
                                param.field = "H.Code";
                            }
                            if (param.field === "SupplierCode") {
                                param.field = "s.Code";
                            }
                            if (param.field === "ProductCode") {
                                param.field = "P.Code";
                            }
                            if (param.field === "VATRate") {
                                param.field = "D.VATRate";
                            }
                            if (param.field === "SupplierName") {
                                param.field = "s.Name";
                            }
                            if (param.field === "SupplierAddress") {
                                param.field = "s.Address";
                            }
                            if (param.field === "UnitPrice") {
                                param.field = "D.UnitPrice";
                            }
                            if (param.field === "SubTotal") {
                                param.field = "D.SubTotal";
                            }

                            if (param.field === "BENumber") {
                                param.field = "H.BENumber";
                            }
                            if (param.field === "OrderDate" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "H.OrderDate";
                            }
                            if (param.field === "DeliveryDateTime" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "H.DeliveryDateTime";
                            }

                            if (param.field === "Comments") {
                                param.field = "H.Comments";
                            }
                            if (param.field === "TransactionType") {
                                param.field = "H.TransactionType";
                            }
                            if (param.field === "ProductName") {
                                param.field = "P.Name";
                            }
                            if (param.field === "BranchName") {
                                param.field = "br.Name";
                            }
                            if (param.field === "BranchAddress") {
                                param.field = "br.Address";
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
                        Code: { type: "string" },
                        PurchaseOrderCode: { type: "string" },
                        DeliveryAddress: { type: "string" },
                        OrderDate: { type: "date" },
                        DeliveryDateTime: { type: "date" },
                        SupplierName: { type: "string" },
                        ProductName: { type: "string" },
                        Quantity: { type: "number" },
                        SubTotal: { type: "number" },
                        SD: { type: "number" },
                        SDAmount: { type: "number" },
                        VATRate: { type: "number" },
                        VATAmount: { type: "number" },
                        OthersAmount: { type: "number" }
                    }
                }
            },
            aggregate: [
                { field: "Quantity", aggregate: "sum" },
                { field: "SDAmount", aggregate: "sum" },
                { field: "VATRate", aggregate: "sum" },
                { field: "SD", aggregate: "sum" },
                { field: "UnitPrice", aggregate: "sum" },
                { field: "VATAmount", aggregate: "sum" },
                { field: "SubTotal", aggregate: "sum" },
                { field: "OthersAmount", aggregate: "sum" }

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
            search: [
                "PurchaseOrderCode",
                "SupplierCode",
                "SupplierName",
                "ProductCode",
                "ProductName",
                "OrderDate",
                "DeliveryDateTime",
                "Comments",
                "TransactionType",
                "Quantity",
                "SubTotal",
                "SDAmount",
                "VATAmount",
                "OthersAmount"
            ],
            excel: {
                fileName: `PurchaseOrder_Details_${new Date().toISOString().split('T')[0]}.xlsx`,
                filterable: true
            },
    
            pdf: {
                fileName: `PurchaseOrder_Details_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`,
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


                var fileName = `PurchaseOrder_Details_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`;

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
                { field: "PurchaseOrderCode", title: "Purchase Order Code", width: 180, sortable: true },
                { field: "BranchName", title: "Branch Name", hidden: true, width: 180, sortable: true },
                { field: "SupplierCode", title: "Supplier Code", width: 180, sortable: true },
                { field: "SupplierName", title: "Supplier Name", width: 180, sortable: true },
                {
                    field: "OrderDate", title: "Order Date", sortable: true, width: 130, template: '#= kendo.toString(kendo.parseDate(OrderDate), "yyyy-MM-dd") #',
                    filterable: {
                        ui: "datepicker"
                    }
                },
                {
                    field: "DeliveryDateTime", title: " Expected Delivery Date", sortable: true, width: 180, template: '#= kendo.toString(kendo.parseDate(DeliveryDateTime), "yyyy-MM-dd") #',
                    filterable: {
                        ui: "datepicker"
                    }
                },
                

                { field: "Comments", title: "Comments", width: 200, hidden: true, sortable: true },
                { field: "TransactionType", title: "Transaction Type", hidden: true, width: 150, sortable: true },
                { field: "ProductCode", title: "Product Code", width: 180, sortable: true },
                { field: "ProductName", title: "Product Name", width: 200, sortable: true, footerTemplate: "Total:", groupFooterTemplate: "Group Total:"},
                { field: "PeriodId", title: "Period Id", width: 200, hidden: true, sortable: true },
              
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

                { field: "UnitPrice", title: "Unit Price", width: 140, format: "{0:n2}" },
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
                    title: "OthersAmount",
                    sortable: true,
                    width: 200,
                    aggregates: ["sum"],
                    format: "{0:n2}",
                    footerTemplate: "#=kendo.toString(sum, 'n2')#",
                    groupFooterTemplate: "#=kendo.toString(sum, 'n2')#",
                    attributes: { style: "text-align: right;" }
                }

                
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




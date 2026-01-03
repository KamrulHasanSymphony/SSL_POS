var ToPurchaseOrderController = function () {

    var init = function () {

        GetGridDataList();

        $('#btnSelect').on('click', function (e) {

            SelectData();
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

        var form = $('<form>').attr('method', 'post').attr('action', '/DMS/Purchase/GetFromPurchaseOrder');

        $.each(model, function (key, value) {
            if ($.isArray(value)) {
                $.each(value, function (index, element) {
                    var input = $('<input>').attr('type', 'hidden').attr('name', key).val(element);
                    form.append(input);
                });
            } else {
                var input = $('<input>').attr('type', 'hidden').attr('name', key).val(value);
                form.append(input);
            }
        });

        $('body').append(form);
        form.submit();
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
                    url: "/DMS/PurchaseOrder/FromPurchaseOrderGridData",
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
                            if (param.field === "SupplierName") {
                                param.field = "s.Name";
                            }
                            if (param.field === "CurrencyName") {
                                param.field = "c.Name";
                            }
                            if (param.field === "Comments") {
                                param.field = "H.Comments";
                            }
                            if (param.field === "IsPost") {
                                param.field = "H.IsPost";
                            }
                            if (param.field === "OrderDate") {
                                param.field = "H.OrderDate";
                            }
                            if (param.field === "DeliveryDateTime") {
                                param.field = "H.DeliveryDateTime";
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
                            if (param.field === "BranchName") {
                                param.field = "br.Name";
                            }
                            if (param.field === "TransactionType") {
                                param.field = "H.TransactionType";
                            }
                            if (param.field === "TotalQuantity") {
                                param.field = "SD.TotalQuantity";
                            }
                        });
                    }

                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (param) {
                            if (param.field === "Code") {
                                param.field = "H.Code";
                            }
                            if (param.field === "SupplierName") {
                                param.field = "s.Name";
                            }
                            if (param.field === "CurrencyName") {
                                param.field = "c.Name";
                            }
                            if (param.field === "Comments") {
                                param.field = "H.Comments";
                            }
                            if (param.field === "IsPost") {
                                param.field = "H.IsPost";
                            }
                            if (param.field === "OrderDate") {
                                param.field = "H.OrderDate";
                            }
                            if (param.field === "DeliveryDateTime") {
                                param.field = "H.DeliveryDateTime";
                            }
                            if (param.field === "BranchName") {
                                param.field = "br.Name";
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
                            if (param.field === "TotalQuantity") {
                                param.field = "SD.TotalQuantity";
                                options.filter.filters.forEach(function (res) {
                                    if (typeof res.value === 'string' && res.value.includes(',')) {
                                        res.value = parseFloat(res.value.replace(/,/g, '')) || 0;
                                    }
                                    else {
                                        res.value = parseFloat(res.value) || 0;
                                    }
                                });
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
            },
            model: {

                fields: {
                    OrderDate: { type: "date" },
                    DeliveryDateTime: { type: "date" },
                    TotalQuantity: { type: "number" },
                    GrandTotalAmount: { type: "number" },
                    GrandTotalSDAmount: { type: "number" },
                    GrandTotalVATAmount: { type: "number" }
                }
            }
            ,
            aggregate: [
                { field: "TotalQuantity", aggregate: "sum" },
                { field: "GrandTotalAmount", aggregate: "sum" },
                { field: "GrandTotalSDAmount", aggregate: "sum" },
                { field: "GrandTotalVATAmount", aggregate: "sum" }
            ]
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
            toolbar: ["excel", "pdf"],
            detailInit: function (e) {

                $("<div/>").appendTo(e.detailCell).kendoGrid({
                    dataSource: {
                        type: "json",
                        serverPaging: true,
                        serverSorting: true,
                        serverFiltering: true,
                        allowUnsort: true,
                        pageSize: 10,
                        transport: {
                            read: {
                                url: "/DMS/PurchaseOrder/GetPurchaseOrderDetailDataById",
                                type: "GET",
                                dataType: "json",
                                cache: false,
                                data: { masterId: e.data.Id }
                            },

                            parameterMap: function (options) {
                                return options;
                            }
                        },
                        batch: true,
                        schema: {
                            data: "Items",
                            total: "TotalCount"
                        },
                        aggregate: [
                            { field: "Quantity", aggregate: "sum" },
                            { field: "UnitPrice", aggregate: "sum" },
                            { field: "SubTotal", aggregate: "sum" },
                            { field: "SD", aggregate: "sum" },
                            { field: "SDAmount", aggregate: "sum" },
                            { field: "VATRate", aggregate: "sum" },
                            { field: "VATAmount", aggregate: "sum" },
                            { field: "OthersAmount", aggregate: "sum" },
                            { field: "LineTotal", aggregate: "sum" },
                            { field: "FixedVATAmount", aggregate: "sum" }
                        ],
                        requestEnd: function (e) {
                            console.log("Response Data:", e.response); // Log server response
                        }
                    },
                    scrollable: false,
                    sortable: true,
                    pageable: false,
                    noRecords: true,
                    messages: {
                        noRecords: "No Record Found!"
                    },
                    columns: [
                        { field: "Id", hidden: true, width: 50 },
                        { field: "ProductName", title: "Product Name", sortable: true, width: 120 },
                        { field: "UOMName", title: "UOM Name", sortable: true, width: 100 },
                        { field: "UOMConversion", title: "UOM Conversion", sortable: true, width: 100, aggregates: ["sum"], format: "{0:n2}", attributes: { style: "text-align: right;" } },
                        { field: "Quantity", title: "Quantity", sortable: true, width: 100, aggregates: ["sum"], format: "{0:n2}", footerTemplate: "#= kendo.toString(sum, 'n2') #", attributes: { style: "text-align: right;" } },
                        { field: "UnitPrice", title: "Unit Price", sortable: true, width: 100, aggregates: ["sum"], format: "{0:n2}", footerTemplate: "#= kendo.toString(sum, 'n2') #", attributes: { style: "text-align: right;" } },
                        { field: "SubTotal", title: "Sub Total", sortable: true, width: 100, aggregates: ["sum"], format: "{0:n2}", footerTemplate: "#= kendo.toString(sum, 'n2') #", attributes: { style: "text-align: right;" } },
                        { field: "SD", title: "SD Rate", sortable: true, width: 100, footerTemplate: "#= kendo.toString(sum, 'n2') #", aggregates: ["sum"], format: "{0:n2}", attributes: { style: "text-align: right;" } },
                        { field: "SDAmount", title: "SD Amount", sortable: true, width: 100, footerTemplate: "#= kendo.toString(sum, 'n2') #", aggregates: ["sum"], format: "{0:n2}", attributes: { style: "text-align: right;" } },
                        { field: "VATRate", title: "VAT Rate", sortable: true, width: 100, footerTemplate: "#= kendo.toString(sum, 'n2') #", aggregates: ["sum"], format: "{0:n2}", attributes: { style: "text-align: right;" } },
                        { field: "VATAmount", title: "VAT Amount", sortable: true, width: 100, footerTemplate: "#= kendo.toString(sum, 'n2') #", aggregates: ["sum"], format: "{0:n2}", attributes: { style: "text-align: right;" } },
                        { field: "OthersAmount", title: "Others Amount", sortable: true, width: 100, footerTemplate: "#= kendo.toString(sum, 'n2') #", aggregates: ["sum"], format: "{0:n2}", attributes: { style: "text-align: right;" } },
                        { field: "LineTotal", title: "Line Total", sortable: true, width: 100, footerTemplate: "#= kendo.toString(sum, 'n2') #", aggregates: ["sum"], format: "{0:n2}", attributes: { style: "text-align: right;" } },
                        { field: "FixedVATAmount", title: "Fixed VAT Amnt", sortable: true, width: 100, footerTemplate: "#= kendo.toString(sum, 'n2') #", aggregates: ["sum"], format: "{0:n2}", attributes: { style: "text-align: right;" } },
                        { field: "IsFixedVAT", hidden: true, title: "Is Fixed Vat", sortable: true, width: 100 },
                        { field: "VatType", hidden: true, title: "Vat Type", sortable: true, width: 100 },
                        { field: "Comments", title: "Comments", sortable: true, width: 150 },
                    ],
                    footerTemplate: function (e) {
                        var aggregates = e.sender.dataSource.aggregates();
                        return `
                            <div style="font-weight: bold; text-align: right;">
                                Total:
                                <span>${kendo.toString(aggregates.Quantity.sum, 'n2')}</span>
                                <span>${kendo.toString(aggregates.UnitPrice.sum, 'n2')}</span>
                                <span>${kendo.toString(aggregates.SubTotal.sum, 'n2')}</span>
                                <span>${kendo.toString(aggregates.SD.sum, 'n2')}</span>
                                <span>${kendo.toString(aggregates.SDAmount.sum, 'n2')}</span>
                                <span>${kendo.toString(aggregates.VATRate.sum, 'n2')}</span>
                                <span>${kendo.toString(aggregates.VATAmount.sum, 'n2')}</span>
                                <span>${kendo.toString(aggregates.OthersAmount.sum, 'n2')}</span>
                                <span>${kendo.toString(aggregates.LineTotal.sum, 'n2')}</span>
                                <span>${kendo.toString(aggregates.FixedVATAmount.sum, 'n2')}</span>
                            </div>`;
                    }
                });
            },
            search: ["Code", "SupplierName", "CurrencyName", "OrderDate", "DeliveryDateTime", "BranchName", "GrandTotalAmount", "GrandTotalSDAmount", "GrandTotalVATAmount", "TransactionType", "FiscalYear"],
            excel: {
                fileName: "PurchaseOrder.xlsx",
                filterable: true
            },
            pdf: {
                fileName: `PurchaseOrder_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`,
                allPages: true,
                avoidLink: true,
                filterable: true
            },
            pdfExport: function (e) {
                $(".k-grid-toolbar").hide();
                $(".k-grouping-header").hide();
                $(".k-floatwrap").hide();
                
                var branchName = "All Branch Name";

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


                var fileName = `PurchaseOrder_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`;

                var numberOfColumns = e.sender.columns.filter(column => !column.hidden && column.field).length;
                var columnWidth = 100;
                var totalWidth = numberOfColumns * columnWidth;

                e.sender.options.pdf = {
                    //paperSize: [totalWidth, 2800],
                    paperSize: "A1",
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
                {
                    selectable: true, width: 40
                },
                { field: "Id", width: 50, hidden: true, sortable: true },
                { field: "Code", title: "Code", width: 180, sortable: true },
                { field: "SupplierName", title: "Supplier Name", width: 180, sortable: true },
                {
                    field: "OrderDate", title: "Order Date", sortable: true, width: 130, template: '#= kendo.toString(kendo.parseDate(OrderDate), "yyyy-MM-dd") #',
                    filterable: {
                        ui: "datepicker"
                    }
                },
                {
                    field: "DeliveryDateTime", title: "Delivery Date", sortable: true, width: 130, template: '#= kendo.toString(kendo.parseDate(DeliveryDateTime), "yyyy-MM-dd") #',
                    filterable: {
                        ui: "datepicker"
                    }
                },
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
                //{
                //    field: "TotalQuantity",
                //    title: "Total Quantity",
                //    sortable: true,
                //    width: 180,
                //    aggregates: ["sum"],
                //    format: "{0:n2}",
                //    footerTemplate: "#=kendo.toString(sum, 'n2')#",
                //    groupFooterTemplate: "#=kendo.toString(sum, 'n2')#",
                //    attributes: { style: "text-align: right;" }
                //}, 
                //{ field: "BENumber", title: "BE Number", sortable: true, width: 150 },
                //{ field: "CurrencyName", title: "Currency Name", sortable: true, width: 150 },
                //{ field: "FiscalYear", title: "Fiscal Year", sortable: true, width: 150 },
                { field: "Comments", title: "Comments", sortable: true, width: 200 },
                { field: "BranchName", title: "Branch Name", sortable: true, width: 200 },

            ],
            editable: false,
            selectable: "multiple row",
            navigatable: true,
            columnMenu: true
        });

    };

    return {
        init: init
    }


}();


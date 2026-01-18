var FromSaleController = function () {

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

        var form = $('<form>').attr('method', 'post').attr('action', '/DMS/SaleReturn/GetFromSale');

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
                    url: "/DMS/Sale/FromSaleGridData",
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
                            if (param.field === "CustomerName") {
                                param.field = "S.Name";
                            }

                            if (param.field === "BranchName") {
                                param.field = "Br.BranchName";
                            }
                            if (param.field === "Comments") {
                                param.field = "H.Comments";
                            }
                            if (param.field === "Status") {
                                param.field = "H.IsPost";
                            }

                            if (param.field === "InvoiceDateTime" || param.field === "H.InvoiceDateTime") {
                                param.value = kendo.toString(param.value, "yyyy-MM-dd");
                            }

                        });
                    }

                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (param) {
                            if (param.field === "Code") {
                                param.field = "H.Code";
                            }
                            if (param.field === "CustomerName") {
                                param.field = "S.Name";
                            }

                            if (param.field === "BranchName") {
                                param.field = "Br.BranchName";
                            }
                            if (param.field === "Comments") {
                                param.field = "H.Comments";
                            }
                            if (param.field === "Status") {
                                param.field = "H.IsPost";
                            }

                            if (param.field === "InvoiceDateTime" || param.field === "H.InvoiceDateTime") {
                                param.value = kendo.toString(param.value, "yyyy-MM-dd");
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
                    InvoiceDateTime: { type: "date" },
                    PurchaseDate: { type: "date" },
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
                debugger;
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
                                url: "/DMS/Sale/GetSaleDetailDataById",
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
                            { field: "UnitRate", aggregate: "sum" },   
                            { field: "SubTotal", aggregate: "sum" },
                            { field: "SD", aggregate: "sum" },
                            { field: "SDAmount", aggregate: "sum" },
                            { field: "VATRate", aggregate: "sum" },
                            { field: "VATAmount", aggregate: "sum" },
                            { field: "LineTotal", aggregate: "sum" }
                        ]
                    },

                    scrollable: false,
                    sortable: true,
                    pageable: false,
                    noRecords: true,
                    messages: {
                        noRecords: "No Record Found!"
                    },

                    columns: [
                        { field: "Id", hidden: true },

                        { field: "ProductName", title: "Product Name", width: 120 },

                        {
                            field: "Quantity",
                            title: "Quantity",
                            width: 100,
                            aggregates: ["sum"],
                            footerTemplate: "#= kendo.toString(sum, 'n2') #",
                            format: "{0:n2}",
                            attributes: { style: "text-align:right;" }
                        },
                        {
                            field: "UnitRate",
                            title: "Unit Price",
                            width: 100,
                            aggregates: ["sum"],
                            footerTemplate: "#= kendo.toString(sum, 'n2') #",
                            format: "{0:n2}",
                            attributes: { style: "text-align:right;" }
                        },
                        {
                            field: "SubTotal",
                            title: "Sub Total",
                            width: 100,
                            aggregates: ["sum"],
                            footerTemplate: "#= kendo.toString(sum, 'n2') #",
                            format: "{0:n2}",
                            attributes: { style: "text-align:right;" }
                        },
                        {
                            field: "SD",
                            title: "SD Rate",
                            width: 100,
                            aggregates: ["sum"],
                            footerTemplate: "#= kendo.toString(sum, 'n2') #",
                            format: "{0:n2}",
                            attributes: { style: "text-align:right;" }
                        },
                        {
                            field: "SDAmount",
                            title: "SD Amount",
                            width: 100,
                            aggregates: ["sum"],
                            footerTemplate: "#= kendo.toString(sum, 'n2') #",
                            format: "{0:n2}",
                            attributes: { style: "text-align:right;" }
                        },
                        {
                            field: "VATRate",
                            title: "VAT Rate",
                            width: 100,
                            aggregates: ["sum"],
                            footerTemplate: "#= kendo.toString(sum, 'n2') #",
                            format: "{0:n2}",
                            attributes: { style: "text-align:right;" }
                        },
                        {
                            field: "VATAmount",
                            title: "VAT Amount",
                            width: 100,
                            aggregates: ["sum"],
                            footerTemplate: "#= kendo.toString(sum, 'n2') #",
                            format: "{0:n2}",
                            attributes: { style: "text-align:right;" }
                        },
                        {
                            field: "LineTotal",
                            title: "Line Total",
                            width: 100,
                            aggregates: ["sum"],
                            footerTemplate: "#= kendo.toString(sum, 'n2') #",
                            format: "{0:n2}",
                            attributes: { style: "text-align:right;" }
                        }
                    ]
                });
            },

            excel: {
                fileName: "PurchaseList.xlsx",
                filterable: true
            },
            pdf: {
                fileName: `PurchaseList_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`,
                allPages: true,
                avoidLink: true,
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


                var fileName = `PurchaseList_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`;

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
                    selectable: true, width: 40
                },
                { field: "Id", width: 50, hidden: true, sortable: true },
                { field: "Code", title: "Code", width: 180, sortable: true },
                { field: "CustomerName", title: "Customer Name", sortable: true, width: 180 },
                {
                    field: "InvoiceDateTime", title: "Invoice Date", sortable: true, width: 135, template: '#= kendo.toString(kendo.parseDate(InvoiceDateTime), "yyyy-MM-dd") #',
                    filterable:
                    {
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
                }
                ,
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


                { field: "Comments", title: "Comments", sortable: true, width: 200 },
                { field: "BranchName", title: "Branch Name", sortable: true, hidden: true, width: 200 },

            ],
            editable: false,
            selectable: "multiple, row",
      /*      persistSelection: true, */
            navigatable: true,
            columnMenu: true
        });

    };


    return {
        init: init
    }


}();


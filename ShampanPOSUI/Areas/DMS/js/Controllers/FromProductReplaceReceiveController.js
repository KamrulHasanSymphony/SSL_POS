var FromProductReplaceReceiveController = function () {

    var init = function () {
        
        GetGridDataList();

        $('#btnSelect').on('click', function (e) {
            SelectData();
        });

    };

    function SelectData() {
        
        var ids = [];
        var code = null;
        var grid = $("#GridDataList").data("kendoGrid");
        var selectedRows = grid.select();

        if (selectedRows.length === 0) {
            ShowNotification(3, "You are requested to Select a row!");
            return;
        }

        selectedRows.each(function () {
            ;
            var dataItem = grid.dataItem(this);
            ids.push(dataItem.Id);
            code = dataItem.Code;
        });

        if (ids.length > 1) {
            ShowNotification(2, "Select Only One Item!");
            return;
        }

        var model = { IDs: ids };

        model.Value = code;

        var data = grid.dataSource.view();

        var filteredData = data.filter(x => ids.includes(x.Id)); 

        var distinctNo = [...new Set(filteredData.map(x => x.Id))];

        if (distinctNo.length > 1) {
            ShowNotification(2, "Select Only One Item!");
            return;
        }

        var form = $('<form>').attr('method', 'post').attr('action', '/DMS/ProductReplaceIssue/GetFromProductReplaceReceive');

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
    }

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
                    url: "/DMS/ProductReplaceIssue/FromProductReplaceReceiveGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false
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
                            if (param.field === "CustomerName") {
                                param.field = "cus.Name";
                            }
                            if (param.field === "SalePersonName") {
                                param.field = "SP.Name";
                            }
                            if (param.field === "DeliveryPersonName") {
                                param.field = "DP.Name";
                            }
                            if (param.field === "DriverPersonName") {
                                param.field = "ET.Name";
                            }
                            if (param.field === "RouteName") {
                                param.field = "rut.Name";
                            }
                            if (param.field === "VehicleNo") {
                                param.field = "H.VehicleNo";
                            }
                            if (param.field === "VehicleType") {
                                param.field = "H.VehicleType";
                            }
                            if (param.field === "DeliveryAddress") {
                                param.field = "H.DeliveryAddress";
                            }
                            if (param.field === "BranchName") {
                                param.field = "Br.Name";
                            }
                            if (param.field === "Comments") {
                                param.field = "H.Comments";
                            }
                            if (param.field === "Status") {
                                param.field = "H.IsPost";
                            }
                            if (param.field === "CurrencyName") {
                                param.field = "con.Name";
                            }
                            if (filter.field === "InvoiceDateTime") {
                                param.field = "H.InvoiceDateTime";
                            }
                            if (filter.field === "DeliveryDate") {
                                param.field = "H.DeliveryDate";
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
                                param.field = "cus.Name";
                            }
                            if (param.field === "SalePersonName") {
                                param.field = "SP.Name";
                            }
                            if (param.field === "DeliveryPersonName") {
                                param.field = "DP.Name";
                            }
                            if (param.field === "DriverPersonName") {
                                param.field = "ET.Name";
                            }
                            if (param.field === "RouteName") {
                                param.field = "rut.Name";
                            }
                            if (param.field === "VehicleNo") {
                                param.field = "H.VehicleNo";
                            }
                            if (param.field === "VehicleType") {
                                param.field = "H.VehicleType";
                            }
                            if (param.field === "DeliveryAddress") {
                                param.field = "H.DeliveryAddress";
                            }
                            if (param.field === "BranchName") {
                                param.field = "Br.Name";
                            }
                            if (param.field === "Comments") {
                                param.field = "H.Comments";
                            }
                            if (param.field === "Status") {
                                param.field = "H.IsPost";
                            }
                            if (param.field === "InvoiceDateTime") {
                                param.field = "H.InvoiceDateTime";
                            }
                            if (param.field === "DeliveryDate") {
                                param.field = "H.DeliveryDate";
                            }
                            if (param.field === "CurrencyName") {
                                param.field = "con.Name";
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
                    DeliveryDate: { type: "date" },
                    GrandTotalAmount: { type: "number" },
                    GrandTotalSDAmount: { type: "number" },
                    GrandTotalVATAmount: { type: "number" }
                }
            }
            ,
            aggregate: [
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
            toolbar: ["excel", "pdf", "search"],
            search: ["GrandTotalSDAmount", "GrandTotalAmount", "CurrencyName", "DeliveryDate", "InvoiceDateTime", "Comments", "GrandTotalVATAmount", "BranchName", "VehicleType", "VehicleNo", "RouteName", "DriverPersonName", "SalePersonName", "CustomerName", "Code"],
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
                                url: "/DMS/ProductReplaceReceive/GetProductReplaceReceiveDetailDataById",
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
                        { field: "UOM", title: "UOM Name", sortable: true, width: 100 },
                        { field: "Quantity", title: "Quantity", sortable: true, width: 150 }
                    ]
                });
            },

            excel: {
                fileName: "SaleDeliveryList.xlsx",
                filterable: true
            },
            pdf: {
                fileName: `SaleDeliveryList_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`,
                allPages: true,
                avoidLink: true,
                filterable: true
            },
            pdfExport: function (e) {
                $(".k-grid-toolbar").hide();
                $(".k-grouping-header").hide();
                $(".k-floatwrap").hide();

                var branchName = "All Branch Name";
                //var companyName = "All Company Name";
                //var companyAddress = "All Company Address";

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
                    paperSize: "A2",
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
                    title: "", width: 50,
                    template: "<input type='radio' name='radioSelection' class='k-radio' />"
                },                 
                { field: "Id", width: 50, hidden: true, sortable: true },
                { field: "Code", title: "Code", width: 180, sortable: true },
                { field: "CustomerName", title: "Customer Name", sortable: true, width: 200 },
                {
                    field: "ReceiveDate", title: "Receive Date", sortable: true, width: 150, template: '#= kendo.toString(kendo.parseDate(ReceiveDate), "yyyy-MM-dd") #',
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
                
            ],
            editable: false,
            selectable: "row",
            navigatable: true,
            columnMenu: true
        });
        $("#GridDataList").on("click", "input.k-radio", function () {
            var grid = $("#GridDataList").data("kendoGrid");
            var row = $(this).closest("tr");
            grid.clearSelection();
            
            grid.select(row);
        });

    };

    return {
        init: init
    }


}();


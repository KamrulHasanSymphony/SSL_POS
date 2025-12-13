var CustomerPaymentTab = function (CommonService, CommonAjaxService) {
    
    var init = function () {        
        
            GetGridDataList();     
        
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
                    url: "/DMS/CustomerPaymentCollection/GetTabGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false
                },
                parameterMap: function (options) {

                    if (options.sort) {
                        options.sort.forEach(function (param) {
                            if (param.field === "Id") {
                                param.field = "S.Id";
                            }
                            if (param.field === "CustomerName") {
                                param.field = "c.Name";
                            }
                            if (param.field === "Code") {
                                param.field = "s.Code";
                            }
                            if (param.field === "RouteName") {
                                param.field = "R.Name";
                            }
                            if (param.field === "DeliveryAddress") {
                                param.field = "S.DeliveryAddress";
                            }
                            if (param.field === "InvoiceDateTime") {
                                param.field = "s.InvoiceDateTime";
                            }
                            if (param.field === "DeliveryDate") {
                                param.field = "S.DeliveryDate";
                            }
                            if (param.field === "InvoiceAmount") {
                                param.field = "s.GrandTotalAmount";
                            }
                            if (param.field === "PaidAmount") {
                                param.field = "S.PaidAmount";
                            }
                            if (param.field === "RestAmount") {
                                param.field = "s.RestAmount";
                            }
                            if (param.field === "Status") {
                                param.field = "s.Processed";
                            }

                        });
                    }

                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (param) {
                            if (param.field === "Id") {
                                param.field = "S.Id";
                            }
                            if (param.field === "Code") {
                                param.field = "s.Code";
                            }
                            if (param.field === "CustomerName") {
                                param.field = "c.Name";
                            }
                            if (param.field === "RouteName") {
                                param.field = "R.Name";
                            }
                            if (param.field === "DeliveryAddress") {
                                param.field = "S.DeliveryAddress";
                            }
                            if (param.field === "InvoiceDateTime") {
                                param.field = "s.InvoiceDateTime";
                            }
                            if (param.field === "DeliveryDate") {
                                param.field = "S.DeliveryDate";
                            }
                            if (param.field === "InvoiceAmount") {
                                param.field = "s.GrandTotalAmount";
                            }
                            if (param.field === "PaidAmount") {
                                param.field = "S.PaidAmount";
                            }
                            if (param.field === "RestAmount") {
                                param.field = "s.RestAmount";
                            }
                            if (param.field === "Status") {
                                param.field = "s.Processed";
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
            search: ["Code", "CustomerName", "RouteName", "InvoiceAmount", "PaidAmount","RestAmount"],
            excel: {
                fileName: "Inquery.xlsx",
                filterable: true
            },
            pdfExport: function (e) {
                $(".k-grid-toolbar").hide();
                $(".k-grouping-header").hide();
                $(".k-floatwrap").hide();
                var grid = e.sender;
                var actionColumnIndex = grid.columns.findIndex(col => col.title === "Action");
                var selectionColumnIndex = grid.columns.findIndex(col => col.selectable === true);

                var actionVisibility = actionColumnIndex >= 0 ? grid.columns[actionColumnIndex].hidden : true;
                var selectionVisibility = selectionColumnIndex >= 0 ? grid.columns[selectionColumnIndex].hidden : true;
                if (actionColumnIndex >= 0) grid.hideColumn(actionColumnIndex);
                if (selectionColumnIndex >= 0) grid.hideColumn(selectionColumnIndex);
                e.sender.options.pdf = {
                    paperSize: "A4",
                    margin: { top: "4cm", left: "1cm", right: "1cm", bottom: "4cm" },
                    landscape: true,
                    allPages: true,
                    fileName: `Inquerys_${new Date().toISOString().split('T')[0]}.pdf`
                };
                setTimeout(function () {
                    if (actionColumnIndex >= 0) grid.showColumn(actionColumnIndex);
                    if (selectionColumnIndex >= 0) grid.showColumn(selectionColumnIndex);

                    $(".k-grid-toolbar").show();
                    $(".k-grouping-header").show();
                    $(".k-floatwrap").show();
                }, 1000);
            },

            columns: [
                
                { field: "Code", title: "Code", sortable: true },
                { field: "CustomerName", title: "Customer", sortable: true },
                { field: "RouteName", title: "Route", sortable: true },
                { field: "DeliveryAddress", title: "Delivery Address", sortable: true },
                { field: "InvoiceDateTime", title: "Invoice DateTime", sortable: true },
                { field: "DeliveryDate", title: "Delivery Date", sortable: true },
                { field: "InvoiceAmount", title: "Invoice Amount", sortable: true },
                { field: "PaidAmount", title: "Paid Amount", sortable: true },
                { field: "RestAmount", title: "Rest Amount", sortable: true },
                {
                    field: "Status", title: "Status", sortable: true,
                    filterable: {
                        ui: function (element) {
                            element.kendoDropDownList({
                                dataSource: [
                                    { text: "Paid", value: "1" },
                                    { text: "UnPaid", value: "0" }
                                ],
                                dataTextField: "text",
                                dataValueField: "value",
                                optionLabel: "Select Status"
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

    return {
        init: init
    }


}(CommonService, CommonAjaxService);





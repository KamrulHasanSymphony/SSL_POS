var InvoiceWiseSaleOrderController = function (CommonService, CommonAjaxService) {



    var init = function () {

        operation = $("#Operation").val();
        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';

        if (parseInt(getId) == 0 && getOperation == '') {
            GetBranchList();
            GetGridDataList();
        };
        $("#indexSearch").on('click', function () {
            var branchId = $("#Branchs").data("kendoComboBox").value();

            if (branchId == "") {
                ShowNotification(3, "Please Select Branch Name First!");
                return;
            }
            const gridElement = $("#GridDataList");
            if (gridElement.data("kendoGrid")) {
                gridElement.data("kendoGrid").destroy();
                gridElement.empty();
            }

            GetGridDataList();

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

    var GetGridDataList = function () {
        
        var branchId = $("#Branchs").data("kendoComboBox").value();
        var FromDate = $('#FromDate').val();
        var ToDate = $('#ToDate').val();
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
                    url: "/DMS/SaleOrder/GetOrderNoWiseGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false,
                    data: { branchId: branchId, fromDate: FromDate, toDate: ToDate }
                },
                parameterMap: function (options) {
                    if (options.sort) {
                        options.sort.forEach(function (param) {
                            
                            if (param.field === "ProductName") {
                                param.field = "P.Name";
                            }

                            if (param.field === "BranchName") {
                                param.field = "Br.Name";
                            }
                            if (param.field === "RouteName") {
                                param.field = "r.Name";
                            }

                            if (param.field === "InvoiceDateTime") {
                                param.field = "H.InvoiceDateTime";

                            }
                            if (param.field === "Quantity") {
                                param.field = "d.Quantity";

                            }
                        });
                    }

                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (param) {
                            if (param.field === "ProductName") {
                                param.field = "P.Name";
                            }

                            if (param.field === "BranchName") {
                                param.field = "Br.Name";
                            }
                            if (param.field === "RouteName") {
                                param.field = "r.Name";
                            }

                            if (param.field === "InvoiceDateTime") {
                                param.field = "H.InvoiceDateTime";

                            }
                            if (param.field === "Quantity") {
                                param.field = "d.Quantity";

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
                    //SubTotal: { type: "number" },
                    Quantity: { type: "number" }
                }
            }
            ,
            aggregate: [
                //{ field: "SubTotal", aggregate: "sum" },
                { field: "Quantity", aggregate: "sum" }
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
            search: ["ProductName", "BranchName", "InvoiceDateTime", "Quantity"],
           
            excel: {
                fileName: "Order wise Sale.xlsx",
                filterable: true
            },
            columns: [
                //{ field: "Code", title: "Code", sortable: true },
                { field: "BranchName", title: "Branch Name", sortable: true },
                { field: "RouteName", title: "Route", sortable: true },
                {
                    field: "InvoiceDateTime", title: "Invoice Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(InvoiceDateTime), "yyyy-MM-dd") #',
                    filterable:
                    {
                        ui: "datepicker"
                    }
                },
                //{ field: "SalePersonName", title: "Sale Person", sortable: true },
                //{ field: "CustomerName", title: "Customer Name", sortable: true },
                { field: "ProductName", title: "Product", sortable: true },
                {
                    field: "Quantity",
                    title: "Quantity",
                    sortable: true,
                    aggregates: ["sum"],
                    format: "{0:n2}",
                    attributes: { style: "text-align: right;" },
                    footerTemplate: "#= kendo.toString(sum, 'n2') #",
                    groupFooterTemplate: "#= kendo.toString(sum, 'n2') #"
                }
                //{
                //    field: "SubTotal",
                //    title: "SubTotal",
                //    sortable: true,
                //    aggregates: ["sum"],
                //    format: "{0:n2}",
                //    attributes: { style: "text-align: right;" },
                //    footerTemplate: "#= kendo.toString(sum, 'n2') #",
                //    groupFooterTemplate: "#= kendo.toString(sum, 'n2') #"
                //}
            ],
            editable: false,
            selectable: "multiple row",
            navigatable: true,
            columnMenu: true
        });
        
    };
    function fail(err) {
        console.log(err);
        ShowNotification(3, "Something gone wrong");
    };
    function Visibility(action) {
        $('#frmEntry').find(':input').prop('readonly', action);
        $('#frmEntry').find('table, table *').prop('disabled', action);
        $('#frmEntry').find(':input[type="button"]').prop('disabled', action);
        $('#frmEntry').find(':input[type="checkbox"]').prop('disabled', action);
        $('#frmEntry').find('select').prop('disabled', action);
    };

    return {
        init: init
    }


}(CommonService, CommonAjaxService);

function ReportPreview(id) {
    
    const form = document.createElement('form');
    form.method = 'post';
    form.action = '/DMS/SaleOrder/ReportPreview';
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

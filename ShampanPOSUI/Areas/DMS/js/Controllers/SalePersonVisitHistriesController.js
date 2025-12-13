var SalePersonVisitHistriesController = function (CommonService, CommonAjaxService) {



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
                    url: "/DMS/SalesPerson/GetVisitHistoryGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false,
                    data: { branchId: branchId, fromDate: FromDate, toDate: ToDate }
                },
                parameterMap: function (options) {
                    if (options.sort) {
                        options.sort.forEach(function (param) {
                            if (param.field === "BranchName") {
                                param.field = "Bp.Name";
                            }
                            if (param.field === "SalePersonName") {
                                param.field = "so.Name";
                            }
                          
                            if (param.field === "VisitDate" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "H.Date";
                            }
                            if (param.field === "RouteName") {
                                param.field = "r.Name";
                            }
                            if (param.field === "CustomerName") {
                                param.field = "c.Name";
                            }
                            if (param.field === "Visited") {
                                param.field = "d.IsVisited";
                            }
                        });
                    }

                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (param) {
                            if (param.field === "BranchName") {
                                param.field = "Bp.Name";
                            }
                            if (param.field === "SalePersonName") {
                                param.field = "so.Name";
                            }
                           
                            if (param.field === "VisitDate" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "CONVERT(VARCHAR(10), H.Date, 120)";
                            }
                            if (param.field === "RouteName") {
                                param.field = "r.Name";
                            }
                            if (param.field === "CustomerName") {
                                param.field = "c.Name";
                            }
                            if (param.field === "Visited") {
                                param.field = "d.IsVisited";
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
            aggregate: [
                { field: "Visited", aggregate: "count" } // Aggregate for counting Visited
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
            search: ["BranchName", "VisitDate", "SalePersonName", "RouteName", "CustomerName", "IsVisited"],

            excel: {
                fileName: "Visit history.xlsx",
                filterable: true
            },
            columns: [
                //{ field: "SerialNo", title: "SL No", width: 80 },
                {
                    title: "SL No",
                    width: 80,
                    template: function (dataItem) {
                        var grid = $("#GridDataList").data("kendoGrid");
                        var dataSource = grid.dataSource;
                        return (dataSource.page() - 1) * dataSource.pageSize() + dataSource.indexOf(dataItem) + 1;
                    }
                },
                { field: "BranchName", title: "Branch Name", sortable: true },
                { field: "SalePersonName", title: "Sale Person", sortable: true },
                {
                    field: "VisitDate", title: "Visit Date", sortable: true,
                    template: '#= kendo.toString(kendo.parseDate(VisitDate), "dd-MM-yyyy") #',
                    filterable: {
                        ui: "datepicker"
                    }
                },
                { field: "RouteName", title: "Route", sortable: true },
                { field: "CustomerName", title: "Customer", sortable: true },
                {
                    field: "Visited",
                    title: "Visited",
                    sortable: true,
                    attributes: { style: "text-align: right;" },
                    width: 150,
                    filterable: {
                        ui: function (element) {
                            element.kendoDropDownList({
                                dataSource: [
                                    { text: "Visited", value: "1" },
                                    { text: "Not-Visited", value: "0" }
                                ],
                                dataTextField: "text",
                                dataValueField: "value",
                                optionLabel: "Select Option"
                            });
                        }
                    },
                    aggregates: ["count"],
                    footerTemplate: "Total : #=count#",
                    groupFooterTemplate: "Total: #=count#"
                }
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

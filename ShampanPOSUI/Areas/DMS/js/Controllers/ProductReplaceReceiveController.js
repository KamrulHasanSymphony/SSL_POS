var ProductReplaceReceiveController = function (CommonService, CommonAjaxService) {

    var getCustomerId = 0;
    var getSalePersonId = 0;
    var getDeliveryPersonId = 0;
    var getDriverPersonId = 0;
    var getRouteId = 0;
    var getCurrencyId = 0;
    var getSaleOrderId = 0;
    var operation = "";
    var decimalPlace = 0;

    var init = function () {

        if ($("#IsPosted").length) {
            LoadCombo("IsPosted", '/Common/Common/GetBooleanDropDown');
            $("#IsPosted").val('');
        };

        var IsPost = $('#IsPost').val();
        if (IsPost === 'True') {
            Visibility(true);
        };

        getCustomerId = $("#CustomerId").val() || 0;
        operation = $("#Operation").val();

        decimalPlace = $("#DecimalPlace").val() || 2;
        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';

        if (parseInt(getId) == 0 && getOperation == '') {
            GetBranchList();

            GetGridDataList();
        };

        if (getOperation == "add") {
            GetCustomerComboBox();
        }
        else if (operation == "update") {
            GetCustomerComboBox();
        }

        var $table = $('#details');

        var table = initEditTable($table, { searchHandleAfterEdit: false });

        TotalCalculation();

        $('#addRows').on('click', function (e) {

            addRow($table);
        });

        $('.btnsave').click('click', function () {
            var getId = $('#Id').val();
            var status = "Save";
            if (parseInt(getId) > 0) {
                status = "Update";
            }
            Confirmation("Are you sure? Do You Want to " + status + " Data?",
                function (result) {
                    if (result) {
                        save($table);
                    }
                });
        });

        $('#btnPost').on('click', function () {


            Confirmation("Are you sure? Do You Want to Post Data?",
                function (result) {
                    if (result) {

                        SelectData();
                    }
                });
        });

        $('.btnPost').on('click', function () {

            Confirmation("Are you sure? Do You Want to Post Data?",
                function (result) {

                    if (result) {
                        var model = serializeInputs("frmEntry");
                        if (model.IsPost == "True") {
                            ShowNotification(3, "Data has already been Posted.");
                        }
                        else {
                            model.IDs = model.Id;
                            var url = "/DMS/ProductReplaceReceive/MultiplePost";
                            CommonAjaxService.multiplePost(url, model, postDone, fail);
                        }
                    }
                });
        });


        $('#details').on('blur', ".td-Quantity", function (event) {
            computeSubTotal($(this), '');
        });


        $table.on('click',
            '.remove-row-btn',
            function () {
                TotalCalculation();
            });
       

        $('#details').on('click', 'input.txtProductName', function () {
            var originalRow = $(this);
            $('#FromDate').val($('#DeliveryDate').val());
            originalRow.closest("td").find("input").data('touched', true);
            CommonService.productModal(
                function success(result) {
                },
                function fail(error) {
                    originalRow.closest("td").find("input").data("touched", false).focus();
                },
                function dblClick(row) {
                    productModalDblClick(row, originalRow);
                },
                function closeCallback() {
                    originalRow.closest("td").find("input").data("touched", false).focus();
                }
            );
        });


        // Event handler for quantity change
        $('#details').on('change', ".td-Quantity", function (event) {

        ;

            var currentRow = $(this).closest('tr');
            var customerId = $("#CustomerId").val() || 0;
            var productId = currentRow.closest('tr').find('td:nth-child(4)').text().trim() || 0;
            var deliveryDate = $("#DeliveryDate").val();
            var Quantity = 0;

            if (currentRow.find("td.td-Quantity input").length > 0) {
                //quantity = parseFloat(currentRow.find("td.td-Quantity input").val().replace(/,/g, '')) || 0;
            } else {
                //quantity = parseFloat(currentRow.find("td.td-Quantity").text().replace(/,/g, '')) || 0;
            }

            $(".td-Quantity").each(function () {
                var input = $(this).find("input");
                var val;

                if (input.length > 0) {
                    val = parseFloat(input.val().replace(/,/g, '')) || 0;
                } else {
                    val = parseFloat($(this).text().replace(/,/g, '')) || 0;
                }

                Quantity += val;
            });

            $("#GrandTotalQuantity").val(Quantity);

        });

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

        $('#btnPrevious').click('click', function () {
            var getId = $('#Id').val();
            if (parseInt(getId) > 0) {
                window.location.href = "/DMS/ProductReplaceReceive/NextPrevious?id=" + getId + "&status=Previous";
            }
        });
        $('#btnNext').click('click', function () {
            var getId = $('#Id').val();
            if (parseInt(getId) > 0) {
                window.location.href = "/DMS/ProductReplaceReceive/NextPrevious?id=" + getId + "&status=Next";
            }
        });

        $('#SpecialDiscountRate').on('change', function (event) {
            $("#SpecialDiscountAmount").val(0); // Get discount rate from input

            TotalCalculation();

        });

        $('#SpecialDiscountAmount').on('change', function (event) {
            $("#SpecialDiscountRate").val(0)  // Get discount rate from input

            TotalCalculation();

        });
    };



    //End Init


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
    function productModalDblClick(row, originalRow) {
        ;
        var dataTable = $("#modalData").DataTable();
        var rowData = dataTable.row(row).data();

        var ProductId = rowData.ProductId;
        var ProductCode = rowData.ProductCode;
        var ProductName = rowData.ProductName;

        var UOMId = rowData.UOMId;
        var UOMName = rowData.UOMName;
        var CostPrice = rowData.SalesPrice;
        var SDRate = rowData.SDRate;
        var VATRate = rowData.VATRate;
        var Quantity = 1;
        var Conversion = rowData.UOMConversion;
        var $currentRow = originalRow.closest('tr');

        $currentRow.find('.td-ProductCode').text(ProductCode);
        $currentRow.find('.td-ProductName').text(ProductName);
        $currentRow.find('.td-ProductId').text(ProductId);

        $currentRow.find('.td-UOMName').text(UOMName);
        $currentRow.find('.td-Quantity').text(Quantity);



        $("#partialModal").modal("hide");
        originalRow.closest("td").find("input").data("touched", false).focus();
        $('#details').find(".td-Quantity").trigger('blur');


        TotalCalculation();
    };   

    function GetCustomerComboBox() {
        var CustomerComboBox = $("#CustomerId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [
                { field: "Code", title: "Code", width: 100 },
                { field: "Name", title: "Name", width: 150 },
                { field: "BanglaName", title: "BanglaName", width: 200 },
            ],
            filter: "contains",
            filterFields: ["Code", "Name", "BanglaName"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetCustomerList"
                }
            },
            placeholder: "Select Customer",
            value: "",

            dataBound: function (e) {
                if (typeof getCustomerId !== "undefined" && getCustomerId && getCustomerId !== "0") {
                    this.value(parseInt(getCustomerId));
                } else {
                    this.value(""); // ensures placeholder is shown
                }
            }


            //change: function (e) {           
            //    var selectedItem = this.dataItem();             
            //    if (selectedItem) {
            //        var address = selectedItem.Address;
            //        var regularDiscountRate = selectedItem.RegularDiscountRate;
            //        $("#DeliveryAddress").val(address);
            //        $("#RegularDiscountRate").val(regularDiscountRate);
            //    }
            //}

        }).data("kendoMultiColumnComboBox");
    };


    function computeSubTotal(row, param) {
        TotalCalculation();
    }

    function TotalCalculation() {
        ;
        var Quantity = 0;
       
        Quantity = getColumnSumAttr('Quantity', 'details');

        $("#GrandTotalQuantity").val(Quantity);

    };

    function formatNumber(value) {
        return Number(parseFloat(value).toFixed(parseInt(decimalPlace)))
            .toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) });
    }


    var GetGridDataList = function () {

        var branchId = $("#Branchs").data("kendoComboBox").value();
        var IsPosted = $('#IsPosted').val();
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
                    url: "/DMS/ProductReplaceReceive/GetGridData",
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
                            if (param.field === "CustomerName") {
                                param.field = "C.Name";
                            }

                            if (param.field === "BranchName") {
                                param.field = "BF.Name";
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

                            if (param.field === "ReceiveDate") {
                                param.field = "H.ReceiveDate";
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

                            if (param.field === "BranchName") {
                                param.field = "BF.Name";
                            }

                            if (param.field === "Status") {
                                let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";

                                if (statusValue.startsWith("p")) {
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

                                param.field = "H.IsPost";
                                param.operator = "eq";
                            }
                            if (param.field === "ReceiveDate") {
                                param.field = "H.ReceiveDate";
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
                    ReceiveDate: { type: "date" },

                }
            }
            ,
            aggregate: [

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
            search: ["ReceiveDate", "BranchName", "CustomerName", "Code"],
            detailInit: function (e) {

                $("<div/>").appendTo(e.detailCell).kendoGrid({
                    dataSource: {
                        type: "json",
                        serverPaging: true,
                        serverSorting: true,
                        serverFiltering: true,
                        allowUnsort: true,
                        pageSize: 10,
                        aggregate: [
                            { field: "Quantity", aggregate: "sum" },

                        ],
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
                        requestEnd: function (e) {
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

                        {
                            field: "Quantity",
                            title: "Quantity",
                            sortable: true,
                            width: 100,
                            aggregates: ["sum"],
                            format: "{0:n2}",
                            attributes: { style: "text-align: right;" },
                            footerTemplate: "#= kendo.toString(sum, 'n2') #"
                        }



                    ]
                });
            }
            ,
            excel: {
                fileName: "ProductReplaceReceiveList.xlsx",
                filterable: true
            },
            pdf: {
                fileName: `ProductReplaceReceiveList_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`,
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


                var fileName = `ProductReplaceReceiveList_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`;

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
                {
                    title: "Action",
                    width: 100,
                    template: function (dataItem) {
                        return `
            <a href="/DMS/ProductReplaceReceive/Edit/${dataItem.Id}" 
               class="btn btn-primary btn-sm mr-2 edit" 
               title="Edit">
                <i class="fas fa-pencil-alt"></i>
            </a>
           
            <a href="#" 
               onclick="IncoiceReportPreview(${dataItem.Id})" 
               class="btn btn-warning btn-sm edit" 
               title="Invoice Preview">
                <i class="fas fa-print"></i>
            </a>`;
                    }
                },
                { field: "Id", width: 50, hidden: true, sortable: true },
                { field: "Code", title: "Code", width: 180, sortable: true },
                { field: "CustomerName", title: "CustomerName", sortable: true, width: 200 },
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
                ,
                { field: "BranchName", title: "Branch Name", sortable: true, hidden: true },

            ],
            editable: false,
            selectable: "multiple row",
            navigatable: true,
            columnMenu: true
        });

    };

    function save($table) {

        var isDropdownValid2 = CommonService.validateDropdown("#CustomerId", "#titleError2", "Customer is required");

        var isDropdownValid = isDropdownValid2;
        var validator = $("#frmEntry").validate();
        var model = serializeInputs("frmEntry");

        if (parseInt(model.CustomerId) == 0 || model.CustomerId == "") {
            ShowNotification(3, "Customer Is Required.");
            return;
        }

        var result = validator.form();

        if (!result || !isDropdownValid) {
            if (!result) {
                validator.focusInvalid();
            }
            return;
        }

        if (model.IsPost == 'True') {
            ShowNotification(2, "Post operation is already done, Do not update this entry");
            return;
        }

        var details = serializeTable($table);

        var requiredFields = ['ProductName', 'Quantity'];
        var fieldMappings = {
            'ProductName': 'Product Name',
            'Quantity': 'Quantity',
        };

        var errorMessage = getRequiredFieldsCheckObj(details, requiredFields, fieldMappings);
        if (errorMessage) {
            ShowNotification(3, errorMessage);
            return;
        };

        model.ProductReplaceReceiveDetails = details;

        var url = "/DMS/ProductReplaceReceive/CreateEdit";

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
        var filteredData = [];
        var dataSource = $("#GridDataList").data("kendoGrid").dataSource;
        var rowData = dataSource.view().filter(x => IDs.includes(x.Id));
        filteredData = rowData.filter(x => x.IsPost === true && IDs.includes(x.Id));

        if (filteredData.length > 0) {
            ShowNotification(3, "Data has already been Posted.");
            return;
        }

        var url = "/DMS/ProductReplaceReceive/MultiplePost";

        CommonAjaxService.multiplePost(url, model, postDone, fail);
    };

    function postDone(result) {

        var grid = $('#GridDataList').data('kendoGrid');
        if (grid) {
            grid.dataSource.read();
        }
        if (result.Status == 200) {
            ShowNotification(1, result.Message);
            $(".btnsave").hide();
            $(".btnPost").hide();
            $(".sslPush").show();
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

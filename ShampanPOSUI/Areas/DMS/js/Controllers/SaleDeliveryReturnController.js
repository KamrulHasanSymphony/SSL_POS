var SaleDeliveryReturnController = function (CommonService, CommonAjaxService) {

    var getCustomerId = 0;
    var getSalePersonId = 0;
    var getDeliveryPersonId = 0;
    var getDriverPersonId = 0;
    var getRouteId = 0;
    var getCurrencyId = 0;
    var decimalPlace = 0;

    var init = function () {

        if ($("#IsPosted").length) {
            LoadCombo("IsPosted", '/Common/Common/GetBooleanDropDown');
            $("#IsPosted").val('');
            GetBranchList();
        };

        var IsPost = $('#IsPost').val();
        if (IsPost === 'True') {
            Visibility(true);
        };

        getCustomerId = $("#CustomerId").val() || 0;
        getSalePersonId = $("#SalePersonId").val() || 0;
        getDeliveryPersonId = $("#DeliveryPersonId").val() || 0;
        getDriverPersonId = $("#DriverPersonId").val() || 0;
        getRouteId = $("#RouteId").val() || 0;
        getCurrencyId = $("#CurrencyId").val() || 0;

        decimalPlace = $("#DecimalPlace").val() || 2;
        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';

        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();
        };

        GetCustomerComboBox();
        GetSalePersonComboBox();
        GetRouteComboBox();
        GetCurrencyComboBox();
        GetDeliveryComboBox();
        GetDriverComboBox();


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
                            var url = "/DMS/SaleDeliveryReturn/MultiplePost";
                            CommonAjaxService.multiplePost(url, model, postDone, fail);
                        }
                    }
                });
        });


        $('#details').on('blur', ".td-Quantity", function (event) {
            computeSubTotal($(this), '');
        });

        $('#details').on('blur', ".td-UnitRate", function (event) {
            computeSubTotal($(this), '');
        });

        $('#details').on('blur', ".td-SD", function (event) {
            computeSubTotal($(this), 'SDRate');
        });

        $('#details').on('blur', ".td-SDAmount", function (event) {
            computeSubTotal($(this), 'SDAmount');
        });

        $('#details').on('blur', ".td-VATRate", function (event) {
            computeSubTotal($(this), 'VATRate');
        });

        $('#details').on('blur', ".td-VATAmount", function (event) {
            computeSubTotal($(this), 'VATAmount');
        });
        $('#details').on('click', 'input.txtProductName', function () {
            var originalRow = $(this);
            $('#FromDate').val($('#DeliveryDate').val());
            originalRow.closest("td").find("input").data('touched', true);
            CommonService.productCodeModal(
                function success(result) {
                    console.log("Modal opened successfully.");
                },
                function fail(error) {
                    originalRow.closest("td").find("input").data("touched", false).focus();
                    console.error("Error opening modal:", error);
                },
                function dblClick(row) {
                    productModalDblClick(row, originalRow);
                },
                function closeCallback() {
                    originalRow.closest("td").find("input").data("touched", false).focus();
                    console.log("Modal closed.");
                }
            );
        });


        $('#details').on('click', 'input.txtUOMName', function () {
            var originalRow = $(this);
            var currentRow = originalRow.closest('tr');
            var UOMId = currentRow.find('td:nth-child(6)').text().trim() || 0;
            if (parseInt(UOMId) == 0) {
                ShowNotification(3, 'Please Fillup Product First!');
                return;
            };
            $('#UOMId').val(UOMId);
            originalRow.closest("td").find("input").data('touched', true);
            CommonService.uomFromNameModal(
                function success(result) {
                    console.log("Modal opened successfully.");
                },
                function fail(error) {
                    originalRow.closest("td").find("input").data("touched", false).focus();
                    console.error("Error opening modal:", error);
                },
                function dblClick(row) {
                    uomFromNameModalDblClick(row, originalRow);
                },
                function closeCallback() {
                    originalRow.closest("td").find("input").data("touched", false).focus();
                    console.log("Modal closed.");
                }
            );
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
                window.location.href = "/DMS/SaleDeliveryReturn/NextPrevious?id=" + getId + "&status=Previous";
            }
        });
        $('#btnNext').click('click', function () {
            var getId = $('#Id').val();
            if (parseInt(getId) > 0) {
                window.location.href = "/DMS/SaleDeliveryReturn/NextPrevious?id=" + getId + "&status=Next";
            }
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
    function productModalDblClick(row, originalRow) {
        
        var dataTable = $("#modalData").DataTable();
        var rowData = dataTable.row(row).data();

        var ProductId = rowData.ProductId;
        var ProductCode = rowData.ProductCode;
        var ProductName = rowData.ProductName;
        
        var UOMId = rowData.UOMId;
        var UOMName = rowData.UOMName;
        var CostPrice = rowData.CostPrice;
        var SDRate = rowData.SDRate;
        var VATRate = rowData.VATRate;

        var $currentRow = originalRow.closest('tr');
        $currentRow.find('.td-ProductCode').text(ProductCode);
        $currentRow.find('.td-ProductName').text(ProductName);
        $currentRow.find('.td-ProductId').text(ProductId);
        
        $currentRow.find('.td-UOMName').text(UOMName);
        $currentRow.find('.td-UOMId').text(UOMId);
        $currentRow.find('.td-UnitRate').text(CostPrice);
        $currentRow.find('.td-SD').text(SDRate);
        $currentRow.find('.td-VATRate').text(VATRate);

        $("#partialModal").modal("hide");
        originalRow.closest("td").find("input").data("touched", false).focus();
        $('#details').find(".td-Quantity").trigger('blur');
    };

    function uomFromNameModalDblClick(row, originalRow) {
        var dataTable = $("#modalData").DataTable();
        var rowData = dataTable.row(row).data();

        var UOMFromId = rowData.UOMFromId;
        var UOMFromName = rowData.UOMFromName;
        var UOMConversion = rowData.UOMConversion;

        originalRow.closest("td").find("input").val(UOMFromName);
        originalRow.closest('td').next().text(UOMFromId);
        /*originalRow.closest('td').next().next().next().text(UOMConversion);*/

        $("#partialModal").modal("hide");
        originalRow.closest("td").find("input").data("touched", false).focus();
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
                if (getCustomerId) {
                    this.value(parseInt(getCustomerId));
                }
            }
        }).data("kendoMultiColumnComboBox");
    };

    //function GetCustomerComboBox() {
    //    var CustomerComboBox = $("#CustomerId").kendoMultiColumnComboBox({
    //        dataTextField: "Name",
    //        dataValueField: "Id",
    //        height: 400,
    //        columns: [
    //            { field: "Code", title: "Code", width: 100 },
    //            { field: "Name", title: "Name", width: 150 },
    //            { field: "BanglaName", title: "BanglaName", width: 200 },
    //        ],
    //        filter: "contains",
    //        filterFields: ["Code", "Name", "BanglaName"],
    //        dataSource: {
    //            transport: {
    //                read: "/Common/Common/GetCustomerList"
    //            }
    //        },
    //        placeholder: "Select Customer",
    //        value: "",
    //        dataBound: function (e) {
    //            if (getCustomerId) {
    //                this.value(parseInt(getCustomerId));
    //            }
    //        },
    //        change: function (e) {
                
    //        }
    //    }).data("kendoMultiColumnComboBox");
    //};

    function GetSalePersonComboBox() {
        var SalePersonComboBox = $("#SalePersonId").kendoMultiColumnComboBox({
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
                    read: "/Common/Common/GetSalePersonList"
                }
            },
            placeholder: "Select Person",
            value: "",
            dataBound: function (e) {
                if (getSalePersonId) {
                    this.value(parseInt(getSalePersonId));
                }
            },
            change: function (e) {
                
            }
        }).data("kendoMultiColumnComboBox");
    };

    function GetRouteComboBox() {
        var RouteComboBox = $("#RouteId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            //columns: [
            //    { field: "Code", title: "Code", width: 100 },
            //    { field: "Name", title: "Name", width: 150 }
            //],
            filter: "contains",
            filterFields: ["Name"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetCustomerRouteList"
                }
            },
            placeholder: "Select Route",
            value: "",
            dataBound: function (e) {
                if (getRouteId) {
                    this.value(parseInt(getRouteId));
                }
            },
            change: function (e) {
                
            }
        }).data("kendoMultiColumnComboBox");
    };

    function GetCurrencyComboBox() {
        var CurrencyComboBox = $("#CurrencyId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [
                { field: "Code", title: "Code", width: 100 },
                { field: "Name", title: "Name", width: 150 }
            ],
            filter: "contains",
            filterFields: ["Code", "Name"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetCurrencieList"
                }
            },
            placeholder: "Select Currency",
            value: "",
            dataBound: function (e) {
                if (getCurrencyId) {
                    this.value(parseInt(getCurrencyId));
                }
            },
            change: function (e) {
                
            }
        }).data("kendoMultiColumnComboBox");
    };

    function GetDeliveryComboBox() {
        var DeliveryComboBox = $("#DeliveryPersonId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [
                { field: "Code", title: "Code", width: 100 },
                { field: "Name", title: "Name", width: 150 }

            ],
            filter: "contains",
            filterFields: ["Code", "Name"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetDeliveryList"
                }
            },
            placeholder: "Select Delivery Person",
            value: "",
            dataBound: function (e) {
                if (getDeliveryPersonId) {
                    this.value(parseInt(getDeliveryPersonId));
                }
            },
            change: function (e) {
                
            }
        }).data("kendoMultiColumnComboBox");
    };

    function GetDriverComboBox() {
        var DriverComboBox = $("#DriverPersonId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            filter: "contains",
            filterFields: ["Name"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetDriverList"
                }
            },
            placeholder: "Select Driver Person",
            value: "",
            dataBound: function (e) {
                if (getDriverPersonId) {
                    this.value(parseInt(getDriverPersonId));
                }
            },
            change: function (e) {
                
            }
        }).data("kendoMultiColumnComboBox");
    };

    function computeSubTotal(row, param) {

        // Get base values with proper parsing of formatted numbers
        var qty = parseFloat(row.closest("tr").find("td.td-Quantity").text().replace(/,/g, '')) || 1;
        var unitCost = parseFloat(row.closest("tr").find("td.td-UnitRate").text().replace(/,/g, '')) || 0;
        var freeQty = parseFloat(row.closest("tr").find("td.td-FreeQuantity").text().replace(/,/g, '')) || 0;
        var discountRate = parseFloat(row.closest("tr").find("td.td-DiscountRate").text().replace(/,/g, '')) || 0;

        var SDRate = parseFloat(row.closest("tr").find("td.td-SD").text().replace(/,/g, '')) || 0;
        var SDAmount = parseFloat(row.closest("tr").find("td.td-SDAmount").text().replace(/,/g, '')) || 0;
        var VATRate = parseFloat(row.closest("tr").find("td.td-VATRate").text().replace(/,/g, '')) || 0;
        var VATAmount = parseFloat(row.closest("tr").find("td.td-VATAmount").text().replace(/,/g, '')) || 0;

        if (!isNaN(qty * unitCost)) {
            // Calculate SubTotal
            var SubTotal = Number(parseFloat(qty * unitCost).toFixed(parseInt(decimalPlace)));
            row.closest("tr").find("td.td-SubTotal").text(SubTotal.toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));

            // Calculate SubTotalAfterDiscount
            var discountAmount = (SubTotal * discountRate) / 100;
            var SubTotalAfterDiscount = SubTotal - discountAmount;
            row.closest("tr").find("td.td-SubTotalAfterDiscount").text(SubTotalAfterDiscount.toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));

            // Handle VAT and SD calculations based on parameter
            if (param == 'VATRate') {
                VATAmount = Number(parseFloat((SubTotalAfterDiscount * VATRate) / 100).toFixed(parseInt(decimalPlace)));
                row.closest("tr").find("td.td-VATAmount").text(VATAmount.toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));
            }
            else if (param == 'VATAmount') {
                VATRate = Number(parseFloat((VATAmount * 100) / SubTotalAfterDiscount).toFixed(parseInt(decimalPlace)));
                row.closest("tr").find("td.td-VATRate").text(VATRate.toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));
            }
            else if (param == 'SDRate') {
                SDAmount = Number(parseFloat((SubTotalAfterDiscount * SDRate) / 100).toFixed(parseInt(decimalPlace)));
                row.closest("tr").find("td.td-SDAmount").text(SDAmount.toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));
            }
            else if (param == 'SDAmount') {
                SDRate = Number(parseFloat((SDAmount * 100) / SubTotalAfterDiscount).toFixed(parseInt(decimalPlace)));
                row.closest("tr").find("td.td-SD").text(SDRate.toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));
            }
            else {
                // Default calculations for both SD and VAT
                SDAmount = Number(parseFloat((SubTotalAfterDiscount * SDRate) / 100).toFixed(parseInt(decimalPlace)));
                VATAmount = Number(parseFloat(((SubTotalAfterDiscount + SDAmount) * VATRate) / 100).toFixed(parseInt(decimalPlace)));

                // Update all rates and amounts
                row.closest("tr").find("td.td-SDAmount").text(SDAmount.toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));
                row.closest("tr").find("td.td-VATAmount").text(VATAmount.toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));
            }

            // Calculate LineTotal and LineTotalAfterDiscount
            var LineTotal = SubTotal + SDAmount + VATAmount;
            var LineTotalAfterDiscount = SubTotalAfterDiscount + SDAmount + VATAmount;

            row.closest("tr").find("td.td-LineTotal").text(LineTotal.toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));
            row.closest("tr").find("td.td-LineTotalAfterDiscount").text(LineTotalAfterDiscount.toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));

            TotalCalculation();
        }
    }
    
    function TotalCalculation() {
        
        var Quantity = 0;
        var SDAmount = 0;
        var SubTotal = 0;
        var LineTotal = 0;

        Quantity = getColumnSumAttr('Quantity', 'details').toFixed(parseInt(decimalPlace));
        SubTotal = getColumnSumAttr('SubTotal', 'details').toFixed(parseInt(decimalPlace));
        SDAmount = getColumnSumAttr('SDAmount', 'details').toFixed(parseInt(decimalPlace));
        VATAmount = getColumnSumAttr('VATAmount', 'details').toFixed(parseInt(decimalPlace));
        LineTotal = getColumnSumAttr('LineTotal', 'details').toFixed(parseInt(decimalPlace));


        $("#GrandTotalAmount").val(Number(parseFloat(Quantity).toFixed(parseInt(decimalPlace))).toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));
        $("#GrandSubTotal").val(Number(parseFloat(SubTotal).toFixed(parseInt(decimalPlace))).toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));
        $("#GrandTotalSDAmount").val(Number(parseFloat(SDAmount).toFixed(parseInt(decimalPlace))).toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));
        $("#GrandTotalVATAmount").val(Number(parseFloat(VATAmount).toFixed(parseInt(decimalPlace))).toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));
        $("#GrandTotal").val(Number(parseFloat(LineTotal).toFixed(parseInt(decimalPlace))).toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));

    };


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
                    url: "/DMS/SaleDeliveryReturn/GetGridData",
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
                            if (param.field === "DeliveryAddress") {
                                param.field = "H.DeliveryAddress";
                            }
                            if (param.field === "Comments") {
                                param.field = "H.Comments";
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
                            if (param.field === "GrdTotalAmount") {
                                param.field = "H.GrandTotalAmount";
                            }
                            if (param.field === "GrdTotalSDAmount") {
                                param.field = "H.GrandTotalSDAmount";
                            }
                            if (param.field === "GrdTotalVATAmount") {
                                param.field = "H.GrandTotalVATAmount";
                            }
                            if (param.field === "InvoiceDateTime" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "H.InvoiceDateTime";
                            }
                            if (param.field === "DeliveryDate" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "H.DeliveryDate";
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
                                param.field = "Br.Name";
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
                            if (param.field === "CurrencyName") {
                                param.field = "con.Name";
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
                            if (param.field === "DeliveryAddress") {
                                param.field = "H.DeliveryAddress";
                            }
                            if (param.field === "Comments") {
                                param.field = "H.Comments";
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
                            if (param.field === "GrdTotalAmount") {
                                param.field = "H.GrandTotalAmount";
                            }
                            if (param.field === "GrdTotalSDAmount") {
                                param.field = "H.GrandTotalSDAmount";
                            }
                            if (param.field === "GrdTotalVATAmount") {
                                param.field = "H.GrandTotalVATAmount";
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
                            if (param.field === "BranchName") {
                                param.field = "Br.Name";
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
                            if (param.field === "CurrencyName") {
                                param.field = "con.Name";
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
            search: {
                fields: ["Code", "DeliveryAddress", "Comments", "Status", "GrdTotalAmount", "GrdTotalSDAmount", "GrdTotalVATAmount", "InvoiceDateTime", "DeliveryDate", "GrandTotalAmount", "GrandTotalSDAmount", "GrandTotalVATAmount", "BranchName", "CustomerName", "SalePersonName", "DeliveryPersonName", "DriverPersonName", "RouteName","CurrencyName"]
            },
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
                                url: "/DMS/SaleDeliveryReturn/GetSaleDeliveryReturnDetailDataById",
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
                            { field: "UnitRate", aggregate: "average" },
                            { field: "SubTotal", aggregate: "sum" },
                            { field: "SD", aggregate: "average" },
                            { field: "SDAmount", aggregate: "sum" },
                            { field: "VATRate", aggregate: "average" },
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
                        { field: "UOMName", title: "UOM Name", sortable: true, width: 100 },
                        {
                            field: "UOMConversion",
                            title: "UOM Conv.",
                            sortable: true,
                            width: 100,
                            footerTemplate: "<strong>Total:</strong>" // Shows "Total" text in footer
                        },                        
                        {
                            field: "Quantity",
                            title: "Quantity",
                            sortable: true,
                            width: 100,
                            aggregates: ["sum"],
                            format: "{0:n2}",
                            attributes: { style: "text-align: right;" },
                            footerTemplate: "#= kendo.toString(sum, 'n2') #"
                        },
                        {
                            field: "UnitRate",
                            title: "Unit Price",
                            sortable: true,
                            width: 100,
                            aggregates: ["average"],
                            format: "{0:n2}",
                            attributes: { style: "text-align: right;" },
                            footerTemplate: "#= kendo.toString(average, 'n2') #"
                        },
                        {
                            field: "SubTotal",
                            title: "SubTotal",
                            sortable: true,
                            width: 100,
                            aggregates: ["sum"],
                            format: "{0:n2}",
                            attributes: { style: "text-align: right;" },
                            footerTemplate: "#= kendo.toString(sum, 'n2') #"
                        },
                        {
                            field: "SD",
                            title: "SD Rate",
                            sortable: true,
                            width: 100,
                            aggregates: ["average"],
                            format: "{0:n2}",
                            attributes: { style: "text-align: right;" },
                            footerTemplate: "#= kendo.toString(average, 'n2') #"
                        },
                        {
                            field: "SDAmount",
                            title: "SD Amount",
                            sortable: true,
                            width: 100,
                            aggregates: ["sum"],
                            format: "{0:n2}",
                            attributes: { style: "text-align: right;" },
                            footerTemplate: "#= kendo.toString(sum, 'n2') #"
                        },
                        {
                            field: "VATRate",
                            title: "VAT Rate",
                            sortable: true,
                            width: 100,
                            aggregates: ["average"],
                            format: "{0:n2}",
                            attributes: { style: "text-align: right;" },
                            footerTemplate: "#= kendo.toString(average, 'n2') #"
                        },
                        {
                            field: "VATAmount",
                            title: "VAT Amount",
                            sortable: true,
                            width: 100,
                            aggregates: ["sum"],
                            format: "{0:n2}",
                            attributes: { style: "text-align: right;" },
                            footerTemplate: "#= kendo.toString(sum, 'n2') #"
                        },
                        {
                            field: "LineTotal",
                            title: "Line Total",
                            sortable: true,
                            width: 100,
                            aggregates: ["sum"],
                            format: "{0:n2}",
                            attributes: { style: "text-align: right;" },
                            footerTemplate: "#= kendo.toString(sum, 'n2') #"
                        },
                        { field: "VatType", hidden: true, title: "Vat Type", sortable: true, width: 100 },
                        { field: "Comments", title: "Comments", sortable: true, width: 150 }
                    ]
                });
            },

            excel: {
                fileName: "SaleDeliveryReturnList.xlsx",
                filterable: true
            },
            pdf: {
                fileName: `SaleDeliveryReturnList_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`,
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


                var fileName = `SaleDeliveryReturnList_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`;

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
                    selectable: true, width: 50
                },
                {
                    title: "Action",
                    width: 90,
                    template: function (dataItem) {
                        
                        return `
                                <a href="/DMS/SaleDeliveryReturn/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                                    <i class="fas fa-pencil-alt"></i>
                                </a>`+
                            "<a style='background-color: darkgreen;' href='#' onclick='ReportPreview(" + dataItem.Id + ")' class='btn btn-success btn-sm mr-2 edit ' title='Report Preview'><i class='fas fa-print'></i></a>";
                    }
                },
                { field: "Id", width: 50, hidden: true, sortable: true },
                { field: "Code", title: "Code", width: 180, sortable: true },
                { field: "SalePersonName", title: "Sale Person Name", sortable: true, width: 180 },
                { field: "RouteName", title: "Route Name", sortable: true, width: 150 },
                { field: "CustomerName", title: "Customer Name", sortable: true, width: 200 },
                {
                    field: "InvoiceDateTime", title: "Invoice DateTime", sortable: true, width: 150, template: '#= kendo.toString(kendo.parseDate(InvoiceDateTime), "yyyy-MM-dd") #',
                    filterable:
                    {
                        ui: "datepicker"
                    }
                },
                {
                    field: "DeliveryDate", title: " Delivery Date", sortable: true, width: 150, template: '#= kendo.toString(kendo.parseDate(DeliveryDate), "yyyy-MM-dd") #',
                    filterable:
                    {
                        ui: "datepicker"
                    }
                },
                { field: "DeliveryPersonName", title: "Delivery Person Name", sortable: true, width: 180 },
                { field: "DriverPersonName", title: "Driver Person Name", sortable: true, width: 180 },
                { field: "DeliveryAddress", title: "Delivery Address", sortable: true, width: 250 },
                { field: "CurrencyName", title: "Currency Name", sortable: true, width: 150 },
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
                {
                    field: "GrandTotalAmount",
                    title: "Grand Total Amount",
                    sortable: true,
                    width: 200,
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
                }
                ,
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

                { field: "Comments", title: "Comments", sortable: true, width: 250 },
                { field: "BranchName", title: "Branch Name", sortable: true, hidden: true }

            ],
            editable: false,
            selectable: "multiple row",
            navigatable: true,
            columnMenu: true
        });
        $("#GridDataList").on("click", ".k-header .k-checkbox", function () {
            var isChecked = $(this).is(":checked");
            var grid = $("#GridDataList").data("kendoGrid");
            if (isChecked) {
                grid.tbody.find(".k-checkbox").prop("checked", true);
            } else {
                grid.tbody.find(".k-checkbox").prop("checked", false);
            }
        });
    };

    function save($table) {
        var isDropdownValid1 = CommonService.validateDropdown("#CustomerId", "#titleError1", "Customer is required");
        var isDropdownValid2 = CommonService.validateDropdown("#SalePersonId", "#titleError2", "Sale Person Type is required");
        var isDropdownValid3 = CommonService.validateDropdown("#DeliveryPersonId", "#titleError3", "Delivery Person is required");
        var isDropdownValid4 = CommonService.validateDropdown("#DriverPersonId", "#titleError4", "Driver Person is required");
        var isDropdownValid5 = CommonService.validateDropdown("#RouteId", "#titleError5", "Route is required");
        var isDropdownValid6 = CommonService.validateDropdown("#CurrencyId", "#titleError6", "Currency is required");

        var isDropdownValid = isDropdownValid1 && isDropdownValid2 && isDropdownValid3 && isDropdownValid4 && isDropdownValid5 && isDropdownValid6;
        var validator = $("#frmEntry").validate();
        var model = serializeInputs("frmEntry");

         
        if (parseInt(model.CustomerId) == 0 || model.CustomerId == "") {
            ShowNotification(3, "Customer Is Required.");
            return;
        }
        if (parseInt(model.SalePersonId) == 0 || model.SalePersonId == "") {
            ShowNotification(3, "Sale Person Is Required.");
            return;
        }
        if (parseInt(model.DeliveryPersonId) == 0 || model.DeliveryPersonId == "") {
            ShowNotification(3, "Delivery Person Is Required.");
            return;
        }        
        if (parseInt(model.DriverPersonId) == 0 || model.DriverPersonId == "") {
            ShowNotification(3, "Driver Person Is Required.");
            return;
        }
        if (parseInt(model.RouteId) == 0 || model.RouteId == "") {
            ShowNotification(3, "Route Is Required.");
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

        if (hasInputFieldInTableCells($table)) {
            ShowNotification(3, "Complete Details Entry");
            return;
        };
        if (!hasLine($table)) {
            ShowNotification(3, "Complete Details Entry");
            return;
        };


        var details = serializeTable($table);

        var requiredFields = ['ProductName', 'UOMName', 'Quantity', 'UnitRate'];
        var fieldMappings = {
            'ProductName': 'Product Name',
            'UOMName': 'UOM Name',
            'Quantity': 'Quantity',
            'UnitRate': 'Unit Rate'
        };
        
        var errorMessage = getRequiredFieldsCheckObj(details, requiredFields, fieldMappings);
        if (errorMessage) {
            ShowNotification(3, errorMessage);
            return;
        };


        model.GrandTotalAmount = model.GrandTotalAmount.replace(/,/g, '');
        model.GrandTotalSDAmount = model.GrandTotalSDAmount.replace(/,/g, '');
        model.GrandTotalVATAmount = model.GrandTotalVATAmount.replace(/,/g, '');

        model.saleDeliveryReturnDetailList = details;

        var url = "/DMS/SaleDeliveryReturn/CreateEdit";

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

        var url = "/DMS/SaleDeliveryReturn/MultiplePost";

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
document.addEventListener("DOMContentLoaded", function () {
    var container = document.querySelector(".sslPrintC");
    if (container) {
        var id = container.getAttribute("data-id");
        if (id) {
            var btn = document.createElement("a");
            btn.href = ".";
            btn.style.backgroundColor = "skyblue";

            btn.style.marginLeft = "10px";
            btn.style.border = "none";
            /*btn.style.borderRadius = "10px"; */
            btn.className = "btn btn-success btn-sm mr-2 edit";
            btn.title = "Report Preview";
            btn.innerHTML = "<i class='fas fa-print'></i>";
            btn.onclick = function (e) {
                e.preventDefault();
                ReportPreview(id);
            };
            container.appendChild(btn);
        }
    }
});
function ReportPreview(id) {
    
    const form = document.createElement('form');
    form.method = 'post';
    form.action = '/DMS/SaleDeliveryReturn/ReportPreview';
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

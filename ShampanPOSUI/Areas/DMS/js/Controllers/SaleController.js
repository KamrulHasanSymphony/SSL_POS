var SaleController = function (CommonService, CommonAjaxService) {
    var getCustomerId = 0;
    var getSaleOrderId = 0;
    var getDeliveryPersonId = 0;
    var getDriverPersonId = 0;
    var getRouteId = 0;
    var getCurrencyId = 0;
    var decimalPlace = 0;

    var init = function () {

        getCustomerId = $("#CustomerId").val() || 0;
        getSaleOrderId = $("#SaleOrderId").val() || 0;
        getDeliveryPersonId = $("#DeliveryPersonId").val() || 0;
        getDriverPersonId = $("#DriverPersonId").val() || 0;
        getRouteId = $("#RouteId").val() || 0;
        getCurrencyId = $("#CurrencyId").val() || 0;

        if ($("#IsPosted").length) {
            LoadCombo("IsPosted", '/Common/Common/GetBooleanDropDown');
            $("#IsPosted").val('');
            GetBranchList();
        };

        decimalPlace = $("#DecimalPlace").val() || 2;
        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';

        if (parseInt(getId) == 0 && getOperation == '') {
            debugger;
            GetGridDataList();
        };

        GetCustomerComboBox();
        GetRouteComboBox();
        GetDeliveryComboBox();
        GetDriverComboBox();
        GetCurrencyComboBox();


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
                            var url = "/DMS/Sale/MultiplePost";
                            CommonAjaxService.multiplePost(url, model, postDone, fail);
                        }
                    }
                });
        });


        $("#btnFromPurchaseOrder").on("click", function () {
            debugger;
            var id = $("#Id").val();

            if (!id || id === "0") {
                ShowNotification(3, "Invalid Id!");
                return;
            }

            var form = $('<form>', {
                method: 'POST',
                action: '/DMS/Collection/GetFromSale'
            });

            // CommonVM.IDs
            form.append(
                $('<input>', {
                    type: 'hidden',
                    name: 'IDs',
                    value: id
                })
            );

            $('body').append(form);
            form.submit();
        });






        $('#details').on('click', "input.txt" + "ProductName", function () {
            
         
            var originalRow = $(this);
            CommonService.productCodeModal({}, fail, function (row) { productModalDblClick(row, originalRow) },
                function () {
                    originalRow.closest("td").find("input").data('touched', false);
                    originalRow.closest("td").find("input").focus();
                });
            $("#myModal1").modal("hide");
        });

        $('#details').on('click', 'input.txtUOMFromName', function () {
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
        $('#details').on('click', "input.txt" + "ProductGroupName", function () {
            var originalRow = $(this);
            CommonService.productGroupCodeModal({}, fail, function (row) { productGroupModalDblClick(row, originalRow) },
                function () {
                    originalRow.closest("td").find("input").data('touched', false);
                    originalRow.closest("td").find("input").focus();
                });
            $("#myModal1").modal("hide");
        });

        $(document).on('keyup change', '.td-Quantity, .td-SubTotal, .td-SDAmount, .td-VATAmount, .td-LineTotal', function () {
            TotalCalculation();
        });
        $(document).on('click', '.remove-row-btn', function () {
            $(this).closest('tr').remove();
            TotalCalculation();
        });


        $("#btnSearchPurchaseOrder").on("click", function () {
            $('#FromDate').val($('#InvoiceDateTime').val());

            poWindow.center().open();

            // Optional: reload grid every time window opens
            //$("#windowGrid").data("kendoGrid").dataSource.read();
        });


        $("#windowGrid").on("dblclick", "tbody tr", function () {

            var grid = $("#windowGrid").data("kendoGrid");
            var dataItem = grid.dataItem(this);

            if (!dataItem) return;
            debugger;
            var saleOrderId = dataItem.Id;
            debugger;
            $("#SaleOrderCode").val(dataItem.Code);
            $("#SaleOrderId").val(saleOrderId);

            // Close window
            $("#poWindow").data("kendoWindow").close();

            // Load detail table
            loadPurchaseOrderDetails(saleOrderId);
        });

        var poWindow = $("#poWindow").kendoWindow({
            title: "Sale Order",
            modal: true,
            width: "900px",
            height: "400px",
            visible: false,
            actions: ["Close"],
            close: function () {
                selectedGridModel = null;
            }
        }).data("kendoWindow");

        $("#windowGrid").kendoGrid({
            dataSource: {
                transport: {
                    read: {
                        url: "/Common/Common/GetSaleOrderList",
                        dataType: "json"
                    }
                },
                pageSize: 10
            },
            pageable: true,
            filterable: true,
            selectable: "row",
            toolbar: ["search"],
            columns: [
                { field: "Code", title: "PO Code" },
                { field: "CustomerName", title: "Customer" },
                { field: "OrderDate", title: "Order Date", format: "{0:dd-MMM-yyyy}" }
            ]
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
    function loadPurchaseOrderDetails(saleOrderId) {
        debugger;

        $.ajax({
            url: "/DMS/SaleOrder/GetSaleOrderList",
            type: "GET",
            data: { saleOrderId: saleOrderId },
            success: function (data) {

                console.log("PO DATA:", data);

                if (!data || data.length === 0) {
                    $("#lst").empty();
                    return;
                }

                // ================= MASTER (AS IT IS) =================
                var master = data[0];

                // Supplier autofill
                if (master.CustomerId !== undefined && master.CustomerId !== null) {
                    var customerCombo = $("#CustomerId").data("kendoComboBox")
                        || $("#CustomerId").data("kendoMultiColumnComboBox");

                    if (customerCombo) {
                        customerCombo.value(master.CustomerId);
                        customerCombo.trigger("change");
                    } else {
                        $("#SupplierId").val(master.SupplierId);
                    }
                }

                // Invoice Date autofill
                if (master.OrderDate) {
                    var date = new Date(master.OrderDate);
                    if (!isNaN(date.getTime())) {
                        $("#InvoiceDateTime").val(date.toISOString().slice(0, 10));
                    }
                }

                // ================= DETAILS =================
                $("#lst").empty();

                if (!master.saleOrderDetailsList || master.saleOrderDetailsList.length === 0)
                    return;

                // 🔹 ADD: totals variable
                let subTotal = 0;
                let totalSD = 0;
                let totalVAT = 0;
                let grandTotal = 0;

                var sl = 1;

                $.each(master.saleOrderDetailsList, function (index, item) {

                    // 🔹 ADD: accumulate totals from details
                    subTotal += parseFloat(item.SubTotal) || 0;
                    totalSD += parseFloat(item.SDAmount) || 0;
                    totalVAT += parseFloat(item.VATAmount) || 0;
                    grandTotal += parseFloat(item.LineTotal) || 0;

                    var row = `
                <tr>
                    <td>${sl}</td>
                    <td hidden>${item.ProductCode ?? ""}</td>
                    <td>${item.ProductName ?? ""}</td>
                    <td hidden>${item.ProductId ?? ""}</td>
                    <td class="dFormat">${item.Quantity ?? 0}</td>
                    <td class="dFormat">${item.UnitPrice ?? 0}</td>
                    <td class="dFormat">${item.SubTotal ?? 0}</td>
                    <td class="dFormat">${item.SD ?? 0}</td>
                    <td class="dFormat">${item.SDAmount ?? 0}</td>
                    <td class="dFormat">${item.VATRate ?? 0}</td>
                    <td class="dFormat">${item.VATAmount ?? 0}</td>
                    <td class="dFormat">${item.OthersAmount ?? 0}</td>
                    <td class="dFormat">${item.LineTotal ?? 0}</td>
                    <td hidden>${item.SaleOrderId ?? ""}</td>
                    <td hidden>${item.SaleOrderDetailId ?? ""}</td>
                    <td>
                        <button class="btn btn-danger btn-sm remove-row-btn">
                            <i class="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
                `;

                    $("#lst").append(row);
                    sl++;
                });

                // ================= MASTER TOTAL AUTOFILL =================
                const dp = parseInt(decimalPlace || 2);

                $("#SubTotal").val(subTotal.toLocaleString('en', { minimumFractionDigits: dp }));
                $("#TotalSD").val(totalSD.toLocaleString('en', { minimumFractionDigits: dp }));
                $("#TotalVAT").val(totalVAT.toLocaleString('en', { minimumFractionDigits: dp }));
                $("#GrandTotal").val(grandTotal.toLocaleString('en', { minimumFractionDigits: dp }));

                // PaidAmount (optional, if exists in master)
                if (master.PaidAmount !== undefined && master.PaidAmount !== null) {
                    $("#PaidAmount").val(
                        parseFloat(master.PaidAmount)
                            .toLocaleString('en', { minimumFractionDigits: dp })
                    );
                }
            },
            error: function () {
                alert("Failed to load purchase order details.");
            }
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

    //function GetSaleOrderComboBox() {
    //    debugger;
    //    var SalePersonComboBox = $("#SaleOrderId").kendoMultiColumnComboBox({
    //        dataTextField: "Code",
    //        dataValueField: "Id",
    //        height: 400,
    //        columns: [
    //            { field: "Code", title: "Code", width: 100 },
    //            { field: "CustomerName", title: "Customer Name", width: 150 },
    //        //    { field: "BanglaName", title: "BanglaName", width: 200 },
    //        ],
    //        filter: "contains",
    //        filterFields: ["Code", "CustomerName"],
    //        dataSource: {
    //            transport: {
    //                read: "/Common/Common/GetSaleOrderList"
    //            }
    //        },
    //        placeholder: "Select Person",
    //        value: "",
    //        dataBound: function (e) {
                
    //            if (getSaleOrderId) {
    //                this.value(parseInt(getSaleOrderId));
    //            }
    //        },
    //        change: function (e) {
                
    //        }
    //    }).data("kendoMultiColumnComboBox");
    //};



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
    function GetRouteComboBox() {
        var RouteComboBox = $("#RouteId").kendoMultiColumnComboBox({
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
                    read: "/Common/Common/GetRouteList"
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

        var qty = parseFloat(row.closest("tr").find("td.td-Quantity").text().replace(/,/g, '')) || 1;
        var unitCost = parseFloat(row.closest("tr").find("td.td-UnitRate").text().replace(/,/g, '')) || 0;

        var SDRate = parseFloat(row.closest("tr").find("td.td-SD").text().replace(/,/g, '')) || 0;
        var SDAmount = parseFloat(row.closest("tr").find("td.td-SDAmount").text().replace(/,/g, '')) || 0;

        var VATRate = parseFloat(row.closest("tr").find("td.td-VATRate").text().replace(/,/g, '')) || 0;
        var VATAmount = parseFloat(row.closest("tr").find("td.td-VATAmount").text().replace(/,/g, '')) || 0;

        
        if (!isNaN(qty * unitCost)) {
            var SubTotal = Number(parseFloat(qty * unitCost).toFixed(parseInt(decimalPlace)));
            row.closest("tr").find("td.td-SubTotal").text(SubTotal.toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));


            if (param == 'VATRate') {
                var VATAmount = Number(parseFloat(((qty * unitCost) * VATRate) / 100).toFixed(parseInt(decimalPlace)));
                row.closest("tr").find("td.td-VATAmount").text(VATAmount.toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));
            }
            else if (param == 'VATAmount') {
                var VATRate = Number(parseFloat((VATAmount * 100) / (qty * unitCost)).toFixed(parseInt(decimalPlace)));
                row.closest("tr").find("td.td-VATRate").text(VATRate.toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));
            }
            else if (param == 'SDRate') {
                var SDAmount = Number(parseFloat(((qty * unitCost) * SDRate) / 100).toFixed(parseInt(decimalPlace)));
                row.closest("tr").find("td.td-SDAmount").text(SDAmount.toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));
            }
            else if (param == 'SDAmount') {
                var SDRate = Number(parseFloat((SDAmount * 100) / (qty * unitCost)).toFixed(parseInt(decimalPlace)));
                row.closest("tr").find("td.td-SD").text(SDRate.toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));
            }
            else {
                var SDAmount = Number(parseFloat(((qty * unitCost) * SDRate) / 100).toFixed(parseInt(decimalPlace)));
                if (isNaN(SDAmount)) {
                    SDAmount = 0.00;
                }
                row.closest("tr").find("td.td-SDAmount").text(SDAmount.toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));
                var SDRate = Number(parseFloat((SDAmount * 100) / (qty * unitCost)).toFixed(parseInt(decimalPlace)));
                if (isNaN(SDRate)) {
                    SDRate = 0.00;
                }
                row.closest("tr").find("td.td-SD").text(SDRate.toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));

                //////////////////////////////////////////////////////////////////
                var VATAmount = Number(parseFloat(((qty * unitCost) * VATRate) / 100).toFixed(parseInt(decimalPlace)));
                if (isNaN(VATAmount)) {
                    VATAmount = 0.00;
                }
                row.closest("tr").find("td.td-VATAmount").text(VATAmount.toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));
                var VATRate = Number(parseFloat((VATAmount * 100) / (qty * unitCost)).toFixed(parseInt(decimalPlace)));
                if (isNaN(VATRate)) {
                    VATRate = 0.00;
                }
                row.closest("tr").find("td.td-VATRate").text(VATRate.toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));
            }

            var LineTotal = Number(parseFloat((qty * unitCost) + parseFloat(SDAmount) + parseFloat(VATAmount)).toFixed(parseInt(decimalPlace)));
            row.closest("tr").find("td.td-LineTotal").text(LineTotal.toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));

            TotalCalculation();
        }
    };

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

    function productModalDblClick(row, originalRow) {
        
        var dataTable = $("#modalData").DataTable();
        var rowData = dataTable.row(row).data();

        var ProductId = rowData.ProductId;
        var ProductName = rowData.ProductName;
        var UOMId = rowData.UOMId;
        var UOMName = rowData.UOMName;
        debugger;
        originalRow.closest("td").find("input").val(ProductName);
        originalRow.closest('td').next().text(ProductId);
        originalRow.closest('td').next().next().text(UOMId);
        originalRow.closest('td').next().next().next().text(UOMName);
        $("#UOMId").val(UOMId);

        $("#partialModal").modal("hide");
        originalRow.closest("td").find("input").data("touched", false);
        originalRow.closest("td").find("input").focus();
        $("#myModal1").modal("show");
    };

    function uomFromNameModalDblClick(row, originalRow) {
        
        var dataTable = $("#modalData").DataTable();
        var rowData = dataTable.row(row).data();

        var UOMFromId = rowData.UOMFromId;
        var UOMFromName = rowData.UOMFromName;
        var UOMConversion = rowData.UOMConversion;

        originalRow.closest("td").find("input").val(UOMFromName);
        originalRow.closest('td').next().text(UOMFromId);
        originalRow.closest('td').next().next().text(UOMConversion);

        $("#UOMId").val(UOMId);
        $("#partialModal").modal("hide");
        originalRow.closest("td").find("input").data("touched", false).focus();
    };


    var GetGridDataList = function () {
        debugger;
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
                    url: "/DMS/Sale/GetGridData",
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
                                param.field = "cus.Name";
                            }
                            if (param.field === "DeliveryAddress") {
                                param.field = "H.DeliveryAddress";
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
                            if (param.field === "InvoiceDateTime" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "H.InvoiceDateTime";
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
                            if (param.field === "InvoiceDateTime" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "H.InvoiceDateTime";
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
                    GrdTotalAmount: { type: "number" },
                    GrdTotalSDAmount: { type: "number" },
                    GrdTotalVATAmount: { type: "number" }
                }
            }
            ,
            //aggregate: [
            //    { field: "GrdTotalAmount", aggregate: "sum" },
            //    { field: "GrdTotalSDAmount", aggregate: "sum" },
            //    { field: "GrdTotalVATAmount", aggregate: "sum" }
            //]
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
                fields: ["Id", "Code", "Status", "CustomerName", "InvoiceDateTime"]
            },

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
                        { field: "Quantity", title: "Quantity", sortable: true, width: 100, aggregates: ["sum"], format: "{0:n2}", footerTemplate: "#= kendo.toString(sum, 'n2') #", attributes: { style: "text-align: right;" } },
                        { field: "UnitRate", title: "Unit Rate", sortable: true, width: 100, aggregates: ["sum"], format: "{0:n2}", footerTemplate: "#= kendo.toString(sum, 'n2') #", attributes: { style: "text-align: right;" } },
                        { field: "SubTotal", title: "Sub Total", sortable: true, width: 100, aggregates: ["sum"], format: "{0:n2}", footerTemplate: "#= kendo.toString(sum, 'n2') #", attributes: { style: "text-align: right;" } },
                        { field: "SD", title: "SD Rate", sortable: true, width: 100, footerTemplate: "#= kendo.toString(sum, 'n2') #", aggregates: ["sum"], format: "{0:n2}", attributes: { style: "text-align: right;" } },
                        { field: "SDAmount", title: "SD Amount", sortable: true, width: 100, footerTemplate: "#= kendo.toString(sum, 'n2') #", aggregates: ["sum"], format: "{0:n2}", attributes: { style: "text-align: right;" } },
                        { field: "VATRate", title: "VAT Rate", sortable: true, width: 100, footerTemplate: "#= kendo.toString(sum, 'n2') #", aggregates: ["sum"], format: "{0:n2}", attributes: { style: "text-align: right;" } },
                        { field: "VATAmount", title: "VAT Amount", sortable: true, width: 100, footerTemplate: "#= kendo.toString(sum, 'n2') #", aggregates: ["sum"], format: "{0:n2}", attributes: { style: "text-align: right;" } },
                 
                        { field: "LineTotal", title: "Line Total", sortable: true, width: 100, footerTemplate: "#= kendo.toString(sum, 'n2') #", aggregates: ["sum"], format: "{0:n2}", attributes: { style: "text-align: right;" } },
                        { field: "CompanyId", hidden: true, title: "Vat Type", sortable: true, width: 100 }
                    ],
                    footerTemplate: function (e) {
                        var aggregates = e.sender.dataSource.aggregates();
                        return `
                            <div style="font-weight: bold; text-align: right;">
                                Total:
                                <span>${kendo.toString(aggregates.Quantity.sum, 'n2')}</span>
                                <span>${kendo.toString(aggregates.UnitRate.sum, 'n2')}</span>
                                <span>${kendo.toString(aggregates.SubTotal.sum, 'n2')}</span>
                                <span>${kendo.toString(aggregates.SD.sum, 'n2')}</span>
                                <span>${kendo.toString(aggregates.SDAmount.sum, 'n2')}</span>
                                <span>${kendo.toString(aggregates.VATRate.sum, 'n2')}</span>
                                <span>${kendo.toString(aggregates.VATAmount.sum, 'n2')}</span>
                                <span>${kendo.toString(aggregates.LineTotal.sum, 'n2')}</span>
                            </div>`;
                    }
                });
            },
            





            excel: {
                fileName: "SaleList.xlsx",
                filterable: true
            },
            pdf: {
                fileName: `SaleList_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`,
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


                var fileName = `SaleList_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`;

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
                    selectable: true, width: 70
                },
                {
                    title: "Action",
                    width: 90,
                    template: function (dataItem) {
                        
                        return `
                                <a href="/DMS/Sale/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                                    <i class="fas fa-pencil-alt"></i>
                                </a>`+
                            "<a style='background-color: darkgreen;' href='#' onclick='ReportPreview(" + dataItem.Id + ")' class='btn btn-success btn-sm mr-2 edit ' title='Report Preview'><i class='fas fa-print'></i></a>";
                    }
                },
                { field: "Id", width: 50, hidden: true, sortable: true },
                { field: "Code", title: "Code", width: 180, sortable: true },
                { field: "CustomerName", title: "Customer Name", sortable: true, width: 200 },
                {
                    field: "InvoiceDateTime", title: "Invoice DateTime", sortable: true, width: 150, template: '#= kendo.toString(kendo.parseDate(InvoiceDateTime), "yyyy-MM-dd") #',
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
                { field: "DeliveryAddress", title: "Delivery Address", sortable: true, hidden: true, width: 250 },
                { field: "Comments", title: "Comments", sortable: true, width: 250 },
                { field: "BranchName", title: "Branch Name", sortable: true, hidden: true, width: 200 },
                { field: "CompanyName", title: "Company Name ", sortable: true, hidden: true, width: 200 }


            ],
            editable: false,
            selectable: "multiple row",
            navigatable: true,
            columnMenu: true
        });

    };

    function save($table) {
        debugger;
        var validator = $("#frmEntry").validate();
        var model = serializeInputs("frmEntry");
        var saleorderId = $("#SaleOrderId").val();
        model.SaleOrderId = saleorderId;
        var result = validator.form();

        if (!result) {
            validator.focusInvalid();
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
        //
        //var customer = $("#CustomerId").val();
        //var salePerson = $("#SalePersonId").val();
        //var deliveryPerson = $("#DeliveryPersonId").val();
        //var driverPerson = $("#DriverPersonId").val();
        //var route = $("#RouteId").val();

        var details = serializeTable($table);

        var requiredFields = ['ProductGroupName', 'ProductName', 'Quantity', 'UnitRate', 'SubTotal'];
        var fieldMappings = {
            'ProductGroupName': 'Product Group Name',
            'ProductName': 'Product Name',
            //'UOMName': 'UOM Name',
            'Quantity': 'Quantity',
            'UnitRate': 'Unit Rate',
            'SubTotal': 'SubTotal'
        };

        var errorMessage = getRequiredFieldsCheckObj(details, requiredFields, fieldMappings);
        if (errorMessage) {
            ShowNotification(3, errorMessage);
            return;
        };


        //model.GrandTotalAmount = model.GrandTotalAmount.replace(',', '').replace(',', '').replace(',', '');
        //model.GrandTotalSDAmount = model.GrandTotalSDAmount.replace(',', '').replace(',', '').replace(',', '');
        //model.GrandTotalVATAmount = model.GrandTotalVATAmount.replace(',', '').replace(',', '').replace(',', '');

        model.saleDetailsList = details;

        var url = "/DMS/Sale/CreateEdit";

        CommonAjaxService.finalSave(url, model, saveDone, saveFail);
    };

    function saveDone(result) {
        debugger;
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

        var url = "/DMS/Sale/MultiplePost";

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

    return {
        init: init
    }

}(CommonService, CommonAjaxService);

function ReportPreview(id) {
    
    const form = document.createElement('form');
    form.method = 'post';
    form.action = '/DMS/Sale/ReportPreview';
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


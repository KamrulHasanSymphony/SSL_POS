var PurchaseController = function (CommonService, CommonAjaxService) {

    var getSupplierId = 0;
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


        $(document).ready(function () {

            function normalize(date) {
                if (!date) return null;
                return new Date(date.getFullYear(), date.getMonth(), date.getDate());
            }

            var invoicePicker = $(".kendoInvoiceDateTime").kendoDateTimePicker({
                format: "yyyy-MM-dd HH:mm",
                change: validateDates,
                close: validateDates
            }).data("kendoDateTimePicker");


            var purchasePicker = $(".kendoPurchaseDate").kendoDatePicker({
                format: "yyyy-MM-dd",
                change: validateDates,
                close: validateDates
            }).data("kendoDatePicker");


            function validateDates() {

                var invoiceRaw = invoicePicker.value();
                var purchaseRaw = purchasePicker.value();

                var invoiceDate = normalize(invoiceRaw);
                var purchaseDate = normalize(purchaseRaw);

                // ✅ set min/max relation
                if (invoiceRaw) {
                    purchasePicker.min(invoiceRaw);
                }

                if (purchaseRaw) {
                    invoicePicker.max(purchaseRaw);
                }

                // ❌ Purchase আগে হলে
                if (invoiceDate && purchaseDate && purchaseDate < invoiceDate) {

                    purchasePicker.value(invoiceRaw);

                    ShowNotification(3, "Purchase date cannot be before Invoice date");
                    return;
                }

                // ❌ Invoice পরে হলে
                if (invoiceDate && purchaseDate && invoiceDate > purchaseDate) {

                    invoicePicker.value(purchaseRaw);

                    ShowNotification(3, "Invoice date cannot be after Purchase date");
                    return;
                }
            }

        });




        getSupplierId = $("#SupplierId").val() || 0;
        decimalPlace = $("#DecimalPlace").val() || 2;
        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';

        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();
        };

        if (getOperation !== '') {
            GetSupplierComboBox();

            setTimeout(function () {
                updateSaleSummary();   // ✅ CORRECT
            }, 300);
        };




        $(document).on("keyup change", "#PaidAmount", function () {
            DueCalculation();
        });


        $("#saleOrderDetails").on("click", "td.product-cell", function () {
            var grid = $("#saleOrderDetails").data("kendoGrid");
            var dataItem = grid.dataItem($(this).closest("tr"));
            OpenProductPopup(dataItem);
        });


        $('.btnsave').click(function (e) {
            debugger;
            e.preventDefault();

            var form = $("#frmEntry");
            //var $table = $('#details');

            var mvcValid = form.valid();
            var customValid = CommonValidationHelper.CheckValidation("#frmEntry");

            if (!mvcValid || !customValid) {
                return false;
            }

            var model = serializeInputs("frmEntry");

            if (parseInt(model.SupplierId) == 0 || model.SupplierId == "") {
                ShowNotification(3, "Supplier Is Required.");
                return;
            }

            //if (!hasLine($table)) {
            //    ShowNotification(3, "Complete Details Entry");
            //    return;
            //}

            //var details = serializeTable($table);


            var details = [];

            var grid = $("#saleOrderDetails").data("kendoGrid");
            if (grid) {
                var dataItems = grid.dataSource.view(); // Get the items from the grid

                // Iterate through grid data and validate the rows
                for (var i = 0; i < dataItems.length; i++) {
                    var item = dataItems[i];

                    var finalProductId = 0;

                    if (item.ProductId && item.ProductId > 0) {
                        finalProductId = item.ProductId;
                    } else if (item.ItemId && item.ItemId > 0) {
                        finalProductId = item.ItemId;
                    }

                    // Validate ProductId
                    if (finalProductId <= 0) {
                        ShowNotification(3, "Item is required in sale details.");
                        return;
                    }

                    // Validate Quantity
                    if (!item.Quantity || item.Quantity < 0) {
                        ShowNotification(3, "Quantity must be greater than zero.");
                        return;
                    }

                    // Push the valid data to the details array
                    details.push({
                        Id: item.Id,
                        ProductId: finalProductId,
                        ProductName: item.ProductName || item.ItemName,
                        UOMId: item.UOMId,
                        UOMName: item.UOMName,
                        Quantity: item.Quantity,
                        UnitPrice: item.UnitPrice,
                        SubTotal: item.SubTotal,
                        VATAmount: item.VATAmount,
                        SDAmount: item.SDAmount,
                        VATRate: item.VATRate,
                        SD: item.SD,
                        LineTotal: item.LineTotal,
                        OthersAmount: item.OthersAmount,
                        Action: item.Action
                    });
                }
            }


            if (details.length === 0) {
                ShowNotification(3, "Complete Details first!");
                return;
            }

            var requiredFields = ['ProductName', 'Quantity', 'UnitPrice'];
            var fieldMappings = {
                'ProductName': 'Product Name',
                'Quantity': 'Quantity',
                'UnitPrice': 'Unit Price'
            };

            var errorMessage = getRequiredFieldsCheckObj(details, requiredFields, fieldMappings);
            if (errorMessage) {
                ShowNotification(3, errorMessage);
                return;
            };

            var getId = $('#Id').val();
            var status = "Save";
            if (parseInt(getId) > 0) {
                status = "Update";
            }
            Confirmation("Are you sure? Do You Want to " + status + " Data?",
                function (result) {
                    if (result) {
                        save();
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
                            var url = "/DMS/Purchase/MultiplePost";
                            CommonAjaxService.multiplePost(url, model, processDone, fail);
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
                action: '/DMS/Payment/GetFromPurchase'
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
            CommonService.productForPurchaseModal({}, fail, function (row) { productModalDblClick(row, originalRow) },
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
            debugger;
            $('#FromDate').val($('#PurchaseDate').val());

            poWindow.center().open();

        });


        $("#windowGrid").on("dblclick", "tbody tr", function () {
            debugger;
            var grid = $("#windowGrid").data("kendoGrid");
            var dataItem = grid.dataItem(this);

            if (!dataItem) return;

            var purchaseOrderId = dataItem.Id;
            debugger;
            $("#PurchaseOrderCode").val(dataItem.Code);
            $("#PurchaseOrderId").val(purchaseOrderId);

            // Close window
            $("#poWindow").data("kendoWindow").close();

            // Load detail table
            loadPurchaseOrderDetails(purchaseOrderId);
        });



        var poWindow = $("#poWindow").kendoWindow({
            
            title: "Purchase Order",
            modal: true,
            width: "900px",
            height: "450px",
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
                        url: "/Common/Common/GetPurchaseOrderList",
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
                { field: "SupplierName", title: "Supplier" },
                { field: "OrderDate", title: "Order Date", format: "{0:dd-MMM-yyyy}" }
            ]
        });


        function loadPurchaseOrderDetails(purchaseOrderId) {

            $.ajax({
                url: "/DMS/PurchaseOrder/GetPurchaseOrderList",
                type: "GET",
                data: { purchaseOrderId: purchaseOrderId },

                success: function (data) {

                    if (!data || data.length === 0) {
                        updateSaleSummary();
                        return;
                    }

                    /* ================= MASTER ================= */
                    var master = data[0];

                    // Supplier autofill
                    if (master.SupplierId) {
                        var supplierCombo =
                            $("#SupplierId").data("kendoMultiColumnComboBox") ||
                            $("#SupplierId").data("kendoComboBox");

                        if (supplierCombo) {
                            supplierCombo.value(master.SupplierId);
                            supplierCombo.trigger("change");
                        }
                    }

                    // Invoice Date
                    if (master.OrderDate) {
                        var date = new Date(master.OrderDate);
                        if (!isNaN(date.getTime())) {
                            $("#InvoiceDateTime").val(date.toISOString().slice(0, 10));
                        }
                    }

                    /* ================= DETAILS ================= */

                    var grid = $("#saleOrderDetails").data("kendoGrid");

                    // 🔥 clear previous data
                    //grid.dataSource.data([]);

                    if (!master.purchaseOrderDetailsList || master.purchaseOrderDetailsList.length === 0) {
                        updateSaleSummary();
                        return;
                    }

                    master.purchaseOrderDetailsList.forEach(function (item) {

                        // Duplicate check
                        var exists = grid.dataSource.data().some(function (g) {
                            return g.ProductId === item.ProductId;
                        });

                        if (!exists) {

                            grid.dataSource.add({
                                Id: item.Id,
                                ProductId: item.ProductId,
                                ProductName: item.ProductName,

                                Quantity: item.Quantity,
                                UnitPrice: item.UnitPrice,

                                SubTotal: item.SubTotal,
                                SDAmount: item.SDAmount,
                                VATAmount: item.VATAmount,

                                VATRate: item.VATRate,
                                SD: item.SD,

                                OthersAmount: item.OthersAmount || 0,
                                LineTotal: item.LineTotal
                            });

                        }
                    });

                    updateSaleSummary();
                },

                error: function () {
                    alert("Failed to load purchase order details.");
                }
            });
        }
        // =======================
        // LOAD DETAILS FROM JSON
        // =======================
        var detailsList = JSON.parse($("#SaleOrderDetailsJson").val() || "[]");

        var detailsGridDataSource = new kendo.data.DataSource({
            data: detailsList,
            schema: {
                model: {
                    id: "Id",
                    fields: {
                        Id: { type: "number", defaultValue: 0 },
                        ProductId: { type: "number", defaultValue: null },
                        ProductName: { type: "string", defaultValue: "" },
                        Quantity: { type: "number", defaultValue: 0 },
                        UnitPrice: { type: "number", defaultValue: 0 },
                        SubTotal: { type: "number", defaultValue: 0 },
                        SDAmount: { type: "number", defaultValue: 0 },
                        VATAmount: { type: "number", defaultValue: 0 },
                        LineTotal: { type: "number", defaultValue: 0 },
                        VATRate: { type: "number", defaultValue: 0 },
                        SD: { type: "number", defaultValue: 0 },
                        OthersAmount: { type: "number", defaultValue: 0 }
                    }
                }
            },
            aggregate: [
                { field: "Quantity", aggregate: "sum" },
                { field: "SubTotal", aggregate: "sum" },
                { field: "SDAmount", aggregate: "sum" },
                { field: "VATAmount", aggregate: "sum" },
                { field: "LineTotal", aggregate: "sum" },
                { field: "OthersAmount", aggregate: "sum" }
            ]
        });

        // Initialize the grid
        $("#saleOrderDetails").kendoGrid({
            dataSource: detailsGridDataSource,
            toolbar: [{ name: "create", text: "Add" }],
            editable: {
                mode: "incell",
                createAt: "bottom"
            },
            columns: [
                {
                    title: "Sl No",
                    width: 60,
                    template: function (dataItem) {
                        var grid = $("#saleOrderDetails").data("kendoGrid");
                        return grid.dataSource.indexOf(dataItem) + 1;
                    }
                },
                {
                    field: "ProductName",
                    title: "Product Name",
                    editor: itemSelectorEditor,
                    template: function (dataItem) {
                        return dataItem.ProductName || "";
                    },
                    footerTemplate: "Total:",
                    width: 160
                },
                {
                    field: "Quantity",
                    title: "Quantity",
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                    footerTemplate: "#= kendo.toString(sum || 0, 'n2') #",
                    aggregate: "sum",
                    width: 120,
                    editor: function (container, options) {
                        var input = $('<input name="' + options.field + '"/>');
                        input.appendTo(container).kendoNumericTextBox({
                            format: "n2",
                            decimals: 2,
                            change: function () {
                                var grid = $("#saleOrderDetails").data("kendoGrid");

                                // Update the model value for Quantity
                                options.model.set("Quantity", this.value());

                                // Recalculate SubTotal, SDAmount, VATAmount, LineTotal for this row
                                var subTotal = options.model.Quantity * options.model.UnitPrice;
                                options.model.set("SubTotal", subTotal);

                                var sdAmount = (subTotal * (options.model.SD || 0)) / 100;
                                options.model.set("SDAmount", sdAmount);

                                var vatAmount = ((subTotal + sdAmount) * (options.model.VATRate || 0)) / 100;
                                options.model.set("VATAmount", vatAmount);

                                var lineTotal = subTotal + sdAmount + vatAmount;

                                var withother = lineTotal + options.model.OthersAmount;

                                options.model.set("LineTotal", withother);

                                //options.model.set("LineTotal", lineTotal);

                                // Refresh the grid to update footer aggregates
                                grid.refresh();
                            }
                        });
                    }
                },
                {
                    field: "UnitPrice",
                    title: "Unit Rate",
                    width: 100,
                    attributes: { style: "text-align:right;" },
                    editor: function (container, options) {
                        var input = $('<input name="' + options.field + '"/>');
                        input.appendTo(container).kendoNumericTextBox({
                            format: "n2",
                            decimals: 2,
                            readonly: true // Make UnitRate non-editable if you don't want users to change it
                        });
                    }
                },
                {
                    field: "SubTotal",
                    title: "Sub Total",
                    width: 100,
                    editable: false,
                    attributes: { style: "text-align:right;" },
                    footerTemplate: "<b>#= kendo.toString(sum, 'n2') #</b>"
                },
                {
                    field: "SD",
                    title: "SD Rate",
                    width: 60,
                    attributes: { style: "text-align:right;" },
                    editor: function (container, options) {

                        var input = $('<input name="' + options.field + '"/>');

                        input.appendTo(container).kendoNumericTextBox({
                            format: "n2",
                            decimals: 2,
                            min: 0,
                            max: 100,
                            change: function () {

                                var value = this.value() || 0;

                                // ✅ LIMIT CONTROL
                                if (value > 100) {
                                    value = 100;
                                    this.value(100);
                                    ShowNotification(3, "SD Rate cannot exceed 100%");
                                }

                                // ✅ MODEL UPDATE (VERY IMPORTANT)
                                options.model.set("SD", value);

                                var grid = $("#saleOrderDetails").data("kendoGrid");

                                var subTotal = options.model.SubTotal || 0;
                                var other = options.model.OthersAmount || 0;
                                var vatRate = options.model.VATRate || 0;

                                var sdAmount = (subTotal * value) / 100;
                                options.model.set("SDAmount", sdAmount);

                                var vatAmount = ((subTotal + sdAmount) * vatRate) / 100;
                                options.model.set("VATAmount", vatAmount);

                                var lineTotal = subTotal + sdAmount + vatAmount + other;

                                options.model.set("LineTotal", lineTotal);

                                grid.refresh();
                            }
                        });
                    }
                },
                {
                    field: "SDAmount",
                    title: "SD Amount",
                    width: 100,
                    editable: false,
                    attributes: { style: "text-align:right;" },
                    footerTemplate: "<b>#= kendo.toString(sum, 'n2') #</b>"
                },
                {
                    field: "VATRate",
                    title: "VAT Rate",
                    width: 60,
                    attributes: { style: "text-align:right;" },
                    editor: function (container, options) {

                        var input = $('<input name="' + options.field + '"/>');

                        input.appendTo(container).kendoNumericTextBox({
                            format: "n2",
                            decimals: 2,
                            min: 0,
                            max: 100,
                            change: function () {

                                var value = this.value() || 0;

                                // ✅ LIMIT CONTROL
                                if (value > 100) {
                                    value = 100;
                                    this.value(100);
                                    ShowNotification(3, "VAT Rate cannot exceed 100%");
                                }

                                // ✅ MODEL UPDATE
                                options.model.set("VATRate", value);

                                var grid = $("#saleOrderDetails").data("kendoGrid");

                                var subTotal = options.model.SubTotal || 0;
                                var sdRate = options.model.SD || 0;
                                var other = options.model.OthersAmount || 0;

                                var sdAmount = (subTotal * sdRate) / 100;

                                var vatAmount = ((subTotal + sdAmount) * value) / 100;
                                options.model.set("VATAmount", vatAmount);

                                var lineTotal = subTotal + sdAmount + vatAmount + other;

                                options.model.set("LineTotal", lineTotal);

                                grid.refresh();
                            }
                        });
                    }
                },
                {
                    field: "VATAmount",
                    title: "VAT Amount",
                    width: 100,
                    editable: false,
                    attributes: { style: "text-align:right;" },
                    footerTemplate: "<b>#= kendo.toString(sum, 'n2') #</b>"
                },
                {
                    field: "OthersAmount",
                    title: "Others Amount",
                    width: 100,
                    // ❌ editable: true  → REMOVE THIS LINE
                    attributes: { style: "text-align:right;" },

                    editor: function (container, options) {
                        var input = $('<input name="' + options.field + '"/>');

                        input.appendTo(container).kendoNumericTextBox({
                            format: "n2",
                            decimals: 2,
                            change: function () {

                                var grid = $("#saleOrderDetails").data("kendoGrid");

                                // value set
                                options.model.set("OthersAmount", this.value());

                                // recalculation
                                var subTotal = options.model.Quantity * options.model.UnitPrice;
                                options.model.set("SubTotal", subTotal);

                                var sdAmount = (subTotal * (options.model.SD || 0)) / 100;
                                options.model.set("SDAmount", sdAmount);

                                var vatAmount = ((subTotal + sdAmount) * (options.model.VATRate || 0)) / 100;
                                options.model.set("VATAmount", vatAmount);

                                var lineTotal = subTotal + sdAmount + vatAmount;

                                var withother = lineTotal + (options.model.OthersAmount || 0);
                                options.model.set("LineTotal", withother);

                                grid.refresh();

                                // 🔥 MAIN FIX
                                updateSaleSummary();
                            }
                        });
                    },

                    footerTemplate: "<b>#= kendo.toString(sum, 'n2') #</b>"
                },
                {
                    field: "LineTotal",
                    title: "Total",
                    width: 100,
                    editable: false,
                    attributes: { style: "text-align:right;" },
                    footerTemplate: "<b>#= kendo.toString(sum, 'n2') #</b>"
                },
                {
                    command: [{
                        name: "destroy",
                        iconClass: "k-icon k-i-trash",
                        text: ""
                    }],
                    title: "Action",
                    width: 35
                }

            ],
            change: function () {
                var grid = this;
                // Recalculate and update the footer aggregation after any change in the grid data
                updateSaleSummary();
            }
        });


        $('#details').on('blur', ".td-Quantity", function (event) {
            computeSubTotal($(this), '');
        });

        $('#details').on('blur', ".td-UnitPrice", function (event) {
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

        $('#details').on('blur', ".td-OthersAmount", function (event) {
            computeSubTotal($(this), 'OthersAmount');
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
                window.location.href = "/DMS/Purchase/NextPrevious?id=" + getId + "&status=Previous";
            }
        });

        $('#btnNext').click('click', function () {
            var getId = $('#Id').val();
            if (parseInt(getId) > 0) {
                window.location.href = "/DMS/Purchase/NextPrevious?id=" + getId + "&status=Next";
            }
        });


        // Kendo Window Initialization
        var myWindow = $("#window");

        if (myWindow.length > 0) {
            function onClose() {
                myWindow.fadeIn();
            };

            myWindow.kendoWindow({
                width: "1000px",
                title: "Purchase Order Form",
                visible: false,
                actions: ["Pin", "Minimize", "Maximize", "Close"],
                close: onClose
            }).data("kendoWindow").center();
        };


        $(document).on('click', '.details-link', function () {
            var id = $(this).data('id');
            detailsData(id);
        });


        $("#download").on("click", function () {

            var BranchId = $("#Branchs").data("kendoComboBox").value();
            var IsPosted = $('#IsPosted').val();
            var FromDate = $('#FromDate').val();
            var ToDate = $('#ToDate').val();

            var params = new URLSearchParams({
                branchId: BranchId,
                isPosted: IsPosted,
                fromDate: FromDate,
                toDate: ToDate
            }).toString();

            var url = "/DMS/Purchase/ExportPurchaseExcel";

            window.open(url + "?" + params, "_blank");

        });

    };


    function detailsData(id) {

        $.ajax({
            url: "/DMS/PurchaseOrder/GetPurchaseOrderData?id=" + id,
            type: 'GET',
            success: function (data) {
                $("#PurchaseOrderCode").val(data.Code);
                $("#PurchaseOrderDeliveryDate").val(data.DeliveryDateTime);
                $("#PurchaseOrderDate").val(data.OrderDate);
                $("#PurchaseOrderSupplierName").val(data.SupplierName);
                $("#PurchaseOrderCurrencyName").val(data.CurrencyName);
                $("#PurchaseOrderBENumber").val(data.BENumber);
                $("#PurchaseOrderImportIDExcel").val(data.ImportIDExcel);
                $("#PurchaseOrderComments").val(data.Comments);


                var detailsTable = $("#purchaseOrderDetails tbody");
                detailsTable.empty();

                var grandTotalAmount = 0;
                var grandSubTotal = 0;
                var grandTotalSDAmount = 0;
                var grandTotalVATAmount = 0;
                var grandTotal = 0;

                $.each(data.purchaseOrderDetailsList, function (index, detail) {
                    var row = $("<tr>");
                    row.append("<td>" + detail.Line + "</td>");
                    row.append("<td>" + detail.ProductName + "</td>");
                    row.append("<td>" + detail.UOMName + "</td>");
                    row.append("<td class='dFormat'>" + detail.UnitPrice.toLocaleString('en', { minimumFractionDigits: 2 }) + "</td>");
                    row.append("<td class='dFormat'>" + detail.Quantity.toLocaleString('en', { minimumFractionDigits: 2 }) + "</td>");
                    row.append("<td class='dFormat'>" + detail.SubTotal.toLocaleString('en', { minimumFractionDigits: 2 }) + "</td>");
                    row.append("<td class='dFormat'>" + detail.SD.toLocaleString('en', { minimumFractionDigits: 2 }) + "</td>");
                    row.append("<td class='dFormat'>" + detail.SDAmount.toLocaleString('en', { minimumFractionDigits: 2 }) + "</td>");
                    row.append("<td class='dFormat'>" + detail.VATRate.toLocaleString('en', { minimumFractionDigits: 2 }) + "</td>");
                    row.append("<td class='dFormat'>" + detail.VATAmount.toLocaleString('en', { minimumFractionDigits: 2 }) + "</td>");
                    row.append("<td class='dFormat'>" + detail.OthersAmount.toLocaleString('en', { minimumFractionDigits: 2 }) + "</td>");
                    row.append("<td class='dFormat'>" + detail.LineTotal.toLocaleString('en', { minimumFractionDigits: 2 }) + "</td>");
                    row.append("<td>" + detail.Comments + "</td>");

                    grandTotalAmount += parseFloat(detail.Quantity);
                    grandSubTotal += parseFloat(detail.SubTotal);
                    grandTotalSDAmount += parseFloat(detail.SDAmount);
                    grandTotalVATAmount += parseFloat(detail.VATAmount);
                    grandTotal += parseFloat(detail.LineTotal);

                    detailsTable.append(row);
                });


                $("#PurchaseOrderGrandTotalAmount").val(grandTotalAmount.toLocaleString('en', { minimumFractionDigits: 2 }));
                $("#PurchaseOrderGrandSubTotal").val(grandSubTotal.toLocaleString('en', { minimumFractionDigits: 2 }));
                $("#PurchaseOrderGrandTotalSDAmount").val(grandTotalSDAmount.toLocaleString('en', { minimumFractionDigits: 2 }));
                $("#PurchaseOrderGrandTotalVATAmount").val(grandTotalVATAmount.toLocaleString('en', { minimumFractionDigits: 2 }));
                $("#PurchaseOrderGrandTotal").val(grandTotal.toLocaleString('en', { minimumFractionDigits: 2 }));

                $("#window").data("kendoWindow").open();
            },
            error: function (xhr, status, error) {
                alert("Error loading purchase Order data.");
            }
        });
    };


    function itemSelectorEditor(container, options) {
        var wrapper = $('<div class="input-group input-group-sm full-width">').appendTo(container);

        // Create input (you can bind value if needed)
        $('<input type="text" class="form-control" readonly />')
            .attr("data-bind", "value:ProductName")
            .appendTo(wrapper);

        // Create button inside an addon span
        $('<div class="input-group-append">')
            .append(
                $('<button class="btn btn-outline-secondary" type="button">')
                    .append('<i class="fa fa-search"></i>')
                    .on("click", function () {

                        OpenProductPopup(options.model); //eta banate hobe
                    })
            )
            .appendTo(wrapper);

        kendo.bind(container, options.model);
    }


    function GetBranchList() {
        var branch = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/Common/Common/GetBranchList?value=",
                    dataType: "json"
                }
            },
            schema: {
                model: {
                    id: "Id",
                    fields: {
                        Id: { type: "number" },
                        Name: { type: "string" }
                    }
                }
            }
        });

        $("#Branchs").kendoComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            dataSource: branch,
            filter: "contains",
            suggest: true,
            index: 0,
            dataBound: function () {
                var comboBox = this;
                var branchId = $("#BranchId").val() || 0;
                setTimeout(function () {
                    if (comboBox.dataSource.data().length > 0) {
                        var item = comboBox.dataSource.get(branchId);
                        if (item) {
                            comboBox.value(branchId);
                            comboBox.text(item.Name);
                            comboBox.trigger("change");
                        }
                    }
                }, 300);
            }
        });
    };


    function OpenProductPopup(detailRow) {
        debugger;
        var wnd = $("#saleDetailsWindow").kendoWindow({
            width: "650px",
            height: "450px",
            title: "Select Product",
            modal: true,
            visible: false
        }).data("kendoWindow");

        wnd.center().open();

        $("#saleDetailsGrid").kendoGrid({
            dataSource: {
                transport: {
                    read: {
                        url: "/Common/Common/GetProductModalPurchase" // API for Product list
                    }
                }
            },
            height: 380,
            sortable: true,
            filterable: true,
            pageable: true,
            selectable: "row",

            columns: [
                { field: "ProductId", title: "Product ID", hidden: true },
                { field: "ProductName", title: "Product Name", width: 100 },
                { field: "UOMId", hidden: true },
                { field: "UOMName", title: "UOM", width: 100 },
                //{ field: "HSCodeNo", title: "HS Code No", width: 80 },
                { field: "ProductGroupId", title: "Product Group Id", width: 100 },
                { field: "ProductGroupName", title: "Product Group Name", width: 100 },
                { field: "PurchasePrice", title: "Purchase Price", width: 100 },
                { field: "SalesPrice", title: "Sale Price", width: 100 },
                { field: "VATRate", title: "VAT Rate", width: 100 },
                { field: "SDRate", title: "SD Rate", width: 100 },
            ]
        });

        // DOUBLE CLICK SELECT
        $("#saleDetailsGrid").off("dblclick").on("dblclick", "tr", function () {

            var grid = $("#saleDetailsGrid").data("kendoGrid");
            var selectedItem = grid.dataItem($(this));
            ApplyProductSelection(detailRow, selectedItem);
            wnd.close();
        });
    }


    function ApplyProductSelection(detailRow, item) {
        debugger;
        console.log(item);

        // Set Product details
        detailRow.set("ProductId", item.ProductId);
        detailRow.set("ProductName", item.ProductName);
        detailRow.set("UOMId", item.UOMId);
        detailRow.set("UOMName", item.UOMName);

        // Set Cost Price → UnitRate (Sales Price)
        detailRow.set("UnitPrice", item.PurchasePrice);

        // Set Rates
        detailRow.set("VATRate", item.VATRate);
        detailRow.set("SD", item.SDRate);

        // Default quantity if empty
        if (!detailRow.Quantity || detailRow.Quantity <= 0) {
            detailRow.set("Quantity", 1);
        }

        // Auto-calculate SubTotal
        var subTotal = detailRow.Quantity * detailRow.UnitPrice;  // UnitRate = SalesPrice
        detailRow.set("SubTotal", subTotal);

        // SD Amount: (SubTotal * SDRate) / 100
        var sdAmount = (subTotal * (detailRow.SD || 0)) / 100;
        detailRow.set("SDAmount", sdAmount);

        // VAT Amount: ((SubTotal + SDAmount) * VATRate) / 100
        var vatAmount = ((subTotal + sdAmount) * (detailRow.VATRate || 0)) / 100;
        detailRow.set("VATAmount", vatAmount);
        debugger;
        // Line Total = SubTotal + SDAmount + VATAmount
        var lineTotal = subTotal + sdAmount + vatAmount;
        detailRow.set("LineTotal", lineTotal);
        updateSaleSummary();

    }

    function updateSaleSummary() {

        var grid = $("#saleOrderDetails").data("kendoGrid");
        var data = grid ? grid.dataSource.data() : [];

        var subTotal = 0;
        var sdTotal = 0;
        var vatTotal = 0;
        var grandTotal = 0;

        data.forEach(function (item) {
            subTotal += item.SubTotal || 0;
            sdTotal += item.SDAmount || 0;
            vatTotal += item.VATAmount || 0;
            grandTotal += item.LineTotal || 0;
        });

        var dp = parseInt($("#DecimalPlace").val()) || 2;

        $("#SubTotal").val(subTotal.toFixed(dp));
        $("#TotalSD").val(sdTotal.toFixed(dp));
        $("#TotalVAT").val(vatTotal.toFixed(dp));
        $("#GrandTotal").val(grandTotal.toFixed(dp));

        DueCalculation();
    }

    function GetSupplierComboBox() {
        var SupplierComboBox = $("#SupplierId").kendoMultiColumnComboBox({
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
                    read: "/Common/Common/GetSupplierList"
                }
            },
            placeholder: "Select Supplier",
            value: "",
            dataBound: function (e) {
                if (getSupplierId) {
                    this.value(parseInt(getSupplierId));
                }
            },
            change: function (e) {
            }
        }).data("kendoMultiColumnComboBox");
    };

    function computeSubTotal(row, param) {

        var qty = parseFloat(row.closest("tr").find("td.td-Quantity").text().replace(/,/g, '')) || 0;
        var unitCost = parseFloat(row.closest("tr").find("td.td-UnitPrice").text().replace(/,/g, '')) || 0;

        var SDRate = parseFloat(row.closest("tr").find("td.td-SD").text().replace(/,/g, '')) || 0;
        var SDAmount = parseFloat(row.closest("tr").find("td.td-SDAmount").text().replace(/,/g, '')) || 0;

        var VATRate = parseFloat(row.closest("tr").find("td.td-VATRate").text().replace(/,/g, '')) || 0;
        var VATAmount = parseFloat(row.closest("tr").find("td.td-VATAmount").text().replace(/,/g, '')) || 0;


        var OthersAmount = parseFloat(row.closest("tr").find("td.td-OthersAmount").text().replace(/,/g, '')) || 0;

        if (!isNaN(qty * unitCost)) {
            var SubTotal = Number(parseFloat(qty * unitCost).toFixed(parseInt(decimalPlace)));
            row.closest("tr").find("td.td-SubTotal").text(SubTotal.toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));

            if (param == 'SDRate') {
                SDAmount = Number(parseFloat(((qty * unitCost) * SDRate) / 100).toFixed(parseInt(decimalPlace)));
                row.closest("tr").find("td.td-SDAmount").text(SDAmount.toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));
            }
            else if (param == 'SDAmount') {
                SDRate = Number(parseFloat((SDAmount * 100) / (qty * unitCost)).toFixed(parseInt(decimalPlace)));
                row.closest("tr").find("td.td-SD").text(SDRate.toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));
            }
            else if (param == 'VATRate') {
                VATAmount = Number(parseFloat((((qty * unitCost) + (parseFloat(OthersAmount) + parseFloat(SDAmount))) * VATRate) / 100).toFixed(parseInt(decimalPlace)));
                row.closest("tr").find("td.td-VATAmount").text(VATAmount.toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));
            }
            else if (param == 'VATAmount') {
                VATRate = Number(parseFloat((VATAmount * 100) / ((qty * unitCost) + (parseFloat(OthersAmount) + parseFloat(SDAmount)))).toFixed(parseInt(decimalPlace)));
                row.closest("tr").find("td.td-VATRate").text(VATRate.toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));
            }
            else {
                SDAmount = Number(parseFloat(((qty * unitCost) * SDRate) / 100).toFixed(parseInt(decimalPlace)));
                if (isNaN(SDAmount)) {
                    SDAmount = 0.00;
                }
                row.closest("tr").find("td.td-SDAmount").text(SDAmount.toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));

                if (parseFloat(SDRate) == 0) {
                    SDRate = Number(parseFloat((SDAmount * 100) / (qty * unitCost)).toFixed(parseInt(decimalPlace)));
                    if (isNaN(SDRate)) {
                        SDRate = 0.00;
                    }
                }
                else {
                    SDRate = Number(parseFloat(SDRate).toFixed(parseInt(decimalPlace)));
                    if (isNaN(SDRate)) {
                        SDRate = 0.00;
                    }
                }
                row.closest("tr").find("td.td-SD").text(SDRate.toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));


                //////////////////////////////////////////////////////////////////
                VATAmount = Number(parseFloat((((qty * unitCost) + (parseFloat(OthersAmount) + parseFloat(SDAmount))) * VATRate) / 100).toFixed(parseInt(decimalPlace)));
                if (isNaN(VATAmount)) {
                    VATAmount = 0.00;
                }
                row.closest("tr").find("td.td-VATAmount").text(VATAmount.toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));

                if (parseFloat(VATRate) == 0) {
                    VATRate = Number(parseFloat((VATAmount * 100) / (qty * unitCost)).toFixed(parseInt(decimalPlace)));
                    if (isNaN(VATRate)) {
                        VATRate = 0.00;
                    }
                }
                else {
                    VATRate = Number(parseFloat(VATRate).toFixed(parseInt(decimalPlace)));
                    if (isNaN(VATRate)) {
                        VATRate = 0.00;
                    }
                }

                row.closest("tr").find("td.td-VATRate").text(VATRate.toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));
            }

            var LineTotal = Number(parseFloat((qty * unitCost) + parseFloat(OthersAmount) + parseFloat(SDAmount) + parseFloat(VATAmount)).toFixed(parseInt(decimalPlace)));
            row.closest("tr").find("td.td-LineTotal").text(LineTotal.toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));

            TotalCalculation();
        }
    };

    function TotalCalculation() {

        let subTotal = 0;
        let totalSD = 0;
        let totalVAT = 0;
        let grandTotal = 0;

        // Loop through all detail rows
        $('#details tbody tr').each(function () {
            const row = $(this);

            subTotal += parseFloat(row.find('.td-SubTotal').text().replace(/,/g, '')) || 0;
            totalSD += parseFloat(row.find('.td-SDAmount').text().replace(/,/g, '')) || 0;
            totalVAT += parseFloat(row.find('.td-VATAmount').text().replace(/,/g, '')) || 0;
            grandTotal += parseFloat(row.find('.td-LineTotal').text().replace(/,/g, '')) || 0;
        });

        // Decimal place
        const dp = parseInt(decimalPlace);

        // Set values in master fields (formatted)
        $("#SubTotal").val(subTotal.toLocaleString('en', { minimumFractionDigits: dp, maximumFractionDigits: dp }));
        $("#TotalSD").val(totalSD.toLocaleString('en', { minimumFractionDigits: dp, maximumFractionDigits: dp }));
        $("#TotalVAT").val(totalVAT.toLocaleString('en', { minimumFractionDigits: dp, maximumFractionDigits: dp }));
        $("#GrandTotal").val(grandTotal.toLocaleString('en', { minimumFractionDigits: dp, maximumFractionDigits: dp }));

        DueCalculation();
    }
    function DueCalculation() {

        var grandTotal = parseFloat($("#GrandTotal").val().replace(/,/g, '')) || 0;
        var paidAmount = parseFloat($("#PaidAmount").val().replace(/,/g, '')) || 0;

        var due = grandTotal - paidAmount;

        if (due < 0) due = 0;

        $("#DueAmount").val(
            due.toLocaleString('en', { minimumFractionDigits: decimalPlace })
        );
    }
    function productModalDblClick(row, originalRow) {
        debugger;
        var dataTable = $("#modalData").DataTable();
        var rowData = dataTable.row(row).data();

        var ProductId = rowData.ProductId || 0;
        var ProductName = rowData.ProductName || "";
        //var UOMId = rowData.UOMId || 0;
        //var UOMName = rowData.UOMName || "";
        var vatRate = rowData.VATRate || 0;
        var sdRate = rowData.SDRate || 0;
        var CostPrice = rowData.SalesPrice || 0;

        var $currentRow = originalRow.closest('tr');

        /* ================= PRODUCT & UOM ================= */
        originalRow.closest("td").find("input").val(ProductName);
        originalRow.closest('td').next().text(ProductId);
        //originalRow.closest('td').next().next().text(UOMId);
        //originalRow.closest('td').next().next().next().text(UOMName);

        /* ================= RATE / SD / VAT ================= */
        $currentRow.find('.td-UnitRate').text(
            Number(CostPrice).toLocaleString('en', {
                minimumFractionDigits: parseInt(decimalPlace),
                maximumFractionDigits: parseInt(decimalPlace)
            })
        );

        $currentRow.find('.td-SD').text(
            Number(sdRate).toLocaleString('en', {
                minimumFractionDigits: parseInt(decimalPlace),
                maximumFractionDigits: parseInt(decimalPlace)
            })
        );

        $currentRow.find('.td-VATRate').text(
            Number(vatRate).toLocaleString('en', {
                minimumFractionDigits: parseInt(decimalPlace),
                maximumFractionDigits: parseInt(decimalPlace)
            })
        );

        //$("#UOMId").val(UOMId);

        /* ================= DEFAULT QUANTITY ================= */
        var qtyText = $currentRow.find('.td-Quantity').text().trim();
        if (!qtyText || isNaN(parseFloat(qtyText))) {
            $currentRow.find('.td-Quantity').text(
                Number(1).toLocaleString('en', {
                    minimumFractionDigits: parseInt(decimalPlace),
                    maximumFractionDigits: parseInt(decimalPlace)
                })
            );
        }

        /* ================= 🔥 CORE CALCULATION ================= */
        computeSubTotal($currentRow.find('.td-UnitRate'), '');
        TotalCalculation();

        /* ================= UI CLEANUP ================= */
        $("#partialModal").modal("hide");
        originalRow.closest("td").find("input").data("touched", false).focus();
        $("#myModal1").modal("show");
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
                    url: "/DMS/Purchase/GetGridData",
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
                            if (param.field === "SupplierName") {
                                param.field = "S.Name";
                            }
                            if (param.field === "PurchaseOrderCode") {
                                param.field = "P.Code";
                            }
                            if (param.field === "BENumber") {
                                param.field = "H.BENumber";
                            }
                            if (param.field === "InvoiceDateTime" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "H.InvoiceDateTime";
                            }
                            if (param.field === "PurchaseDate" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "H.PurchaseDate";
                            }
                            if (param.field === "SubTotal") {
                                param.field = "H.SubTotal";
                            }
                            if (param.field === "TotalSD") {
                                param.field = "H.TotalSD";
                            }
                            if (param.field === "TotalVAT") {
                                param.field = "H.TotalVAT";
                            }
                            if (param.field === "GrandTotal") {
                                param.field = "H.GrandTotal";
                            }
                            if (param.field === "PaidAmount") {
                                param.field = "H.PaidAmount";
                            }
                            if (param.field === "Comments") {
                                param.field = "H.Comments";
                            }
                            if (param.field === "TransactionType") {
                                param.field = "H.TransactionType";
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
                    
                            if (param.field === "FiscalYear") {
                                param.field = "H.FiscalYear";
                            }
                            if (param.field === "BranchName") {
                                param.field = "Br.Name";
                            }

                            if (param.field === "BranchAddress") {
                                param.field = "Br.Address";
                            }
                            if (param.field === "SupplierAddress") {
                                param.field = "S.Address";
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
                            if (param.field === "SupplierName") {
                                param.field = "S.Name";
                            }
                            if (param.field === "PurchaseOrderCode") {
                                param.field = "P.Code";
                            }
                            if (param.field === "BENumber") {
                                param.field = "H.BENumber";
                            }
                            if (param.field === "InvoiceDateTime" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "H.InvoiceDateTime";
                            }
                            if (param.field === "PurchaseDate" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "H.PurchaseDate";
                            }
                            if (param.field === "SubTotal") {
                                param.field = "H.SubTotal";
                            }
                            if (param.field === "TotalSD") {
                                param.field = "H.TotalSD";
                            }
                            if (param.field === "TotalVAT") {
                                param.field = "H.TotalVAT";
                            }
                            if (param.field === "GrandTotal") {
                                param.field = "H.GrandTotal";
                            }
                            if (param.field === "PaidAmount") {
                                param.field = "H.PaidAmount";
                            }
                            if (param.field === "Comments") {
                                param.field = "H.Comments";
                            }
                            if (param.field === "TransactionType") {
                                param.field = "H.TransactionType";
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

                            if (param.field === "FiscalYear") {
                                param.field = "H.FiscalYear";
                            }
                            if (param.field === "BranchName") {
                                param.field = "Br.Name";
                            }

                            if (param.field === "BranchAddress") {
                                param.field = "Br.Address";
                            }
                            if (param.field === "SupplierAddress") {
                                param.field = "S.Address";
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
                    GrandTotalAmount: { type: "number" },
                    GrandTotalSDAmount: { type: "number" },
                    GrandTotalVATAmount: { type: "number" }
                }
            }
            ,
            //aggregate: [
            //    { field: "GrandTotalAmount", aggregate: "sum" },
            //    { field: "GrandTotalSDAmount", aggregate: "sum" },
            //    { field: "GrandTotalVATAmount", aggregate: "sum" }
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
            search: ["Code", "SupplierName", "SupplierAddress", "Status", "Completed", "BENumber", "PurchaseDate", "InvoiceDateTime", "GrandTotalAmount", "GrandTotalSDAmount", "GrandTotalVATAmount", "Comments", "TransactionType", "CurrencyRateFromBDT", "ImportIDExcel", "FileName", "CustomHouse", "FiscalYear", "BranchName", "BranchAddress"],
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
                                url: "/DMS/Purchase/GetPurchaseDetailDataById",
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
                        { field: "ProductName", title: "Product Name", sortable: true, width: 120, footerTemplate: "Total:" },
                        { field: "Quantity", title: "Quantity", sortable: true, width: 100, aggregates: ["sum"], format: "{0:n2}", footerTemplate: "#= kendo.toString(sum, 'n2') #", attributes: { style: "text-align: right;" } },
                        { field: "UnitPrice", title: "Unit Price", sortable: true, width: 100,  attributes: { style: "text-align: right;" } },
                        { field: "SubTotal", title: "Sub Total", sortable: true, width: 100, aggregates: ["sum"], format: "{0:n2}", footerTemplate: "#= kendo.toString(sum, 'n2') #", attributes: { style: "text-align: right;" } },
                        { field: "SD", title: "SD Rate", sortable: true, width: 100,format: "{0:n2}", attributes: { style: "text-align: right;" } },
                        { field: "SDAmount", title: "SD Amount", sortable: true, width: 100, footerTemplate: "#= kendo.toString(sum, 'n2') #", aggregates: ["sum"], format: "{0:n2}", attributes: { style: "text-align: right;" } },
                        { field: "VATRate", title: "VAT Rate", sortable: true, width: 100, attributes: { style: "text-align: right;" } },
                        { field: "VATAmount", title: "VAT Amount", sortable: true, width: 100, footerTemplate: "#= kendo.toString(sum, 'n2') #", aggregates: ["sum"], format: "{0:n2}", attributes: { style: "text-align: right;" } },
                        { field: "OthersAmount", title: "Others Amount", sortable: true, width: 100, footerTemplate: "#= kendo.toString(sum, 'n2') #", aggregates: ["sum"], format: "{0:n2}", attributes: { style: "text-align: right;" } },
                        { field: "LineTotal", title: "Total", sortable: true, width: 100, footerTemplate: "#= kendo.toString(sum, 'n2') #", aggregates: ["sum"], format: "{0:n2}", attributes: { style: "text-align: right;" } },
                        { field: "IsFixedVAT", hidden: true, title: "Is Fixed Vat", sortable: true, width: 100 },
                        { field: "VatType", hidden: true, title: "Vat Type", sortable: true, width: 100 },
                        { field: "Comments", title: "Comments", sortable: true, hidden: true, width: 150 },
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
            columns: [
                {
                    selectable: true, width: 35
                },
                {
                    title: "Action",
                    width:120,
                    template: function (dataItem) {
                        return `
                                <a href="/DMS/Purchase/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                                    <i class="fas fa-pencil-alt"></i>
                                </a>

                        <a href="/DMS/Purchase/getReport/${dataItem.Id}" 
                          class="btn btn-success btn-sm mr-2 getReport" 
                          title="Report">
                           <i class="fas fa-file-alt"></i>
                      </a>

                                `
                    }
                },
                { field: "Id", width: 50, hidden: true, sortable: true },
                { field: "Code", title: "Code", width: 180, sortable: true },
                { field: "SupplierName", title: "Supplier Name", sortable: true, width: 180 },
                { field: "PurchaseOrderCode", title: "Purchase Order Code", sortable: true, width: 180 },

                {
                    field: "InvoiceDateTime", title: "Invoice Date", sortable: true, width: 135, template: '#= kendo.toString(kendo.parseDate(InvoiceDateTime), "yyyy-MM-dd") #',
                    filterable:
                    {
                        ui: "datepicker"
                    }
                },
                {
                    field: "PurchaseDate", title: "Purchase Date", sortable: true, width: 135, template: '#= kendo.toString(kendo.parseDate(PurchaseDate), "yyyy-MM-dd") #',
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
                },

                { field: "BENumber", title: "BE Number", sortable: true, width: 130 },
                { field: "FiscalYear", title: "Fiscal Year", sortable: true, width: 120 },
                { field: "Comments", title: "Comments", sortable: true, hidden: true, width: 200 },
                { field: "BranchName", title: "Branch Name", sortable: true, hidden: true, width: 200 },
                { field: "BranchAddress", title: "Branch Address", width: 200, hidden: true, sortable: true },
            ],
            editable: false,
            selectable: "multiple row",
            navigatable: true,
            columnMenu: true
        });

    };

    function save() {
        debugger;
        var validator = $("#frmEntry").validate();
        var model = serializeInputs("frmEntry");

        var result = validator.form();

        if (!result) {
            validator.focusInvalid();
            ShowNotification(3, "Complete Required Fields.");
            return;
        }

        if (model.IsPost == 'True') {
            ShowNotification(2, "Post operation is already done, Do not update this entry");
            return;
        }
        if (parseInt(model.SupplierId) == 0 || model.SupplierId == "") {
            ShowNotification(3, "Supplier Required.");
            return;
        }

        //if (hasInputFieldInTableCells($table)) {
        //    ShowNotification(3, "Complete Details Entry");
        //    return;
        //};
        //if (!hasLine($table)) {
        //    ShowNotification(3, "Complete Details Entry");
        //    return;
        //};


        var details = [];

        var grid = $("#saleOrderDetails").data("kendoGrid");
        if (grid) {

            var dataItems = grid.dataSource.view();

            for (var i = 0; i < dataItems.length; i++) {

                var item = dataItems[i];

                details.push({

                    Id: item.Id,

                    ProductId: item.ProductId,
                    ProductName: item.ProductName,
                    UOMId: item.UOMId,
                    UOMName: item.UOMName,
                    Quantity: item.Quantity,
                    UnitPrice: item.UnitPrice,
                    SubTotal: item.SubTotal,
                    VATAmount: item.VATAmount,
                    SDAmount: item.SDAmount,
                    VATRate: item.VATRate,
                    SD: item.SD,
                    LineTotal: item.LineTotal,
                    OthersAmount: item.OthersAmount,
                    Action: item.Action
                });
            }
        }

        if (!details || details.length === 0) {
            ShowNotification(3, "Complete Details first!");
            return;
        }

        var isDropdownValid1 = CommonService.validateDropdown("#SupplierId", "#titleError1", "Supplier is required");

        var isDropdownValid = isDropdownValid1;
        if (!result || !isDropdownValid) {
            if (!result) {
                validator.focusInvalid();
            }
            return;
        }

        //var details = serializeTable($table);

        var requiredFields = ['ProductName', 'Quantity', 'UnitPrice'];
        var fieldMappings = {
            'ProductName': 'Product Name',
            'Quantity': 'Quantity',
            'UnitPrice': 'Unit Price'
        };

        var errorMessage = getRequiredFieldsCheckObj(details, requiredFields, fieldMappings);
        if (errorMessage) {
            ShowNotification(3, errorMessage);
            return;
        };

        model.PaidAmount = model.PaidAmount.replace(/,/g, '');
        model.SubTotal = model.SubTotal.replace(/,/g, '');
        model.TotalSD = model.TotalSD.replace(/,/g, '');
        model.TotalVAT = model.TotalVAT.replace(/,/g, '');
        model.GrandTotal = model.GrandTotal.replace(/,/g, '');

        debugger;
        var purchaseorder = $("#PurchaseOrderId").val();

        if (purchaseorder > 0) {
            model.TransactionType = 'PurchaseOrder';
        }
        else {
            model.TransactionType = 'Purchase';
        }



        model.purchaseDetailList = details;
        model.PurchaseOrderId = $("input[name='PurchaseOrderId']").val() || 0;

        var url = "/DMS/Purchase/CreateEdit";

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

        var url = "/DMS/Purchase/MultiplePost";

        CommonAjaxService.multiplePost(url, model, processDone, fail);
    };


    function processDone(result) {

        var grid = $('#GridDataList').data('kendoGrid');
        if (grid) {
            grid.dataSource.read();
        }
        if (result.Status == 200) {
            ShowNotification(1, result.Message);
            $(".btnsave").show();
            $(".btnPost").show();
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
        $('.details-link').prop('disabled', false);
    };

    return {
        init: init
    }


}(CommonService, CommonAjaxService);


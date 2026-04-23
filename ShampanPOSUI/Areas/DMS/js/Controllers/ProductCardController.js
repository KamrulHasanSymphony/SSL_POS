var SaleController = function (CommonService, CommonAjaxService) {


    var init = function () {
        getProductGroupId = $("#ProductGroupId").val() || 0;
        getCustomerId = $("#CustomerId").val() || 0;
        getSaleOrderId = $("#SaleOrderId").val() || 0;
        var isManualSale = $("#IsManualSale").val() === "True";


        if ($("#IsPosted").length) {
            LoadCombo("IsPosted", '/Common/Common/GetBooleanDropDown');
            $("#IsPosted").val('');
            GetBranchList();
        };


        $(document).ready(function () {


            $("#FromDate").kendoDatePicker({
                format: "yyyy-MM-dd",
                value: new Date()
            });

            $("#ToDate").kendoDatePicker({
                format: "yyyy-MM-dd",
                value: new Date()
            });

            $(".kendoInvoiceDateTime").kendoDateTimePicker({
                format: "yyyy-MM-dd HH:mm"
            });

        });

        let currentKeyword = "";
        let currentGroupId = "";

        $(document).on("keyup", "#productSearchInput", function () {
            currentKeyword = $(this).val().toLowerCase().trim();
            applyFilter();
        });

        $(document).on("change", "#modalProductGroup", function () {
            currentGroupId = $(this).val();
            applyFilter();
        });

        function applyFilter() {

            var filtered = allProducts.filter(function (item) {

                var matchText =
                    (!currentKeyword ||
                        (item.ProductName && item.ProductName.toLowerCase().includes(currentKeyword)) ||
                        (item.ProductId && item.ProductId.toString().includes(currentKeyword)));

                var matchGroup =
                    (!currentGroupId || item.ProductGroupId == currentGroupId);

                return matchText && matchGroup;
            });

            renderProductCardsInModal(filtered);

            // 🔥 restore values properly
            $("#productSearchInput").val(currentKeyword);
            $("#modalProductGroup").val(currentGroupId);

            // 🔥 cursor fix
            setTimeout(function () {
                let input = $("#productSearchInput")[0];
                if (input) {
                    input.focus();
                    input.setSelectionRange(input.value.length, input.value.length);
                }
            }, 0);
        }



        decimalPlace = $("#DecimalPlace").val() || 2;
        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';

        if (parseInt(getId) == 0 && getOperation == '') {
            debugger;
            GetGridDataList();
        };

        GetCustomerComboBox();
        GetProductGroupComboBox();


        $("#productCardModal").kendoWindow({
            width: "1000px",
            height: "700px",
            title: "Select Product",
            modal: true,
            visible: false,
            actions: ["Close"]
        });

        var $table = $('#details');

        var table = initEditTable($table, { searchHandleAfterEdit: false });

        TotalCalculation();

        if (isManualSale) {
            $('#addRows').on('click', function () {
                addRow($table);
            });
        } else {
            $('#addRows').prop('disabled', true).hide();
        }



        $('.btnsave').click(function (e) {
            debugger;

            var getId = $('#Id').val();
            var status = parseInt(getId) > 0 ? "Update" : "Save";

            var model = serializeInputs("frmEntry");

            function isInvalid(value) {
                return isNaN(value) || value === "" || value === null;
            }

            function isEmpty(value) {
                return value === "" || value === null || value === undefined;
            }

            function markInvalid(selector, message) {
                var widget = $(selector).data("kendoMultiColumnComboBox");
                if (widget) {
                    widget.wrapper.addClass("k-invalid");
                    widget._inputWrapper.addClass("k-state-invalid");
                } else {
                    $(selector).addClass("input-validation-error");
                }
                $(selector).closest(".input-group").siblings("span.text-danger").text(message).show();
            }

            function clearInvalid(selector) {
                var widget = $(selector).data("kendoMultiColumnComboBox");
                if (widget) {
                    widget.wrapper.removeClass("k-invalid");
                    widget._inputWrapper.removeClass("k-state-invalid");
                } else {
                    $(selector).removeClass("input-validation-error");
                }
                $(selector).closest(".input-group").siblings("span.text-danger").text("").hide();
            }

            clearInvalid("#CustomerId");
            clearInvalid("#TransactionDateTime");
            clearInvalid("#Code");

            var isFormValid = true;

            if (model.IsAutoCode?.toLowerCase() === "n" && isEmpty(model.Code)) {
                markInvalid("#Code", "Code is required.");
                isFormValid = false;
            }

            if (isInvalid(model.CustomerId)) {
                markInvalid("#CustomerId", "Customer is required.");
                isFormValid = false;
            }

            if (isEmpty(model.TransactionDateTime)) {
                markInvalid("#TransactionDateTime", "Transaction Date is required.");
                isFormValid = false;
            }

            var details = [];
            var grid = $("#saleDetails").data("kendoGrid");

            if (grid) {
                var dataItems = grid.dataSource.view();

                for (var i = 0; i < dataItems.length; i++) {

                    var item = dataItems[i];

                    var finalProductId = item.ProductId || item.ItemId;

                    // 🔥 FIX HERE
                    if (!finalProductId || finalProductId <= 0) {
                        ShowNotification(3, "Please select product in row " + (i + 1));
                        return;
                    }

                    if (!item.Quantity || item.Quantity <= 0) {
                        ShowNotification(3, "Quantity must be greater than zero.");
                        return;
                    }

                    details.push({
                        Id: item.Id || 0,
                        ProductId: finalProductId,
                        ProductName: item.ProductName,
                        UOMId: item.UOMId,
                        UOMName: item.UOMName,
                        Quantity: item.Quantity,
                        UnitRate: item.UnitRate,
                        SubTotal: item.SubTotal,
                        VATAmount: item.VATAmount,
                        SDAmount: item.SDAmount,
                        VATRate: item.VATRate,
                        SD: item.SD,
                        LineTotal: item.LineTotal,
                        Action: item.Action || "Add"
                    });
                }
            }

            if (!details.length) {
                ShowNotification(3, "Please add at least one item to the sale details.");
                return;
            }



            var cardDetails = [];
            var cardGrid = $("#cardDetails").data("kendoGrid");

            if (cardGrid) {
                var cardItems = cardGrid.dataSource.view();

                for (var i = 0; i < cardItems.length; i++) {
                    var cardItem = cardItems[i];

                    if (!cardItem.CreditCardId || cardItem.CreditCardId < 0) {
                        ShowNotification(3, "Payment method is required.");
                        return;
                    }

                    if (!cardItem.CardTotal || cardItem.CardTotal < 0) {
                        ShowNotification(3, "Payment amount must be greater than zero.");
                        return;
                    }

                    cardDetails.push({
                        Id: cardItem.Id,
                        CreditCardId: cardItem.CreditCardId,
                        CardTotal: cardItem.CardTotal,
                        Remarks: cardItem.Remarks
                    });
                }
            }


            if (!cardDetails.length) {
                ShowNotification(3, "Please complete the payment before submitting the sale.");
                return;
            }

            for (var i = 0; i < cardDetails.length; i++) {

                var c = cardDetails[i];

                if (c.Remarks && c.Remarks.length > 250) {
                    ShowNotification(3, "Remarks cannot exceed 250 characters.");
                    return;
                }
            }


            var finalPayable = parseFloat($("#FinalPayable").val()) || 0;
            var payment = parseFloat($("#Payment").val()) || 0;

            if (payment > finalPayable) {
                ShowNotification(3, "Your payment is more than your total bill. Please correct it.");
                return;
            }
            Confirmation("Are you sure?", function (result) {
                debugger;

                if (result === true) {
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
            debugger;

            Confirmation("Are you sure? Do You Want to Post Data?",
                function (result) {
                    debugger;

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



        $(document).on('click', '.remove-row-btn', function () {

            if ($("#IsManualSale").val() !== "True") {
                ShowNotification(3, "Row delete is not allowed here.");
                return;
            }

            $(this).closest('tr').remove();
            TotalCalculation();
        });



        $("#windowGrid").on("dblclick", "tbody tr", function () {
            debugger;
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

        // =======================
        // LOAD DETAILS FROM JSON
        // =======================
        var saleDetailList = JSON.parse($("#SaleDetailsJson").val() || "[]");
        debugger;
        console.log(JSON.stringify(saleDetailList, null, 2));
        var saleDetails = new kendo.data.DataSource({

            data: saleDetailList,
            schema: {
                model: {
                    id: "Id",
                    fields: {
                        SLNo: { type: "number", editable: false },
                        Id: { type: "number", defaultValue: 0 },
                        ProductId: { type: "number", defaultValue: null },
                        ProductName: { type: "string", defaultValue: "" },
                        Quantity: { type: "number", defaultValue: 0 },
                        UnitRate: { type: "number", defaultValue: 0 },
                        SubTotal: { type: "number", defaultValue: 0 },
                        VATAmount: { type: "number", defaultValue: 0 },
                        SDAmount: { type: "number", defaultValue: 0 },
                        VATRate: { type: "number", defaultValue: 0 },
                        SD: { type: "number", defaultValue: 0 },
                        LineTotal: { type: "number", defaultValue: 0 },
                        Remarks: { type: "string", defaultValue: "" }
                    }
                }
            },
            aggregate: [
                { field: "Quantity", aggregate: "sum" },
                { field: "SubTotal", aggregate: "sum" },
                { field: "LineTotal", aggregate: "sum" },
                { field: "SDAmount", aggregate: "sum" },
                { field: "VATAmount", aggregate: "sum" }
            ],
            change: function (e) {

                if (["Quantity", "UnitRate", "SD", "VATRate"].includes(e.field)) {

                    var item = e.items[0];


                    var qty = item.Quantity || 0;
                    var rate = item.UnitRate || 0;
                    var sdRate = item.SD || 0;
                    var vatRate = item.VATRate || 0;

                    var subTotal = qty * rate;
                    item.set("SubTotal", subTotal);

                    var sdAmount = (subTotal * sdRate) / 100;
                    item.set("SDAmount", sdAmount);

                    var subtotalwithSD = subTotal + sdAmount;
                    var vatAmount = (subtotalwithSD * vatRate) / 100;
                    item.set("VATAmount", vatAmount);

                    var total = subtotalwithSD + vatAmount;
                    item.set("LineTotal", total);

                    $("#saleDetails").data("kendoGrid").refresh();
                    updateSaleSummary();

                }
            }

        });

        $("#saleDetails").kendoGrid({
            dataSource: saleDetails,
            toolbar: [
                {
                    template: `<button id="btnAddProductGrid"
                                class="btn btn-primary btn-sm">
                            <i class="fa fa-search"></i> Add Product
                       </button>`
                }
            ],
            //toolbar: [{ name: "create", text: "Add" }],
            editable: { mode: "incell", createAt: "bottom" },
            save: function () {
                var grid = this;

                setTimeout(() => {
                    updateSaleSummary();
                }, 0);
            },
            dataBound: function () {
                var grid = this;
                var items = grid.dataSource.view();

                items.forEach(x => recalcItem(x));

                updateSaleSummary();
            },

            columns: [
                {
                    field: "SLNo",
                    title: "SL",
                    width: 50,
                    template: function (dataItem) {
                        var grid = $("#saleDetails").data("kendoGrid");
                        return grid.dataSource.indexOf(dataItem) + 1;
                    },
                    editable: false
                },

                {
                    field: "ProductId",
                    title: "Product Name",
                    editor: itemSelectorEditor,//eta banate hobe
                    template: function (dataItem) {
                        return dataItem.ProductName || "";
                    },
                    footerTemplate: "Total:",
                    width: 160
                },


                { field: "UOMId", hidden: true },
                { field: "UOMName", hidden: true },
                {
                    field: "Quantity",
                    title: "Quantity",
                    width: 100,
                    attributes: { style: "text-align:right;" },
                    footerAttributes: { style: "text-align:right;" },
                    footerTemplate: "<b>#= sum #</b>",
                    editor: function (container, options) {

                        var input = $('<input data-bind="value:' + options.field + '"/>')
                            .appendTo(container)
                            .kendoNumericTextBox({
                                min: 0.01,
                                max: 999999999999999.99,
                                decimals: 2,
                                step: 1.00,
                                format: "n2",
                                spinners: false
                            });

                        var numeric = input.data("kendoNumericTextBox");

                        input.on("input", function () {

                            var value = this.value;

                            value = value.replace(/[^0-9.]/g, '');

                            var parts = value.split(".");
                            if (parts.length > 2) {
                                value = parts[0] + "." + parts[1];
                                parts = value.split(".");
                            }

                            if (parts[0].length > 15) {
                                parts[0] = parts[0].substring(0, 15);
                            }

                            if (parts[1] && parts[1].length > 2) {
                                parts[1] = parts[1].substring(0, 2);
                            }

                            value = parts.join(".");

                            if (parseFloat(value) <= 0) {
                                value = "0.01";
                            }

                            this.value = value;
                        });

                        numeric.bind("change", function () {
                            var value = this.value();
                            if (!value || value <= 0) {
                                this.value(0.01);
                            }
                        });
                    }
                },

                {
                    field: "UnitRate",
                    title: "Unit Rate",
                    width: 100,
                    editable: false,
                    attributes: { style: "text-align:right;" },
                    editor: function (container, options) {

                        var input = $('<input data-bind="value:' + options.field + '"/>')
                            .appendTo(container)
                            .kendoNumericTextBox({
                                min: 0.01,
                                max: 9999999999999.99,
                                decimals: 2,
                                step: 0.01,
                                format: "n2",
                                spinners: false,
                                readonly: true
                            });

                        var numeric = input.data("kendoNumericTextBox");

                        input.on("keydown paste cut", function (e) {
                            e.preventDefault();
                        });

                        numeric.bind("change", function () {
                            var value = this.value();
                            if (!value || value <= 0) {
                                this.value(0.01);
                            }
                        });
                    }
                },

                {
                    field: "SubTotal",
                    title: "Sub Total",
                    width: 100,
                    editable: false,
                    attributes: { style: "text-align:right;" },
                    editor: function (container, options) {

                        var input = $('<input data-bind="value:' + options.field + '"/>')
                            .appendTo(container)
                            .kendoNumericTextBox({
                                min: 0.01,
                                max: 9999999999999.99,
                                decimals: 2,
                                step: 0.01,
                                format: "n2",
                                spinners: false,
                                readonly: true
                            });

                        var numeric = input.data("kendoNumericTextBox");

                        input.on("keydown paste cut", function (e) {
                            e.preventDefault();
                        });

                        numeric.bind("change", function () {
                            var value = this.value();
                            if (!value || value <= 0) {
                                this.value(0.01);
                            }
                        });
                    },
                    footerAttributes: { style: "text-align:right;" },
                    footerTemplate: "<b>#= kendo.toString(sum,'n2') #</b>"
                },

                {
                    field: "SD",
                    title: "SD Rate",
                    width: 60,
                    attributes: { style: "text-align:right;" },
                    editor: function (container, options) {
                        var input = $('<input data-bind="value:' + options.field + '"/>')
                            .appendTo(container)
                            .kendoNumericTextBox({
                                min: 0,
                                max: 100,
                                decimals: 2,
                                step: 0.01,
                                format: "n2"
                            });

                        input.on("keypress", function (e) {
                            var charCode = e.which ? e.which : e.keyCode;
                            if ((charCode < 48 || charCode > 57) && charCode !== 46) {
                                e.preventDefault();
                            }
                        });

                        input.on("blur", function () {
                            var value = parseFloat(input.val()) || 0;
                            if (value > 100) value = 100;
                            input.val(value.toFixed(2));
                        });
                    }

                },

                {
                    field: "SDAmount",
                    title: "SD Amount",
                    width: 100,
                    editable: false,
                    attributes: { style: "text-align:right;" },
                    editor: function (container, options) {

                        var input = $('<input data-bind="value:' + options.field + '"/>')
                            .appendTo(container)
                            .kendoNumericTextBox({
                                min: 0.01,
                                max: 9999999999999.99,
                                decimals: 2,
                                step: 0.01,
                                format: "n2",
                                spinners: false,
                                readonly: true
                            });

                        var numeric = input.data("kendoNumericTextBox");

                        input.on("keydown paste cut", function (e) {
                            e.preventDefault();
                        });

                        numeric.bind("change", function () {
                            var value = this.value();
                            if (!value || value <= 0) {
                                this.value(0.01);
                            }
                        });
                    },
                    footerAttributes: { style: "text-align:right;" },
                    footerTemplate: "<b>#= kendo.toString(sum,'n2') #</b>"
                },

                {
                    field: "VATRate",
                    title: "VAT Rate",
                    width: 60,
                    attributes: { style: "text-align:right;" },
                    editor: function (container, options) {
                        var input = $('<input data-bind="value:' + options.field + '"/>')
                            .appendTo(container)
                            .kendoNumericTextBox({
                                min: 0,
                                max: 100,
                                decimals: 2,
                                step: 0.01,
                                format: "n2"
                            });

                        input.on("keypress", function (e) {
                            var charCode = e.which ? e.which : e.keyCode;
                            if ((charCode < 48 || charCode > 57) && charCode !== 46) {
                                e.preventDefault();
                            }
                        });

                        input.on("blur", function () {
                            var value = parseFloat(input.val()) || 0;
                            if (value > 100) value = 100;
                            input.val(value.toFixed(2));
                        });
                    }
                },

                {
                    field: "VATAmount",
                    title: "VAT Amount",
                    width: 100,
                    editable: false,
                    attributes: { style: "text-align:right;" },
                    editor: function (container, options) {

                        var input = $('<input data-bind="value:' + options.field + '"/>')
                            .appendTo(container)
                            .kendoNumericTextBox({
                                min: 0.01,
                                max: 9999999999999.99,
                                decimals: 2,
                                step: 0.01,
                                format: "n2",
                                spinners: false,
                                readonly: true
                            });

                        var numeric = input.data("kendoNumericTextBox");

                        input.on("keydown paste cut", function (e) {
                            e.preventDefault();
                        });

                        numeric.bind("change", function () {
                            var value = this.value();
                            if (!value || value <= 0) {
                                this.value(0.01);
                            }
                        });
                    },
                    footerAttributes: { style: "text-align:right;" },
                    footerTemplate: "<b>#= kendo.toString(sum,'n2') #</b>"
                },



                {
                    field: "LineTotal",
                    title: "Total",
                    width: 100,
                    editable: false,
                    attributes: { style: "text-align:right;" },
                    editor: function (container, options) {

                        var input = $('<input data-bind="value:' + options.field + '"/>')
                            .appendTo(container)
                            .kendoNumericTextBox({
                                min: 0.01,
                                max: 9999999999999.99,
                                decimals: 2,
                                step: 0.01,
                                format: "n2",
                                spinners: false,
                                readonly: true
                            });

                        var numeric = input.data("kendoNumericTextBox");

                        input.on("keydown paste cut", function (e) {
                            e.preventDefault();
                        });

                        numeric.bind("change", function () {
                            var value = this.value();
                            if (!value || value <= 0) {
                                this.value(0.01);
                            }
                        });
                    },
                    footerAttributes: { style: "text-align:right;" },
                    footerTemplate: "<b>#= kendo.toString(sum,'n2') #</b>"
                },

                {
                    command: [{ name: "destroy", iconClass: "k-icon k-i-trash", text: "" }],
                    title: "&nbsp;",
                    width: 40
                }
            ]
        });


        var cardDetailList = JSON.parse($("#CardDetailsJson").val() || "[]");

        var cardDetails = new kendo.data.DataSource({
            data: cardDetailList,
            schema: {
                model: {
                    id: "Id",
                    fields: {
                        Id: { type: "number", defaultValue: 0 },
                        SaleId: { type: "number", defaultValue: null },
                        CreditCardId: { type: "number", defaultValue: null },
                        CardTotal: { type: "number", defaultValue: 0 },
                        Remarks: { type: "string", defaultValue: "" }
                    }
                }
            },
            aggregate: [
                { field: "CardTotal", aggregate: "sum" }
            ],
            change: function (e) {
                // Handle any changes for card total or other fields
            }
        });

        $("#cardDetails").kendoGrid({
            dataSource: cardDetails,
            toolbar: [{ name: "create", text: "Add" }],
            editable: { mode: "incell", createAt: "bottom" },
            save: function () {
                var grid = this;
                setTimeout(() => {
                    grid.refresh();
                    updateSaleSummary();
                }, 0);
            },
            dataBound: function () {
                updateSaleSummary();
            },
            columns: [
                {
                    title: "SL",
                    width: 30,
                    template: function (dataItem) {
                        var grid = $("#cardDetails").data("kendoGrid");
                        return grid.dataSource.indexOf(dataItem) + 1;
                    },
                    attributes: { style: "text-align:center;" }
                },
                {
                    field: "CreditCardId",
                    title: "CreditCardId",
                    hidden: true
                },
                {
                    field: "CreditCardName",
                    title: "Payment Type",
                    width: 150,
                    editor: function (container, options) {

                        $('<input required />')
                            .appendTo(container)
                            .kendoMultiColumnComboBox({
                                dataTextField: "Name",
                                dataValueField: "Id",
                                valuePrimitive: true,
                                autoBind: false,
                                placeholder: "Select Payment Type",
                                dataSource: {
                                    transport: {
                                        read: "/Common/Common/GetPaymentTypeList"
                                    }
                                },
                                columns: [
                                    { field: "Name", title: "Payment Type", width: 150 }
                                ],
                                filter: "contains",
                                filterFields: ["Name"],
                                height: 400,

                                select: function (e) {
                                    var dataItem = this.dataItem(e.item.index());

                                    options.model.set("CreditCardId", dataItem.Id);
                                    options.model.set("CreditCardName", dataItem.Name);
                                },

                                change: function () {
                                    var value = this.value();
                                    var dataItem = this.dataItem();

                                    if (dataItem) {
                                        options.model.set("CreditCardId", dataItem.Id);
                                        options.model.set("CreditCardName", dataItem.Name);
                                    } else {
                                        options.model.set("CreditCardId", null);
                                        options.model.set("CreditCardName", null);
                                    }
                                }
                            });
                    }
                },

                {
                    field: "CardTotal",
                    title: "Payment Total",
                    width: 100,
                    attributes: { style: "text-align:right;" },

                    footerTemplate: "<b> #= kendo.toString(sum, 'n2') #</b>",
                    editor: function (container, options) {

                        var input = $('<input data-bind="value:' + options.field + '"/>')
                            .appendTo(container)
                            .kendoNumericTextBox({
                                min: 0.01,
                                max: 999999999999999.99,
                                decimals: 2,
                                step: 1.00,
                                format: "n2",
                                spinners: false
                            });

                        var numeric = input.data("kendoNumericTextBox");

                        input.on("input", function () {

                            var value = this.value;

                            value = value.replace(/[^0-9.]/g, '');

                            var parts = value.split(".");
                            if (parts.length > 2) {
                                value = parts[0] + "." + parts[1];
                                parts = value.split(".");
                            }

                            if (parts[0].length > 15) {
                                parts[0] = parts[0].substring(0, 15);
                            }

                            if (parts[1] && parts[1].length > 2) {
                                parts[1] = parts[1].substring(0, 2);
                            }

                            value = parts.join(".");

                            if (parseFloat(value) <= 0) {
                                value = "0.01";
                            }

                            this.value = value;
                        });

                        numeric.bind("change", function () {
                            var value = this.value();
                            if (!value || value <= 0) {
                                this.value(0.01);
                            }
                        });
                    }
                },
                {
                    field: "Remarks",
                    title: "Remarks",
                    width: 150,
                    editor: function (container, options) {

                        var input = $('<input data-bind="value:' + options.field + '"/>')
                            .appendTo(container)
                            .attr("maxlength", 250)
                            .kendoMaskedTextBox({});

                        input.on("paste", function (e) {
                            e.preventDefault();
                        });
                        input.on("keypress", function (e) {
                            var char = String.fromCharCode(e.which || e.keyCode);
                            if (/[;'"<>\\]/.test(char)) {
                                e.preventDefault();
                            }
                        });

                        input.on("input", function () {
                            var value = this.value;
                            value = value.replace(/[;'"<>\\]/g, '');
                            if (value.length > 250) {
                                value = value.substring(0, 250);
                            }
                            this.value = value;
                        });
                    }
                },
                {
                    command: [{ name: "destroy", iconClass: "k-icon k-i-trash", text: "" }],
                    title: "&nbsp;",
                    width: 40
                }
            ]
        });



        function recalcItem(item) {

            var qty = item.Quantity || 0;
            var rate = item.UnitRate || 0;
            var sdRate = item.SD || 0;
            var vatRate = item.VATRate || 0;

            // Calculate SubTotal
            var subTotal = qty * rate;
            item.set("SubTotal", subTotal);

            // Calculate SD Amount
            var sdAmount = (subTotal * sdRate) / 100;
            item.set("SDAmount", sdAmount);

            // Calculate VAT Amount
            var sdPlus = subTotal + sdAmount;
            var vatAmount = (sdPlus * vatRate) / 100;
            item.set("VATAmount", vatAmount);

            // Calculate LineTotal
            var total = sdPlus + vatAmount;
            item.set("LineTotal", total);
        }
        function updateSaleSummary() {
            // SaleDetails


            var saleGrid = $("#saleDetails").data("kendoGrid");
            var saleData = saleGrid ? saleGrid.dataSource.data() : [];

            // CardDetails
            var cardGrid = $("#cardDetails").data("kendoGrid");
            var cardData = cardGrid ? cardGrid.dataSource.data() : [];

            // Calculate SubTotals
            var subTotal = 0;
            var sdTotal = 0;
            var vatTotal = 0;
            var lineTotal = 0;

            saleData.forEach(function (item) {
                subTotal += item.SubTotal || 0;
                sdTotal += item.SDAmount || 0;
                vatTotal += item.VATAmount || 0;
                lineTotal += item.LineTotal || 0;
            });

            $("#subTotalSubtotal").val(subTotal.toFixed(2));
            $("#subTotalSD").val(sdTotal.toFixed(2));
            $("#SDAmount").val(sdTotal.toFixed(2));
            $("#subTotalVAT").val(vatTotal.toFixed(2));
            $("#VATAmount").val(vatTotal.toFixed(2));
            $("#SubTotal").val(lineTotal.toFixed(2));

            var decimalPart = lineTotal - Math.floor(lineTotal);
            $("#RoundUp").val(decimalPart.toFixed(2));
            $("#FinalPayable").val(Math.floor(lineTotal));

            // ---- Payment Calculation ----
            var cardTotalSum = 0;
            cardData.forEach(function (item) {
                cardTotalSum += item.CardTotal || 0;
            });

            // Take Advance from only first row of saleDetails
            var advance = saleData.length > 0 ? (saleData[0].Advance || 0) : 0;

            var payment = cardTotalSum + advance;
            $("#AdvancePayment").val(advance.toFixed(2));

            $("#Payment").val(cardTotalSum.toFixed(2));

            // Dues = FinalPayable - Payment
            var finalPayable = Math.floor(lineTotal);
            $("#Dues").val((finalPayable - payment).toFixed(2));
        }


        $('#details').on('click', "input.txt" + "ProductName", function () {


            var originalRow = $(this);
            CommonService.productForSaleModal({}, fail, function (row) { productModalDblClick(row, originalRow) },
                function () {
                    originalRow.closest("td").find("input").data('touched', false);
                    originalRow.closest("td").find("input").focus();
                });
            $("#myModal1").modal("hide");
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


        $("#frmEntry").validate({
            ignore: "#details input, #details select, #details textarea"
        });


        $(document).on("click", ".add-product-btn", function () {
            var productId = $(this).data("id");
            addProductToGridWithQty(productId);
        });

        $(document).on("click", ".qty-plus", function () {

            var id = $(this).data("id");
            var input = $("#qty_" + id);

            var val = parseInt(input.val()) || 1;
            input.val(val + 1);
        });

        $(document).on("click", ".qty-minus", function () {

            var id = $(this).data("id");
            var input = $("#qty_" + id);

            var val = parseInt(input.val()) || 1;

            if (val > 1) {
                input.val(val - 1);
            }
        });


        $(document).on("click", "#btnAddProductGrid", function () {
            openProductCardModal(null);
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

                        openProductCardModal(options.model); 
                    })
            )
            .appendTo(wrapper);

        kendo.bind(container, options.model);
    }


    function loadPurchaseOrderDetails(saleOrderId) {

        $.ajax({
            url: "/DMS/SaleOrder/GetSaleOrderList",
            type: "GET",
            data: { saleOrderId: saleOrderId },
            success: function (data) {

                if (!data || data.length === 0) {
                    TotalCalculation();
                    return;
                }

                /* ================= MASTER ================= */
                var master = data[0];

                // Customer autofill
                if (master.CustomerId) {
                    var customerCombo =
                        $("#CustomerId").data("kendoMultiColumnComboBox") ||
                        $("#CustomerId").data("kendoComboBox");

                    if (customerCombo) {
                        customerCombo.value(master.CustomerId);
                        customerCombo.trigger("change");
                    }
                }

                // Invoice date autofill
                if (master.OrderDate) {
                    var date = new Date(master.OrderDate);
                    if (!isNaN(date.getTime())) {
                        $("#InvoiceDateTime").val(date.toISOString().slice(0, 10));
                    }
                }

                // DeliveryAddress autofill
                if (master.DeliveryAddress) {
                    $("#DeliveryAddress").val(master.DeliveryAddress);
                }

                /* ================= DETAILS ================= */

                if (!master.saleDetailsList || master.saleDetailsList.length === 0) {
                    TotalCalculation();
                    return;
                }

                var saleDetailsGrid = $("#saleDetails").data("kendoGrid");
                var gridData = saleDetailsGrid.dataSource.data();

                master.saleDetailsList.forEach(function (item) {

                    // Duplicate Product check
                    var exists = gridData.some(function (g) {
                        return g.ProductId === item.ProductId;
                    });

                    if (!exists) {

                        saleDetailsGrid.dataSource.add({
                            SLNo: gridData.length + 1,
                            Id: item.Id,
                            ProductId: item.ProductId,
                            ProductName: item.ProductName,
                            Quantity: item.Quantity,
                            UnitRate: item.UnitRate,
                            SubTotal: item.SubTotal,
                            VATAmount: item.VATAmount,
                            SDAmount: item.SDAmount,
                            VATRate: item.VATRate,
                            SD: item.SD,
                            LineTotal: item.LineTotal,
                            Remarks: item.Remarks
                        });

                    }

                });

                TotalCalculation();
            },
            error: function () {
                alert("Failed to load sale order details.");
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

    function GetProductGroupComboBox() {
        var ProductGroupComboBox = $("#ProductGroupId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [
                { field: "Code", title: "Code", width: 100 },
                { field: "Name", title: "Name", width: 150 },
                //    { field: "Description", title: "Description", width: 200 },
            ],
            filter: "contains",
            filterFields: ["Code", "Name", "Description"],
            dataSource: {
                transport: {
                    //read: "/Common/Common/GetProductGroupList"
                    read: "/Common/Common/GetProductGroupList?value=" + getProductGroupId

                }
            },
            placeholder: "Select Product Group",
            value: "",
            dataBound: function (e) {

                if (getProductGroupId) {
                    this.value(parseInt(getProductGroupId));
                }
            },

        }).data("kendoMultiColumnComboBox");
    };

    function openProductCardModal(groupId) {

        var wnd = $("#productCardModal").data("kendoWindow");

        $.ajax({
            url: "/Common/Common/ProductModal",
            type: "GET",
            success: function (data) {

                allProducts = data;

                var filtered;

                // 🔥 group থাকলে filter, না থাকলে সব
                if (!groupId) {
                    filtered = data;
                } else {
                    filtered = data.filter(x => x.ProductGroupId == groupId);
                }

                // 🔥 render প্রথমে
                renderProductCardsInModal(filtered);

                // 🔥 modal open
                wnd.center().open();

                // 🔥 GROUP LOAD (IMPORTANT)
                setTimeout(function () {

                    var groupDropdown = $("#modalProductGroup");

                    if (!groupDropdown.length) return;

                    groupDropdown.empty().append('<option value="">All Group</option>');

                    var groups = [];

                    allProducts.forEach(function (item) {
                        if (item.ProductGroupId &&
                            !groups.find(x => x.id == item.ProductGroupId)) {

                            groups.push({
                                id: item.ProductGroupId,
                                name: item.ProductGroupName
                            });
                        }
                    });

                    groups.forEach(function (g) {
                        groupDropdown.append(
                            `<option value="${g.id}">${g.name}</option>`
                        );
                    });

                    // 🔥 যদি বাইরে থেকে group আসে → select করে দাও
                    if (groupId) {
                        groupDropdown.val(groupId);
                    }

                }, 200);

                // 🔥 search box focus
                setTimeout(() => {
                    $("#productSearchInput").focus();
                }, 300);
            },

            error: function () {
                alert("Failed to load products");
            }
        });
    }



    function renderProductCardsInModal(products) {

        var html = `

    <!-- 🔍 SEARCH + 🏷️ GROUP -->
    <div style="margin-bottom:12px; display:flex; gap:10px; align-items:center;">

        <!-- 🏷️ PRODUCT GROUP -->
        <select id="modalProductGroup"
                class="form-control form-control-sm"
                style="max-width:200px;">
            <option value="">All Group</option>
        </select>

        <!-- 🔍 SEARCH -->
        <input type="text" id="productSearchInput"
               class="form-control form-control-sm"
               placeholder="🔍 Search by Product Name or Code..."
               style="max-width:250px;" />

        <!-- TOTAL -->
        <span style="font-size:12px; color:#777;">
            Total: ${products.length} items
        </span>

    </div>

    <div class="product-grid">
    `;

        // 🔥 যদি কোন product না থাকে
        if (!products || products.length === 0) {
            html += `
            <div style="grid-column:1/-1; text-align:center; padding:30px; color:#999;">
                No product found 😔
            </div>
        `;
        }

        products.forEach(function (item) {

            var imgPath = item.ImagePath
                ? item.ImagePath
                : "/images/no-image.png";

            html += `
        <div class="product-card">

            <div class="product-img">
                <img src="${imgPath}"
                     onerror="this.src='/images/no-image.png'" />
            </div>

            <div class="product-info">
                <div class="tooltipMain">
                    <h6 class="product-title">
                        ${item.ProductName || ''}
                    </h6>
                    <span class="tooltip-text">${item.ProductName || ''}</span>
                </div>

                <div class="product-meta">
                    <span>Code: ${item.ProductId || ''}</span>
                    <span class="price">৳ ${item.SalesPrice || 0}</span>
                </div>
            </div>

            <!-- QTY -->
            <div class="qty-modern">

                <button class="qty-side qty-minus"
                        data-id="${item.ProductId}">
                    −
                </button>

                <div class="qty-center">
                    <input type="number" min="1" value="1"
                           id="qty_${item.ProductId}" />
                </div>

                <button class="qty-side qty-plus"
                        data-id="${item.ProductId}">
                    +
                </button>

            </div>

            <button class="btn btn-success btn-sm add-product-btn add-btn"
                    data-id="${item.ProductId}">
                Add
            </button>

        </div>
        `;
        });

        html += '</div>';

        $("#productCardContainer").html(html);
    }

    $(document).on("click", ".product-img img", function () {
        var src = $(this).attr("src");

        $("#modalImg").attr("src", src);
        $("#imageModal").fadeIn(200).css("display", "flex");
    });


    $(".close-modal").on("click", function () {
        $("#imageModal").fadeOut(200);
    });


    $("#imageModal").on("click", function (e) {
        if (e.target.id === "imageModal") {
            $(this).fadeOut(200);
        }
    });


    function addProductToGridWithQty(productId) {

        var item = allProducts.find(x => x.ProductId == productId);
        if (!item) return;

        var qty = parseFloat($("#qty_" + productId).val()) || 1;

        var grid = $("#saleDetails").data("kendoGrid");
        if (!grid) return;

        var existing = grid.dataSource.data().find(x => x.ProductId == item.ProductId);

        if (existing) {
            existing.set("Quantity", existing.Quantity + qty);
        } else {
            grid.dataSource.add({
                ProductId: item.ProductId,
                ProductName: item.ProductName,
                UOMId: item.UOMId,
                UOMName: item.UOMName,
                Quantity: qty,
                UnitRate: item.SalesPrice,
                VATRate: item.VATRate || 0,
                SD: item.SDRate || 0
            });
        }

        grid.refresh();

    }

    function TotalCalculation() {

        let subTotal = 0;
        let totalSD = 0;
        let totalVAT = 0;
        let grandTotal = 0;

        $('#details tbody tr').each(function () {
            const row = $(this);

            subTotal += parseFloat(row.find('.td-SubTotal').text().replace(/,/g, '')) || 0;
            totalSD += parseFloat(row.find('.td-SDAmount').text().replace(/,/g, '')) || 0;
            totalVAT += parseFloat(row.find('.td-VATAmount').text().replace(/,/g, '')) || 0;
            grandTotal += parseFloat(row.find('.td-LineTotal').text().replace(/,/g, '')) || 0;
        });

        const dp = parseInt(decimalPlace || 2);

        // 🔥 AUTOFILL GRAND BLOCK (CLASS BASED)
        $(".trGrandSubTotal").val(subTotal.toFixed(dp));
        $(".trGrandTotalSDAmount").val(totalSD.toFixed(dp));
        $(".trGrandTotalVATAmount").val(totalVAT.toFixed(dp));
        $(".trGrandTotal").val(grandTotal.toFixed(dp));

        // 🔹 Optional: Paid Amount = Grand Total
        $(".trGrandTotalAmount").val(grandTotal.toFixed(dp));
    }



    function save($table) {
        debugger;
        var model = serializeInputs("frmEntry");

        // 🔥 TOTAL CALCULATION
        model.SDAmount = parseFloat($("#subTotalSD").val()) || 0;
        model.VATAmount = parseFloat($("#subTotalVAT").val()) || 0;
        model.TotalSD = model.SDAmount;
        model.TotalVAT = model.VATAmount;
        model.GrandTotal = parseFloat($("#SubTotal").val()) || 0;
        model.PaidAmount = parseFloat($("#Payment").val()) || 0;

        // 🔥 Transaction Type
        var saleorder = $("#SaleOrderId").val();
        model.TransactionType = saleorder > 0 ? 'SaleOrder' : 'Sale';

        // =========================
        // 🔥 SALE DETAILS FIX
        // =========================
        var details = [];
        var grid = $("#saleDetails").data("kendoGrid");

        if (grid) {
            var dataItems = grid.dataSource.view();

            for (var i = 0; i < dataItems.length; i++) {

                var item = dataItems[i];

                var finalProductId = item.ProductId || item.ItemId;

                // ❌ FIX 1: Product validation
                if (!finalProductId || finalProductId <= 0) {
                    ShowNotification(3, "Please select product in row " + (i + 1));
                    return;
                }

                // ❌ FIX 2: Quantity validation
                if (!item.Quantity || item.Quantity <= 0) {
                    ShowNotification(3, "Quantity must be greater than zero (Row " + (i + 1) + ")");
                    return;
                }

                details.push({
                    Id: item.Id || 0,
                    ProductId: finalProductId,
                    ProductName: item.ProductName || "",
                    UOMId: item.UOMId || 0,
                    UOMName: item.UOMName || "",
                    Quantity: item.Quantity,
                    UnitRate: item.UnitRate || 0,
                    SubTotal: item.SubTotal || 0,
                    VATAmount: item.VATAmount || 0,
                    SDAmount: item.SDAmount || 0,
                    VATRate: item.VATRate || 0,
                    SD: item.SD || 0,
                    LineTotal: item.LineTotal || 0,
                    Action: item.Action || "Add"
                });
            }
        }

        // ❌ FIX 3: No item check
        if (details.length === 0) {
            ShowNotification(3, "At least one Sale Detail entry is required.");
            return;
        }

        // =========================
        // 🔥 PAYMENT DETAILS FIX
        // =========================
        var cardDetails = [];
        var cardGrid = $("#cardDetails").data("kendoGrid");

        if (cardGrid) {
            var cardItems = cardGrid.dataSource.view();

            for (var i = 0; i < cardItems.length; i++) {

                var cardItem = cardItems[i];

                // ❌ FIX 4: Payment validation
                if (!cardItem.CreditCardId || cardItem.CreditCardId <= 0) {
                    ShowNotification(3, "Please select payment type (Row " + (i + 1) + ")");
                    return;
                }

                if (!cardItem.CardTotal || cardItem.CardTotal <= 0) {
                    ShowNotification(3, "Payment amount must be greater than zero (Row " + (i + 1) + ")");
                    return;
                }

                cardDetails.push({
                    Id: cardItem.Id || 0,
                    CreditCardId: cardItem.CreditCardId,
                    CardTotal: cardItem.CardTotal,
                    Remarks: cardItem.Remarks || ""
                });
            }
        }

        if (cardDetails.length === 0) {
            ShowNotification(3, "Please complete the payment.");
            return;
        }

        // =========================
        // 🔥 FINAL MODEL
        // =========================
        model.SaleOrderId = saleorder;
        model.saleDetailsList = details;
        model.saleCreditCardList = cardDetails;

        // =========================
        // 🔥 SAVE API CALL
        // =========================
        CommonAjaxService.finalSave(
            "/DMS/Sale/CreateEdit",
            model,
            saveDone,
            saveFail
        );
    }
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
        debugger;
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


    function addRow($table) {

        if ($("#IsManualSale").val() !== "True") {
            ShowNotification(3, "You cannot add new item here.");
            return;
        }

        var rowCount = $table.find('tbody tr').length + 1;

        var row = `
    <tr>
        <!-- 1: SL -->
        <td>${rowCount}</td>

        <!-- 2: ProductCode (hidden) -->
        <td hidden></td>

        <!-- 3: ProductName -->
        <td>
            <input type="text" class="form-control txtProductName" />
        </td>

        <!-- 4: ProductId (hidden) -->
        <td hidden></td>

        <!-- 5: OrderQuantity -->
        <td class="dFormat">0</td>

        <!-- 6: CompletedQty -->
        <td class="dFormat">0</td>

        <!-- 7: RemainQty -->
        <td class="dFormat">0</td>

        <!-- 8: Quantity -->
        <td class="td-Quantity dFormat">1</td>

        <!-- 9: UnitRate -->
        <td class="td-UnitRate dFormat">0</td>

        <!-- 10: SubTotal -->
        <td class="td-SubTotal dFormat">0</td>

        <!-- 11: SD -->
        <td class="td-SD dFormat">0</td>

        <!-- 12: SDAmount -->
        <td class="td-SDAmount dFormat">0</td>

        <!-- 13: VATRate -->
        <td class="td-VATRate dFormat">0</td>

        <!-- 14: VATAmount -->
        <td class="td-VATAmount dFormat">0</td>

        <!-- 15: LineTotal -->
        <td class="td-LineTotal dFormat">0</td>

        <!-- 16: SaleOrderId (hidden) -->
        <td hidden></td>

        <!-- 17: SaleOrderDetailId (hidden) -->
        <td hidden class="td-SaleOrderDetailId"></td>

        <!-- 18: Action -->
        <td>
            <button type="button" class="btn btn-danger btn-sm remove-row-btn">
                <i class="fa fa-trash"></i>
            </button>
        </td>
    </tr>`;

        $table.find('tbody').append(row);
    }

    return {
        init: init
    }

}(CommonService, CommonAjaxService);







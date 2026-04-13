var SaleController = function (CommonService, CommonAjaxService) {


    var init = function () {

        getCustomerId = $("#CustomerId").val() || 0;
        getSaleOrderId = $("#SaleOrderId").val() || 0;
        var isManualSale = $("#IsManualSale").val() === "True";


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
        LoadItemsGrid();

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


        $("#saleDetails").on("click", "td.product-cell", function () {
            var grid = $("#saleDetails").data("kendoGrid");
            var dataItem = grid.dataItem($(this).closest("tr"));
            OpenProductPopup(dataItem);
        });
     

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

                    var finalProductId = 0;

                    if (item.ProductId && item.ProductId > 0) {
                        finalProductId = item.ProductId;
                    } else if (item.ItemId && item.ItemId > 0) {
                        finalProductId = item.ItemId;
                    }

                    if (finalProductId < 0) {
                        ShowNotification(3, "Item is required in sale details.");
                        return;
                    }

                    if (!item.Quantity || item.Quantity < 0) {
                        ShowNotification(3, "Quantity must be greater than zero.");
                        return;
                    }

                    details.push({
                        Id: item.Id,
                        ProductId: finalProductId,
                        ProductName: item.ProductName || item.ItemName,
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
                        Action: item.Action
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


            Confirmation("Are you sure? Do You Want to " + status + " Data?", result => {
                if (result) save();
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


        $(document).on('click', '.remove-row-btn', function () {

            if ($("#IsManualSale").val() !== "True") {
                ShowNotification(3, "Row delete is not allowed here.");
                return;
            }

            $(this).closest('tr').remove();
            TotalCalculation();
        });



        $("#btnSearchPurchaseOrder").on("click", function () {
            $('#FromDate').val($('#InvoiceDateTime').val());

            poWindow.center().open();

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

        var poWindow = $("#poWindow").kendoWindow({
            title: "Sale Order",
            modal: true,
            width: "900px",
            height: "600px",
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
            toolbar: [{ name: "create", text: "Add" }],
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
                    width: 100,
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
                    width: 100,
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
                    title: "Line Total",
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


    // ============================================================
    // PRODUCT POPUP WINDOW (SEARCHABLE PRODUCT LIST)
    // ============================================================

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
                        url: "/Common/Common/GetProductModal" // API for Product list
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

    function LoadItemsGrid() {
        $("#items").kendoListView({
            dataSource: {
                transport: {
                    read: {
                        url: "/Common/Common/GetProductModal",
                        dataType: "json"
                    }
                }
            },

            template: `
        <div class="item-card">

            <h5>#: Name #</h5>

            <div class="item-image">
                <img src="#: Image #" alt="#: Name #" />
            </div>

            <div class="item-info">
                <div><b>UOM:</b> #: UomName #</div>
                <div><b>Cost:</b> #: kendo.toString(PurchasePrice,'n2') #</div>
                <div><b>VAT:</b> #: VATRate # %</div>
                <div><b>SD:</b> #: SDRate # %</div>
            </div>


            <div class="card-actions">
                <input type='number' class='qty' value='1' min='1' />
                <button class='addToCart'
                        data-id='#: Id #' 
                        data-name='#: Name #'
                        data-uom='#: UomName #'
                        data-uomid='#: UomId #'
                        data-price='#: PurchasePrice #'
                        data-vat='#: VATRate #'
                        data-sd='#: SDRate #'>
                    Add
                </button>
            </div>

        </div>
        `,

            dataBound: function () {
                $(".addToCart").off("click").on("click", function () {

                    var item = {
                        Id: $(this).data("id"),
                        Name: $(this).data("name"),
                        UomId: $(this).data("uomid"),
                        UomName: $(this).data("uom"),
                        PurchasePrice: $(this).data("price"),
                        VATRate: $(this).data("vat"),
                        SDRate: $(this).data("sd"),
                        Quantity: $(this).closest(".item-card").find(".qty").val()
                    };

                    AddItemToSaleDetails(item);
                });
            }
        });
    }


    function AddItemToSaleDetails(item) {

        var grid = $("#saleDetails").data("kendoGrid");

        var detailRow = grid.dataSource.add({
            ProductId: item.Id,
            ProductName: item.Name,
            UOMId: item.UomId,
            UOMName: item.UomName,
            Quantity: parseFloat(item.Quantity),
            UnitRate: parseFloat(item.PurchasePrice),
            VATRate: item.VATRate || 0,
            SD: item.SD || 0
        });

        var qty = detailRow.Quantity || 0;
        var unit = detailRow.UnitRate || 0;
        var sdRate = detailRow.SD || 0;
        var vatRate = detailRow.VATRate || 0;

        var subTotal = qty * unit;
        detailRow.set("SubTotal", subTotal);

        var sdAmount = (subTotal * sdRate) / 100;
        detailRow.set("SDAmount", sdAmount);

        var vatAmount = ((subTotal + sdAmount) * vatRate) / 100;
        detailRow.set("VATAmount", vatAmount);

        var total = subTotal + sdAmount + vatAmount;
        detailRow.set("LineTotal", total);

        grid.refresh();
    }



    function ApplyProductSelection(detailRow, item) {
        debugger;
        console.log(item);
        detailRow.set("ProductId", item.ProductId);
        detailRow.set("ProductName", item.ProductName);

        detailRow.set("UOMId", item.UOMId);
        detailRow.set("UOMName", item.UOMName);

        // Cost Price → UnitRate
        detailRow.set("UnitRate", item.SalesPrice);

        // Setting Rates
        detailRow.set("VATRate", item.VATRate);
        detailRow.set("SD", item.SDRate);

        // Default quantity if empty
        if (!detailRow.Quantity || detailRow.Quantity <= 0) {
            detailRow.set("Quantity", 1);
        }

        // Auto-calc subtotal
        detailRow.set("SubTotal", detailRow.Quantity * detailRow.SalesPrice);

        // SD Amount
        var sdAmt = (detailRow.SubTotal * (detailRow.SD || 0)) / 100;
        detailRow.set("SDAmount", sdAmt);

        // VAT Amount
        var vatAmt = ((detailRow.SubTotal + sdAmt) * (detailRow.VATRate || 0)) / 100;
        detailRow.set("VATAmount", vatAmt);

        // Line Total
        detailRow.set("LineTotal", detailRow.SubTotal + sdAmt + vatAmt);
    }



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
                                param.field = "s.Name";
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
                                param.field = "s.Name";
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
                        { field: "ProductName", title: "Product Name", sortable: true, width: 120, footerTemplate: "Total:" },
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
                    selectable: true, width: 40
                },
                {
                    title: "Action",
                    width: 90,
                    template: function (dataItem) {

                        return `
                                <a href="/DMS/Sale/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                                    <i class="fas fa-pencil-alt"></i>
                                </a>
                           <a href="/DMS/Sale/getReport/${dataItem.Id}" 
                          class="btn btn-success btn-sm mr-2 getReport" 
                          title="Report">
                           <i class="fas fa-file-alt"></i>
                      </a>  `

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
                { field: "Comments", title: "Comments", sortable: true, width: 250, hidden: true },
                { field: "BranchName", title: "Branch Name", sortable: true, hidden: true, width: 200 },
                { field: "CompanyName", title: "Company Name ", sortable: true, hidden: true, width: 200 }


            ],
            editable: false,
            selectable: "multiple row",
            navigatable: true,
            columnMenu: true
        });

    };

    function save($table)

 {
        debugger;

        var validator = $("#frmEntry").validate();
        if (!validator.form()) {
            validator.focusInvalid();
            return;
        }
        var model = serializeInputs("frmEntry");

        var sdTotalAmount = parseFloat($("#subTotalSD").val()) || 0;
        var vatTotalAmount = parseFloat($("#subTotalVAT").val()) || 0;
        var totalSD = parseFloat($("#subTotalSD").val()) || 0;
        var totalVAT = parseFloat($("#subTotalVAT").val()) || 0;
        var grandTotal = parseFloat($("#SubTotal").val()) || 0;
        var paidAmount = parseFloat($("#Payment").val()) || 0;

        debugger;
        model.SDAmount = sdTotalAmount;
        model.VATAmount = vatTotalAmount;
        model.TotalSD = totalSD;
        model.TotalVAT = totalVAT;
        model.GrandTotal = grandTotal;
        model.PaidAmount = paidAmount;
        debugger;
        var saleorder = $("#SaleOrderId").val();

        if (saleorder > 0) {
            model.TransactionType = 'SaleOrder';
        }
        else {
            model.TransactionType = 'Sale';
        }

        var details = [];

        var grid = $("#saleDetails").data("kendoGrid");
        if (grid) {

            var dataItems = grid.dataSource.view();

            for (var i = 0; i < dataItems.length; i++) {

                var item = dataItems[i];

                details.push({

                    Id: item.Id,

                    ProductId: item.ProductId,
                    //ProductId: item.ItemId,
                    ProductName: item.ProductName,
                    //ProductName: item.ItemName,
                    UOMId: item.UOMId,
                    UOMName: item.UOMName,

                    Quantity: item.Quantity,
                    //UnitCostPrice: item.UnitCostPrice,
                    UnitRate: item.UnitRate,
                    SubTotal: item.SubTotal,
                    VATAmount: item.VATAmount,
                    SDAmount: item.SDAmount,
                    VATRate: item.VATRate,
                    SD: item.SD,
                    LineTotal: item.LineTotal,
                    Action: item.Action
                });
            }
        }
        var cardDetails = [];
        var cardGrid = $("#cardDetails").data("kendoGrid");
        if (cardGrid) {
            var cardItems = cardGrid.dataSource.view();
            for (var i = 0; i < cardItems.length; i++) {
                var cardItem = cardItems[i];
                cardDetails.push({
                    Id: cardItem.Id,
                    CreditCardId: cardItem.CreditCardId,
                    CardTotal: cardItem.CardTotal,
                    Remarks: cardItem.Remarks
                });
            }
        }

        model.SaleOrderId = $("#SaleOrderId").val();
        model.saleCreditCardList = cardDetails;

        if (details.length === 0) {
            ShowNotification(3, "At least one Sale Detail entry is required.");
            return;
        }


        model.saleDetailsList = details;
        model.saleCreditCardList = cardDetails;

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







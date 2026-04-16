var PurchaseReturnController = function (CommonService, CommonAjaxService) {

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

        getSupplierId = $("#SupplierId").val() || 0;

        decimalPlace = $("#DecimalPlace").val() || 2;
        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';

        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();
        };

        if (getOperation !== '') {
            GetSupplierComboBox();
            TotalCalculation();
        };        


        $("#saleOrderDetails").on("click", "td.product-cell", function () {
            var grid = $("#saleOrderDetails").data("kendoGrid");
            var dataItem = grid.dataItem($(this).closest("tr"));
            OpenProductPopup(dataItem);
        });

        //var $table = $('#details');

        //var table = initEditTable($table, { searchHandleAfterEdit: false });
        

        //$('#addRows').on('click', function (e) {

        //    addRow($table);
        //});


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

            //var details = serializeTable($table);

            var requiredFields = ['ProductName', 'Quantity'];
            var fieldMappings = {
                'ProductName': 'Product Name',
                'Quantity': 'Quantity'
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
                            var url = "/DMS/PurchaseReturn/MultiplePost";
                            CommonAjaxService.multiplePost(url, model, processDone, fail);
                        }
                    }
                });
        });



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

                                // ✅ limit control
                                if (value > 100) {
                                    value = 100;
                                    this.value(100);
                                }

                                // ✅ model update
                                options.model.set("SD", value);

                                var grid = $("#saleOrderDetails").data("kendoGrid");

                                var subTotal = options.model.SubTotal || 0;
                                var other = options.model.OthersAmount || 0;

                                var sdAmount = (subTotal * value) / 100;
                                options.model.set("SDAmount", sdAmount);

                                var vatAmount = ((subTotal + sdAmount) * (options.model.VATRate || 0)) / 100;
                                options.model.set("VATAmount", vatAmount);

                                var lineTotal = subTotal + sdAmount + vatAmount;

                                var withother = lineTotal + other;

                                options.model.set("LineTotal", withother);

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

                                // ✅ limit control
                                if (value > 100) {
                                    value = 100;
                                    this.value(100);
                                }

                                // ✅ model update
                                options.model.set("VATRate", value);

                                var grid = $("#saleOrderDetails").data("kendoGrid");

                                var subTotal = options.model.SubTotal || 0;
                                var other = options.model.OthersAmount || 0;

                                var sdAmount = (subTotal * (options.model.SD || 0)) / 100;

                                var vatAmount = ((subTotal + sdAmount) * value) / 100;
                                options.model.set("VATAmount", vatAmount);

                                var lineTotal = subTotal + sdAmount + vatAmount;

                                var withother = lineTotal + other;

                                options.model.set("LineTotal", withother);

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
                    editable: false,
                    attributes: { style: "text-align:right;" },
                    editor: function (container, options) {
                        var input = $('<input name="' + options.field + '"/>');
                        input.appendTo(container).kendoNumericTextBox({
                            format: "n2",
                            decimals: 2,
                            change: function () {
                                var grid = $("#saleOrderDetails").data("kendoGrid");

                                // Update the model value for Quantity
                                options.model.set("OthersAmount", this.value());

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

                                // Refresh the grid to update footer aggregates
                                grid.refresh();
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


        }


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


        $('#details').on('click', 'input.txtProductName', function () {
            var originalRow = $(this);
            $('#FromDate').val($('#PurchaseReturnDate').val());
            originalRow.closest("td").find("input").data('touched', true);
            CommonService.productForPurchaseModal(
       
                function success(result) {
                    console.log("Modal opened successfully.");
                },
                function fail(error) {
                    originalRow.closest("td").find("input").data("touched", false).focus();
                    console.error("Error opening modal:", error);
                },
                function dblClick(row) {
                    debugger;
                    productModalDblClick(row, originalRow);
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
                window.location.href = "/DMS/PurchaseReturn/NextPrevious?id=" + getId + "&status=Previous";
            }
        });

        $('#btnNext').click('click', function () {
            var getId = $('#Id').val();
            if (parseInt(getId) > 0) {
                window.location.href = "/DMS/PurchaseReturn/NextPrevious?id=" + getId + "&status=Next";
            }
        });
       

        // Kendo Window Initialization
        var myWindow = $("#window");

        function onClose() {
            myWindow.fadeIn();
        };

        myWindow.kendoWindow({
            width: "1000px",
            title: "Purchase Form",
            visible: false,
            actions: ["Pin", "Minimize", "Maximize", "Close"],
            close: onClose
        }).data("kendoWindow").center();

        $(document).on('click', '.details-link', function () {
            
            var id = $(this).data('id');
            detailsData(id);
        });

    };

    function detailsData(id) {

        $.ajax({
            url: "/DMS/Purchase/GetPurchaseData?id=" + id,
            type: 'GET',
            success: function (data) {
                
                $("#PurchaseCode").val(data.Code);
                $("#PurchaseInvoiceDateTime").val(data.InvoiceDateTime);
                $("#PurchaseDate").val(data.PurchaseDate);
                $("#PurchaseSupplierId").val(data.SupplierName);
                $("#PurchaseCurrencyId").val(data.CurrencyName);
                $("#PurchaseBENumber").val(data.BENumber);
                $("#PurchaseImportIDExcel").val(data.ImportIDExcel);
                $("#PurchaseComments").val(data.Comments);

                var detailsTable = $("#purchaseDetails tbody");
                detailsTable.empty();

                var grandTotalAmount = 0;
                var grandSubTotal = 0;
                var grandTotalSDAmount = 0;
                var grandTotalVATAmount = 0;
                var grandTotal = 0;

                $.each(data.purchaseDetailList, function (index, detail) {
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


                $("#PurchaseGrandTotalAmount").val(grandTotalAmount.toLocaleString('en', { minimumFractionDigits: 2 }));
                $("#PurchaseGrandSubTotal").val(grandSubTotal.toLocaleString('en', { minimumFractionDigits: 2 }));
                $("#PurchaseGrandTotalSDAmount").val(grandTotalSDAmount.toLocaleString('en', { minimumFractionDigits: 2 }));
                $("#PurchaseGrandTotalVATAmount").val(grandTotalVATAmount.toLocaleString('en', { minimumFractionDigits: 2 }));
                $("#PurchaseGrandTotal").val(grandTotal.toLocaleString('en', { minimumFractionDigits: 2 }));

                $("#window").data("kendoWindow").open();
            },
            error: function (xhr, status, error) {
                alert("Error loading purchase data.");
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
            //change: function (e) {
                
            //}
        }).data("kendoMultiColumnComboBox");
    };

    function productModalDblClick(row, originalRow) {
        debugger;
        var dataTable = $("#modalData").DataTable();
        var rowData = dataTable.row(row).data();
        var ProductCode = rowData.ProductCode;
        var ProductId = rowData.ProductId;
        var ProductName = rowData.ProductName;
        var UOMId = rowData.UOMId;
        var UOMName = rowData.UOMName;
        var CostPrice = rowData.CostPrice;
        var PurchasePrice = rowData.PurchasePrice;
        var SDRate = rowData.SDRate;
        var VATRate = rowData.VATRate;
        var Conversion = rowData.UOMConversion;
        var Quantity = 1;

        // ✅ Check for duplicates before setting data
        var isDuplicate = false;
        $("#details tbody tr").each(function () {
            var existingProductId = $(this).find(".td-ProductId").text().trim();
            
            if (existingProductId && existingProductId === ProductId.toString()) {
                isDuplicate = true;
                // Optional: highlight the existing row
                $(this).addClass("duplicate-highlight");
                setTimeout(() => $(this).removeClass("duplicate-highlight"), 2000);
                return false; // stop loop
            }
        });

        if (isDuplicate) {
            ShowNotification(3, "This product has already been added!");
            $("#partialModal").modal("hide");
            return;
        }



        var $currentRow = originalRow.closest('tr');
        $currentRow.find('.td-ProductCode').text(ProductCode);
        $currentRow.find('.td-ProductName').text(ProductName);
        $currentRow.find('.td-ProductId').text(ProductId);
        $currentRow.find('.td-UnitPrice').text(PurchasePrice);
        $currentRow.find('.td-UOMName').text(UOMName);
        $currentRow.find('.td-UOMId').text(UOMId);
        $currentRow.find('.td-Quantity').text(Quantity);
        $currentRow.find('.td-InputQuantity').text(Quantity);
        $currentRow.find('.td-PcsQuantity').text(Quantity);
        $currentRow.find('.td-UnitRate').text(CostPrice);
        $currentRow.find('.td-SD').text(SDRate);
        $currentRow.find('.td-VATRate').text(VATRate);
        $currentRow.find('.td-UOMConversion').text(Conversion);
        $("#partialModal").modal("hide");
        originalRow.closest("td").find("input").data("touched", false).focus();
        $('#details').find(".td-Quantity").trigger('blur');

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
                    url: "/DMS/PurchaseReturn/GetGridData",
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
                            if (param.field === "BENumber") {
                                param.field = "H.BENumber";
                            }
                            if (param.field === "PurchaseDate" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "H.PurchaseDate";
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
                            if (param.field === "BENumber") {
                                param.field = "H.BENumber";
                            }
                          
                            if (param.field === "PurchaseDate" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "CONVERT(VARCHAR(10), H.PurchaseDate, 120)";
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
                    PurchaseReturnDate: { type: "date" },
                    PurchaseDate: { type: "date" },
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
          /*  search: ["Code", "SupplierName", "SupplierAddress", "Status", "Completed", "BENumber", "OrderDate", "DeliveryDateTime", "GrandTotalAmount", "GrandTotalSDAmount", "GrandTotalVATAmount", "Comments", "TransactionType", "CurrencyRateFromBDT", "CurrencyName", "FiscalYear", "BranchName", "BranchAddress"],*/
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
                                url: "/DMS/PurchaseReturn/GetPurchaseReturnDetailDataById",
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
                        { field: "SD", title: "SD Rate", sortable: true, width: 100,  format: "{0:n2}", attributes: { style: "text-align: right;" } },
                        { field: "SDAmount", title: "SD Amount", sortable: true, width: 100, footerTemplate: "#= kendo.toString(sum, 'n2') #", aggregates: ["sum"], format: "{0:n2}", attributes: { style: "text-align: right;" } },
                        { field: "VATRate", title: "VAT Rate", sortable: true, width: 100, attributes: { style: "text-align: right;" } },
                        { field: "VATAmount", title: "VAT Amount", sortable: true, width: 100, footerTemplate: "#= kendo.toString(sum, 'n2') #", aggregates: ["sum"], format: "{0:n2}", attributes: { style: "text-align: right;" } },
                        { field: "OthersAmount", title: "Others Amount", sortable: true, width: 100, footerTemplate: "#= kendo.toString(sum, 'n2') #", aggregates: ["sum"], format: "{0:n2}", attributes: { style: "text-align: right;" } },
                        { field: "LineTotal", title: "Line Total", sortable: true, width: 100, footerTemplate: "#= kendo.toString(sum, 'n2') #", aggregates: ["sum"], format: "{0:n2}", attributes: { style: "text-align: right;" } },
                        { field: "IsFixedVAT", hidden: true, title: "Is Fixed Vat", sortable: true, width: 100 },
                        { field: "VatType", hidden: true, title: "Vat Type", sortable: true, width: 100 }
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
            search: {
                fields: ["Id", "Code", "Status", "SupplierName", "BENumber", "FiscalYear", "BranchName", "PurchaseDate"]
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
                    width: 120,
                    template: function (dataItem) {
                        return `
                                <a href="/DMS/PurchaseReturn/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                                    <i class="fas fa-pencil-alt"></i>
                                </a>

                          <a href="/DMS/PurchaseReturn/getReport/${dataItem.Id}" 
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
                {
                    field: "PurchaseDate", title: "Purchase Date", sortable: true, width: 150, template: '#= kendo.toString(kendo.parseDate(PurchaseDate), "yyyy-MM-dd") #',
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

                { field: "BENumber", title: "BE Number", sortable: true, width: 150 },
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


        //var details = serializeTable($table);

        var requiredFields = ['ProductName', 'Quantity'];
        var fieldMappings = {
            'ProductName': 'Product Name',
            //'UOMName': 'UOM Name',
            'Quantity': 'Quantity'
        };

        var errorMessage = getRequiredFieldsCheckObj(details, requiredFields, fieldMappings);
        if (errorMessage) {
            ShowNotification(3, errorMessage);
            return;
        };

        model.purchaseReturnDetailList = details;

        var url = "/DMS/PurchaseReturn/CreateEdit";

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

        var url = "/DMS/PurchaseReturn/MultiplePost";

        CommonAjaxService.multiplePost(url, model, processDone, fail);
    };

    function processDone(result) {
        
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
        $('.details-link').prop('disabled', false);
    };

    return {
        init: init
    }


}(CommonService, CommonAjaxService);

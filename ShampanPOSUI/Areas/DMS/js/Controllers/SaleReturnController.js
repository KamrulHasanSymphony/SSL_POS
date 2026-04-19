var SaleReturnController = function (CommonService, CommonAjaxService) {

    var getCustomerId = 0;


    var init = function () {

        if ($("#IsPosted").length) {
            LoadCombo("IsPosted", '/Common/Common/GetBooleanDropDown');
            $("#IsPosted").val('');
            GetBranchList();
        };


        $(document).ready(function () {

            $(".kendoInvoiceDate").kendoDatePicker({
                format: "yyyy-MM-dd"
            });

        });

        getCustomerId = $("#CustomerId").val();

        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';

        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();
        };

        GetCustomerComboBox();
        
        var $table = $('#details');

        var table = initEditTable($table, { searchHandleAfterEdit: false });

        TotalCalculation();

        $('#addRows').on('click', function (e) {

            addRow($table);
        });



        $("#saleOrderDetails").on("click", "td.product-cell", function () {
            var grid = $("#saleOrderDetails").data("kendoGrid");
            var dataItem = grid.dataItem($(this).closest("tr"));
            OpenProductPopup(dataItem);
        });


        $('.btnsave').click(function (e) {
            e.preventDefault();  // Prevent default form submission

            // Validate the form using MVC validation
            var form = $("#frmEntry");
            var mvcValid = form.valid();  // jQuery form validation
            var customValid = CommonValidationHelper.CheckValidation("#frmEntry");  // Custom validation

            if (!mvcValid || !customValid) {
                return false;  // If validation fails, prevent submission
            }

            // Serialize form inputs
            var model = serializeInputs("frmEntry");

            // Check if the CustomerId is valid
            if (parseInt(model.CustomerId) === 0 || model.CustomerId === "") {
                ShowNotification(3, "Customer Is Required.");
                return;
            }

            // Check if the details section has any rows
            //var $table = $('#details');
            //if (!hasLine($table)) {
            //    ShowNotification(3, "Complete Details Entry");
            //    return;
            //}

            var details = [];
            var grid = $("#saleOrderDetails").data("kendoGrid");

            // If the grid exists, serialize the data
            if (grid) {
                var dataItems = grid.dataSource.view();  // Get the items from the grid

                // Iterate through the grid data and validate
                for (var i = 0; i < dataItems.length; i++) {
                    var item = dataItems[i];

                    // Check for valid ProductId (either ProductId or ItemId)
                    var finalProductId = item.ProductId > 0 ? item.ProductId : (item.ItemId > 0 ? item.ItemId : 0);
                    if (finalProductId <= 0) {
                        ShowNotification(3, "Item is required in sale details.");
                        return;
                    }

                    // Validate Quantity
                    if (!item.Quantity || item.Quantity <= 0) {
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

            // Check if details are not empty
            if (details.length === 0) {
                ShowNotification(3, "Complete Details first!");
                return;
            }

            // Required fields validation
            var requiredFields = ['ProductName', 'Quantity', 'UnitRate'];
            var fieldMappings = {
                'ProductName': 'Product Name',
                'Quantity': 'Quantity',
                'UnitRate': 'Unit Rate'
            };

            var errorMessage = getRequiredFieldsCheckObj(details, requiredFields, fieldMappings);
            if (errorMessage) {
                ShowNotification(3, errorMessage);
                return;
            }

            // Attach details to the model
            model.saleOrderDetailsList = details;

            // Determine if this is an update or a new record based on the Id
            var getId = $('#Id').val();
            var status = parseInt(getId) > 0 ? "Update" : "Save";

            // Ask for confirmation before saving
            Confirmation("Are you sure? Do You Want to " + status + " Data?", function (result) {
                if (result) {
                    save($table);  // Proceed with saving
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
                            model.IDs = model.Id; SaleReturnController
                            var url = "/DMS/SaleReturn/MultiplePost";
                            CommonAjaxService.multiplePost(url, model, postDone, fail);
                        }
                    }
                });
        });


        // =======================
        // LOAD DETAILS FROM JSON
        // =======================
        var detailsList = JSON.parse($("#SaleReturnDetailsJson").val() || "[]");

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
                        UnitRate: { type: "number", defaultValue: 0 },
                        SubTotal: { type: "number", defaultValue: 0 },
                        SDAmount: { type: "number", defaultValue: 0 },
                        VATAmount: { type: "number", defaultValue: 0 },
                        LineTotal: { type: "number", defaultValue: 0 },
                        VATRate: { type: "number", defaultValue: 0 },
                        SD: { type: "number", defaultValue: 0 }
                    }
                }
            },
            aggregate: [
                { field: "Quantity", aggregate: "sum" },
                { field: "SubTotal", aggregate: "sum" },
                { field: "LineTotal", aggregate: "sum" },
                { field: "SDAmount", aggregate: "sum" },
                { field: "VATAmount", aggregate: "sum" }
            ]
        });

        $("#saleOrderDetails").kendoGrid({
            dataSource: detailsGridDataSource,
            toolbar: [{ name: "create", text: "Add" }],
            editable: {
                mode: "incell",
                createAt: "bottom"
            },
            columns: [
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
                    width: 100,
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                    footerTemplate: "#= kendo.toString(sum || 0, 'n2') #",
                    aggregate: "sum",
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
                                var subTotal = options.model.Quantity * options.model.UnitRate;
                                options.model.set("SubTotal", subTotal);

                                var sdAmount = (subTotal * (options.model.SD || 0)) / 100;
                                options.model.set("SDAmount", sdAmount);

                                var vatAmount = ((subTotal + sdAmount) * (options.model.VATRate || 0)) / 100;
                                options.model.set("VATAmount", vatAmount);

                                var lineTotal = subTotal + sdAmount + vatAmount;
                                options.model.set("LineTotal", lineTotal);

                                // Refresh grid to update footer aggregates
                                grid.refresh();
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
                                format: "n2",
                                decimals: 2,
                                readonly: true
                            });

                        input.on("keydown paste cut", function (e) {
                            e.preventDefault();
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

                                // ✅ LIMIT APPLY
                                if (value > 100) {
                                    value = 100;
                                    this.value(100);
                                    alert("SD Rate cannot be more than 100%");
                                }

                                // ✅ IMPORTANT (model update)
                                options.model.set("SD", value);

                                var grid = $("#saleOrderDetails").data("kendoGrid");

                                var sdAmount = (options.model.SubTotal * value) / 100;
                                options.model.set("SDAmount", sdAmount);

                                var vatAmount = ((options.model.SubTotal + sdAmount) * (options.model.VATRate || 0)) / 100;
                                options.model.set("VATAmount", vatAmount);

                                var lineTotal = options.model.SubTotal + sdAmount + vatAmount;
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

                                // ✅ LIMIT APPLY
                                if (value > 100) {
                                    value = 100;
                                    this.value(100);
                                    alert("VAT Rate cannot be more than 100%");
                                }

                                // ✅ IMPORTANT (model update)
                                options.model.set("VATRate", value);

                                var grid = $("#saleOrderDetails").data("kendoGrid");

                                var sdAmount = (options.model.SubTotal * (options.model.SD || 0)) / 100;
                                var vatAmount = ((options.model.SubTotal + sdAmount) * value) / 100;
                                options.model.set("VATAmount", vatAmount);

                                var lineTotal = options.model.SubTotal + sdAmount + vatAmount;
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


    function ApplyProductSelection(detailRow, item) {
        debugger;
        console.log(item);

        // Set Product details
        detailRow.set("ProductId", item.ProductId);
        detailRow.set("ProductName", item.ProductName);
        detailRow.set("UOMId", item.UOMId);
        detailRow.set("UOMName", item.UOMName);

        // Set Cost Price → UnitRate (Sales Price)
        detailRow.set("UnitRate", item.SalesPrice);

        // Set Rates
        detailRow.set("VATRate", item.VATRate);
        detailRow.set("SD", item.SDRate);

        // Default quantity if empty
        if (!detailRow.Quantity || detailRow.Quantity <= 0) {
            detailRow.set("Quantity", 1);
        }

        // Auto-calculate SubTotal
        var subTotal = detailRow.Quantity * detailRow.UnitRate;  // UnitRate = SalesPrice
        detailRow.set("SubTotal", subTotal);

        // SD Amount: (SubTotal * SDRate) / 100
        var sdAmount = (subTotal * (detailRow.SD || 0)) / 100;
        detailRow.set("SDAmount", sdAmount);

        // VAT Amount: ((SubTotal + SDAmount) * VATRate) / 100
        var vatAmount = ((subTotal + sdAmount) * (detailRow.VATRate || 0)) / 100;
        detailRow.set("VATAmount", vatAmount);

        // Line Total = SubTotal + SDAmount + VATAmount
        var lineTotal = subTotal + sdAmount + vatAmount;
        detailRow.set("LineTotal", lineTotal);
    }
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

            autoBind: true,

            dataBound: function () {

                // ✅ If value is valid (>0), then set
                if (getCustomerId && getCustomerId !== "0") {
                    this.value(parseInt(getCustomerId));
                } else {
                    this.value("");   // 🔥 remove default 0
                }
            }

        }).data("kendoMultiColumnComboBox");
    }


    function computeSubTotal(row, param) {
        debugger;

        var qty = parseFloat(row.closest("tr").find("td.td-Quantity").text().replace(',', '').replace(',', ''));
        var unitCost = parseFloat(row.closest("tr").find("td.td-UnitRate").text().replace(',', '').replace(',', ''));

        var SDRate = parseFloat(row.closest("tr").find("td.td-SD").text().replace(',', '').replace(',', ''));
        var SDAmount = parseFloat(row.closest("tr").find("td.td-SDAmount").text().replace(',', '').replace(',', ''));

        var VATRate = parseFloat(row.closest("tr").find("td.td-VATRate").text().replace(',', '').replace(',', ''));
        var VATAmount = parseFloat(row.closest("tr").find("td.td-VATAmount").text().replace(',', '').replace(',', ''));


        if (!isNaN(qty * unitCost)) {
            var SubTotal = Number(parseFloat(qty * unitCost).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 });
            row.closest("tr").find("td.td-SubTotal").text(SubTotal);


            if (param == 'VATRate') {
                var VATAmount = Number(parseFloat(((qty * unitCost) * VATRate) / 100).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 });
                row.closest("tr").find("td.td-VATAmount").text(VATAmount);
            }
            else if (param == 'VATAmount') {
                var VATRate = Number(parseFloat((VATAmount * 100) / (qty * unitCost)).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 });
                row.closest("tr").find("td.td-VATRate").text(VATRate);
            }
            else if (param == 'SDRate') {
                var SDAmount = Number(parseFloat(((qty * unitCost) * SDRate) / 100).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 });
                row.closest("tr").find("td.td-SDAmount").text(SDAmount);
            }
            else if (param == 'SDAmount') {
                var SDRate = Number(parseFloat((SDAmount * 100) / (qty * unitCost)).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 });
                row.closest("tr").find("td.td-SD").text(SDRate);
            }
            else {

                var baseAmount = qty * unitCost;

                /* ===================== SD ===================== */

                // SD Amount (number)
                var SDAmount = baseAmount !== 0
                    ? (baseAmount * SDRate) / 100
                    : 0;

                if (isNaN(SDAmount)) {
                    SDAmount = 0;
                }

                // SD Amount display
                row.closest("tr").find("td.td-SDAmount").text(
                    SDAmount.toLocaleString('en', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })
                );

                // SD Rate recalculation (number)
                var SDRateCalc = baseAmount !== 0
                    ? (SDAmount * 100) / baseAmount
                    : 0;

                if (isNaN(SDRateCalc)) {
                    SDRateCalc = 0;
                }

                // SD Rate display
                row.closest("tr").find("td.td-SD").text(
                    SDRateCalc.toLocaleString('en', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })
                );


                /* ===================== VAT ===================== */

                // VAT Amount (number)
                var VATAmount = baseAmount !== 0
                    ? (baseAmount * VATRate) / 100
                    : 0;

                if (isNaN(VATAmount)) {
                    VATAmount = 0;
                }

                // VAT Amount display
                row.closest("tr").find("td.td-VATAmount").text(
                    VATAmount.toLocaleString('en', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })
                );

                // VAT Rate recalculation (number)
                var VATRateCalc = baseAmount !== 0
                    ? (VATAmount * 100) / baseAmount
                    : 0;

                if (isNaN(VATRateCalc)) {
                    VATRateCalc = 0;
                }

                // VAT Rate display
                row.closest("tr").find("td.td-VATRate").text(
                    VATRateCalc.toLocaleString('en', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })
                );
            }


            var LineTotal = Number(parseFloat((qty * unitCost) + parseFloat(SDAmount) + parseFloat(VATAmount)).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 });
            row.closest("tr").find("td.td-LineTotal").text(LineTotal);

            TotalCalculation();
        }
    };


    function TotalCalculation() {
        var Quantity = 0;
        var SDAmount = 0;
        var LineTotal = 0;

        Quantity = getColumnSumAttr('Quantity', 'details').toFixed(2);
        SDAmount = getColumnSumAttr('SDAmount', 'details').toFixed(2);
        VATAmount = getColumnSumAttr('VATAmount', 'details').toFixed(2);
        LineTotal = getColumnSumAttr('LineTotal', 'details').toFixed(2);


        $("#GrandTotalAmount").val(Number(parseFloat(Quantity).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }));
        $("#GrandTotalSDAmount").val(Number(parseFloat(SDAmount).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }));
        $("#GrandTotalVATAmount").val(Number(parseFloat(VATAmount).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }));
        $("#GrandTotal").val(Number(parseFloat(LineTotal).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }));

    };

    function productModalDblClick(row, originalRow) {
        var dataTable = $("#modalData").DataTable();
        var rowData = dataTable.row(row).data();
        debugger;
        var ProductId = rowData.ProductId;
        var ProductCode = rowData.ProductCode;
        var ProductName = rowData.ProductName;
        var UOMId = rowData.UOMId;
        var UOMName = rowData.UOMName;
        var CostPrice = rowData.SalesPrice;
        var SDRate = rowData.SDRate;
        var VATRate = rowData.VATRate;
        var Conversion = rowData.UOMConversion;
        var Quantity = 1;
        var StorckQuantity = rowData.QuantityInHand;

        var $currentRow = originalRow.closest('tr');
        $currentRow.find('.td-ProductCode').text(ProductCode);
        $currentRow.find('.td-ProductName').text(ProductName);
        $currentRow.find('.td-ProductId').text(ProductId);
        $currentRow.find('.td-UOMName').text(UOMName);
        $currentRow.find('.td-UOMId').text(UOMId);
        $currentRow.find('.td-Quantity').text(Quantity);
        $currentRow.find('.td-InputQuantity').text(Quantity);
        $currentRow.find('.td-PcsQuantity').text(Quantity);
        $currentRow.find('.td-UnitRate').text(CostPrice);
        $currentRow.find('.td-SD').text(SDRate);
        $currentRow.find('.td-VATRate').text(VATRate);
        $currentRow.find('.td-UOMConversion').text(Conversion);
        //CampaignMudularitycal($currentRow)
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
        originalRow.closest('td').next().next().text(UOMConversion);

        $("#UOMId").val(UOMId);
        $("#partialModal").modal("hide");
        originalRow.closest("td").find("input").data("touched", false).focus();
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
                    url: "/DMS/SaleReturn/GetGridData",
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
                            
                            if (param.field === "InvoiceDateTime" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "H.InvoiceDateTime";
                            }

                        if (param.field === "BranchName") {
                            param.field = "Br.Name";
                        }
                        if (param.field === "CustomerName") {
                            param.field = "cus.Name";
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
                            
                            if (param.field === "InvoiceDateTime" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "H.InvoiceDateTime";
                            }
                            if (param.field === "BranchName") {
                                param.field = "Br.Name";
                            }
                            if (param.field === "CustomerName") {
                                param.field = "cus.Name";
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
            search: ["Code", "VehicleNo", "VehicleType", "DeliveryAddress", "Comments", "Status", "GrdTotalAmount", "GrdTotalSDAmount", "GrdTotalVATAmount", "InvoiceDateTime", "DeliveryDate", "BranchName", "CustomerName", "SalePersonName", "RouteName"],

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
                                url: "/DMS/SaleReturn/GetSaleReturnDetailDataById",
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
                        { field: "ProductName", title: "Product Name", sortable: true, width: 120, footerTemplate:"Total:" },
                        { field: "Quantity", title: "Quantity", sortable: true, width: 100, aggregates: ["sum"], format: "{0:n2}", footerTemplate: "#= kendo.toString(sum, 'n2') #", attributes: { style: "text-align: right;" } },
                        { field: "UnitRate", title: "Unit Rate", sortable: true, width: 100,  attributes: { style: "text-align: right;" } },
                        { field: "SubTotal", title: "Sub Total", sortable: true, width: 100, aggregates: ["sum"], format: "{0:n2}", footerTemplate: "#= kendo.toString(sum, 'n2') #", attributes: { style: "text-align: right;" } },
                        { field: "SD", title: "SD Rate", sortable: true, width: 100, format: "{0:n2}", attributes: { style: "text-align: right;" } },
                        { field: "SDAmount", title: "SD Amount", sortable: true, width: 100, footerTemplate: "#= kendo.toString(sum, 'n2') #", aggregates: ["sum"], format: "{0:n2}", attributes: { style: "text-align: right;" } },
                        { field: "VATRate", title: "VAT Rate", sortable: true, width: 100,  attributes: { style: "text-align: right;" } },
                        { field: "VATAmount", title: "VAT Amount", sortable: true, width: 100, footerTemplate: "#= kendo.toString(sum, 'n2') #", aggregates: ["sum"], format: "{0:n2}", attributes: { style: "text-align: right;" } },

                        { field: "LineTotal", title: "Total", sortable: true, width: 100, footerTemplate: "#= kendo.toString(sum, 'n2') #", aggregates: ["sum"], format: "{0:n2}", attributes: { style: "text-align: right;" } },
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
                    width: 100,
                    template: function (dataItem) {
                        
                        return `
                                <a href="/DMS/SaleReturn/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                                    <i class="fas fa-pencil-alt"></i>
                                </a>
                         <a href="/DMS/SaleReturn/getReport/${dataItem.Id}" 
                          class="btn btn-success btn-sm mr-2 getReport" 
                          title="Report">
                           <i class="fas fa-file-alt"></i>
                      </a> 
                          `
                    }
                },
                { field: "Id", width: 50, hidden: true, sortable: true },
                { field: "Code", title: "Code", width: 180, sortable: true },
                { field: "CustomerName", title: "Customer Name", sortable: true, width: 200 },
                {
                    field: "InvoiceDateTime", title: "Invoice Date Time", sortable: true, width: 130, template: '#= kendo.toString(kendo.parseDate(InvoiceDateTime), "yyyy-MM-dd") #',
                    filterable: {
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
                
                { field: "DeliveryAddress", title: "Delivery Address", sortable: true, width: 250 },
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

    function save($table) {
        // Validate the form using jQuery validator
        var validator = $("#frmEntry").validate();
        var model = serializeInputs("frmEntry");

        // If form validation fails, return early
        var result = validator.form();
        if (!result) {
            validator.focusInvalid();
            return;
        }

        // Check if the post operation has already been done
        if (model.IsPost == 'True') {
            ShowNotification(2, "Post operation is already done, Do not update this entry");
            return;
        }

        //// Check if the table has required fields filled out
        //if (hasInputFieldInTableCells($table)) {
        //    ShowNotification(3, "Complete Details Entry");
        //    return;
        //}

        //// Ensure there is at least one line in the grid
        //if (!hasLine($table)) {
        //    ShowNotification(3, "Complete Details Entry");
        //    return;
        //}

        var details = [];
        var grid = $("#saleOrderDetails").data("kendoGrid");

        // Serialize grid data if the grid exists
        if (grid) {
            var dataItems = grid.dataSource.view();  // Get the items from the grid

            // Iterate through the grid items and prepare the details array
            for (var i = 0; i < dataItems.length; i++) {
                var item = dataItems[i];

                // Ensure valid ProductId
                if (item.ProductId <= 0) {
                    ShowNotification(3, "Product is required in sale details.");
                    return;
                }

                // Ensure valid Quantity
                if (!item.Quantity || item.Quantity <= 0) {
                    ShowNotification(3, "Quantity must be greater than zero.");
                    return;
                }

                // Ensure valid UnitRate
                if (!item.UnitRate || item.UnitRate <= 0) {
                    ShowNotification(3, "Unit Rate must be greater than zero.");
                    return;
                }

                // Push valid items into the details array
                details.push({
                    Id: item.Id,
                    ProductId: item.ProductId,
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
                    Action: item.Action
                });
            }
        }

        // Check if any valid details were collected
        if (details.length === 0) {
            ShowNotification(3, "No valid sale details found.");
            return;
        }

        // Attach details to the model
        model.saleReturnDetailList = details;

        // Make the AJAX call to save the data
        var url = "/DMS/SaleReturn/CreateEdit";
        CommonAjaxService.finalSave(url, model, saveDone, saveFail);
    }

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

        var url = "/DMS/SaleReturn/MultiplePost";

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



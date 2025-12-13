var SaleDeliveryController = function (CommonService, CommonAjaxService) {

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
        getSaleOrderId = $("#SaleOrderId").val() || 0;
        operation = $("#Operation").val();

        decimalPlace = $("#DecimalPlace").val() || 2;
        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';

        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();
        };

        function toggleCustomerEditable() {
            var salePersonVal = $("#SalePersonId").val().trim();
            if (salePersonVal) {
                $("#CustomerId").removeAttr("readonly");
            } else {
                $("#CustomerId").attr("readonly", "readonly");
                $("#CustomerId").val(""); // optional: clear value if no salesperson
            }
        }

        // Run when page loads
        toggleCustomerEditable();

        // Run when user changes salesperson
        $("#SalePersonId").on("input change", function () {
            toggleCustomerEditable();
        });

        GetSalePersonComboBox();
        GetRouteComboBox();
        GetCurrencyComboBox();
        GetDeliveryComboBox();
        GetDriverComboBox();

        if (getOperation == "add") {
            GetCustomerComboBox();
        }
        else if (operation == "update") {
            updateCustomerComboBox(getSalePersonId, $("#BranchId").val());
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
                            var url = "/DMS/SaleDelivery/MultiplePost";
                            CommonAjaxService.multiplePost(url, model, postDone, fail);
                        }
                    }
                });
        });

        $('#details').on('blur', ".td-CtnQuantity", function (event) {

            var customerId = $("#CustomerId").val() || 0;
            // Validate customer selection
            if (customerId === "0" || customerId === 0) {
                ShowNotification(3, "Please select a customer first.");
                return;
            }
            var originalRow = $(this);
            var currentRow = originalRow.closest('tr');

            var CtnQuantity = currentRow.find('td:nth-child(7)').text().trim() || 0;
            if (CtnQuantity != 0) {
                computeCtnQuantity($(this), '');
                computeSubTotal($(this), '');
                var $currentRow = $(this).closest('tr');
                CampaignMudularitycal($currentRow)
            }
        });

        $('#details').on('blur', ".td-InputQuantity", function (event) {
            var customerId = $("#CustomerId").val() || 0;
            // Validate customer selection
            if (customerId === "0" || customerId === 0) {
                ShowNotification(3, "Please select a customer first.");
                return;
            }
            var originalRow = $(this);
            var currentRow = originalRow.closest('tr');

          
            var InputQuantity = currentRow.find('td:nth-child(8)').text().trim() || 0;
            if (InputQuantity != 0) {
                computeQuantity($(this), '');
                computeSubTotal($(this), '');
                var $currentRow = $(this).closest('tr');
                CampaignMudularitycal($currentRow)
            }


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
                },
                function fail(error) {
                    originalRow.closest("td").find("input").data("touched", false).focus();
                },
                function dblClick(row) {
                    uomFromNameModalDblClick(row, originalRow);
                },
                function closeCallback() {
                    originalRow.closest("td").find("input").data("touched", false).focus();
                }
            );
        });

        // Event handler for quantity change
        $('#details').on('change', ".td-Quantity", function (event) {
         
            var currentRow = $(this).closest('tr');
            var customerId = $("#CustomerId").val() || 0;
            var productId = currentRow.closest('tr').find('td:nth-child(4)').text().trim() || 0;
            var deliveryDate = $("#DeliveryDate").val();

            // Get quantity from input or text content
            var quantity;
            if (currentRow.find("td.td-Quantity input").length > 0) {
                quantity = parseFloat(currentRow.find("td.td-Quantity input").val().replace(/,/g, '')) || 0;
            } else {
                quantity = parseFloat(currentRow.find("td.td-Quantity").text().replace(/,/g, '')) || 0;
            }

            // Validate customer selection
            if (customerId === "0" || customerId === 0) {
                ShowNotification(3, "Please select a customer first.");
                return;
            }

            // Prepare request data
            const requestData = {
                CustomerId: customerId,
                ProductId: productId,
                Quantity: quantity,
                Date: deliveryDate
            };

            // Call API and handle calculations
            CommonService.CampaignMudularityCalculation(requestData,
                function success(result) {
                    if (!result || !result.data) {
                        ShowNotification(3, "Invalid response received");
                        return;
                    }

                    const row = currentRow.closest('tr');
                    updateRowWithAPIData(row, result.data);
                    calculateRowTotals(row);
                    TotalDCalculation();
                },
                function fail(error) {
                    ShowNotification(3, "There was an error processing your request.");
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
                window.location.href = "/DMS/SaleDelivery/NextPrevious?id=" + getId + "&status=Previous";
            }
        });
        $('#btnNext').click('click', function () {
            var getId = $('#Id').val();
            if (parseInt(getId) > 0) {
                window.location.href = "/DMS/SaleDelivery/NextPrevious?id=" + getId + "&status=Next";
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
        $currentRow.find('.td-UOMId').text(UOMId);
        $currentRow.find('.td-Quantity').text(Quantity);
        $currentRow.find('.td-UnitRate').text(CostPrice);
        $currentRow.find('.td-SD').text(SDRate);
        $currentRow.find('.td-VATRate').text(VATRate);
        $currentRow.find('.td-InputQuantity').text(Quantity);
        $currentRow.find('.td-PcsQuantity').text(Quantity);
        $currentRow.find('.td-UOMConversion').text(Conversion);

        CampaignMudularitycal($currentRow)

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
            change: function () {
                var selectedSalePerson = this.dataItem(); // Get the selected SalePerson
                var salePersonId = selectedSalePerson ? selectedSalePerson.Id : null;
                var branchId = selectedSalePerson ? selectedSalePerson.BranchId : null;

                // Call the function to update the Customer ComboBox based on SalePersonId and BranchId
                updateCustomerComboBox(salePersonId, branchId);

                // Make Customer ComboBox editable only if SalePerson is selected
                var customerCombo = $("#CustomerId").data("kendoMultiColumnComboBox");

                if (salePersonId) {
                    customerCombo.enable(true);   // Enable when SalePerson selected
                } else {
                    customerCombo.value("");      // Clear existing value
                    customerCombo.enable(false);  // Disable when no SalePerson
                }
            }
        }).data("kendoMultiColumnComboBox");
    };

    function updateCustomerComboBox(salePersonId, branchId) {
        debugger;
        // If no SalePersonId or BranchId is selected, do not attempt to update the Customer ComboBox
        if (!salePersonId || !branchId) {
            return;
        }

        // Create the Customer MultiColumnComboBox (if it doesn't already exist)
        var customerComboBox = $("#CustomerId").data("kendoMultiColumnComboBox");
        if (!customerComboBox) {
            customerComboBox = $("#CustomerId").kendoMultiColumnComboBox({
                dataTextField: "Name",
                dataValueField: "Id",
                height: 400,
                columns: [
                    { field: "Code", title: "Code", width: 100 },
                    { field: "Name", title: "Name", width: 100 },
                    { field: "Address", title: "Address", width: 150 },
                    { field: "Email", title: "Email", width: 150 },
                    { field: "City", title: "City", width: 150 }
                ],
                filter: "contains",
                filterFields: ["Code", "Name", "Address", "Email", "City"],
                placeholder: "Select Customer",
                dataSource: {
                    transport: {
                        read: {
                            url: "/Common/Common/GetCustomersBySalePersonAndBranch",
                            data: {
                                salePersonId: salePersonId,
                                branchId: branchId
                            },
                            dataType: "json"
                        }
                    }
                },
                change: function (e) {
                    // Get the selected item
                    var selectedItem = this.dataItem();

                    // If an item is selected, get its address and set it to the DeliveryAddress field
                    if (selectedItem) {
                        var address = selectedItem.Address;
                        $("#DeliveryAddress").val(address);
                        $("#RegularDiscountRate").val(regularDiscountRate);
                    }
                }
            }).data("kendoMultiColumnComboBox");
        } else {
            // If the Customer MultiColumnComboBox already exists, update the data source correctly
            customerComboBox.setDataSource({
                transport: {
                    read: {
                        url: "/Common/Common/GetCustomersBySalePersonAndBranch",
                        data: {
                            salePersonId: salePersonId,
                            branchId: branchId
                        },
                        dataType: "json"
                    }
                }
            });
        }
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
            value: "",
            dataBound: function (e) {
                if (getCustomerId) {
                    this.value(parseInt(getCustomerId));
                }
            },
            change: function (e) {
                // Get the selected item
                var selectedItem = this.dataItem();

                // If an item is selected, get its address and set it to the DeliveryAddress field
                if (selectedItem) {
                    var address = selectedItem.Address;
                    var regularDiscountRate = selectedItem.RegularDiscountRate;
                    $("#DeliveryAddress").val(address);
                    $("#RegularDiscountRate").val(regularDiscountRate);
                }
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
            }
        }).data("kendoMultiColumnComboBox");
    };

    function GetDeliveryComboBox() {
        var DeliveryComboBox = $("#DeliveryPersonId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            filter: "contains",
            filterFields: ["Name"],
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
            }
        }).data("kendoMultiColumnComboBox");
    };

    function computeQuantity(row, param) {

        // Get base values with proper parsing of formatted numbers
        var Conversionfactor = parseFloat(row.closest("tr").find("td.td-UOMConversion").text().replace(/,/g, '')) || 1;
        var InputQuantity = parseFloat(row.closest("tr").find("td.td-InputQuantity").text().replace(/,/g, '')) || 0;

        var CtnQty = Math.floor(InputQuantity / Conversionfactor);
        var loseQty = (InputQuantity - (CtnQty * Conversionfactor));
        var Totalqty = (loseQty + (CtnQty * Conversionfactor));

        row.closest("tr").find("td.td-CtnQuantity").text(CtnQty.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        row.closest("tr").find("td.td-PcsQuantity").text(loseQty.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        row.closest("tr").find("td.td-Quantity").text(Totalqty.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        //TotalCalculation();
    }

    function computeCtnQuantity(row, param) {

        // Get base values with proper parsing of formatted numbers
        var Conversionfactor = parseFloat(row.closest("tr").find("td.td-UOMConversion").text().replace(/,/g, '')) || 1;
        var CtnQuantity = parseFloat(row.closest("tr").find("td.td-CtnQuantity").text().replace(/,/g, '')) || 0;
        var InputQuantity = 0;

        var loseQty = CtnQuantity * Conversionfactor;
        var Totalqty = CtnQuantity * Conversionfactor;
        row.closest("tr").find("td.td-InputQuantity").text(InputQuantity.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

        row.closest("tr").find("td.td-PcsQuantity").text(0);
        row.closest("tr").find("td.td-Quantity").text(Totalqty.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        //TotalCalculation();
    }

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
        var FreeQuantity = 0;
        var SDAmount = 0;
        var VATAmount = 0;
        var SubTotal = 0;
        var subTotalAfterDiscount = 0;
        var LineTotal = 0;
        var lineTotalAfterDiscount = 0;
        var ReqularfinalInvoiceValue = 0;
        var finalInvoiceValue = 0;
        var ReqularRate = 0;
        var ReqularDiscount = 0;
        var SpecialRate = 0;
        var SpecialDiscount = 0;

        Quantity = getColumnSumAttr('Quantity', 'details');
        FreeQuantity = getColumnSumAttr('FreeQuantity', 'details');
        SubTotal = getColumnSumAttr('SubTotal', 'details');
        subTotalAfterDiscount = getColumnSumAttr('SubTotalAfterDiscount', 'details');
        SDAmount = getColumnSumAttr('SDAmount', 'details');
        VATAmount = getColumnSumAttr('VATAmount', 'details');
        LineTotal = getColumnSumAttr('LineTotal', 'details');
        lineTotalAfterDiscount = getColumnSumAttr('LineTotalAfterDiscount', 'details');
        // Calculate FreeGrandTotalAmount (GrandTotalAmount + sum of FreeQuantity)
        var freeGrandTotalAmount = FreeQuantity;

        // Calculate Invoice Discount Amount & Final Invoice Value
        invoiceDiscountRate = parseFloat($("#InvoiceDiscountRate").val()) || 0; // Get discount rate from input


        invoiceDiscountAmount = (LineTotal * invoiceDiscountRate) / 100; // Calculate discount amount
        finalInvoiceValue = LineTotal - invoiceDiscountAmount; // Calculate final value

        ReqularRate = parseFloat($("#RegularDiscountRate").val()) || 0;
        ReqularDiscount = ((finalInvoiceValue * ReqularRate) / 100)

        ReqularfinalInvoiceValue = finalInvoiceValue - ReqularDiscount; // Calculate final value

        SpecialRate = parseFloat($("#SpecialDiscountRate").val()) || 0;

        if (SpecialRate != 0) {
            SpecialDiscount = parseFloat($("#SpecialDiscountRate").val()) || 0;
            SpecialDiscount = ((finalInvoiceValue * SpecialRate) / 100)

        }
        else {

            SpecialDiscount = parseFloat($("#SpecialDiscountAmount").val()) || 0;
            SpecialRate = (SpecialDiscount / ReqularfinalInvoiceValue) * 100
            if (isNaN(SpecialRate)) {
                SpecialRate = 0;
            }
            $("#SpecialDiscountRate").val(SpecialRate.toFixed(2));

        }


        finalInvoiceValue = ReqularfinalInvoiceValue - SpecialDiscount; // Calculate final value
        // Update all grand total fields with proper formatting
        $("#GrandTotalAmount").val(formatNumber(Quantity));
        $("#FreeGrandTotalAmount").val(formatNumber(freeGrandTotalAmount));
        $("#GrandSubTotal").val(formatNumber(SubTotal));
        $("#GrandSubTotalAD").val(formatNumber(subTotalAfterDiscount));
        $("#GrandTotalSDAmount").val(formatNumber(SDAmount));
        $("#GrandTotalVATAmount").val(formatNumber(VATAmount));
        $("#GrandTotal").val(formatNumber(LineTotal));
        $("#LineTotalAfterDiscount").val(formatNumber(lineTotalAfterDiscount));

        $(".trFinalDiscountAmount").val(invoiceDiscountAmount);
        $(".trFinalInvoiceDiscount").val(invoiceDiscountRate); //rate
        $("#RegularDiscountAmount").val(ReqularDiscount.toFixed(2));
        $("#SpecialDiscountAmount").val(SpecialDiscount.toFixed(2));

        $("#AfterRegularDiscountAmount").val(ReqularfinalInvoiceValue.toFixed(2));
        $("#AfterSpecialDiscountAmount").val(finalInvoiceValue.toFixed(2));

        $(".trFinalInvoiceValue").val(finalInvoiceValue.toFixed(2));

    };

    // Function to update row with API response data
    function updateRowWithAPIData(row, data) {
        // Update basic fields
        row.find('.td-FreeProductName').text(data.FreeProductName?.trim() || '');
        row.find('.td-FreeProductId').text(data.FreeProductId || '');
        row.find('.td-FreeQuantity').text(formatNumber(data.FreeQuantity || 0));
        row.find('.td-DiscountRate').text(formatNumber(data.DiscountRate || 0));
        row.find('.td-DiscountAmount').text(formatNumber(data.DiscountAmount || 0));
        row.find('.td-LineDiscountRate').text(formatNumber(data.LineDiscountRate || 0));
        row.find('.td-LineDiscountAmount').text(formatNumber(data.LineDiscountAmount || 0));

        // Update calculated totals
        row.find('.td-SubTotalAfterDiscount').text(formatNumber(data.SubTotalAfterDiscount || 0));
        row.find('.td-LineTotalAfterDiscount').text(formatNumber(data.LineTotalAfterDiscount || 0));
    }




    // Function to calculate row totals
    function calculateRowTotals(row) {


        const quantity = parseFloat(row.find('.td-Quantity').text().replace(/,/g, '')) || 0;
        const unitRate = parseFloat(row.find('.td-UnitRate').text().replace(/,/g, '')) || 0;
        const discountRate = parseFloat(row.find('.td-DiscountRate').text().replace(/,/g, '')) || 0;
        const sdRate = parseFloat(row.find('.td-SD').text().replace(/,/g, '')) || 0;
        const vatRate = parseFloat(row.find('.td-VATRate').text().replace(/,/g, '')) || 0;
        const LineDiscountAmount = parseFloat(row.find('.td-LineDiscountAmount').text().replace(/,/g, '')) || 0;

        // Calculate SubTotal
        const subTotal = quantity * unitRate;
        row.find('.td-SubTotal').text(formatNumber(subTotal));

        // Calculate Discount Amount
        const discountAmount = (subTotal * discountRate) / 100;
        row.find('.td-DiscountAmount').text(formatNumber(discountAmount));

        // Calculate SubTotal After Discount
        const subTotalAfterDiscount = subTotal - discountAmount;

        // Calculate SD Amount
        const sdAmount = (subTotalAfterDiscount * sdRate) / 100;
        row.find('.td-SDAmount').text(formatNumber(sdAmount));

        // Calculate VAT Amount
        const vatAmount = ((subTotalAfterDiscount + sdAmount) * vatRate) / 100;
        row.find('.td-VATAmount').text(formatNumber(vatAmount));


        // Calculate  orginal VAT Amount
        const orginalvatAmount = ((subTotal + sdAmount) * vatRate) / 100;


        // Calculate Line Total
        const lineTotal = subTotal + sdAmount + orginalvatAmount;
        row.find('.td-LineTotal').text(formatNumber(lineTotal));

        // Calculate Line Total AfterDiscount
        const AfterDiscountlineTotal = subTotalAfterDiscount + sdAmount + vatAmount - LineDiscountAmount;
        row.find('.td-LineTotalAfterDiscount').text(formatNumber(AfterDiscountlineTotal));
    }

    // Function to calculate all totals
    function TotalDCalculation() {

        // Initialize variables for totals
        let totals = {
            quantity: 0,
            freeQuantity: 0,
            subTotal: 0,
            subTotalAfterDiscount: 0,
            sdAmount: 0,
            vatAmount: 0,
            lineTotal: 0,
            lineTotalAfterDiscount: 0
        };

        // Calculate totals from all rows
        $('#details tbody tr').each(function () {
            const row = $(this);
            totals.quantity += parseFloat(row.find('.td-Quantity').text().replace(/,/g, '')) || 0;
            totals.freeQuantity += parseFloat(row.find('.td-FreeQuantity').text().replace(/,/g, '')) || 0;
            totals.subTotal += parseFloat(row.find('.td-SubTotal').text().replace(/,/g, '')) || 0;
            totals.subTotalAfterDiscount += parseFloat(row.find('.td-SubTotalAfterDiscount').text().replace(/,/g, '')) || 0;
            totals.sdAmount += parseFloat(row.find('.td-SDAmount').text().replace(/,/g, '')) || 0;
            totals.vatAmount += parseFloat(row.find('.td-VATAmount').text().replace(/,/g, '')) || 0;
            totals.lineTotal += parseFloat(row.find('.td-LineTotal').text().replace(/,/g, '')) || 0;
            totals.lineTotalAfterDiscount += parseFloat(row.find('.td-LineTotalAfterDiscount').text().replace(/,/g, '')) || 0;
        });

        // Calculate FreeGrandTotalAmount (only free quantity)
        const freeGrandTotalAmount = totals.freeQuantity;

        // Update all total fields
        $("#GrandTotalAmount").val(formatNumber(totals.quantity));
        $("#FreeGrandTotalAmount").val(formatNumber(freeGrandTotalAmount));
        $("#GrandSubTotal").val(formatNumber(totals.subTotal));
        $("#GrandSubTotalAD").val(formatNumber(totals.subTotalAfterDiscount));
        $("#GrandTotalSDAmount").val(formatNumber(totals.sdAmount));
        $("#GrandTotalVATAmount").val(formatNumber(totals.vatAmount));
        $("#GrandTotal").val(formatNumber(totals.lineTotal));
        $("#LineTotalAfterDiscount").val(formatNumber(totals.lineTotalAfterDiscount));

        // Get required data for invoice calculation
        const customerId = $("#CustomerId").val() || 0;
        const deliveryDate = $("#DeliveryDate").val();
        // Prepare request data for invoice calculation
        const invoiceRequestData = {
            CustomerId: customerId,
            Quantity: totals.lineTotalAfterDiscount, // Send the raw number, not formatted
            Date: deliveryDate
        };

        // Call API for invoice calculation
        CommonService.CampaignInvoiceCalculation(invoiceRequestData,
            function success(result) {
                if (!result || !result.data) {
                    ShowNotification(3, "Invalid response received");
                    return;
                }
                var finalValue = formatNumber(result.data.TotalInvoiceValue);
                var finalRate = formatNumber(result.data.DiscountRateBasedOnTotalPrice);
                var finalDiscountAmt = formatNumber(result.data.DiscountAmount);

                //if (finalValue == null || finalValue == "NaN") {
                //    $(".trFinalInvoiceValue").val(formatNumber(totals.subTotalAfterDiscount));
                //}
                //else {
                //    $(".trFinalInvoiceValue").val(formatNumber(result.data.TotalInvoiceValue));

                //}
                if (finalRate == null || finalRate == "NaN") { //Rate
                    $(".trFinalInvoiceDiscount").val(0);
                }
                else {
                    $(".trFinalInvoiceDiscount").val(formatNumber(result.data.DiscountRateBasedOnTotalPrice));

                }
                if (finalDiscountAmt == null || finalDiscountAmt == "NaN") {
                    $(".trFinalDiscountAmount").val(0);
                }
                else {
                    $(".trFinalDiscountAmount").val(formatNumber(result.data.DiscountAmount));

                }


            },
            function fail(error) {
                console.error("Error fetching data:", error);
                ShowNotification(3, "There was an error processing your request.");
            }
        );
    }
    //function computeSubTotal(row, param) {
    //    // Get base values with proper parsing of formatted numbers
    //    var qty = parseFloat(row.closest("tr").find("td.td-Quantity").text().replace(/,/g, '')) || 1;
    //    var unitCost = parseFloat(row.closest("tr").find("td.td-UnitRate").text().replace(/,/g, '')) || 0;
    //    var freeQty = parseFloat(row.closest("tr").find("td.td-FreeQuantity").text().replace(/,/g, '')) || 0;
    //    var discountRate = parseFloat(row.closest("tr").find("td.td-DiscountRate").text().replace(/,/g, '')) || 0;

    //    var SDRate = parseFloat(row.closest("tr").find("td.td-SD").text().replace(/,/g, '')) || 0;
    //    var SDAmount = parseFloat(row.closest("tr").find("td.td-SDAmount").text().replace(/,/g, '')) || 0;
    //    var VATRate = parseFloat(row.closest("tr").find("td.td-VATRate").text().replace(/,/g, '')) || 0;
    //    var VATAmount = parseFloat(row.closest("tr").find("td.td-VATAmount").text().replace(/,/g, '')) || 0;

    //    if (!isNaN(qty * unitCost)) {
    //        // Calculate SubTotal
    //        var SubTotal = Number(parseFloat(qty * unitCost).toFixed(parseInt(decimalPlace)));
    //        row.closest("tr").find("td.td-SubTotal").text(SubTotal.toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));

    //        // Calculate SubTotalAfterDiscount
    //        var discountAmount = (SubTotal * discountRate) / 100;
    //        var SubTotalAfterDiscount = SubTotal - discountAmount;
    //        row.closest("tr").find("td.td-SubTotalAfterDiscount").text(SubTotalAfterDiscount.toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));

    //        // Handle VAT and SD calculations based on parameter
    //        if (param == 'VATRate') {
    //            VATAmount = Number(parseFloat((SubTotalAfterDiscount * VATRate) / 100).toFixed(parseInt(decimalPlace)));
    //            row.closest("tr").find("td.td-VATAmount").text(VATAmount.toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));
    //        }
    //        else if (param == 'VATAmount') {
    //            VATRate = Number(parseFloat((VATAmount * 100) / SubTotalAfterDiscount).toFixed(parseInt(decimalPlace)));
    //            row.closest("tr").find("td.td-VATRate").text(VATRate.toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));
    //        }
    //        else if (param == 'SDRate') {
    //            SDAmount = Number(parseFloat((SubTotalAfterDiscount * SDRate) / 100).toFixed(parseInt(decimalPlace)));
    //            row.closest("tr").find("td.td-SDAmount").text(SDAmount.toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));
    //        }
    //        else if (param == 'SDAmount') {
    //            SDRate = Number(parseFloat((SDAmount * 100) / SubTotalAfterDiscount).toFixed(parseInt(decimalPlace)));
    //            row.closest("tr").find("td.td-SD").text(SDRate.toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));
    //        }
    //        else {
    //            // Default calculations for both SD and VAT
    //            SDAmount = Number(parseFloat((SubTotalAfterDiscount * SDRate) / 100).toFixed(parseInt(decimalPlace)));
    //            VATAmount = Number(parseFloat(((SubTotalAfterDiscount + SDAmount) * VATRate) / 100).toFixed(parseInt(decimalPlace)));

    //            // Update all rates and amounts
    //            row.closest("tr").find("td.td-SDAmount").text(SDAmount.toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));
    //            row.closest("tr").find("td.td-VATAmount").text(VATAmount.toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));
    //        }

    //        // Calculate LineTotal and LineTotalAfterDiscount
    //        var LineTotal = SubTotal + SDAmount + VATAmount;
    //        var LineTotalAfterDiscount = SubTotalAfterDiscount + SDAmount + VATAmount;

    //        row.closest("tr").find("td.td-LineTotal").text(LineTotal.toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));
    //        row.closest("tr").find("td.td-LineTotalAfterDiscount").text(LineTotalAfterDiscount.toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));

    //        TotalCalculation();
    //    }
    //}
    //function TotalCalculation() {
    //    var Quantity = 0;
    //    var FreeQuantity = 0;
    //    var SDAmount = 0;
    //    var VATAmount = 0;
    //    var SubTotal = 0;
    //    var subTotalAfterDiscount = 0;
    //    var LineTotal = 0;
    //    var lineTotalAfterDiscount = 0;

    //    var finalInvoiceValue = 0;

    //    // Calculate sums using getColumnSumAttr
    //    Quantity = getColumnSumAttr('Quantity', 'details');
    //    FreeQuantity = getColumnSumAttr('FreeQuantity', 'details');
    //    SubTotal = getColumnSumAttr('SubTotal', 'details');
    //    subTotalAfterDiscount = getColumnSumAttr('SubTotalAfterDiscount', 'details');
    //    SDAmount = getColumnSumAttr('SDAmount', 'details');
    //    VATAmount = getColumnSumAttr('VATAmount', 'details');
    //    LineTotal = getColumnSumAttr('LineTotal', 'details');
    //    lineTotalAfterDiscount = getColumnSumAttr('LineTotalAfterDiscount', 'details');

    //    // Calculate FreeGrandTotalAmount (GrandTotalAmount + sum of FreeQuantity)
    //    var freeGrandTotalAmount = FreeQuantity;

    //    // Calculate Invoice Discount Amount & Final Invoice Value
    //    invoiceDiscountRate = parseFloat($("#InvoiceDiscountRate").val()) || 0; // Get discount rate from input
    //    invoiceDiscountAmount = (subTotalAfterDiscount * invoiceDiscountRate) / 100; // Calculate discount amount
    //    //finalInvoiceValue = lineTotalAfterDiscount - invoiceDiscountAmount; // Calculate final value
    //    invoiceDiscountRate = parseFloat($("#InvoiceDiscountRate").val()) || 0;
    //    invoiceDiscountAmount = (subTotalAfterDiscount * invoiceDiscountRate) / 100;
    //    finalInvoiceValue = subTotalAfterDiscount - invoiceDiscountAmount;

    //    // Update all grand total fields with proper formatting
    //    $("#GrandTotalAmount").val(formatNumber(Quantity));
    //    $("#FreeGrandTotalAmount").val(formatNumber(freeGrandTotalAmount));
    //    $("#GrandSubTotal").val(formatNumber(SubTotal));
    //    $("#GrandSubTotalAD").val(formatNumber(subTotalAfterDiscount));
    //    $("#GrandTotalSDAmount").val(formatNumber(SDAmount));
    //    $("#GrandTotalVATAmount").val(formatNumber(VATAmount));
    //    $("#GrandTotal").val(formatNumber(LineTotal));
    //    $("#LineTotalAfterDiscount").val(formatNumber(lineTotalAfterDiscount));

    //    $(".trFinalDiscountAmount").val(invoiceDiscountAmount);
    //    $(".trFinalInvoiceDiscount").val(invoiceDiscountRate); //rate

    //    //$("#FinalInvoiceValue").val(finalInvoiceValue.toFixed(2));
    //    $("#FinalInvoiceValue").val(lineTotalAfterDiscount.toFixed(2));

    //}
    function CampaignMudularitycal(Row) {

        var currentRow = Row;
        var customerId = $("#CustomerId").val() || 0;
        var productId = currentRow.closest('tr').find('td:nth-child(4)').text().trim() || 0;
        var deliveryDate = $("#DeliveryDate").val();

        // Get quantity from input or text content
        var quantity;
        if (currentRow.find("td.td-Quantity input").length > 0) {
            quantity = parseFloat(currentRow.find("td.td-Quantity input").val().replace(/,/g, '')) || 0;
        } else {
            quantity = parseFloat(currentRow.find("td.td-Quantity").text().replace(/,/g, '')) || 0;
        }

        // Validate customer selection
        if (customerId === "0" || customerId === 0) {
            ShowNotification(3, "Please select a customer first.");
            return;
        }

        // Prepare request data
        const requestData = {
            CustomerId: customerId,
            ProductId: productId,
            Quantity: quantity,
            Date: deliveryDate
        };

        // Call API and handle calculations
        CommonService.CampaignMudularityCalculation(requestData,
            function success(result) {
                if (!result || !result.data) {
                    ShowNotification(3, "Invalid response received");
                    return;
                }

                const row = currentRow.closest('tr');
                updateRowWithAPIData(row, result.data);
                calculateRowTotals(row);
                TotalDCalculation();
            },
            function fail(error) {
                console.error("Error fetching data:", error);
                ShowNotification(3, "There was an error processing your request.");
            }
        );
    };

    // Function to update row with API response data
    function updateRowWithAPIData(row, data) {
        // Update basic fields
        row.find('.td-FreeProductName').text(data.FreeProductName?.trim() || '');
        row.find('.td-FreeProductId').text(data.FreeProductId || '');
        row.find('.td-FreeQuantity').text(formatNumber(data.FreeQuantity || 0));
        row.find('.td-DiscountRate').text(formatNumber(data.DiscountRate || 0));
        row.find('.td-DiscountAmount').text(formatNumber(data.DiscountAmount || 0));
        row.find('.td-LineDiscountRate').text(formatNumber(data.LineDiscountRate || 0));
        row.find('.td-LineDiscountAmount').text(formatNumber(data.LineDiscountAmount || 0));

        // Update calculated totals
        row.find('.td-SubTotalAfterDiscount').text(formatNumber(data.SubTotalAfterDiscount || 0));
        row.find('.td-LineTotalAfterDiscount').text(formatNumber(data.LineTotalAfterDiscount || 0));
    }

    // Function to calculate row totals
    //function calculateRowTotals(row) {
    //    const quantity = parseFloat(row.find('.td-Quantity').text().replace(/,/g, '')) || 0;
    //    const unitRate = parseFloat(row.find('.td-UnitRate').text().replace(/,/g, '')) || 0;
    //    const discountRate = parseFloat(row.find('.td-DiscountRate').text().replace(/,/g, '')) || 0;
    //    const sdRate = parseFloat(row.find('.td-SD').text().replace(/,/g, '')) || 0;
    //    const vatRate = parseFloat(row.find('.td-VATRate').text().replace(/,/g, '')) || 0;

    //    // Calculate SubTotal
    //    const subTotal = quantity * unitRate;
    //    row.find('.td-SubTotal').text(formatNumber(subTotal));

    //    // Calculate Discount Amount
    //    const discountAmount = (subTotal * discountRate) / 100;
    //    row.find('.td-DiscountAmount').text(formatNumber(discountAmount));

    //    // Calculate SubTotal After Discount
    //    const subTotalAfterDiscount = subTotal - discountAmount;

    //    // Calculate SD Amount
    //    const sdAmount = (subTotalAfterDiscount * sdRate) / 100;
    //    row.find('.td-SDAmount').text(formatNumber(sdAmount));


    //    // Calculate VAT Amount
    //    const vatAmount = (subTotalAfterDiscount * vatRate) / 100;
    //    row.find('.td-VATAmount').text(formatNumber(vatAmount));

    //    // Calculate  orginal VAT Amount
    //    const orginalvatAmount = ((subTotal + sdAmount) * vatRate) / 100;


    //    // Calculate Line Total
    //    const lineTotal = subTotal + sdAmount + orginalvatAmount;
    //    row.find('.td-LineTotal').text(formatNumber(lineTotal));

    //    // Calculate Line Total AfterDiscount
    //    const AfterDiscountlineTotal = subTotalAfterDiscount + sdAmount + vatAmount;
    //    row.find('.td-LineTotalAfterDiscount').text(formatNumber(AfterDiscountlineTotal));
    //}

    // Function to calculate all totals
    //function TotalDCalculation() {

    //    // Initialize variables for totals
    //    let totals = {
    //        quantity: 0,
    //        freeQuantity: 0,
    //        subTotal: 0,
    //        subTotalAfterDiscount: 0,
    //        sdAmount: 0,
    //        vatAmount: 0,
    //        lineTotal: 0,
    //        lineTotalAfterDiscount: 0
    //    };

    //    // Calculate totals from all rows
    //    $('#details tbody tr').each(function () {
    //        const row = $(this);
    //        totals.quantity += parseFloat(row.find('.td-Quantity').text().replace(/,/g, '')) || 0;
    //        totals.freeQuantity += parseFloat(row.find('.td-FreeQuantity').text().replace(/,/g, '')) || 0;
    //        totals.subTotal += parseFloat(row.find('.td-SubTotal').text().replace(/,/g, '')) || 0;
    //        totals.subTotalAfterDiscount += parseFloat(row.find('.td-SubTotalAfterDiscount').text().replace(/,/g, '')) || 0;
    //        totals.sdAmount += parseFloat(row.find('.td-SDAmount').text().replace(/,/g, '')) || 0;
    //        totals.vatAmount += parseFloat(row.find('.td-VATAmount').text().replace(/,/g, '')) || 0;
    //        totals.lineTotal += parseFloat(row.find('.td-LineTotal').text().replace(/,/g, '')) || 0;
    //        totals.lineTotalAfterDiscount += parseFloat(row.find('.td-LineTotalAfterDiscount').text().replace(/,/g, '')) || 0;
    //    });

    //    // Calculate FreeGrandTotalAmount (only free quantity)
    //    const freeGrandTotalAmount = totals.freeQuantity;

    //    // Update all total fields
    //    $("#GrandTotalAmount").val(formatNumber(totals.quantity));
    //    $("#FreeGrandTotalAmount").val(formatNumber(freeGrandTotalAmount));
    //    $("#GrandSubTotal").val(formatNumber(totals.subTotal));
    //    $("#GrandSubTotalAD").val(formatNumber(totals.subTotalAfterDiscount));
    //    $("#GrandTotalSDAmount").val(formatNumber(totals.sdAmount));
    //    $("#GrandTotalVATAmount").val(formatNumber(totals.vatAmount));
    //    $("#GrandTotal").val(formatNumber(totals.lineTotal));
    //    $("#LineTotalAfterDiscount").val(formatNumber(totals.lineTotalAfterDiscount));

    //    // Get required data for invoice calculation
    //    const customerId = $("#CustomerId").val() || 0;
    //    const deliveryDate = $("#DeliveryDate").val();
    //    // Prepare request data for invoice calculation
    //    const invoiceRequestData = {
    //        CustomerId: customerId,
    //        Quantity: totals.lineTotalAfterDiscount, // Send the raw number, not formatted
    //        Date: deliveryDate
    //    };

    //    // Call API for invoice calculation
    //    CommonService.CampaignInvoiceCalculation(invoiceRequestData,
    //        function success(result) {
    //            if (!result || !result.data) {
    //                ShowNotification(3, "Invalid response received");
    //                return;
    //            }
    //            var finalValue = formatNumber(result.data.TotalInvoiceValue);
    //            var finalRate = formatNumber(result.data.DiscountRateBasedOnTotalPrice);
    //            var finalDiscountAmt = formatNumber(result.data.DiscountAmount);

    //            if (finalValue == null || finalValue == "NaN") {
    //                $(".trFinalInvoiceValue").val(formatNumber(totals.subTotalAfterDiscount));
    //            }
    //            else {
    //                $(".trFinalInvoiceValue").val(formatNumber(result.data.TotalInvoiceValue));

    //            }
    //            if (finalRate == null || finalRate == "NaN") { //Rate
    //                $(".trFinalInvoiceDiscount").val(0);
    //            }
    //            else {
    //                $(".trFinalInvoiceDiscount").val(formatNumber(result.data.DiscountRateBasedOnTotalPrice));

    //            }
    //            if (finalDiscountAmt == null || finalDiscountAmt == "NaN") {
    //                $(".trFinalDiscountAmount").val(0);
    //            }
    //            else {
    //                $(".trFinalDiscountAmount").val(formatNumber(result.data.DiscountAmount));

    //            }


    //        },
    //        function fail(error) {
    //            console.error("Error fetching data:", error);
    //            ShowNotification(3, "There was an error processing your request.");
    //        }
    //    );
    //}

    // Helper function to format numbers consistently
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
                    url: "/DMS/SaleDelivery/GetGridData",
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
                            if (param.field === "VehicleNo") {
                                param.field = "H.VehicleNo";
                            }
                            if (param.field === "VehicleType") {
                                param.field = "H.VehicleType";
                            }
                            if (param.field === "DeliveryAddress") {
                                param.field = "H.DeliveryAddress";
                            }
                            if (param.field === "BranchName") {
                                param.field = "Br.Name";
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
                            if (param.field === "CurrencyName") {
                                param.field = "con.Name";
                            }
                            if (param.field === "InvoiceDateTime") {
                                param.field = "H.InvoiceDateTime";
                            }
                            if (param.field === "DeliveryDate") {
                                param.field = "H.DeliveryDate";
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
                            if (param.field === "VehicleNo") {
                                param.field = "H.VehicleNo";
                            }
                            if (param.field === "VehicleType") {
                                param.field = "H.VehicleType";
                            }
                            if (param.field === "DeliveryAddress") {
                                param.field = "H.DeliveryAddress";
                            }
                            if (param.field === "BranchName") {
                                param.field = "Br.Name";
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
                            if (param.field === "InvoiceDateTime") {
                                param.field = "H.InvoiceDateTime";
                            }
                            if (param.field === "DeliveryDate") {
                                param.field = "H.DeliveryDate";
                            }
                            if (param.field === "CurrencyName") {
                                param.field = "con.Name";
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
                    GrandTotalVATAmount: { type: "number" },
                    InvoiceDiscountRate: { type: "number" },
                    InvoiceDiscountAmount: { type: "number" }
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
            search: ["GrandTotalSDAmount", "GrandTotalAmount", "CurrencyName", "DeliveryDate", "InvoiceDateTime", "Comments", "GrandTotalVATAmount", "BranchName", "VehicleType", "VehicleNo", "RouteName", "DriverPersonName", "SalePersonName", "CustomerName", "Code"],
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
                            { field: "UnitRate", aggregate: "average" },
                            { field: "SubTotal", aggregate: "sum" },
                            { field: "SD", aggregate: "average" },
                            { field: "SDAmount", aggregate: "sum" },
                            { field: "VATRate", aggregate: "average" },
                            { field: "VATAmount", aggregate: "sum" },
                            { field: "LineTotal", aggregate: "sum" }
                        ],
                        transport: {
                            read: {
                                url: "/DMS/SaleDelivery/GetSaleDeliveryDetailDataById",
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
                        { field: "Comments", title: "Comments", sortable: true, width: 150 },
                    ]
                });
            }
            ,
            excel: {
                fileName: "SaleDeliveryList.xlsx",
                filterable: true
            },
            pdf: {
                fileName: `SaleDeliveryList_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`,
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


                var fileName = `SaleDeliveryList_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`;

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
            <a href="/DMS/SaleDelivery/Edit/${dataItem.Id}" 
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
                { field: "SalePersonName", title: "Sale Person", sortable: true, width: 200 },
                { field: "RouteName", title: "Route", sortable: true, width: 200 },
                { field: "CustomerName", title: "Customer Name", sortable: true, width: 200 },
                { field: "DeliveryPersonName", title: "Delivery Person Name", sortable: true, width: 180 },
                { field: "DriverPersonName", title: "Driver Person Name", sortable: true, width: 180 },
                { field: "CurrencyName", title: "Currency Name", sortable: true, width: 150 },
                { field: "VehicleNo", title: "Vehicle No.", sortable: true, width: 150 },
                { field: "VehicleType", title: "Vehicle Type", sortable: true, width: 150 },
                { field: "DeliveryAddress", title: "Delivery Address", sortable: true, width: 250 },
                {
                    field: "InvoiceDateTime", title: "Invoice Date", sortable: true, width: 150, template: '#= kendo.toString(kendo.parseDate(InvoiceDateTime), "yyyy-MM-dd") #',
                    filterable:
                    {
                        ui: "datepicker"
                    }
                },
                {
                    field: "DeliveryDate", title: "Delivery Date", sortable: true, width: 150, template: '#= kendo.toString(kendo.parseDate(DeliveryDate), "yyyy-MM-dd") #',
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
                { field: "BranchName", title: "Branch Name", sortable: true, hidden: true },

            ],
            editable: false,
            selectable: "multiple row",
            navigatable: true,
            columnMenu: true
        });

    };

    function save($table) {
     
        var isDropdownValid1 = CommonService.validateDropdown("#SalePersonId", "#titleError1", "Sale Person is required");
        var isDropdownValid2 = CommonService.validateDropdown("#CustomerId", "#titleError2", "Customer is required");
        var isDropdownValid3 = CommonService.validateDropdown("#CurrencyId", "#titleError3", "Currency is required");


        var isDropdownValid = isDropdownValid1 && isDropdownValid2 && isDropdownValid3;
        var validator = $("#frmEntry").validate();
        var model = serializeInputs("frmEntry");



        if (parseInt(model.SalePersonId) == 0 || model.SalePersonId == "") {
            ShowNotification(3, "Sale Person Is Required.");
            return;
        }
        if (parseInt(model.CustomerId) == 0 || model.CustomerId == "") {
            ShowNotification(3, "Customer Is Required.");
            return;
        }
        //if (parseInt(model.DriverPersonId) == 0 || model.DriverPersonId == "") {
        //    ShowNotification(3, "Driver Person Is Required.");
        //    return;
        //}



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

        //if (hasInputFieldInTableCells($table)) {
        //    ShowNotification(3, "Complete Details Entry");
        //    return;
        //};
        //if (!hasLine($table)) {
        //    ShowNotification(3, "Complete Details Entry");
        //    return;
        //};


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
        model.InvoiceDiscountRate = model.InvoiceDiscountRate.replace(/,/g, '');
        model.InvoiceDiscountAmount = model.InvoiceDiscountAmount.replace(/,/g, '');

        model.saleDeliveryDetailList = details;

        var url = "/DMS/SaleDelivery/CreateEdit";

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

        var url = "/DMS/SaleDelivery/MultiplePost";

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

function ReportPreview(id) {
    const form = document.createElement('form');
    form.method = 'post';
    form.action = '/DMS/SaleDelivery/ReportPreview';
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
function IncoiceReportPreview(id) {

    const form = document.createElement('form');
    form.method = 'post';
    form.action = '/DMS/SaleDelivery/IncoiceReportPreview';
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


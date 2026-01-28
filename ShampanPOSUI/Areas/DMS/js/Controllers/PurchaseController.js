var PurchaseController = function (CommonService, CommonAjaxService) {

    var getSupplierId = 0;
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

        getSupplierId = $("#SupplierId").val() || 0;
        getCurrencyId = $("#CurrencyId").val() || 0;
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


        var $table = $('#details');

        var table = initEditTable($table, { searchHandleAfterEdit: false });


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

        $('#btnComplete').on('click', function () {

            Confirmation("Are you sure? Do You Want to Complete Data?",
                function (result) {

                    if (result) {
                        SelectDataForComplete();
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
            $('#FromDate').val($('#PurchaseDate').val());

            poWindow.center().open();

            // Optional: reload grid every time window opens
            //$("#windowGrid").data("kendoGrid").dataSource.read();
        });


        $("#windowGrid").on("dblclick", "tbody tr", function () {

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
            debugger;

            $.ajax({
                url: "/DMS/PurchaseOrder/GetPurchaseOrderList",
                type: "GET",
                data: { purchaseOrderId: purchaseOrderId },
                success: function (data) {

                    if (!data || data.length === 0) {
                        $("#lst").empty();
                        TotalCalculation();
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

                    /* ================= DETAILS ================= */
                    /*$("#lst").empty();*/

                    if (!master.purchaseOrderDetailsList || master.purchaseOrderDetailsList.length === 0) {
                        TotalCalculation();
                        return;
                    }

                    var sl = 1;

                    $.each(master.purchaseOrderDetailsList, function (index, item) {

                        var row = `
                <tr>
                    <td>${sl}</td>
                    <td hidden>${item.ProductCode ?? ""}</td>
                    <td>${item.ProductName ?? ""}</td>
                    <td hidden>${item.ProductId ?? ""}</td>

                    <td class="td-Quantity dFormat">${item.Quantity ?? 0}</td>
                    <td class="td-UnitPrice dFormat">${item.UnitPrice ?? 0}</td>
                    <td class="td-SubTotal dFormat">${item.SubTotal ?? 0}</td>

                    <td class="td-SD dFormat">${item.SD ?? 0}</td>
                    <td class="td-SDAmount dFormat">${item.SDAmount ?? 0}</td>

                    <td class="td-VATRate dFormat">${item.VATRate ?? 0}</td>
                    <td class="td-VATAmount dFormat">${item.VATAmount ?? 0}</td>

                    <td class="td-OthersAmount dFormat">${item.OthersAmount ?? 0}</td>
                    <td class="td-LineTotal dFormat">${item.LineTotal ?? 0}</td>

                    <td hidden>${item.PurchaseOrderId ?? ""}</td>
                    <td hidden>${item.PurchaseOrderDetailId ?? ""}</td>
                    <td>
                        <button class="btn btn-danger btn-sm remove-row-btn">
                            <i class="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>`;

                        $("#lst").append(row);
                        sl++;
                    });

                    /* ================= 🔥 ONLY THIS ================= */
                    // ❌ No manual totals
                    // ✅ Always use calculation engine
                    TotalCalculation();
                },
                error: function () {
                    alert("Failed to load purchase order details.");
                }
            });
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


        $('#details').on('blur', ".td-CtnQuantity", function (event) {

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


    //Add


    $("#btnUpload").click(function () {

        pageSubmit('frmPurchaseImport'); // Call the function
    });

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
    function CampaignMudularitycal(Row) {

        var currentRow = Row;
        var productId = currentRow.closest('tr').find('td:nth-child(4)').text().trim() || 0;
        var deliveryDate = $("#DeliveryDate").val();

        // Get quantity from input or text content
        var quantity;
        if (currentRow.find("td.td-Quantity input").length > 0) {
            quantity = parseFloat(currentRow.find("td.td-Quantity input").val().replace(/,/g, '')) || 0;
        } else {
            quantity = parseFloat(currentRow.find("td.td-Quantity").text().replace(/,/g, '')) || 0;
        }

        // Prepare request data
        const requestData = {
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
                //updateRowWithAPIData(row, result.data);
                calculateRowTotals(row);
                TotalDCalculation();
            },
            function fail(error) {
                console.error("Error fetching data:", error);
                ShowNotification(3, "There was an error processing your request.");
            }
        );
    }

    function calculateRowTotals(row) {


        const quantity = parseFloat(row.find('.td-Quantity').text().replace(/,/g, '')) || 0;
        const unitRate = parseFloat(row.find('.td-UnitPrice').text().replace(/,/g, '')) || 0;
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
        //$("#GrandTotalAmount").val(formatNumber(totals.quantity));
        $("#SubTotal").val(formatNumber(totals.subTotal));
        $("#TotalSD").val(formatNumber(totals.sdAmount));
        $("#TotalVAT").val(formatNumber(totals.vatAmount));
        $("#GrandTotal").val(formatNumber(totals.lineTotal));

        // Get required data for invoice calculation
        // Prepare request data for invoice calculation
        const invoiceRequestData = {
            Quantity: totals.lineTotalAfterDiscount, // Send the raw number, not formatted
        };
    }
    function formatNumber(value) {
        return Number(parseFloat(value).toFixed(parseInt(decimalPlace)))
            .toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) });
    }
    function pageSubmit(formId) {


        var form = $("#" + formId)[0]; // Get the form
        var formData = new FormData(form); // Create FormData object
        var url = "/Purchase/ImportExcel";

        CommonAjaxService.ImportExcel(url, formData, saveImportExcelDone, saveImportExcelFail);

    }
    function saveImportExcelDone(result) {


        if (result.Status == 200) {

            ShowNotification(1, result.Message);

        }
        else if (result.Status == 400) {
            ShowNotification(3, result.Message);
        }
        else {
            ShowNotification(2, result.Message);
        }
    };
    function saveImportExcelFail(result) {
        ShowNotification(3, "Query Exception!");
    };




    //End




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
    }

    function productModalDblClick(row, originalRow) {

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
                            //if (param.field === "Completed") {
                            //    let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";

                            //    if (statusValue.startsWith("c")) {
                            //        param.value = 1;
                            //    } else if (statusValue.startsWith("n")) {
                            //        param.value = 0;
                            //    } else {
                            //        param.value = null;
                            //    }

                            //    param.field = "H.IsCompleted";
                            //    param.operator = "eq";
                            //}

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
                            //if (param.field === "Completed") {
                            //    let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";

                            //    if (statusValue.startsWith("c")) {
                            //        param.value = 1;
                            //    } else if (statusValue.startsWith("n")) {
                            //        param.value = 0;
                            //    } else {
                            //        param.value = null;
                            //    }

                            //    param.field = "H.IsCompleted";
                            //    param.operator = "eq";
                            //}

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
                        { field: "ProductName", title: "Product Name", sortable: true, width: 120 },
                        { field: "Quantity", title: "Quantity", sortable: true, width: 100, aggregates: ["sum"], format: "{0:n2}", footerTemplate: "#= kendo.toString(sum, 'n2') #", attributes: { style: "text-align: right;" } },
                        { field: "UnitPrice", title: "Unit Price", sortable: true, width: 100, aggregates: ["sum"], format: "{0:n2}", footerTemplate: "#= kendo.toString(sum, 'n2') #", attributes: { style: "text-align: right;" } },
                        { field: "SubTotal", title: "Sub Total", sortable: true, width: 100, aggregates: ["sum"], format: "{0:n2}", footerTemplate: "#= kendo.toString(sum, 'n2') #", attributes: { style: "text-align: right;" } },
                        { field: "SD", title: "SD Rate", sortable: true, width: 100, footerTemplate: "#= kendo.toString(sum, 'n2') #", aggregates: ["sum"], format: "{0:n2}", attributes: { style: "text-align: right;" } },
                        { field: "SDAmount", title: "SD Amount", sortable: true, width: 100, footerTemplate: "#= kendo.toString(sum, 'n2') #", aggregates: ["sum"], format: "{0:n2}", attributes: { style: "text-align: right;" } },
                        { field: "VATRate", title: "VAT Rate", sortable: true, width: 100, footerTemplate: "#= kendo.toString(sum, 'n2') #", aggregates: ["sum"], format: "{0:n2}", attributes: { style: "text-align: right;" } },
                        { field: "VATAmount", title: "VAT Amount", sortable: true, width: 100, footerTemplate: "#= kendo.toString(sum, 'n2') #", aggregates: ["sum"], format: "{0:n2}", attributes: { style: "text-align: right;" } },
                        { field: "OthersAmount", title: "Others Amount", sortable: true, width: 100, footerTemplate: "#= kendo.toString(sum, 'n2') #", aggregates: ["sum"], format: "{0:n2}", attributes: { style: "text-align: right;" } },
                        { field: "LineTotal", title: "Line Total", sortable: true, width: 100, footerTemplate: "#= kendo.toString(sum, 'n2') #", aggregates: ["sum"], format: "{0:n2}", attributes: { style: "text-align: right;" } },
                        { field: "IsFixedVAT", hidden: true, title: "Is Fixed Vat", sortable: true, width: 100 },
                        { field: "VatType", hidden: true, title: "Vat Type", sortable: true, width: 100 },
                        { field: "Comments", title: "Comments", sortable: true, width: 150 },
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
            pdfExport: function (e) {
                e.preventDefault();
                var grid = e.sender;
                var masterData = grid.dataSource.view();

                if (!kendo.drawing || !kendo.drawing.drawDOM) {
                    return;
                }

                var groupedData = {};
                masterData.forEach(masterRow => {
                    if (!groupedData[masterRow.Code]) {
                        groupedData[masterRow.Code] = [];
                    }
                    groupedData[masterRow.Code].push(masterRow);
                });

                var masterPdfContainer = $("<div id='masterPdfContent' style='padding:0px;font-size:11px;position:relative; height: 100vh;'>");
                $("body").append(masterPdfContainer);

                Object.keys(groupedData).forEach((code, index) => {
                    let safeCode = code.replace(/[^a-zA-Z0-9-_]/g, "_");

                    var pdfContainer = $(`
                                        <div id="pdfContent_${safeCode}" style="padding:0px;font-size:11px;position:relative; height: 100vh">
                                    `);

                    const companyName = groupedData[code][0].CompanyName || "All CompanyNames";
                    const branchName = groupedData[code][0].BranchName || "All Branches";
                    const branchAddress = groupedData[code][0].BranchAddress || "All BranchAddress";

                    pdfContainer.append(`
                                        <h2 style="text-align:center;">${companyName}</h2>
                                        <h5 style="text-align:center;">${branchName}</h5>
                                        <h6 style="text-align:center;">${branchAddress}</h6>
                                        <hr>
                                    `);

                    groupedData[code].forEach(masterRow => {
                        pdfContainer.append(`
                                                <div style="margin-bottom: 10px; display: flex; flex-wrap: wrap;">
                                                    <div style="width: 50%; padding: 5px;">
                                                        <p><strong>Code : </strong> ${masterRow.Code}</p>
                                                        <p><strong>Invoice Date : </strong> ${masterRow.InvoiceDateTime}</p>
                                                        <p><strong>Supplier Name : </strong> ${masterRow.SupplierName}</p>
                                                        <p><strong>Posted Status : </strong> ${masterRow.Status}</p>
                                                        <p><strong>Currency Name : </strong> ${masterRow.CurrencyName}</p>
                                                        <p><strong>BE Number : </strong> ${masterRow.BENumber}</p>
                                                    </div>
                                                    <div style="width: 50%; padding: 5px;">
                                                        <p><strong>Fiscal Year : </strong> ${masterRow.FiscalYear}</p>
                                                        <p><strong>Purchase Date : </strong> ${masterRow.PurchaseDate}</p>
                                                        <p><strong>Supplier Address : </strong> ${masterRow.SupplierAddress}</p>
                                                        <p><strong>Completed Status : </strong> ${masterRow.Completed}</p>
                                                        <p><strong>Currency Rate From BDT : </strong> ${Number(parseFloat(masterRow.CurrencyRateFromBDT).toFixed(parseInt(decimalPlace))).toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) })}</p>
                                                        <p><strong>Comments : </strong> ${masterRow.Comments}</p>
                                                    </div>
                                                </div>
                                        `);

                        $.ajax({
                            url: "/DMS/Purchase/GetPurchaseDetailDataById",
                            type: "GET",
                            dataType: "json",
                            data: { masterId: masterRow.Id },
                            async: false,
                            success: function (response) {
                                if (response.Items && response.Items.length > 0) {
                                    let count = 1;
                                    let tableHTML = `
                                                <table style="width:100%;border-collapse:collapse;margin-bottom:10px;font-size:7.5px;word-break:break-word;">
                                                    <thead>
                                                        <tr style="background: #ddd; text-align: center;">
                                                            <th style="border: 1px solid #000; padding: 2px;width:16px;">SL</th>
                                                            <th style="border: 1px solid #000; padding: 2px;">Product Name</th>
                                                            <th style="border: 1px solid #000; padding: 2px;">UOM Name</th>
                                                            <th style="border: 1px solid #000; padding: 2px;">UOM Conversion</th>
                                                            <th style="border: 1px solid #000; padding: 2px;">Quantity</th>
                                                            <th style="border: 1px solid #000; padding: 2px;">Unit Price</th>
                                                            <th style="border: 1px solid #000; padding: 2px;">Sub Total</th>
                                                            <th style="border: 1px solid #000; padding: 2px;">SD Rate</th>
                                                            <th style="border: 1px solid #000; padding: 2px;">SD Amount</th>
                                                            <th style="border: 1px solid #000; padding: 2px;">VAT Rate</th>
                                                            <th style="border: 1px solid #000; padding: 2px;">VAT Amount</th>
                                                            <th style="border: 1px solid #000; padding: 2px;">Others Amount</th>
                                                            <th style="border: 1px solid #000; padding: 2px;">Line Total</th>
                                                        </tr>
                                                    </thead>
                                                <tbody>
                                            `;

                                    response.Items.forEach(item => {
                                        let fontSize = "9px";

                                        let formattedQuantity = Number(parseFloat(item.Quantity).toFixed(parseInt(decimalPlace)))
                                            .toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) });
                                        let fontSizeQuantity = formattedQuantity.length >= 10 ? "6.5px" : "9px";

                                        let formattedUnitPrice = Number(parseFloat(item.UnitPrice).toFixed(parseInt(decimalPlace)))
                                            .toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) });
                                        let fontSizeUnitPrice = formattedUnitPrice.length >= 10 ? "6.5px" : "9px";

                                        let formattedSubTotal = Number(parseFloat(item.SubTotal).toFixed(parseInt(decimalPlace)))
                                            .toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) });
                                        let fontSizeSubTotal = formattedSubTotal.length >= 10 ? "6.5px" : "9px";

                                        let formattedSD = Number(parseFloat(item.SD).toFixed(parseInt(decimalPlace)))
                                            .toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) });
                                        let fontSizeSD = formattedSD.length >= 10 ? "6.5px" : "9px";

                                        let formattedSDAmount = Number(parseFloat(item.SDAmount).toFixed(parseInt(decimalPlace)))
                                            .toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) });
                                        let fontSizeSDAmount = formattedSDAmount.length >= 10 ? "6.5px" : "9px";

                                        let formattedVATRate = Number(parseFloat(item.VATRate).toFixed(parseInt(decimalPlace)))
                                            .toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) });
                                        let fontSizeVATRate = formattedVATRate.length >= 10 ? "6.5px" : "9px";

                                        let formattedVATAmount = Number(parseFloat(item.VATAmount).toFixed(parseInt(decimalPlace)))
                                            .toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) });
                                        let fontSizeVATAmount = formattedVATAmount.length >= 10 ? "6.5px" : "9px";

                                        let formattedOthersAmount = Number(parseFloat(item.OthersAmount).toFixed(parseInt(decimalPlace)))
                                            .toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) });
                                        let fontSizeOthersAmount = formattedOthersAmount.length >= 10 ? "6.5px" : "9px";

                                        let formattedLineTotal = Number(parseFloat(item.LineTotal).toFixed(parseInt(decimalPlace)))
                                            .toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) });
                                        let fontSizeLineTotal = formattedLineTotal.length >= 10 ? "6.5px" : "9px";

                                        tableHTML += `
                                                        <tr>
                                                            <td style="border: 1px solid #000; padding: 2px;font-size:${fontSize};">${count++}</td>
                                                            <td style="border: 1px solid #000; padding: 2px;font-size:${fontSize};">${item.ProductName}</td>
                                                            <td style="border: 1px solid #000; padding: 2px;font-size:${fontSize};">${item.UOMName}</td>
                                                            <td style="border: 1px solid #000; padding: 2px;text-align:right;font-size:${fontSize};">${Number(parseFloat(item.UOMConversion).toFixed(parseInt(decimalPlace))).toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) })}</td>
                                                            <td style="border: 1px solid #000; padding: 2px;text-align:right;font-size:${fontSizeQuantity};">${Number(parseFloat(item.Quantity).toFixed(parseInt(decimalPlace))).toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) })}</td>
                                                            <td style="border: 1px solid #000; padding: 2px;text-align:right;font-size:${fontSizeUnitPrice};">${Number(parseFloat(item.UnitPrice).toFixed(parseInt(decimalPlace))).toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) })}</td>
                                                            <td style="border: 1px solid #000; padding: 2px;text-align:right;font-size:${fontSizeSubTotal};">${Number(parseFloat(item.SubTotal).toFixed(parseInt(decimalPlace))).toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) })}</td>
                                                            <td style="border: 1px solid #000; padding: 2px;text-align:right;font-size:${fontSizeSD};">${Number(parseFloat(item.SD).toFixed(parseInt(decimalPlace))).toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) })}</td>
                                                            <td style="border: 1px solid #000; padding: 2px;text-align:right;font-size:${fontSizeSDAmount};">${Number(parseFloat(item.SDAmount).toFixed(parseInt(decimalPlace))).toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) })}</td>
                                                            <td style="border: 1px solid #000; padding: 2px;text-align:right;font-size:${fontSizeVATRate};">${Number(parseFloat(item.VATRate).toFixed(parseInt(decimalPlace))).toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) })}</td>
                                                            <td style="border: 1px solid #000; padding: 2px;text-align:right;font-size:${fontSizeVATAmount};">${Number(parseFloat(item.VATAmount).toFixed(parseInt(decimalPlace))).toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) })}</td>
                                                            <td style="border: 1px solid #000; padding: 2px;text-align:right;font-size:${fontSizeOthersAmount};">${Number(parseFloat(item.OthersAmount).toFixed(parseInt(decimalPlace))).toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) })}</td>
                                                            <td style="border: 1px solid #000; padding: 2px;text-align:right;font-size:${fontSizeLineTotal};">${Number(parseFloat(item.LineTotal).toFixed(parseInt(decimalPlace))).toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) })}</td>
                                                        </tr>
                                                    `;
                                    });

                                    tableHTML += `</tbody></table>`;
                                    pdfContainer.append(tableHTML);

                                    let footerHTML = `
                                                <div class="horizontal-layout" style="display: flex; justify-content: space-between; width: 100%; position:absolute; bottom:70px; height: 100px; left: 0">
                                                <div style="text-align: center; width: 15%;">
                                                    <hr style="margin: 5px auto; width: 80%;" />
                                                    <b>Prepared by</b>
                                                </div>
                                                <div style="text-align: center; width: 15%;">
                                                    <hr style="margin: 5px auto; width: 80%;" />
                                                    <b>Entered by</b>
                                                </div>
                                                <div style="text-align: center; width: 15%;">
                                                    <hr style="margin: 5px auto; width: 80%;" />
                                                    <b>Checked by</b>
                                                </div>
                                                <div style="text-align: center; width: 15%;">
                                                    <hr style="margin: 5px auto; width: 80%;" />
                                                    <b>Posted by</b>
                                                </div>
                                                <div style="text-align: center; width: 15%;">
                                                    <hr style="margin: 5px auto; width: 80%;" />
                                                    <b>Approved by</b>
                                                </div>
                                            </div>

                                            <div class="clearfix">&nbsp;</div>
                                        `;

                                    pdfContainer.append(footerHTML);
                                }
                            }
                        });

                    });

                    masterPdfContainer.append(pdfContainer);
                });

                setTimeout(() => {
                    kendo.drawing.drawDOM($("#masterPdfContent"), {
                        paperSize: "A4",
                        margin: { top: "1cm", left: "1cm", right: "1cm", bottom: "2cm" },
                        landscape: false,
                        multiPage: true
                    }).then(function (group) {
                        return kendo.drawing.exportPDF(group, {});
                    }).then(function (dataURI) {
                        if (!dataURI) {
                            return;
                        }
                        kendo.saveAs({
                            dataURI: dataURI,
                            fileName: `PurchaseOrder_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`
                        });

                        $("#masterPdfContent").remove();
                    }).catch(function (error) {
                        console.log("PDF Export Error: ", error);
                    });
                }, 500);
            },
            columns: [
                {
                    selectable: true, width: 35
                },
                {
                    title: "Action",
                    width:160,
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

                                `+
                            "<a style='background-color: darkgreen;' href='#' onclick='ReportPreview(" + dataItem.Id + ")' class='btn btn-success btn-sm mr-2 edit ' title='Report Preview'><i class='fas fa-print'></i></a>";
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
                //{
                //    field: "Completed", title: "Completed", sortable: true, width: 130,
                //    filterable: {
                //        ui: function (element) {
                //            element.kendoDropDownList({
                //                dataSource: [
                //                    { text: "Completed", value: "1" },
                //                    { text: "Not-Completed", value: "0" }
                //                ],
                //                dataTextField: "text",
                //                dataValueField: "value",
                //                optionLabel: "Select Option"
                //            });
                //        }
                //    }
                //}
                //,
                {
                    field: "SubTotal",
                    title: "Sub Total",
                    sortable: true,
                    width: 180,
                    aggregates: ["sum"],
                    format: "{0:n2}",
                    footerTemplate: "#=kendo.toString(sum, 'n2')#",
                    groupFooterTemplate: "#=kendo.toString(sum, 'n2')#",
                    attributes: { style: "text-align: right;" }
                }
                ,
                {
                    field: "TotalSD",
                    title: "Total SD",
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
                    field: "TotalVAT",
                    title: "Total VAT",
                    sortable: true,
                    width: 200,
                    aggregates: ["sum"],
                    format: "{0:n2}",
                    footerTemplate: "#=kendo.toString(sum, 'n2')#",
                    groupFooterTemplate: "#=kendo.toString(sum, 'n2')#",
                    attributes: { style: "text-align: right;" }
                },
                {
                    field: "GrandTotal",
                    title: "Grand Total",
                    sortable: true,
                    width: 200,
                    aggregates: ["sum"],
                    format: "{0:n2}",
                    footerTemplate: "#=kendo.toString(sum, 'n2')#",
                    groupFooterTemplate: "#=kendo.toString(sum, 'n2')#",
                    attributes: { style: "text-align: right;" }
                },
                {
                    field: "PaidAmount",
                    title: "Paid Amount",
                    sortable: true,
                    width: 200,
                    aggregates: ["sum"],
                    format: "{0:n2}",
                    footerTemplate: "#=kendo.toString(sum, 'n2')#",
                    groupFooterTemplate: "#=kendo.toString(sum, 'n2')#",
                    attributes: { style: "text-align: right;" }
                },

                { field: "BENumber", title: "BE Number", sortable: true, width: 130 },
                //{ field: "ImportIDExcel", title: "Import IDExcel", sortable: true, width: 130 },
                //{ field: "CustomHouse", title: "Custom House", sortable: true, width: 130 },
                { field: "FiscalYear", title: "Fiscal Year", sortable: true, width: 120 },
                //{ field: "CurrencyRateFromBDT", title: "Currency Rate FromBDT", sortable: true, width: 190 },
                { field: "Comments", title: "Comments", sortable: true, width: 200 },
                { field: "BranchName", title: "Branch Name", sortable: true, width: 200 },
                { field: "BranchAddress", title: "Branch Address", width: 200, hidden: true, sortable: true },
                //{ field: "CompanyName", title: "Company Name", width: 200, hidden: true, sortable: true },
            ],
            editable: false,
            selectable: "multiple row",
            navigatable: true,
            columnMenu: true
        });

    };

    function save($table) {
       
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

        if (hasInputFieldInTableCells($table)) {
            ShowNotification(3, "Complete Details Entry");
            return;
        };
        if (!hasLine($table)) {
            ShowNotification(3, "Complete Details Entry");
            return;
        };

        var isDropdownValid1 = CommonService.validateDropdown("#SupplierId", "#titleError1", "Supplier is required");
        //var isDropdownValid2 = CommonService.validateDropdown("#CurrencyId", "#titleError2", "Currency is required");

        var isDropdownValid = isDropdownValid1;
        if (!result || !isDropdownValid) {
            if (!result) {
                validator.focusInvalid();
            }
            return;
        }

        var details = serializeTable($table);

        var requiredFields = ['ProductName', 'Quantity', 'UnitPrice'];
        var fieldMappings = {
            'ProductName': 'Product Name',
            //'UOMName': 'UOM Name',
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

        model.purchaseDetailList = details;

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

    function SelectDataForComplete() {

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
        filteredData = rowData.filter(x => x.IsCompleted == true && IDs.includes(x.Id));

        if (filteredData.length > 0) {
            ShowNotification(3, "Data has already been Completed.");
            return;
        }
        var url = "/DMS/Purchase/MultipleIsCompleted";

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
    form.action = '/DMS/Purchase/ReportPreview';
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

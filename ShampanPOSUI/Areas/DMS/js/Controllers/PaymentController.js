var PaymentController = function (CommonService, CommonAjaxService) {

    var notification;
    var decimalPlace = 0;

    var init = function () {

        $("[data-bootstrap-switch]").bootstrapSwitch();

        notification = $("#notification").kendoNotification({
            position: {
                pinned: true,
                top: 30,
                right: 30
            },
            autoHideAfter: 3000,
            stacking: "down"
        }).data("kendoNotification");


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

            $(".kendoTransactionDate").kendoDatePicker({
                format: "yyyy-MM-dd"
            });

        });

        getSupplierId = $("#SupplierId").val() || 0;
        getBankAccountId = $("#BankAccountId").val() || 0;
        decimalPlace = $("#DecimalPlace").val() || 2;
        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';

        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();
        };

        if (getOperation !== '') {
            GetBankAccountComboBox();
            GetSupplierComboBox();

        };
        calculateTotalPayment();


        var rxList = JSON.parse($("#detailsListJson").val() || "[]");

        gridDataSource = new kendo.data.DataSource({
            data: rxList,
            schema: {
                model: {
                    id: "PurchaseId",
                    fields: {
                        SLNo: { type: "number", editable: false },

                        PurchaseId: { type: "number" },

                        PurchaseCode: { type: "string" },

                        PurchaseAmount: { type: "number" },

                        PaidAmount: { type: "number" },

                        DueAmount: { type: "number" },

                        PaymentAmount: { type: "number" },

                        DueAfter: { type: "number" }
                    }
                }
            }
        });


        var grid = $("#PaymentDetailsGrid").kendoGrid({
            dataSource: gridDataSource,
            toolbar: [{ name: "create", text: "Add" }],
            editable: {
                mode: "incell",
                createAt: "bottom"
            },

            save: function (e) {

                if (e.values.PaymentAmount != null) {

                    var payment = parseFloat(e.values.PaymentAmount) || 0;
                    var paid = parseFloat(e.model.PaidAmount) || 0;
                    var due = parseFloat(e.model.DueAmount) || 0;

                    if (payment > due) {
                        ShowNotification(3, "Payment cannot exceed Due Amount");
                        e.preventDefault();
                        return;
                    }

                    var newPaid = paid + payment;
                    var dueAfter = due - payment;

                    e.model.set("PaidAmount", newPaid);
                    e.model.set("DueAfter", dueAfter);
                }
            },

            remove: function () {
                calculateTotalPaymentGrid();
            },

            columns: [
                {
                    field: "SLNo",
                    title: "SL",
                    width: 50,
                    editable: false,
                    template: function (dataItem) {
                        var grid = $("#PaymentDetailsGrid").data("kendoGrid");
                        return grid.dataSource.indexOf(dataItem) + 1;
                    }
                },

                {
                    field: "PurchaseId",
                    title: "Purchase Code",
                    editor: SelectorEditor,
                    template: function (dataItem) {
                        console.log(dataItem);
                        return dataItem.PurchaseCode || "";
                    },
                    width: 250
                },

                { field: "PurchaseAmount", title: "Purchase Amount", width: 120, format: "{0:n2}", editable: true },

                { field: "PaidAmount", title: "Paid", width: 120, format: "{0:n2}", editable: true },

                { field: "DueAmount", title: "Due", width: 120, format: "{0:n2}", editable: true },

                //{ field: "PaymentAmount", title: "Payment Amount", width: 150 },


                {
                    field: "PaymentAmount",
                    title: "Payment Amount",
                    width: 150,
                    editor: function (container, options) {
                        $('<input name="' + options.field + '" type="number" min="0" class="k-input k-textbox" />')
                            .appendTo(container)
                            .kendoNumericTextBox({
                                format: "n2",
                                min: 0 // ✅ Prevent negative input
                            });
                    }
                },



                { field: "DueAfter", title: "Due After", width: 150, format: "{0:n2}", editable: true },

                {
                    command: [{ name: "destroy", text: "", iconClass: "k-icon k-i-trash" }],
                    title: " ",
                    width: 50
                }
            ]
        }).data("kendoGrid");

        gridDataSource.bind("change", function () {
            calculateTotalPaymentGrid();
        });
        calculateTotalPaymentGrid();




        $('.btnsave').click(function (e) {
            debugger;
            e.preventDefault();

            var form = $("#frmEntry");
            var $table = $('#details');

            var mvcValid = form.valid();
            var customValid = CommonValidationHelper.CheckValidation("#frmEntry");

            if (!mvcValid || !customValid) {
                return false;
            }

            var grid = $("#PaymentDetailsGrid").data("kendoGrid");

            var details = grid.dataSource.data().toJSON();

            //var details = serializeTable($table);

            if (!details || details.length === 0) {
                ShowNotification(3, "Complete Details Entry.");
                return false;
            }
            var requiredFields = ['PurchaseCode', 'PurchaseAmount', 'PaymentAmount'];
            var fieldMappings = {
                'PurchaseCode': 'Purchase Code',
                'PurchaseAmount': 'Purchase Amount',
                'PaymentAmount': 'Payment Amount'
            };

            console.log(details);
            var errorMessage = getRequiredFieldsCheckObj(details, requiredFields, fieldMappings);

            if (errorMessage) {
                ShowNotification(3, errorMessage);
                return false;
            }

            Confirmation("Are you sure? Do You Want to Save Data?",
                function (result) {
                    if (result) {
                        save(details);
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
                            var url = "/DMS/Payment/MultiplePost";
                            CommonAjaxService.multiplePost(url, model, processDone, fail);
                        }
                    }
                });
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
                window.location.href = "/DMS/Payment/NextPrevious?id=" + getId + "&status=Previous";
            }
        });

        $('#btnNext').click('click', function () {
            var getId = $('#Id').val();
            if (parseInt(getId) > 0) {
                window.location.href = "/DMS/Payment/NextPrevious?id=" + getId + "&status=Next";
            }
        });

        $('#details').on('change', 'input, select', function () {
            debugger;
            calculateTotalPayment();
        });


        // 🔥 Cash / Bank Toggle Logic
        $("#IsCash").on("switchChange.bootstrapSwitch", function (event, state) {

            var combo = $("#BankAccountId").data("kendoMultiColumnComboBox");

            if (!combo) {
                GetBankAccountComboBox();
                combo = $("#BankAccountId").data("kendoMultiColumnComboBox");
            }

            if (state) {

                // Bank selected
                combo.dataSource.filter({
                    field: "AccountName",
                    operator: "contains",
                    value: "Bank"
                });

            } else {

                // Cash selected
                combo.dataSource.filter({
                    field: "AccountName",
                    operator: "contains",
                    value: "Cash"
                });

            }

        });


        // 🔥 Initial Load Handling
        setTimeout(function () {
            var isCash = $("#IsCash").bootstrapSwitch("state");
            var combo = $("#BankAccountId").data("kendoMultiColumnComboBox");

            if (!combo) {
                GetBankAccountComboBox();
                combo = $("#BankAccountId").data("kendoMultiColumnComboBox");
            }

            combo.enable(true);

            if (isCash === true) {

                // Bank selected → show Bank accounts
                combo.dataSource.filter({
                    field: "AccountName",
                    operator: "contains",
                    value: "Bank"
                });

            } else {

                // Cash selected → show Cash accounts
                combo.dataSource.filter({
                    field: "AccountName",
                    operator: "contains",
                    value: "Cash"
                });

            }

        }, 200);



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


    $("#btnUpload").click(function () {

        pageSubmit('frmPurchaseImport');
    });


    function SelectorEditor(container, options) {
        var wrapper = $('<div class="input-group input-group-sm full-width">').appendTo(container);

        // Create input (you can bind value if needed)
        $('<input type="text" class="form-control" readonly />')
            .attr("data-bind", "value:PurchaseCode")
            .appendTo(wrapper);

        // Create button inside an addon span
        $('<div class="input-group-append">')
            .append(
                $('<button class="btn btn-outline-secondary" type="button">')
                    .append('<i class="fa fa-search"></i>')
                    .on("click", function () {
                        openModal(options.model);
                    })
            )
            .appendTo(wrapper);

        kendo.bind(container, options.model);
    }
    var selectedGridModel = null;


    var selectedGridModel = null;

    // 1️⃣ Supplier ComboBox setup
    function GetSupplierComboBox() {
        $("#SupplierId").kendoMultiColumnComboBox({
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
                transport: { read: "/Common/Common/GetSupplierList" }
            },
            placeholder: "Select Supplier",
            change: function () {
                //var selectedItem = this.dataItem();
                //var supplierId = selectedItem ? selectedItem.Id : 0;
                //updatePurchaseCodeDataSource(supplierId); // Reload popup grid with selected supplier
            }
        });
    }

    // 2️⃣ Function to create/update popup grid
    function updatePurchaseCodeDataSource(supplierId) {
        var windowGrid = $("#windowGrid").data("kendoGrid");

        if (windowGrid) {
            windowGrid.destroy();
            $("#windowGrid").empty();
        }

        $("#windowGrid").kendoGrid({
            dataSource: {
                transport: {
                    read: {
                        url: "/Common/Common/PurchaseModal",
                        dataType: "json",
                        data: { value: supplierId ? supplierId : 0 }
                    }
                },
                pageSize: 10
            },
            pageable: true,
            filterable: true,
            selectable: "row",
            toolbar: ["search"],
            columns: [
                { field: "Id", hidden: true },
                { field: "Code", title: "Code", width: 150 },
                { field: "PurchaseOrderCode", title: "Purchase Order Code", width: 200 },
                { field: "SupplierName", title: "Supplier Name", width: 200 },
                { field: "GrandTotal", title: "Total", width: 120 },
                { field: "PaymentAmount", title: "Paid", width: 120 },
                { field: "DueAmount", title: "Due", width: 120 },
                { field: "Comments", title: "Comments", width: 200 }
            ],
            dataBound: function () {
                this.tbody.find("tr").off("dblclick").on("dblclick", function () {
                    var grid = $("#windowGrid").data("kendoGrid");
                    var dataItem = grid.dataItem(this);

                    if (!dataItem || !selectedGridModel) return;

                    var paymentGrid = $("#PaymentDetailsGrid").data("kendoGrid");
                    if (!paymentGrid) return;

                    // Duplicate check
                    var exists = paymentGrid.dataSource.data().some(function (item) {
                        return item.PurchaseCode === dataItem.Code;
                    });

                    if (exists) {
                        ShowNotification(3, "This item already added!");
                        return; // Prevent adding duplicate
                    }

                    // Add selected item to main grid
                    selectedGridModel.set("PurchaseId", dataItem.Id);
                    selectedGridModel.set("PurchaseCode", dataItem.Code);
                    selectedGridModel.set("PurchaseAmount", dataItem.GrandTotal);
                    selectedGridModel.set("PaidAmount", dataItem.PaymentAmount);
                    selectedGridModel.set("DueAmount", dataItem.DueAmount);
                    selectedGridModel.set("PaymentAmount", 0);
                    selectedGridModel.set("PaymentAfter", dataItem.PaymentAmount);
                    selectedGridModel.set("DueAfter", dataItem.DueAmount);

                    // ✅ Close popup only on valid selection
                    $("#poWindow").data("kendoWindow").close();
                });
            }
        });
    }

    function openModal(gridModel) {
        selectedGridModel = gridModel; // ✅ Set selected model first

        var poWindow = $("#poWindow").data("kendoWindow");

        if (!poWindow) {
            $("#poWindow").kendoWindow({
                title: "Select Purchase",
                modal: true,
                width: "900px",
                height: "550px",
                visible: false,
                close: function () { selectedGridModel = null; }
            });
        }

        // Load grid first
        var supplierId = $("#SupplierId").val() || 0;
        updatePurchaseCodeDataSource(supplierId);

        // Open popup after grid is ready
        setTimeout(function () {
            $("#poWindow").data("kendoWindow").center().open();
        }, 100); // short delay to ensure grid is bound
    }


    function calculateTotalPaymentGrid() {

        var grid = $("#PaymentDetailsGrid").data("kendoGrid");

        if (!grid || !grid.dataSource) {
            return;
        }

        var data = grid.dataSource.data();

        var total = 0;

        for (var i = 0; i < data.length; i++) {
            total += parseFloat(data[i].PaymentAmount) || 0;
        }

        $("#TotalPaymentAmount").val(total.toFixed(2));
    }



    function calculateTotalPayment() {
        var total = 0;
        debugger;
        $('.td-PaymentAmount').each(function () {
            debugger;
            let valueText = $(this).find('input').val() || $(this).text();
            let value = parseFloat(valueText.replace(/[^0-9.-]+/g, ''));

            if (!isNaN(value)) {
                total += value;
            }
        });
        // Update TotalPaymentAmount
        $("#TotalPaymentAmount").val(total.toFixed(2));
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



    //function GetBankAccountComboBox() {
    //    debugger;
    //    var SupplierComboBox = $("#BankAccountId").kendoMultiColumnComboBox({
    //        dataTextField: "AccountNo",
    //        dataValueField: "Id",
    //        height: 400,
    //        columns: [
    //            { field: "AccountNo", title: "Account No", width: 150 },
    //            { field: "AccountName", title: "Account Name", width: 150 },
    //            { field: "BranchName", title: "Branch Name", width: 150 }
    //        ],
    //        filter: "contains",
    //        filterFields: ["Code", "Name"],
    //        dataSource: {
    //            transport: {
    //                read: "/Common/Common/GetBankAccountList"
    //            }
    //        },
    //        placeholder: "Select BankAccount",
    //        value: "",
    //        dataBound: function (e) {
    //            if (getBankAccountId) {
    //                this.value(parseInt(getBankAccountId));
    //            }
    //        },
    //        change: function (e) {
    //        }
    //    }).data("kendoMultiColumnComboBox");
    //};


    function GetBankAccountComboBox() {

        var bankId = $("#BankAccountId").val();

        var combo = $("#BankAccountId").kendoMultiColumnComboBox({
            dataTextField: "AccountNo",
            dataValueField: "Id",
            height: 400,
            columns: [
                { field: "AccountNo", title: "Account No", width: 150 },
                { field: "AccountName", title: "Account Name", width: 150 },
                { field: "BranchName", title: "Branch Name", width: 150 }
            ],
            filter: "contains",
            filterFields: ["AccountNo", "AccountName", "BranchName"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetBankAccountList"
                }
            },
            placeholder: "Select Bank Account"
            //dataBound: function (e) {
            //    if (bankId) {
            //        this.value(parseInt(bankId));
            //    }
            //},
        }).data("kendoMultiColumnComboBox");

        combo.one("dataBound", function () {
            if (bankId) {
                combo.value(parseInt(bankId));
            }
        });

        return combo;

    }


    //function GetSupplierComboBox() {
    //    var SupplierComboBox = $("#SupplierId").kendoMultiColumnComboBox({
    //        dataTextField: "Name",
    //        dataValueField: "Id",
    //        height: 400,
    //        columns: [
    //            { field: "Code", title: "Code", width: 100 },
    //            { field: "Name", title: "Name", width: 150 }
    //        ],
    //        filter: "contains",
    //        filterFields: ["Code", "Name"],
    //        dataSource: {
    //            transport: {
    //                read: "/Common/Common/GetSupplierList"
    //            }
    //        },
    //        placeholder: "Select Supplier",
    //        value: "",
    //        dataBound: function (e) {
    //            if (getSupplierId) {
    //                this.value(parseInt(getSupplierId));  // Set initial value if available
    //            }
    //        },

    //        //change: function (e) {
    //        //    var selectedItem = this.dataItem();
    //        //    if (selectedItem) {
    //        //        getSupplierId = selectedItem.Id;   // ✅ keep updated
    //        //    } else {
    //        //        getSupplierId = 0;
    //        //    }
    //        //}
    //        change: function (e) {
    //            debugger;
    //            var selectedItem = this.dataItem();
    //            if (selectedItem) {
    //                getSupplierId = selectedItem.Id;
    //                updatePurchaseCodeDataSource(getSupplierId);
    //            } else {
    //                getSupplierId = 0;
    //                updatePurchaseCodeDataSource(0);
    //            }
    //        }


    //    }).data("kendoMultiColumnComboBox");
    //}


    var GetGridDataList = function () {
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
                    url: "/DMS/Payment/GetGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false,
                    success: function (response) {
                        console.log("Response Data:", response); // Debug the data returned from the server
                    }
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
                            if (param.field === "AccountNo") {
                                param.field = "e.AccountNo";
                            }
                            if (param.field === "TransactionDate" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "H.TransactionDate";
                            }

                            if (param.field === "TotalPaymentAmount") {
                                param.field = "H.TotalPaymentAmount";
                            }
                            if (param.field === "Comments") {
                                param.field = "H.Comments";
                            }
                            if (param.field === "Reference") {
                                param.field = "H.Reference";
                            }
                            if (param.field === "IsCash") {
                                let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";

                                if (statusValue.startsWith("a")) {
                                    param.value = 1;
                                } else if (statusValue.startsWith("i")) {
                                    param.value = 0;
                                } else {
                                    param.value = null;
                                }

                                param.field = "H.IsCash";
                                param.operator = "eq";
                            }
                            if (param.field === "Status") {
                                let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";

                                if (statusValue.startsWith("a")) {
                                    param.value = 1;
                                } else if (statusValue.startsWith("i")) {
                                    param.value = 0;
                                } else {
                                    param.value = null;
                                }

                                param.field = "H.IsActive";
                                param.operator = "eq";
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
                            if (param.field === "AccountNo") {
                                param.field = "e.AccountNo";
                            }
                            if (param.field === "TransactionDate" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "H.TransactionDate";
                            }

                            if (param.field === "TotalPaymentAmount") {
                                param.field = "H.TotalPaymentAmount";
                            }
                            if (param.field === "Comments") {
                                param.field = "H.Comments";
                            }
                            if (param.field === "Reference") {
                                param.field = "H.Reference";
                            }
                            if (param.field === "IsCash") {
                                let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";

                                if (statusValue.startsWith("a")) {
                                    param.value = 1;
                                } else if (statusValue.startsWith("i")) {
                                    param.value = 0;
                                } else {
                                    param.value = null;
                                }

                                param.field = "H.IsCash";
                                param.operator = "eq";
                            }
                            if (param.field === "Status") {
                                let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";

                                if (statusValue.startsWith("a")) {
                                    param.value = 1;
                                } else if (statusValue.startsWith("i")) {
                                    param.value = 0;
                                } else {
                                    param.value = null;
                                }

                                param.field = "H.IsActive";
                                param.operator = "eq";
                            }
                        });
                    }
                    return options;
                }
            },
            batch: true,
            schema: {
                data: "Items",  // Ensure this field matches the response data
                total: "TotalCount"  // Ensure this field matches the response data
            }
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
            search: ["Code", "SupplierName", "TransactionDate", "IsCash"],

            excel: {
                fileName: "Payments.xlsx",
                filterable: true
            },
            pdf: {
                fileName: `Payments_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`,
                allPages: true,
                avoidLink: true,
                filterable: true
            },

            columns: [
                {
                    title: "Action",
                    width: 40,
                    attributes: { style: "text-align: center;" },
                    template: function (dataItem) {

                        return `
            <a href="/DMS/Payment/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit" title="Edit Credit Limit">
                <i class="fas fa-pencil-alt"></i>
            </a>`;
                    }
                },
                { field: "Id", width: 50, hidden: true, sortable: true },
                { field: "Code", title: "Code", width: 120, sortable: true },
                { field: "SupplierName", title: "Supplier Name", sortable: true, width: 200 },

                //{ field: "AccountName", title: "Account Name", sortable: true, width: 200 },
                {
                    field: "TransactionDate", title: "Transaction Date", sortable: true, width: 135, template: '#= kendo.toString(kendo.parseDate(TransactionDate), "yyyy-MM-dd") #',
                    filterable:
                    {
                        ui: "datepicker"
                    }
                },
                {
                    field: "IsCash", title: "Cash", sortable: true, width: 100,

                },

                { field: "Comments", title: "Comments", sortable: true, hidden: true, width: 200 },
                {
                    field: "Status", title: "Status", sortable: true, width: 100, hidden: true,
                    filterable: {
                        ui: function (element) {
                            element.kendoDropDownList({
                                dataSource: [
                                    { text: "Yes", value: "1" },
                                    { text: "No", value: "0" }
                                ],
                                dataTextField: "text",
                                dataValueField: "value",
                                optionLabel: "Select Option"
                            });
                        }
                    }
                },
                {
                    field: "TotalPaymentAmount",
                    title: "Total Payment Amount",
                    sortable: true,
                    width: 200,
                    aggregates: ["sum"],
                    format: "{0:n2}",
                    //footerTemplate: "#=kendo.toString(sum, 'n2')#",
                    //groupFooterTemplate: "#=kendo.toString(sum, 'n2')#",
                    attributes: { style: "text-align: left;" }
                }
                ,

                { field: "Reference", title: "Reference", hidden: true, sortable: true, width: 200 },
            ],
            editable: false,
            selectable: "multiple row",
            navigatable: true,
            columnMenu: true
        });


    };


    function save(details) {

        debugger;
        var validator = $("#frmEntry").validate();
        var model = serializeInputs("frmEntry");

        var isCashValue = $('#IsCash').prop('checked');
        model.IsCash = isCashValue;


        var result = validator.form();

        if (!result) {
            validator.focusInvalid();
            ShowNotification(3, "Complete Required Fields.");
            return;
        }

        model.paymentDetailList = details;

        var url = "/DMS/Payment/CreateEdit";

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

        var url = "/DMS/Payment/MultiplePost";

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
        var url = "/DMS/Payment/MultipleIsCompleted";

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




var CollectionController = function (CommonService, CommonAjaxService) {

    
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

        //getSupplierId = $("#SupplierId").val() || 0;
        getCustomerId = $("#CustomerId").val() || 0;
        getBankAccountId = $("#BankAccountId").val();
        decimalPlace = $("#DecimalPlace").val() || 2;
        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';

        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();
        };

        if (getOperation !== '') {
            GetBankAccountComboBox();
            GetCustomerComboBox();
            //GetSupplierComboBox();
            //TotalCalculation();
        };
        calculateTotalCollect();


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
                            var url = "/DMS/Collection/MultiplePost";
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
                window.location.href = "/DMS/Collection/NextPrevious?id=" + getId + "&status=Previous";
            }
        });

        $('#btnNext').click('click', function () {
            var getId = $('#Id').val();
            if (parseInt(getId) > 0) {
                window.location.href = "/DMS/Collection/NextPrevious?id=" + getId + "&status=Next";
            }
        });

        $('#details').on('change', 'input, select', function () {
            debugger;
            calculateTotalCollect();
        });   


        //$('#details').on('change', 'input, select', function () {
        //    debugger;
        //    calculateTotalPaymentAmount();
        //});

        //// Call it on page load to set the initial value
        //$(document).ready(function () {
        //    debugger;
        //    calculateTotalPaymentAmount();
        //});

        //$('#details').on('click', 'input.txtSaleCode', function () {
        //    var originalRow = $(this);
        //    $('#FromDate').val($('#OrderDate').val());
        //    debugger;
        //    originalRow.closest("td").find("input").data('touched', true);
        //    CommonService.saleModal(
        //        function success(result) {
        //            console.log("Modal opened successfully.");
        //        },
        //        function fail(error) {
        //            originalRow.closest("td").find("input").data("touched", false).focus();
        //            console.log("Error opening modal:", error);
        //        },
        //        function dblClick(row) {
        //            saleModalDblClick(row, originalRow);
        //        },
        //        function closeCallback() {
        //            originalRow.closest("td").find("input").data("touched", false).focus();
        //            console.log("Modal closed.");
        //        }
        //    );
        //});

        $('#details').on('click', 'input.txtSaleCode', function () {
            var originalRow = $(this);
            $('#FromDate').val($('#OrderDate').val());
            debugger;
            originalRow.closest("td").find("input").data('touched', true);
            CommonService.saleModal(
                function success(result) {
                    console.log("Modal opened successfully.");
                },
                function fail(error) {
                    originalRow.closest("td").find("input").data("touched", false).focus();
                    console.log("Error opening modal:", error);
                },
                function dblClick(row) {
                    saleModalDblClick(row, originalRow);
                },
                function closeCallback() {
                    originalRow.closest("td").find("input").data("touched", false).focus();
                    console.log("Modal closed.");
                }
            );
        });



        // 🔥 Cash / Bank Toggle Logic
        $("#IsCash").on("switchChange.bootstrapSwitch", function (event, state) {

            var bankCombo = $("#BankAccountId").data("kendoMultiColumnComboBox");

            if (state === true) {
                // Cash selected → ENABLE + LOAD Bank Account
                if (!bankCombo) {
                    GetBankAccountComboBox();
                    bankCombo = $("#BankAccountId").data("kendoMultiColumnComboBox");
                }

                bankCombo.enable(true);
                bankCombo.dataSource.read();
            }
            else {
                // Bank selected → DISABLE + CLEAR
                if (bankCombo) {
                    bankCombo.value("");
                    bankCombo.enable(false);
                }
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

            var url = "/DMS/Collection/ExportPurchaseExcel";

            window.open(url + "?" + params, "_blank");

        });


        // 🔥 Initial Load Handling
        setTimeout(function () {

            var isCash = $("#IsCash").bootstrapSwitch("state");
            var bankCombo = $("#BankAccountId").data("kendoMultiColumnComboBox");

            if (isCash === true) {
                if (!bankCombo) {
                    GetBankAccountComboBox();
                }
                $("#BankAccountId").data("kendoMultiColumnComboBox").enable(true);
            } else {
                if (bankCombo) {
                    bankCombo.enable(false);
                }
            }

        }, 200);




    };


    $("#btnUpload").click(function () {

        pageSubmit('frmPurchaseImport'); 
    });


    function calculateTotalCollect() {
        debugger;
        var total = 0;
        debugger;
        $('.td-CollectionAmount').each(function () {
            debugger;
            let valueText = $(this).find('input').val() || $(this).text();
            let value = parseFloat(valueText.replace(/[^0-9.-]+/g, ''));

            if (!isNaN(value)) {
                total += value;
            }
        });
        // Update TotalPaymentAmount
        $("#TotalCollectAmount").val(total.toFixed(2));
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

    // Function to calculate the total payment amount from the details table
    //function calculateTotalPaymentAmount() {
    //    debugger;
    //    let totalPaymentAmount = 0;

    //    // Loop through each row in the details table
    //    $('#details tbody tr').each(function () {
    //        let paymentAmount = parseFloat($(this).find('.dFormat').text()) || 0;
    //        totalPaymentAmount += paymentAmount;  // Add the PaymentAmount of each row to the total
    //    });

    //    // Set the total sum to the TotalPaymentAmount input field
    //    $('#PurchaseOrderGrandTotalAmount').val(totalPaymentAmount.toFixed(decimalPlace));
    //}



    function saleModalDblClick(row, originalRow) {
        var dataTable = $("#modalData").DataTable();
        var rowData = dataTable.row(row).data();
        debugger;
        var Code = rowData.Code;  // This is your Purchase Code
        var Id = rowData.Id;
        var CustomerId = rowData.CustomerId;
        var CustomerName = rowData.CustomerName;
        var SaleOrderCode = rowData.SaleOrderCode;
        var Comments = rowData.Comments;
        var SaleAmount = rowData.GrandTotal;  // Purchase Amount (Grand Total)

        var Quantity = 1;

        // ✅ Check for duplicates before setting data
        var isDuplicate = false;
        $("#details tbody tr").each(function () {
            var existingProductId = $(this).find(".td-SaleId").text().trim();

            if (existingProductId && existingProductId === Id.toString()) {
                isDuplicate = true;
                // Optional: highlight the existing row
                $(this).addClass("duplicate-highlight");
                setTimeout(() => $(this).removeClass("duplicate-highlight"), 2000);
                return false; // stop loop
            }
        });

        if (isDuplicate) {
            ShowNotification(3, "This purchase has already been added!");
            $("#partialModal").modal("hide");
            return;
        }

        // ✅ No duplicate found → set values to current row
        var $currentRow = originalRow.closest('tr');
        $currentRow.find('.td-SaleCode').text(Code);  // Display Purchase Code in the row
        $currentRow.find('.td-SaleId').text(Id);
        $currentRow.find('.td-SaleAmount').text(SaleAmount);  // Autofill Purchase Amount (Grand Total)

        $("#partialModal").modal("hide");
        originalRow.closest("td").find("input").data("touched", false).focus();
        $('#details').find(".td-Quantity").trigger('blur');
    }


    //function GetBankAccountComboBox() {
    //    debugger;
    //    var SupplierComboBox = $("#BankAccountId").kendoMultiColumnComboBox({
    //        dataTextField: "AccountNo",
    //        dataValueField: "BankId",
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
        $("#BankAccountId").kendoMultiColumnComboBox({
            dataTextField: "AccountNo",
            dataValueField: "BankId",
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
            placeholder: "Select Bank Account",
            value: ""
        });
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
            }
        }).data("kendoMultiColumnComboBox");
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
                var selectedItem = this.dataItem(); 
                if (selectedItem) {
                    var supplierId = selectedItem.Id;
                    var supplierName = selectedItem.Name;

                    console.log("Supplier ID:", supplierId);  
                    console.log("Supplier Name:", supplierName);  

                    $("#details tbody tr").each(function () {
                        $(this).find("td[data-name='SupplierId']").val(supplierId); 

                        $(this).find("td[data-name='SupplierName']").text(supplierName); 
                    });
                }
            }
        }).data("kendoMultiColumnComboBox");
    }



    var GetGridDataList = function () {
        debugger;
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
                    url: "/DMS/Collection/GetGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false
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
                data: "Items",
                total: "TotalCount"
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
            search: {
                fields: ["Code", "Name", "BanglaName", "Address", "BanglaAddress", "TelephoneNo", "FaxNo", "Email", "Comments", "Status"]
            },
            excel: {
                fileName: "Collections.xlsx",
                filterable: true
            },
            pdf: {
                fileName: `Collections_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`,
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


                var fileName = `Collections_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`;

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
                    selectable: true, width: 35
                },
                {
                    title: "Action",
                    width: 170,
                    template: function (dataItem) {

                        return `
            <a href="/DMS/Collection/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit" title="Edit Credit Limit">
                <i class="fas fa-pencil-alt"></i>
            </a>`;
                    }
                },
                { field: "Id", width: 50, hidden: true, sortable: true },
                { field: "Code", title: "Code", width: 150, sortable: true },
                { field: "CustomerName", title: "Customer Name", sortable: true, width: 200 },

                { field: "AccountName", title: "Account Name", sortable: true, width: 200 },
                {
                    field: "TransactionDate", title: "Transaction Date", sortable: true, width: 135, template: '#= kendo.toString(kendo.parseDate(TransactionDate), "yyyy-MM-dd") #',
                  filterable:
                    {
                       ui: "datepicker"
                         }
                     },
                   {
                     field: "IsCash", title: "Is Cash", sortable: true, width: 100,

                     },

                { field: "Comments", title: "Comments", sortable: true, width: 200 },
                {
                    field: "Status", title: "Status", sortable: true, width: 100, hidden: true,
                    filterable: {
                             ui: function (element) {
                               element.kendoDropDownList({
                                  dataSource: [
                                    { text: "Active", value: "1" },
                                      { text: "Inactive", value: "0" }
                                         ],
                                            dataTextField: "text",
                                            dataValueField: "value",
                                            optionLabel: "Select Option"
                                        });
                                    }
                                }
                },
                            {
                                field: "TotalCollectAmount",
                                title: "Total Collect Amountt",
                                sortable: true,
                                width: 200,
                                aggregates: ["sum"],
                                format: "{0:n2}",
                                footerTemplate: "#=kendo.toString(sum, 'n2')#",
                                groupFooterTemplate: "#=kendo.toString(sum, 'n2')#",
                                attributes: { style: "text-align: right;" }
                            }
                            ,

            //    { field: "Reference", title: "Reference", hidden: true, sortable: true, width: 200 },
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
        debugger;
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
            'Quantity': 'Quantity',
            'UnitPrice': 'Unit Price'
        };

        var errorMessage = getRequiredFieldsCheckObj(details, requiredFields, fieldMappings);
        if (errorMessage) {
            ShowNotification(3, errorMessage);
            return;
        };

        //model.GrandTotalAmount = model.GrandTotalAmount.replace(/,/g, '');
        //model.GrandTotalSDAmount = model.GrandTotalSDAmount.replace(/,/g, '');
        //model.GrandTotalVATAmount = model.GrandTotalVATAmount.replace(/,/g, '');

        model.collectionDetailList = details;

        var url = "/DMS/Collection/CreateEdit";

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

        var url = "/DMS/Collection/MultiplePost";

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
        var url = "/DMS/Collection/MultipleIsCompleted";

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
    form.action = '/DMS/Collection/ReportPreview';
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

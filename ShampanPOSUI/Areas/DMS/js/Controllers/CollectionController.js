var CollectionController = function (CommonService, CommonAjaxService) {

    
    var decimalPlace = 0;

    // 🔥 Add this line

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
        
        };

        calculateTotalCollect();




        var rxList = JSON.parse($("#detailsListJson").val() || "[]");

        gridDataSource = new kendo.data.DataSource({
            data: rxList,
            schema: {
                model: {
                    id: "SaleId",
                    fields: {
                        SLNo: { type: "number", editable: false },

                        SaleId: { type: "number" },

                        SaleCode: { type: "string" },

                        SaleAmount: { type: "number" },

                        PaidAmount: { type: "number" },

                        DueAmount: { type: "number"},

                        CollectionAmount: { type: "number" },

                        //PaymentAfter: { type: "number" },

                        DueAfter: { type: "number" }
                    }
                }
            }
        });
        

        var grid = $("#CollectionDetailsGrid").kendoGrid({
            dataSource: gridDataSource,
            toolbar: [{ name: "create", text: "Add" }],
            editable: {
                mode: "incell",
                createAt: "bottom"
            },

            save: function (e) {

                if (e.values.CollectionAmount != null) {

                    var collection = parseFloat(e.values.CollectionAmount) || 0;
                    var paid = parseFloat(e.model.PaidAmount) || 0;
                    var due = parseFloat(e.model.DueAmount) || 0;

                    if (collection > due) {
                        ShowNotification(3, "Collection cannot exceed Due Amount");
                        e.preventDefault();
                        return;
                    }

                    var newPaid = paid + collection;
                    var dueAfter = due - collection;

                    e.model.set("PaidAmount", newPaid);
                    e.model.set("DueAfter", dueAfter);
                }
            },

            remove: function () {
                calculateTotalCollectGrid();
            },

            columns: [
                {
                    field: "SLNo",
                    title: "SL",
                    width: 50,
                    editable: false,
                    template: function (dataItem) {
                        var grid = $("#CollectionDetailsGrid").data("kendoGrid");
                        return grid.dataSource.indexOf(dataItem) + 1;
                    }
                },
                {
                    field: "SaleId",
                    title: "Sale Code",
                    editor: SelectorEditor,
                    template: function (dataItem) {
                        return dataItem.SaleCode || "";
                    },
                    width: 250
                },

                { field: "SaleAmount", title: "Sale Amount", width: 120, format: "{0:n2}", editable: false },
                { field: "PaidAmount", title: "Paid", width: 120, format: "{0:n2}", editable: false },
                { field: "DueAmount", title: "Due", width: 120, format: "{0:n2}", editable: false },

                { field: "CollectionAmount", title: "Collection Amount", width: 150 },

                //{ field: "PaymentAfter", title: "Payment After", width: 150, format: "{0:n2}", editable: false },
                { field: "DueAfter", title: "Due After", width: 150, format: "{0:n2}", editable: false },

                {
                    command: [{ name: "destroy", text: "", iconClass: "k-icon k-i-trash" }],
                    title: " ",
                    width: 50
                }
            ]
        }).data("kendoGrid");

        gridDataSource.bind("change", function () {
            calculateTotalCollectGrid();
        });
        calculateTotalCollectGrid();

        $('.btnsave').click(function (e) {

            e.preventDefault();

            var form = $("#frmEntry");
            var $table = $('#details');

            var mvcValid = form.valid();
            var customValid = CommonValidationHelper.CheckValidation("#frmEntry");

            if (!mvcValid || !customValid) {
                return false;
            }


            var grid = $("#CollectionDetailsGrid").data("kendoGrid");

            var details = grid.dataSource.data().toJSON();



            if (!details || details.length === 0) {
                ShowNotification(3, "Complete Details Entry.");
                return false;
            }

            var requiredFields = ['SaleCode', 'SaleAmount', 'CollectionAmount'];
            var fieldMappings = {
                'SaleCode': 'Sale Code',
                'SaleAmount': 'Sale Amount',
                'CollectionAmount': 'Collection Amount'
            };

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




    };


    $("#btnUpload").click(function () {

        pageSubmit('frmPurchaseImport'); 
    });


    function SelectorEditor(container, options) {
        var wrapper = $('<div class="input-group input-group-sm full-width">').appendTo(container);

        // Create input (you can bind value if needed)
        $('<input type="text" class="form-control" readonly />')
            .attr("data-bind", "value:SaleCode")
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
    function openModal(gridModel) {
        selectedGridModel = gridModel;

        $("#poWindow").kendoWindow({
            title: "Select Order",
            modal: true,
            width: "900px",
            height: "550px",
            visible: false,
            close: function () {
                selectedGridModel = null;
            }
        }).data("kendoWindow").center().open();

        $("#windowGrid").kendoGrid({
            dataSource: {
                transport: {
                    read: {
                        url: "/Common/Common/SaleModal",
                        dataType: "json"
                    }
                },
                pageSize: 10
            },
            pageable: true,
            filterable: true,
            selectable: "row",
            toolbar: ["search"],
            searchable: true,
            columns: [
                { field: "Id", hidden: true },
                { field: "Code", title: "Code", width: 180 },
                { field: "CustomerId", hidden: true },
                { field: "CustomerName", title: "Customer Name", width: 130 },
                { field: "SaleOrderId", hidden: true },
                { field: "SaleOrderCode", title: "SaleOrder Code", width: 180 },
                { field: "GrandTotal", title: "Grand Total", width: 100 },
                { field: "PaymentAmount", title: "Payment Amount", width: 100 },
                { field: "DueAmount", title: "Due Amount", width: 100 },
                { field: "Comments", title: "Comments", width: 100 }
            ],
            dataBound: function () {
                this.tbody.find("tr").on("dblclick", function () {
                    var grid = $("#windowGrid").data("kendoGrid");
                    var dataItem = grid.dataItem(this);
                    if (dataItem && selectedGridModel) {
                        selectedGridModel.set("SaleId", dataItem.Id);
                        selectedGridModel.set("SaleCode", dataItem.Code);
                        selectedGridModel.set("SaleAmount", dataItem.GrandTotal);
                        selectedGridModel.set("PaidAmount", dataItem.PaymentAmount);
                        selectedGridModel.set("DueAmount", dataItem.DueAmount);

                        selectedGridModel.set("CollectionAmount", 0);
                        selectedGridModel.set("PaymentAfter", dataItem.PaymentAmount);
                        selectedGridModel.set("DueAfter", dataItem.DueAmount);

                        var window = $("#poWindow").data("kendoWindow");
                        if (window) window.close();
                    }
                });
            }
        });
    }
    function calculateTotalCollectGrid() {

        var grid = $("#CollectionDetailsGrid").data("kendoGrid");
        var total = 0;

        grid.dataSource.data().forEach(function (item) {
            total += parseFloat(item.CollectionAmount) || 0;
        });

        $("#TotalCollectAmount").val(total.toFixed(2));
    }

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


    //function GetBankAccountComboBox() {

    //    var bankId = $("#BankAccountId").val();

    //    var combo = $("#BankAccountId").kendoMultiColumnComboBox({
    //        dataTextField: "AccountNo",
    //        dataValueField: "Id",
    //        height: 400,
    //        columns: [
    //            { field: "AccountNo", title: "Account No", width: 150 },
    //            { field: "AccountName", title: "Account Name", width: 150 },
    //            { field: "BranchName", title: "Branch Name", width: 150 }
    //        ],
    //        filter: "contains",
    //        filterFields: ["AccountNo", "AccountName", "BranchName"],
    //        dataSource: {
    //            transport: {
    //                read: "/Common/Common/GetBankAccountList"
    //            }
    //        },
    //        placeholder: "Select Bank Account"
    //    }).data("kendoMultiColumnComboBox");

    //    // set value after datasource load
    //    combo.one("dataBound", function () {
    //        if (bankId) {
    //            combo.value(bankId);
    //        }
    //    });

    //}



    function GetBankAccountComboBox() {

        // Get initial value
        var bankId = $("#BankAccountId").val();

        // Initialize Kendo MultiColumnComboBox
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
                    read: {
                        url: "/Common/Common/GetBankAccountList",
                        dataType: "json"
                    }
                },
                schema: {
                    data: function (response) {

                        // 🔥 Remove default 0 item if exists
                        if (Array.isArray(response)) {
                            return response.filter(x => x.Id !== 0);
                        }

                        return response;
                    }
                }
            },

            placeholder: "Select Bank Account",

            // 🔥 Ensure no auto-selection
            autoBind: true,
            suggest: true
        }).data("kendoMultiColumnComboBox");


        // ✅ Set value AFTER data load (ignore 0)
        combo.one("dataBound", function () {

            if (bankId && bankId !== "0") {
                combo.value(bankId);
            } else {
                combo.value(""); // clear selection
            }

        });
    }



    var getCustomerId = $("#CustomerId").val() || "";


    function GetCustomerComboBox() {
        var CustomerComboBox = $("#CustomerId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [
                { field: "Code", title: "Code", width: 100 },
                { field: "Name", title: "Name", width: 150 },
                { field: "BanglaName", title: "BanglaName", width: 200 }
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
                
                if (getCustomerId && getCustomerId !== "0") {
                    this.value(parseInt(getCustomerId));  
                } else {
                    this.value("");  
                }
            }
        }).data("kendoMultiColumnComboBox");

       
        if (!getCustomerId || getCustomerId === "0") {
            CustomerComboBox.value("");  
        }
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
                    width:50,
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

                { field: "AccountName", title: "Account Name", sortable: true, hidden: true, width: 200 },
                {
                    field: "TransactionDate", title: "Transaction Date", sortable: true, width: 135, template: '#= kendo.toString(kendo.parseDate(TransactionDate), "yyyy-MM-dd") #',
                  filterable:
                    {
                       ui: "datepicker"
                         }
                     },
                   {
                       field: "IsCash", title: "Cash", sortable: true, width: 100, hidden: true,

                     },

                { field: "Comments", title: "Comments", hidden: true, sortable: true, width: 200 },
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
                                title: "Total Collect Amount",
                                sortable: true,
                                width: 200,
                                aggregates: ["sum"],
                                format: "{0:n2}",
                                footerTemplate: "#=kendo.toString(sum, 'n2')#",
                                groupFooterTemplate: "#=kendo.toString(sum, 'n2')#",
                                attributes: { style: "text-align: left;" }
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
    function save(details) {

        var validator = $("#frmEntry").validate();
        var model = serializeInputs("frmEntry");

        var result = validator.form();

        if (!result) {
            validator.focusInvalid();
            ShowNotification(3, "Complete Required Fields.");
            return;
        }

        model.collectionDetailList = details;

        var url = "/DMS/Collection/CreateEdit";

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




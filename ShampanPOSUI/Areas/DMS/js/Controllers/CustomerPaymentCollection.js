var CustomerPaymentCollection = function (CommonService, CommonAjaxService) {
    var getCustomerId = 0;
    //var getUserId = 0;
    var getModeOfPayment = 0;
    //var getSaleDeleveryId = 0;
    var getBranchId = 0;
    var operation = "";
    var init = function () {
        getCustomerId = $("#CustomerId").val() || 0;
        //getUserId = $("#UserId").val() || 0;
        getBranchId = $("#BranchId").val() || 0;
        getModeOfPayment = $("#ModeOfPayment").val() || 0;
        operation = $("#Operation").val();
        //getSaleDeleveryId = $("#SaleDeleveryId").val() || 0;
        var getId = $("#Id").val() || 0;
        //var getSaleDeleveryId = $("#SaleDeleveryId").val() || 0;
        var getOperation = $("#Operation").val() || '';

        if ($("#SaleDeleveryNo").val()) {
            $("#Amount").prop("readonly", true);
        } else {
            $("#Amount").prop("readonly", false); // optional — make it editable again
        }
        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();
        };
        GetSalePersonComboBox();

        if (operation == "add") {
            GetCustomerComboBox();
        }
        else if (operation == "update") {
            updateCustomerComboBox(getUserId, $("#BranchId").val());
        }

        GetPaymentTypeComboBox();
        //GetSaleDeleveryComboBox();

        $('.btnsave').click('click', function () {
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

        $('.btnDelete').on('click', function () {

            Confirmation("Are you sure? Do You Want to Delete Data?",
                function (result) {
                    if (result) {
                        SelectData();
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
                            var url = "/DMS/CustomerPaymentCollection/MultiplePost";
                            CommonAjaxService.multiplePost(url, model, postDone, fail);
                        }
                    }
                });
        });

        $('.btnProcess').on('click', function () {

            Confirmation("Are you sure? Do You Want to Process Data?",
                function (result) {

                    if (result) {
                        var model = serializeInputs("frmEntry");
                        if (model.IsProcessed == "True") {
                            ShowNotification(3, "Data has already been Processed.");
                        }
                        else {
                            model.IDs = model.Id;
                            var url = "/DMS/CustomerPaymentCollection/PaymentSettlementProcess";
                            CommonAjaxService.multiplePost(url, model, processDone, fail);
                        }
                    }
                });
        });

        $('#btnPrevious').click('click', function () {
            var getId = $('#Id').val();
            if (parseInt(getId) > 0) {
                window.location.href = "/DMS/CustomerPaymentCollection/NextPrevious?id=" + getId + "&status=Previous";
            }
        });
        $('#btnNext').click('click', function () {
            var getId = $('#Id').val();
            if (parseInt(getId) > 0) {
                window.location.href = "/DMS/CustomerPaymentCollection/NextPrevious?id=" + getId + "&status=Next";
            }
        });
        //$('.txtSaleDeleveryId').on('click', function () {

        //    var customerId = $("#CustomerId").val() || 0;
        //    // Validate customer selection
        //    if (customerId === "0" || customerId === 0) {
        //        ShowNotification(3, "Please select a customer first.");
        //        return;
        //    }

        //    var originalRow = $(this);
        //    $('#FromDate').val($('#InvoiceDateTime').val());
        //    originalRow.closest("td").find("input").data('touched', true);
        //    CommonService.saleDeleveryModal(
        //        function success(result) {
        //        },
        //        function fail(error) {
        //            originalRow.closest("td").find("input").data("touched", false).focus();
        //        },
        //        function dblClick(row) {
        //            DeliveryPersonModalDblClick(row, originalRow);
        //        },
        //        function closeCallback() {
        //            originalRow.closest("td").find("input").data("touched", false).focus();
        //        }
        //    );

        //});

        $('#btnUOMConversation').click('click', function () {
            GetGridDataListofUOMConversation()
        });
        // Handle file input change to preview image
        $("#imageUpload").on("change", function (event) {

            //$("#imageUpload").prop("disabled", false); 
            var file = event.target.files[0];

            if (!file) {
                console.error("No file selected!");
                return;
            }

            var reader = new FileReader();

            reader.onload = function (e) {
                console.log("File loaded successfully!");

                $("#imagePreview").attr("src", e.target.result).show();
                $("#deleteImageBtn").show();
                $("#ImagePath").val(e.target.result);
            };

            reader.onerror = function (error) {
                console.error("Error reading file:", error);
            };

            reader.readAsDataURL(file);
        });

        $("#deleteImageBtn").on("click", function () {
            $(this).addClass("clicked");
            $("#imagePreview").attr("src", "").hide();
            $("#ImagePath").val("");
            $("#deleteImageBtn").hide();
            $("#imageUpload").val("");
            $("#imageUpload").prop("disabled", false);
        });
        //$("#imageUpload").on("change", function (event) {
        //    $("#imageUpload").prop("disabled", true);
        //    var file = event.target.files[0];

        //    if (!file) {
        //        console.error("No file selected!");
        //        return;
        //    }

        //    var reader = new FileReader();

        //    reader.onload = function (e) {
        //        console.log("File loaded successfully!"); // Debugging

        //        // Update the preview image and make it visible
        //        $("#imagePreview").attr("src", e.target.result).show();
        //        $("#deleteImageBtn").show();
        //    };

        //    reader.onerror = function (error) {
        //        console.error("Error reading file:", error);
        //    };

        //    reader.readAsDataURL(file);
        //});

        //$("#deleteImageBtn").on("click", function () {
        //    $(this).addClass("clicked");
        //    $("#imagePreview").attr("src", "").hide(); // Hide preview
        //    $("#ImagePath").val(""); // Clear hidden field
        //    $("#deleteImageBtn").hide();
        //    $("#imageUpload").val("");// Hide delete button
        //    $("#imageUpload").prop("disabled", false);

        //});

        var operation = $("#Operation").val();
        var imagePath = $("#ImagePath").val();
        if (operation == "update" && imagePath !== null) {

            $("#imageUpload").prop("disabled", false);
        }

    };

    function GetSalePersonComboBox() {
        var SalePersonComboBox = $("#UserId").kendoMultiColumnComboBox({
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
                if (getUserId) {
                    this.value(parseInt(getUserId));
                }
            },
            change: function () {

                var selectedSalePerson = this.dataItem(); // Get the selected SalePerson
                var salePersonId = selectedSalePerson ? selectedSalePerson.Id : null;
                var branchId = selectedSalePerson ? selectedSalePerson.BranchId : null;

                // Call the function to update the Customer ComboBox based on SalePersonId and BranchId
                updateCustomerComboBox(salePersonId, branchId);
            }
        }).data("kendoMultiColumnComboBox");
    }
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
                        //updateSaleDeleveryComboBox(selectedItem.id, selectedItem.BranchId)
                    }
                },

                dataBound: function (e) {
                    var dataItems = this.dataSource.view();
                    console.log("Data Items:", dataItems);
                    var customerId = Number(getCustomerId) || 0;
                    this.value("");
                    var selectedItem = dataItems.find(item => item.Id === customerId);
                    if (selectedItem) {
                        this.value(customerId);
                    }


                    //if (getDivisionId) {

                    //    this.value(parseInt(getDivisionId));
                    //}
                },

                //dataBound: function (e) {
                //    if (getCustomerId) {

                //        this.value(parseInt(getCustomerId));

                //    }
                //}
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
        debugger;
        var CustomerComboBox = $("#CustomerId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [

                { field: "Code", title: "Code", width: 100 },
                { field: "Name", title: "Name", width: 100 },
                { field: "Address", title: "Address", width: 150 },
                { field: "Email", title: "Email", width: 150 },


            ],
            filter: "contains",
            filterFields: ["Code", "Name", "Address", "Email"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetCustomerList"
                }
            },
            placeholder: "Select Customer", // Set the placeholder
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
                    var branchId = selectedItem ? selectedItem.BranchId : null;
                    $("#DeliveryAddress").val(address);
                    $("#RegularDiscountRate").val(regularDiscountRate);
                    
                    //GenerateGridByCustomerId(selectedItem.Id);
                }

            }
        }).data("kendoMultiColumnComboBox");
    }
    function GenerateGridByCustomerId(customerId) {
        if (!customerId) {
            $("#SaleGridDataList").empty();
            $("#saleDiv").hide();
            return;
        }

        $("#saleDiv").show();

       

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
                        url: "/DMS/SaleDelivery/GetSaleDueListByCustomerId",
                        type: "POST",
                        dataType: "json",
                        cache: false,
                        data: {
                            customerId: customerId
                        }
                    },
                    parameterMap: function (options) {                        
                        return options;
                    }
                },
                batch: true,
                schema: {
                    data: "Items",
                    total: "TotalCount"
                }
            });

            $("#SaleGridDataList").kendoGrid({
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
                search: ["Code", "Name", "RestAmount"],
                excel: {
                    fileName: "Sale Due.xlsx",
                    filterable: true
                },
                pdfExport: function (e) {
                    $(".k-grid-toolbar").hide();
                    $(".k-grouping-header").hide();
                    $(".k-floatwrap").hide();
                    var grid = e.sender;
                    var actionColumnIndex = grid.columns.findIndex(col => col.title === "Action");
                    var selectionColumnIndex = grid.columns.findIndex(col => col.selectable === true);

                    var actionVisibility = actionColumnIndex >= 0 ? grid.columns[actionColumnIndex].hidden : true;
                    var selectionVisibility = selectionColumnIndex >= 0 ? grid.columns[selectionColumnIndex].hidden : true;
                    if (actionColumnIndex >= 0) grid.hideColumn(actionColumnIndex);
                    if (selectionColumnIndex >= 0) grid.hideColumn(selectionColumnIndex);
                    e.sender.options.pdf = {
                        paperSize: "A4",
                        margin: { top: "4cm", left: "1cm", right: "1cm", bottom: "4cm" },
                        landscape: true,
                        allPages: true,
                        fileName: `Sale_${new Date().toISOString().split('T')[0]}.pdf`
                    };
                    setTimeout(function () {
                        if (actionColumnIndex >= 0) grid.showColumn(actionColumnIndex);
                        if (selectionColumnIndex >= 0) grid.showColumn(selectionColumnIndex);

                        $(".k-grid-toolbar").show();
                        $(".k-grouping-header").show();
                        $(".k-floatwrap").show();
                    }, 1000);
                },

                columns: [
                    { field: "CustomerId", hidden: true },
                    { field: "Code", title: "Sale Delivery No" },
                    { field: "DeliveryDate", title: "Delivery Date",  template: "#= kendo.toString(kendo.parseDate(DeliveryDate), 'dd-MMM-yyyy') #" },
                    { field: "RestAmount", title: "Rest Amount", attributes: { style: "text-align:right" } }
                ],
                editable: false,
                selectable: "multiple row",
                navigatable: true,
                columnMenu: true
            });
            //dataSource: {
            //    transport: {
            //        read: {
            //            url: "/DMS/SaleDelivery/GetSaleDueListByCustomerId",
            //            type: "POST",
            //            dataType: "json",
            //            data: {
            //                customerId: customerId
            //            }
            //        }
            //    },
            //    schema: {
            //        data: "Items",
            //        total: "TotalCount"
            //    },
            //    pageSize: 10,
            //    serverPaging: true,
            //    serverSorting: true,
            //    serverFiltering: true
            //},
            //sortable: true,
            //pageable: true,
            //filterable: true,
            //resizable: true,
            //toolbar: ["search"],
            //columns: [
            //    { field: "CustomerId", hidden: true },
            //    { field: "Code", title: "Code", width: 120 },
            //    { field: "DeliveryDate", title: "Delivery Date", width: 120, template: "#= kendo.toString(kendo.parseDate(DeliveryDate), 'dd-MMM-yyyy') #" },
            //    { field: "RestAmount", title: "Rest Amount", width: 120, attributes: { style: "text-align:right" } }                
            //]
    }

    function GetPaymentTypeComboBox() {
        var PaymentTypeComboBox = $("#ModeOfPayment").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [
                { field: "Name", title: "Name", width: 100 },

            ],
            filter: "contains",
            filterFields: ["Name"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetPaymentTypeList"
                }
            },
            placeholder: "Select Payment Type", // Set the placeholder
            value: "",
            dataBound: function (e) {

                if (getModeOfPayment) {
                    this.value(parseInt(getModeOfPayment));
                }
            },
            change: function (e) {

            }
        }).data("kendoMultiColumnComboBox");
    }

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

        var url = "/DMS/CustomerPaymentCollection/Delete";

        CommonAjaxService.deleteData(url, model, deleteDone, saveFail);
    };
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
                    url: "/DMS/CustomerPaymentCollection/GetGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false
                },
                parameterMap: function (options) {

                    if (options.sort) {
                        options.sort.forEach(function (param) {
                            if (param.field === "Id") {
                                param.field = "M.Id";
                            }
                            if (param.field === "Name") {
                                param.field = "M.Name";
                            }
                            if (param.field === "ModeOfPaymentName") {
                                param.field = "MP.Name";
                            }
                            if (param.field === "CustomerName") {
                                param.field = "C.Name";
                            }
                            if (param.field === "TransactionDate") {
                                param.field = "M.TransactionDate";
                            }
                            if (param.field === "Amount") {
                                param.field = "M.Amount";
                            }
                            if (param.field === "Code") {
                                param.field = "M.Code";
                            }
                            if (param.field === "Status") {
                                param.field = "M.IsPost";
                            }

                        });
                    }

                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (param) {
                            if (param.field === "Id") {
                                param.field = "M.Id";
                            }
                            if (param.field === "Name") {
                                param.field = "M.Name";
                            }
                            if (param.field === "ModeOfPaymentName") {
                                param.field = "MP.Name";
                            }
                            if (param.field === "CustomerName") {
                                param.field = "C.Name";
                            }
                            if (param.field === "TransactionDate") {
                                param.field = "M.TransactionDate";
                            }
                            if (param.field === "Amount") {
                                param.field = "M.Amount";
                            }
                            if (param.field === "Code") {
                                param.field = "M.Code";
                            }
                            if (param.field === "Status") {
                                param.field = "M.IsPost";
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
            search: ["Code", "Name", "ModeOfPaymentName", "CustomerName", "TransactionDate", "Status","Amount"],
            excel: {
                fileName: "UOMs.xlsx",
                filterable: true
            },
            pdfExport: function (e) {
                $(".k-grid-toolbar").hide();
                $(".k-grouping-header").hide();
                $(".k-floatwrap").hide();
                var grid = e.sender;
                var actionColumnIndex = grid.columns.findIndex(col => col.title === "Action");
                var selectionColumnIndex = grid.columns.findIndex(col => col.selectable === true);

                var actionVisibility = actionColumnIndex >= 0 ? grid.columns[actionColumnIndex].hidden : true;
                var selectionVisibility = selectionColumnIndex >= 0 ? grid.columns[selectionColumnIndex].hidden : true;
                if (actionColumnIndex >= 0) grid.hideColumn(actionColumnIndex);
                if (selectionColumnIndex >= 0) grid.hideColumn(selectionColumnIndex);
                e.sender.options.pdf = {
                    paperSize: "A4",
                    margin: { top: "4cm", left: "1cm", right: "1cm", bottom: "4cm" },
                    landscape: true,
                    allPages: true,
                    fileName: `UOMs_${new Date().toISOString().split('T')[0]}.pdf`
                };
                setTimeout(function () {
                    if (actionColumnIndex >= 0) grid.showColumn(actionColumnIndex);
                    if (selectionColumnIndex >= 0) grid.showColumn(selectionColumnIndex);

                    $(".k-grid-toolbar").show();
                    $(".k-grouping-header").show();
                    $(".k-floatwrap").show();
                }, 1000);
            },

            columns: [
                {
                    selectable: true, width: 40
                },
                {
                    title: "Action",

                    template: function (dataItem) {

                        return `
                                 <a href="/DMS/CustomerPaymentCollection/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                                 <i class="fas fa-pencil-alt"></i>
                                 </a>
      
        
                                <a style="background-color: darkgreen;" href="#" onclick="ReportPreview(${dataItem.Id})" class="btn btn-success btn-sm mr-2 edit" title="Report Preview">
                                <i class="fas fa-print"></i>
                                </a>
                        `;
                    }
                },
                { field: "Id", hidden: true, sortable: true },
                { field: "Code", title: "Code", sortable: true },

                { field: "CustomerName", title: "Customer Name", sortable: true },
                { field: "Amount", title: "Amount", sortable: true },
                { field: "ModeOfPaymentName", title: "Mode Of Payment", sortable: true },
                { field: "TransactionDate", title: "Transaction Date", sortable: true },
                {
                    field: "Status", title: "Status", sortable: true,
                    filterable: {
                        ui: function (element) {
                            element.kendoDropDownList({
                                dataSource: [
                                    { text: "Posted", value: "1" },
                                    { text: "Not-posted", value: "0" }
                                ],
                                dataTextField: "text",
                                dataValueField: "value",
                                optionLabel: "Select Status"
                            });
                        }
                    }
                }
            ],
            editable: false,
            selectable: "multiple row",
            navigatable: true,
            columnMenu: true
        });

    };

    //function DeliveryPersonModalDblClick(row, originalRow) {

    //    var dataTable = $("#modalData").DataTable();
    //    //var selectedData = dataTable.row({ selected: true }).data();
    //    //var rowData = dataTable.row(row).data();
    //    var DeliveryPersonId = row.find("td:eq(0)").text();
    //    var SaleDeleveryNo = row.find("td:eq(1)").text();
    //    var GrandTotalAmount = row.find("td:eq(4)").text();
    //    //var paidAmount = selectedData.PaidAmount;

    //    $("#SaleDeleveryId").val(DeliveryPersonId);
    //    $("#SaleDeleveryNo").val(SaleDeleveryNo);
    //    $("#Amount").val(GrandTotalAmount).prop("readonly", true);

    //    var $currentRow = originalRow.closest('tr');

    //    $currentRow.find('.td-DeliveryPersonId').text(SaleDeleveryNo);
    //    $("#partialModal").modal("hide");
    //    originalRow.closest("td").find("input").data("touched", false).focus();

    //};


    function save() {

        var validator = $("#frmEntry").validate();
        var formData = new FormData();
        var model = serializeInputs("frmEntry");
        model.Amount = model.Amount.replace(/,/g, '');
        ;
        var result = validator.form();

        if (!result) {
            validator.focusInvalid();
            return;
        }

        for (var key in model) {
            formData.append(key, model[key]);
        }

        // Handle checkbox value
        formData.append("IsActive", $('#IsActive').prop('checked'));
        //if ($('#IsActive').prop('checked')) {
        //    model.IsActive = true;
        //}
        // Check if delete button was clicked to remove image
        var deleteImageClicked = $("#deleteImageBtn").hasClass("clicked");
        if (deleteImageClicked) {
            formData.append("ImagePath", "");
            $("#imagePreview").remove();
            $("#ImagePath").val("");
        }
        if (parseInt(model.ModeOfPayment) == 0 || model.ModeOfPayment == "") {
            ShowNotification(3, "Mode Of Payment Is Required.");
            return;
        }

        if (parseInt(model.CustomerId) == 0 || model.CustomerId == "") {
            ShowNotification(3, "Customer Is Required.");
            return;
        }
        var fileInput = document.getElementById("imageUpload");
        if (fileInput.files.length > 0) {
            var file = fileInput.files[0];

            if (file.size > 26214400) {
                ShowNotification(3, "Image size cannot exceed 25MB.");
                return;
            }

            formData.append("file", file);
        } else if (!deleteImageClicked) {
            var existingImagePath = $("#ImagePath").val();
            if (existingImagePath) {
                formData.append("ImagePath", existingImagePath);
            }
        }


        // Check if delete button was clicked to remove image
        //var deleteImageClicked = $("#deleteImageBtn").hasClass("clicked");
        //if (deleteImageClicked) {
        //    formData.append("ImagePath", "");  // Mark image for deletion
        //    $("#imagePreview").remove();
        //    $("#ImagePath").val("");
        //}
        //if (parseInt(model.CustomerId) == 0 || model.CustomerId == "") {
        //    ShowNotification(3, "Customer Is Required.");
        //    return;
        //}
        //var fileInput = document.getElementById("imageUpload");
        //if (fileInput.files.length > 0) {

        //    var file = fileInput.files[0];

        //    // ✅ Validate file size (Max 25MB)
        //    if (file.size > 26214400) { // 25MB in bytes
        //        ShowNotification(3, "Image size cannot exceed 25MB.");
        //        return;
        //    }

        //    formData.append("file", file);
        //} else if (!deleteImageClicked) {
        //    var existingImagePath = $("#ImagePath").val();
        //    if (existingImagePath) {
        //        formData.append("ImagePath", existingImagePath);
        //    }
        //}

        var url = "/DMS/CustomerPaymentCollection/CreateEdit";

        CommonAjaxService.finalImageSave(url, formData, saveDone, saveFail);
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

    function deleteDone(result) {

        var grid = $('#GridDataList').data('kendoGrid');
        if (grid) {
            grid.dataSource.read();
        }
        if (result.Status == 200) {
            ShowNotification(1, result.Message);
            // Refresh the grid data
            $("#GridDataListofUOMConversation").data("kendoGrid").dataSource.read();
            $("#GridDataListofUOMConversation").data("kendoGrid").refresh();
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
        filteredData = rowData.filter(x => x.IsPost == true && IDs.includes(x.Id));

        if (filteredData.length > 0) {
            ShowNotification(3, "Data has already been Posted.");
            return;
        }
        var url = "/DMS/CustomerPaymentCollection/MultiplePost";

        CommonAjaxService.multiplePost(url, model, processDone, fail);
    };
    function processDone(result) {

        var grid = $('#GridDataList').data('kendoGrid');
        if (grid) {
            grid.dataSource.read();
        }
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
            $(".sslSync").show();

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
    form.action = '/DMS/CustomerPaymentCollection/ReportPreview';
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

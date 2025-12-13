var CampaignController = function (CommonService, CommonAjaxService) {

    document.getElementById('campaignTitle').textContent = enumName;

    if (enumName === 'CampaignByInvoiceValue') {
        document.getElementById('campaignTitle').textContent = 'Campaign Total Invoice Price List';
    } else if (enumName === 'CampaignByProductValue') {
        document.getElementById('campaignTitle').textContent = 'Campaign Product Unit Rate List';
    } else if (enumName === 'CampaignByProductQuantity') {
        document.getElementById('campaignTitle').textContent = 'Campaign Product Quantity Discount List';
    } else if (enumName === 'CampaignByProductTotalValue') {
        document.getElementById('campaignTitle').textContent = 'Campaign Product Total Price List';
    } else {
        document.getElementById('campaignTitle').textContent = 'Campaign Overview';
    }

    var getCustomerId = 0;
    var getCampaignPersonId = 0;
    var getDeliveryPersonId = 0;
    var getDriverPersonId = 0;
    var getRouteId = 0;
    var getCurrencyId = 0;

    var init = function () {
        
        if ($("#IsPosted").length) {
            LoadCombo("IsPosted", '/Common/Common/GetBooleanDropDown');
            $("#IsPosted").val('');
            GetBranchList();
        };

        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';

        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();
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

        $('#btnPost').on('click', function () {

            Confirmation("Are you sure? Do You Want to Post Data?",
                function (result) {
                    console.log(result);
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
                            var url = "/DMS/Campaign/MultiplePost";
                            CommonAjaxService.multiplePost(url, model, postDone, fail);
                        }
                    }
                });
        });        

        $('#details').on('click', "input.txt" + "CustomerName", function () {
            var originalRow = $(this);
            originalRow.closest("td").find("input").data('touched', true);
            CommonService.customerCodeModal(
                function success(result) {
                    console.log("Modal opened successfully.");
                },
                function fail(error) {
                    originalRow.closest("td").find("input").data("touched", false).focus();
                    console.error("Error opening modal:", error);
                },
                function dblClick(row) {
                    CustomerModalDblClick(row, originalRow);
                },
                function closeCallback() {
                    originalRow.closest("td").find("input").data("touched", false).focus();
                    console.log("Modal closed.");
                }
            );
        });

        $('#details').on('click', "input.txt" + "ProductName", function () {
            var originalRow = $(this);
            originalRow.closest("td").find("input").data('touched', true);
            CommonService.productModal(
                function success(result) {
                    console.log("Modal opened successfully.");
                },
                function fail(error) {
                    originalRow.closest("td").find("input").data("touched", false).focus();
                    console.error("Error opening modal:", error);
                },
                function dblClick(row) {
                    productModalDblClick(row, originalRow);
                },
                function closeCallback() {
                    originalRow.closest("td").find("input").data("touched", false).focus();
                    console.log("Modal closed.");
                }
            );
        });

        $('#details').on('click', 'input.txt' + 'FreeProductName', function () {
            var originalRow = $(this);            
            originalRow.closest("td").find("input").data('touched', true);
            CommonService.productModal(
                function success(result) {
                    console.log("Modal opened successfully.");
                },
                function fail(error) {
                    originalRow.closest("td").find("input").data("touched", false).focus();
                    console.error("Error opening modal:", error);
                },
                function dblClick(row) {
                    FreeproductModalDblClick(row, originalRow);
                },
                function closeCallback() {
                    originalRow.closest("td").find("input").data("touched", false).focus();
                    console.log("Modal closed.");
                }
            );
        });      
        $('.ReportPreview').on('click', function () {
            
            var id = $("#Id").val();
            ReportPreview(id);
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

        $(".tblCIV").on('change', ".td-ToAmount input", function () {
            
            var currentRow = $(this).closest('tr');

            var fromAmountText = currentRow.find("td.td-FromAmount span").text().trim();

            fromAmountText = fromAmountText.replace(/,/g, '');
            var fromAmount = parseFloat(fromAmountText) || 0;

            var toAmount = parseFloat($(this).val()) || 0;

            if (toAmount <= fromAmount) {
                alert("To Amount cannot be less than or equal to From Amount!");
                $(this).val(''); // Clear the input
                $(this).focus();
            }
        });

        $(".tblCIV").on('change', ".td-DiscountRateBasedOnTotalPrice input", function () {          

            var discount = parseFloat($(this).val()) || 0;

            if (discount >= 100) {
                alert("Discount Should Not be more then 100% !");
                $(this).val(''); 
                $(this).focus();
            }
        });

        $(".tblCPV").on('change', ".td-ToQuantity input", function () {
            
            var currentRow = $(this).closest('tr');

            var fromAmountText = currentRow.find("td.td-FromQuantity span").text().trim();

            fromAmountText = fromAmountText.replace(/,/g, '');
            var fromAmount = parseFloat(fromAmountText) || 0;

            var toAmount = parseFloat($(this).val()) || 0;

            if (toAmount <= fromAmount) {
                alert("To Quantity cannot be less than or equal to From Quantity!");
                $(this).val(''); // Clear the input
                $(this).focus();
            }
        });

        $(".tblCPV").on('change', ".td-DiscountRateBasedOnUnitPrice input", function () {

            var discount = parseFloat($(this).val()) || 0;

            if (discount >= 100) {
                alert("Discount Should Not be more then 100% !");
                $(this).val('');
                $(this).focus();
            }
        });       

        // Select/Deselect All
        $(document).on("change", "#selectAllProducts", function () {
            $(".row-select").prop("checked", $(this).prop("checked"));
        });

        // Handle Add Button
        $(document).on("click", "#btnAddProducts", function () {
            var dataTable = $("#modalData").DataTable();
            var selectedRows = [];

            // Get all checked rows from modal
            $("#modalData .row-select:checked").each(function () {
                var row = $(this).closest("tr");
                var rowData = dataTable.row(row).data();
                selectedRows.push(rowData);
            });

            if (selectedRows.length === 0) {
                ShowNotification(2, "Please select at least one product");
                return;
            }

            // Function to check if product already exists in #details table
            function isDuplicate(productId) {
                var duplicate = false;
                $("#details tbody tr").each(function () {
                    var existingProductId = $(this).find("td.td-ProductId").text();
                    if (existingProductId == productId) {
                        duplicate = true;
                        return false;
                    }
                });
                return duplicate;
            }

            // Fill the first product in the touched row
            var $currentRow = $("input.txtProductName").filter(function () {
                return $(this).data("touched") === true;
            }).closest("tr");

            if (!isDuplicate(selectedRows[0].ProductId)) {
                $currentRow.find("td.td-ProductName").text(selectedRows[0].ProductName);
                $currentRow.find("td.td-ProductId").text(selectedRows[0].ProductId);
                $currentRow.find("td.td-CustomerName").text("ALL");
                $currentRow.find("td.td-CustomerId").text(0);
                $currentRow.find("td.td-FromQuantity").text(selectedRows[0].CtnSize);
            } else {
                ShowNotification(3, "Product '" + selectedRows[0].ProductName + "' is already added!");
            }

            // Function to add remaining products
            function addNextProduct(index) {
                if (index >= selectedRows.length) return;
                
                var product = selectedRows[index];
                
                if (isDuplicate(product.ProductId)) {
                    console.warn("Duplicate product skipped: " + product.ProductName);
                    addNextProduct(index + 1);
                    return;
                }

                $("#addRows").trigger("click");

                setTimeout(function () {
                    var $lastRow = $("#details tbody tr").last();
                    
                    $lastRow.find("td.td-ProductName").text(product.ProductName);
                    $lastRow.find("td.td-ProductId").text(product.ProductId);

                    // Fill default customer values
                    $lastRow.find("td.td-CustomerName").text("ALL");
                    $lastRow.find("td.td-CustomerId").text(0);
                    $lastRow.find("td.td-FromQuantity").text(product.CtnSize);

                    addNextProduct(index + 1);
                }, 50);
            }

            // Add remaining selected products
            addNextProduct(1);

            // Close modal and reset touched flags
            $("#partialModal").modal("hide");
            $("input.txtProductName").data("touched", false);
        });

        //$(document).on("click", "#btnAddProducts", function () {
        //    var dataTable = $("#modalData").DataTable();
        //    var selectedRows = [];

        //    // Get all checked rows from modal
        //    $("#modalData .row-select:checked").each(function () {
        //        var row = $(this).closest("tr");
        //        var rowData = dataTable.row(row).data();
        //        selectedRows.push(rowData);
        //    });

        //    if (selectedRows.length === 0) {
        //        alert("Please select at least one product!");
        //        return;
        //    }

        //    // Fill the first product in the touched row
        //    var $currentRow = $("input.txtProductName").filter(function () {
        //        return $(this).data("touched") === true;
        //    }).closest("tr");

        //    $currentRow.find("td.td-ProductName").text(selectedRows[0].ProductName);
        //    $currentRow.find("td.td-ProductId").text(selectedRows[0].ProductId);
        //    $currentRow.find("td.td-CustomerName").text("ALL");
        //    $currentRow.find("td.td-CustomerId").text(0);

        //    // Function to add remaining products
        //    function addNextProduct(index) {
        //        if (index >= selectedRows.length) return;

        //        $("#addRows").trigger("click");

        //        setTimeout(function () {
        //            var $lastRow = $("#details tbody tr").last();

        //            // Fill product name and ID as text (no input)
        //            $lastRow.find("td.td-ProductName").text(selectedRows[index].ProductName);
        //            $lastRow.find("td.td-ProductId").text(selectedRows[index].ProductId);

        //            // Fill default customer values
        //            $lastRow.find("td.td-CustomerName").text("ALL");
        //            $lastRow.find("td.td-CustomerId").text(0);

        //            addNextProduct(index + 1);
        //        }, 50);
        //    }

        //    // Add remaining selected products
        //    addNextProduct(1);

        //    // Close modal and reset touched flags
        //    $("#partialModal").modal("hide");
        //    $("input.txtProductName").data("touched", false);
        //});

        $("#Description").kendoEditor({
            resizable: true,
            tools: [
                "bold", "italic", "underline", "strikethrough",
                "insertUnorderedList", "insertOrderedList",
                "indent", "outdent", "createLink", "unlink",
                "insertImage", "viewHtml", "formatting"
            ]
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

    function CustomerModalDblClick(row, originalRow) {
        
        var dataTable = $("#modalData").DataTable();
        var rowData = dataTable.row(row).data();

        var CustomerId = rowData.CustomerId;
        var CustomerName = rowData.CustomerName;


        originalRow.closest("td").find("input").val(CustomerName);
        originalRow.closest('td').next().text(CustomerId);


        $("#partialModal").modal("hide");
        originalRow.closest("td").find("input").data("touched", false);
        originalRow.closest("td").find("input").focus();
        $("#myModal1").modal("show");

    };
    //function productModalDblClick(row, originalRow) {

    //    var dataTable = $("#modalData").DataTable();
    //    var rowData = dataTable.row(row).data();

    //    var ProductId = rowData.ProductId;
    //    var ProductName = rowData.ProductName;


    //    originalRow.closest("td").find("input").val(ProductName);
    //    originalRow.closest('td').next().text(ProductId);


    //    $("#partialModal").modal("hide");
    //    originalRow.closest("td").find("input").data("touched", false);
    //    originalRow.closest("td").find("input").focus();
    //    $("#myModal1").modal("show");
    //};
    function productModalDblClick(row, originalRow) {
        var dataTable = $("#modalData").DataTable();
        var rowData = dataTable.row(row).data();

        var ProductId = rowData.ProductId;
        var ProductName = rowData.ProductName;
        var CtnSize = rowData.CtnSize; // ✅ new line to capture carton size

        // Check for duplicates in the #details table
        var isDuplicate = false;
        $("#details tbody tr").each(function () {
            var existingProductId = $(this).find("td:eq(4)").text();
            if (existingProductId == ProductId) {
                isDuplicate = true;
                return false;
            }
        });

        if (isDuplicate) {
            ShowNotification(3, "This product has already been added!");
            $("#partialModal").modal("hide");
            return;
        }

        // ✅ If not duplicate, add product info
        originalRow.closest("td").find("input").val(ProductName);
        originalRow.closest("td").next().text(ProductId);

        // ✅ Fill FromQuantity column (6th visible column → adjust if structure changes)
        // Find the same row in the #details table
        var $tr = originalRow.closest("tr");

        // Locate FromQuantity column and set the CtnSize value
        $tr.find('td[data-name="FromQuantity"], td:eq(5)').text(CtnSize);

        // Close modal and reset focus
        $("#partialModal").modal("hide");
        originalRow.closest("td").find("input").data("touched", false);
        originalRow.closest("td").find("input").focus();
        $("#myModal1").modal("show");
    }

    //function productModalDblClick(row, originalRow) {
    //    var dataTable = $("#modalData").DataTable();
    //    var rowData = dataTable.row(row).data();

    //    var ProductId = rowData.ProductId;
    //    var ProductName = rowData.ProductName;

    //    // Check for duplicates in the #details table
    //    var isDuplicate = false;
    //    $("#details tbody tr").each(function () {
    //        var existingProductId = $(this).find("td:eq(4)").text();
    //        if (existingProductId == ProductId) {
    //            isDuplicate = true;
    //            return false;
    //        }
    //    });

    //    if (isDuplicate) {
    //        ShowNotification(3, "This product has already been added!");
    //        $("#partialModal").modal("hide");
    //        return;
    //    }
    //    

    //    // If not duplicate, add the product
    //    originalRow.closest("td").find("input").val(ProductName);
    //    originalRow.closest('td').next().text(ProductId);

    //    $("#partialModal").modal("hide");
    //    originalRow.closest("td").find("input").data("touched", false);
    //    originalRow.closest("td").find("input").focus();
    //    $("#myModal1").modal("show");
    //}

    function FreeproductModalDblClick(row, originalRow) {
        
        var dataTable = $("#modalData").DataTable();
        var rowData = dataTable.row(row).data();

        var ProductId = rowData.ProductId;
        var ProductName = rowData.ProductName;


        originalRow.closest("td").find("input").val(ProductName);
        originalRow.closest('td').next().text(ProductId);


        $("#partialModal").modal("hide");
        originalRow.closest("td").find("input").data("touched", false);
        originalRow.closest("td").find("input").focus();
        $("#myModal1").modal("show");
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
        var EnumId = $("#EnumTypeId").val();
        
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
                    url: "/DMS/Campaign/GetGridData",
                    type: "POST",
                    dataType: "json",
                    data: function () {
                        return {
                            EnumId: EnumId,
                            branchId: branchId, isPost: IsPosted, fromDate: FromDate,           toDate: ToDate, // Send EnumId in the request
                            // Optionally, you can include other filters or parameters here

                        };
                    }

                },
                parameterMap: function (options) {
                    
                    if (options.sort) {
                        options.sort.forEach(function (param) {
                            if (param.field === "Code") {
                                param.field = "H.Code";
                            }
                            if (param.field === "CustomerName") {
                                param.field = "cus.CustomerName";
                            }
                           
                            if (param.field === "Name") {
                                param.field = "H.Name";
                            }

                            if (param.field === "Description") {
                                param.field = "H.Description";
                            }
                         

                            if (param.field === "Status") {
                                param.field = "H.IsPost";
                            }
                            //if (param.field === "Status") {
                            //    let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";

                            //    if (statusValue.startsWith("a")) {
                            //        param.value = 1;
                            //    } else if (statusValue.startsWith("i")) {
                            //        param.value = 0;
                            //    } else {
                            //        param.value = null;
                            //    }

                            //    param.field = "H.IsActive";
                            //    param.operator = "eq";
                            //}
                        });
                    }

                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (param) {
                            if (param.field === "Code") {
                                param.field = "H.Code";
                            }
                            if (param.field === "CustomerName") {
                                param.field = "cus.CustomerName";
                            }
                           
                            if (param.field === "Name") {
                                param.field = "H.Name";
                            }

                            if (param.field === "Description") {
                                param.field = "H.Description";
                            }    

                            if (param.field === "Status") {
                                param.field = "H.IsPost";
                            }
                            //if (param.field === "Status") {
                            //    let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";

                            //    if (statusValue.startsWith("a")) {
                            //        param.value = 1;
                            //    } else if (statusValue.startsWith("i")) {
                            //        param.value = 0;
                            //    } else {
                            //        param.value = null;
                            //    }

                            //    param.field = "H.IsActive";
                            //    param.operator = "eq";
                            //}


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

                }
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
                fields: ["Code", "Name", "Description","CampaignEntryDate "]
            },
            excel: {
                fileName: "CampaignList.xlsx",
                filterable: true
            },
            pdf: {
                fileName: `CampaignList_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`,
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


                var fileName = `CampaignList_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`;

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
                    selectable: true, width: 30
                },
                {
                    title: "Action",
                    width: 100,
                    template: function (dataItem) {
                        console.log(dataItem);
                        return `
                                <a href="/DMS/Campaign/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                                    <i class="fas fa-pencil-alt"></i>
                                </a> 
                                <a style='background-color: darkgreen;' href='#' onclick='ReportPreview(${dataItem.Id})' class='btn btn-success btn-sm mr-2 edit' title='Report Preview'>
                <i class='fas fa-print'></i>
            </a>`;
                    }
                },
                { field: "Id", hidden: true, sortable: true },
                { field: "Code", title: "Code",sortable: true },
                { field: "CampaignEntryDate", title: "Campaign Entry Date", sortable: true },
                { field: "Name", title: "Name", sortable: true },
                {
                    field: "Description",
                    title: "Description",
                    template: "#= Description #",
                    encoded: false,
                    sortable: true,
                    hidden: true
                },
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
                                optionLabel: "Select Option"
                            });
                        }
                    }
                }
                //{
                //    field: "Status", title: "Status", sortable: true,
                //    filterable: {
                //        ui: function (element) {
                //            element.kendoDropDownList({
                //                dataSource: [
                //                    { text: "Active", value: "1" },
                //                    { text: "Inactive", value: "0" }
                //                ],
                //                dataTextField: "text",
                //                dataValueField: "value",
                //                optionLabel: "Select Option"
                //            });
                //        }
                //    }
                //}




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

        if (model.Name == "") {
            ShowNotification(3, "Name Is Required.");
            return;
        }
        
        var EnumName = $('#EnumName').val();


        var result = validator.form();

        if (!result) {
            validator.focusInvalid();
            return;
        }
        if ($('#IsActive').prop('checked')) {
            model.IsActive = true;
        }
        if (model.IsPost == 'True') {
            ShowNotification(2, "Post operation is already done, Do not update this entry");
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
       
        var details = serializeTable($table);

        if (EnumName === 'CampaignByProductValue' || EnumName === 'CampaignByProductQuantity' || EnumName === 'CampaignByProductTotalValue') {
            var productNames = details.map(x => x.ProductName?.trim()).filter(x => x); // get non-empty names
            var duplicates = productNames.filter((item, index) => productNames.indexOf(item) !== index);

            if (duplicates.length > 0) {
                ShowNotification(3, "Duplicate Product Name found: " + duplicates.join(", "));
                return;
            }
        }
        
        if (EnumName == 'CampaignByInvoiceValue') {
            var requiredFields = ['CustomerName'];
            var fieldMappings = {
                'CustomerName': 'Customer Name',
            
            };
            model.campaignDetailByInvoiceValue = details;

        }
        else if (EnumName == 'CampaignByProductValue') {
            var requiredFields = ['CustomerName','ProductName'];
            var fieldMappings = {
                'CustomerName': 'Customer Name',
                'ProductName': 'Product Name',

            };
            model.campaignDetailByProductValue = details;

        }
        else if (EnumName == 'CampaignByProductQuantity') {
            var requiredFields = ['CustomerName', 'ProductName','FreeProductName'];
            var fieldMappings = {
                'CustomerName': 'Customer Name',
                'ProductName': 'Product Name',
                'FreeProductName': 'Free Product Name',

            };
            model.campaignDetailByQuantity = details;

        }
        else if (EnumName == 'CampaignByProductTotalValue') {
            var requiredFields = ['CustomerName', 'ProductName', 'FreeProductName'];
            var fieldMappings = {
                'CustomerName': 'Customer Name',
                'ProductName': 'Product Name',

            };
            model.campaignDetailByProductTotalValue = details;

        }

        

        var errorMessage = getRequiredFieldsCheckObj(details, requiredFields, fieldMappings);
        if (errorMessage) {
            ShowNotification(3, errorMessage);
            return;
        };

       
        var url = "/DMS/Campaign/CreateEdit";
        
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
        
        console.log(result);
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

        var url = "/DMS/Campaign/MultiplePost";

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
            $(".divPost").show();
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

function ReportPreview(id) {
    
    const form = document.createElement('form');
    form.method = 'post';
    form.action = '/DMS/Campaign/ReportPreview';
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
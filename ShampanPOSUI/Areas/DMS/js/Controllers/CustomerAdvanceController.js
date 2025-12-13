var CustomerAdvanceController = function (CommonService, CommonAjaxService) {
    var getBranchId = 0;
    var getCustomerId = 0;
    var getPaymentEnumTypeId = 0;
    //var getReceiveByDeliveryPersonId = 0;
    //var getReceiveByEnumTypeId = 0;
    var init = function () {
        getBranchId = $("#BranchId").val() || 0;
        getCustomerId = $("#CustomerId").val() || 0;
        getPaymentEnumTypeId = $("#PaymentEnumTypeId").val() || 0;
        //getReceiveByDeliveryPersonId = $("#ReceiveByDeliveryPersonId").val() || 0;
        //getReceiveByEnumTypeId = $("#ReceiveByEnumTypeId").val() || 0;
        var getId = $("#Id").val() || 0;
        if (parseInt(getId) == 0) {
            GetGridDataList();
        };   
        var isIndex = $("#IsIndex").val().toLowerCase() === "true";
      
        if (!isIndex) {
            //BranchComboBox();
           // CustomerComboBox();
            PaymentEnumTypeComboBox();
        //    ReceiveByDeliveryPersonComboBox();
        //    ReceiveByEnumTypeComboBox();
        }  
        


  

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

        $('#btnPost').on('click', function () {

            Confirmation("Are you sure? Do You Want to Post Data?",
                function (result) {
                    
                    if (result) {
                        SelectData();
                    }
                });
        });


    };

    function BranchComboBox() {

        var ProductGroupComboBox = $("#BranchId").kendoMultiColumnComboBox({
            dataTextField: "Code",
            dataValueField: "Id",
            height: 400,
            columns: [
                { field: "Code", title: "Code", width: 100 },
                { field: "Name", title: "Name", width: 150 },
                { field: "DistributorCode", title: "DistributorCode", width: 200 },
            ],
            filter: "contains",
            filterFields: ["Code", "Name", "DistributorCode"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetBranchList"
                }
            },
            placeholder: "Select Branch",
            value: "",
            dataBound: function (e) {
                if (getBranchId) {
                    this.value(parseInt(getBranchId));
                }
            },
            change: function (e) {
              
            }
        }).data("kendoMultiColumnComboBox");
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
    function PaymentEnumTypeComboBox() {

        var PaymentEnumTypeComboBox = $("#PaymentEnumTypeId").kendoMultiColumnComboBox({
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

                    read: "/Common/Common/GetCompanyTypeList?value=PaymentType"

                }
            },
            placeholder: "Select Payment Enum Type",
            value: "",
            dataBound: function (e) {
                if (getPaymentEnumTypeId) {
                    this.value(parseInt(getPaymentEnumTypeId));
                }
            },
            change: function (e) {
              
            }
        }).data("kendoMultiColumnComboBox");

    }

    //function ReceiveByDeliveryPersonComboBox() {

    //    var ReceiveByDeliveryPersonComboBox = $("#ReceiveByDeliveryPersonId").kendoMultiColumnComboBox({
    //        dataTextField: "Name",
    //        dataValueField: "Id",
    //        height: 400,
    //        columns: [
    //            { field: "Name", title: "Name", width: 100 },
    //            { field: "EnumType", title: "EnumType", width: 150 },
    //        ],
    //        filter: "contains",
    //        filterFields: ["Name", "EnumType"],
    //        dataSource: {
    //            transport: {

    //                read: "/Common/Common/GetReceiveByDeliveryPersonList"

    //            }
    //        },
    //        placeholder: "Select Delivery Person",
    //        value: "",
    //        dataBound: function (e) {
    //            if (getReceiveByDeliveryPersonId) {
    //                this.value(parseInt(getReceiveByDeliveryPersonId));
    //            }
    //        },
    //        change: function (e) {
              
    //        }
    //    }).data("kendoMultiColumnComboBox");

    //}

    //function ReceiveByEnumTypeComboBox() {

    //    var ReceiveByEnumTypeComboBox = $("#ReceiveByEnumTypeId").kendoMultiColumnComboBox({
    //        dataTextField: "Name",
    //        dataValueField: "Id",
    //        height: 400,
    //        columns: [
    //            { field: "Name", title: "Name", width: 100 },

    //        ],
    //        filter: "contains",
    //        filterFields: ["Name", "EnumType"],
    //        dataSource: {
    //            transport: {

    //                read: "/Common/Common/GetCompanyTypeList?value=CustomerAdvanceReceiptBy"

    //            }
    //        },
    //        placeholder: "Select Enum Type",
    //        value: "",
    //        dataBound: function (e) {
    //            if (getReceiveByEnumTypeId) {
    //                this.value(parseInt(getReceiveByEnumTypeId));
    //            }
    //        },
    //        change: function (e) {
              
    //        }
    //    }).data("kendoMultiColumnComboBox");

    //}

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
        //filteredData = rowData.filter(x => x.IsPost === "True" && IDs.includes(x.Id));
        filteredData = rowData.filter(x => x.IsPost === true && IDs.includes(x.Id));


        if (filteredData.length > 0) {
            ShowNotification(3, "Data has already been Posted.");
            return;
        }

        var url = "/DMS/CustomerAdvance/MultiplePost";

        CommonAjaxService.multiplePost(url, model, postDone, postfail);
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
    function postfail(err) {
      
        ShowNotification(3, "Something gone wrong");
    };


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
                    url: "/DMS/CustomerAdvance/GetGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false,
                    data: { getCustomerId: getCustomerId }
                },
                parameterMap: function (options) {
                  
                    if (options.sort) {
                        options.sort.forEach(function (param) {
                            if (param.field === "Id") {
                                param.field = "H.Id";
                            }
                            
                            if (param.field === "AdvanceEntryDate") {
                                param.field = "H.AdvanceEntryDate";
                            }
                            if (param.field === "AdvanceAmount") {
                                param.field = "H.AdvanceAmount";
                            }
                            if (param.field === "PaymentDate") {
                                param.field = "H.PaymentDate";
                            }
                            if (param.field === "DocumentNo") {
                                param.field = "H.DocumentNo";
                            }
                            if (param.field === "BankName") {
                                param.field = "H.BankName";
                            }
                            if (param.field === "CustomerName") {
                                param.field = "C.Name";
                            }
                            if (param.field === "Status") {
                                param.field = "H.IsPost";
                            }
                        });
                    }

                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (param) {
                            if (param.field === "Id") {
                                param.field = "H.Id";
                            }
                            if (param.field === "AdvanceEntryDate") {
                                param.field = "H.AdvanceEntryDate";
                            }
                            if (param.field === "AdvanceAmount") {
                                param.field = "H.AdvanceAmount";
                            }
                            if (param.field === "PaymentDate") {
                                param.field = "H.PaymentDate";
                            }
                            if (param.field === "DocumentNo") {
                                param.field = "H.DocumentNo";
                            }
                            if (param.field === "BankName") {
                                param.field = "H.BankName";
                            }
                            if (param.field === "CustomerName") {
                                param.field = "C.Name";
                            }
                            if (param.field === "Status") {
                                param.field = "H.IsPost";
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
            search: ["CustomerName", "BankName", "DocumentNo"],
            excel: {
                fileName: "Products.xlsx",
                filterable: true
            },
            pdf: {
                fileName: `Products_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`,
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


                var fileName = `Products_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`;

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
                    selectable: true, width: 50
                },
                {
                    title: "Action",
                    width: 60,
                    template: function (dataItem) {
                      
                        return `
                                <a href="/DMS/CustomerAdvance/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                                    <i class="fas fa-pencil-alt"></i>
                                </a>`;
                    }
                },

                { field: "Id", width: 50, hidden: true, sortable: true },
                { field: "CustomerName", title: "Customer", sortable: true, width: 200 },
                { field: "BankName", title: "Bank Name", sortable: true, width: 200 },
                {
                    field: "AdvanceEntryDate", title: "Advance Entry Date", sortable: true, width: 150, template: '#= kendo.toString(kendo.parseDate(AdvanceEntryDate), "yyyy-MM-dd") #',
                    filterable:
                    {
                        ui: "datepicker"
                    }
                },
                { field: "AdvanceAmount", title: "Advance Amount", sortable: true, width: 200 },
                {
                    field: "PaymentDate", title: "Payment Date", sortable: true, width: 150, template: '#= kendo.toString(kendo.parseDate(PaymentDate), "yyyy-MM-dd") #',
                    filterable:
                    {
                        ui: "datepicker"
                    }
                },
                { field: "DocumentNo", title: "Document No.", sortable: true, width: 200 },
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


            ],
            editable: false,
            selectable: "multiple row",
            navigatable: true,
            columnMenu: true
        });



        

    };

    function save() {
        var isDropdownValid1 = CommonService.validateDropdown("#PaymentEnumTypeId", "#titleError1", "Payment Enum Type is required");
        //var isDropdownValid2 = CommonService.validateDropdown("#ReceiveByDeliveryPersonId", "#titleError2", "Delivery Person is required");
        //var isDropdownValid3 = CommonService.validateDropdown("#ReceiveByEnumTypeId", "#titleError3", "Enum Type is required");


        var isDropdownValid = isDropdownValid1;

        var status = $('#IsActive').is(':checked');
        var validator = $("#frmEntry").validate();
        var model = serializeInputs("frmEntry");

        var result = validator.form();

        if (!result || !isDropdownValid) {
            if (!result) {
                validator.focusInvalid();
            }
            return;
        }
        if ($('#IsActive').prop('checked')) {
            model.IsActive = true;
        }
        if (parseInt(model.PaymentEnumTypeId) == 0) {
            ShowNotification(3, 'Payment Enum Type is Required.');
            return;
        }
        //if (parseInt(model.ReceiveByEnumTypeId) == 0) {
        //    ShowNotification(3, 'Receive By Enum Type is Required.');
        //    return;
        //}
        //if (parseInt(model.ReceiveByDeliveryPersonId) == 0) {
        //    ShowNotification(3, 'Receive By Delivery Person is Required.');
        //    return;
        //}

        model.AdvanceAmount = model.AdvanceAmount.replace(/,/g, '');
        var url = "/DMS/CustomerAdvance/CreateEdit";

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

    function fail(err) {
      
        
        ShowNotification(3, "Something gone wrong");
    };

    return {
        init: init
    }


}(CommonService, CommonAjaxService);


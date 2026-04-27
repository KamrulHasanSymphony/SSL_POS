var TableReservationController = function (CommonService, CommonAjaxService) {

    var init = function () {

        getTableId = $("#TableId").val();
        getStatusId = $("#Status").val();

        GetTableComboBox();
        GetStatusComboBox();

        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';
        debugger;
        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();

        };
        $(document).ready(function () {
            $("#ReservationTime").kendoDateTimePicker({
                //format: "HH:mm", // 24-hour format
                //step: 30, // 30-minute interval
                value: new Date() // Optional: Set the default value to current time
            });
        });

        $('.btnsave').on('click', function (e) {
            debugger;

            e.preventDefault();

            var form = $("#frmEntry");

            var mvcValid = form.valid();

            var customValid = CommonValidationHelper.CheckValidation("#frmEntry");

            if (!mvcValid || !customValid) {
                return false;
            }

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


        });

        $('#btnPrevious').click('click', function () {
            var getId = $('#Id').val();
            if (parseInt(getId) > 0) {
                window.location.href = "/DMS/TableReservation/NextPrevious?id=" + getId + "&status=Previous";
            }
        });
        $('#btnNext').click('click', function () {
            var getId = $('#Id').val();
            if (parseInt(getId) > 0) {
                window.location.href = "/DMS/TableReservation/NextPrevious?id=" + getId + "&status=Next";
            }
        });



    };


    function GetTableComboBox() {

        var tableComboBox = $("#TableId").kendoMultiColumnComboBox({
            dataTextField: "TableNumber",
            dataValueField: "Id",
            height: 400,

            columns: [
                /*{ field: "Id", title: "ID", width: 50 },*/
                { field: "Code", title: "Code", width: 100 },
                { field: "TableNumber", title: "Table Number", width: 150 },
                { field: "Capacity", title: "Capacity", width: 80 }
            ],

            filter: "contains",
            filterFields: ["TableNumber", "Code"],

            dataSource: {
                transport: {
                    read: "/Common/Common/GetTableList" 
                }
            },

            placeholder: "Select Table",

            dataBound: function () {
                if (getTableId && getTableId !== "0") {
                    this.value(getTableId);
                } else {
                    this.value("");
                }
            },

            change: function () {
                $("#TableId").val(this.value());
            }

        }).data("kendoMultiColumnComboBox");
    };

    function GetStatusComboBox() {
        var StatusComboBox = $("#Status").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [
                { field: "Id", title: "ID", width: 50 },
                { field: "Name", title: "Name", width: 150 }
            ],
            filter: "contains",
            filterFields: ["Name"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetStatusList"
                }
            },
            placeholder: "Select Status",
            value: "",
            dataBound: function (e) {
                if (getStatusId && getStatusId !== "0") {
                    this.value(getStatusId);
                } else {
                    this.value("");
                }
            },
            change: function (e) {
                $("#Status").val(this.value());
            }
        }).data("kendoMultiColumnComboBox");
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

        var url = "/DMS/TableReservation/Delete";

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
                    url: "/DMS/TableReservation/GetGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false
                },
                parameterMap: function (options) {

                    if (options.sort) {
                        options.sort.forEach(function (param) {
                            if (param.field === "TableId") {
                                param.field = "H.TableId";
                            }
                            if (param.field === "CustomerName") {
                                param.field = "H.CustomerName";
                            }
                            if (param.field === "PhoneNumber") {
                                param.field = "H.PhoneNumber";
                            }
                            if (param.field === "ReservationTime") {
                                param.field = "H.ReservationTime";
                            }
                         
                            if (param.field === "BranchName") {
                                param.field = "H.BranchName";
                            }

                            if (param.field === "Status") {
                                param.field = "H.Status";
                            }
                            
                        });
                    }

                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (param) {
                            if (param.field === "TableId") {
                                param.field = "H.TableId";
                            }
                            if (param.field === "CustomerName") {
                                param.field = "H.CustomerName";
                            }
                            if (param.field === "PhoneNumber") {
                                param.field = "H.PhoneNumber";
                            }
                            if (param.field === "ReservationTime") {
                                param.field = "H.ReservationTime";
                            }

                            if (param.field === "BranchName") {
                                param.field = "H.BranchName";
                            }

                            if (param.field === "Status") {
                                param.field = "H.Status";
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
                fields: ["Code", "AccountName", "AccountNo", "BankId", "BranchName", "Comments", "IsCash", "Status"]
            },
            excel: {
                fileName: "TableInfo.xlsx",
                filterable: true
            },
            pdf: {
                fileName: `TableInfo_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`,
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


                var fileName = `TableInfo_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`;

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
                    title: "Action",
                    width: 40,
                    template: function (dataItem) {
                        console.log(dataItem);
                        return `
            <a href="/DMS/TableReservation/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit" title="Edit Credit Limit">
                <i class="fas fa-pencil-alt"></i>
            </a>`;
                    }
                },
                {
                    field: "Id", width: 50, hidden: true, sortable: true
                },
                {
                    field: "TableNumber", title: "Table Number", sortable: true, width: 200
                },
                {
                    field: "CustomerName", title: "Customer", width: 150, sortable: true
                },
                ////{
                ////    field: "SectionName", title: "Section Name", width: 150, sortable: true
                ////},
                {
                    field: "BranchName", title: "Branch Name", sortable: true, hidden: true, width: 200
                },
                {
                    field: "StatusName", title: "Status", sortable: true, width: 100
                    
                }
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
            return;
        }

        if (model.IsPost == 'True') {
            ShowNotification(2, "Post operation is already done, Do not update this entry");
            return;
        }

        var url = "/DMS/TableReservation/CreateEdit";


        CommonAjaxService.finalSave(url, model, saveDone, saveFail);
    };



    function saveDone(result) {
        debugger;
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




    function deleteDone(result) {

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

    function fail(err) {


        ShowNotification(3, "Something gone wrong");
    };

    return {
        init: init
    }

}(CommonService, CommonAjaxService);



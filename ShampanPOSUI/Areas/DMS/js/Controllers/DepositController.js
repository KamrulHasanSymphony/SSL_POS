var DepositController = function (CommonService, CommonAjaxService) {

    //var getBankId = 0;
    //var getRouteId = 0;
    //var getAreaId = 0;
    //var getCustomerCategory = 0;
    //var getFocalPoint = 0;


    var init = function () {

        getFromBankAccountId = $("#FromBankAccountId").val() || 0;
        getToBankAccountId = $("#ToBankAccountId").val() || 0;
        //getRouteId = $("#RouteId").val() || 0;
        //getAreaId = $("#AreaId").val() || 0;

        //getCustomerCategory = $("#CustomerCategory").val() || 0;
        //getFocalPoint= $("#FocalPointId").val() || 0;


        GetFromBankAccountComboBox();
        GetToBankAccountComboBox();
        //GetRouteComboBox();
        //GetAreaComboBox();
        //GetFocalPointComboBox();
        //GetCustomerCategoryComboBox();



        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';
        debugger;
        if (parseInt(getId) == 0 && getOperation == '') {
            //GetBranchList();
            GetGridDataList();

        };


        $('.btnsave').click('click', function () {
            debugger;
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

            GetGridDataList();

        });

        $('#btnPrevious').click('click', function () {
            var getId = $('#Id').val();
            if (parseInt(getId) > 0) {
                window.location.href = "/DMS/Deposit/NextPrevious?id=" + getId + "&status=Previous";
            }
        });
        $('#btnNext').click('click', function () {
            var getId = $('#Id').val();
            if (parseInt(getId) > 0) {
                window.location.href = "/DMS/Deposit/NextPrevious?id=" + getId + "&status=Next";
            }
        });



    };

    function GetFromBankAccountComboBox() {
        debugger;
        var BankAccountCombo = $("#FromBankAccountId").kendoMultiColumnComboBox({
            dataTextField: "AccountNo",
            dataValueField: "BankId",
            height: 400,
            columns: [
                { field: "AccountNo", title: "Account No", width: 150 },
                { field: "AccountName", title: "Account Name", width: 150 },
                { field: "BranchName", title: "Branch Name", width: 150 }
            ],
            filter: "contains",
            filterFields: ["Code", "Name"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetBankAccountList"
                }
            },
            placeholder: "Select BankAccount",
            value: "",
            dataBound: function (e) {
                if (getFromBankAccountId) {
                    this.value(parseInt(getFromBankAccountId));
                }
            },
            change: function (e) {
            }
        }).data("kendoMultiColumnComboBox");
    };



    function GetToBankAccountComboBox() {
        debugger;
        var BankAccountCombo = $("#ToBankAccountId").kendoMultiColumnComboBox({
            dataTextField: "AccountNo",
            dataValueField: "BankId",
            height: 400,
            columns: [
                { field: "AccountNo", title: "Account No", width: 150 },
                { field: "AccountName", title: "Account Name", width: 150 },
                { field: "BranchName", title: "Branch Name", width: 150 }
            ],
            filter: "contains",
            filterFields: ["Code", "Name"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetBankAccountList"
                }
            },
            placeholder: "Select BankAccount",
            value: "",
            dataBound: function (e) {
                if (getToBankAccountId) {
                    this.value(parseInt(getToBankAccountId));
                }
            },
            change: function (e) {
            }
        }).data("kendoMultiColumnComboBox");
    };



    function postDone(result) {

        var grid = $('#GridDataListofCustomerCreditLimit').data('kendoGrid');
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

        var url = "/DMS/Deposit/Delete";

        CommonAjaxService.deleteData(url, model, deleteDone, saveFail);
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
                    url: "/DMS/Deposit/GetGridData",
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
                            if (param.field === "Code") {
                                param.field = "M.Code";
                            }
                            if (param.field === "AccountNo") {
                                param.field = "o.AccountNo";  // Correct mapping for AccountNo
                            }
                            if (param.field === "AccountName") {
                                param.field = "p.AccountName";  // Correct mapping for AccountName
                            }
                            if (param.field === "ChequeBankName") {
                                param.field = "M.ChequeBankName";
                            }
                            if (param.field === "TransactionDate" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "M.TransactionDate";
                            }
                            if (param.field === "ChequeDate" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "M.ChequeDate";
                            }
                            if (param.field === "TotalDepositAmount") {
                                param.field = "M.TotalDepositAmount";
                            }
                            if (param.field === "ChequeNo") {
                                param.field = "M.ChequeNo";
                            }
                            if (param.field === "Comments") {
                                param.field = "M.Comments";
                            }
                            if (param.field === "Reference") {
                                param.field = "M.Reference";
                            }
                            if (param.field === "IsCash") {
                                let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";
                                param.value = statusValue.startsWith("a") ? 1 : (statusValue.startsWith("i") ? 0 : null);
                                param.field = "M.IsCash";
                                param.operator = "eq";
                            }
                            if (param.field === "Status") {
                                let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";
                                param.value = statusValue.startsWith("a") ? 1 : (statusValue.startsWith("i") ? 0 : null);
                                param.field = "M.IsActive";
                                param.operator = "eq";
                            }
                        });
                    }
                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (param) {
                            if (param.field === "Code") {
                                param.field = "M.Code";
                            }
                            if (param.field === "AccountNo") {
                                param.field = "o.AccountNo";
                            }
                            if (param.field === "AccountName") {
                                param.field = "p.AccountName";
                            }
                            if (param.field === "ChequeBankName") {
                                param.field = "M.ChequeBankName";
                            }
                            if (param.field === "TransactionDate" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "M.TransactionDate";
                            }
                            if (param.field === "ChequeDate" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "M.ChequeDate";
                            }
                            if (param.field === "TotalDepositAmount") {
                                param.field = "M.TotalDepositAmount";
                            }
                            if (param.field === "ChequeNo") {
                                param.field = "M.ChequeNo";
                            }
                            if (param.field === "Comments") {
                                param.field = "M.Comments";
                            }
                            if (param.field === "Reference") {
                                param.field = "M.Reference";
                            }
                            if (param.field === "IsCash") {
                                let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";
                                param.value = statusValue.startsWith("a") ? 1 : (statusValue.startsWith("i") ? 0 : null);
                                param.field = "M.IsCash";
                                param.operator = "eq";
                            }
                            if (param.field === "Status") {
                                let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";
                                param.value = statusValue.startsWith("a") ? 1 : (statusValue.startsWith("i") ? 0 : null);
                                param.field = "M.IsActive";
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
            search: {
                fields: ["Code", "AccountName", "AccountNo", "ChequeBankName", "TotalDepositAmount"]
            },
            excel: {
                fileName: "Deposits.xlsx",
                filterable: true
            },
            pdf: {
                fileName: `Deposits_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`,
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
                    grid.hideColumn(actionColumnIndex);
                }
                if (selectionColumnIndex == 0 || selectionColumnIndex > 0) {
                    grid.hideColumn(selectionColumnIndex);
                }

                var fileName = `Deposits_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`;

                var numberOfColumns = e.sender.columns.filter(column => !column.hidden && column.field).length;
                var columnWidth = 100;
                var totalWidth = numberOfColumns * columnWidth;

                e.sender.options.pdf = {
                    paperSize: "A2",
                    margin: { top: "4cm", left: "1cm", right: "1cm", bottom: "4cm" },
                    landscape: true,
                    allPages: true,
                    template: `
                    <div style="position: absolute; top: 1cm; left: 1cm; right: 1cm; text-align: center; font-size: 12px; font-weight: bold;">
                        <div>Branch Name :- ${branchName}</div>
                        <div>Company Name :- ${companyName}</div>
                        <div>Company Address :- ${companyAddress}</div>
                    </div>`
                };

                e.sender.options.pdf.fileName = fileName;

                setTimeout(function () {
                    window.location.reload();
                }, 1000);
            },
            columns: [
                { selectable: true, width: 35 },
                {
                    title: "Action",
                    width: 170,
                    template: function (dataItem) {
                        return `
                        <a href="/DMS/Deposit/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit" title="Edit Withdrawal">
                            <i class="fas fa-pencil-alt"></i>
                        </a>`;
                    }
                },
                { field: "Id", width: 50, hidden: true, sortable: true },
                { field: "Code", title: "Code", sortable: true, width: 200 },
                { field: "AccountName", title: "Account Name", sortable: true, width: 200 },
                { field: "AccountNo", title: "Account No.", sortable: true, width: 200 },
                { field: "ChequeBankName", title: "Cheque Bank Name", width: 200, sortable: true },
                { field: "ChequeNo", title: "Cheque No", sortable: true, width: 200 },
                { field: "TotalDepositAmount", title: "Total Deposit Amount", sortable: true, width: 200 },
                { field: "Comments", title: "Comments", sortable: true, width: 200 },
                { field: "Reference", title: "Reference", sortable: true, width: 200 },
                { field: "IsCash", title: "Is Cash", sortable: true, width: 100 },
                {
                    field: "Status", title: "Status", sortable: true, width: 100,
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
                }
            ],
            editable: false,
            selectable: "multiple row",
            navigatable: true,
            columnMenu: true
        });
    };

    function save() {
        debugger;
        var validator = $("#frmEntry").validate();
        var model = serializeInputs("frmEntry");
        model.TotalDepositAmount = model.TotalDepositAmount.replace(',', '').replace(',', '').replace(',', '');
        var result = validator.form();

        if (!result) {
            validator.focusInvalid();
            return;
        }

        if (model.IsPost == 'True') {
            ShowNotification(2, "Post operation is already done, Do not update this entry");
            return;
        }

        var url = "/DMS/Deposit/CreateEdit";


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

    debagger;
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
    form.action = '/DMS/Deposit/ReportPreview';
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

function DevitCredit(branchId, FromDate, ToDate) {

    const form = document.createElement('form');
    form.method = 'post';
    form.action = '/DMS/BankAccount/DevitCredit';
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


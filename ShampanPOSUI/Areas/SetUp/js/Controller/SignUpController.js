var SignUpController = function (CommonAjaxService) {

    var getSalePersonId = 0;

    var init = function () {

        getSalePersonId = $("#SalePersonId").val() || 0;

        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';
        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();
        }
        else {
            GetSalePersonComboBox();
        }
        $('.btnsave').click('click', function (e) {
            debugger;

            e.preventDefault();

            var form = $("#frmEntry");

            var mvcValid = form.valid();

            var customValid = CommonValidationHelper.CheckValidation("#frmEntry");
            debugger;
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

        var url = "/SetUp/UserProfile/Delete";

        CommonAjaxService.deleteData(url, model, deleteDone, saveFail);
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
    function GetSalePersonComboBox() {
        if ($('#IsSalePerson').prop('checked')) {
            $('.salePerson').show();
        }
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
            change: function (e) {

            }
        }).data("kendoMultiColumnComboBox");
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
                    url: "/SetUp/UserProfile/GetGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false
                },
                parameterMap: function (options) {
                    return options;
                }
            },
            batch: true,
            schema: {
                data: "Items",
                total: "TotalCount",
                model: {
                    fields: {

                    }
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
                        gt: "Is greater then",
                        lt: "Is less then"
                    }
                }
            },
            sortable: true,
            resizable: true,
            reorderable: true,
            groupable: true,
            toolbar: ["excel", "pdf"],
            excel: {
                fileName: "UserList.xlsx",
                filterable: true
            },
            columns: [
                {
                    selectable: true, width: 10
                },
                {
                    title: "Action",
                    width: 50,
                    template: function (dataItem) {
                        return "<a href='/SetUp/UserProfile/Edit?id=" + dataItem.Id + "&mode=profileupdate' class='btn btn-primary btn-sm mr-2 edit' title='profile update'>" +
                            "<i class='fas fa-pencil-alt'></i>" +
                            "</a>" +
                            "<a href='/SetUp/UserProfile/Edit?id=" + dataItem.Id + "&mode=passwordchange' class='btn btn-secondary btn-sm mr-2 edit' title='password change'>" +
                            "<i class='fas fa-key'></i>" +
                            "</a>" +
                            "<a href='/SetUp/UserBranchProfile/Index/" + dataItem.Id + " ' class='btn btn-success btn-sm mr-2 edit' title='branch mapping'>" +
                            "<i class='fas fa-building'></i>" +
                            "</a>";
                    }
                },

                {
                    field: "Id", width: 50, hidden: true, sortable: true
                },
                {
                    field: "UserName", title: "User Name", sortable: true, width: 100
                },
                {
                    field: "FullName", title: "Full Name", sortable: true, width: 250
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true,
            columnMenu: true
        });

    };


    function save() {
        debugger;
        var validator = $("#frmEntry").validate();
        if (!validator.form()) {
            validator.focusInvalid();
            return;
        }

        var model = serializeInputs("frmEntry");
        var url = "/SetUp/SignUp/SignUpCreateEdit";

        CommonAjaxService.finalSave(url, model, saveDone, saveFail);
    };


    //function save() {

    //    var validator = $("#frmEntry").validate();
    //    if (!validator.form()) {
    //        validator.focusInvalid();
    //        return;
    //    }

    //    var model = serializeInputs("frmEntry");

    //    // First Save (UserProfile)
    //    var url1 = "/SetUp/SignUp/SignUpCreateEdit";

    //    CommonAjaxService.finalSave(url1, model, function (result) {

    //        if (result.Success === true) {

    //            // Second Save (UserInformation)
    //            var url2 = "/SetUp/SignUp/UserInfoCreateEdit";

    //            CommonAjaxService.finalSave(url2, model, saveDone, saveFail);

    //        } else {
    //            ShowNotification(3, result.Message);
    //        }

    //    }, saveFail);
    //}
    function saveDone(result) {
        debugger;
        console.log(result);
        alert(result.Message, " RR " + result.Success);
        if (result.Status == 200 || result.Success === true) {
            ShowNotification(1, result.Message);

            var id = result.Data?.Id || "";

            setTimeout(function () {
                window.location.href = "/SetUp/CompanyCreate/Create?id=" + id;
            }, 700);
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


    return {
        init: init
    }


}(CommonAjaxService);


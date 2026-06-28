var RegistrationController = function (CommonAjaxService) {

    //var getRoleId = $("#RoleId").val();
    var init = function () {

        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';

        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();
        }

        // Save Button
        $('.btnsave').on('click', function (e) {
            debugger;

            e.preventDefault(); 

            $("#Operation").val("add");

            var form = $("#frmEntry");

            var mvcValid = form.valid();
            var customValid = CommonValidationHelper.CheckValidation("#frmEntry");

            if (!mvcValid || !customValid) {
                return false;
            }

            Confirmation("Are you sure? Do You Want to Save Data?",
                function (result) {
                    if (result) {
                        save();
                    }
                });
        });

        // Update Button
        $('.sslUpdate').on('click', function (e) {
            debugger;

            e.preventDefault();

            $("#Operation").val("update");

            var form = $("#frmEntry");

            var mvcValid = form.valid();
            var customValid = CommonValidationHelper.CheckValidation("#frmEntry");

            if (!mvcValid || !customValid) {
                return false;
            }

            Confirmation("Are you sure? Do You Want to Update Data?",
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

        var url = "/SetUp/Registration/Delete";

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
                    url: "/SetUp/Registration/GetGridData",
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
                        return "<a href='/SetUp/Registration/Edit?id=" + dataItem.Id + "&mode=profileupdate' class='btn btn-primary btn-sm mr-2 edit' title='profile update'>" +
                            "<i class='fas fa-pencil-alt'></i>" +
                            "</a>" +
                            "<a href='/SetUp/Registration/Edit?id=" + dataItem.Id + "&mode=passwordchange' class='btn btn-secondary btn-sm mr-2 edit' title='password change'>" +
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
        model.IsRegistration = true;
        var url = "/SetUp/Registration/RegistrationCreateEdit";

        CommonAjaxService.finalSave(url, model, saveDone, saveFail);
    };



    //function save() {
    //    debugger;
    //    var validator = $("#frmEntry").validate();
    //    if (!validator.form()) {
    //        validator.focusInvalid();
    //        return;
    //    }

    //    var model = serializeInputs("frmEntry");
    //    model.IsRegistration = true;

    //    var url = "/SetUp/UserProfile/CreateEdit";

    //    CommonAjaxService.finalSave(url, model, saveDone, saveFail);
    //}


   


    function saveDone(result) {

        if (result.Status == 200 || result.Success === true) {

            ShowNotification(1, result.Message);

            if (result.Data) {

                $("#Id").val(result.Data.Id);
                $("#Operation").val("update");

                $(".sslSave").show();
                $(".sslUpdate").show();
            }

            var grid = $("#GridDataList").data("kendoGrid");
            if (grid) {
                grid.dataSource.read();
            }
        }
        else if (result.Status == 400) {
            ShowNotification(3, result.Message);
        }
        else {
            ShowNotification(2, result.Message);
        }
    }

    function saveFail(result) {

        ShowNotification(3, "Query Exception!");
    };


    return {
        init: init
    }


}(CommonAjaxService);


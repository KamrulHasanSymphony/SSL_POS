var DayEndController = function (CommonAjaxService) {

    var init = function () {


        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        $("#txtDate").kendoDatePicker({
            format: "yyyy-MM-dd",
            value: yesterday,
            min: new Date(2000, 0, 1),
            max: yesterday
        });

        $("#prcsButton").click('click', function () {
            Confirmation("Are you sure? Do You Want to Process Data?",
                function (result) {

                    if (result) {
                        ProcessData();
                    }
                });

        })

        $('.btnsave').click('click', function () {
            
            var status = "Process";
           
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

    function ProcessData() {
        var date = $("#txtDate").val();
        
        if (date === 0 || date === null) {
            ShowNotification(3, "Please Select Date!");
            return;
        }

        var formattedDate = new Date(date).toISOString().split("T")[0];

        var model = {
            StartDate: date
        };

        var url = "/DMS/DayEnd/ProcessData";

        CommonAjaxService.finalSave(url, model, saveDone, saveFail);

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

        var url = "/DMS/UOM/Delete";

        CommonAjaxService.deleteData(url, model, deleteDone, saveFail);
    };



    function save() {
        var validator = $("#frmEntry").validate();
        var model = serializeInputs("frmEntry");
         
        var result = validator.form();

        if (!result) {
            validator.focusInvalid();
            return;
        }

       

        var url = "/DMS/DayEnd/CreateEdit";

        CommonAjaxService.finalSave(url, model, saveDone, saveFail);
    };

    function saveDone(result) {

        if (result.Status == 200) {
            /*if (result.Data.Operation == "add") {*/
                ShowNotification(1, result.Message);
                //$(".divSave").hide();
                //$(".divUpdate").show();
                //$("#Code").val(result.Data.Code);
                //$("#Id").val(result.Data.Id);
                //$("#Operation").val("update");
                //$("#CreatedBy").val(result.Data.CreatedBy);
                //$("#CreatedOn").val(result.Data.CreatedOn);
            //}
            //else {
            //    ShowNotification(1, result.Message);
            //    $("#LastModifiedBy").val(result.Data.LastModifiedBy);
            //    $("#LastModifiedOn").val(result.Data.LastModifiedOn);
            //}
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

    function fail(err) {

        ShowNotification(3, "Something gone wrong");
    };

    return {
        init: init
    }


}(CommonAjaxService);


function ReportPreview(id) {

    const form = document.createElement('form');
    form.method = 'post';
    form.action = '/DMS/UOM/ReportPreview';
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

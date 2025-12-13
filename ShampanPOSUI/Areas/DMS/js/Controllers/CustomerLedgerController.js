var CustomerLedgerController = function (CommonService, CommonAjaxService) {


    var init = function () {
        GetBranchList();
        
        $("#btnReport").on('click', function () {
            
            var branchId = $("#Branchs").data("kendoComboBox").value();          

            if (branchId == "") {
                ShowNotification(3, "Please Select Branch Name First!");
                return;
            }
            generateReport();

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
    function generateReport() {
        
        var fromDate = $('#FromDate').val();
        var toDate = $('#ToDate').val();
        var branchId = $("#Branchs").data("kendoComboBox").value();       

        var url = "/DMS/Customer/DevitCreditData?fromDate=" + fromDate + "&toDate=" + toDate + "&branchId=" + branchId ;

        window.location.href = url;
    }
    return {
        init: init
    }


}(CommonService, CommonAjaxService);
function DevitCreditData(id) {
    const form = document.createElement('form');
    form.method = 'post';
    form.action = '/DMS/Customer/DevitCreditData';
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
function ReportPreview(id) {
    const form = document.createElement('form');
    form.method = 'post';
    form.action = '/DMS/SaleDelivery/ReportPreview';
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



var PurchaseReportController = function (CommonAjaxService) {

    var init = function () {

        if ($("#IsPosted").length) {
            LoadCombo("IsPosted", '/Common/Common/GetBooleanDropDown');
            $("#IsPosted").val('0');
            GetBranchList();
        };

        $("#btnPurchaseOrder").on("click", function () {
            $(".btnDownLoad").show();
            $("#txt").text("Purchase Order Summary Reports");
            $("#TransactionType").val('PurchaseOrder');
        });

        $("#btnPurchase").on("click", function () {
            $(".btnDownLoad").show();
            $("#txt").text("Purchase Summary Reports");
            $("#TransactionType").val('Purchase');
        });

        $("#btnPurchaseReturn").on("click", function () {
            $(".btnDownLoad").show();
            $("#txt").text("Purchase Return Summary Reports");
            $("#TransactionType").val('PurchaseReturn');
        });

        $(".btnDownLoad").on("click", function () {
            
            var fromDate = $("#FromDate").val();
            var toDate = $("#ToDate").val();
            var branchId = $("#Branchs").data("kendoComboBox").value();
            var isPosted = $('#IsPosted').val();
            var selectedValue = $("input[name='SummaryReportType']:checked").val();
            var transactionType = $("#TransactionType").val();

            console.log("TransactionType:", transactionType);

            if (fromDate === "" || toDate === "") {
                ShowNotification(3, "Please select both 'from date', 'to date'.");
                return;
            }


            var basePath = "/DMS/";
            var reportPath = "";

            if (transactionType === "PurchaseOrder") {
                reportPath = "PurchaseOrder";
            } else if (transactionType === "Purchase") {
                reportPath = "Purchase";
            } else if (transactionType === "PurchaseReturn") {
                reportPath = "PurchaseReturn";
            }

            var url = basePath + reportPath + '/SummaryReport?fromDate=' +
                fromDate +
                '&toDate=' +
                toDate +
                '&branchId=' +
                branchId +
                '&type=' +
                selectedValue +
                '&isPost=' +
                isPosted;

            //var url = '/DMS/PurchaseOrder/SummaryReport?fromDate=' +
            //    fromDate +
            //    '&toDate=' +
            //    toDate +
            //    '&branchId=' +
            //    branchId +
            //    '&type=' +
            //    selectedValue +
            //    '&isPost=' +
            //    isPosted;

            var win = window.open(url, '_blank');
        });

    };


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



    return {
        init: init
    }


}(CommonAjaxService);



var SaleReportController = function (CommonAjaxService) {

    var init = function () {

        if ($("#IsPosted").length) {
            LoadCombo("IsPosted", '/Common/Common/GetBooleanDropDown');
            $("#IsPosted").val('0');
            GetBranchList();
        };

        $("#btnSaleOrder").on("click", function () {
            $(".btnDownLoad").show();
            $("#txt").text("Sale Order Summary Reports");
            $("#TransactionType").val('SaleOrder');
        });

        $("#btnSale").on("click", function () {
            $(".btnDownLoad").show();
            $("#txt").text("Sale Summary Reports");
            $("#TransactionType").val('Sale');
        });

        $("#btnSaleReturn").on("click", function () {
            $(".btnDownLoad").show();
            $("#txt").text("Sale Return Summary Reports");
            $("#TransactionType").val('SaleReturn');
        });
        $("#btnSaleDelivery").on("click", function () {
            $(".btnDownLoad").show();
            $("#txt").text("Sale Delivery Summary Reports");
            $("#TransactionType").val('SaleDelivery');
        });
        $("#btnSaleDeliveryReturn").on("click", function () {
            $(".btnDownLoad").show();
            $("#txt").text("Sale Delivery Return Summary Reports");
            $("#TransactionType").val('SaleDeliveryReturn');
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

            if (transactionType === "Sale") {
                reportPath = "Sale";
            } else if (transactionType === "SaleOrder") {
                reportPath = "SaleOrder";
            } else if (transactionType === "SaleReturn") {
                reportPath = "SaleReturn";
            } else if (transactionType === "SaleDelivery") {
                reportPath = "SaleDelivery";
            } else if (transactionType === "SaleDeliveryReturn") {
                reportPath = "SaleDeliveryReturn";
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



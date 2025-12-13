var MISReportController = function (CommonService, CommonAjaxService) {
    var getCustomerId = 0;
    var getBranchId = 0;
    var init = function () {
        getCustomerId = $("#CustomerId").val() || 0;
        GetCustomerComboBox();
        GetBranchList();

       
    };


 
    function GetCustomerComboBox() {
        var CustomerComboBox = $("#CustomerId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [

                { field: "Code", title: "Code", width: 100 },
                { field: "Name", title: "Name", width: 100 },
                { field: "Address", title: "Address", width: 150 },
                { field: "Email", title: "Email", width: 150 },
                { field: "City", title: "City", width: 150 }

            ],
            filter: "contains",
            filterFields: ["Code", "Name", "Address", "Email", "City"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetCustomerList"
                }
            },
            placeholder: "Select Customer", // Set the placeholder
            value: "",
            dataBound: function (e) {

                if (getCustomerId) {
                    this.value(parseInt(getCustomerId));
                }
            },
            change: function (e) {
                // Get the selected item
                var selectedItem = this.dataItem();

                // If an item is selected, get its address and set it to the DeliveryAddress field
                if (selectedItem) {
                    var address = selectedItem.Address;
                    var regularDiscountRate = selectedItem.RegularDiscountRate;
                    $("#DeliveryAddress").val(address);
                    $("#RegularDiscountRate").val(regularDiscountRate);
                }
            }
        }).data("kendoMultiColumnComboBox");
    }



    return {
        init: init
    };
}(CommonService, CommonAjaxService);




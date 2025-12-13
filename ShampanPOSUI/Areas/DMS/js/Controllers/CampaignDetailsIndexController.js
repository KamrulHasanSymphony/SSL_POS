var CampaignDetailsIndexController = function (CommonService, CommonAjaxService) {

    document.getElementById('campaignDetailsTitle').textContent = enumName;

    if (enumName === 'CampaignByInvoiceValue') {
        document.getElementById('campaignDetailsTitle').textContent = 'Campaign Total Invoice Price Details List';
    } else if (enumName === 'CampaignByProductValue') {
        document.getElementById('campaignDetailsTitle').textContent = 'Campaign Product Unit Rate Details List';
    } else if (enumName === 'CampaignByProductQuantity') {
        document.getElementById('campaignDetailsTitle').textContent = 'Campaign Product Quantity Details List';
    } else if (enumName === 'CampaignByProductTotalValue') {
        document.getElementById('campaignDetailsTitle').textContent = 'Campaign Product Total Price Details List';
    } else {
        document.getElementById('campaignDetailsTitle').textContent = 'Campaign Details Overview';
    }

    var init = function () {


        if ($("#IsPosted").length) {
            LoadCombo("IsPosted", '/Common/Common/GetBooleanDropDown');
            $("#IsPosted").val('');
            GetBranchList();
        };
        var getOperation = $("#Operation").val() || '';

        GetGridDetailsDataList();

        $("#indexSearch").on('click', function () {
            var branchId = $("#Branchs").data("kendoComboBox").value();

            if (branchId == "") {
                ShowNotification(3, "Please Select Branch Name First!");
                return;
            }
            const gridElement = $("#GridDetailsDataList");
            if (gridElement.data("kendoGrid")) {
                gridElement.data("kendoGrid").destroy();
                gridElement.empty();
            }

            GetGridDetailsDataList();

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

    var GetGridDetailsDataList = function () {
         
        // Get values from UI elements
        var branchId = $("#Branchs").data("kendoComboBox").value();
        var FromDate = $('#FromDate').val();
        var ToDate = $('#ToDate').val();
        var IsPosted = $('#IsPosted').val();
        var EnumId = $("#EnumTypeId").val();

        // Get full URL
        const url = new URL(window.location.href);
        const typeValue = url.searchParams.get("Type");

        console.log(typeValue);

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
                    url: "/DMS/Campaign/GetDetailsGridData",
                    type: "POST",
                    dataType: "json",
                    data: function () {
                        return {
                            EnumId: EnumId,
                            branchId: branchId, isPost: IsPosted, fromDate: FromDate, toDate: ToDate, // Send EnumId in the request
                            // Optionally, you can include other filters or parameters here
                        };
                    }

                },
                parameterMap: function (options) {

                    if (options.sort) {
                        options.sort.forEach(function (param) {
                            if (param.field === "Code") {
                                param.field = "H.Code";
                            }
                            
                            if (param.field === "Name") {
                                param.field = "H.Name";
                            }

                            if (param.field === "BranchName") {
                                param.field = "Br.Name";
                            }

                            if (param.field === "CampaignEntryDate" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "CONVERT(VARCHAR(10), H.CampaignEntryDate, 120)";
                            }

                            if (param.field === "Description") {
                                param.field = "H.Description";
                            }
                            if (param.field === "CampaignStartDate" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "CONVERT(VARCHAR(10), H.CampaignStartDate, 120)";
                            }
                            if (param.field === "CampaignEndDate" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "CONVERT(VARCHAR(10), H.CampaignEndDate, 120)";
                            }

                            if (param.field === "CampaignDetailInvoiceValueFromAmount") {
                                param.field = "D.FromAmount";
                            }

                            if (param.field === "CampaignDetailByInvoiceValueToAmount") {
                                param.field = "D.ToAmount";
                            }

                            if (param.field === "CampaignDetailByInvoiceValueDiscountRateBasedOnTotalPrice") {
                                param.field = "D.DiscountRateBasedOnTotalPrice";
                            }

                            if (param.field === "CampaignDetailByProductTotalValueFromAmount") {
                                param.field = "DP.FromAmount";
                            }

                            if (param.field === "CampaignDetailByProductTotalValueToAmount") {
                                param.field = "DP.ToAmount";
                            }

                            if (param.field === "CampaignDetailByProductTotalValueDiscountRateBasedOnTotalPrice") {
                                param.field = "DP.DiscountRateBasedOnTotalPrice";
                            }

                            if (param.field === "CampaignDetailByProductValueFromQuantity") {
                                param.field = "DPV.FromQuantity";
                            }

                            if (param.field === "CampaignDetailByProductValueToQuantity") {
                                param.field = "DPV.ToQuantity";
                            }

                            if (param.field === "CampaignDetailByQuantitieFromQuantity") {
                                param.field = "DQ.FromQuantity";
                            }

                            if (param.field === "CampaignDetailByQuantitieFreeQuantity") {
                                param.field = "DQ.FreeQuantity";
                            }

                            if (param.field === "Status") {
                                let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";

                                if (statusValue.startsWith("A")) {
                                    param.value = 1;
                                } else if (statusValue.startsWith("n")) {
                                    param.value = 0;
                                }
                                else if (statusValue == "1") {
                                    param.value = 1;
                                }
                                else if (statusValue == "0") {
                                    param.value = 0;
                                }
                                else {
                                    param.value = null;
                                }

                                param.field = "H.IsActive";
                                param.operator = "eq";
                            }

                        });
                    }
                    
                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (param) {
                            if (param.field === "Code") {
                                param.field = "H.Code";
                            }
                            
                            if (param.field === "Name") {
                                param.field = "H.Name";
                            }

                            if (param.field === "BranchName") {
                                param.field = "Br.Name";
                            }

                            if (param.field === "CampaignEntryDate" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "CONVERT(VARCHAR(10), H.CampaignEntryDate, 120)";
                            }

                            if (param.field === "Description") {
                                param.field = "H.Description";
                            }
                            if (param.field === "CampaignStartDate" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "CONVERT(VARCHAR(10), H.CampaignStartDate, 120)";
                            }
                            if (param.field === "CampaignEndDate" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "CONVERT(VARCHAR(10), H.CampaignEndDate, 120)";
                            }

                            if (param.field === "CampaignDetailInvoiceValueFromAmount") {
                                param.field = "D.FromAmount";
                            }
                            if (param.field === "InvoiceValueFromAmount") {
                                param.field = "D.FromAmount";
                            }
                            if (param.field === "CampaignDetailByInvoiceValueToAmount") {
                                param.field = "D.ToAmount";
                            }
                            if (param.field === "InvoiceValueToAmount") {
                                param.field = "D.ToAmount";
                            }
                            if (param.field === "CampaignDetailByInvoiceValueDiscountRateBasedOnTotalPrice") {
                                param.field = "D.DiscountRateBasedOnTotalPrice";
                            }
                            if (param.field === "InvoiceValueDiscountRateBasedOnTotalPrice") {
                                param.field = "D.DiscountRateBasedOnTotalPrice";
                            }

                            if (param.field === "CampaignDetailByProductTotalValueFromAmount") {
                                param.field = "DP.FromAmount";
                            }
                            if (param.field === "ProductTotalValueFromAmount") {
                                param.field = "DP.FromAmount";
                            }

                            if (param.field === "CampaignDetailByProductTotalValueToAmount") {
                                param.field = "DP.ToAmount";
                            }
                            if (param.field === "ProductTotalValueToAmount") {
                                param.field = "DP.ToAmount";
                            }

                            if (param.field === "CampaignDetailByProductTotalValueDiscountRateBasedOnTotalPrice") {
                                param.field = "DP.DiscountRateBasedOnTotalPrice";
                            }
                            if (param.field === "ProductTotalValueDiscountRateBasedOnTotalPrice") {
                                param.field = "DP.DiscountRateBasedOnTotalPrice";
                            }

                            if (param.field === "CampaignDetailByProductValueFromQuantity") {
                                param.field = "DPV.FromQuantity";
                            }
                            if (param.field === "ProductValueFromQuantity") {
                                param.field = "DPV.FromQuantity";
                            }

                            if (param.field === "CampaignDetailByProductValueToQuantity") {
                                param.field = "DPV.ToQuantity";
                            }
                            if (param.field === "ProductValueToQuantity") {
                                param.field = "DPV.ToQuantity";
                            }

                            if (param.field === "CampaignDetailByQuantitieFromQuantity") {
                                param.field = "DQ.FromQuantity";
                            }
                            if (param.field === "DetailByQuantitieFromQuantity") {
                                param.field = "DQ.FromQuantity";
                            }

                            if (param.field === "CampaignDetailByQuantitieFreeQuantity") {
                                param.field = "DQ.FreeQuantity";
                            }
                            if (param.field === "DetailByQuantitieFreeQuantity") {
                                param.field = "DQ.FreeQuantity";
                            }


                            if (param.field === "Status") {
                                let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";

                                if (statusValue.startsWith("A")) {
                                    param.value = 1;
                                } else if (statusValue.startsWith("n")) {
                                    param.value = 0;
                                } else {
                                    param.value = null;
                                }

                                param.field = "H.IsActive";
                                param.operator = "eq";
                            }



                        });
                    }

                    return options;
                }
            },
            batch: true,
            schema: {
                data: "Items",
                total: "TotalCount",
                model: {
                    fields: {
                        id: { type: "number" },
                        FromAmount: { type: "Number" },
                        ToAmount: { type: "Number" },
                        CampaignEntryDate: { type: "date" },
                        CampaignStartDate: { type: "date" },
                        CampaignDetailByInvoiceValueId: { type: "Number" },
                        CampaignDetailByInvoiceValueFromAmount: { type: "Number" },
                        CampaignDetailByInvoiceValueToAmount: { type: "Number" },
                        CampaignDetailByInvoiceValueDiscountRateBasedOnTotalPrice: { type: "Number" },
                        CampaignDetailByProductTotalValueId: { type: "number" },
                        CampaignDetailByProductTotalValueFromAmount: { type: "number" },
                        CampaignDetailByProductTotalValueToAmount: { type: "number" },
                        CampaignDetailByProductTotalValueDiscountRateBasedOnTotalPrice: { type: "number" },
                        CampaignDetailByProductValueId: { type: "number" },
                        CampaignDetailByProductValueFromQuantity: { type: "number" },
                        CampaignDetailByProductValueToQuantity: { type: "number" },
                        CampaignDetailByQuantitieId: { type: "number" },
                        CampaignDetailByQuantitieFromQuantity: { type: "number" },
                        CampaignDetailByQuantitieFreeQuantity: { type: "Number" },


                    }
                }
            },
      
                aggregate: [
                    { field: "quantity", aggregate: "sum" },
                    { field: "FromAmount", aggregate: "sum" },
                    { field: "ToAmount", aggregate: "sum" },
                    { field: "InvoiceValueFromAmount", aggregate: "sum" },
                    { field: "InvoiceValueToAmount", aggregate: "sum" },
                    { field: "InvoiceValueDiscountRateBasedOnTotalPrice", aggregate: "sum" },
                    { field: "ProductTotalValueFromAmount", aggregate: "sum" },
                    { field: "ProductTotalValueToAmount", aggregate: "sum" },
                    { field: "ProductTotalValueDiscountRateBasedOnTotalPrice", aggregate: "sum" },
                    { field: "ProductValueFromQuantity", aggregate: "sum" },
                    { field: "ProductValueToQuantity", aggregate: "sum" },
                    { field: "DetailByQuantitieFreeQuantity", aggregate: "sum" },
                    { field: "DetailByQuantitieFreeQuantity", aggregate: "sum" }

                ]
        });




        let gridColumns = [
            { field: "Code", title: "Code", width: 190, sortable: true },
            { field: "BranchName", title: "Branch Name", width: 180, sortable: true },
            { field: "Name", title: "Name", sortable: true, width: 200 },
            { field: "Description", title: "Description", sortable: true, width: 200 },
            { field: "CampaignStartDate", title: "Campaign Start Date", sortable: true, width: 200 },
            { field: "CampaignEndDate", title: "Campaign End Date", sortable: true, width: 200 },
            { field: "CampaignEntryDate", title: "Campaign Entry Date", sortable: true, width: 200 },

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
           

            //{
            //    field: "Status", title: "Status", sortable: true, width: 100,
            //    filterable: {
            //        ui: function (element) {
            //            element.kendoDropDownList({
            //                dataSource: [
            //                    { text: "Posted", value: "1" },
            //                    { text: "Not-posted", value: "0" }
            //                ],
            //                dataTextField: "text",
            //                dataValueField: "value",
            //                optionLabel: "Select Option"
            //            });
            //        }
            //    }
            //}




        ];

        let SearchColumn = ["Code", "Name", "Description", "BranchName", "Status", "CampaignEntryDate", "CampaignStartDate", "CampaignEndDate" ]



        if (typeValue == "CampaignByInvoiceValue") {
            gridColumns.push(
                {
                    field: "InvoiceValueFromAmount",
                    title: " From Amount",
                    sortable: true,
                    width: 200,
                    aggregates: ["sum"],
                    format: "{0:n2}",
                    footerTemplate: "#=kendo.toString(sum, 'n2')#",
                    groupFooterTemplate: "#=kendo.toString(sum, 'n2')#",
                    attributes: { style: "text-align: right;" }
                },
                {
                    field: "InvoiceValueToAmount",
                    title: "To Amount",
                    sortable: true,
                    width: 200,
                    aggregates: ["sum"],
                    format: "{0:n2}",
                    footerTemplate: "#=kendo.toString(sum, 'n2')#",
                    groupFooterTemplate: "#=kendo.toString(sum, 'n2')#",
                    attributes: { style: "text-align: right;" }
                },

                {
                    field: "InvoiceValueDiscountRateBasedOnTotalPrice",
                    title: "Discount Rate Based On Total Price",
                    sortable: true,
                    width: 180,
                    aggregates: ["sum"],
                    format: "{0:n2}",
                    footerTemplate: "#=kendo.toString(sum, 'n2')#",
                    groupFooterTemplate: "#=kendo.toString(sum, 'n2')#",
                    attributes: { style: "text-align: right;" }
                }
            );
            SearchColumn.push("CampaignDetailInvoiceValueFromAmount", "CampaignDetailByInvoiceValueToAmount", "CampaignDetailByInvoiceValueDiscountRateBasedOnTotalPrice");

        }
        else if (typeValue == "CampaignByProductTotalValue") {
            gridColumns.push(


                {
                    field: "ProductTotalValueFromAmount",
                    title: " Product Total Value From Amount",
                    sortable: true,
                    width: 200,
                    aggregates: ["sum"],
                    format: "{0:n2}",
                    footerTemplate: "#=kendo.toString(sum, 'n2')#",
                    groupFooterTemplate: "#=kendo.toString(sum, 'n2')#",
                    attributes: { style: "text-align: right;" }
                },

                {
                    field: "ProductTotalValueToAmount",
                    title: " Product Total Value To Amount",
                    sortable: true,
                    width: 200,
                    aggregates: ["sum"],
                    format: "{0:n2}",
                    footerTemplate: "#=kendo.toString(sum, 'n2')#",
                    groupFooterTemplate: "#=kendo.toString(sum, 'n2')#",
                    attributes: { style: "text-align: right;" }
                },

                {
                    field: "ProductTotalValueDiscountRateBasedOnTotalPrice",
                    title: "Product Total Value Discount Rate Based On Total Price",
                    sortable: true,
                    width: 180,
                    aggregates: ["sum"],
                    format: "{0:n2}",
                    footerTemplate: "#=kendo.toString(sum, 'n2')#",
                    groupFooterTemplate: "#=kendo.toString(sum, 'n2')#",
                    attributes: { style: "text-align: right;" }
                }
            );
            SearchColumn.push("CampaignDetailByProductTotalValueFromAmount", "CampaignDetailByProductTotalValueToAmount", "CampaignDetailByProductTotalValueDiscountRateBasedOnTotalPrice");

        }
        else if (typeValue == "CampaignByProductQuantity") {
            gridColumns.push(



                {
                    field: "DetailByQuantitieFromQuantity",
                    title: "From Quantity",
                    sortable: true,
                    width: 200,
                    aggregates: ["sum"],
                    format: "{0:n2}",
                    footerTemplate: "#=kendo.toString(sum, 'n2')#",
                    groupFooterTemplate: "#=kendo.toString(sum, 'n2')#",
                    attributes: { style: "text-align: right;" }
                },

                {
                    field: "DetailByQuantitieFreeQuantity",
                    title: " Free Quantity",
                    sortable: true,
                    width: 200,
                    aggregates: ["sum"],
                    format: "{0:n2}",
                    footerTemplate: "#=kendo.toString(sum, 'n2')#",
                    groupFooterTemplate: "#=kendo.toString(sum, 'n2')#",
                    attributes: { style: "text-align: right;" }
                }
            );
            SearchColumn.push("CampaignDetailByQuantitieFromQuantity", "CampaignDetailByQuantitieFreeQuantity");
        }

        else if (typeValue == "CampaignByProductValue") {
            gridColumns.push(

                {
                    field: "ProductValueFromQuantity",
                    title: " Product Value From Quantity",
                    sortable: true,
                    width: 200,
                    aggregates: ["sum"],
                    format: "{0:n2}",
                    footerTemplate: "#=kendo.toString(sum, 'n2')#",
                    groupFooterTemplate: "#=kendo.toString(sum, 'n2')#",
                    attributes: { style: "text-align: right;" }
                },

                {
                    field: "ProductValueToQuantity",
                    title: " Product Value To Quantity",
                    sortable: true,
                    width: 200,
                    aggregates: ["sum"],
                    format: "{0:n2}",
                    footerTemplate: "#=kendo.toString(sum, 'n2')#",
                    groupFooterTemplate: "#=kendo.toString(sum, 'n2')#",
                    attributes: { style: "text-align: right;" }
                }
            );
            SearchColumn.push("CampaignDetailByProductValueFromQuantity", "CampaignDetailByProductValueToQuantity");
        }


       

        
        // Initialize Kendo Grid
        $("#GridDetailsDataList").kendoGrid({
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
                        neq: "Is not equal to"
                    }
                }
            },
            sortable: true,
            resizable: true,
            reorderable: true,
            groupable: true,
            toolbar: ["excel", "pdf", "search"],
            search: {
                fields: SearchColumn
            },
            excel: {
                fileName: `SaleOrder_Details_${new Date().toISOString().split('T')[0]}.xlsx`,
                filterable: true
            },
            //pdf: {
            //    fileName: `SaleOrder_Details_${new Date().toISOString().split('T')[0]}.pdf`,
            //    allPages: true,
            //    avoidLinks: true
            //},
            pdf: {
                fileName: `Campaign_details_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`,
                allPages: true,
                avoidLink: true,
                filterable: true
            },
            pdfExport: function (e) {

                $(".k-grid-toolbar").hide();
                $(".k-grouping-header").hide();
                $(".k-floatwrap").hide();



                const dataItems = this.dataSource.view();
                const firstItem = dataItems.length > 0 ? dataItems[0] : {};

                branchName = firstItem.BranchName || "All Branch Name";

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


                var fileName = `Campaign_details_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`;

                var numberOfColumns = e.sender.columns.filter(column => !column.hidden && column.field).length;
                var columnWidth = 100;
                var totalWidth = numberOfColumns * columnWidth;

                e.sender.options.pdf = {
                    paperSize: [totalWidth, 2800],
                    margin: { top: "4cm", left: "1cm", right: "1cm", bottom: "4cm" },
                    landscape: true,
                    allPages: true,
                    template: `
                            <div style="position: absolute; top: 1cm; left: 1cm; right: 1cm; text-align: center; font-size: 12px; font-weight: bold;">
                                <div>Branch Name :- ${branchName}</div>
                            </div> `
                };

                e.sender.options.pdf.fileName = fileName;

                setTimeout(function () {
                    window.location.reload();
                }, 1000);
            },


            columns: gridColumns,
            editable: false,
            selectable: "row",
            navigatable: true,
            columnMenu: true
        });

        $("#GridDetailsDataList").on("click", ".k-header .k-checkbox", function () {
            var isChecked = $(this).is(":checked");
            var grid = $("#GridDetailsDataList").data("kendoGrid");
            if (isChecked) {
                grid.tbody.find(".k-checkbox").prop("checked", true);
            } else {
                grid.tbody.find(".k-checkbox").prop("checked", false);
            }
        });
    };


    return {
        init: init
    }


}(CommonService, CommonAjaxService);




var ProductPriceGroupController = function (CommonAjaxService) {

    var init = function () {

        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';

        GetGridDataList();

        var $table = $('#productPriceGroupDetails');

        $('.btnsave').click('click', function () {

            var getId = $('#Id').val();
            var status = "Save";
            if (parseInt(getId) > 0) {
                status = "Update";
            }
            Confirmation("Are you sure? Do You Want to " + status + " Data?",
                function (result) {
                    if (result) {
                        save($table);
                    }
                });
        });


        $('.NewButton ').on('click', function () {
            $("#dtHeader").show();
        })


        $("#btnPGD").on('click', function () {
         
            $('#productPriceGroupDetails').show();

            // Correcting the URL construction to ensure proper formatting
            let url = '/DMS/ProductPriceGroup/ProductPriceGroupSet';

         
            $('#productPriceGroupDetails').html('');

            $.get(url, function (data) {

             
                $('#productPriceGroupDetails').append(data);

            }).fail(function (xhr, status, error) {
                $('#productPriceGroupDetails').html('<div class="error-message">Failed to load data. Please try again later.</div>');
            });

        });


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
                    url: "/DMS/ProductPriceGroup/GetProductPriceGroupGrid",
                    type: "POST",
                    dataType: "json",
                    cache: false
                },
                parameterMap: function (options) {
                    if (options.sort) {

                        options.sort.forEach(function (param) {
                            if (param.field === "YearStart" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "H.YearStart";
                            }
                            if (param.field === "YearEnd" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "H.YearEnd";
                            }
                        });
                    }

                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (filter) {

                            if (filter.field === "YearStart" && filter.value) {
                                filter.value = kendo.toString(new Date(filter.value), "yyyy-MM-dd");
                                filter.field = "CONVERT(VARCHAR(10), H.YearStart, 120)";
                            }
                            if (filter.field === "YearEnd" && filter.value) {
                                filter.value = kendo.toString(new Date(filter.value), "yyyy-MM-dd");
                                filter.field = "CONVERT(VARCHAR(10), H.YearEnd, 120)";
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
                        YearStart: { type: "date" },
                        YearEnd: { type: "date" },
                    }
                }
            }
        });

        $("#ProductPriceGroupGrid").kendoGrid({
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
            toolbar: ["excel", "pdf", "search"],
            search: {
                fields: ["Year", "YearStart", "YearEnd"]
            },
            excel: {
                fileName: "FiscalYear.xlsx",
                filterable: true
            },

            columns: [
                {
                    selectable: true, width: 30
                },
                {
                    title: "Action",
                    width: 60,
                    template: function (dataItem) {
                        return `
                            <a href="/DMS/ProductPriceGroup/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit" title="Edit Product Price Group">
                                <i class="fas fa-pencil-alt"></i>
                            </a>`;
                    }
                },

                { field: "Id", width: 150, hidden: true, sortable: true },
                { field: "Name", title: "Name", sortable: true, width: 200 },

                {
                    field: "EffectDate", title: "Effect Date", sortable: true, width: 150, template: '#= kendo.toString(kendo.parseDate(EffectDate), "yyyy-MM-dd") #',
                    filterable: {
                        ui: "datepicker"
                    }
                }

            ],

            editable: false,
            selectable: "multiple row",
            navigatable: true,
            columnMenu: true
        });

       
        $("#ProductPriceGroupGrid").on("click", ".k-header .k-checkbox", function () {
            var isChecked = $(this).is(":checked");
            var grid = $("#ProductPriceGroupGrid").data("kendoGrid");
            if (isChecked) {
                grid.tbody.find(".k-checkbox").prop("checked", true);
            } else {
                grid.tbody.find(".k-checkbox").prop("checked", false);
            }
        });
    };
  
    function save() {
     


        var validator = $("#frmEntry").validate();
        var productPriceGroup = serializeInputs("frmEntry");

        if (productPriceGroup.Name === "") {
            ShowNotification(3, "Please Select Name First");
            return;
        }

        var result = validator.form();

        if (!result) {
            validator.focusInvalid();
            return;
        }

        var productPriceGroupDetails = [];
        var operation = $("#Operation").val();

        if (operation == 'add') {
            $('#productPriceGroupDetails .card-body').each(function () {
                var row = $(this);

                var detail = {

                    Id: row.find('input[name$=".Id"]').val(),
                    ProductId: row.find('input[name$=".ProductId"]').val(),
                    Code: row.find('input[name$=".Code"]').val(),
                    Name: row.find('input[name$=".Name"]').val(),
                    BanglaName: row.find('input[name$=".BanglaName"]').val(),
                    CosePrice: row.find('input[name$=".CosePrice"]').val(),
                    SalePrice: row.find('input[name$=".SalePrice"]').val(),
                    VATRate: row.find('input[name$=".VATRate"]').val()
                };

                productPriceGroupDetails.push(detail);
            });
        }

        else {

            $("#dtHeader").hide();

            //$('.fiscalYearRow').each(function () {
            $('.productPriceGroupDRows').each(function () {
                var row = $(this);

                var detail = {

                    Id: row.find('input[name$=".Id"]').val(),
                    ProductId: row.find('input[name$=".ProductId"]').val(),
                    Code: row.find('input[name$=".Code"]').val(),
                    Name: row.find('input[name$=".Name"]').val(),
                    BanglaName: row.find('input[name$=".BanglaName"]').val(),
                    CosePrice: row.find('input[name$=".CosePrice"]').val(),
                    SalePrice: row.find('input[name$=".SalePrice"]').val(),
                    VATRate: row.find('input[name$=".VATRate"]').val()

                };

                productPriceGroupDetails.push(detail);

            });

        }


        if (productPriceGroupDetails.length === 0) {
            ShowNotification(3, "Please add product price group detail");
            return;
        }

        productPriceGroup.productPriceGroupDetails = productPriceGroupDetails;

        var url = "/DMS/ProductPriceGroup/CreateEdit"
        CommonAjaxService.finalSave(url, productPriceGroup, saveDone, saveFail);

    };

    function saveDone(result) {

     
        if (result.Status == "200") {
            if (result.Data.Operation == "add") {
                ShowNotification(1, result.Message);
                $(".btnsave").html('Update');
                $(".btnsave").addClass('sslUpdate');
                $("#Id").val(result.Data.Id);
                $("#Operation").val("update");
                $("#CreatedBy").val(result.Data.CreatedBy);
                $("#CreatedOn").val(result.Data.CreatedOn);

                var details = result.Data.ProductPriceGroupDetails; 
                $('#productPriceGroupDetails .card-body').each(function (index) {
                    var row = $(this);
                    if (details && details.length > index) {
                        var detail = details[index];
                        row.find('input[name$=".Id"]').val(detail.Id);                    
                    }
                });

            } else {
                ShowNotification(1, result.Message);
                $("#LastModifiedBy").val(result.Data.LastModifiedBy);
                $("#LastModifiedOn").val(result.Data.LastModifiedOn);
            }
        }
        else if (result.Status == "400") {
            ShowNotification(3, result.Message);
        }
        else if (result.Status == "199") {
            ShowNotification(2, result.Message);
        }
    }

    function saveFail(result) {

        ShowNotification(3, "Query Exception!");
    }

    return {
        init: init
    }

}(CommonAjaxService);
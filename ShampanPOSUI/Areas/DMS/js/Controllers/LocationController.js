var LocationController = function (CommonService, CommonAjaxService) {
    var getEnumTypeId = 0;
    var getParentId = 0;
    var init = function () {
        getEnumTypeId = $("#EnumTypeId").val() || 0;
        getParentId = $("#ParentId").val() || 0;
        getEnumType = $("#EnumType").val() || '';
        getParentName = $("#Name").val() || '';

        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';

        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();
        };


        GetLocationComboBox();
        GetParentComboBox();

        $('.btnsave').click('click', function () {
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

        $('#btnPrevious').click('click', function () {
            var getId = $('#Id').val();
            if (parseInt(getId) > 0) {
                window.location.href = "/DMS/Location/NextPrevious?id=" + getId + "&status=Previous";
            }
        });
        $('#btnNext').click('click', function () {
            var getId = $('#Id').val();
            if (parseInt(getId) > 0) {
                window.location.href = "/DMS/Location/NextPrevious?id=" + getId + "&status=Next";
            }
        });


    };
    function GetLocationComboBox() {
        var LocationComboBox = $("#EnumTypeId").kendoMultiColumnComboBox({
            //dataTextField: "EnumName",
            dataTextField: "Name",
            //dataValueField: "EnumTypeId",
            dataValueField: "Id",
            height: 400,
            columns: [

                //{ field: "EnumName", title: "Enum Name", width: 150 },
                { field: "Name", title: "Enum Name", width: 150 },
            ],
            filter: "contains",
            //filterFields: ["EnumName"],
            filterFields: ["Name"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetEnumTypeList"
                }
            },
            placeholder: "Select Enum Type ",
            value: "",
            dataBound: function (e) {

                if (getEnumType) {
                    //var selectedDataItem = this.dataSource.data().find(item => item.EnumName === getEnumType);
                    var selectedDataItem = this.dataSource.data().find(item => item.Name === getEnumType);
                    if (selectedDataItem) {
                        //this.value(selectedDataItem.EnumName); 
                        this.value(selectedDataItem.Name);
                    }
                }
            },
            change: function (e) {
                var selectedDataItem = this.dataItem(this.select());
                if (selectedDataItem) {
                    var selectedEnumName = selectedDataItem.Name == "Country" ? "" :
                        selectedDataItem.Name == "Division" ? "Country" :
                            selectedDataItem.Name == "District" ? "Division" :
                                selectedDataItem.Name == "Thana" ? "District" : "";

                    GetUpdateGetParentComboBox(selectedEnumName);
                    $("#EnumType").val(selectedEnumName);
                    console.log("Selected EnumName: " + selectedEnumName);
                }
            }
        }).data("kendoMultiColumnComboBox");
    };

    function GetParentComboBox() {
        var ParentComboBox = $("#ParentId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [


                { field: "Name", title: "Name", width: 150 },
                { field: "EnumType", title: "Enum Type", width: 150 },

            ],
            filter: "contains",
            filterFields: ["Code", "Name"],
            dataSource: {
                transport: {
                    read: "/Location/GetParentList"
                },
                schema: {
                    parse: function (response) {

                        return response.filter(item => item.Name !== getParentName);
                    }
                }
            },
            placeholder: "Select Parent ", // Set the placeholder
            value: "",
            dataBound: function (e) {

                if (getParentId) {
                    this.value(parseInt(getParentId));
                }
            },
            change: function (e) {

            }
        }).data("kendoMultiColumnComboBox");
    };







    function GetUpdateGetParentComboBox(EnumType) {
        var ParentComboBox = $("#ParentId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [

                { field: "Name", title: "Name", width: 150 },
                { field: "EnumType", title: "Location Type", width: 150 },
            ],
            filter: "contains",
            filterFields: ["Code", "Name"],
            dataSource: {
                transport: {
                    read: {
                        url: "/Common/Common/GetAreaLocationListByEnumType",
                        data: {
                            EnumType: EnumType
                        },
                        dataType: "json"
                    }
                }
            },
            placeholder: "Select Parent",
            value: "",
            dataBound: function (e) {

                if (getParentId) {
                    this.value(parseInt(getParentId));
                }

                //var dataItems = this.dataSource.view();
                //console.log("Data Items:", dataItems);
                //var thanaId = Number(getThanaId) || 0;
                //this.value("");
                //var selectedItem = dataItems.find(item => item.Id === thanaId);
                //if (selectedItem) {
                //    this.value(thanaId);
                //}
            },
            change: function (e) {
                var selectedItem = this.dataItem(this.select());
                //if (selectedItem) {
                //    localStorage.setItem("selectedThanaId", selectedItem.Id);
                //}
            }
        }).data("kendoMultiColumnComboBox");
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

        var url = "/DMS/Location/Delete";

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
                    url: "/DMS/Location/GetGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false
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
                            if (param.field === "ParentId") {
                                param.field = "H.ParentId";
                            }
                            if (param.field === "EnumType") {
                                param.field = "H.EnumType";
                            }

                            if (param.field === "Status") {
                                param.field = "H.IsActive";
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

                            if (param.field === "ParentId") {
                                param.field = "H.ParentId";
                            }

                            if (param.field === "EnumType") {
                                param.field = "H.EnumType";
                            }
                            if (param.field === "Status") {
                                param.field = "H.IsActive";
                            }
                        });
                    }
                    return options;
                }
            },
            batch: true,
            schema: {
                data: "Items",
                total: "TotalCount"
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
                fields: ["Code", "Name", "ParentId", "EnumType"]
            },
            excel: {
                fileName: "Locations.xlsx",
                filterable: true
            },

            pdf: {
                fileName: `Locations_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`,
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


                var fileName = `Locations_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`;

                var numberOfColumns = e.sender.columns.filter(column => !column.hidden && column.field).length;
                var columnWidth = 100;
                var totalWidth = numberOfColumns * columnWidth;

                e.sender.options.pdf = {
                    //paperSize: [totalWidth, 2800],
                    paperSize: "A2",
                    margin: { top: "4cm", left: "1cm", right: "1cm", bottom: "4cm" },
                    landscape: true,
                    allPages: true,
                    template: `
                            <div style="position: absolute; top: 1cm; left: 1cm; right: 1cm; text-align: center; font-size: 12px; font-weight: bold;">
                                <div>Branch Name :- ${branchName}</div>
                                <div>Company Name :- ${companyName}</div>
                                <div>Company Address :- ${companyAddress}</div>
                            </div> `
                };

                e.sender.options.pdf.fileName = fileName;

                setTimeout(function () {
                    window.location.reload();
                }, 1000);
            },
            columns: [
                {
                    selectable: true, width: 50
                },
                {
                    title: "Action",
                    width: 90,
                    template: function (dataItem) {

                        return `
                                <a href="/DMS/Location/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                                    <i class="fas fa-pencil-alt"></i>
                                </a>
                                  <a style='background-color: darkgreen;' href='#' onclick='ReportPreview(${dataItem.Id})' class='btn btn-success btn-sm mr-2 edit' title='Report Preview'>
                                    <i class='fas fa-print'></i>
                                </a>
                                `;
                    }
                },
                { field: "Id", width: 50, hidden: true, sortable: true },
                { field: "Code", title: "Code", width: 150, sortable: true },
                { field: "Name", title: "Name", sortable: true, width: 200 },
                { field: "EnumType", title: "EnumType", hidden: true, sortable: true, width: 200 },


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
        var isDropdownValid1 = CommonService.validateDropdown("#ParentId", "#titleError1", "Paremt is required");
        var isDropdownValid2 = CommonService.validateDropdown("#EnumTypeId", "#titleError2", "Enum Type is required");
        var isDropdownValid = isDropdownValid1 && isDropdownValid2;
        var validator = $("#frmEntry").validate();
        var model = serializeInputs("frmEntry");

        var result = validator.form();

        if (!result || !isDropdownValid) {
            if (!result) {
                validator.focusInvalid();
            }
            return;
        }

        if ($('#IsActive').prop('checked')) {
            model.IsActive = true;
        }

        var url = "/DMS/Location/CreateEdit";

        CommonAjaxService.finalSave(url, model, saveDone, saveFail);
    };

    function saveDone(result) {

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

    function saveFail(result) {

        ShowNotification(3, "Query Exception!");
    };

    function fail(err) {

        ShowNotification(3, "Something gone wrong");
    };

    return {
        init: init
    }


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
    form.action = '/DMS/Location/ReportPreview';
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

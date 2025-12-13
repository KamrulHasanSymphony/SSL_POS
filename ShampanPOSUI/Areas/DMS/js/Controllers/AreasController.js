var AreasController = function (CommonService, CommonAjaxService) {
    var getEnumTypeId = 0;
    var getParentId = 0;
    var getCountryId = 0;
    var getDivisionId = 0;
    var getDistrictId = 0;
    var getThanaId = 0;
    var operation = "";
    var getAreaName = "";
    var countryName = "";
    var init = function () {
        operation = $("#Operation").val();
        getEnumTypeId = $("#EnumTypeId").val() || 0;
        getParentId = $("#ParentId").val() || 0;
        getCountryId = $("#CountryId").val() || 0;
        getDivisionId = $("#DivisionId").val() || 0;
        getDistrictId = $("#DistrictId").val() || 0;
        getThanaId = $("#ThanaId").val() || 0;
        
        getAreaName = $("#Name").val() || 0;

        GetGridDataList();
        //GetParentComboBox();
        GetEnumTypeComboBox();
       
        GetCountryComboBox();
        if (operation == "add") {
            GetDivisionComboBox();
            GetDistrictComboBox();
            GetThanaComboBox();
           GetParentComboBox();
        }
        else if (operation == "update") {
            GetUpdateDivisionComboBox("Division", $("#CountryId").val());
            GetUpdateDistrictComboBox("District", $("#DivisionId").val());
            GetUpdateThanaComboBox("Thana", $("#DistrictId").val());
            GetUpdateParentComboBox(getAreaName);
        }

        $("#btnAdd").on("click", function () {
            rowAdd(detailTable);
        });

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
                window.location.href = "/DMS/Areas/NextPrevious?id=" + getId + "&status=Previous";
            }
        });
        $('#btnNext').click('click', function () {
            var getId = $('#Id').val();
            if (parseInt(getId) > 0) {
                window.location.href = "/DMS/Areas/NextPrevious?id=" + getId + "&status=Next";
            }
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
                    url: "/DMS/Areas/GetAreasGrid",
                    type: "POST",
                    dataType: "json",
                    cache: false
                },
                parameterMap: function (options) {
                    if (options.sort) {

                        options.sort.forEach(function (param) {

                            if (param.field === "Id") {
                                param.field = "H.Id";
                            }
                            if (param.field === "Code") {
                                param.field = "H.Code";
                            }
                            if (param.field === "Name") {
                                param.field = "H.Name";
                            }
                            if (param.field === "ZipCode") {
                                param.field = "H.ZipCode";
                            }
                           
                            if (param.field === "BanglaName") {
                                param.field = "H.BanglaName";
                            }
                            if (param.field === "CountryName") {
                                param.field = "L.Name";
                            }
                            if (param.field === "EnumTypeName") {
                                param.field = "e.Name";
                            }
                            if (param.field === "DivisionName") {
                                param.field = "Ld.name";
                            }
                            if (param.field === "DistrictName") {
                                param.field = "Li.name";
                            }
                            if (param.field === "ThanaName") {
                                param.field = "Lt.Name";
                            }
                            if (param.field === "Status") {

                                let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";

                                if (statusValue.startsWith("a")) {
                                    param.value = 1;
                                } else if (statusValue.startsWith("i")) {
                                    param.value = 0;
                                } else {
                                    param.value = null;
                                }

                                param.field = "H.IsActive";
                                param.operator = "eq";
                            }
                        });
                    }

                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (param) {

                            if (param.field === "Id") {
                                param.field = "H.Id";
                            }
                            if (param.field === "Code") {
                                param.field = "H.Code";
                            }
                            if (param.field === "Name") {
                                param.field = "H.Name";
                            }
                            if (param.field === "ZipCode") {
                                param.field = "H.ZipCode";
                            }
                           
                            if (param.field === "BanglaName") {
                                param.field = "H.BanglaName";
                            }
                            if (param.field === "CountryName") {
                                param.field = "L.Name";
                            }
                            if (param.field === "EnumTypeName") {
                                param.field = "e.Name";
                            }
                            if (param.field === "DivisionName") {
                                param.field = "Ld.name";
                            }
                            if (param.field === "DistrictName") {
                                param.field = "Li.name";
                            }
                            if (param.field === "ThanaName") {
                                param.field = "Lt.Name";
                            }
                            if (param.field === "Status") {

                                let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";

                                if (statusValue.startsWith("a")) {
                                    param.value = 1;
                                } else if (statusValue.startsWith("i")) {
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

        $("#AreasGrid").kendoGrid({
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
            excel: {
                fileName: "Areas.xlsx",
                filterable: true
            },
            search: {
                fields: ["Code", "Name", "ZipCode", "Status", "BanglaName", "CountryName", "EnumTypeName", "DivisionName", "DistrictName","ThanaName"]
            },
            columns: [
                {
                    selectable: true, width: 50
                },
                {
                    title: "Action",
                    width: 100,
                    template: function (dataItem) {
                        return `
                            <a href="/DMS/Areas/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit" title="Edit Areas">
                                <i class="fas fa-pencil-alt"></i>
                            </a>
                             <a style='background-color: darkgreen;' href='#' onclick='ReportPreview(${dataItem.Id})' class='btn btn-success btn-sm mr-2 edit' title='Report Preview'>
                        <i class='fas fa-print'></i> </a>`;
                    }
                },
                {
                    field: "Id", width: 150, hidden: true, sortable: true
                },
                {
                    field: "EnumTypeId", width: 150, hidden: true, sortable: true
                },
                {
                    field: "ParentId", width: 150, hidden: true, sortable: true
                },
                {
                    field: "CountryId", width: 150, hidden: true, sortable: true
                },
                {
                    field: "DivisionId", width: 150, hidden: true, sortable: true
                },
                {
                    field: "DistrictId", width: 150, hidden: true, sortable: true
                },
                {
                    field: "ThanaId", width: 150, hidden: true, sortable: true
                },
                {
                    field: "Code", width: 140, title: "Code", sortable: true
                },
                {
                    field: "Name", width: 150, title: "Name", sortable: true
                },
                {
                    field: "BanglaName", width: 150, title: "Bangla Name", sortable: true
                },
                {
                    field: "ParentName", title: "Parent", hidden: true, width: 150, sortable: true
                },
                {
                    field: "EnumTypeName", title: "Enum Type", width: 130, sortable: true
                },
                {
                    field: "CountryName", title: "Country", width: 140, sortable: true
                },
                {
                    field: "DivisionName", title: "Division", width: 140, sortable: true
                },
                {
                    field: "DistrictName", title: "District", width: 140, sortable: true
                },
                {
                    field: "ThanaName", title: "Thana", width: 150, sortable: true
                },
                {
                    field: "ZipCode", title: "Zip Code", hidden: true, sortable: true
                },
                {
                    field: "Status", title: "Status", sortable: true,
                    filterable: {
                        ui: function (element) {
                            element.kendoDropDownList({
                                dataSource: [
                                    { text: "Active", value: "1" },
                                    { text: "Inactive", value: "0" }
                                ],
                                dataTextField: "text",
                                dataValueField: "value",
                                optionLabel: "Select Status"
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
                //                    { text: "Active", value: "1" },
                //                    { text: "Not-active", value: "0" }
                //                ],
                //                dataTextField: "text",
                //                dataValueField: "value",
                //                optionLabel: "Select Option"
                //            });
                //        }
                //    }
                //}
            ],

            editable: false,
            selectable: "multiple row",
            navigatable: true,
            columnMenu: true
        });

        //Grid Select all checkbox
        $("#AreasGrid").on("click", ".k-header .k-checkbox", function () {
            var isChecked = $(this).is(":checked");
            var grid = $("#AreasGrid").data("kendoGrid");
            if (isChecked) {
                grid.tbody.find(".k-checkbox").prop("checked", true);
            } else {
                grid.tbody.find(".k-checkbox").prop("checked", false);
            }
        });
    };




    $('body').on('click', '.btnDelete-Areas', function (e) {

        var data = $(this).attr('id');
        var id = data.split('~')[0];
        var url = "/Areas/DeleteItem?id=" + id + "";

        Confirmation("Are you sure? Do You Want to Delete Data?",
            function (result) {

                if (result) {

                    $.ajax({
                        type: 'POST',
                        url: url,
                        success: function (response) {

                            if (response.status == "200") {
                                ShowNotification(1, response.message);
                            }
                            else {
                                ShowNotification(3, response.message);
                            }
                            if (response.status == "200") {
                                setTimeout(function () {
                                    window.location.reload();
                                }, 1000);
                            }
                        },
                        error: function (error) {

                            ShowNotification(3, response.message);
                        }
                    });
                }
            });
    });
    function GetEnumTypeComboBox() {
        var EnumTypeComboBox = $("#EnumTypeId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [
                { field: "Name", title: "Name", width: 150 },

            ],
            filter: "contains",
            filterFields: ["Name"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetAreaEnumTypeList?value=AreaType"
                }
            },
            placeholder: "Select Type ",
            value: "",
            dataBound: function (e) {

                if (getEnumTypeId) {
                    this.value(parseInt(getEnumTypeId));
                }
            },
            change: function (e) {

            }
        }).data("kendoMultiColumnComboBox");

    }
    function GetParentComboBox() {
        var parentComboBox = $("#ParentId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [

                { field: "Name", title: "Name", width: 150 },
                { field: "Code", title: "Code", width: 150 }
            ],
            filter: "contains",
            filterFields: ["Code", "Name"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetParentAreaList"
                }
            },
            placeholder: "Select Parent",
            value: "",
            dataBound: function (e) {

                if (getParentId) {
                    this.value(parseInt(getParentId));
                }
            },
            change: function (e) {

            },
        }).data("kendoMultiColumnComboBox");
    }
    function GetUpdateParentComboBox(getAreaName) {
        
        var parentComboBox = $("#ParentId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [

                { field: "Name", title: "Name", width: 150 },
                { field: "Code", title: "Code", width: 150 }
            ],
            filter: "contains",
            filterFields: ["Code", "Name"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetParentAreaList"
                },
                schema: {
                    parse: function (response) {
                        
                        return response.filter(item => item.Name !== getAreaName);
                    }
                }
            },
            placeholder: "Select Parent",
            value: "",
            dataBound: function (e) {

                if (getParentId) {
                    this.value(parseInt(getParentId));
                }
            },
            change: function (e) {

            },
        }).data("kendoMultiColumnComboBox");
    }
    function GetCountryComboBox() {
        var countryComboBox = $("#CountryId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [

                { field: "Name", title: "Name", width: 150 },

            ],
            filter: "contains",
            filterFields: ["Code", "Name"],
            dataSource: {
                transport: {
                    //read: "/Common/Common/GetAreaLocationList?value=Country"
                    read: {
                        url: "/Common/Common/GetAreaLocationList",
                        data: {
                            EnumType: "Country"
                        },
                        dataType: "json"
                    }
                }
            },
            placeholder: "Select Country",
            value: "",
            dataBound: function (e) {
                if (getCountryId) {
                    this.value(parseInt(getCountryId));
                }
            },
            change: function (e) {
                var selectedItem = this.dataItem(this.select());
                countryName = selectedItem.Name;
                if (selectedItem) {
                    GetUpdateDivisionComboBox("Division", selectedItem.Id);
                }
            }
        }).data("kendoMultiColumnComboBox");
    }

    function GetDivisionComboBox() {
        var divisionComboBox = $("#DivisionId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [

                { field: "Name", title: "Division", width: 150 },

            ],
            filter: "contains",
            filterFields: ["Code", "Name"],
            dataSource: {
                transport: {

                    read: {
                        url: "/Common/Common/GetAreaLocationList",
                        data: {
                            EnumType: "Division"
                        },
                        dataType: "json"
                    }
                }
            },
            placeholder: "Select Division",
            value: "",
            dataBound: function (e) {

                if (getDivisionId) {
                    

                    this.value(parseInt(getDivisionId));
                }
            },
            change: function (e) {

            },
        }).data("kendoMultiColumnComboBox");
    }

    function GetDistrictComboBox() {
        var divisionComboBox = $("#DistrictId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [

                { field: "Name", title: "Name", width: 150 },

            ],
            filter: "contains",
            filterFields: ["Code", "Name"],
            dataSource: {
                transport: {

                    read: {
                        url: "/Common/Common/GetAreaLocationList",
                        data: {
                            EnumType: "District"
                        },
                        dataType: "json"
                    }
                }
            },
            placeholder: "Select District",
            value: "",
            dataBound: function (e) {

                if (getDistrictId) {

                    this.value(parseInt(getDistrictId));
                }
            },
            change: function (e) {

            },
        }).data("kendoMultiColumnComboBox");
    }

    function GetThanaComboBox() {
        var divisionComboBox = $("#ThanaId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [

                { field: "Name", title: "Name", width: 150 },

            ],
            filter: "contains",
            filterFields: ["Code", "Name"],
            dataSource: {
                transport: {

                    read: {
                        url: "/Common/Common/GetAreaLocationList",
                        data: {
                            EnumType: "Thana"
                        },
                        dataType: "json"
                    }
                }
            },
            placeholder: "Select Thana",
            value: "",
            dataBound: function (e) {

                if (getThanaId) {

                    this.value(parseInt(getThanaId));
                }
            },
            change: function (e) {

            },
        }).data("kendoMultiColumnComboBox");
    }






    function GetUpdateDivisionComboBox(EnumType, ParentId) {
        var CountryId = $("#CountryId").val()
        console.log(countryName)
        
        var divisionComboBox = $("#DivisionId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [

                { field: "CountryName", title: "Country Name", width: 150 },
                { field: "Name", title: "Division Name", width: 150 },

            ],
            filter: "contains",
            filterFields: ["Code", "Name"],
            dataSource: {

                transport: {

                    read: {
                        url: "/Common/Common/GetAreaLocationList",
                        data: {
                            EnumType: EnumType,
                            ParentId: ParentId
                        },
                        dataType: "json",
                        success: function (res) {
                            console.log("Success response:", res);
                            if (Array.isArray(res)) {
                                res.forEach(function (item) {
                                    console.log("Item:", item); // Log each item to verify
                                });
                            } else {
                                console.error("Response is not an array:", res);
                            }
                        }

                    }
                }
            },
            placeholder: "Select Division",
            value: "",
            dataBound: function (e) {
                

                var dataItems = this.dataSource.view();
                console.log("Data Items:", dataItems);
                var divisionId = Number(getDivisionId) || 0;
                this.value("");
                var selectedItem = dataItems.find(item => item.Id === divisionId);
                if (selectedItem) {
                    this.value(divisionId);
                }


                //if (getDivisionId) {

                //    this.value(parseInt(getDivisionId));
                //}
            },
            change: function (e) {
                
                var selectedItem = this.dataItem(this.select());

                if (!selectedItem) {
                    var id = getStoredSelectedId("selectedDivisionId");
                    GetUpdateDistrictComboBox("District", id);

                }

                if (selectedItem) {

                    localStorage.setItem("selectedDivisionId", selectedItem.Id);

                    GetUpdateDistrictComboBox("District", selectedItem.Id);
                }
            },
        }).data("kendoMultiColumnComboBox");
    }



    function GetUpdateDistrictComboBox(EnumType, ParentId) {
        var districtComboBox = $("#DistrictId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [

                { field: "CountryName", title: "Country Name", width: 150 },
                { field: "DivisionName", title: "Division Name", width: 150 },
                { field: "Name", title: "Name", width: 150 },

            ],
            filter: "contains",
            filterFields: ["Code", "Name"],
            dataSource: {

                transport: {
                    read: {
                        url: "/Common/Common/GetAreaLocationList",
                        data: {
                            EnumType: EnumType,
                            ParentId: ParentId
                        },
                        dataType: "json"
                    }
                }

            },
            placeholder: "Select District",
            value: "",

            dataBound: function (e) {
                var dataItems = this.dataSource.view();
                var districtId = Number(getDistrictId) || 0;
                this.value("");
                var selectedItem = dataItems.find(item => item.Id === districtId);
                if (selectedItem) {
                    this.value(districtId);
                }
            },

            //dataBound: function (e) {

            //    //Add
            //    
            //    var dataItems = this.dataSource.view();
            //    console.log(dataItems)
            //    var found = false; 
            //    if (getDistrictId) {
            //        var districtId = parseInt(getDistrictId);
            //        for (var i = 0; i < dataItems.length; i++) {
            //            if (dataItems[i].Id === districtId) {
            //                found = true;
            //                break;
            //            }
            //        }
            //        if (found) {
            //            this.value(districtId); 
            //        } else {
            //            this.text("Select"); 
            //            this.value(""); 
            //        }
            //    } else {
            //        this.text("Select");
            //        this.value("");
            //    }
            //    //End

            //    //if (getDistrictId) {
            //    //    this.value(parseInt(getDistrictId));
            //    //}
            //},
            change: function (e) {
                
                var selectedItem = this.dataItem(this.select());
                if (selectedItem) {
                    localStorage.setItem("selectedDistrictId", selectedItem.Id);
                    GetUpdateThanaComboBox("Thana", selectedItem.Id);
                }
            }
        }).data("kendoMultiColumnComboBox");
    }
    function GetUpdateThanaComboBox(EnumType, ParentId) {
        var thanaComboBox = $("#ThanaId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [

                { field: "CountryName", title: "Country Name", width: 150 },
                { field: "DivisionName", title: "Division Name", width: 150 },
                { field: "DistrictName", title: "District Name", width: 150 },
                { field: "Name", title: "Name", width: 150 },

            ],
            filter: "contains",
            filterFields: ["Code", "Name"],
            dataSource: {
                transport: {
                    read: {
                        url: "/Common/Common/GetAreaLocationList",
                        data: {
                            EnumType: EnumType,
                            ParentId: ParentId
                        },
                        dataType: "json"
                    }
                }
            },
            placeholder: "Select Thana",
            value: "",
            dataBound: function (e) {

                var dataItems = this.dataSource.view();
                console.log("Data Items:", dataItems);
                var thanaId = Number(getThanaId) || 0;
                this.value("");
                var selectedItem = dataItems.find(item => item.Id === thanaId);
                if (selectedItem) {
                    this.value(thanaId);
                }

                //if (getThanaId) {
                //    this.value(parseInt(getThanaId));
                //}
            },
            change: function (e) {
                var selectedItem = this.dataItem(this.select());
                if (selectedItem) {
                    localStorage.setItem("selectedThanaId", selectedItem.Id);
                }
            }
        }).data("kendoMultiColumnComboBox");
    }
    function SelectData() {

        var IDs = [];

        var selectedRows = $("#AreasGrid").data("kendoGrid").select();

        if (selectedRows.length === 0) {
            ShowNotification(3, "You are requested to Select checkbox!");
            return;
        }

        selectedRows.each(function () {
            var dataItem = $("#AreasGrid").data("kendoGrid").dataItem(this);
            IDs.push(dataItem.Id);
        });

        var model = {
            IDs: IDs
        };

        var url = "/DMS/Areas/Delete";

        CommonAjaxService.deleteData(url, model, deleteDone, saveFail);
    };


    function getStoredSelectedId(selectedId) {
        return localStorage.getItem(selectedId);
    }
    function save() {
        

     /*   var isDropdownValid1 = CommonService.validateDropdown("#ParentId", "#titleError1", "Parent is required");*/
        var isDropdownValid2 = CommonService.validateDropdown("#EnumTypeId", "#titleError2", "Enum Type is required");
        var isDropdownValid3 = CommonService.validateDropdown("#CountryId", "#titleError3", "Country is required");
        var isDropdownValid4 = CommonService.validateDropdown("#DivisionId", "#titleError4", "Division is required");
        var isDropdownValid5 = CommonService.validateDropdown("#DistrictId", "#titleError5", "District is required");
        var isDropdownValid6 = CommonService.validateDropdown("#ThanaId", "#titleError6", "Thana is required");

        var isDropdownValid = isDropdownValid2 && isDropdownValid3 && isDropdownValid4 && isDropdownValid5 && isDropdownValid6;

        var status = $('#IsActive').is(':checked');
        var validator = $("#Areas_Form").validate();
        var area = serializeInputs("Areas_Form");
        area.IsActive = status;


        //Add
        var DivisionId = getStoredSelectedId("selectedDivisionId");
        var DistrictId = getStoredSelectedId("selectedDistrictId");
        var ThanaId = getStoredSelectedId("selectedThanaId");
        area.DivisionId = DivisionId;
        area.DistrictId = DistrictId;
        area.ThanaId = ThanaId;
        //End

        var result = validator.form();

        if (!result || !isDropdownValid) {
            if (!result) {
                validator.focusInvalid();
            }
            return;
        }
        var url = "/DMS/Areas/CreateEdit"

        CommonAjaxService.finalSave(url, area, saveDone, saveFail);
    }
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


    function saveFail(result) {
        ShowNotification(3, result.message);
    }
    function deleteDone(result) {

        var grid = $('#AreasGrid').data('kendoGrid');
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
    form.action = '/DMS/Areas/ReportPreview';
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
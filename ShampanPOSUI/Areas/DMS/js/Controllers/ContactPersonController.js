var ContactPersonController = function (CommonService, CommonAjaxService) {

    var getCountryId = 0;
    var getDivisionId = 0;
    var getDistrictId = 0;
    var getThanaId = 0;
    var operation = "";
    var init = function () {
        operation = $("#Operation").val();
        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';
        getCountryId = $("#CountryId").val() || 0;
        getDivisionId = $("#DivisionId").val() || 0;
        getDistrictId = $("#DistrictId").val() || 0;
        getThanaId = $("#ThanaId").val() || 0;

        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();
        };      

        GetContactPersonComboBox();
        GetUOMComboBox(); 
        GetCountryComboBox();
        if (operation == "add") {
            GetDivisionComboBox();
            GetDistrictComboBox();
            GetThanaComboBox();
        }
        else if (operation == "update") {
            GetUpdateDivisionComboBox("Division", $("#CountryId").val());
            GetUpdateDistrictComboBox("District", $("#DivisionId").val());
            GetUpdateThanaComboBox("Thana", $("#DistrictId").val());
        }


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
                window.location.href = "/DMS/ContactPerson/NextPrevious?id=" + getId + "&status=Previous";
            }
        });
        $('#btnNext').click('click', function () {
            var getId = $('#Id').val();
            if (parseInt(getId) > 0) {
                window.location.href = "/DMS/ContactPerson/NextPrevious?id=" + getId + "&status=Next";
            }
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

        var url = "/DMS/ContactPerson/Delete";

        CommonAjaxService.deleteData(url, model, deleteDone, saveFail);
    };

    function GetContactPersonComboBox() {
        var ContactPersonComboBox = $("#ContactPersonId").kendoMultiColumnComboBox({
            dataTextField: "Code",
            dataValueField: "Id",
            height: 400,
            columns: [
                { field: "Code", title: "Code", width: 100 },
                { field: "Name", title: "Name", width: 150 },
                { field: "Description", title: "Description", width: 200 },
            ],
            filter: "contains",
            filterFields: ["Code", "Name", "Description"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetContactPersonList"
                }
            },
            change: function (e) {
                
            }
        }).data("kendoMultiColumnComboBox");
    };

    //function GetUOMComboBox() {
    //    var UOMComboBox = $("#UOMId").kendoMultiColumnComboBox({
    //        dataTextField: "Code",
    //        dataValueField: "Id",
    //        height: 400,
    //        columns: [
    //            { field: "Code", title: "Code", width: 100 },
    //            { field: "Name", title: "Name", width: 150 },
    //        ],
    //        filter: "contains",
    //        filterFields: ["Code", "Name"],
    //        dataSource: {
    //            transport: {
    //                read: "/Common/Common/GetUOMList"
    //            }
    //        },
    //        change: function (e) {
                
    //        }
    //    }).data("kendoMultiColumnComboBox");
    //};

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
                    url: "/DMS/ContactPerson/GetGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false
                },
                parameterMap: function (options) {
                    
                    if (options.sort) {
                        options.sort.forEach(function (param) {
                            if (param.field === "Code") {
                                param.field = "M.Code";
                            }
                            if (param.field === "Name") {
                                param.field = "M.Name";
                            }
                            if (param.field === "Designation") {
                                param.field = "M.Designation";
                            }
                            if (param.field === "Mobile") {
                                param.field = "M.Mobile";
                            }
                            if (param.field === "Mobile2") {
                                param.field = "M.Mobile2";
                            }
                            if (param.field === "Phone") {
                                param.field = "M.Phone";
                            }
                            if (param.field === "Phone2") {
                                param.field = "M.Phone2";
                            }
                            if (param.field === "EmailAddress") {
                                param.field = "M.EmailAddress";
                            }
                            if (param.field === "EmailAddress2") {
                                param.field = "M.EmailAddress2";
                            }
                            if (param.field === "Fax") {
                                param.field = "M.Fax";
                            }
                            if (param.field === "Address") {
                                param.field = "M.Address";
                            }
                            if (param.field === "CountryName") {
                                param.field = "LC.Name";
                            }
                            if (param.field === "DivisionName") {
                                param.field = "LD.Name";
                            }
                            if (param.field === "DistrictName") {
                                param.field = "LDI.Name";
                            }
                            if (param.field === "ThanaName") {
                                param.field = "LT.Name";
                            }
                            if (param.field === "ZipCode") {
                                param.field = "M.ZipCode";
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

                                param.field = "M.IsActive";
                                param.operator = "eq";
                            }
                         
                            
                        });
                    }

                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (param) {
                            
                            if (param.field === "Code") {
                                param.field = "M.Code";
                            }
                            if (param.field === "Name") {
                                param.field = "M.Name";
                            }
                            if (param.field === "Designation") {
                                param.field = "M.Designation";
                            }
                            if (param.field === "Mobile") {
                                param.field = "M.Mobile";
                            }
                            if (param.field === "Mobile2") {
                                param.field = "M.Mobile2";
                            }
                            if (param.field === "Phone") {
                                param.field = "M.Phone";
                            }
                            if (param.field === "Phone2") {
                                param.field = "M.Phone2";
                            }
                            if (param.field === "EmailAddress") {
                                param.field = "M.EmailAddress";
                            }
                            if (param.field === "EmailAddress2") {
                                param.field = "M.EmailAddress2";
                            }
                            if (param.field === "Fax") {
                                param.field = "M.Fax";
                            }
                            if (param.field === "Address") {
                                param.field = "M.Address";
                            }
                            if (param.field === "CountryName") {
                                param.field = "LC.Name";
                            }
                            if (param.field === "DivisionName") {
                                param.field = "LD.Name";
                            }
                            if (param.field === "DistrictName") {
                                param.field = "LDI.Name";
                            }
                            if (param.field === "ThanaName") {
                                param.field = "LT.Name";
                            }
                            if (param.field === "ZipCode") {
                                param.field = "M.ZipCode";
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

                                param.field = "M.IsActive";
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
                fields: ["Code", "Name", "Designation", "Mobile", "Phone", "EmailAddress", "Fax", "Address", "CountryName", "DivisionName", "DistrictName", "ThanaName", "ZipCode","Status"]
            },
            excel: {
                fileName: "ContactPersons.xlsx",
                filterable: true
            },
            pdf: {
                fileName: `ContactPersons_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`,
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


                var fileName = `ContactPersons_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`;

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
                    width: 100,
                    template: function (dataItem) {
                        return `
                                <a href="/DMS/ContactPerson/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                                    <i class="fas fa-pencil-alt"></i>
                                </a>
                                 <a style='background-color: darkgreen;' href='#' onclick='ReportPreview(${dataItem.Id})' class='btn btn-success btn-sm mr-2 edit' title='Report Preview'>
                        <i class='fas fa-print'></i>
            </a>`;
                    }
                },
                { field: "Id", width: 50, hidden: true, sortable: true },
                { field: "Code", title: "Code", width: 150, hidden: true, sortable: true },
                { field: "Name", title: "Name", sortable: true, width: 150 },
                { field: "Designation", title: "Designation", width: 150, hidden: true, sortable: true },
                { field: "Mobile", title: "Mobile", width: 100, sortable: true },
                { field: "Mobile2", title: "Alternate Mobile No.", width: 200, hidden: true, sortable: true },
                { field: "Phone", title: "Phone", width: 100, sortable: true },
                { field: "Phone2", title: "Alternate Phone No.", width: 200, hidden: true, sortable: true },
                { field: "EmailAddress", title: "Email Address", width: 200, sortable: true },
                { field: "EmailAddress2", title: "Alternate Email Address", width: 250, hidden: true, sortable: true },
                { field: "Fax", title: "Fax", width: 150, sortable: true },
                { field: "Address", title: "Address", width: 200, sortable: true },
                { field: "CountryName", title: "Country", width: 150, sortable: true },
                { field: "DivisionName", title: "Division", width: 150, sortable: true },
                { field: "DistrictName", title: "District", width: 150, sortable: true },
                { field: "ThanaName", title: "Thana", width: 150, sortable: true },
                { field: "ZipCode", title: "ZipCode", width: 150, sortable: true },

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
                            EnumType: "Country",
                            ParentId: "2"
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

                { field: "Name", title: "Name", width: 150 },

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







    //function GetDivisionComboBox() {
    //    var divisionComboBox = $("#DivisionId").kendoMultiColumnComboBox({
    //        dataTextField: "Name",
    //        dataValueField: "Id",
    //        height: 400,
    //        columns: [

    //            { field: "Name", title: "Name", width: 150 },

    //        ],
    //        filter: "contains",
    //        filterFields: ["Code", "Name"],
    //        dataSource: {
    //            transport: {
    //                read: "/Common/Common/GetAreaLocationList?value=Division"
    //            }
    //        },
    //        placeholder: "Select Division",
    //        value: "",
    //        dataBound: function (e) {

    //            if (getDivisionId) {
    //                this.value(parseInt(getDivisionId));
    //            }
    //        },
    //        change: function (e) {

    //        },
    //    }).data("kendoMultiColumnComboBox");
    //}
    //function GetDistrictComboBox() {
    //    var districtComboBox = $("#DistrictId").kendoMultiColumnComboBox({
    //        dataTextField: "Name",
    //        dataValueField: "Id",
    //        height: 400,
    //        columns: [

    //            { field: "Name", title: "Name", width: 150 },

    //        ],
    //        filter: "contains",
    //        filterFields: ["Code", "Name"],
    //        dataSource: {
    //            transport: {
    //                read: "/Common/Common/GetAreaLocationList?value=District"
    //            }
    //        },
    //        placeholder: "Select District",
    //        value: "",
    //        dataBound: function (e) {
                
    //            if (getDistrictId) {
    //                this.value(parseInt(getDistrictId));
    //            }
    //        },
    //        change: function (e) {
                
    //        }
    //    }).data("kendoMultiColumnComboBox");
    //}
    //function GetThanaComboBox() {
    //    var thanaComboBox = $("#ThanaId").kendoMultiColumnComboBox({
    //        dataTextField: "Name",
    //        dataValueField: "Id",
    //        height: 400,
    //        columns: [

    //            { field: "Name", title: "Name", width: 150 },

    //        ],
    //        filter: "contains",
    //        filterFields: ["Code", "Name"],
    //        dataSource: {
    //            transport: {
    //                read: "/Common/Common/GetAreaLocationList?value=Thana"
    //            }
    //        },
    //        placeholder: "Select Thana",
    //        value: "",
    //        dataBound: function (e) {
                
    //            if (getThanaId) {
    //                this.value(parseInt(getThanaId));
    //            }
    //        },
    //        change: function (e) {
                
    //        }
    //    }).data("kendoMultiColumnComboBox");
    //}
    function GetUpdateDivisionComboBox(EnumType, ParentId) {
        var divisionComboBox = $("#DivisionId").kendoMultiColumnComboBox({
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
                            EnumType: EnumType,
                            ParentId: ParentId
                        },
                        dataType: "json"
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


    function save() {
        var isDropdownValid1 = CommonService.validateDropdown("#CountryId", "#titleError1", "Country is required");
        var isDropdownValid2 = CommonService.validateDropdown("#DivisionId", "#titleError2", "Division Type is required");
        var isDropdownValid3 = CommonService.validateDropdown("#DistrictId", "#titleError3", "District is required");
        var isDropdownValid4 = CommonService.validateDropdown("#ThanaId", "#titleError4", "Thana is required");

        var isDropdownValid = isDropdownValid1 && isDropdownValid2 && isDropdownValid3 && isDropdownValid4;
     
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

        var url = "/DMS/ContactPerson/CreateEdit";

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

    function saveFail(result) {
        
        ShowNotification(3, "Query Exception!");
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
    form.action = '/DMS/ContactPerson/ReportPreview';
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


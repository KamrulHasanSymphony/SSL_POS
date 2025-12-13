var UOMConversationController = function (CommonAjaxService) {
    var getFromId = 0;
    var getToId = 0;
    var init = function () {
        getFromId = $("#FromId").val() || 0;
        getToId = $("#ToId").val() || 0;
       
        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';
        getUOMId = $("UOMId").val() || 0;

        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();
        };    

        var isIndex = $("#IsIndex").val().toLowerCase() === "true";
       
        if (!isIndex) {
           // UOMFromComboBox();
            UOMToComboBox();
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
    };

    function UOMFromComboBox() {
        var UOMGroupComboBox = $("#FromId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [
                { field: "Name", title: "Name", width: 100 },
                { field: "Code", title: "Code", width: 150 },

            ],
            filter: "contains",
            filterFields: ["Code", "Name"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetUOMList"
                }
            },
            placeholder: "Select From Id ", // Set the placeholder
            value: "",
            dataBound: function (e) {
               
                if (getFromId) {
                    this.value(parseInt(getFromId));
                }
            }
        }).data("kendoMultiColumnComboBox");
    };

    function UOMToComboBox() {
        var UOMGroupComboBox = $("#ToId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [
                { field: "Name", title: "Name", width: 100 },
                { field: "Code", title: "Code", width: 150 },

            ],
            filter: "contains",
            filterFields: ["Code", "Name"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetUOMList"
                }
            },
            placeholder: "Select To Id ", // Set the placeholder
            value: "",
            dataBound: function (e) {
               
                if (getToId) {
                    this.value(parseInt(getToId));
                }
            }
            
        }).data("kendoMultiColumnComboBox");
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

        var url = "/DMS/UOMConversation/Delete";

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
                    url: "/DMS/UOMConversation/GetGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false,
                    data: { getFromId: getFromId }
                },
                parameterMap: function (options) {
                   
                    if (options.sort) {
                        options.sort.forEach(function (param) {
                           
                            if (param.field === "ConversationFactor") {
                                param.field = "H.ConversationFactor";
                            }
                            if (param.field === "Status") {
                                param.field = "H.IsActive";
                            }
                        });
                    }

                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (param) {

                            if (param.field === "ConversationFactor") {
                                param.field = "H.ConversationFactor";
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
            search: ["ConversationFactor"],
            excel: {
                fileName: "SalesPersons.xlsx",
                filterable: true
            },
            pdf: {
                fileName: `UOMConversations_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`,
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

                var actionColumnIndex = grid.columns.findIndex(col => col.title === "Action");
                var selectionColumnIndex = grid.columns.findIndex(col => col.selectable === true);

                if (actionColumnIndex >= 0) {
                    grid.hideColumn(actionColumnIndex);
                }
                if (selectionColumnIndex >= 0) {
                    grid.hideColumn(selectionColumnIndex);
                }

                var fileName = `UOMConversations_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`;

                e.sender.options.pdf = {
                    paperSize: "A2",
                    margin: { top: "4cm", left: "1cm", right: "1cm", bottom: "4cm" },
                    landscape: true,
                    allPages: true,
                    template: `
                        <div style="position: absolute; top: 1cm; left: 1cm; right: 1cm; text-align: center; font-size: 12px; font-weight: bold;">
                            <div>Branch Name :- ${branchName}</div>
                            <div>Company Name :- ${companyName}</div>
                            <div>Company Address :- ${companyAddress}</div>
                        </div>`
                };

                e.sender.options.pdf.fileName = fileName;

                setTimeout(function () {
                    window.location.reload();
                }, 1000);
            },
            columns: [
                {
                    selectable: true, width: 20
                },
                {
                    title: "Action",
                    width: 50,
                    template: function (dataItem) {
                       
                        return `
                            <a href="/DMS/UOMConversation/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                                <i class="fas fa-pencil-alt"></i>
                            </a>`;
                    }
                },
                { field: "Id", width: 50, hidden: true, sortable: true },
                { field: "FromName", title: "From", sortable: true, width: 200 },
                { field: "ToName", title: "To Name", sortable: true, width: 200 },
                { field: "ConversationFactor", title: "Conversation Factor", sortable: true, width: 200 },
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
        var validator = $("#frmEntry").validate();
        var model = serializeInputs("frmEntry");
        model.UOMId = getUOMId;


        var result = validator.form();

        if (!result) {
            validator.focusInvalid();
            return;
        }

        if ($('#IsActive').prop('checked')) {
            model.IsActive = true;
        }
        if ( parseInt(model.ToId) == 0) {
            ShowNotification(3, 'To is Required.');
            return;
        }
        if (parseInt(model.ConversationFactor) == 0) {
            ShowNotification(3, 'Conversation Factor is Required.');
            return;
        }
        var url = "/DMS/UOMConversation/CreateEdit";

        CommonAjaxService.finalSave(url, model, saveDone, saveFail);
    };

    function saveDone(result) {
       
        if (result.Status == 200) {
            if (result.Data.Operation == "add") {
                ShowNotification(1, result.Message);
                $(".btnsave").html('Update');
                $(".btnsave").addClass('sslUpdate');
                $("#Code").val(result.Data.Code);
                $("#Id").val(result.Data.Id);
                $("#Operation").val("update");
                $("#CreatedBy").val(result.Data.CreatedBy);
                $("#CreatedOn").val(result.Data.CreatedOn);
            } else {
                ShowNotification(1, result.Message);
                $("#LastModifiedBy").val(result.Data.LastModifiedBy);
                $("#LastModifiedOn").val(result.Data.LastModifiedOn);
            }
        } else if (result.Status == 400) {
            ShowNotification(3, result.Message);
        } else {
            ShowNotification(2, result.Message);
        }
    };

    function saveFail(result) {
       
        ShowNotification(3, "Query Exception!");
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
    function fail(err) {
       
        ShowNotification(3, "Something went wrong");
    };

    return {
        init: init
    };

}(CommonAjaxService);

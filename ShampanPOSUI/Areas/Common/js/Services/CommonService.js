var CommonService = function () {

    var productCodeModal = function (done, fail, dblCallBack, closeCallback) {
        
        var modalId = "#partialModal"; 
        var dataTableId = "#modalData";
        function showModal(html) {
            $(modalId).html(html);
            $('.draggable').draggable({
                handle: ".modal-header"
            });
            $(modalId).modal("show");
        }

        function onSuccess(result) {
            showModal(result);

            if (typeof done === "function") {
                done(result);
            }

            bindDoubleClick(dblCallBack);
            bindModalClose(closeCallback);
            initializeDataTable();
        }

        function onFail(result) {
            if (typeof fail === "function") {
                fail(result);
            }
        }

        //function bindDoubleClick(callBack) {
        //    $(dataTableId).off("dblclick").on("dblclick", "tr", function () {
        //        if (typeof callBack === "function") {
        //            callBack($(this));
        //        }
        //    });
        //}
        function bindDoubleClick(callBack) {
            $(dataTableId).off("click").on("click", "tr", function () {
                if (typeof callBack === "function") {
                    callBack($(this));
                }
            });
        }

        function bindModalClose(closeCallback) {
            $(modalId).off("hidden.bs.modal").on("hidden.bs.modal", function () {
                if (typeof closeCallback === "function") {
                    closeCallback();
                }
                $(modalId).html("");
            });
        }

        function initializeDataTable() {
            if ($.fn.DataTable.isDataTable(dataTableId)) {
                $(dataTableId).DataTable().destroy();
            }

            $(dataTableId).DataTable({
                orderCellsTop: true,
                fixedHeader: true,
                serverSide: true,
                processing: true,
                lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
                ajax: {
                    url: '/Common/Common/_getProductDataForSale',
                    type: 'POST',
                    data: function (d) {
                        d.FromDate = $('#FromDate').val();

                        d.CustomerId = $("#CustomerId").data("kendoMultiColumnComboBox").value();
                    },
                    error: function (xhr, error, thrown) {
                        console.error("AJAX Error:", error, thrown);
                        console.error("Response:", xhr.responseText);
                    }
                },
                columns: [
                    { data: "ProductGroupName", title: "Product Group Name", width: '15%', visible: false },
                    { data: "ProductId", visible: false },
                    { data: "ProductCode", title: "Product Code", width: '10%', visible: false },
                    { data: "ProductName", title: "Product Name", width: '30%' },
                    { data: "BanglaName", title: "Product Bangla Name", width: '30%' },
                    { data: "HSCodeNo", title: "HS Code No.", width: '10%', visible: false },
                    { data: "UOMId", visible: false },
                    { data: "UOMName", title: "UOM Name", width: '8%' },
                    { data: "SalesPrice", title: "Sale Price", width: '8%' },
                    { data: "QuantityInHand", title: "Qty in Hand", width: '8%' },
                    { data: "SDRate", title: "SD Rate", width: '8%', visible: false },
                    { data: "VATRate", title: "VAT Rate", width: '8%', visible: false },
                    { data: "Status", title: "Status", width: '8%'}
                ],
                columnDefs: [
                    { width: '10%', targets: 0 }
                ],
            });
        }

        $.ajax({
            url: '/Common/Common/GetProductData',
            method: 'get',
        }).done(onSuccess).fail(onFail);
    };  

    var productForPurchaseModal = function (done, fail, dblCallBack, closeCallback) {
        var modalId = "#partialModal";
        var dataTableId = "#modalData";
        function showModal(html) {
            $(modalId).html(html);
            $('.draggable').draggable({
                handle: ".modal-header"
            });
            $(modalId).modal("show");
        }

        function onSuccess(result) {
            showModal(result);

            if (typeof done === "function") {
                done(result);
            }

            bindDoubleClick(dblCallBack);
            bindModalClose(closeCallback);
            initializeDataTable();
        }

        function onFail(result) {
            if (typeof fail === "function") {
                fail(result);
            }
        }

        function bindDoubleClick(callBack) {
            $(dataTableId).off("dblclick").on("dblclick", "tr", function () {
                if (typeof callBack === "function") {
                    callBack($(this));
                }
            });
        }

        function bindModalClose(closeCallback) {
            $(modalId).off("hidden.bs.modal").on("hidden.bs.modal", function () {
                if (typeof closeCallback === "function") {
                    closeCallback();
                }
                $(modalId).html("");
            });
        }

        function initializeDataTable() {
            if ($.fn.DataTable.isDataTable(dataTableId)) {
                $(dataTableId).DataTable().destroy();
            }

            $(dataTableId).DataTable({
                orderCellsTop: true,
                fixedHeader: true,
                serverSide: true,
                processing: true,
                lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
                ajax: {
                    url: '/Common/Common/_getProductForPurchaseData',
                    type: 'POST',
                    data: function (d) {
                        d.FromDate = $('#FromDate').val();
                    },
                    error: function (xhr, error, thrown) {
                        console.error("AJAX Error:", error, thrown);
                        console.error("Response:", xhr.responseText);
                    }
                },
                columns: [
                    { data: "ProductGroupName", title: "Product Group Name", width: '15%',visible: false },
                    { data: "ProductId", visible: false },
                    { data: "ProductCode", title: "Product Code", width: '10%',visible: false },
                    { data: "ProductName", title: "Product Name", width: '30%' },
                    { data: "BanglaName", title: "Product Bangla Name", width: '30%' },
                    { data: "HSCodeNo", title: "HS Code No.", width: '10%', visible: false },
                    { data: "UOMId", visible: false },
                    { data: "UOMName", title: "UOM Name", width: '10%' },
                    { data: "PurchasePrice", title: "Purchase Price", width: '10%' },
                    { data: "SDRate", title: "SD Rate", width: '8%', visible: false },
                    { data: "VATRate", title: "VAT Rate", width: '8%', visible: false },
                    { data: "Status", title: "Status", width: '8%' }
                    
                ],
                columnDefs: [
                    { width: '10%', targets: 0 }
                ],
            });
        }

        $.ajax({
            //url: '/Common/Common/GetProductData',
            url: '/Common/Common/GetProductDataPurchase',
            method: 'get',
        }).done(onSuccess).fail(onFail);
    };  

    var productGroupCodeModal = function (done, fail, dblCallBack, closeCallback) {
        $.ajax({
            url: '/Common/Common/GetProductGroupData',
            method: 'get'

        }).done(onSuccess)
            .fail(onFail);

        var doublClick = function (callBack) {
            $("#modalData").on("dblclick", "tr",
                function () {
                    if (typeof callBack == "function") {
                        callBack($(this));
                    }
                });

        }
        var modalCloseEvent = function (closeCallback) {
            $('#partialModal').on('hidden.bs.modal', function () {
                if (typeof closeCallback == "function") {
                    closeCallback();
                }
            });
        }

        var getDataTable = function () {
            var dataTable = $("#modalData").DataTable({
                orderCellsTop: true,
                fixedHeader: true,
                serverSide: true,
                processing: true,
                lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
                ajax: {
                    url: '/Common/Common/_getProductGroupData',
                    type: 'POST',
                    data: function (d) {
                        //d.Id = $('#Id').val();
                    },
                    error: function (xhr, error, thrown) {
                        console.error("AJAX Error:", error, thrown);
                        console.error("Response:", xhr.responseText);
                    }
                },
                columns: [
                    { data: "ProductGroupId", name: "ProductGroupId", visible: false },
                    { data: "ProductGroupCode", name: "Product Group Code", width: '25%' },
                    { data: "ProductGroupName", name: "Product Group Name", width: '50%' },
                    { data: "Status", name: "Status", width: '15%' }
                ],
                columnDefs: [
                    { width: '30%', targets: 0 }
                ],
            });

            return dataTable;
        }
        function onSuccess(result) {
            showModal(result);
            if (typeof done == "function") {
                done(result);
            }

            doublClick(dblCallBack);

            modalCloseEvent(closeCallback);

            getDataTable();
        }
        function onFail(result) {
            fail(result);
        }
        function showModal(html) {
            $("#partialModal").html(html);
            $('.draggable').draggable({
                handle: ".modal-header"
            });
            $("#partialModal").modal("show");
        }
    };

    var uomFromNameModal = function (done, fail, dblCallBack, closeCallback) {
        var modalId = "#partialModal";
        var dataTableId = "#modalData";

        function showModal(html) {
            $(modalId).html(html);
            $('.draggable').draggable({
                handle: ".modal-header"
            });
            $(modalId).modal("show");
        }

        function onSuccess(result) {
            showModal(result);

            if (typeof done === "function") {
                done(result);
            }

            bindDoubleClick(dblCallBack);
            bindModalClose(closeCallback);
            initializeDataTable();
        }

        function onFail(result) {
            if (typeof fail === "function") {
                fail(result);
            }
        }

        function bindDoubleClick(callBack) {
            $(dataTableId).off("dblclick").on("dblclick", "tr", function () {
                if (typeof callBack === "function") {
                    callBack($(this));
                }
            });
        }

        function bindModalClose(closeCallback) {
            $(modalId).off("hidden.bs.modal").on("hidden.bs.modal", function () {
                if (typeof closeCallback === "function") {
                    closeCallback();
                }
                $(modalId).html("");
            });
        }

        function initializeDataTable() {
            if ($.fn.DataTable.isDataTable(dataTableId)) {
                $(dataTableId).DataTable().destroy();
            }

            $(dataTableId).DataTable({
                orderCellsTop: true,
                fixedHeader: true,
                serverSide: true,
                processing: true,
                lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
                ajax: {
                    url: '/Common/Common/_getUOMFromNameData',
                    type: 'POST',
                    data: function (d) {
                        d.UOMId = $('#UOMId').val();
                    },
                    error: function (xhr, error, thrown) {
                        console.error("AJAX Error:", error, thrown);
                        console.error("Response:", xhr.responseText);
                    }
                },
                columns: [
                    { data: "UOMId", visible: false },
                    { data: "UOMFromName", title: "UOM FromName", width: '40%' },
                    { data: "UOMConversion", title: "UOM Conversion", width: '20%' },
                    { data: "Status", title: "Status", width: '10%' }
                ],
                columnDefs: [
                    { width: '30%', targets: 0 }
                ],
            });
        }

        $.ajax({
            url: '/Common/Common/GetUOMFromNameData',
            method: 'get',
        }).done(onSuccess).fail(onFail);
    };

    var customerCodeModal = function (done, fail, dblCallBack, closeCallback) {
        var modalId = "#partialModal";
        var dataTableId = "#modalData";

        function showModal(html) {
            $(modalId).html(html);
            $('.draggable').draggable({
                handle: ".modal-header"
            });
            $(modalId).modal("show");
        }

        function onSuccess(result) {
            showModal(result);

            if (typeof done === "function") {
                done(result);
            }

            bindDoubleClick(dblCallBack);
            bindModalClose(closeCallback);
            initializeDataTable();
        }

        function onFail(result) {
            if (typeof fail === "function") {
                fail(result);
            }
        }

        function bindDoubleClick(callBack) {
            $(dataTableId).off("dblclick").on("dblclick", "tr", function () {
                if (typeof callBack === "function") {
                    callBack($(this));
                }
            });
        }

        function bindModalClose(closeCallback) {
            $(modalId).off("hidden.bs.modal").on("hidden.bs.modal", function () {
                if (typeof closeCallback === "function") {
                    closeCallback();
                }
                $(modalId).html("");
            });
        }

        function initializeDataTable() {
            if ($.fn.DataTable.isDataTable(dataTableId)) {
                $(dataTableId).DataTable().destroy();
            }

            $(dataTableId).DataTable({
                orderCellsTop: true,
                fixedHeader: true,
                serverSide: true,
                processing: true,
                lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
                ajax: {
                    url: '/Common/Common/_getCustomerData',
                    type: 'POST',
                    data: function (d) {
                       
                    },
                    error: function (xhr, error, thrown) {
                        console.error("AJAX Error:", error, thrown);
                        console.error("Response:", xhr.responseText);
                    }
                },
                columns: [
                    { data: "CustomerId", visible: false },
                    { data: "CustomerCode", title: "Customer Code", width: '10%' },
                    { data: "CustomerName", title: "Customer Name", width: '15%' },
                    { data: "BanglaName", title: "Customer Bangla Name", width: '15%' },
                    { data: "Status", title: "Status", width: '10%' }
                ],
                columnDefs: [
                    { width: '30%', targets: 0 }
                ],
            });
        }

        $.ajax({
            url: '/Common/Common/GetCustomerData',
            method: 'get',
        }).done(onSuccess).fail(onFail);
    };  

    var branchLoading = function (done, fail, userId) {
        $.ajax({
            url: '/Common/Common/BranchLoading?UserId=' + userId,
            method: 'get'
        })
            .done(onSuccess)
            .fail(onFail);

        function onSuccess(result) {
            showModal(result);
        }
        function onFail(result) {
            fail(result);
        }
        function showModal(html) {
            $("#partialModal").html(html);
            $('.draggable').draggable({
                handle: ".modal-header"
            });
            $("#partialModal").modal("show");
        }
    };

    var CampaignMudularityCalculation = function ( data, done, fail) {
        $.ajax({
            url: '/Common/Common/_getCampaignMudularityCalculation',
            method: 'post',
            data: data,
        })
            .done(onSuccess)
            .fail(onFail);

        function onSuccess(result) {
            if (typeof done === "function") {
                done(result);
            }
        }
        function onFail(result) {
            fail(result);
        }
    };
    var CampaignInvoiceCalculation = function (data, done, fail) {
        $.ajax({
            url: '/Common/Common/_getCampaignInvoiceCalculation',
            method: 'post',
            data: data,
        })
            .done(onSuccess)
            .fail(onFail);

        function onSuccess(result) {
            if (typeof done === "function") {
                done(result);
            }
        }
        function onFail(result) {
            fail(result);
        }
    };

    var productModal = function (done, fail, dblCallBack, closeCallback) {
        var modalId = "#partialModal";
        var dataTableId = "#modalData";
        function showModal(html) {
            $(modalId).html(html);
            $('.draggable').draggable({
                handle: ".modal-header"
            });
            $(modalId).modal("show");
        }

        function onSuccess(result) {
            showModal(result);

            if (typeof done === "function") {
                done(result);
            }

            bindDoubleClick(dblCallBack);
            bindModalClose(closeCallback);
            initializeDataTable();
        }

        function onFail(result) {
            if (typeof fail === "function") {
                fail(result);
            }
        }

        function bindDoubleClick(callBack) {
            $(dataTableId).off("dblclick").on("dblclick", "tr", function () {
                if (typeof callBack === "function") {
                    callBack($(this));
                }
            });
        }

        function bindModalClose(closeCallback) {
            $(modalId).off("hidden.bs.modal").on("hidden.bs.modal", function () {
                if (typeof closeCallback === "function") {
                    closeCallback();
                }
                $(modalId).html("");
            });
        }

        function initializeDataTable() {

            if ($.fn.DataTable.isDataTable(dataTableId)) {
                $(dataTableId).DataTable().destroy();
            }

            $(dataTableId).DataTable({
                orderCellsTop: true,
                fixedHeader: true,
                serverSide: true,
                processing: true,
                lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],                
                ajax: {
                    url: '/Common/Common/_getProductCode',
                    type: 'POST',
                    data: function (d) {
                        console.log(d);
                        d.FromDate = $('#FromDate').val();
                    },
                    error: function (xhr, error, thrown) {
                        console.error("AJAX Error:", error, thrown);
                        console.error("Response:", xhr.responseText);
                    }
                },
                columns: [
                    {
                        data: null,
                        orderable: false,
                        className: "text-center",
                        width: "8%",
                        render: function (data, type, row) {
                            return '<input type="checkbox" class="row-select" value="' + row.ProductId + '">';
                        }
                    },
                    { data: "ProductGroupName", title: "Product Group Name", width: '15%', visible: false },
                    { data: "ProductId", visible: false },
                    { data: "ProductCode", title: "Product Code", width: '15%', visible: false },
                    { data: "ProductName", title: "Product Name", width: '30%' },
                    { data: "BanglaName", title: "Product Bangla Name", width: '25%' },
                    { data: "HSCodeNo", title: "HS Code No.", width: '10%', visible: false },
                    { data: "UOMId", visible: false },
                    { data: "UOMName", title: "UOM Name", width: '10%' },
                    { data: "CtnSize", title: "Ctn Size", width: '10%' },
                  
                    { data: "SDRate", title: "SD Rate", width: '8%', visible: false },
                    { data: "VATRate", title: "VAT Rate", width: '8%', visible: false },
                    { data: "Status", title: "Status", width: '8%' }
                ],
               
            });
        }

        $.ajax({
            url: '/Common/Common/GetProductDataCampaign',
            method: 'get',
        }).done(onSuccess).fail(onFail);
    };  

    var saleDeleveryModal = function (done, fail, dblCallBack, closeCallback) {
        var modalId = "#partialModal";
        var dataTableId = "#modalData";
        function showModal(html) {
            $(modalId).html(html);
            $('.draggable').draggable({
                handle: ".modal-header"
            });
            $(modalId).modal("show");
        }

        function onSuccess(result) {
            showModal(result);

            if (typeof done === "function") {
                done(result);
            }

            bindDoubleClick(dblCallBack);
            bindModalClose(closeCallback);
            initializeDataTable();
        }

        function onFail(result) {
            if (typeof fail === "function") {
                fail(result);
            }
        }

        function bindDoubleClick(callBack) {
            $(dataTableId).off("dblclick").on("dblclick", "tr", function () {
                if (typeof callBack === "function") {
                    callBack($(this));
                }
            });
        }

        function bindModalClose(closeCallback) {
            $(modalId).off("hidden.bs.modal").on("hidden.bs.modal", function () {
                if (typeof closeCallback === "function") {
                    closeCallback();
                }
                $(modalId).html("");
            });
        }

        function initializeDataTable() {
            if ($.fn.DataTable.isDataTable(dataTableId)) {
                $(dataTableId).DataTable().destroy();
            }

            $(dataTableId).DataTable({
                orderCellsTop: true,
                fixedHeader: true,
                serverSide: true,
                processing: true,
                lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
                ajax: {
                    url: '/Common/Common/_getSaleDelevery',
                    type: 'POST',
                    data: function (d) {
                        d.FromDate = $('#FromDate').val();

                        d.CustomerId = $("#CustomerId").data("kendoMultiColumnComboBox").value();
                    },
                    error: function (xhr, error, thrown) {
                        console.error("AJAX Error:", error, thrown);
                        console.error("Response:", xhr.responseText);
                    }
                },
                columns: [
                    { data: "Id", title: "Id", width: '15%' },
                    { data: "Code", title: "Code", width: '15%' },
                    { data: "DriverPersonId", visible: false },
                    { data: "DeliveryPersonId", visible: false },
                    { data: "DeliveryAddress", title: "Delivery Address", width: '15%' },
                    { data: "DeliveryDate", title: "Delivery Date", width: '15%' },
                    { data: "GrandTotalAmount", title: "Grand Total Amount", width: '15%' },
                ],
                columnDefs: [
                    { width: '10%', targets: 0 }
                ]
            });
        }

        $.ajax({
            url: '/Common/Common/GetSaleDeliveryData',
            method: 'get',
        }).done(onSuccess).fail(onFail);
    };  

    function validateDropdown(selector, errorId, errorMessage) {
        
        var isValid = true;
        var value = $(selector).val()?.trim();

        if (value === "" /*|| value === "0"*/) {
            isValid = false;
            $(selector).addClass("is-invalid");
            $(errorId).text(errorMessage).show(); 
        } else {
            $(selector).removeClass("is-invalid");
            $(errorId).text("").hide(); 
        }

        $(selector).on('change', function () {
            if ($(this).val() !== "" && $(this).val() !== "0") {
                $(this).removeClass("is-invalid");
                $(errorId).text("").hide(); 
            }
        });

        return isValid;
    }




    return {

        productCodeModal: productCodeModal,
        productModal: productModal,
        productForPurchaseModal: productForPurchaseModal,
        productGroupCodeModal: productGroupCodeModal,
        uomFromNameModal: uomFromNameModal,
        customerCodeModal: customerCodeModal,
        branchLoading: branchLoading,
        CampaignMudularityCalculation: CampaignMudularityCalculation,
        CampaignInvoiceCalculation: CampaignInvoiceCalculation,
        validateDropdown: validateDropdown,
        saleDeleveryModal: saleDeleveryModal


    }

}();
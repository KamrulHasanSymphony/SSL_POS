var ModalService = function () {


    var customerNumberModal = function (done, fail, dblCallBack) {

        $.ajax({
            url: '/Common/customerNumberModal',
            method: 'get'

        })
            .done(onSuccess)
            .fail(onFail);



        var doublClick = function (callBack) {

            $("#CustomerNumberModal").on("dblclick",
                "tr",
                function () {

                    if (typeof callBack == "function") {
                        callBack($(this));
                    }
                });

        }

        var formatTable = function () {

            //$('#CustomerNumberModal thead tr')
            //    .clone(true)
            //    .addClass('filters')
            //    .appendTo('#CustomerNumberModal thead');


            var dataTable = $("#CustomerNumberModal").DataTable({
                orderCellsTop: true,
                fixedHeader: true,
                serverSide: true,
                "processing": true,
                ajax: {
                    url: '/Common/_customerNumberModal',
                    type: 'POST',
                    data: function (payLoad) {
                        return $.extend({},
                            payLoad,
                            {
                                
                            });
                    }
                },
                columns: [

                    {
                        data: "customerNo",
                        name: "CustomerNo",
                    }
                    ,
                    {
                        data: "customerName",
                        name: "CustomerName"
                    }
                    ,
                    {
                        data: "onHold",
                        name: "OnHold"
                    }
                    ,
                    {
                        data: "status",
                        name: "Status"
                    }
                    ,
                    {
                        data: "contract",
                        name: "Contract"
                    }
                    ,
                    {
                        data: "customerDescription",
                        name: "CustomerDescription"
                    }
                    

                ]

            });


            //dataTable
            //    .columns()
            //    .eq(0)
            //    .each(function (colIdx) {
            //        // Set the header cell to contain the input element
            //        var cell = $('.filters th').eq(
            //            $(dataTable.column(colIdx).header()).index()
            //        );
            //        var title = $(cell).text();
            //        $(cell).html('<input type="text" class="acc-filters filter-input"  placeholder="' +
            //            title +
            //            '"  id="md-' +
            //            title.replace(/ /g, "") +
            //            '"/>');

            //    });


            $("#CustomerNumberModal").on("keyup",
                ".acc-filters",
                function () {



                    dataTable.draw();
                });

            return dataTable;

        }


        function onSuccess(result) {
            
            showModal(result);

            if (typeof done == "function") {
                done(result);

            }

            doublClick(dblCallBack);

            formatTable();
        }


        function onFail(result) {
            fail(result);
        }


        function showModal(html) {
            
            $("#customerModal").html(html);

            $('.draggable').draggable({
                handle: ".modal-header"
            });

            $("#customerModal").modal("show");
        }
    };


    var priceListModal = function (done, fail, dblCallBack) {

        $.ajax({
            url: '/Common/priceListModal',
            method: 'get'

        })
            .done(onSuccess)
            .fail(onFail);



        var doublClick = function (callBack) {

            $("#PriceModal").on("dblclick",
                "tr",
                function () {

                    if (typeof callBack == "function") {
                        callBack($(this));
                    }
                });

        }

        var formatTable = function () {

            //$('#PriceModal thead tr')
            //    .clone(true)
            //    .addClass('filters')
            //    .appendTo('#PriceModal thead');


            var dataTable = $("#PriceModal").DataTable({
                orderCellsTop: true,
                fixedHeader: true,
                serverSide: true,
                "processing": true,
                ajax: {
                    url: '/Common/_priceListModal',
                    type: 'POST',
                    data: function (payLoad) {
                        return $.extend({},
                            payLoad,
                            {

                            });
                    }
                },
                columns: [

                    {
                        data: "priceList",
                        name: "PriceList",
                    }
                    ,
                    {
                        data: "description",
                        name: "Description"
                    }
                   
                   

                ]

            });


            //dataTable
            //    .columns()
            //    .eq(0)
            //    .each(function (colIdx) {
            //        // Set the header cell to contain the input element
            //        var cell = $('.filters th').eq(
            //            $(dataTable.column(colIdx).header()).index()
            //        );
            //        var title = $(cell).text();
            //        $(cell).html('<input type="text" class="acc-filters filter-input"  placeholder="' +
            //            title +
            //            '"  id="md-' +
            //            title.replace(/ /g, "") +
            //            '"/>');

            //    });


            $("#PriceModal").on("keyup",
                ".acc-filters",
                function () {



                    dataTable.draw();
                });

            return dataTable;

        }


        function onSuccess(result) {
            
            showModal(result);

            if (typeof done == "function") {
                done(result);

            }

            doublClick(dblCallBack);

            formatTable();
        }


        function onFail(result) {
            fail(result);
        }


        function showModal(html) {
            
            $("#shPriceModal").html(html);

            $('.draggable').draggable({
                handle: ".modal-header"
            });

            $("#shPriceModal").modal("show");
        }
    };

    
    var transferNumberModal = function (done, fail, dblCallBack) {

        $.ajax({
            url: '/Common/transferNumberModal',
            method: 'get'

        })
            .done(onSuccess)
            .fail(onFail);



        var doublClick = function (callBack) {

            $("#TransferNumberModal").on("dblclick",
                "tr",
                function () {

                    if (typeof callBack == "function") {
                        callBack($(this));
                    }
                });

        }

        var formatTable = function () {

            $('#TransferNumberModal thead tr')
                .clone(true)
                .addClass('filters')
                .appendTo('#TransferNumberModal thead');


            var dataTable = $("#TransferNumberModal").DataTable({
                orderCellsTop: true,
                fixedHeader: true,
                serverSide: true,
                "processing": true,
                ajax: {
                    url: '/Common/_transferNumberModal',
                    type: 'POST',
                    data: function (payLoad) {
                        return $.extend({},
                            payLoad,
                            {

                            });
                    }
                },
                columns: [

                    {
                        data: "customerNo",
                        name: "CustomerNo",
                    }
                    ,
                    {
                        data: "customerName",
                        name: "CustomerName"
                    }
                    ,
                    {
                        data: "onHold",
                        name: "OnHold"
                    }
                    ,
                    {
                        data: "status",
                        name: "Status"
                    }

                ]

            });


            dataTable
                .columns()
                .eq(0)
                .each(function (colIdx) {
                    // Set the header cell to contain the input element
                    var cell = $('.filters th').eq(
                        $(dataTable.column(colIdx).header()).index()
                    );
                    var title = $(cell).text();
                    $(cell).html('<input type="text" class="acc-filters filter-input"  placeholder="' +
                        title +
                        '"  id="md-' +
                        title.replace(/ /g, "") +
                        '"/>');

                });


            $("#TransferNumberModal").on("keyup",
                ".acc-filters",
                function () {



                    dataTable.draw();
                });

            return dataTable;

        }


        function onSuccess(result) {
            
            showModal(result);

            if (typeof done == "function") {
                done(result);

            }

            doublClick(dblCallBack);

            formatTable();
        }


        function onFail(result) {
            fail(result);
        }


        function showModal(html) {
            
            $("#customerModal").html(html);

            $('.draggable').draggable({
                handle: ".modal-header"
            });

            $("#customerModal").modal("show");
        }
    };


    var sageTemplateModal = function (done, fail, dblCallBack) {

        $.ajax({
            url: '/Common/sageTemplateModal',
            method: 'get'

        })
            .done(onSuccess)
            .fail(onFail);



        var doublClick = function (callBack) {

            $("#TemplateModal").on("dblclick",
                "tr",
                function () {

                    if (typeof callBack == "function") {
                        callBack($(this));
                    }
                });

        }

        var formatTable = function () {

            //$('#TemplateModal thead tr')
            //    .clone(true)
            //    .addClass('filters')
            //    .appendTo('#TemplateModal thead');


            var dataTable = $("#TemplateModal").DataTable({
                orderCellsTop: true,
                fixedHeader: true,
                serverSide: true,
                "processing": true,
                ajax: {
                    url: '/Common/_sageTemplateModal',
                    type: 'POST',
                    data: function (payLoad) {
                        return $.extend({},
                            payLoad,
                            {

                            });
                    }
                },
                columns: [

                    {
                        data: "code",
                        name: "Code",
                    }
                    ,
                    {
                        data: "description",
                        name: "Description"
                    }
                    

                ]

            });


            //dataTable
            //    .columns()
            //    .eq(0)
            //    .each(function (colIdx) {
            //        // Set the header cell to contain the input element
            //        var cell = $('.filters th').eq(
            //            $(dataTable.column(colIdx).header()).index()
            //        );
            //        var title = $(cell).text();
            //        $(cell).html('<input type="text" class="acc-filters filter-input"  placeholder="' +
            //            title +
            //            '"  id="md-' +
            //            title.replace(/ /g, "") +
            //            '"/>');

            //    });


            $("#TemplateModal").on("keyup",
                ".acc-filters",
                function () {



                    dataTable.draw();
                });

            return dataTable;

        }


        function onSuccess(result) {
            
            showModal(result);

            if (typeof done == "function") {
                done(result);

            }

            doublClick(dblCallBack);

            formatTable();
        }


        function onFail(result) {
            fail(result);
        }


        function showModal(html) {
            
            $("#templateModal").html(html);

            $('.draggable').draggable({
                handle: ".modal-header"
            });

            $("#templateModal").modal("show");
        }


    };

    var shipToLocationModal = function (done, fail, dblCallBack) {

        $.ajax({
            url: '/Common/shipToLcationModal',
            method: 'get'

        })
            .done(onSuccess)
            .fail(onFail);



        var doublClick = function (callBack) {

            $("#ShipToLocationModal").on("dblclick",
                "tr",
                function () {

                    if (typeof callBack == "function") {
                        callBack($(this));
                    }
                });

        }

        var formatTable = function () {

            //$('#ShipToLocationModal thead tr')
            //    .clone(true)
            //    .addClass('filters')
            //    .appendTo('#ShipToLocationModal thead');


            var dataTable = $("#ShipToLocationModal").DataTable({
                orderCellsTop: true,
                fixedHeader: true,
                serverSide: true,
                "processing": true,
                ajax: {
                    url: '/Common/_shipToLcationModal',
                    type: 'POST',
                    data: function (payLoad) {
                        return $.extend({},
                            payLoad,
                            {

                            });
                    }
                },
                columns: [

                    {
                        data: "location",
                        name: "Location",
                    }
                    ,
                    {
                        data: "description",
                        name: "Description"
                    }
                    ,
                    {
                        data: "address",
                        name: "Address"
                    }
                   

                ]

            });


            //dataTable
            //    .columns()
            //    .eq(0)
            //    .each(function (colIdx) {
            //        // Set the header cell to contain the input element
            //        var cell = $('.filters th').eq(
            //            $(dataTable.column(colIdx).header()).index()
            //        );
            //        var title = $(cell).text();
            //        $(cell).html('<input type="text" class="acc-filters filter-input"  placeholder="' +
            //            title +
            //            '"  id="md-' +
            //            title.replace(/ /g, "") +
            //            '"/>');

            //    });


            $("#ShipToLocationModal").on("keyup",
                ".acc-filters",
                function () {



                    dataTable.draw();
                });

            return dataTable;

        }


        function onSuccess(result) {
            
            showModal(result);

            if (typeof done == "function") {
                done(result);

            }

            doublClick(dblCallBack);

            formatTable();
        }


        function onFail(result) {
            fail(result);
        }


        function showModal(html) {
            
            $("#shipModal").html(html);

            $('.draggable').draggable({
                handle: ".modal-header"
            });

            $("#shipModal").modal("show");
        }


    };

    //extra 
    var billToLocationModal = function (done, fail, dblCallBack) {

        $.ajax({
            url: '/Common/billToLocationModal',
            method: 'get'

        })
            .done(onSuccess)
            .fail(onFail);



        var doublClick = function (callBack) {

            $("#BillToLocationModal").on("dblclick",
                "tr",
                function () {

                    if (typeof callBack == "function") {
                        callBack($(this));
                    }
                });

        }

        var formatTable = function () {

            $('#BillToLocationModal thead tr')
                .clone(true)
                .addClass('filters')
                .appendTo('#BillToLocationModal thead');


            var dataTable = $("#BillToLocationModal").DataTable({
                orderCellsTop: true,
                fixedHeader: true,
                serverSide: true,
                "processing": true,
                ajax: {
                    url: '/Common/_billToLocationModal',
                    type: 'POST',
                    data: function (payLoad) {
                        return $.extend({},
                            payLoad,
                            {

                            });
                    }
                },
                columns: [

                    {
                        data: "customerNo",
                        name: "CustomerNo",
                    }
                    ,
                    {
                        data: "customerName",
                        name: "CustomerName"
                    }
                    ,
                    {
                        data: "onHold",
                        name: "OnHold"
                    }
                    ,
                    {
                        data: "status",
                        name: "Status"
                    }

                ]

            });


            dataTable
                .columns()
                .eq(0)
                .each(function (colIdx) {
                    // Set the header cell to contain the input element
                    var cell = $('.filters th').eq(
                        $(dataTable.column(colIdx).header()).index()
                    );
                    var title = $(cell).text();
                    $(cell).html('<input type="text" class="acc-filters filter-input"  placeholder="' +
                        title +
                        '"  id="md-' +
                        title.replace(/ /g, "") +
                        '"/>');

                });


            $("#BillToLocationModal").on("keyup",
                ".acc-filters",
                function () {



                    dataTable.draw();
                });

            return dataTable;

        }


        function onSuccess(result) {
            
            showModal(result);

            if (typeof done == "function") {
                done(result);

            }

            doublClick(dblCallBack);

            formatTable();
        }


        function onFail(result) {
            fail(result);
        }


        function showModal(html) {
            
            $("#billModal").html(html);

            $('.draggable').draggable({
                handle: ".modal-header"
            });

            $("#billModal").modal("show");
        }


    };
    //end extra
    
    var shipViaModal = function (done, fail, dblCallBack) {

        $.ajax({
            url: '/Common/shipViaModal',
            method: 'get'

        })
            .done(onSuccess)
            .fail(onFail);



        var doublClick = function (callBack) {

            $("#ShipViaModal").on("dblclick",
                "tr",
                function () {

                    if (typeof callBack == "function") {
                        callBack($(this));
                    }
                });

        }

        var formatTable = function () {

            //$('#ShipViaModal thead tr')
            //    .clone(true)
            //    .addClass('filters')
            //    .appendTo('#ShipViaModal thead');


            var dataTable = $("#ShipViaModal").DataTable({
                orderCellsTop: true,
                fixedHeader: true,
                serverSide: true,
                "processing": true,
                ajax: {
                    url: '/Common/_shipViaModal',
                    type: 'POST',
                    data: function (payLoad) {
                        return $.extend({},
                            payLoad,
                            {

                            });
                    }
                },
                columns: [

                    {
                        data: "code",
                        name: "Code",
                    }
                    ,
                    {
                        data: "shipViaName",
                        name: "ShipViaName"
                    }
                    ,
                    {
                        data: "address1",
                        name: "Address1"
                    }
                    ,
                    {
                        data: "address2",
                        name: "Address2"
                    }

                ]

            });


            //dataTable
            //    .columns()
            //    .eq(0)
            //    .each(function (colIdx) {
            //        // Set the header cell to contain the input element
            //        var cell = $('.filters th').eq(
            //            $(dataTable.column(colIdx).header()).index()
            //        );
            //        var title = $(cell).text();
            //        $(cell).html('<input type="text" class="acc-filters filter-input"  placeholder="' +
            //            title +
            //            '"  id="md-' +
            //            title.replace(/ /g, "") +
            //            '"/>');

            //    });


            $("#ShipViaModal").on("keyup",
                ".acc-filters",
                function () {



                    dataTable.draw();
                });

            return dataTable;

        }


        function onSuccess(result) {
            
            showModal(result);

            if (typeof done == "function") {
                done(result);

            }

            doublClick(dblCallBack);

            formatTable();
        }


        function onFail(result) {
            fail(result);
        }


        function showModal(html) {
            
            $("#shipviaModal").html(html);

            $('.draggable').draggable({
                handle: ".modal-header"
            });

            $("#shipviaModal").modal("show");
        }


    };
    
    var termsCodeModal = function (done, fail, dblCallBack) {

        $.ajax({
            url: '/Common/termsCodeModal',
            method: 'get'

        })
            .done(onSuccess)
            .fail(onFail);



        var doublClick = function (callBack) {

            $("#TermsCodeModal").on("dblclick",
                "tr",
                function () {

                    if (typeof callBack == "function") {
                        callBack($(this));
                    }
                });

        }

        var formatTable = function () {

            //$('#TermsCodeModal thead tr')
            //    .clone(true)
            //    .addClass('filters')
            //    .appendTo('#TermsCodeModal thead');


            var dataTable = $("#TermsCodeModal").DataTable({
                orderCellsTop: true,
                fixedHeader: true,
                serverSide: true,
                "processing": true,
                ajax: {
                    url: '/Common/_termsCodeModal',
                    type: 'POST',
                    data: function (payLoad) {
                        return $.extend({},
                            payLoad,
                            {

                            });
                    }
                },
                columns: [

                    {
                        data: "code",
                        name: "Code",
                    }
                    ,
                    {
                        data: "description",
                        name: "Description"
                    }
                   

                ]

            });


            //dataTable
            //    .columns()
            //    .eq(0)
            //    .each(function (colIdx) {
            //        // Set the header cell to contain the input element
            //        var cell = $('.filters th').eq(
            //            $(dataTable.column(colIdx).header()).index()
            //        );
            //        var title = $(cell).text();
            //        $(cell).html('<input type="text" class="acc-filters filter-input"  placeholder="' +
            //            title +
            //            '"  id="md-' +
            //            title.replace(/ /g, "") +
            //            '"/>');

            //    });


            $("#TermsCodeModal").on("keyup",
                ".acc-filters",
                function () {



                    dataTable.draw();
                });

            return dataTable;

        }


        function onSuccess(result) {
            
            showModal(result);

            if (typeof done == "function") {
                done(result);

            }

            doublClick(dblCallBack);

            formatTable();
        }


        function onFail(result) {
            fail(result);
        }


        function showModal(html) {
            
            $("#termsModal").html(html);

            $('.draggable').draggable({
                handle: ".modal-header"
            });

            $("#termsModal").modal("show");
        }


    };

    var vendorAccSetModal = function (done, fail, dblCallBack) {

        $.ajax({
            url: '/Common/vendorAccSetModal',
            method: 'get'

        })
            .done(onSuccess)
            .fail(onFail);



        var doublClick = function (callBack) {

            $("#VendorAccSetModal").on("dblclick",
                "tr",
                function () {

                    if (typeof callBack == "function") {
                        callBack($(this));
                    }
                });

        }

        var formatTable = function () {

            //$('#VendorAccSetModal thead tr')
            //    .clone(true)
            //    .addClass('filters')
            //    .appendTo('#VendorAccSetModal thead');


            var dataTable = $("#VendorAccSetModal").DataTable({
                orderCellsTop: true,
                fixedHeader: true,
                serverSide: true,
                "processing": true,
                ajax: {
                    url: '/Common/_vendorAccSetModal',
                    type: 'POST',
                    data: function (payLoad) {
                        return $.extend({},
                            payLoad,
                            {

                            });
                    }
                },
                columns: [

                    {
                        data: "set",
                        name: "Set",
                    }
                    ,
                    {
                        data: "description",
                        name: "Description"
                    }
                    ,
                    {
                        data: "code",
                        name: "Code"
                    }
                    

                ]

            });


            //dataTable
            //    .columns()
            //    .eq(0)
            //    .each(function (colIdx) {
            //        // Set the header cell to contain the input element
            //        var cell = $('.filters th').eq(
            //            $(dataTable.column(colIdx).header()).index()
            //        );
            //        var title = $(cell).text();
            //        $(cell).html('<input type="text" class="acc-filters filter-input"  placeholder="' +
            //            title +
            //            '"  id="md-' +
            //            title.replace(/ /g, "") +
            //            '"/>');

            //    });


            $("#VendorAccSetModal").on("keyup",
                ".acc-filters",
                function () {



                    dataTable.draw();
                });

            return dataTable;

        }


        function onSuccess(result) {
            
            showModal(result);

            if (typeof done == "function") {
                done(result);

            }

            doublClick(dblCallBack);

            formatTable();
        }


        function onFail(result) {
            fail(result);
        }


        function showModal(html) {
            
            $("#vendorAccSetModal").html(html);

            $('.draggable').draggable({
                handle: ".modal-header"
            });

            $("#vendorAccSetModal").modal("show");
        }


    };



    return {
      
         customerNumberModal: customerNumberModal,
         priceListModal: priceListModal,
         transferNumberModal: transferNumberModal,
         sageTemplateModal: sageTemplateModal,
         shipToLocationModal: shipToLocationModal,
         billToLocationModal: billToLocationModal,
         shipViaModal: shipViaModal,
         termsCodeModal: termsCodeModal,
         vendorAccSetModal: vendorAccSetModal
       
       
    }

}();
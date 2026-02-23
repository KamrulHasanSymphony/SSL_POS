var DashController = function () {

    var init = function (count) {
        if (count == 0) {
            //$("#branchProfiles").modal("show");
            loadBranchProfiles();
        }

        $("#tBranchProfiles").on("dblclick", "td",
            function () {
                var branchCode = $(this).closest("tr").find("td:eq(0)").text().trim();
                var BranchName = $(this).closest("tr").find("td:eq(1)").text().trim();
                var userId = $(this).closest("tr").find("td:eq(2)").text().trim();

                var form = $('<form>', { method: 'POST' });
                var targetURL = '/Common/Home/AssignBranch';
                form.attr('action', targetURL);
                form.append($('<input>', {
                    type: 'BranchCode',
                    name: 'BranchCode',
                    value: branchCode
                }));
                form.append($('<input>', {
                    type: 'BranchName',
                    name: 'BranchName',
                    value: BranchName
                }));
                form.append($('<input>', {
                    type: 'UserId',
                    name: 'UserId',
                    value: userId
                }));

                form.hide();

                $(".container-fluid").append(form);

                form.submit();
                form.remove();
            }
        );
    };


    function loadBranchProfiles() {
        $.ajax({
            url: '/Common/Home/LoadBranchProfiles',
            type: 'GET',
            dataType: 'json',
            success: function (response) {

                if (response && response.data && response.data.length > 0) {

                    if (response.data.length === 1) {

                        var branch = response.data[0];

                        var form = $('<form>', { method: 'POST' });
                        form.attr('action', '/Common/Home/AssignBranch');

                        form.append($('<input>', {
                            type: 'hidden',
                            name: 'BranchCode',
                            value: branch.Code
                        }));

                        form.append($('<input>', {
                            type: 'hidden',
                            name: 'BranchName',
                            value: branch.Name
                        }));

                        form.append($('<input>', {
                            type: 'hidden',
                            name: 'UserId',
                            value: branch.UserId
                        }));

                        form.hide();
                        $(".container-fluid").append(form);
                        form.submit();
                        form.remove();

                    }
                    else {
                        $("#branchProfiles").modal("show");
                        var tbody = $('#tbdBranchProfiles');
                        tbody.empty();
                        response.data.forEach(function (branch) {
                            var row = `<tr>
                            <td>${branch.Code}</td>
                            <td>${branch.Name}</td>
                            <td style="display: none;">${branch.UserId}</td>
                        </tr>`;
                            tbody.append(row);
                        });
                        $('#tBranchProfiles').DataTable({
                            destroy: true,
                            paging: true,
                            searching: true,
                            lengthMenu: [[5, 10, 25, -1], [5, 10, 25, "All"]],
                            pageLength: 10,

                        });
                        $('#branchProfiles').modal('show');
                    }
                } else {
                    alert('No data available.');
                }
            },
            error: function () {
                alert('Failed to fetch branch profiles.');
            }
        });
    };


    return {
        init: init,
    }

}();











//var DashController = function () {
//    //var init = function (branches) {
//    //    debugger;
//    //    if (branches.length == 1) {

//    //        var branch = branches[0];

//    //        assignBranch(branch.BranchCode, branch.BranchName, branch.UserId);
//    //        return;
//    //    }
//    //    else {
//    //        $("#branchProfiles").modal("show");
//    //        loadBranchProfiles();
//    //    }

//    //    // Double-click event (only useful when modal is shown)
//    //    $("#tBranchProfiles").on("dblclick", "td", function () {
//    //        var branchCode = $(this).closest("tr").find("td:eq(0)").text().trim();
//    //        var branchName = $(this).closest("tr").find("td:eq(1)").text().trim();
//    //        var userId = $(this).closest("tr").find("td:eq(2)").text().trim();

//    //        assignBranch(branchCode, branchName, userId);
//    //    });
//    //};

//    //function assignBranch(branchCode, branchName, userId) {

//    //    $.ajax({
//    //        url: '/Common/Home/AssignBranch',
//    //        type: 'POST',
//    //        data: {
//    //            BranchCode: branchCode,
//    //            BranchName: branchName,
//    //            UserId: userId
//    //        },
//    //        success: function () {

//    //            checkDayEndData(branchCode, function (hasData) {
//    //                if (hasData) {
//    //                    // your logic
//    //                }
//    //            });

//    //            $("#branchProfiles").modal("hide");

//    //            var urlWithoutMessage = window.location.origin + window.location.pathname;
//    //            window.location.href = urlWithoutMessage + "?branchChange=False";
//    //        },
//    //        error: function () {
//    //            alert("Failed to assign branch.");
//    //        }
//    //    });
//    //}

//    var init = function (count) {
//        if (count == 0) {
//            $("#branchProfiles").modal("show");
//            loadBranchProfiles();
//        }

//        // Double-click on a branch row
//        $("#tBranchProfiles").on("dblclick", "td", function () {
//            var branchCode = $(this).closest("tr").find("td:eq(0)").text().trim();
//            var branchName = $(this).closest("tr").find("td:eq(1)").text().trim();
//            var userId = $(this).closest("tr").find("td:eq(2)").text().trim();

//            // Assign branch via AJAX
//            $.ajax({
//                url: '/Common/Home/AssignBranch',
//                type: 'POST',
//                data: { BranchCode: branchCode, BranchName: branchName, UserId: userId },
//                success: function (response) {
//                    console.log("Branch assigned successfully.");

//                    checkDayEndData(branchCode, function (hasData) {
//                        if (hasData) {
//                        }


//                    });
//                },
//                error: function () {
//                    alert("Failed to assign branch.");
//                }
//            });
//            debugger;
//            $("#branchProfiles").modal("hide");

//            var urlWithoutMessage = window.location.origin + window.location.pathname;
//            window.location.href = urlWithoutMessage + "?branchChange=False";
//        });
//    };




//    // Load branch profiles into table
//    function loadBranchProfiles() {
//        $.ajax({
//            url: '/Common/Home/LoadBranchProfiles',
//            type: 'GET',
//            dataType: 'json',
//            success: function (response) {
//                if (response && response.data) {

//                    var branchChanged = $("#hdnBranchChanged").val();
//                    if (branchChanged === "0") {
//                        $("#closeBtn").hide();
//                    }


//                    var tbody = $('#tbdBranchProfiles');
//                    tbody.empty();
//                    response.data.forEach(function (branch) {
//                        var row = `<tr>
//                            <td>${branch.Code}</td>
//                            <td>${branch.Name}</td>
//                            <td style="display: none;">${branch.UserId}</td>
//                        </tr>`;
//                        tbody.append(row);
//                    });

//                    $('#tBranchProfiles').DataTable({
//                        destroy: true,
//                        paging: true,
//                        searching: true,
//                        lengthMenu: [[5, 10, 25, -1], [5, 10, 25, "All"]],
//                        pageLength: 10,
//                    });
//                } else {
//                    alert('No data available.');
//                }
//            },
//            error: function () {
//                alert('Failed to fetch branch profiles.');
//            }
//        });
//    };

//    function checkDayEndData(branchCode) {
//        $.ajax({
//            url: '/Common/Home/HasDayEndData',
//            type: 'GET',
//            data: { branchId: branchCode },
//            dataType: 'json',
//            success: function (response) {
//                console.log(response);
//                if (response.Dates !== null && response.Dates.length > 0) {
//                    var message = response.Dates.join(", ") + " Day End Process is not complete.";
//                    ShowNotification(3, message);
//                }
//            },
//            error: function () {
//                alert("Error occurred while checking Day End data.");
//            }
//        });
//    }





//    return {
//        init: init,
//    };

//}();



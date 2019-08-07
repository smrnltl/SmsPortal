(function ($) {
    var itemsPerPage = 10;
    var pagePerDisplay = 5;
    var pageNo = 1;
    var $validator;

    var MessageGatewayAdmin = {
        init: function () {
            $('html body').on('click', '#btnResetFilter', function () {
                $('#txtNameFilter').val('');
                $('#ddlActiveFilter').val('2');

                MessageGatewayAdmin.getMessageGatewayList(1);
            });

            $('html body').on('click', '#btnAddNew', function () {
                MessageGatewayAdmin.showForm();
            });

            $('html body').on('click', '#btnCancel', function () {
                MessageGatewayAdmin.hideForm();
            });

            $('html body').on('click', '#btnSearch', function () {
                MessageGatewayAdmin.getMessageGatewayList(1);
            });

            $('html body').on('click', '#btnReset', function () {
                MessageGatewayAdmin.clearForm();
            });

            $('html body').on('click', '#btnSave', function () {
                if ($validator.form()) {
                    MessageGatewayAdmin.saveMessageGateway();
                }
            });

            $('html body').on('click', '.btnEditMessageGateway', function () {
                var id = $(this).attr('data-id');

                MessageGatewayAdmin.getMessageGatewayById(id);
            });

            $('html body').on('click', '.btnDeleteMessageGateway', function () {
                var id = $(this).attr('data-id');
                $.prompt("Are you sure you want to delete this Gateway?", {
                    title: "Please Confirm?",
                    buttons: { "Yes": true, "No": false },
                    submit: function (e, v, m, f) {
                        if (v) {
                            MessageGatewayAdmin.deleteMessageGateway(id);
                        }
                    }
                });
            });


            MessageGatewayAdmin.getMessageGatewayList(1);

            $validator = $("#messageGatewayForm").validate({
                rules: {
                    txtGatewayName: {
                        required: true
                    },
                    txtGatewayURL: {
                        required: true
                    },


                },
                //messages: {
                //    txtGatewayName: { required: "Gateway Name is required" },
                //}
            });

        },

        config: {
            baseUrl: '/Admin/'
            , dataType: 'json'
            , contentType: 'application/json; charset=utf-8'
        },

        ajaxCall: function (method, data, type, successCallback, failureCallback) {
            $.ajax({
                url: MessageGatewayAdmin.config.baseUrl + method
                , type: type
                , contentType: MessageGatewayAdmin.config.contentType
                , data: data
                , dataType: MessageGatewayAdmin.config.dataType
                , success: function (result) {
                    successCallback(result);
                }
                , error: function (xhr, s, e) {
                    MessageGatewayAdmin.failureCallback(xhr, s, e);
                }
            });
        },

        ajaxUploadCall: function (method, data, type, successCallback, failureCallback) {
            $.ajax({
                url: MessageGatewayAdmin.config.baseUrl + method
                , type: type
                , contentType: false
                , processData: false
                , data: data
                , success: function (result) {
                    successCallback(result);
                }
                , error: function (xhr, s, e) {
                    MessageGatewayAdmin.failureCallback(xhr, s, e);
                }
            });
        },

        failureCallback: function (xhr, s, e) {
            showMessage(e, 'error');
        },

        getMessageGatewayList: function (page) {
            MessageGatewayAdmin.ajaxCall('GetMessageGatewaysList', { pageNo: page, itemsPerPage: itemsPerPage, pagePerDisplay: pagePerDisplay }, 'GET', MessageGatewayAdmin.getMessageGatewayListSuccessCallback, MessageGatewayAdmin.failureCallback);
        },

        getMessageGatewayListSuccessCallback: function (results) {
            var html = '';
            if (results.data.length > 0) {
                html += '<table class="table table-striped table-bordered">';
                html += '<thead>';
                html += '<tr>';
                html += '<th scope="col">Gateway Name</th>';
                html += '<th scope="col">Gateway URL</th>';
                html += '<th scope="col">Active</th>';
                html += '<th scope="col">Actions</th>';
                html += '</tr>';
                html += '</thead>';
                html += '<tbody>';
                $.each(results.data, function (index, item) {
                    html += '<tr>';
                    html += '<td>' + item.gatewayName + '</td>';
                    html += '<td>' + item.gatewayURL + '</td>';
                    html += '<td>' + (item.isActive ? 'Yes' : 'No') + '</td>';
                    html += '<td><a href="javascript:void(0);" title="Edit" class="fa fa-edit btnEditMessageGateway" data-id="' + item.messageGatewayId + '"></a>&nbsp;&nbsp;';
                    html += '<a href="javascript:void(0);" title="Delete" class="fa fa-trash btnDeleteMessageGateway" data-id="' + item.messageGatewayId + '"></a> </td>';
                    html += '</tr>';    
                });

                html += '</tbody>';
                html += '</table>';

                MessageGatewayAdmin.bindPager(results.pager);
            }
            else {
                html += 'Could not find Gateway with respective search criteria';
                $('#divPager').hide();
            }

            $("#divData").html(html);

            MessageGatewayAdmin.hideForm();
        },

        saveMessageGateway: function () {
            var group = {
                MessageGatewayId: $('#hdnId').val(),
                GatewayName: $('#txtGatewayName').val(),
                GatewayURL: $('#txtGatewayURL').val(),
                GatewayPort: 0,
                IsActive: 1
            };

            MessageGatewayAdmin.ajaxCall('SaveMessageGateway', JSON.stringify(group), 'POST', MessageGatewayAdmin.saveMessageGatewaySuccessCallback, MessageGatewayAdmin.failureCallback);
        },

        saveMessageGatewaySuccessCallback: function (results) {
            if (results.isDbSuccess) {
                showMessage(results.dbMessage, 'success');
                MessageGatewayAdmin.getMessageGatewayList(1);
            }
            else {
                showMessage(results.dbMessage, 'error');
            }
        },

        getMessageGatewayById: function (id) {
            MessageGatewayAdmin.ajaxCall('GetMessageGatewayById', { messageGatewayId: id }, 'GET', MessageGatewayAdmin.getMessageGatewayByIdSuccessCallback, MessageGatewayAdmin.failureCallback);
        },

        getMessageGatewayByIdSuccessCallback: function (results) {
            MessageGatewayAdmin.showForm();

            var gateway = results;
            $('#hdnId').val(gateway.messageGatewayId);
            $('#txtGatewayName').val(gateway.gatewayName);
            $('#txtGatewayURL').val(gateway.gatewayURL);
            //('#chkIsActive').prop('checked', group.isActive);
        },

        deleteMessageGateway: function (id) {
            MessageGatewayAdmin.ajaxCall('DeleteMessageGateway', { messageGatewayId: id }, 'GET', MessageGatewayAdmin.deleteMessageGatewaySuccessCallback, MessageGatewayAdmin.failureCallback);
        },

        deleteMessageGatewaySuccessCallback: function (results) {
            if (results.isDbSuccess) {
                showMessage(results.dbMessage, 'success');
                MessageGatewayAdmin.getMessageGatewayList(pageNo);
            }
            else
                showMessage(results.dbMessage, 'error');
        },

        clearForm: function () {
            $('#hdnId').val('0');
            $('#txtGatewayName').val('');
            $('#txtGatewayURL').val('');
            //$('#txtGatewayName').val('');
            //$('#chkIsActive').prop('checked', false);

            $validator.resetForm();
        },

        showForm: function () {
            MessageGatewayAdmin.clearForm();
            $('#btnAddNew').hide();
            $('#search-filter').hide();
            $('#data-container').hide();
            $('#data-form').show();

            $('.breadcrumb li.active').text('Gateway Form');
        },

        hideForm: function () {
            $('#data-form').hide();
            $('#btnAddNew').show();
            $('#search-filter').show();
            $('#data-container').show();

            $('.breadcrumb li.active').text('Gateway List');

            MessageGatewayAdmin.clearForm();
        },

        bindPager: function (pager) {
            pageNo = pager.pageNo;
            $('#divPager').pagination({
                pageNo: pager.pageNo
                , itemsPerPage: pager.itemsPerPage
                , pagePerDisplay: pager.pagePerDisplay
                , totalNextPages: pager.totalNextPages
                , callback: MessageGatewayAdmin.getMessageGatewayList
            });
            $('#divPager').show();
        }
    
    };

    MessageGatewayAdmin.init();
})(jQuery);
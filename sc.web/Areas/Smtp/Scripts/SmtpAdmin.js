(function ($) {
    var itemsPerPage = 10;
    var pagePerDisplay = 5;
    var pageNo = 1;
    var $validator;

    var SmtpAdmin = {
        init: function () {

            $('html body').on('click', '#btnAddNew', function () {
                SmtpAdmin.showForm();
            });

            $('html body').on('click', '#btnCancel', function () {
                SmtpAdmin.hideForm();
            });

           $('html body').on('click', '#btnReset', function () {
                SmtpAdmin.clearForm();
            });

            $('html body').on('click', '#btnSave', function () {
                if ($validator.form()) {
                    SmtpAdmin.saveSmtp();
                }
            });

            $('html body').on('click', '.btnEditSmtp', function () {
                var id = $(this).attr('id');

                SmtpAdmin.getSmtpById(id);
            });

            SmtpAdmin.getSmtpList(1);

            $validator = $("#smtpForm").validate({
                rules: {
                    txtHostName: {
                        required: true
                    },
                    txtPortNo: {
                        required: true
                    },
                    txtFromAddress: {
                        required: true,
                        email:true
                    },
                    txtPassword: {
                        required: true
                    },
                    txtToAddress: {
                        required: true,
                        email:true
                    }


                },
                messages: {
                    txtHostName: "Host Name is required",
                    txtPortNo: "Port No is required",
                    txtFromAddress: {
                        required: "From Address is required",
                        email:'Invalid email address'
                    },
                    txtPassword: "Password is required",
                    txtToAddress: {
                        required: "To Address is required",
                        email: 'Invalid email address'
                    },
                }
            });
        },

        config: {
            baseUrl: '/Admin/'
            , dataType: 'json'
            , contentType: 'application/json; charset=utf-8'
        },

        ajaxCall: function (method, data, type, successCallback, failureCallback) {
            $.ajax({
                url: SmtpAdmin.config.baseUrl + method
                , type: type
                , contentType: SmtpAdmin.config.contentType
                , data: data
                , dataType: SmtpAdmin.config.dataType
                , success: function (result) {
                    successCallback(result);
                }
                , error: function (xhr, s, e) {
                    SmtpAdmin.failureCallback(xhr, s, e);
                }
            });
        },

        failureCallback: function (xhr, s, e) {
            showMessage(e, 'error');
        },

        getSmtpList: function (page) {
            SmtpAdmin.ajaxCall('GetSmtp', { pageNo: page, itemsPerPage: itemsPerPage, pagePerDisplay: pagePerDisplay }, 'GET', SmtpAdmin.getSmtpListSuccessCallback, SmtpAdmin.failureCallback);
        },

        getSmtpListSuccessCallback: function (results) {
            var html = '';
            if (results!=null) {
                var item = results;
                html += '<table class="table table-striped table-bordered">';
                html += '<thead>';
                html += '<tr>';
                html += '<th scope="col">Host name</th>';
                html += '<th scope="col">From Address</th>';
                html += '<th scope="col">To Address</th>';
                html += '<th scope="col">Actions</th>';
                html += '</tr>';
                html += '</thead>';
                html += '<tbody>';
                //$.each(results.data, function (index, item) {
                    html += '<tr>';
                    html += '<td>' + item.hostName + '</td>';
                    html += '<td>' + item.fromAddress + '</td>';
                    html += '<td>' + item.toAddress + '</td>';
                    html += '<td><a href="javascript:void(0);" class="fa fa-edit btnEditSmtp" id="' + item.id + '"></a>&nbsp;&nbsp;<a href="javascript:void(0);" class="fa fa-trash btnDeleteSmtp" id="' + item.id + '"></a> </td>';
                    html += '</tr>';
                //});

                html += '</tbody>';
                html += '</table>';

            }
            else {
                html += 'Could not find SMTP Configuration.';
            }

            $("#divData").html(html);

            SmtpAdmin.hideForm();

            if (results != null) {
                $('#btnAddNew').hide();
            }
        },

        saveSmtp: function () {
            var smtp = {
                id: $('#hdnId').val(),
                hostName: $('#txtHostName').val(),
                portNo: $('#txtPortNo').val(),
                enableSsl: $('#chkEnableSsl').is(':checked'),
                useAuthentication: $('#chkUseAuth').is(':checked'),
                displayName:$('#txtDisplayName').val(),
                fromAddress: $('#txtFromAddress').val(),
                password: $('#txtPassword').val(),
                toAddress: $('#txtToAddress').val()
            }

            SmtpAdmin.ajaxCall('SaveSmtp', JSON.stringify(smtp), 'POST', SmtpAdmin.saveSmtpSuccessCallback, SmtpAdmin.failureCallback);
        },

        saveSmtpSuccessCallback: function (results) {
            if (results.isDbSuccess) {
                showMessage('Smtp saved successfully', 'success');
                SmtpAdmin.getSmtpList(1);
            }
            else {
                showMessage(results.dbMessage, 'error');
            }
        },

        getSmtpById: function (id) {
            SmtpAdmin.ajaxCall('GetSmtp', { id: id }, 'GET', SmtpAdmin.getSmtpByIdSuccessCallback, SmtpAdmin.failureCallback);
        },

        getSmtpByIdSuccessCallback: function (results) {
            SmtpAdmin.showForm();

            var smtp = results;
            $('#hdnId').val(smtp.id);
            $('#txtHostName').val(smtp.hostName);
            $('#txtPortNo').val(smtp.portNo);
            $('#chkEnableSsl').prop('checked', smtp.enableSSL);
            $('#txtDisplayName').val(smtp.displayName);
            $('#chkUseAuth').prop('checked', smtp.useAuthentication);
            $('#txtFromAddress').val(smtp.fromAddress);
            $('#txtPassword').val(smtp.password);
            $('#txtToAddress').val(smtp.toAddress);
        },

        clearForm: function () {
            $('#hdnId').val('0');
            $('#txtHostName').val('');
            $('#txtPortNo').val('');
            $('#chkEnableSsl').prop('checked',false),
            $('#chkUseAuth').prop('checked', false),
            $('#txtDisplayName').val('');
            $('#txtFromAddress').val(''),
            $('#txtPassword').val(''),
            $('#txtToAddress').val('')

            $validator.resetForm()
        },

        showForm: function () {
            SmtpAdmin.clearForm();
            $('#btnAddNew').hide();
            $('#search-filter').hide();
            $('#data-container').hide();
            $('#data-form').show();

            $('.breadcrumb li.active').text('Smtp Form');
        },

        hideForm: function () {
            $('#data-form').hide();
            $('#btnAddNew').show();
            $('#search-filter').show();
            $('#data-container').show();
            $('.breadcrumb li.active').text('Smtp List');

            SmtpAdmin.clearForm();
        }
    }

    SmtpAdmin.init();
})(jQuery);
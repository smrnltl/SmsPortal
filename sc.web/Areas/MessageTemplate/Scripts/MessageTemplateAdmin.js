(function ($) {
    var itemsPerPage = 10;
    var pagePerDisplay = 5;
    var pageNo = 1;
    var $validator;

    var MessageTemplateAdmin = {
        init: function () {
            $('html body').on('click', '#btnResetFilter', function () {
                $('#txtNameFilter').val('');
                $('#ddlActiveFilter').val('2');

                MessageTemplateAdmin.getMessageTemplateList(1);
            });

            $('html body').on('click', '#btnAddNew', function () {
                MessageTemplateAdmin.showForm();
            });

            $('html body').on('click', '#btnCancel', function () {
                MessageTemplateAdmin.hideForm();
            });

            $('html body').on('click', '#btnSearch', function () {
                MessageTemplateAdmin.getMessageTemplateList(1);
            });

            $('html body').on('click', '#btnReset', function () {
                MessageTemplateAdmin.clearForm();
            });

            $('html body').on('click', '#btnSave', function () {
                if ($validator.form()) {
                    MessageTemplateAdmin.saveMessageTemplate();
                }
            });

            $('html body').on('click', '.btnEditMessageTemplate', function () {
                var id = $(this).attr('data-id');

                MessageTemplateAdmin.getMessageTemplateById(id);
            });

            $('html body').on('click', '.btnDeleteMessageTemplate', function () {
                var id = $(this).attr('data-id');
                $.prompt("Are you sure you want to delete this Template?", {
                    title: "Please Confirm?",
                    buttons: { "Yes": true, "No": false },
                    submit: function (e, v, m, f) {
                        if (v) {
                            MessageTemplateAdmin.deleteMessageTemplate(id);
                        }
                    }
                });
            });


            MessageTemplateAdmin.getMessageTemplateList(1);

            $validator = $("#messageTemplateForm").validate({
                rules: {
                    txtTemplateName: {
                        required: true
                    },
                    txtDescription: {
                        required: true
                    },


                },
            });

        },

        config: {
            baseUrl: '/Admin/'
            , dataType: 'json'
            , contentType: 'application/json; charset=utf-8'
        },

        ajaxCall: function (method, data, type, successCallback, failureCallback) {
            $.ajax({
                url: MessageTemplateAdmin.config.baseUrl + method
                , type: type
                , contentType: MessageTemplateAdmin.config.contentType
                , data: data
                , dataType: MessageTemplateAdmin.config.dataType
                , success: function (result) {
                    successCallback(result);
                }
                , error: function (xhr, s, e) {
                    MessageTemplateAdmin.failureCallback(xhr, s, e);
                }
            });
        },

        ajaxUploadCall: function (method, data, type, successCallback, failureCallback) {
            $.ajax({
                url: MessageTemplateAdmin.config.baseUrl + method
                , type: type
                , contentType: false
                , processData: false
                , data: data
                , success: function (result) {
                    successCallback(result);
                }
                , error: function (xhr, s, e) {
                    MessageTemplateAdmin.failureCallback(xhr, s, e);
                }
            });
        },

        failureCallback: function (xhr, s, e) {
            showMessage(e, 'error');
        },

        getMessageTemplateList: function (page) {
            var name = $('#txtNameFilter').val().trim();
            var isActive = $('#ddlActiveFilter').val();
            MessageTemplateAdmin.ajaxCall('GetMessageTemplatesList',
                { templateName: name, isActive: isActive, pageNo: page, itemsPerPage: itemsPerPage, pagePerDisplay: pagePerDisplay },
                'GET', MessageTemplateAdmin.getMessageTemplateListSuccessCallback, MessageTemplateAdmin.failureCallback);
        },

        getMessageTemplateListSuccessCallback: function (results) {
            var html = '';
            if (results.data.length > 0) {
                html += '<table class="table table-striped table-bordered">';
                html += '<thead>';
                html += '<tr>';
                html += '<th scope="col">Template Name</th>';
                html += '<th scope="col">Active</th>';
                html += '<th scope="col">Actions</th>';
                html += '</tr>';
                html += '</thead>';
                html += '<tbody>';
                $.each(results.data, function (index, item) {
                    html += '<tr>';
                    html += '<td>' + item.templateName + '</td>';
                    html += '<td>' + (item.isActive ? 'Yes' : 'No') + '</td>';
                    html += '<td><a href="javascript:void(0);" title="Edit" class="fa fa-edit btnEditMessageTemplate" data-id="' + item.messageTemplateId + '"></a>&nbsp;&nbsp;';
                    html += '<a href="javascript:void(0);" title="Delete" class="fa fa-trash btnDeleteMessageTemplate" data-id="' + item.messageTemplateId + '"></a> </td>';
                    html += '</tr>';    
                });

                html += '</tbody>';
                html += '</table>';

                MessageTemplateAdmin.bindPager(results.pager);
            }
            else {
                html += 'Could not find Template with respective search criteria';
                $('#divPager').hide();
            }

            $("#divData").html(html);

            MessageTemplateAdmin.hideForm();
        },

        saveMessageTemplate: function () {
            var group = {
                MessageTemplateId: $('#hdnId').val(),
                TemplateName: $('#txtTemplateName').val(),
                Description: $('#txtDescription').val(),
                IsActive: 1
            };

            MessageTemplateAdmin.ajaxCall('SaveMessageTemplate', JSON.stringify(group), 'POST', MessageTemplateAdmin.saveMessageTemplateSuccessCallback, MessageTemplateAdmin.failureCallback);
        },

        saveMessageTemplateSuccessCallback: function (results) {
            if (results.isDbSuccess) {
                showMessage(results.dbMessage, 'success');
                MessageTemplateAdmin.getMessageTemplateList(1);
            }
            else {
                showMessage(results.dbMessage, 'error');
            }
        },

        getMessageTemplateById: function (id) {
            MessageTemplateAdmin.ajaxCall('GetMessageTemplateById', { messageTemplateId: id }, 'GET', MessageTemplateAdmin.getMessageTemplateByIdSuccessCallback, MessageTemplateAdmin.failureCallback);
        },

        getMessageTemplateByIdSuccessCallback: function (results) {
            MessageTemplateAdmin.showForm();

            var template = results;
            $('#hdnId').val(template.messageTemplateId);
            $('#txtTemplateName').val(template.templateName);
            $('#txtDescription').val(template.description);
            $('#chkIsActive').prop('checked', template.isActive);
        },

        deleteMessageTemplate: function (id) {
            MessageTemplateAdmin.ajaxCall('DeleteMessageTemplate', { messageTemplateId: id }, 'GET', MessageTemplateAdmin.deleteMessageTemplateSuccessCallback, MessageTemplateAdmin.failureCallback);
        },

        deleteMessageTemplateSuccessCallback: function (results) {
            if (results.isDbSuccess) {
                showMessage(results.dbMessage, 'success');
                MessageTemplateAdmin.getMessageTemplateList(pageNo);
            }
            else
                showMessage(results.dbMessage, 'error');
        },

        clearForm: function () {
            $('#hdnId').val('0');
            $('#txtTemplateName').val('');
            $('#txtDescription').val('');
            $('#chkIsActive').prop('checked', false);

            $validator.resetForm();
        },

        showForm: function () {
            MessageTemplateAdmin.clearForm();
            $('#btnAddNew').hide();
            $('#search-filter').hide();
            $('#data-container').hide();
            $('#data-form').show();

            $('.breadcrumb li.active').text('Template Form');
        },

        hideForm: function () {
            $('#data-form').hide();
            $('#btnAddNew').show();
            $('#search-filter').show();
            $('#data-container').show();

            $('.breadcrumb li.active').text('Template List');

            MessageTemplateAdmin.clearForm();
        },

        bindPager: function (pager) {
            pageNo = pager.pageNo;
            $('#divPager').pagination({
                pageNo: pager.pageNo
                , itemsPerPage: pager.itemsPerPage
                , pagePerDisplay: pager.pagePerDisplay
                , totalNextPages: pager.totalNextPages
                , callback: MessageTemplateAdmin.getMessageTemplateList
            });
            $('#divPager').show();
        }
    
    };

    MessageTemplateAdmin.init();
})(jQuery);
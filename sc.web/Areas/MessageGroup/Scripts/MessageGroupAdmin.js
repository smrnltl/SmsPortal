(function ($) {
    var itemsPerPage = 10;
    var pagePerDisplay = 5;
    var pageNo = 1;
    var $validator;

    var MessageGroupAdmin = {
        init: function () { 
            $('body').click(function (event) {
                if (!$('.btnOptions').is(event.target) && $('.btnOptions').has(event.target).length === 0) {
                    $('.dropdown-options-menu-content').hide();
                }
            });

            $('html body').on('click', '#btnResetFilter', function () {
                $('#txtNameFilter').val('');
                $('#ddlActiveFilter').val('2');

                MessageGroupAdmin.getMessageGroupList(1);
            });

            $('html body').on('click', '#btnAddNew', function () {
                MessageGroupAdmin.showForm();
            });

            $('html body').on('click', '#btnCancel', function () {
                MessageGroupAdmin.hideForm();
            });

            $('html body').on('click', '#btnSearch', function () {
                MessageGroupAdmin.getMessageGroupList(1);
            });

            $('html body').on('click', '#btnReset', function () {
                MessageGroupAdmin.clearForm();
            });

            $('html body').on('click', '#btnSave', function () {
                if ($validator.form()) {
                    MessageGroupAdmin.saveMessageGroup();
                }
            });

            $('html body').on('click', '.btnEditMessageGroup', function () {
                var id = $(this).attr('data-id');

                MessageGroupAdmin.getMessageGroupById(id);
            });

            $('html body').on('click', '.btnDeleteMessageGroup', function () {
                var ids = [];
                ids.push($(this).attr('data-id'));
                $.prompt("Are you sure you want to delete this Group and all associated Persons?", {
                    title: "Please Confirm?",
                    buttons: { "Yes": true, "No": false },
                    submit: function (e, v, m, f) {
                        if (v) {
                            MessageGroupAdmin.deleteMessageGroup(ids);
                        }
                    }
                });
            });

            $('html body').on('click', '.btnOptions', function () {
                $('.dropdown-options-menu-content').toggle();
            });

            $('html body').on('click', '#optionBulkDelete', function () {
                $('.btnOptions').hide();
                $('.btnBulkDelete').show();
                $('.btnBulkDeleteCancel').show();
                $('.chkDelete').show();
                $('.btnEditMessageGroup').hide();
                $('.btnDeleteMessageGroup').hide();
            });

            $('html body').on('click', '.btnBulkDeleteCancel', function () {
                $('.btnOptions').show();
                $('.btnBulkDelete').hide();
                $('.btnBulkDeleteCancel').hide();
                $('.chkDelete').prop('checked', false).hide();
                $('.btnEditMessageGroup').show();
                $('.btnDeleteMessageGroup').show();
            });

            $('html body').on('click', '.btnBulkDelete', function () {
                var ids = [];
                $('.chkDelete:checked').each(function () {
                    var a = $(this).attr('data-id');
                    ids.push(a);
                });
                if (ids.length > 0) {
                    $.prompt("Are you sure you want to delete all " + ids.length + " selected Groups?", {
                        title: "Please Confirm?",
                        buttons: { "Yes": true, "No": false },
                        submit: function (e, v, m, f) {
                            if (v) {
                                MessageGroupAdmin.deleteMessageGroup(ids);
                            }
                        }
                    });
                } else {
                    showMessage('Please select at least a group to delete!', 'error');
                }

            });


            MessageGroupAdmin.getMessageGroupList(1);

            $validator = $("#messageGroupForm").validate({
                rules: {
                    txtGroupName: {
                        required: true
                    },

                },
                messages: {
                    txtGroupName: { required: "Group Name is required" },
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
                url: MessageGroupAdmin.config.baseUrl + method
                , type: type
                , contentType: MessageGroupAdmin.config.contentType
                , data: data
                , dataType: MessageGroupAdmin.config.dataType
                , success: function (result) {
                    successCallback(result);
                }
                , error: function (xhr, s, e) {
                    MessageGroupAdmin.failureCallback(xhr, s, e);
                }
            });
        },

        ajaxUploadCall: function (method, data, type, successCallback, failureCallback) {
            $.ajax({
                url: MessageGroupAdmin.config.baseUrl + method
                , type: type
                , contentType: false
                , processData: false
                , data: data
                , success: function (result) {
                    successCallback(result);
                }
                , error: function (xhr, s, e) {
                    MessageGroupAdmin.failureCallback(xhr, s, e);
                }
            });
        },

        failureCallback: function (xhr, s, e) {
            showMessage(e, 'error');
        },

        getMessageGroupList: function (page) {
            var groupName = $('#txtNameFilter').val().trim();
            var active = $('#ddlActiveFilter').val();
            MessageGroupAdmin.ajaxCall('GetMessageGroups', { groupName: groupName, isActive: active, pageNo: page, itemsPerPage: itemsPerPage, pagePerDisplay: pagePerDisplay }, 'GET', MessageGroupAdmin.getMessageGroupListSuccessCallback, MessageGroupAdmin.failureCallback);
        },

        getMessageGroupListSuccessCallback: function (results) {
            var html = '';
            if (results.data.length > 0) {
                $('#data-container #listName').text('Group List (' + results.pager.totalCount + ')');

                html += '<table class="table table-striped table-bordered">';
                html += '<thead>';
                html += '<tr>';
                html += '<th scope="col">S.No.</th>';
                html += '<th scope="col">Group Name</th>';
                html += '<th scope="col">Active</th>';

                html += '<th scope="col" id="thActions">Actions';
                html += '<a href="javascript:void(0);" title="Bulk Delete" class="fa fa-trash btnBulkDelete" style="display:none;"></a>';
                html += '<a href="javascript:void(0);" title="Cancel" class="fa fa-times btnBulkDeleteCancel" style="display:none;"></a>';
                html += '<div class="dropdown-options-menu btnOptions">';
                html += '<a href="javascript:void(0);" title="Options" class="fa fa-ellipsis-v" style="color:white;"></a>';
                html += '<div class="dropdown-options-menu-content">';
                html += '<a href="javascript:void(0);" id="optionBulkDelete">Bulk Delete</a>';
                html += '</div>';
                html += '</div>';
                html += '</th>';

                html += '</tr>';
                html += '</thead>';
                html += '<tbody>';
                $.each(results.data, function (index, item) {
                    html += '<tr>';
                    html += '<td>' + item.rowNo + '</td>';
                    html += '<td>' + item.groupName + '</td>';
                    html += '<td>' + (item.isActive ? 'Yes' : 'No') + '</td>';

                    html += '<td>';
                    html += '<a href="javascript:void(0);" title="Edit" class="fa fa-edit btnEditMessageGroup" data-id="' + item.groupId + '"></a>&nbsp;&nbsp;';
                    html += '<a href="javascript:void(0);" title="Delete" class="fa fa-trash btnDeleteMessageGroup" data-id="' + item.groupId + '"></a>';
                    html += '<input type="checkbox" class="chkDelete" data-id="' + item.groupId + '" style="display:none;" />';
                    html += '</td>';

                    html += '</tr>';
                });

                html += '</tbody>';
                html += '</table>';

                MessageGroupAdmin.bindPager(results.pager);
            }
            else {
                html += 'Could not find Group with respective search criteria';
                $('#divPager').hide();
            }

            $("#divData").html(html);

            MessageGroupAdmin.hideForm();
        },

        saveMessageGroup: function () {
            var group = {
                GroupId: $('#hdnId').val(),
                GroupName: $('#txtGroupName').val(),
                IsActive: $('#chkIsActive').is(':checked')
            };

            MessageGroupAdmin.ajaxCall('SaveMessageGroup', JSON.stringify(group), 'POST', MessageGroupAdmin.saveMessageGroupSuccessCallback, MessageGroupAdmin.failureCallback);
        },

        saveMessageGroupSuccessCallback: function (results) {
            if (results.isDbSuccess) {
                showMessage(results.dbMessage, 'success');
                MessageGroupAdmin.getMessageGroupList(1);
            }
            else {
                showMessage(results.dbMessage, 'error');
            }
        },

        getMessageGroupById: function (id) {
            MessageGroupAdmin.ajaxCall('GetMessageGroupById', { id: id }, 'GET', MessageGroupAdmin.getMessageGroupByIdSuccessCallback, MessageGroupAdmin.failureCallback);
        },

        getMessageGroupByIdSuccessCallback: function (results) {
            MessageGroupAdmin.showForm();

            var group = results;
            $('#hdnId').val(group.groupId);
            $('#txtGroupName').val(group.groupName);
            $('#chkIsActive').prop('checked', group.isActive);
        },

        deleteMessageGroup: function (ids) {
            ids = convertStrArrToIntArr(ids);
            MessageGroupAdmin.ajaxCall('DeleteMessageGroup', JSON.stringify(ids), 'POST', MessageGroupAdmin.deleteMessageGroupSuccessCallback, MessageGroupAdmin.failureCallback);
        },

        deleteMessageGroupSuccessCallback: function (results) {
            if (results.isDbSuccess) {
                showMessage(results.dbMessage, 'success');
                MessageGroupAdmin.getMessageGroupList(pageNo);
            }
            else
                showMessage(results.dbMessage, 'error');
        },

        clearForm: function () {
            $('#hdnId').val('0');
            $('#txtGroupName').val('');
            $('#chkIsActive').prop('checked', true);

            $validator.resetForm();
        },

        showForm: function () {
            MessageGroupAdmin.clearForm();
            $('#btnAddNew').hide();
            $('#search-filter').hide();
            $('#data-container').hide();
            $('#data-form').show();

            $('.breadcrumb li.active').text('Group Form');
        },

        hideForm: function () {
            $('#data-form').hide();
            $('#btnAddNew').show();
            $('#search-filter').show();
            $('#data-container').show();

            $('.breadcrumb li.active').text('Group List');

            MessageGroupAdmin.clearForm();
        },

        bindPager: function (pager) {
            pageNo = pager.pageNo;
            $('#divPager').pagination({
                pageNo: pager.pageNo
                , itemsPerPage: pager.itemsPerPage
                , pagePerDisplay: pager.pagePerDisplay
                , totalNextPages: pager.totalNextPages
                , callback: MessageGroupAdmin.getMessageGroupList
            });
            $('#divPager').show();
        }
    
    };

    MessageGroupAdmin.init();
})(jQuery);
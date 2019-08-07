(function ($) {
    var itemsPerPage = 20;
    var pagePerDisplay = 10;
    var pageNo = 1;
    var $validator;

    var PortalAdmin = {
        init: function () {
            $('body').click(function (event) {
                if (!$('.btnOptions').is(event.target) && $('.btnOptions').has(event.target).length === 0) {
                    $('.dropdown-options-menu-content').hide();
                }
            });

            loadMultiSumoSelect('ddlPerson');
            $('html body').on('click', '#btnResetFilter', function () {
                $('#txtPersonNameFilter').val('');
                $('#txtMobileFilter').val('');
                $('#ddlSentFilter').val('2');
                $('#ddlGroupFilter').val('-1');

                PortalAdmin.getPortalList(1);
            });

            $('html body').on('click', '#btnSendMsg', function () {
                PortalAdmin.showForm();
            });

            $('html body').on('click', '#btnCancel', function () {
                PortalAdmin.hideForm();
                PortalAdmin.getPortalList(1);
            });

            $('html body').on('click', '#btnSearch', function () {
                PortalAdmin.getPortalList(1);
            });

            $('html body').on('click', '#btnReset', function () {
                PortalAdmin.clearForm();
            });

            $('html body').on('click', '#btnSave', function () {
                if ($validator.form()) {
                    $('.preloader').show();
                    PortalAdmin.savePortalGroup();
                }
            });

            $('html body').on('click', '.btnResendMessage', function () {
                var id = $(this).attr('data-id');
                $.prompt("Are you sure you want to send the message?", {
                    title: "Please Confirm?",
                    buttons: { "Yes": true, "No": false },
                    submit: function (e, v, m, f) {
                        if (v) {
                            $('.preloader').show();
                            PortalAdmin.savePortalPerson(id);
                        }
                    }
                });
            });

            $('html body').on('click', '.btnDeletePortal', function () {
                var ids = [];
                ids.push($(this).attr('data-id'));
                $.prompt("Are you sure you want to delete this Message?", {
                    title: "Please Confirm?",
                    buttons: { "Yes": true, "No": false },
                    submit: function (e, v, m, f) {
                        if (v) {
                            PortalAdmin.deletePortal(ids);
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
                $('.btnDeletePortal').hide();
                $('.btnResendMessage').hide();
            });

            $('html body').on('click', '.btnBulkDeleteCancel', function () {
                $('.btnOptions').show();
                $('.btnBulkDelete').hide();
                $('.btnBulkDeleteCancel').hide();
                $('.chkDelete').prop('checked', false).hide();
                $('.btnDeletePortal').show();
                $('.btnResendMessage').show();
            });

            $('html body').on('click', '.btnBulkDelete', function () {
                var ids = [];
                $('.chkDelete:checked').each(function () {
                    var a = $(this).attr('data-id');
                    ids.push(a);
                });
                if (ids.length > 0) {
                    $.prompt("Are you sure you want to delete all " + ids.length + " selected Messages?", {
                        title: "Please Confirm?",
                        buttons: { "Yes": true, "No": false },
                        submit: function (e, v, m, f) {
                            if (v) {
                                PortalAdmin.deletePortal(ids);
                            }
                        }
                    });
                } else {
                    showMessage('Please select at least a message to delete!', 'error');
                }

            });

            PortalAdmin.getMessageGroups();
            PortalAdmin.getMessageGateways();
            PortalAdmin.getMessageTypes();
            PortalAdmin.getMessageTemplates();
            PortalAdmin.getPortalList(1);

            $('html body').on('change', '#ddlGroup', function () {
                PortalAdmin.getPersonList();
            });

            $validator = $("#portalForm").validate({
                rules: {
                    ddlMessageType: {
                        required: true
                    },
                    ddlMessageGateway: {
                        required: true
                    },
                    //ddlGroup: {
                    //    dropdownRequired: true
                    //},
                    ddlPerson: {
                        required: true
                    },
                    txtMessage: {
                        required: true,
                        maxlength: 160
                    },
                },
                messages: {

                },
                errorPlacement: function (error, element) {
                    var eName = element.attr('name');
                    if (eName === 'ddlPerson')
                        error.appendTo('.sumo_ddlPerson');
                    else
                        error.insertAfter(element);
                }
            });

            //$.validator.addMethod("dropdownRequired", function (value, element) {
            //    return value > 0;
            //}, "Required");

            $('html body').on('change', '#ddlMessageTemplate', function () {
               ($(this).val() > 0) ? $('#txtMessage').val($(this).find('option:selected').attr('data-desc')) : $('#txtMessage').val('');
            });
        },

        config: {
            baseUrl: '/Admin/'
            , dataType: 'json'
            , contentType: 'application/json; charset=utf-8'
        },

        ajaxCall: function (method, data, type, successCallback, failureCallback) {
            $.ajax({
                url: PortalAdmin.config.baseUrl + method
                , type: type
                , contentType: PortalAdmin.config.contentType
                , data: data
                , dataType: PortalAdmin.config.dataType
                , success: function (result) {
                    successCallback(result);
                }
                , error: function (xhr, s, e) {
                    PortalAdmin.failureCallback(xhr, s, e);
                }
            });
        },

        ajaxUploadCall: function (method, data, type, successCallback, failureCallback) {
            $.ajax({
                url: PortalAdmin.config.baseUrl + method
                , type: type
                , contentType: false
                , processData: false
                , data: data
                , success: function (result) {
                    successCallback(result);
                }
                , error: function (xhr, s, e) {
                    PortalAdmin.failureCallback(xhr, s, e);
                }
            });
        },

        failureCallback: function (xhr, s, e) {
            $('.preloader').hide();
            showMessage(e, 'error');
        },

        getPortalList: function (page) {
            var personName = $('#txtPersonNameFilter').val().trim();
            var mobile = $('#txtMobileFilter').val().trim();
            var sentFilter = $('#ddlSentFilter').val();
            var groupId = $('#ddlGroupFilter').val();

            PortalAdmin.ajaxCall('GetPortals',
                {
                    personName: personName,
                    mobile: mobile,
                    isSent: sentFilter,
                    groupId: groupId,
                    pageNo: page,
                    itemsPerPage: itemsPerPage,
                    pagePerDisplay: pagePerDisplay
                },
                'GET', PortalAdmin.getPortalListSuccessCallback, PortalAdmin.failureCallback);
        },

        getPortalListSuccessCallback: function (results) {
            var html = '';
            if (results.data.length > 0) {
                $('#data-container #listName').text('Message List (' + results.pager.totalCount + ')');

                html += '<table class="table table-striped table-bordered">';
                html += '<thead>';
                html += '<tr>';
                html += '<th scope="col">S.No.</th>';
                html += '<th scope="col">Person</th>';
                html += '<th scope="col">Mobile</th>';
                html += '<th scope="col">Group</th>';
                html += '<th scope="col">Message Text</th>';
                html += '<th scope="col">Message Status</th>';

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
                    var messageText = item.messageText, groupId = item.groupId;
                    var groupName = ((groupId === 0) ? 'Individual' : item.groupName);
                    if (messageText !== null) messageText = (messageText.length > 30) ? (messageText.substr(0, 30) + '..') : messageText;
                    html += '<tr>';
                    html += '<td>' + item.rowNo + '</td>';
                    html += '<td>' + item.personName + '</td>';
                    html += '<td>' + item.mobile + '</td>';
                    html += '<td>' + groupName + '</td>';
                    html += '<td>' + messageText + '</td>';
                    html += '<td>' + (item.isSent ? 'Sent' : 'Not Sent') + '</td>';

                    html += '<td>';
                    html += '<a href="javascript:void(0);" title="Resend Message" class="fa fa-envelope btnResendMessage" data-id="' + item.messagePortalPersonId + '">&nbsp';
                    html += '<a href="javascript:void(0);" title="Delete" class="fa fa-trash btnDeletePortal" data-id="' + item.messagePortalPersonId + '"></a>';
                    html += '<input type="checkbox" class="chkDelete" data-id="' + item.messagePortalPersonId + '" style="display:none;" />';
                    html += '</td>';

                    html += '</tr>';
                });

                html += '</tbody>';
                html += '</table>';

                PortalAdmin.bindPager(results.pager);
            }
            else {
                html += 'Could not find Message with respective search criteria';
                $('#divPager').hide();
            }

            $("#divData").html(html);

            PortalAdmin.hideForm();
        },

        savePortalGroup: function () {
            var persons = [];
            var p = $('#ddlPerson').val();
            persons = convertStrArrToIntArr(p);
            var data = {
                MessagePortalGroupId: 0,
                MessageTypeId: $('#ddlMessageType').val(),
                MessageGatewayId: $('#ddlMessageGateway').val(),
                GroupId: $('#ddlGroup').val(),
                Persons: persons,
                IsSent: false,
                MessageText: $('#txtMessage').val().trim()
            };

            PortalAdmin.ajaxCall('SavePortalGroup', JSON.stringify(data), 'POST', PortalAdmin.savePortalGroupSuccessCallback, PortalAdmin.failureCallback);
        },

        savePortalGroupSuccessCallback: function (results) {
            if (results.isDbSuccess) {
                PortalAdmin.getPortalList(1);
                showMessage("Message Sent Successfully", 'success');
            }
            else {
                showMessage(results.dbMessage, 'error');
            }
            $('.preloader').hide();

        },

        clearForm: function () {
            $('#hdnId').val('0');
            $('#ddlGroup').val('0').trigger('change');
            $('#ddlPerson').val('');
            $('#ddlMessageGateway').val('');
            $('#txtMessage').val('');
            $validator.resetForm();
        },

        showForm: function () {
            PortalAdmin.clearForm();
            $('#btnSendMsg').hide();
            $('#search-filter').hide();
            $('#data-container').hide();
            $('#data-form').show();
            $('.breadcrumb li.active').text('Portal Form');
        },

        hideForm: function () {
            $('#data-form').hide();
            $('#btnSendMsg').show();
            $('#search-filter').show();
            $('#data-container').show();

            $('.breadcrumb li.active').text('Portal List');

            PortalAdmin.clearForm();
        },

        bindPager: function (pager) {
            pageNo = pager.pageNo;
            $('#divPager').pagination({
                pageNo: pager.pageNo
                , itemsPerPage: pager.itemsPerPage
                , pagePerDisplay: pager.pagePerDisplay
                , totalNextPages: pager.totalNextPages
                , callback: PortalAdmin.getPortalList
            });
            $('#divPager').show();
        },

        getMessageGroups: function (id) {
            PortalAdmin.ajaxCall('GetMessageGroupsForDDL', {}, 'GET', PortalAdmin.getMessageGroupsSuccessCallback, PortalAdmin.failureCallback);
        },

        getMessageGroupsSuccessCallback: function (results) {
            var html = '';

            if (results.length > 0) {
                $.each(results, function (index, item) {
                    html += '<option value="' + item.groupId + '">' + item.groupName + '</option>';
                });
            }
            $("#ddlGroup").append(html);
            $("#ddlGroupFilter").append(html);
        },

        getMessageTypes: function (id) {
            PortalAdmin.ajaxCall('GetMessageTypes', {}, 'GET', PortalAdmin.getMessageTypesSuccessCallback, PortalAdmin.failureCallback);
        },

        getMessageTypesSuccessCallback: function (results) {
            var html = '';
            var firstElement = results[0].messageTypeId;
            if (results.length > 0) {
                $.each(results, function (index, item) {
                    html += '<option value="' + item.messageTypeId + '">' + item.messageTypeName + '</option>';
                });
            }
            $("#ddlMessageType").append(html).val(firstElement);
        },

        getMessageGateways: function (id) {
            PortalAdmin.ajaxCall('GetMessageGateways', {}, 'GET', PortalAdmin.getMessageGatewaysSuccessCallback, PortalAdmin.failureCallback);
        },

        getMessageGatewaysSuccessCallback: function (results) {
            var html = '';
            if (results.length > 0) {
                $.each(results, function (index, item) {
                    html += '<option value="' + item.messageGatewayId + '">' + item.gatewayName + '</option>';
                });
            }
            $('#ddlMessageGateway').append(html);
        },

        getPersonList: function () {
            var groupId = $('#ddlGroup').val();
            groupId = ((groupId === null || groupId === '') ? 0 : groupId);

            PortalAdmin.ajaxCall('GetPersons',
                {
                    personName: "",
                    mobile: "",
                    email: "",
                    isActive: 1,
                    groupId: groupId,
                    pageNo: 1,
                    itemsPerPage: 100000,
                    pagePerDisplay: 1
                },
                'GET', PortalAdmin.getPersonListSuccessCallback, PortalAdmin.failureCallback);
        },

        getPersonListSuccessCallback: function (results) {
            //var html = '<option value="0">Select Persons</option>';
            var html = '';
            if (results.data.length > 0) {
                $.each(results.data, function (index, item) {
                    html += '<option value="' + item.personId + '" data-phone="' + item.mobile + '">' + item.personName + ' (' + item.mobile + ')</option>';
                });
            }
            $("#ddlPerson").html(html);
            unloadMultiSumoSelect('ddlPerson');
            loadMultiSumoSelect('ddlPerson');
        },

        savePortalPerson: function (id) {
            PortalAdmin.ajaxCall('SavePortalPerson', { messagePortalPersonId: id }, 'GET', PortalAdmin.savePortalPersonSuccessCallback, PortalAdmin.failureCallback);
        },

        savePortalPersonSuccessCallback: function (results) {
            if (results.isDbSuccess) {
                PortalAdmin.getPortalList(1);
                showMessage("Message Sent Successfully", 'success');
            }
            else {
                showMessage(results.dbMessage, 'error');
            }
            $('.preloader').hide();
        },

        deletePortal: function (ids) {
            ids = convertStrArrToIntArr(ids);
            PortalAdmin.ajaxCall('DeletePortal', JSON.stringify(ids), 'POST', PortalAdmin.deletePortalSuccessCallback, PortalAdmin.failureCallback);
        },

        deletePortalSuccessCallback: function (results) {
            if (results.isDbSuccess) {
                showMessage(results.dbMessage, 'success');
                PortalAdmin.getPortalList(pageNo);
            }
            else
                showMessage(results.dbMessage, 'error');
        },

        getMessageTemplates: function (id) {
            PortalAdmin.ajaxCall('GetMessageTemplates', {}, 'GET', PortalAdmin.getMessageTemplatesSuccessCallback, PortalAdmin.failureCallback);
        },

        getMessageTemplatesSuccessCallback: function (results) {
            var html = '';
            if (results.length > 0) {
                $.each(results, function (index, item) {
                    html += '<option value="' + item.messageTemplateId + '" data-desc="' + item.description + '">' + item.templateName + '</option>';
                });
            }
            $('#ddlMessageTemplate').append(html);
        },
    };

    PortalAdmin.init();
})(jQuery);
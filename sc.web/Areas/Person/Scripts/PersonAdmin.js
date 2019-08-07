(function ($) {
    var itemsPerPage = 20;
    var pagePerDisplay = 10;
    var pageNo = 1;
    var $validator, $importValidator;

    var PersonAdmin = {
        init: function () {
            $('body').click(function (event) {
                if (!$('.btnOptions').is(event.target) && $('.btnOptions').has(event.target).length === 0) {
                    $('.dropdown-options-menu-content').hide();
                }
            });

            $('html body').on('click', '#btnResetFilter', function () {
                $('#txtNameFilter').val('');
                $('#txtMobileFilter').val('');
                $('#txtEmailFilter').val('');
                $('#ddlActiveFilter').val('2');
                $('#ddlGroupFilter').val('0');

                PersonAdmin.getPersonList(1);
            });

            $('html body').on('click', '#btnAddNew', function () {
                PersonAdmin.showForm();
            });

            $('html body').on('click', '#btnImportForm', function () {
                $('#fuPersons').val('');
                $('#ddlGroupImport').val('');
                PersonAdmin.showImportForm();
            });

            $('html body').on('click', '#btnCancel, #btnCancelImport', function () {
                PersonAdmin.hideForm();
            });

            $('html body').on('click', '#btnSearch', function () {
                PersonAdmin.getPersonList(1);
            });

            $('html body').on('click', '#btnReset', function () {
                PersonAdmin.clearForm();
            });

            $('html body').on('click', '#btnSave', function () {
                if ($validator.form()) {
                    PersonAdmin.savePerson();
                }
            });

            $('html body').on('click', '#btnImport', function () {
                if ($importValidator.form()) {
                    $('.preloader').show();
                    PersonAdmin.importPersons();
                }
            });

            $('html body').on('click', '.btnEditPerson', function () {
                var id = $(this).attr('data-id');

                PersonAdmin.getPersonById(id);
            });

            $('html body').on('click', '.btnDeletePerson', function () {
                var ids = [];
                ids.push($(this).attr('data-id'));
                $.prompt("Are you sure you want to delete this Person?", {
                    title: "Please Confirm?",
                    buttons: { "Yes": true, "No": false },
                    submit: function (e, v, m, f) {
                        if (v) {
                            PersonAdmin.deletePerson(ids);
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
                $('.btnEditPerson').hide();
                $('.btnDeletePerson').hide();
            });

            $('html body').on('click', '.btnBulkDeleteCancel', function () {
                $('.btnOptions').show();
                $('.btnBulkDelete').hide();
                $('.btnBulkDeleteCancel').hide();
                $('.chkDelete').prop('checked', false).hide();
                $('.btnEditPerson').show();
                $('.btnDeletePerson').show();
            });

            $('html body').on('click', '.btnBulkDelete', function () {
                var ids = [];
                $('.chkDelete:checked').each(function () {
                    var a = $(this).attr('data-id');
                    ids.push(a);
                });
                if (ids.length > 0) {
                    $.prompt("Are you sure you want to delete all " + ids.length + " selected Persons?", {
                        title: "Please Confirm?",
                        buttons: { "Yes": true, "No": false },
                        submit: function (e, v, m, f) {
                            if (v) {
                                PersonAdmin.deletePerson(ids);
                            }
                        }
                    });
                } else {
                    showMessage('Please select at least a person to delete!', 'error');
                }
                
            });

            PersonAdmin.getPersonList(1);

            PersonAdmin.getMessageGroups();

            $validator = $("#personForm").validate({
                rules: {
                    txtPersonName: {
                        required: true
                    },
                    txtMobile: {
                        required: true,
                        digits: true,
                        minlength: 10,
                        maxlength: 10
                    },
                    txtEmail: {
                        email: true
                    },
                    ddlGroup: {
                        required: true
                    }
                },
                messages: {
                    txtMobile: {
                        minlength: "Please enter 10-digit Mobile No.",
                        maxlength: "Please enter 10-digit Mobile No."
                    }
                },
                errorPlacement: function (error, element) {
                    var eName = element.attr('name');
                    if (eName === 'group[]') 
                        error.appendTo('#tdGroups');
                    else
                        error.insertAfter(element);
                }
            });

            $importValidator = $('#personImportForm').validate({
                rules: {
                    fuPersons: {
                        required: true
                    },
                    ddlGroupImport: {
                        required: true
                    }
                }
                , messages: {
                    fuPersons: {
                        required: 'Persons excel file is required'
                    }
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
                url: PersonAdmin.config.baseUrl + method
                , type: type
                , contentType: PersonAdmin.config.contentType
                , data: data
                , dataType: PersonAdmin.config.dataType
                , success: function (result) {
                    successCallback(result);
                }
                , error: function (xhr, s, e) {
                    PersonAdmin.failureCallback(xhr, s, e);
                }
            });
        },

        ajaxUploadCall: function (method, data, type, successCallback, failureCallback) {
            $.ajax({
                url: PersonAdmin.config.baseUrl + method
                , type: type
                , contentType: false
                , processData: false
                , data: data
                , success: function (result) {
                    successCallback(result);
                }
                , error: function (xhr, s, e) {
                    PersonAdmin.failureCallback(xhr, s, e);
                }
            });
        },

        failureCallback: function (xhr, s, e) {
            showMessage(e, 'error');
        },

        getPersonList: function (page) {
            var personName = $('#txtNameFilter').val().trim();
            var mobile = $('#txtMobileFilter').val().trim();
            var email = $('#txtEmailFilter').val().trim();
            var active = $('#ddlActiveFilter').val();
            var groupId = $('#ddlGroupFilter').val();

            PersonAdmin.ajaxCall('GetPersons',
                {
                    personName: personName,
                    mobile: mobile, 
                    email: email, 
                    isActive: active,
                    groupId: groupId, 
                    pageNo: page,
                    itemsPerPage: itemsPerPage,
                    pagePerDisplay: pagePerDisplay 
                    },
                'GET', PersonAdmin.getPersonListSuccessCallback, PersonAdmin.failureCallback);
        },

        getPersonListSuccessCallback: function (results) {
            var html = '';
            if (results.data.length > 0) {
                $('#data-container #listName').text('Person List (' + results.pager.totalCount + ')');
                html += '<table class="table table-striped table-bordered">';
                html += '<thead>';
                html += '<tr>';
                html += '<th scope="col">S.No.</th>';
                html += '<th scope="col">Person Name </th>';
                html += '<th scope="col">Group</th>';
                html += '<th scope="col">Mobile</th>';
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
                    html += '<td>' + item.personName + '</td>';
                    html += '<td>' + item.groupName + '</td>';
                    html += '<td>' + item.mobile + '</td>';
                    html += '<td>' + (item.isActive ? 'Yes' : 'No') + '</td>';

                    html += '<td>';
                    html += '<a href="javascript:void(0);" title="Edit" class="fa fa-edit btnEditPerson" data-id="' + item.personId + '"></a>&nbsp;&nbsp;';
                    html += '<a href="javascript:void(0);" title="Delete" class="fa fa-trash btnDeletePerson" data-id="' + item.personId + '"></a>';
                    html += '<input type="checkbox" class="chkDelete" data-id="' + item.personId + '" style="display:none;" />';
                    html += '</td>';

                    html += '</tr>';
                });

                html += '</tbody>';
                html += '</table>';

                PersonAdmin.bindPager(results.pager);
            }
            else {
                html += 'Could not find Person with respective search criteria';
                $('#divPager').hide();
            }

            $("#divData").html(html);

            PersonAdmin.hideForm();
        },

        savePerson: function () {
            var person = {
                PersonId: $('#hdnId').val(),
                PersonName: $('#txtPersonName').val().trim(),
                Mobile: $('#txtMobile').val().trim(),
                Email: $('#txtEmail').val().trim(),
                Address: $('#txtAddress').val().trim(),
                IsActive: $('#chkIsActive').is(':checked'),
                GroupId: $('#ddlGroup').val()
            };

            PersonAdmin.ajaxCall('SavePerson', JSON.stringify(person), 'POST', PersonAdmin.savePersonSuccessCallback, PersonAdmin.failureCallback);
        },

        savePersonSuccessCallback: function (results) {
            if (results.isDbSuccess) {
                PersonAdmin.getPersonList(1);
                showMessage(results.dbMessage, 'success');
            }
            else {
                showMessage(results.dbMessage, 'error');
            }
        },

        getPersonById: function (id) {
            PersonAdmin.ajaxCall('GetPersonById', { id: id }, 'GET', PersonAdmin.getPersonByIdSuccessCallback, PersonAdmin.failureCallback);
        },

        getPersonByIdSuccessCallback: function (results) {
            PersonAdmin.showForm();

            var person = results;
            $('#hdnId').val(person.personId);
            $('#ddlGroup').val(person.groupId);
            $('#txtPersonName').val(person.personName);
            $('#txtMobile').val(person.mobile);
            $('#txtEmail').val(person.email);
            $('#txtAddress').val(person.address);
            $('#chkIsActive').prop('checked', person.isActive);

        },

        deletePerson: function (ids) {
            ids = convertStrArrToIntArr(ids);
            PersonAdmin.ajaxCall('DeletePerson', JSON.stringify(ids), 'POST', PersonAdmin.deletePersonSuccessCallback, PersonAdmin.failureCallback);
        },

        deletePersonSuccessCallback: function (results) {
            if (results.isDbSuccess) {
                showMessage(results.dbMessage, 'success');
                PersonAdmin.getPersonList(pageNo);
            }
            else
                showMessage(results.dbMessage, 'error');
        },

        clearForm: function () {
            $('#hdnId').val('0');
            $('#txtPersonName').val('');
            $('#txtMobile').val('');
            $('#txtEmail').val('');
            $('#txtAddress').val('');
            $('#chkIsActive').prop('checked', true);
            $('#ddlGroup').val('');

            $validator.resetForm();
        },

        showForm: function () {
            PersonAdmin.clearForm();
            $('#btnAddNew').hide();
            $('#btnImportForm').hide();
            $('#search-filter').hide();
            $('#data-container').hide();
            $('#data-form').show();
            $('#import-form').hide();

            $('.breadcrumb li.active').text('Person Form');
        },

        showImportForm: function () {
            $('#btnAddNew').hide();
            $('#btnImportForm').hide();
            $('#search-filter').hide();
            $('#data-container').hide();
            $('#data-form').hide();
            $('#import-form').show();

            $('.breadcrumb li.active').text('Person Import Form');
        },

        hideForm: function () {
            $('#data-form').hide();
            $('#import-form').hide();
            $('#btnAddNew').show();
            $('#btnImportForm').show();
            $('#search-filter').show();
            $('#data-container').show();

            $('.breadcrumb li.active').text('Person List');

            PersonAdmin.clearForm();
        },

        bindPager: function (pager) {
            pageNo = pager.pageNo;
            $('#divPager').pagination({
                pageNo: pager.pageNo
                , itemsPerPage: pager.itemsPerPage
                , pagePerDisplay: pager.pagePerDisplay
                , totalNextPages: pager.totalNextPages
                , callback: PersonAdmin.getPersonList
            });
            $('#divPager').show();
        },

        getMessageGroups: function (id) {
            PersonAdmin.ajaxCall('GetMessageGroupsForDDL', {}, 'GET', PersonAdmin.getMessageGroupsSuccessCallback, PersonAdmin.failureCallback);
        },

        getMessageGroupsSuccessCallback: function (results) {
            var selectHtml = '';

            if (results.length > 0) {
                $.each(results, function (index, item) {
                    selectHtml += '<option value="' + item.groupId + '">' + item.groupName + '</option>';
                });
            }
            $("#ddlGroupFilter").append(selectHtml);
            $("#ddlGroup").append(selectHtml);
            $("#ddlGroupImport").append(selectHtml);
        },

        importPersons: function () {
            var data = new FormData();
            var files = $('#fuPersons').get(0).files;
            if (files.length > 0) data.append('persons', files[0]);
            data.append('groupId', $('#ddlGroupImport').val());

            PersonAdmin.ajaxUploadCall('ImportPersons', data, 'POST', PersonAdmin.importPersonsCallback, PersonAdmin.failureCallback);
        },

        importPersonsCallback: function (results) {
            if (results.isDbSuccess) {
                PersonAdmin.getPersonList(1);
                showMessage(results.dbMessage, 'success');
            }
            else {
                showMessage(results.dbMessage, 'error');
            }
            $('.preloader').hide();
        }
    };

    PersonAdmin.init();
})(jQuery);
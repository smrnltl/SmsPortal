(function ($) {
    var itemsPerPage = 10;
    var pagePerDisplay = 5;
    var pageNo = 1;
    var $validator;

    var UserAdmin = {
        init: function () {

            $('html body').on('click', '#btnAddNew', function () {
                $('#userForm #btnSave, #trNewPasswordAdd, #trConfirmPasswordAdd').show();
                $('#userForm #btnUpdate, #trNewPasswordEdit, #trConfirmPasswordEdit').hide();
                $('#txtUsername').prop('disabled', false).prop('readonly', false);
                UserAdmin.showForm();
            });

            $('html body').on('click', '#btnCancel', function () {
                UserAdmin.hideForm();
            });

            $('html body').on('click', '#btnSearch', function () {
                UserAdmin.getUserList(1);
            });

            $('html body').on('click', '#btnReset', function () {
                UserAdmin.clearForm();
            });

            $('html body').on('click', '#btnSave', function () {
                if ($validator.form()) {
                    UserAdmin.saveUser();
                }
            });

            $('html body').on('click', '#btnUpdate', function () {
                if ($validator.form()) {
                    UserAdmin.updateUser();
                }
            });

            $('html body').on('click', '.btnEditUser', function () {
                $('#userForm #btnSave, #trNewPasswordAdd, #trConfirmPasswordAdd').hide();
                $('#userForm #btnUpdate, #trNewPasswordEdit, #trConfirmPasswordEdit').show();
                $('#txtUsername').prop('disabled', true).prop('readonly', true);
                var id = $(this).attr('id');

                UserAdmin.getUserById(id);
            });

            $('html body').on('click', '.btnDeleteUser', function () {
                var id = $(this).attr('id');
                $.prompt("Are you sure you want to delete this User?", {
                    title: "Please Confirm?",
                    buttons: { "Yes": true, "No": false },
                    submit: function (e, v, m, f) {
                        if (v) {
                            UserAdmin.deleteUser(id);
                        }
                    }
                });
            });


            UserAdmin.getUserList(1);

            $validator = $("#userForm").validate({
                rules: {
                    txtUsername: {
                        required: true
                    },
                    txtFirstName: {
                        required: true
                    },
                    txtLastName: {
                        required: true
                    },
                    txtEmail: {
                        required: true,
                        email: true
                    },
                    txtPhoneNo: {
                        digits: true,
                        minlength: 8,
                        maxlength: 10
                    },
                    txtNewPasswordAdd: {
                        required: true,
                        minlength: 6,
                        pwcheck: true
                    },
                    txtConfirmPasswordAdd: {
                        required: true,
                        equalTo: '#txtNewPasswordAdd'
                    },
                    txtNewPasswordEdit: {
                        minlength: 6,
                        pwcheck: true
                    },
                    txtConfirmPasswordEdit: {
                        equalTo: '#txtNewPasswordEdit'
                    },

                },
                messages: {
                    txtUsername: { required: "Username is required" },
                    txtFirstName: { required: "First Name is required" },
                    txtLastName: { required: "Last Name is required" },
                    txtEmail: {
                        required: "Email is required",
                        email: "Invalid Email"
                    },
                    txtPhoneNo: {
                        minlength: "Phone No. must be of 8-10 digits",
                        maxlength: "Phone No. must be of 8-10 digits"
                    },
                    txtNewPasswordAdd: {
                        required: "New Password is required",
                        minlength: "Password must be at least 6 characters",
                        pwcheck: "Password must have an uppercase and a digit. No special characters!"
                    },
                    txtConfirmPasswordAdd: {
                        required: "Confirm Password is required",
                        equalTo: "Password does not match"
                    },
                    txtNewPasswordEdit: {
                        minlength: "Password must be at least 6 characters",
                        pwcheck: "Password must have an uppercase and a digit. No special characters!"
                    },
                    txtConfirmPasswordEdit: {
                        equalTo: "Password does not match"
                    }
                }
            });

            $.validator.addMethod("pwcheck", function (value) {
                if (value == null || value == '') return true;
                else
                {
                    return /^[A-Za-z0-9\d=!\-@._*]*$/.test(value) // consists of only these
                        && /[A-Z]/.test(value) // has a uppercase letter
                        && /\d/.test(value) // has a digit
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
                url: UserAdmin.config.baseUrl + method
                , type: type
                , contentType: UserAdmin.config.contentType
                , data: data
                , dataType: UserAdmin.config.dataType
                , success: function (result) {
                    successCallback(result);
                }
                , error: function (xhr, s, e) {
                    UserAdmin.failureCallback(xhr, s, e);
                }
            });
        },

        ajaxUploadCall: function (method, data, type, successCallback, failureCallback) {
            $.ajax({
                url: UserAdmin.config.baseUrl + method
                , type: type
                , contentType: false
                , processData: false
                , data: data
                , success: function (result) {
                    successCallback(result);
                }
                , error: function (xhr, s, e) {
                    UserAdmin.failureCallback(xhr, s, e);
                }
            });
        },

        failureCallback: function (xhr, s, e) {
            showMessage(e, 'error');
        },

        getUserList: function (page) {
            UserAdmin.ajaxCall('GetUsers', { pageNo: page, itemsPerPage: itemsPerPage, pagePerDisplay: pagePerDisplay }, 'GET', UserAdmin.getUserListSuccessCallback, UserAdmin.failureCallback);
        },

        getUserListSuccessCallback: function (results) {
            var html = '';
            if (results.data.length > 0) {
                html += '<table class="table table-striped table-bordered">';
                html += '<thead>';
                html += '<tr>';
                html += '<th scope="col">Username</th>';
                html += '<th scope="col">First Name</th>';
                html += '<th scope="col">Last Name</th>';
                html += '<th scope="col">Actions</th>';
                html += '</tr>';
                html += '</thead>';
                html += '<tbody>';
                $.each(results.data, function (index, item) {
                    html += '<tr>';
                    html += '<td>' + item.userName + '</td>';
                    html += '<td>' + item.firstName + '</td>';
                    html += '<td>' + item.lastName + '</td>';
                    html += '<td><a href="javascript:void(0);" class="fa fa-edit btnEditUser" id="' + item.userId + '"></a>&nbsp;&nbsp;<a href="javascript:void(0);" class="fa fa-trash btnDeleteUser" id="' + item.userId + '"></a> </td>';
                    html += '</tr>';
                });

                html += '</tbody>';
                html += '</table>';

                UserAdmin.bindPager(results.pager);
            }
            else
                html += 'Could not find User with respective search criteria';

            $("#divData").html(html);

            UserAdmin.hideForm();
        },

        saveUser: function () {
            var user = {
                UserId: $('#hdnId').val(),
                FirstName: $('#txtFirstName').val(),
                LastName: $('#txtLastName').val(),
                Email: $('#txtEmail').val(),
                PhoneNumber: $('#txtPhoneNo').val(),
                Username: $('#txtUsername').val(),
                NewPassword: $('#txtNewPasswordAdd').val()
            }


            UserAdmin.ajaxCall('CreateUser', JSON.stringify(user), 'POST', UserAdmin.saveUserSuccessCallback, UserAdmin.failureCallback);
        },

        saveUserSuccessCallback: function (results) {
            if (results.isDbSuccess) {
                showMessage('User created successfully', 'success');
                UserAdmin.getUserList(1);
            }
            else {
                showMessage(results.dbMessage, 'error');
            }
        },

        updateUser: function () {
            var user = {
                UserId: $('#hdnId').val(),
                FirstName: $('#txtFirstName').val(),
                LastName: $('#txtLastName').val(),
                Email: $('#txtEmail').val(),
                PhoneNumber: $('#txtPhoneNo').val(),
                Username: $('#txtUsername').val(),
                NewPassword: $('#txtNewPasswordEdit').val()
            }


            UserAdmin.ajaxCall('UpdateUser', JSON.stringify(user), 'POST', UserAdmin.updateUserSuccessCallback, UserAdmin.failureCallback);
        },

        updateUserSuccessCallback: function (results) {
            if (results.isDbSuccess) {
                showMessage('User updated successfully', 'success');
                UserAdmin.getUserList(1);
            }
            else {
                showMessage(results.dbMessage, 'error');
            }
        },

        getUserById: function (id) {
            UserAdmin.ajaxCall('GetUserById', { id: id }, 'GET', UserAdmin.getUserByIdSuccessCallback, UserAdmin.failureCallback);
        },

        getUserByIdSuccessCallback: function (results) {
            UserAdmin.showForm();

            var user = results;
            $('#hdnId').val(user.userId);
            $('#txtUsername').val(user.userName)
            $('#txtFirstName').val(user.firstName);
            $('#txtLastName').val(user.lastName);
            $('#txtEmail').val(user.email);
            $('#txtPhoneNo').val(user.phoneNumber);
        },

        deleteUser: function (id) {
            UserAdmin.ajaxCall('DeleteUser', { id: id }, 'GET', UserAdmin.deleteUserSuccessCallback, UserAdmin.failureCallback);
        },

        deleteUserSuccessCallback: function (results) {
            if (results.isDbSuccess) {
                showMessage(results.dbMessage, 'success');
                UserAdmin.getUserList(pageNo);
            }
            else
                showMessage(results.dbMessage, 'error');
        },

        clearForm: function () {
            $('#hdnId').val('0');
            $('#txtUsername').val('');
            $('#txtFirstName').val('');
            $('#txtLastName').val('');
            $('#txtEmail').val('');
            $('#txtPhoneNo').val('');
            $('#txtNewPasswordAdd').val('');
            $('#txtConfirmPasswordAdd').val('');
            $('#txtNewPasswordEdit').val('');
            $('#txtConfirmPasswordEdit').val('');

            $validator.resetForm()
        },

        showForm: function () {
            UserAdmin.clearForm();
            $('#btnAddNew').hide();
            $('#search-filter').hide();
            $('#data-container').hide();
            $('#data-form').show();

            $('.breadcrumb li.active').text('User Form');
        },

        hideForm: function () {
            $('#data-form').hide();
            $('#btnAddNew').show();
            //$('#search-filter').show();
            $('#data-container').show();

            $('.breadcrumb li.active').text('User List');

            UserAdmin.clearForm();
        },

        bindPager: function (pager) {
            pageNo = pager.pageNo;
            $('#divPager').pagination({
                pageNo: pager.pageNo
                , itemsPerPage: pager.itemsPerPage
                , pagePerDisplay: pager.pagePerDisplay
                , totalNextPages: pager.totalNextPages
                , callback: UserAdmin.getUserList
            });
            $('#divPager').show();
        },

    }

    UserAdmin.init();
})(jQuery);
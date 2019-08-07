(function ($) {
    var itemsPerPage = 10;
    var pagePerDisplay = 5;
    var pageNo = 1;
    var $validator;

    var RoleAdmin = {
        init: function () {

            $('html body').on('click', '#btnAddNew', function () {
                $('#roleForm #btnSave').show();
                $('#roleForm #btnUpdate').hide();

                RoleAdmin.showForm();
            });

            $('html body').on('click', '#btnCancel', function () {
                RoleAdmin.hideForm();
            });

            $('html body').on('click', '#btnSearch', function () {
                RoleAdmin.getRoleList(1);
            });

            $('html body').on('click', '#btnReset', function () {
                RoleAdmin.clearForm();
            });

            $('html body').on('click', '#btnSave', function () {
                if ($validator.form()) {
                    RoleAdmin.saveRole();
                }
            });

            $('html body').on('click', '#btnUpdate', function () {
                if ($validator.form()) {
                    RoleAdmin.updateRole();
                }
            });

            $('html body').on('click', '.btnEditRole', function () {
                $('#roleForm #btnSave').hide();
                $('#roleForm #btnUpdate').show();

                var id = $(this).attr('id');

                RoleAdmin.getRoleById(id);
            });

            $('html body').on('click', '.btnDeleteRole', function () {
                var id = $(this).attr('id');
                $.prompt("Are you sure you want to delete this Role?", {
                    title: "Please Confirm?",
                    buttons: { "Yes": true, "No": false },
                    submit: function (e, v, m, f) {
                        if (v) {
                            RoleAdmin.deleteRole(id);
                        }
                    }
                });
            });


            RoleAdmin.getRoleList(1);

            $validator = $("#roleForm").validate({
                rules: {
                    txtRoleName: {
                        required: true
                    },

                },
                messages: {
                    txtRoleName: { required: "Role Name is required" },

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
                url: RoleAdmin.config.baseUrl + method
                , type: type
                , contentType: RoleAdmin.config.contentType
                , data: data
                , dataType: RoleAdmin.config.dataType
                , success: function (result) {
                    successCallback(result);
                }
                , error: function (xhr, s, e) {
                    RoleAdmin.failureCallback(xhr, s, e);
                }
            });
        },

        failureCallback: function (xhr, s, e) {
            showMessage(e, 'error');
        },

        getRoleList: function (page) {
            RoleAdmin.ajaxCall('GetRoles', { pageNo: page, itemsPerPage: itemsPerPage, pagePerDisplay: pagePerDisplay }, 'GET', RoleAdmin.getRoleListSuccessCallback, RoleAdmin.failureCallback);
        },

        getRoleListSuccessCallback: function (results) {
            var html = '';
            if (results.data.length > 0) {
                html += '<table class="table table-striped table-bordered">';
                html += '<thead>';
                html += '<tr>';
                html += '<th scope="col">Role Name</th>';
                html += '<th scope="col">Actions</th>';
                html += '</tr>';
                html += '</thead>';
                html += '<tbody>';
                $.each(results.data, function (index, item) {
                    html += '<tr>';
                    html += '<td>' + item.name + '</td>';
                    html += '<td><a href="javascript:void(0);" class="fa fa-edit btnEditRole" id="' + item.id + '"></a>&nbsp;&nbsp;<a href="javascript:void(0);" class="fa fa-trash btnDeleteRole" id="' + item.id + '"></a> </td>';
                    html += '</tr>';
                });

                html += '</tbody>';
                html += '</table>';

                RoleAdmin.bindPager(results.pager);
            }
            else
                html += 'Could not find Role with respective search criteria';

            $("#divData").html(html);

            RoleAdmin.hideForm();
        },

        saveRole: function () {
            var role = {
                Id: $('#hdnId').val(),
                Name: $('#txtRoleName').val()
            };

            RoleAdmin.ajaxCall('CreateRole', JSON.stringify(role), 'POST', RoleAdmin.saveRoleSuccessCallback, RoleAdmin.failureCallback);
        },

        saveRoleSuccessCallback: function (results) {
            if (results.isDbSuccess) {
                showMessage('Role created successfully', 'success');
                RoleAdmin.getRoleList(1);
            }
            else {
                showMessage(results.dbMessage, 'error');
            }
        },

        updateRole: function () {
            var role = {
                Id: $('#hdnId').val(),
                Name: $('#txtRoleName').val()
            };


            RoleAdmin.ajaxCall('UpdateRole', JSON.stringify(role), 'POST', RoleAdmin.updateRoleSuccessCallback, RoleAdmin.failureCallback);
        },

        updateRoleSuccessCallback: function (results) {
            if (results.isDbSuccess) {
                showMessage('Role updated successfully', 'success');
                RoleAdmin.getRoleList(1);
            }
            else {
                showMessage(results.dbMessage, 'error');
            }
        },

        getRoleById: function (id) {
            RoleAdmin.ajaxCall('GetRoleById', { id: id }, 'GET', RoleAdmin.getRoleByIdSuccessCallback, RoleAdmin.failureCallback);
        },

        getRoleByIdSuccessCallback: function (results) {
            RoleAdmin.showForm();

            var user = results;
            $('#hdnId').val(user.id);
            $('#txtRoleName').val(user.name);
        },

        deleteRole: function (id) {
            RoleAdmin.ajaxCall('DeleteRole', { id: id }, 'GET', RoleAdmin.deleteRoleSuccessCallback, RoleAdmin.failureCallback);
        },

        deleteRoleSuccessCallback: function (results) {
            if (results.isDbSuccess) {
                showMessage(results.dbMessage, 'success');
                RoleAdmin.getRoleList(pageNo);
            }
            else
                showMessage(results.dbMessage, 'error');
        },

        clearForm: function () {
            $('#hdnId').val('0');
            $('#txtRoleName').val('');

            $validator.resetForm();
        },

        showForm: function () {
            RoleAdmin.clearForm();
            $('#btnAddNew').hide();
            $('#search-filter').hide();
            $('#data-container').hide();
            $('#data-form').show();

            $('.breadcrumb li.active').text('Role Form');
        },

        hideForm: function () {
            $('#data-form').hide();
            $('#btnAddNew').show();
            //$('#search-filter').show();
            $('#data-container').show();

            $('.breadcrumb li.active').text('Role List');

            RoleAdmin.clearForm();
        },

        bindPager: function (pager) {
            pageNo = pager.pageNo;
            $('#divPager').pagination({
                pageNo: pager.pageNo
                , itemsPerPage: pager.itemsPerPage
                , pagePerDisplay: pager.pagePerDisplay
                , totalNextPages: pager.totalNextPages
                , callback: RoleAdmin.getRoleList
            });
            $('#divPager').show();
        }

    };

    RoleAdmin.init();
})(jQuery);
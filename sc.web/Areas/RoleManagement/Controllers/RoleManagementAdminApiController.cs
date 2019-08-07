using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using sc.web.Controllers;

using sc.RoleManagement;
using System.Threading.Tasks;

using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using sc.web.Models;
using sc.data;
using Microsoft.AspNet.Identity.EntityFramework;

namespace sc.web.Areas.RoleManagement.Controllers
{
    [System.Web.Mvc.RouteArea("RoleManagement", AreaPrefix = "")]
    public class RoleManagementAdminApiController : BaseApiController
    {
        string rolename = HttpContext.Current.User.Identity.Name;

        private RoleDBContext _roleDbContext;
        private ApplicationUserManager _userManager;

        public RoleDBContext RoleDBContext
        {
            get
            {
                if (this._roleDbContext == null)
                    this._roleDbContext = new RoleDBContext();
                return _roleDbContext;
            }
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        [HttpGet]
        [Route("Admin/GetRoles")]
        public async Task<IHttpActionResult> GetRoles(int pageNo, int itemsPerPage, int pagePerDisplay)
        {
            try
            {
                var data = await RoleDBContext.GetRoles(pageNo, itemsPerPage, pagePerDisplay);
                return Ok(data);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpGet]
        [Route("Admin/GetRoleById")]
        public async Task<IHttpActionResult> GetRoleById(string id)
        {
            try
            {
                var data = await RoleDBContext.GetRoleById(id);
                return Ok(data);
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        [HttpPost]
        [Route("Admin/UpdateRole")]
        public async Task<IHttpActionResult> UpdateRole([FromBody] RoleInfo roleInfo)
        {
            DbResult _dbResult = new DbResult();

            var role = await this.AppRoleManager.FindByIdAsync(roleInfo.Id);

            if (role == null)
            {
                _dbResult = new DbResult
                {
                    IsDbSuccess = false,
                    DbMessage = "Unauthorized"
                };
            }
            else
            {
                role.Name = roleInfo.Name;

                var result = await this.AppRoleManager.UpdateAsync(role);


                if (result.Succeeded)
                {
                    _dbResult = new DbResult
                    {
                        IsDbSuccess = true,
                        DbMessage = "Role details updated successfully"
                    };

                }
                else
                {
                    _dbResult = new DbResult
                    {
                        IsDbSuccess = false,
                        DbMessage = result.Errors.SingleOrDefault()
                    };
                }
            }
            return Ok(_dbResult);
        }

        [HttpPost]
        [Route("Admin/CreateRole")]
        public async Task<IHttpActionResult> CreateRole([FromBody] RoleInfo roleInfo)
        {
            DbResult _dbResult = new DbResult();

            var role = new IdentityRole { Name = roleInfo.Name };

            var result = await this.AppRoleManager.CreateAsync(role);

            if (result.Succeeded)
            {
                _dbResult = new DbResult
                {
                    IsDbSuccess = true,
                    DbMessage = "Role created successfully"
                };

            }
            else
            {
                _dbResult = new DbResult
                {
                    IsDbSuccess = false,
                    DbMessage = result.Errors.SingleOrDefault()
                };
            }

            return Ok(_dbResult);
        }

        [HttpGet]
        [Route("Admin/DeleteRole")]
        public async Task<IHttpActionResult> DeleteRole(string id)
        {
            try
            {
                var result = await RoleDBContext.DeleteRole(id);
                if(result != null)
                    return Ok(result);
                return InternalServerError();
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        [HttpPost]
        [Route("Admin/ManageUsersInRole")]
        public async Task<IHttpActionResult> ManageUsersInRole([FromBody] UsersInRoleModel model)
        {
            DbResult _dbResult = new DbResult();

            var role = await this.AppRoleManager.FindByIdAsync(model.Id);

            if (role == null)
            {
                _dbResult = new DbResult
                {
                    IsDbSuccess = false,
                    DbMessage = "Role does not exist"
                };
            }

            foreach (string user in model.EnrolledUsers)
            {
                var appUser = await this.UserManager.FindByIdAsync(user);

                if (appUser == null)
                {
                    _dbResult = new DbResult
                    {
                        IsDbSuccess = false,
                        DbMessage = "User "+ user + " does not exists"
                    };
                    continue;
                }

                if (!this.UserManager.IsInRole(user, role.Name))
                {
                    IdentityResult result = await this.UserManager.AddToRoleAsync(user, role.Name);

                    if (!result.Succeeded)
                    {
                        _dbResult = new DbResult
                        {
                            IsDbSuccess = false,
                            DbMessage = "User " + user + " could not be added to role"
                        };
                    }

                }
            }

            foreach (string user in model.RemovedUsers)
            {
                var appUser = await this.UserManager.FindByIdAsync(user);

                if (appUser == null)
                {
                    _dbResult = new DbResult
                    {
                        IsDbSuccess = false,
                        DbMessage = "User " + user + " does not exists"
                    };
                    continue;
                }

                IdentityResult result = await this.UserManager.RemoveFromRoleAsync(user, role.Name);

                if (!result.Succeeded)
                {
                    _dbResult = new DbResult
                    {
                        IsDbSuccess = false,
                        DbMessage = "User " + user + " could not be removed from role"
                    };
                }
            }
            
            return Ok(_dbResult);
        }

        [HttpPost]
        [Route("Admin/ManageRolesInUser")]
        public async Task<IHttpActionResult> ManageRolesInUser([FromBody] RolesInUserModel model)
        {
            DbResult _dbResult = new DbResult();

            var user = await this.UserManager.FindByNameAsync(model.Username);

            if (user == null)
            {
                _dbResult = new DbResult
                {
                    IsDbSuccess = false,
                    DbMessage = "User does not exist"
                };
            }
            else
            {
                IdentityResult result = new IdentityResult();
                foreach (var role in model.AddRoles)
                {
                    if(!this.UserManager.IsInRole(user.Id, role))
                    {
                        result = await this.UserManager.AddToRolesAsync(user.Id, role);
                    }
                }

                if (result.Succeeded)
                {
                    result = await this.UserManager.RemoveFromRolesAsync(user.Id, model.RemoveRoles);
                }

                if (result.Succeeded)
                {
                    _dbResult = new DbResult
                    {
                        IsDbSuccess = true,
                        DbMessage = "Roles assigned to user successfully"
                    };
                }
                else
                {
                    _dbResult = new DbResult
                    {
                        IsDbSuccess = false,
                        DbMessage = result.Errors.SingleOrDefault()
                    };
                }

            }
            return Ok(_dbResult);
        }

    }
}

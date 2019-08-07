using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using sc.web.Controllers;

using sc.UserManagement;
using System.Threading.Tasks;

using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using sc.web.Models;
using sc.data;

namespace sc.web.Areas.UserManagement.Controllers
{
    [System.Web.Mvc.RouteArea("UserManagement", AreaPrefix = "")]
    public class UserManagementAdminApiController : BaseApiController
    {
        string username = HttpContext.Current.User.Identity.Name;

        private UserDBContext _userDbContext;
        private ApplicationUserManager _userManager;

        public UserDBContext UserDBContext
        {
            get
            {
                if (this._userDbContext == null)
                    this._userDbContext = new UserDBContext();
                return _userDbContext;
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
        [Route("Admin/GetUsers")]
        public async Task<IHttpActionResult> GetUsers(int pageNo, int itemsPerPage, int pagePerDisplay)
        {
            try
            {
                var data = await UserDBContext.GetUsers(pageNo, itemsPerPage, pagePerDisplay);
                return Ok(data);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpGet]
        [Route("Admin/GetUserById")]
        public async Task<IHttpActionResult> GetUserById(string id)
        {
            try
            {
                var data = await UserDBContext.GetUserById(id);
                return Ok(data);
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        [HttpPost]
        [Route("Admin/UpdateUser")]
        public async Task<IHttpActionResult> UpdateUser([FromBody] UserInfo userInfo)
        {
            DbResult _dbResult = new DbResult();

            var user = await this.UserManager.FindByIdAsync(userInfo.UserId);

            if (user == null)
            {
                _dbResult = new DbResult
                {
                    IsDbSuccess = false,
                    DbMessage = "Unauthorized"
                };
            }
            else
            {
                user.FirstName = userInfo.FirstName;
                user.LastName = userInfo.LastName;
                user.Email = userInfo.Email;
                user.PhoneNumber = userInfo.PhoneNumber;
                user.PasswordHash = string.IsNullOrEmpty(userInfo.NewPassword) ? user.PasswordHash : this.UserManager.PasswordHasher.HashPassword(userInfo.NewPassword);

                var result = await this.UserManager.UpdateAsync(user);


                if (result.Succeeded)
                {
                    _dbResult = new DbResult
                    {
                        IsDbSuccess = true,
                        DbMessage = "User details updated successfully"
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
        [Route("Admin/CreateUser")]
        public async Task<IHttpActionResult> CreateUser([FromBody] UserInfo userInfo)
        {
            DbResult _dbResult = new DbResult();

            var user = new ApplicationUser { UserName = userInfo.UserName, FirstName = userInfo.FirstName, LastName = userInfo.LastName, Email = userInfo.Email, PhoneNumber = userInfo.PhoneNumber };
            var result = await UserManager.CreateAsync(user, userInfo.NewPassword);

            if (result.Succeeded)
            {
                _dbResult = new DbResult
                {
                    IsDbSuccess = true,
                    DbMessage = "User created successfully"
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
        [Route("Admin/DeleteUser")]
        public async Task<IHttpActionResult> DeleteUser(string id)
        {
            try
            {
                var result = await UserDBContext.DeleteUser(id);
                if(result != null)
                    return Ok(result);
                return InternalServerError();
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }



    }
}

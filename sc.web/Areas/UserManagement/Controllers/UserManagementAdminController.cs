using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using sc.web.Controllers;

namespace sc.web.Areas.UserManagement.Controllers
{
    [RouteArea("UserManagement", AreaPrefix = "")]
    public class UserManagementAdminController : BaseController
    {
        // GET: UserManagement/UserManagementAdmin
        [Route("Admin/UserManagement")]
        public ActionResult UserList()
        {
            return View();
        }
    }
}
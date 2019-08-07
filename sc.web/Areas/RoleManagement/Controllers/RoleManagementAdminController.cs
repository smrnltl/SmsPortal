using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using sc.web.Controllers;

namespace sc.web.Areas.RoleManagement.Controllers
{
    [RouteArea("RoleManagement", AreaPrefix = "")]
    public class RoleManagementAdminController : BaseController
    {
        // GET: RoleManagement/RoleManagementAdmin
        [Route("Admin/RoleManagement")]
        public ActionResult RoleList()
        {
            return View();
        }
    }
}
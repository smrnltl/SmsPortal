using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using sc.web.Controllers;

namespace sc.web.Areas.Portal.Controllers
{
    [RouteArea("Portal", AreaPrefix = "")]
    public class PortalAdminController : BaseController
    {
        // GET: Portal/PortalAdmin
        [Route("Admin/Portal")]
        public ActionResult PortalList()
        {
            return View();
        }

        [Route("Admin/Gateway")]
        public ActionResult GatewayList()
        {
            return View();
        }
    }
}
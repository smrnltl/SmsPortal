using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using sc.web.Controllers;

namespace sc.web.Areas.Smtp.Controllers
{
    [RouteArea("Smtp", AreaPrefix = "")]
    public class SmtpAdminController : BaseController
    {
        [Route("Admin/Smtp")]
        // GET: Smtp/SmtpAdmin
        public ActionResult Smtp()
        {
            return View();
        }
    }
}
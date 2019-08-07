using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using sc.web.Controllers;

namespace sc.web.Areas.MessageTemplate.Controllers
{
    [RouteArea("MessageTemplate", AreaPrefix = "")]
    public class MessageTemplateAdminController : BaseController
    {

        [Route("Admin/Template")]
        public ActionResult MessageTemplateList()
        {
            return View();
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using sc.web.Controllers;

namespace sc.web.Areas.MessageGroup.Controllers
{
    [RouteArea("MessageGroup", AreaPrefix = "")]
    public class MessageGroupAdminController : BaseController
    {
        // GET: MessageGroup/MessageGroupAdmin
        [Route("Admin/Group")]
        public ActionResult MessageGroupList()
        {
            return View();
        }
    }
}
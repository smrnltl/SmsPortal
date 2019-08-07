using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using sc.web.Controllers;

namespace sc.web.Areas.Person.Controllers
{
    [RouteArea("Person", AreaPrefix = "")]
    public class PersonAdminController : BaseController
    {
        // GET: Person/PersonAdmin
        [Route("Admin/Person")]
        public ActionResult PersonList()
        {
            return View();
        }
    }
}
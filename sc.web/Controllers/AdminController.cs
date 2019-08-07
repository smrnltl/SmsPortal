using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using sc.web.Models;

namespace sc.web.Controllers
{
    public class AdminController : BaseController
    {
        ApplicationUser user = new ApplicationUser();
        public AdminController()
        {
            user = base._user;
        }

        // GET: Admin
        public ActionResult Dashboard()
        {
            return View();
        }


    }
}
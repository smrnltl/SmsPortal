using Microsoft.AspNet.Identity.Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace sc.web.Controllers
{
    [Authorize]
    public class BaseApiController : ApiController
    {
        private ApplicationRoleManager _AppRoleManager = null;
        protected virtual new ApplicationUserManager User
        {
            get { return HttpContext.Current.User as ApplicationUserManager; }
        }

        protected ApplicationRoleManager AppRoleManager
        {
            get
            {
                return _AppRoleManager ?? Request.GetOwinContext().GetUserManager<ApplicationRoleManager>();
            }
        }
    }
}
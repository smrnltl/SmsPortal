using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using sc.web.Controllers;

using sc.smtp;
using System.Web;
using System.Threading.Tasks;

namespace sc.web.Areas.Smtp.Controllers
{
    [System.Web.Mvc.RouteArea("Smtp", AreaPrefix = "")]
    public class SmtpAdminApiController : BaseApiController
    {
        string username = HttpContext.Current.User.Identity.Name;

        private SmtpDbContext _smtpDbContext;
        public SmtpDbContext SmtpDbContext
        {
            get
            {
                if (this._smtpDbContext == null)
                    this._smtpDbContext = new SmtpDbContext();
                return _smtpDbContext;
            }
        }

        [HttpGet]
        [Route("Admin/GetSmtp")]
        public async Task<IHttpActionResult> GetSmtp()
        {
            var data = await SmtpDbContext.GetSmtp();

            return Ok(data);
        }

        
        [HttpPost]
        [Route("Admin/SaveSmtp")]
        public async Task<IHttpActionResult> SaveSmtp([FromBody] SmtpInfo smtp)
        {
            smtp.AddedBy = username;
            var result = await this.SmtpDbContext.SaveSmtp(smtp);
            if (result.IsDbSuccess)
                return Ok(result);
            return InternalServerError();
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using sc.web.Controllers;

using sc.MessageTemplate;
using System.Threading.Tasks;

using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using sc.web.Models;
using sc.data;
using sc.web.Helper;
using System.Threading;

namespace sc.web.Areas.MessageTemplate.Controllers
{
    [System.Web.Mvc.RouteArea("MessageTemplate", AreaPrefix = "")]
    public class MessageTemplateAdminApiController : BaseApiController
    {
        string username = HttpContext.Current.User.Identity.Name;

        private MessageTemplateDBContext _messageTemplateDbContext;
        public MessageTemplateDBContext MessageTemplateDBContext
        {
            get
            {
                if (this._messageTemplateDbContext == null)
                    this._messageTemplateDbContext = new MessageTemplateDBContext();
                return _messageTemplateDbContext;
            }
        }

        #region Message Template
        [HttpGet]
        [Route("Admin/GetMessageTemplates")]
        public async Task<IHttpActionResult> GetMessageTemplates()
        {
            try
            {
                var data = await MessageTemplateDBContext.GetMessageTemplates();
                return Ok(data);
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        [HttpGet]
        [Route("Admin/GetMessageTemplatesList")]
        public async Task<IHttpActionResult> GetMessageTemplates(string templateName, byte isActive, int pageNo, int itemsPerPage, int pagePerDisplay)
        {
            try
            {
                if (string.IsNullOrEmpty(templateName)) templateName = "";

                var data = await MessageTemplateDBContext.GetMessageTemplates(templateName, isActive, pageNo, itemsPerPage, pagePerDisplay);
                return Ok(data);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        [HttpGet]
        [Route("Admin/GetMessageTemplateById")]
        public async Task<IHttpActionResult> GetMessageTemplates(int messageTemplateId)
        {
            try
            {
                var data = await MessageTemplateDBContext.GetMessageTemplateById(messageTemplateId);
                return Ok(data);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost]
        [Route("Admin/SaveMessageTemplate")]
        public async Task<IHttpActionResult> SaveMessageTemplate([FromBody] MessageTemplateInfo templateInfo)
        {
            try
            {
                templateInfo.Username = username;
                var result = await this.MessageTemplateDBContext.SaveMessageTemplate(templateInfo);
                if (result.IsDbSuccess)
                    return Ok(result);
                return InternalServerError();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            
        }

        [HttpGet]
        [Route("Admin/DeleteMessageTemplate")]
        public async Task<IHttpActionResult> DeleteMessageTemplate(int messageTemplateId)
        {
            try
            {
                var result = await MessageTemplateDBContext.DeleteMessageTemplate(messageTemplateId, username);
                if (result != null)
                    return Ok(result);
                return InternalServerError();
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        #endregion
    }
}
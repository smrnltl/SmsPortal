using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using sc.web.Controllers;

using sc.MessageGroup;
using System.Threading.Tasks;

using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using sc.web.Models;
using sc.data;

namespace sc.web.Areas.MessageGroup.Controllers
{
    [System.Web.Mvc.RouteArea("MessageGroup", AreaPrefix = "")]
    public class MessageGroupAdminApiController : BaseApiController
    {
        string username = HttpContext.Current.User.Identity.Name;

        private MessageGroupDBContext _messageGroupDbContext;

        public MessageGroupDBContext MessageGroupDBContext
        {
            get
            {
                if (this._messageGroupDbContext == null)
                    this._messageGroupDbContext = new MessageGroupDBContext();
                return _messageGroupDbContext;
            }
        }

        [HttpGet]
        [Route("Admin/GetMessageGroups")]
        public async Task<IHttpActionResult> GetMessageGroups(string groupName, byte isActive, int pageNo, int itemsPerPage, int pagePerDisplay)
        {
            try
            {
                if (string.IsNullOrEmpty(groupName)) groupName = "";
                var data = await MessageGroupDBContext.GetMessageGroups(groupName, isActive, pageNo, itemsPerPage, pagePerDisplay);
                return Ok(data);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpGet]
        [Route("Admin/GetMessageGroupById")]
        public async Task<IHttpActionResult> GetMessageGroupById(int id)
        {
            try
            {
                var data = await MessageGroupDBContext.GetMessageGroupById(id);
                return Ok(data);
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        
        [HttpPost]
        [Route("Admin/DeleteMessageGroup")]
        public async Task<IHttpActionResult> DeleteMessageGroup(int[] groups)
        {
            try
            {
                var result = await MessageGroupDBContext.DeleteMessageGroup(groups, username);
                if(result != null)
                    return Ok(result);
                return InternalServerError();
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        [HttpPost]
        [Route("Admin/SaveMessageGroup")]
        public async Task<IHttpActionResult> SaveMessageGroup([FromBody] MessageGroupInfo group)
        {
            group.Username = username;
            var result = await this.MessageGroupDBContext.SaveMessageGroup(group);
            if (result.IsDbSuccess)
                return Ok(result);
            return InternalServerError();
        }

        [HttpGet]
        [Route("Admin/GetMessageGroupsForDDL")]
        public async Task<IHttpActionResult> GetMessageGroups()
        {
            try
            {
                var data = await MessageGroupDBContext.GetMessageGroups();
                return Ok(data);
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

    }
}
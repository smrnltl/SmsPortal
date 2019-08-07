using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using sc.web.Controllers;

using sc.Portal;
using sc.Person;
using System.Threading.Tasks;

using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using sc.web.Models;
using sc.data;
using sc.web.Helper;
using System.Threading;

namespace sc.web.Areas.Portal.Controllers
{
    [System.Web.Mvc.RouteArea("Portal", AreaPrefix = "")]
    public class PortalAdminApiController : BaseApiController
    {
        string username = HttpContext.Current.User.Identity.Name;

        private PortalDBContext _portalDbContext;
        public PortalDBContext PortalDBContext
        {
            get
            {
                if (this._portalDbContext == null)
                    this._portalDbContext = new PortalDBContext();
                return _portalDbContext;
            }
        }

        private PersonDBContext _personDBContext;
        public PersonDBContext PersonDBContext
        {
            get
            {
                if (this._personDBContext == null)
                    this._personDBContext = new PersonDBContext();
                return _personDBContext;
            }
        }

        #region Message Portal
        [HttpGet]
        [Route("Admin/GetPortals")]
        public async Task<IHttpActionResult> GetPortals(string personName, int groupId, string mobile, byte isSent,
            int pageNo, int itemsPerPage, int pagePerDisplay)
        {
            try
            {
                if (string.IsNullOrEmpty(personName)) personName = "";
                if (string.IsNullOrEmpty(mobile)) mobile = "";
                var data = await PortalDBContext.GetPortals(personName, groupId, mobile, isSent, pageNo, itemsPerPage, pagePerDisplay);
                return Ok(data);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //[HttpGet]
        //[Route("Admin/GetPortalById")]
        //public async Task<IHttpActionResult> GetPortalById(int id)
        //{
        //    try
        //    {
        //        var data = await PortalDBContext.GetPortalById(id);
        //        return Ok(data);
        //    }
        //    catch (Exception ex)
        //    {

        //        throw ex;
        //    }
        //}

        [HttpPost]
        [Route("Admin/DeletePortal")]
        public async Task<IHttpActionResult> DeletePortal(int[] messagePortalPersons)
        {
            try
            {
                var result = await PortalDBContext.DeletePortal(messagePortalPersons, username);
                if (result != null)
                    return Ok(result);
                return InternalServerError();
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        [HttpPost]
        [Route("Admin/SavePortalGroup")]
        public async Task<IHttpActionResult> SavePortalGroup([FromBody] PortalGroupInfo portal)
        {
            try
            {
                portal.Username = username;
                var result = await this.PortalDBContext.SavePortalGroup(portal);
                if (result.IsDbSuccess)
                {
                    int messagePortalGroupId = result.ReturnId;

                    string url = this.PortalDBContext.GetMessageGatewayByIdSync(portal.MessageGatewayId).GatewayURL;

                    foreach (var p in portal.Persons)
                    {
                        string mobile = this.PersonDBContext.GetPersonByIdSync(p).Mobile;

                        bool smsResult = await RestAPIHelper.CallAPI(url, mobile, portal.MessageText);

                        PortalPersonInfo personInfo = new PortalPersonInfo
                        {
                            PersonId = p,
                            MessagePortalGroupId = messagePortalGroupId,
                            Username = username
                        };
                        personInfo.IsSent = smsResult;
                        await this.PortalDBContext.UpdatePortalPerson(personInfo);

                        await Task.Delay(2000);
                    }
                }
                return Ok(result);
            }
            catch (Exception ex)
            {

                throw ex;
            }

            //return InternalServerError();
        }

        [HttpGet]
        [Route("Admin/SavePortalPerson")]
        public async Task<IHttpActionResult> SavePortalPerson(int messagePortalPersonId)
        {
            try
            {
                string url = this.PortalDBContext.GetMessageGatewaysSync().FirstOrDefault().GatewayURL;
                PortalReturnInfo portalPerson = PortalDBContext.GetPortalByIdSync(messagePortalPersonId);

                bool smsResult = await RestAPIHelper.CallAPI(url, portalPerson.Mobile, portalPerson.MessageText);

                PortalPersonInfo personInfo = new PortalPersonInfo
                {
                    PersonId = portalPerson.PersonId,
                    MessagePortalGroupId = portalPerson.MessagePortalGroupId,
                    Username = username
                };
                personInfo.IsSent = smsResult;
                var result = await this.PortalDBContext.UpdatePortalPerson(personInfo);

                return Ok(result);
            }
            catch (Exception ex)
            {

                throw ex;
            }

            //return InternalServerError();
        }

        [HttpGet]
        [Route("Admin/SendMessage")]
        public async Task<IHttpActionResult> SendMessage(string url, string phone, string message)
        {
            var result = await RestAPIHelper.CallAPI(url, phone, message);

            return Ok(result);
        }
        #endregion

        #region Message Type
        [HttpGet]
        [Route("Admin/GetMessageTypes")]
        public async Task<IHttpActionResult> GetMessageTypes()
        {
            try
            {
                var data = await PortalDBContext.GetMessageTypes();
                return Ok(data);
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        #endregion

        #region Message Gateway
        [HttpGet]
        [Route("Admin/GetMessageGateways")]
        public async Task<IHttpActionResult> GetMessageGateways()
        {
            try
            {
                var data = await PortalDBContext.GetMessageGateways();
                return Ok(data);
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        [HttpGet]
        [Route("Admin/GetMessageGatewaysList")]
        public async Task<IHttpActionResult> GetMessageGateways(int pageNo, int itemsPerPage, int pagePerDisplay)
        {
            try
            {
                var data = await PortalDBContext.GetMessageGateways(pageNo, itemsPerPage, pagePerDisplay);
                return Ok(data);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        [HttpGet]
        [Route("Admin/GetMessageGatewayById")]
        public async Task<IHttpActionResult> GetMessageGateways(int messageGatewayId)
        {
            try
            {
                var data = await PortalDBContext.GetMessageGatewayById(messageGatewayId);
                return Ok(data);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost]
        [Route("Admin/SaveMessageGateway")]
        public async Task<IHttpActionResult> SaveMessageGateway([FromBody] MessageGatewayInfo gatewayInfo)
        {
            try
            {
                gatewayInfo.Username = username;
                var result = await this.PortalDBContext.SaveMessageGateway(gatewayInfo);
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
        [Route("Admin/DeleteMessageGateway")]
        public async Task<IHttpActionResult> DeleteMessageGateway(int messageGatewayId)
        {
            try
            {
                var result = await PortalDBContext.DeleteMessageGateway(messageGatewayId, username);
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
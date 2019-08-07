using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using sc.data;

namespace sc.Portal
{
    public class PortalDBContext : DbContext
    {
        public PortalDBContext(): base("DefaultConnection") { }

        #region Message Portal Group
        public async Task<PagedData<PortalReturnInfo>> GetPortals(string personName, int groupId, string mobile, byte isSent,
            int pageNo, int itemsPerPage, int pagePerDisplay)
        {
            try
            {
                Parameters p = new Parameters();
                p.Add("@PersonName", personName);
                p.Add("@GroupId", groupId);
                p.Add("@Mobile", mobile);
                p.Add("@IsSent", isSent);
                p.Add("@PageNo", pageNo);
                p.Add("@ItemsPerPage", itemsPerPage);
                p.Add("@PagePerDisplay", pagePerDisplay);

                var data = await this.ExecuteMultipleAsync("[dbo].[usp_message_portal_getAll]", p);

                return new PagedData<PortalReturnInfo>
                {
                    Data = data.ReadAsList<PortalReturnInfo>(),
                    Pager = data.ReadAsObject<Pager>()
                };
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public PortalReturnInfo GetPortalByIdSync(int messagePortalPersonId)
        {
            try
            {
                Parameters p = new Parameters();
                p.Add("@Id", messagePortalPersonId);

                return this.ExecuteAsObject<PortalReturnInfo>("[dbo].[usp_message_portal_person_getById]", p);
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public async Task<DbResult> DeletePortal(int[] messagePortalPersons, string username)
        {
            try
            {
                var personsXML = new XElement("Root", messagePortalPersons.Select(x => new XElement("MessagePortalPersons", new XElement("MessagePortalPersonID", x)))).ToString();
                Parameters p = new Parameters();
                p.Add("@MessagePortalPersons", personsXML);
                p.Add("@Username", username);

                return await this.ExecuteDbResultAsync("[dbo].[usp_message_portal_person_delete]", p);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<DbResult> SavePortalGroup(PortalGroupInfo portal)
        {
            try
            {
                var persons = new XElement("Root", portal.Persons.Select(x => new XElement("Persons", new XElement("PersonID", x)
                                                                            ))).ToString();

                var p = new Parameters();

                p.Add("@MessagePortalGroupId", portal.MessagePortalGroupId);
                p.Add("@MessageTypeId", portal.MessageTypeId);
                p.Add("@MessageGatewayId", portal.MessageGatewayId);
                p.Add("@GroupId", portal.GroupId);
                p.Add("@Persons", persons);
                p.Add("@MessageText", portal.MessageText);
                p.Add("@IsSent", portal.IsSent);
                p.Add("@Username", portal.Username);
                

                return await this.ExecuteDbResultAsync("dbo.[usp_message_portal_save]", p);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        #endregion

        #region Message Portal Person
        public async Task<DbResult> UpdatePortalPerson(PortalPersonInfo portal)
        {
            try
            {
                var p = new Parameters();

                p.Add("@MessagePortalGroupId", portal.MessagePortalGroupId);
                p.Add("@PersonId", portal.PersonId);
                p.Add("@IsSent", portal.IsSent);
                p.Add("@Username", portal.Username);


                return await this.ExecuteDbResultAsync("dbo.[usp_message_portal_person_update]", p);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion

        #region Message Type
        public async Task<IEnumerable<MessageTypeInfo>> GetMessageTypes()
        {
            try
            {
                var data = await this.ExecuteAsListAsync<MessageTypeInfo>("[dbo].[usp_message_type_getAllForDDL]");

                return data;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        #endregion

        #region Message Gateway
        public async Task<IEnumerable<MessageGatewayInfo>> GetMessageGateways()
        {
            try
            {
                var data = await this.ExecuteAsListAsync<MessageGatewayInfo>("[dbo].[usp_message_gateway_getAllForDDL]");

                return data;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public async Task<MessageGatewayInfo> GetMessageGatewayById(int messageGatewayId)
        {
            try
            {
                var p = new Parameters();
                p.Add("@MessageGatewayId", messageGatewayId);
                var data = await this.ExecuteAsObjectAsync<MessageGatewayInfo>("[dbo].[usp_message_gateway_getById]", p);

                return data;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public async Task<PagedData<MessageGatewayInfo>> GetMessageGateways(int pageNo, int itemsPerPage, int pagePerDisplay)
        {
            try
            {
                Parameters p = new Parameters();
                p.Add("@PageNo", pageNo);
                p.Add("@ItemsPerPage", itemsPerPage);
                p.Add("@PagePerDisplay", pagePerDisplay);

                var data = await this.ExecuteMultipleAsync("[dbo].[usp_message_gateway_getAll]", p);

                return new PagedData<MessageGatewayInfo>
                {
                    Data = data.ReadAsList<MessageGatewayInfo>(),
                    Pager = data.ReadAsObject<Pager>()
                };
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public async Task<DbResult> SaveMessageGateway(MessageGatewayInfo gateway)
        {
            try
            {
                var p = new Parameters();

                p.Add("@MessageGatewayId", gateway.MessageGatewayId);
                p.Add("@GatewayName", gateway.GatewayName);
                p.Add("@GatewayURL", gateway.GatewayURL);
                p.Add("@GatewayPort", gateway.GatewayPort);
                p.Add("@IsActive", gateway.IsActive);
                p.Add("@Username", gateway.Username);


                return await this.ExecuteDbResultAsync("dbo.[usp_message_gateway_save]", p);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public MessageGatewayInfo GetMessageGatewayByIdSync(int messageGatewayId)
        {
            try
            {
                var p = new Parameters();
                p.Add("@MessageGatewayId", messageGatewayId);
                var data = this.ExecuteAsObject<MessageGatewayInfo>("[dbo].[usp_message_gateway_getById]", p);

                return data;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public IEnumerable<MessageGatewayInfo> GetMessageGatewaysSync()
        {
            try
            {
                var data = this.ExecuteAsList<MessageGatewayInfo>("[dbo].[usp_message_gateway_getAllForDDL]");

                return data;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public async Task<DbResult> DeleteMessageGateway(int messageGatewayId, string username)
        {
            try
            {
                Parameters p = new Parameters();
                p.Add("@MessageGatewayId", messageGatewayId);
                p.Add("@Username", username);

                return await this.ExecuteDbResultAsync("[dbo].[usp_message_gateway_delete]", p);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion
    }
}

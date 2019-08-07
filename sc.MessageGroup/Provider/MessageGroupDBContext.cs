using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using sc.data;

namespace sc.MessageGroup
{
    public class MessageGroupDBContext : DbContext
    {
        public MessageGroupDBContext(): base("DefaultConnection") { }

        public async Task<PagedData<MessageGroupReturnInfo>> GetMessageGroups(string groupName, byte isActive, int pageNo, int itemsPerPage, int pagePerDisplay)
        {
            try
            {
                Parameters p = new Parameters();
                p.Add("@GroupName", groupName);
                p.Add("@IsActive", isActive);
                p.Add("@PageNo", pageNo);
                p.Add("@ItemsPerPage", itemsPerPage);
                p.Add("@PagePerDisplay", pagePerDisplay);

                var data = await this.ExecuteMultipleAsync("[dbo].[usp_message_group_getAll]", p);

                return new PagedData<MessageGroupReturnInfo>
                {
                    Data = data.ReadAsList<MessageGroupReturnInfo>(),
                    Pager = data.ReadAsObject<Pager>()
                };
            }
            catch (Exception ex)
            {

                throw ex;
            }
            
        }

        public async Task<MessageGroupReturnInfo> GetMessageGroupById(int groupId)
        {
            try
            {
                Parameters p = new Parameters();
                p.Add("@GroupId", groupId);

                var data = await this.ExecuteAsObjectAsync<MessageGroupReturnInfo>("[dbo].[usp_message_group_getById]", p);

                return data;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public async Task<DbResult> DeleteMessageGroup(int[] groups, string username)
        {
            try
            {
                var groupsXML = new XElement("Root", groups.Select(x => new XElement("Groups", new XElement("GroupID", x)))).ToString();
                Parameters p = new Parameters();
                p.Add("@Groups", groupsXML);
                p.Add("@Username", username);

                return await this.ExecuteDbResultAsync("[dbo].[usp_message_group_delete]", p);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<DbResult> SaveMessageGroup(MessageGroupInfo group)
        {
            try
            {
                var p = new Parameters();

                p.Add("@GroupId", group.GroupId);
                p.Add("@GroupName", group.GroupName);
                p.Add("@IsActive", group.IsActive);
                p.Add("@Username", group.Username);

                return await this.ExecuteDbResultAsync("dbo.[usp_message_group_save]", p);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<IEnumerable<MessageGroupReturnInfo>> GetMessageGroups()
        {
            try
            {
                var data = await this.ExecuteAsListAsync<MessageGroupReturnInfo>("[dbo].[usp_message_group_getAllForDDL]");

                return data;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
    }
}

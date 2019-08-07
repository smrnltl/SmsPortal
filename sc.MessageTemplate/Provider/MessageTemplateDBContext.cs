using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using sc.data;

namespace sc.MessageTemplate
{
    public class MessageTemplateDBContext : DbContext
    {
        public MessageTemplateDBContext(): base("DefaultConnection") { }

        #region Message Template
        public async Task<IEnumerable<MessageTemplateInfo>> GetMessageTemplates()
        {
            try
            {
                var data = await this.ExecuteAsListAsync<MessageTemplateInfo>("[dbo].[usp_message_template_getAllForDDL]");

                return data;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public async Task<MessageTemplateInfo> GetMessageTemplateById(int messageTemplateId)
        {
            try
            {
                var p = new Parameters();
                p.Add("@MessageTemplateId", messageTemplateId);
                var data = await this.ExecuteAsObjectAsync<MessageTemplateInfo>("[dbo].[usp_message_template_getById]", p);

                return data;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public async Task<PagedData<MessageTemplateInfo>> GetMessageTemplates(string templateName, byte isActive, int pageNo, int itemsPerPage, int pagePerDisplay)
        {
            try
            {
                Parameters p = new Parameters();
                p.Add("@TemplateName", templateName);
                p.Add("@IsActive", isActive);
                p.Add("@PageNo", pageNo);
                p.Add("@ItemsPerPage", itemsPerPage);
                p.Add("@PagePerDisplay", pagePerDisplay);

                var data = await this.ExecuteMultipleAsync("[dbo].[usp_message_template_getAll]", p);

                return new PagedData<MessageTemplateInfo>
                {
                    Data = data.ReadAsList<MessageTemplateInfo>(),
                    Pager = data.ReadAsObject<Pager>()
                };
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public async Task<DbResult> SaveMessageTemplate(MessageTemplateInfo template)
        {
            try
            {
                var p = new Parameters();

                p.Add("@MessageTemplateId", template.MessageTemplateId);
                p.Add("@TemplateName", template.TemplateName);
                p.Add("@Description", template.Description);
                p.Add("@IsActive", template.IsActive);
                p.Add("@Username", template.Username);


                return await this.ExecuteDbResultAsync("dbo.[usp_message_template_save]", p);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public MessageTemplateInfo GetMessageTemplateByIdSync(int messageTemplateId)
        {
            try
            {
                var p = new Parameters();
                p.Add("@MessageTemplateId", messageTemplateId);
                var data = this.ExecuteAsObject<MessageTemplateInfo>("[dbo].[usp_message_template_getById]", p);

                return data;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public IEnumerable<MessageTemplateInfo> GetMessageTemplatesSync()
        {
            try
            {
                var data = this.ExecuteAsList<MessageTemplateInfo>("[dbo].[usp_message_template_getAllForDDL]");

                return data;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public async Task<DbResult> DeleteMessageTemplate(int messageTemplateId, string username)
        {
            try
            {
                Parameters p = new Parameters();
                p.Add("@MessageTemplateId", messageTemplateId);
                p.Add("@Username", username);

                return await this.ExecuteDbResultAsync("[dbo].[usp_message_template_delete]", p);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion
    }
}

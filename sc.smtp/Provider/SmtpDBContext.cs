using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.IO;
using sc.data;

namespace sc.smtp
{
    public class SmtpDbContext : DbContext
    {
        public SmtpDbContext() : base("DefaultConnection") { }

        public async Task<SmtpReturnInfo> GetSmtp()
        {
            return await this.ExecuteAsObjectAsync<SmtpReturnInfo>("dbo.usp_smtp_config_get");
        }

        public SmtpReturnInfo GetSmtpSync()
        {
            return this.ExecuteAsObject<SmtpReturnInfo>("dbo.usp_smtp_config_get");
        }


        public async Task<DbResult> SaveSmtp(SmtpInfo smtp)
        {
            try
            {
                var p = new Parameters();

                p.Add("@HostName", smtp.HostName);
                p.Add("@PortNo", smtp.PortNo);
                p.Add("@EnableSSL",smtp.EnableSSL);
                p.Add("@UseAuthentication",smtp.UseAuthentication);
                p.Add("@DisplayName",smtp.DisplayName);
                p.Add("@FromAddress", smtp.FromAddress);
                p.Add("@Password", smtp.Password);
                p.Add("@ToAddress", smtp.ToAddress);
                p.Add("@AddedBy", smtp.AddedBy);

                return await this.ExecuteDbResultAsync("dbo.usp_smtp_config_save", p);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}

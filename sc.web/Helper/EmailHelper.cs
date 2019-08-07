using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Web;

using sc.smtp;
using System.Threading.Tasks;

namespace sc.web.Helper
{
    public class EmailHelper
    {
        public static void SendEmail(string Subject, string Body, ArrayList AttachmentFiles, string CC, string BCC, bool IsHtmlFormat, string ToAddress)
        {
            SmtpDbContext _smtpDbContext = new SmtpDbContext();
            SmtpReturnInfo smtpInfo = _smtpDbContext.GetSmtpSync();

            string To = string.IsNullOrEmpty(ToAddress) ? smtpInfo.ToAddress : ToAddress;
            string From = smtpInfo.FromAddress;
            string SMTPServer = smtpInfo.HostName;
            int ServerPort = smtpInfo.PortNo;
            bool SMTPAuthentication = smtpInfo.UseAuthentication;
            bool SMTPEnableSSL = smtpInfo.EnableSSL;
            string SMTPPassword = smtpInfo.Password;
            string SMTPUsername = smtpInfo.FromAddress;
            try
            {
                MailMessage myMessage = new MailMessage();
                myMessage.To.Add(To);
                myMessage.From = new MailAddress(SMTPUsername);
                myMessage.Subject = Subject;
                myMessage.Body = Body;
                myMessage.IsBodyHtml = true;

                if (CC.Length != 0)
                    myMessage.CC.Add(CC);

                if (BCC.Length != 0)
                    myMessage.Bcc.Add(BCC);

                if (AttachmentFiles != null)
                {
                    foreach (string x in AttachmentFiles)
                    {
                        if (File.Exists(x)) myMessage.Attachments.Add(new Attachment(x));
                    }
                }
                SmtpClient smtp = new SmtpClient();
                if (SMTPAuthentication)
                {
                    if (SMTPUsername.Length > 0 && SMTPPassword.Length > 0)
                    {
                        smtp.Credentials = new System.Net.NetworkCredential(SMTPUsername, SMTPPassword);
                    }
                }
                smtp.EnableSsl = SMTPEnableSSL;

                smtp.Host = SMTPServer;
                smtp.Port = ServerPort;
                smtp.Send(myMessage);
            }

            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static void SendEmailAsync(string Subject, string Body, ArrayList AttachmentFiles, string CC, string BCC, bool IsHtmlFormat, string ToAddress)
        {
            SmtpDbContext _smtpDbContext = new SmtpDbContext();
            SmtpReturnInfo smtpInfo = _smtpDbContext.GetSmtpSync();

            string To = string.IsNullOrEmpty(ToAddress) ? smtpInfo.ToAddress : ToAddress;
            string From = smtpInfo.FromAddress;
            string SMTPServer = smtpInfo.HostName;
            int ServerPort = smtpInfo.PortNo;
            bool SMTPAuthentication = smtpInfo.UseAuthentication;
            bool SMTPEnableSSL = smtpInfo.EnableSSL;
            string SMTPPassword = smtpInfo.Password;
            string SMTPUsername = smtpInfo.FromAddress;
            try
            {
                MailMessage myMessage = new MailMessage();
                myMessage.To.Add(To);
                myMessage.From = new MailAddress(SMTPUsername);
                myMessage.Subject = Subject;
                myMessage.Body = Body;
                myMessage.IsBodyHtml = true;

                if (CC.Length != 0)
                    myMessage.CC.Add(CC);

                if (BCC.Length != 0)
                    myMessage.Bcc.Add(BCC);

                if (AttachmentFiles != null)
                {
                    foreach (string x in AttachmentFiles)
                    {
                        if (File.Exists(x)) myMessage.Attachments.Add(new Attachment(x));
                    }
                }
                SmtpClient smtp = new SmtpClient();
                if (SMTPAuthentication)
                {
                    if (SMTPUsername.Length > 0 && SMTPPassword.Length > 0)
                    {
                        smtp.Credentials = new System.Net.NetworkCredential(SMTPUsername, SMTPPassword);
                    }
                }
                smtp.EnableSsl = SMTPEnableSSL;

                smtp.Host = SMTPServer;
                smtp.Port = ServerPort;
                smtp.SendMailAsync(myMessage);
            }

            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
}
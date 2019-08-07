using System.Web.Mvc;

namespace sc.web.Areas.Smtp
{
    public class SmtpAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "Smtp";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "Smtp_default",
                "Smtp/{controller}/{action}/{id}",
                new { area = "Smtp", controller = "SmtpAdmin", action = "Smtp", id = UrlParameter.Optional },
                namespaces: new string[] { "Sourcecode.OnlinePolicySystem.Areas.Smtp.Controllers" }
            );
        }
    }
}
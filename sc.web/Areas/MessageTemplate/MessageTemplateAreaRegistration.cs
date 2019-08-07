using System.Web.Mvc;

namespace sc.web.Areas.MessageTemplate
{
    public class MessageTemplateAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "MessageTemplate";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "MessageTemplate_default",
                "MessageTemplate/{controller}/{action}/{id}",
                new { area = "MessageTemplate", controller = "MessageTemplateAdmin", action = "MessageTemplateList", id = UrlParameter.Optional },
                namespaces: new string[] { "sc.web.Areas.MessageTemplate.Controllers" }
            );
        }
    }
}
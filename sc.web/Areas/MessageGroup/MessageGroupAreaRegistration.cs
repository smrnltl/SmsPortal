using System.Web.Mvc;

namespace sc.web.Areas.MessageGroup
{
    public class MessageGroupAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "MessageGroup";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "MessageGroup_default",
                "MessageGroup/{controller}/{action}/{id}",
                new { area = "MessageGroup", controller = "MessageGroupAdmin", action = "MessageGroupList", id = UrlParameter.Optional },
                namespaces: new string[] { "sc.web.Areas.MessageGroup.Controllers" }
            );
        }
    }
}
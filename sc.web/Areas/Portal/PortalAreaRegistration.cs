using System.Web.Mvc;

namespace sc.web.Areas.Portal
{
    public class PortalAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "Portal";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "Portal_default",
                "Portal/{controller}/{action}/{id}",
                new { area = "Portal", controller = "PortalAdmin", action = "PortalList", id = UrlParameter.Optional },
                namespaces: new string[] { "sc.web.Areas.Portal.Controllers" }
            );
        }
    }
}
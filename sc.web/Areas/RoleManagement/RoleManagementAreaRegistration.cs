using System.Web.Mvc;

namespace sc.web.Areas.RoleManagement
{
    public class RoleManagementAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "RoleManagement";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "RoleManagement_default",
                "RoleManagement/{controller}/{action}/{id}",
                new { area = "RoleManagement", controller = "RoleManagementAdmin", action = "RoleList", id = UrlParameter.Optional },
                namespaces: new string[] { "sc.web.Areas.RoleManagement.Controllers" }
            );
        }
    }
}
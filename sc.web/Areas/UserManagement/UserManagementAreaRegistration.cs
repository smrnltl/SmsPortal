using System.Web.Mvc;

namespace sc.web.Areas.UserManagement
{
    public class UserManagementAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "UserManagement";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "UserManagement_default",
                "UserManagement/{controller}/{action}/{id}",
                new { area = "UserManagement", controller = "UserManagementAdmin", action = "UserList", id = UrlParameter.Optional },
                namespaces: new string[] { "sc.web.Areas.UserManagement.Controllers" }
            );
        }
    }
}
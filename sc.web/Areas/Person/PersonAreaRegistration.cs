using System.Web.Mvc;

namespace sc.web.Areas.Person
{
    public class PersonAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "Person";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "Person_default",
                "Person/{controller}/{action}/{id}",
                new { area = "Person", controller = "PersonAdmin", action = "PersonList", id = UrlParameter.Optional },
                namespaces: new string[] { "sc.web.Areas.Person.Controllers" }
            );
        }
    }
}
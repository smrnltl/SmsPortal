using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(sc.web.Startup))]
namespace sc.web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);

            app.CreatePerOwinContext<ApplicationRoleManager>(ApplicationRoleManager.Create);
        }
    }
}

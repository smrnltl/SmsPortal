using System.Web;
using System.Web.Optimization;

namespace sc.web
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.min.js",
                      "~/Scripts/respond.min.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.min.css",
                      "~/Content/site.css"));

            bundles.Add(new StyleBundle("~/AdminCss").Include(
                "~/AdminTemplate/css/lib/bootstrap/bootstrap.min.css",
                "~/AdminTemplate/css/lib/calendar2/semantic.ui.min.css",
                "~/AdminTemplate/css/lib/calendar2/pignose.calendar.min.css",
                "~/AdminTemplate/css/lib/owl.carousel.min.css",
                "~/AdminTemplate/css/lib/owl.theme.default.min.css",
                "~/AdminTemplate/css/helper.css",
                "~/AdminTemplate/css/style.css",
                "~/Content/igrowl.min.css",
                "~/Content/feather.css",
                "~/Content/impromptu.css",
                "~/AdminTemplate/css/addbutton.css",
                "~/AdminTemplate/js/sumoselect/sumoselect.css"
                ));

            bundles.Add(new ScriptBundle("~/PreloadedJs").Include(
                "~/AdminTemplate/js/lib/jquery/jquery.min.js",
                "~/AdminTemplate/js/lib/jquery-ui/jqueryui.min.js",
                "~/AdminTemplate/js/lib/bootstrap/js/bootstrap.min.js",
                "~/AdminTemplate/js/sumoselect/jquery.sumoselect.js",
                "~/Scripts/igrowl.min.js",
                "~/Scripts/impromptu.js",
                "~/Scripts/validate.js",
                "~/ckeditor/ckeditor.js",
                "~/AdminTemplate/js/lib/bootstrap/js/popper.min.js",
                "~/Scripts/utility.js",
                "~/Scripts/pagination.js"
                ));

            bundles.Add(new ScriptBundle("~/AdminJs").Include(
                "~/AdminTemplate/js/jquery.slimscroll.js",
                "~/AdminTemplate/js/sidebarmenu.js",
                "~/AdminTemplate/js/lib/sticky-kit-master/dist/sticky-kit.min.js",
                "~/AdminTemplate/js/lib/calendar-2/moment.latest.min.js",
                "~/AdminTemplate/js/lib/calendar-2/semantic.ui.min.js",
                "~/AdminTemplate/js/lib/calendar-2/prism.min.js",
                "~/AdminTemplate/js/lib/calendar-2/pignose.calendar.min.js",
                "~/AdminTemplate/js/lib/calendar-2/pignose.init.js",
                "~/AdminTemplate/js/lib/owl-carousel/owl.carousel.min.js",
                "~/AdminTemplate/js/lib/owl-carousel/owl.carousel-init.js",
                "~/AdminTemplate/js/scripts.js"
                //"~/Scripts/main.js"
                ));
        }
    }
}

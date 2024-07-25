using Microsoft.AspNetCore.Mvc;

namespace SJC_Portal.Controllers
{
    public class ProjectsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}

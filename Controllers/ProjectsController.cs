using Microsoft.AspNetCore.Mvc;
using SJC_Portal.Data;

namespace SJC_Portal.Controllers
{
    public class ProjectsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public string Projects()
        {
            return SampleData.Project1;
        }
    }
}

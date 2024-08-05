using Microsoft.AspNetCore.Mvc;
using SJC_Portal.Data;
using Newtonsoft.Json;
using MongoDB.Bson;
using MongoDB.Driver;

namespace SJC_Portal.Controllers
{
    public class ProjectsController : Controller
    {

        private IHttpContextAccessor _contex;
        public ProjectsController(IHttpContextAccessor contex)
        {
            _contex = contex;
        }

        public IActionResult Index()
        {
            return View();
        }












        private T GetRequestBody<T>()
        {
            StreamReader streamReader = new StreamReader(_contex.HttpContext.Request.Body);
            return JsonConvert.DeserializeObject<T>(streamReader.ReadToEndAsync().Result);
        }

        
    }
}

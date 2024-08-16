using Microsoft.AspNetCore.Mvc;
using SJC_Portal.Data;
using Newtonsoft.Json;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Bson.Serialization;
using SJC_Portal.Data.Enums;
using SJC_Portal.Data.Parameters;

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

        public IActionResult InvoiceSummary() 
        {
            return View();
        }

        public IActionResult ProjectSummary() 
        {
            return View();
        }

        public IActionResult Summary()
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

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
            if (_contex.HttpContext != null)
            {
                string? tablename = _contex.HttpContext.Session.GetString("tableName");
                if (tablename != null && tablename.Length > 0)
                {
                    return View();
                }
                else { return RedirectToAction("Index", "Home"); }
            }
            else { return RedirectToAction("Index", "Home"); }
        }










        private T GetRequestBody<T>()
        {
            StreamReader streamReader = new StreamReader(_contex.HttpContext.Request.Body);
            return JsonConvert.DeserializeObject<T>(streamReader.ReadToEndAsync().Result);
        }

    }
}

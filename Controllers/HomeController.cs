using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using SJC_Portal.Data;
using SJC_Portal.Models;
using System.Diagnostics;

namespace SJC_Portal.Controllers
{
    public class HomeController : Controller
    {
        private IHttpContextAccessor _contex;
        public HomeController(IHttpContextAccessor ctext)
        {
            _contex = ctext;
        }

        public IActionResult Index()
        {
            UserInfo? user = GetUserInSession();
            if (user == null)
            {
                return RedirectToAction("Login", "User");
            }
            else
            {
                SetUserInSession(user);
                return View();
            }
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        private UserInfo? GetUserInSession()
        {
            string? jsonUser = _contex.HttpContext.Session.GetString("user");
            if (jsonUser != null && jsonUser.Length > 0)
            {
                return BsonSerializer.Deserialize<UserInfo>(jsonUser);
            }
            else { return null; }
        }

        private void SetUserInSession(UserInfo user)
        {
            if (user != null && user._id != null)
            {
                string jsonUser = Newtonsoft.Json.JsonConvert.SerializeObject(user);
                _contex.HttpContext.Session.SetString("user", jsonUser);
            }
        }
    }
}

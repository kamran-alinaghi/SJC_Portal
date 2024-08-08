using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using SJC_Portal.Data;

namespace SJC_Portal.Controllers
{
    public class UserController : Controller
    {
        MongoClient MongoDB;
        IMongoCollection<UserInfo> tableCollection;
        private IHttpContextAccessor _contex;
        public UserController(IHttpContextAccessor contex)
        {
            MongoDB = new MongoClient(GeneralData.ConnectionString);
            tableCollection = MongoDB.GetDatabase(GeneralData.ProjectsDatabaseName).GetCollection<UserInfo>(GeneralData.UsersTableName);
            _contex = contex;
        }

        [HttpPost]
        public IActionResult Index(string username, string password)
        {
            UserInfo? user = GetUserInSession();
            if (user == null)
            {
                if (username.Length > 0 && password.Length > 0)
                {
                    user = GetUserFromDB(username, password).Result;
                    SetUserInSession(user);
                    return RedirectToAction("Index", "Home");
                }
                else { return RedirectToAction("Login", "User"); }
            }
            else { return RedirectToAction("Login", "User"); }
        }

        [HttpPost]
        public IActionResult EditUser(string name, string family, string email, string streetAddress, string city, string province, string country, string postalCode, string birthDate)
        {
            UserInfo? user = GetUserInSession();
            if (user == null)
            {
                return RedirectToAction("Login", "User");
            }
            else
            {
                user.Name = name;
                user.Family = family;
                user.Email = email;
                user.StreetAddress = streetAddress;
                user.City = city;
                user.Province = province;
                user.Country = country;
                user.PostalCode = postalCode;
                user.Birthdate = birthDate;
                FilterDefinition<UserInfo> filter = Builders<UserInfo>.Filter.Eq(u => u._id, user._id);
                UpdateDefinition<UserInfo> update = Builders<UserInfo>.Update
                    .Set(p => p.Name, name)
                    .Set(p => p.Family, family)
                    .Set(p => p.Email, email)
                    .Set(p => p.StreetAddress, streetAddress)
                    .Set(p => p.City, city)
                    .Set(p => p.Province, province)
                    .Set(p => p.Country, country)
                    .Set(p => p.PostalCode, postalCode)
                    .Set(p => p.Birthdate, birthDate);
                tableCollection.UpdateOne(filter, update);
                SetUserInSession(user);
                return RedirectToAction("Dashboard", "User");
            }
        }

        public IActionResult Login()
        {
            return View();
        }

        public IActionResult Dashboard()
        {
            UserInfo? user = GetUserInSession();
            if (user != null && user._id != null)
            {
                SetUserInSession(user);
                return View(user);
            }
            else { return RedirectToAction("Login", "User"); }
        }







        private async Task<UserInfo> GetUserFromDB(string username, string password)
        {
            FilterDefinition<UserInfo> filter = Builders<UserInfo>.Filter.Eq(u => u.Username, username.ToLower()) & Builders<UserInfo>.Filter.Eq(u => u.Password, password);
            UserInfo user = await tableCollection.Find(filter).FirstOrDefaultAsync();
            return user;
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

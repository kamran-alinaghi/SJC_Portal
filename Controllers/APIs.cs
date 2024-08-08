using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Bson.IO;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using Newtonsoft.Json;
using SJC_Portal.Data;
using System.Net;
using System.Reflection;

namespace SJC_Portal.Controllers
{
    public class APIs : Controller
    {
        MongoClient MongoDB;
        IMongoCollection<SJC_Project> collection;
        IMongoCollection<UserInfo> userCollection;
        private IHttpContextAccessor _contex;
        public APIs(IHttpContextAccessor contex)
        {
            MongoDB = new MongoClient(GeneralData.ConnectionString);
            collection = MongoDB.GetDatabase(GeneralData.ProjectsDatabaseName).GetCollection<SJC_Project>(GeneralData.ProjectsTableName);
            userCollection = MongoDB.GetDatabase(GeneralData.ProjectsDatabaseName).GetCollection<UserInfo>(GeneralData.UsersTableName);
            _contex = contex;
        }


        [HttpPost]
        public string ProjectsList()
        {
            List<SJC_Project> resList = GetDataFromDB().Result;
            return Newtonsoft.Json.JsonConvert.SerializeObject(resList);
        }

        [HttpPost]
        public void SaveProject()
        {
            SJC_Project? param;
            param = GetRequestBody<SJC_Project>();
            if (param != null)
            {
                param._id = ObjectId.GenerateNewId();
                collection.InsertOne(param);
            }
        }

        [HttpPost]
        public void UpdateProject()
        {
            SJC_Project? param = GetRequestBody<SJC_Project>();
            if (param != null)
            {
                FilterDefinition<SJC_Project> filter = Builders<SJC_Project>.Filter.Eq(project => project._id, param._id);
                UpdateDefinition<SJC_Project> update = Builders<SJC_Project>.Update
                    .Set(p => p.Title, param.Title)
                    .Set(p => p.IsCompelete, param.IsCompelete)
                    .Set(p => p.ContractDate, param.ContractDate)
                    .Set(p => p.TotalBudget, param.TotalBudget)
                    .Set(p => p.FramingBudget, param.FramingBudget)
                    .Set(p => p.BuildingQty, param.BuildingQty)
                    .Set(p => p.FramingContractNo, param.FramingContractNo)
                    .Set(p => p.FormingContractNo, param.FormingContractNo);
                collection.UpdateOne(filter, update);
            }
        }

        [HttpPost]
        public void DeleteProject()
        {
            SJC_Project? param = GetRequestBody<SJC_Project>();
            if (param != null)
            {
                FilterDefinition<SJC_Project> filter = Builders<SJC_Project>.Filter.Eq(project => project._id, param._id);
                collection.DeleteOne(filter);
            }
        }
        [HttpPost]
        public string GetInvoices()
        {
            SJC_Project? project = GetRequestBody<SJC_Project>();
            if (project != null)
            {
                SJC_Project tempProject = GetOneProject(project._id).Result;
                return Newtonsoft.Json.JsonConvert.SerializeObject(tempProject.InvoiceList);
            }
            else { return ""; }
        }

        [HttpPost]
        public void UpdateUser()
        {
            UserInfo? currentUser = GetUserInSession();
            UserEditParam? param = GetRequestBody<UserEditParam>();
            FilterDefinition<UserInfo> filter = Builders<UserInfo>.Filter.Eq(u => u.Username, param.OldUsername) & Builders<UserInfo>.Filter.Eq(u => u.Password, param.OldPassword);
            UpdateDefinition<UserInfo> update = Builders<UserInfo>.Update
                .Set(u => u.Username, param.NewUsername)
                .Set(u => u.Password, param.NewPassword);
            var res = userCollection.UpdateOne(filter, update);
            currentUser.Username = param.NewUsername;
            currentUser.Password = param.NewPassword;
            SetUserInSession(currentUser);
        }







        private T? GetRequestBody<T>()
        {
            if (_contex.HttpContext != null)
            {
                StreamReader streamReader = new StreamReader(_contex.HttpContext.Request.Body);
                string str = streamReader.ReadToEndAsync().Result;
                T p = BsonSerializer.Deserialize<T>(str);
                return p;
            }
            else { return default(T); }
        }

        private async Task<List<SJC_Project>> GetDataFromDB()
        {
            List<SJC_Project> document = await collection.Find(new BsonDocument()).ToListAsync();
            return document;
        }

        private async Task<SJC_Project> GetOneProject(ObjectId? id)
        {
            if (id != null)
            {
                FilterDefinition<SJC_Project> filter = Builders<SJC_Project>.Filter.Eq(project => project._id, id);
                SJC_Project sJC_Project = await collection.Find(filter).FirstOrDefaultAsync();
                return sJC_Project;
            }
            else { return new SJC_Project(); }
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

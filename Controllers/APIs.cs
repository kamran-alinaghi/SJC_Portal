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
        private IHttpContextAccessor _contex;
        public APIs(IHttpContextAccessor contex)
        {
            MongoDB = new MongoClient(GeneralData.ConnectionString);
            collection = MongoDB.GetDatabase(GeneralData.ProjectsDatabaseName).GetCollection<SJC_Project>(GeneralData.ProjectsTableName);
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
            param = GetRequestBody();
            if (param != null)
            {
                param._id = ObjectId.GenerateNewId();
                collection.InsertOne(param);
            }
        }

        [HttpPost]
        public void UpdateProject()
        {
            SJC_Project? param = GetRequestBody();
            if(param != null)
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
            SJC_Project? param = GetRequestBody();
            if (param != null)
            {
                FilterDefinition<SJC_Project> filter = Builders<SJC_Project>.Filter.Eq(project => project._id, param._id);
                collection.DeleteOne(filter);
            }
        }







        private SJC_Project? GetRequestBody()
        {
            if (_contex.HttpContext != null)
            {
                StreamReader streamReader = new StreamReader(_contex.HttpContext.Request.Body);
                string str = streamReader.ReadToEndAsync().Result;
                SJC_Project p=BsonSerializer.Deserialize<SJC_Project>(str);
                return p;
            }
            else { return null; }
        }

        private async Task<List<SJC_Project>> GetDataFromDB()
        {
            List<SJC_Project> document = await collection.Find(new BsonDocument()).ToListAsync();
            return document;
        }
    }
}

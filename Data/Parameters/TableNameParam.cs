using MongoDB.Bson;

namespace SJC_Portal.Data.Parameters
{
    public class TableNameParam
    {
        public ObjectId? _id {  get; set; }
        public string? Name { get; set; }
    }
}

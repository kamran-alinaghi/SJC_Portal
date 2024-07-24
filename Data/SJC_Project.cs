using MongoDB.Bson;

namespace SJC_Portal.Data
{
    public class SJC_Project
    {
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString();
        public string? Title { get; set; }
        public string? ContractDate { get; set; }
        public string? Budget { get; set; }
        public string? BuildingQty { get; set; }
        public bool? PercentBase { get; set; }
        public string? FramingContractNo { get; set; }
        public string? FormingContractNo { get; set; }
        public IEnumerable<Invoice> InvoiceList { get; set; }
    }
}

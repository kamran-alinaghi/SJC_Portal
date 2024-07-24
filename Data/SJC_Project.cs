using MongoDB.Bson;

namespace SJC_Portal.Data
{
    public class SJC_Project
    {
        public int Id { get; set; } 
        public string? Title { get; set; }
        public string? ContractDate { get; set; }
        public double? TotalBudget { get; set; }
        public double? FramingBudget { get; set; }
        public int? BuildingQty { get; set; }
        public bool? PercentBase { get; set; }
        public string? FramingContractNo { get; set; }
        public string? FormingContractNo { get; set; }
        public IEnumerable<Invoice>? InvoiceList { get; set; }
    }
}

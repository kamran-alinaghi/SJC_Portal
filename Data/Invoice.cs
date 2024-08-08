namespace SJC_Portal.Data
{
    public class Invoice
    {
        public int? InvoiceNumber { get; set; }
        public string? InvoiceDate { get; set; }
        public IEnumerable<BuildingDetails>? Buildings { get; set; }
        public BuildingDetails? ToBeInvoiced { get; set; }
        public double? InvoiceCharge { get; set; }
        public double? CraneCharge { get; set; }

    }
}

namespace SJC_Portal.Data
{
    public class FramingInvoice
    {
        public int? InvoiceNumber { get; set; }
        public string? InvoiceDate { get; set; }
        public IEnumerable<PairList>? Buildings { get; set; }
        public IEnumerable<PairList>? ToBeInvoiced { get; set; }
        public double? InvoiceCharge { get; set; }
        public double? CraneCharge { get; set; }

    }
}

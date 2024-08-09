namespace SJC_Portal.Data.Project_Classes
{
    public class FormingInvoice
    {
        public int? InvoiceNumber { get; set; }
        public string? InvoiceDate { get; set; }
        public PairList? Buildings { get; set; }
        public PairList? ToBeInvoiced { get; set; }
        public double? InvoiceCharge { get; set; }
    }
}

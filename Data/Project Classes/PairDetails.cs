namespace SJC_Portal.Data
{
    public class PairDetails
    {
        public string? Title { get; set; }
        public double? Value { get; set; }
        public double? Percent {  get; set; }
        public double? SecondValue { get; set; }
    }

    public class PairList
    {
        public IEnumerable<PairDetails>? Pairs { get; set; }
    }
}

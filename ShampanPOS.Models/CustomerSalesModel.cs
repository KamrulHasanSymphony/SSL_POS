namespace ShampanPOS.Models
{
    public class CustomerSalesModel
    {
        public int? CustomerId { get; set; }
        public int? BranchId { get; set; }
        public string? CustomerName { get; set; }
        public decimal? TotalGrandTotalAmount { get; set; }
        public int? TotalQuantity { get; set; }
    }
}

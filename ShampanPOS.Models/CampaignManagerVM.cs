using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class CampaignManagerVM
    {
        public int BranchId { get; set; }
        public int CustomerId { get; set; }
        public int FreeProductId { get; set; }
        public string FreeProductName { get; set; }
        public int FreeQuantity { get; set; }
        public decimal SDAmount { get; set; }
        public decimal VATamount { get; set; }

        public decimal DiscountRate { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal LineDiscountRate { get; set; }
        public decimal LineDiscountAmount { get; set; }
        public decimal SubTotalAfterDiscount { get; set; }
        public decimal LineTotalAfterDiscount { get; set; }
        public decimal? TotalInvoiceValue { get; set; }

    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class CampaignDetailByProductTotalValueVM
    {

        public int Id { get; set; }
        public int CampaignId { get; set; }
        public int BranchId { get; set; }
        public string? CustomerName { get; set; }

        public int CustomerId { get; set; }
        public string? ProductName { get; set; }
        public int ProductId { get; set; }
        public decimal FromAmount { get; set; }
        public decimal ToAmount { get; set; }
        public decimal DiscountRateBasedOnTotalPrice { get; set; }
        public string? CampaignStartDate { get; set; }
        public string? CampaignEndDate { get; set; }
        public string? CampaignEntryDate { get; set; }

    }

}

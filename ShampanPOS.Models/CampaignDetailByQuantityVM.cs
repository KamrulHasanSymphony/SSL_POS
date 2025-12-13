using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class CampaignDetailByQuantityVM
    {
        public int Id { get; set; }
        public int BranchId { get; set; }
        public int CampaignId { get; set; }
        public int CustomerId { get; set; }
        public string? CustomerName { get; set; }

        public int ProductId { get; set; }
        public string? ProductName { get; set; }

        public decimal FromQuantity { get; set; }
        public int FreeProductId { get; set; }
        public string? FreeProductName { get; set; }

        public decimal FreeQuantity { get; set; }
        public string? CampaignStartDate { get; set; }
        public string? CampaignEndDate { get; set; }
        public string? CampaignEntryDate { get; set; }
    }

}

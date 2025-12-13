using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class MonthlySalesAndAmountCustomerWiseVM
    {
        public int? SL { get; set; }
        public string? CustomerName { get; set; }
        public decimal? TotalQty { get; set; }
        public decimal? GrandTotalAmount { get; set; }
        public decimal? Discount { get; set; }
        public decimal? TotalAmount { get; set; }

    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class MonthlySalesAndAmountProductWiseVM
    {
        public int? SL { get; set; }
        public string? ProductName { get; set; }
        public string? ProductBanglaName { get; set; }
        public decimal? SaleCtnQuantity { get; set; }
        public decimal? RetrunCtnQuantity { get; set; }
        public decimal? ActualCtnQuantity { get; set; }
        public decimal? SalePcsQuantity { get; set; }
        public decimal? RetrunPcsQuantity { get; set; }
        public decimal? ActualPcsQuantity { get; set; }
        public decimal? TotalSaleQuantity { get; set; }
        public decimal? TotalRetrunQuantity { get; set; }
        public decimal? TotalQuantity { get; set; }
        public decimal? NetAmount { get; set; }

    }
}

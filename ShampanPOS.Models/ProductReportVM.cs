using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class ProductReportVM
    {
        public int? SL { get; set; }
        public string? ProductName { get; set; }
        public decimal? ChawkOpening { get; set; }
        public decimal? TotalSale { get; set; }
        public string? Remarks { get; set; }
        public decimal? TotalBalance { get; set; }
        public decimal? StockValue { get; set; }


        public string? BranchName { get; set; }
        public string? BranchAddress { get; set; }


    }
}

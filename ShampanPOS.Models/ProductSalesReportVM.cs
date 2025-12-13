using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class ProductSalesReportVM
    {
        public int? SL { get; set; }
        public string? ProductName { get; set; }
        public string? ProductBanglaName { get; set; }
        public decimal? SaleQuantity { get; set; }
        public decimal? TotalRetrunQuantity { get; set; }
        public decimal? TotalQuantity { get; set; }

    }
}

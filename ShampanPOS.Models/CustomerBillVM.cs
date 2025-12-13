using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class CustomerBillVM
    {
        public int? SL { get; set; }
        public string? CustomerName { get; set; }
        public string? CustomerBanglaName { get; set; }
        public decimal? TotalQuantity { get; set; }
        public decimal? TotalCtnQuantity { get; set; }
        public decimal? GrossAmount { get; set; }
        public decimal? TotalDiscountAmount { get; set; }
        public decimal? NetAmount { get; set; }


    }
}

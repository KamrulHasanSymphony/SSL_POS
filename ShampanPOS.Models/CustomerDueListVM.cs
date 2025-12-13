using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class CustomerDueListVM
    {
        public int? SL { get; set; }
        public string? CustomerName { get; set; }
        public string? CustomerBanglaName { get; set; }
        public string? Date { get; set; }
        public string? BillNo { get; set; }
        public decimal? GrossAmount { get; set; }
        public decimal? DiscountAmount { get; set; }
        public decimal? NetAmount { get; set; }


    }
}

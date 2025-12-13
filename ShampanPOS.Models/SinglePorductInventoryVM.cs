using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class SinglePorductInventoryVM
    {
        public int? SL { get; set; }
        public string? InvoiceRcvIDRtnId { get; set; }
        public string? Date { get; set; }
        public string? ProductName { get; set; }
        public string? ProductBanglaName { get; set; }
        public string? TranType { get; set; }
        public decimal? OpeningQuantity { get; set; }
        public decimal? PurchaseQuantity { get; set; }
        public decimal? SaleQuantity { get; set; }
        public decimal? RetrunQuantity { get; set; }
        public decimal? TotalQty { get; set; }


    }
}

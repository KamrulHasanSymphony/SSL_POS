using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class PurchaseOrderDataVM
    {
        public int Id { get; set; }
        public string? Code { get; set; }
        public int? SupplierId { get; set; }
        public string? SupplierName { get; set; }
        [Display(Name = "Order Date")]
        public string? OrderDate { get; set; }
        public string? DeliveryDateTime { get; set; }
        public string? ProductCode { get; set; }
        public string? ProductName { get; set; }
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public PeramModel PeramModel { get; set; }
        public PurchaseOrderDataVM()
        {
            PeramModel = new PeramModel();
        }
    }
}

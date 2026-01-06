using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class PurchaseDataVM
    {
        public int Id { get; set; }
        public int? PurchaseOrderId { get; set; }

        public string? Code { get; set; }
        public string? PurchaseOrderCode { get; set; }
        public int? SupplierId { get; set; }
        public string? SupplierName { get; set; }
        public string? Comments { get; set; }
        public decimal GrandTotal { get; set; }

        public PeramModel PeramModel { get; set; }
        public PurchaseDataVM()
        {
            PeramModel = new PeramModel();
        }
    }
}

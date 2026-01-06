using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class PaymentDetailVM
    {
        public int Id { get; set; }

        [Display(Name = "Payment")]
        public int? PaymentId { get; set; }
        public string? PaymentCode { get; set; }
        public int? PurchaseId { get; set; }
        public string? PurchaseCode { get; set; }

        [Display(Name = "Supplier")]
        public int? SupplierId { get; set; }

        public string? SupplierName { get; set; }

        [Display(Name = "Comments")]
        public string? Comments { get; set; }

        public decimal PurchaseAmount { get; set; }
        public decimal PaymentAmount { get; set; }
    }
}

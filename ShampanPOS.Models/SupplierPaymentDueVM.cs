using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class SupplierPaymentDueVM
    {
        [DisplayName("Supplier")]
        public int? SupplierId { get; set; }
        [DisplayName("Supplier Code")]
        public string? SupplierCode { get; set; }
        [DisplayName("Supplier Name")]
        public string? SupplierName { get; set; }
        [DisplayName("Branch Code")]
        public string? BranchCode { get; set; }
        [DisplayName("Purchase Amount")]
        public decimal PurchaseAmount { get; set; }
        [DisplayName("Purchase Count")]
        public int? PurchaseCount { get; set; }
        [DisplayName("Total Payment Amount")]
        public decimal TotalPaymentAmount { get; set; }
        [DisplayName("Payment Count")]
        public int? PaymentCount { get; set; }
        [DisplayName("Last Payment Amount")]
        public decimal LastPaymentAmount { get; set; }
        [DisplayName("Due Amount")]
        public decimal DueAmount { get; set; }
        public int? BranchId { get; set; }
        public int? CompanyId { get; set; }
    }
}

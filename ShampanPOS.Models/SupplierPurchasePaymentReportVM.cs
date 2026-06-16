using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{

    public class SupplierPurchasePaymentReportVM
    {
        [DisplayName("Operation")]
        public string? Operation { get; set; }
        [DisplayName("Summary")]
        public bool IsSummary { get; set; }

        // Filters
        [DisplayName("Supplier")]
        public int? SupplierId { get; set; }
        [DisplayName("Supplier Name")]
        public string? SupplierName { get; set; }
        [DisplayName("From Date")]
        public string? FromDate { get; set; }
        [DisplayName("To Date")]    
        public string? ToDate { get; set; }

        // Summary fields
        [DisplayName("Purchase Count")] 
        public int? PurchaseCount { get; set; }
        [DisplayName("Total Purchase Amount")]
        public decimal? TotalPurchaseAmount { get; set; }
        [DisplayName("Payment Count")]
        public int? PaymentCount { get; set; }
        [DisplayName("Total Payment Amount")]
        public decimal? TotalPaymentAmount { get; set; }
        [DisplayName("Outstanding Amount")]
        public decimal? OutstandingAmount { get; set; }

        // Details fields
        [DisplayName("Transaction Type")]
        public string? TransactionType { get; set; }
        [DisplayName("Purchase")]
        public int? PurchaseId { get; set; }
        [DisplayName("Purchase Code")]
        public string? PurchaseCode { get; set; }
        [DisplayName("Purchase Date")]      
        public string? PurchaseDate { get; set; }
        [DisplayName("Purchase Amount")]
        public decimal? PurchaseAmount { get; set; }
        [DisplayName("Payment")]
        public int? PaymentId { get; set; }
        [DisplayName("Payment Code")]
        public string? PaymentCode { get; set; }
        [DisplayName("Payment Date")]
        public string? PaymentDate { get; set; }
        [DisplayName("Payment Amount")] 
        public decimal? PaymentAmount { get; set; }

        // Common
        [DisplayName("Supplier")]
        public int? SupplierIdResult { get; set; }
        [DisplayName("Supplier Code")]
        public string? SupplierCode { get; set; }
        [DisplayName("Supplier Name")]
        public string? SupplierNameResult { get; set; }
    }
}

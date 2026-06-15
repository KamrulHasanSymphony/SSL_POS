using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class CustomerSaleCollectionReportVM
    {
        public int? CustomerId { get; set; }
        [DisplayName("Customer Code")]
        public string? CustomerCode { get; set; }
        [DisplayName("Customer Name")]
        public string? CustomerName { get; set; }
        [DisplayName("Sale")]
        public int? SaleId { get; set; }
        [DisplayName("Sale Code")]
        public string? SaleCode { get; set; }
        [DisplayName("Invoice Date")]       
        public string? InvoiceDate { get; set; }
        [DisplayName("Sale Amount")]
        public decimal? SaleAmount { get; set; }
        [DisplayName("Paid Amount")]
        public decimal? PaidAmount { get; set; }
        [DisplayName("Collection")]
        public int? CollectionId { get; set; }
        [DisplayName("Collection Code")]
        public string? CollectionCode { get; set; }
        [DisplayName("Collection Date")]
        public string? CollectionDate { get; set; }
        [DisplayName("Collection Amount")]
        public decimal? CollectionAmount { get; set; }
        [DisplayName("Transaction Type")]
        public string? TransactionType { get; set; }
        [DisplayName("Summary")]
        public bool IsSummary { get; set; }
        [DisplayName("From Date")]
        public string? FromDate { get; set; }
        [DisplayName("To Date")]
        public string? ToDate { get; set; }
        [DisplayName("Operation")]
        public string? Operation { get; set; }

        // Summary fields
        [DisplayName("Total Sale Count")]
        public int? SaleCount { get; set; }
        [DisplayName("Total Collection Count")]
        public int? CollectionCount { get; set; }
        [DisplayName("Total Sale Amount")]  
        public decimal? TotalSaleAmount { get; set; }
        [DisplayName("Total Collection Amount")]
        public decimal? TotalCollectionAmount { get; set; }
        [DisplayName("Outstanding Amount")]
        public decimal? OutstandingAmount { get; set; }
        [DisplayName("Last Collection Date")]
        public string? LastCollectionDate { get; set; }
        [DisplayName("Last Collection Amount")]
        public decimal? LastCollectionAmount { get; set; }
    }
}

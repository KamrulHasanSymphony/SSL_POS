using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class PurchaseReportVM
    {
        public int Id { get; set; }

        [Display(Name = "Code (Auto Generate)")]
        public string? Code { get; set; }
        public string? Name { get; set; }

        public string? MonthYear { get; set; }
        public int? PurchaseId { get; set; }

        public string? PurchaseCode { get; set; }
        public string? PurchaseNo { get; set; }
        public string? PurchaseOrderNo { get; set; }
        public string? PurchaseReturnNo { get; set; }
        public string? PurchaseReturnId { get; set; }

        public string? UserId { get; set; }

        [Display(Name = "Purchase Order Code")]
        public string? PurchaseOrderCode { get; set; }

        public int? CompanyId { get; set; }

        public int? ProductGroupId { get; set; }
        public int? ProductId { get; set; }

        [Display(Name = "Purchase Date")]
        public string? PurchaseDate { get; set; }

        [Display(Name = "Distributor")]
        public int? BranchId { get; set; }

        [Display(Name = "Supplier")]
        public int? SupplierId { get; set; }

        public string? SupplierName { get; set; }


        [Display(Name = "BE Number (Challan No.)")]
        public string? BENumber { get; set; }

        [Display(Name = "Invoice Date")]
        public string? InvoiceDateTime { get; set; }

        public string? OrderDate { get; set; }
        public string? DeliveryDateTime { get; set; }


        [Display(Name = "Purchase Order")]
        public int? PurchaseOrderId { get; set; }
        public int? PurchasesReturnId { get; set; }

        public decimal SubTotal { get; set; }
        public decimal TotalSD { get; set; }
        public decimal TotalVAT { get; set; }
        public decimal GrandTotal { get; set; }
        public decimal PaidAmount { get; set; }
        public decimal DueAmount { get; set; }

        public string? ProductName { get; set; }
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal? SD { get; set; }
        public decimal? SDAmount { get; set; }
        public decimal? VATRate { get; set; }
        public decimal? VATAmount { get; set; }
        public decimal? OthersAmount { get; set; }
        public decimal? LineTotal { get; set; }
        public string? Operation { get; set; }
 
        [Display(Name = "Purchase From Date")]
        public string? PurchaseFromDate { get; set; }

        [Display(Name = "Purchase To Date")]
        public string? PurchaseToDate { get; set; }

        [Display(Name = "Invoice From Date")]
        public string? InvoiceFromDate { get; set; }

        [Display(Name = "Invoice To Date")]
        public string? InvoiceToDate { get; set; }
        [Display(Name = "Report Type")]
        public string ReportType { get; set; }

        [Display(Name = "Summery")]
        public bool IsSummary { get; set; }

        public string? BranchName { get; set; }

        public string? BranchAddress { get; set; }

        public string? CompanyName { get; set; }

        [Display(Name = "Total Invoice")]
        [DataType(DataType.Currency)]
        public decimal? TotalInvoice { get; set; }
        public string? ProductCode { get; set; }
        public string? SupplierCode { get; set; }

    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class PurchaseReturnReportVM
    {
        public int Id { get; set; }

        [Display(Name = "Code (Auto Generate)")]
        public string? Code { get; set; }

        [Display(Name = "Branch")]
        public int? BranchId { get; set; }
        public int? CompanyId { get; set; }

        public string? UserId { get; set; }

        public string? MonthYear { get; set; }


        public int? ProductGroupId { get; set; }
        public int? ProductId { get; set; }

        [Display(Name = "Supplier")]
        public int? SupplierId { get; set; }

        [Display(Name = "BE Number (Challan No.)")]
        public string? BENumber { get; set; }

        [Display(Name = "Purchase Date")]

        public string? PurchaseDate { get; set; }

        public string? InvoiceDateTime { get; set; }

        public int? DecimalPlace { get; set; }
        public int? PurchaseId { get; set; }
        public string? Operation { get; set; }
        [Display(Name = "Posted")]
        public string? IsPosted { get; set; }
        [Display(Name = "Branch Name")]
        public int? Branchs { get; set; }
        public string? BranchAddress { get; set; }
        public string? CompanyName { get; set; }
        [Display(Name = "From Date")]
        public string? FromDate { get; set; }

        [Display(Name = "To Date")]
        public string? ToDate { get; set; }

        [Display(Name = "Purchase From Date")]
        public string? PurchaseFromDate { get; set; }

        [Display(Name = "Purchase To Date")]
        public string? PurchaseToDate { get; set; }

        [Display(Name = "Invoice From Date")]
        public string? InvoiceFromDate { get; set; }

        [Display(Name = "Invoice To Date")]
        public string? InvoiceToDate { get; set; }


        [Display(Name = "Supplier Name")]
        public string? SupplierName { get; set; }
        public string? BranchName { get; set; }

        public int? Line { get; set; }
        public string? PurchaseReturnDate { get; set; }
        public string? SupplierCode { get; set; }
        public string? ProductCode { get; set; }
        public string? PurchasesReturnCode { get; set; }
        public string? ProductName { get; set; }
        public string? SupplierAddress { get; set; }
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal? SubTotal { get; set; }
        public decimal? SD { get; set; }
        public decimal? SDAmount { get; set; }
        public decimal? VATRate { get; set; }
        public decimal? VATAmount { get; set; }
        public decimal? OthersAmount { get; set; }
        public decimal? LineTotal { get; set; }

        public string? POCode { get; set; }

        [Display(Name = "Report Type")]
        public string ReportType { get; set; }

        [Display(Name = "Summery")]
        public bool IsSummary { get; set; }


        [Display(Name = "Total Invoice")]
        [DataType(DataType.Currency)]
        public decimal? TotalInvoice { get; set; }



    }
}

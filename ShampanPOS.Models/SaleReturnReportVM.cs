using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class SaleReturnReportVM
    {

        public int Id { get; set; }

        [Display(Name = "Sale Return Code(Auto Generate)")]
        public string? Code { get; set; }

        [Display(Name = "Distributor")]
        public int BranchId { get; set; }
        public int? CompanyId { get; set; }
        public string? UserId { get; set; }

        [Display(Name = "Customer")]
        [Required(ErrorMessage = "Customer is required.")]

        public int CustomerId { get; set; }
        public string? CustomerName { get; set; }

        [Display(Name = "Product")]
        public int? ProductId { get; set; }
        public int? ProductGroupId { get; set; }
        public string? ProductName { get; set; }

        public string? ProductCode { get; set; }

        [Display(Name = "Quantity")]
        public decimal Quantity { get; set; }

        [Display(Name = "Unit Rate")]
        public decimal UnitRate { get; set; }

        [Display(Name = "Sub total")]
        public decimal SubTotal { get; set; }

        [Display(Name = "SD")]
        public decimal SD { get; set; }

        [Display(Name = "SD Amount")]
        public decimal SDAmount { get; set; }

        [Required]
        [Display(Name = "VAT Rate")]
        public decimal VATRate { get; set; }

        [Display(Name = "VAT Amount")]
        public decimal VATAmount { get; set; }

        [Display(Name = "Line Total")]
        public decimal LineTotal { get; set; }


        [Display(Name = "Delivery Address")]
        public string? DeliveryAddress { get; set; }
        public int? DecimalPlace { get; set; }

        [Display(Name = "Invoice Date Time")]
        public string? InvoiceDateTime { get; set; }

        public string? Operation { get; set; }
        [Display(Name = "Branch Name")]
        public int? Branchs { get; set; }

        [Display(Name = "From Date")]
        public string? FromDate { get; set; }

        [Display(Name = "To Date")]
        public string? ToDate { get; set; }

        [Display(Name = "Invoice From Date")]
        public string? InvoiceFromDate { get; set; }

        [Display(Name = "Invoice To Date")]
        public string? InvoiceToDate { get; set; }

        //public string?[] IDs { get; set; }
        public string? BranchName { get; set; }
        public string? BranchAddress { get; set; }
        public string? CompanyAddress { get; set; }
        public string? CompanyName { get; set; }
        public bool IsSummary { get; set; }

        [Display(Name = "Report Type")]
        public string ReportType { get; set; }

        [Display(Name = "Total Invoice")]
        [DataType(DataType.Currency)]
        public decimal? TotalInvoice { get; set; }

    }
}

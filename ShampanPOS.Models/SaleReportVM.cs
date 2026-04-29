using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class SaleReportVM
    {

        public int Id { get; set; }

        [Display(Name = "Sale Code(Auto Generate)")]
        public string? Code { get; set; }
        [Display(Name = "Report Type")]

        public int ReportType { get; set; }

        [Display(Name = "Distributor")]
        public int? BranchId { get; set; }
        public int? CompanyId { get; set; }
        public string? UserId { get; set; }
        public int? ProductGroupId { get; set; }

        [Display(Name = "Customer")]
        public int? CustomerId { get; set; }
        public string? CustomerName { get; set; }
        public string? ProductName { get; set; }

        public decimal? RoundUp { get; set; }

        [Display(Name = "Final Payable")]
        public decimal? FinalPayable { get; set; }

        public decimal? AdvancePayment { get; set; }
        public decimal? Payment { get; set; }


        [Display(Name = "Dues Amount")]
        public decimal? Dues { get; set; }

        public decimal TotalSD { get; set; }
        public decimal TotalVAT { get; set; }
        public decimal GrandTotal { get; set; }
        public decimal PaidAmount { get; set; }
        public decimal DueAmount { get; set; }

        [Display(Name = "Delivery Address")]
        public string? DeliveryAddress { get; set; }

        [Display(Name = "Invoice Date")]
        public string? InvoiceDateTime { get; set; }

        [Display(Name = "Comments")]
        public string? Comments { get; set; }

        [Display(Name = "Transaction Type")]
        public string? TransactionType { get; set; }

        [Display(Name = "Expected Delivery Date")]
        public string? DeliveryDate { get; set; }
        public string? OrderDate { get; set; }

        [Display(Name = "Quantity")]
        [DataType(DataType.Currency)]
        public decimal? Quantity { get; set; }

        [Display(Name = "Unit Rate")]
        [DataType(DataType.Currency)]
        public decimal? UnitRate { get; set; }

        [Display(Name = "Sub Total")]
        [DataType(DataType.Currency)]
        public decimal? SubTotal { get; set; }

        [Display(Name = "SD")]
        [DataType(DataType.Currency)]
        public decimal? SD { get; set; }

        [Display(Name = "SD Amount")]
        [DataType(DataType.Currency)]
        public decimal? SDAmount { get; set; }

        [Display(Name = "VAT Rate")]
        public decimal? VATRate { get; set; }

        [Display(Name = "VAT Amount")]
        [DataType(DataType.Currency)]
        public decimal? VATAmount { get; set; }

        [Display(Name = "Line Total")]
        [DataType(DataType.Currency)]
        public decimal? LineTotal { get; set; }

        public int? DecimalPlace { get; set; }
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
        public string? BranchName { get; set; }

        public string? CompanyName { get; set; }

        public bool IsSummary { get; set; }

    }
}

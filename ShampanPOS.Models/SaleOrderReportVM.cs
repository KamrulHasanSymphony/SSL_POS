using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class SaleOrderReportVM
    {

        public int Id { get; set; }

        [Display(Name = "Code(Auto Generate)")]
        public string? Code { get; set; }

        [Display(Name = "Distributor")]
        public int? BranchId { get; set; }
        public string? UserId { get; set; }

        [Display(Name = "Order From Date")]
        public string? OrderFromDate { get; set; }

        [Display(Name = "Order To Date")]
        public string? OrderToDate { get; set; }

        public int? SaleOrderId { get; set; }

        [Display(Name = "Sale Order Code")]
        public string? SaleOrderCode { get; set; }

        [Display(Name = "Delivery From Date")]
        public string? DeliveryFromDate { get; set; }

        [Display(Name = "Delivery To Date")]
        public string? DeliveryToDate { get; set; }


        [Display(Name = "Customer")]
        [Required(ErrorMessage = "Customer is required.")]
        public int? CustomerId { get; set; }

        [Display(Name = "Customer Name")]
        public string? CustomerName { get; set; }

        [Display(Name = "Delivery Address")]
        public string? DeliveryAddress { get; set; }

        [Display(Name = "Expected Delivery Date")]
        public string? DeliveryDate { get; set; }

        [Display(Name = "Order Date")]
        public string? OrderDate { get; set; }

        [Display(Name = "Product")]
        public int? ProductId { get; set; }
        public int? CompanyId { get; set; }
        public string? ProductName { get; set; }
        public string? ProductCode { get; set; }

        [Display(Name = "Quantity")]
        [DataType(DataType.Currency)]
        public decimal? Quantity { get; set; }

        [Display(Name = "Unit Rate")]
        [DataType(DataType.Currency)]
        public decimal? UnitRate { get; set; }

        [Display(Name = "Subtotal")]
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


        [Display(Name = "Total Invoice")]
        [DataType(DataType.Currency)]
        public decimal? TotalInvoice { get; set; }
        public string? InvoiceDateTime { get; set; }
        public string? Operation { get; set; }


        [Display(Name = "From Date")]
        public string? FromDate { get; set; }

        [Display(Name = "To Date")]
        public string? ToDate { get; set; }

        public string? BranchName { get; set; }
        public string? BranchAddress { get; set; }
        public string? CompanyAddress { get; set; }
        public string? CompanyName { get; set; }

        [Display(Name = "Report Type")]

        //public int ReportType { get; set; }

        public string ReportType { get; set; }

        public bool IsSummary { get; set; }
    }
}

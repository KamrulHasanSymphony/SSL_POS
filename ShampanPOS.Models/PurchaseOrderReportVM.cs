using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class PurchaseOrderReportVM
    {
        public int Id { get; set; }

        [Display(Name = "Code (Auto Generate)")]
        public string? Code { get; set; }
        public int? BranchId { get; set; }
        public int? CompanyId { get; set; }
        public string? UserId { get; set; }

        [Display(Name = "Supplier")]
        public int? SupplierId { get; set; }

        [Display(Name = "Supplier Name")]
        public string? SupplierName { get; set; }

        [Display(Name = "Order Date")]
        public string? OrderDate { get; set; }

        [Display(Name = " Expected Delivery Date")]
        public string? DeliveryDateTime { get; set; }

        //public string?[] IDs { get; set; }

        [Display(Name = "Branch Name")]
        public int? Branchs { get; set; }

        [Display(Name = "From Date")]
        public string? FromDate { get; set; }
        public int? DecimalPlace { get; set; }
        [Display(Name = "To Date")]
        public string? ToDate { get; set; }

        [Display(Name = "Order From Date")]
        public string? OrderFromDate { get; set; }

        [Display(Name = "Order To Date")]
        public string? OrderToDate { get; set; }

        [Display(Name = "Delivery From Date")]
        public string? DeliveryFromDate { get; set; }

        [Display(Name = "Delivery To Date")]
        public string? DeliveryToDate { get; set; }
        public string? Operation { get; set; }
        public string? PurchaseOrderCode { get; set; }
        public string? SupplierCode { get; set; }

        [Display(Name = "Product")]
        public int? ProductId { get; set; }
        public string? ProductCode { get; set; }
        public string? ProductName { get; set; }
        public string? Comments { get; set; }

        [Display(Name = "Quantity")]
        [DataType(DataType.Currency)]
        public decimal? Quantity { get; set; }

        [Display(Name = "Unit Price")]
        [DataType(DataType.Currency)]
        public decimal? UnitPrice { get; set; }

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


        [Display(Name = "Others Amount")]
        [DataType(DataType.Currency)]
        public decimal? OthersAmount { get; set; }


        [Display(Name = "Line Total")]
        [DataType(DataType.Currency)]
        public decimal? LineTotal { get; set; }
        public decimal? CompletedQty { get; set; }
        public decimal? RemainQty { get; set; }


        [Display(Name = "Report Type")]
        public int ReportType { get; set; }

        [Display(Name = "Summery")]
        public bool IsSummary { get; set; }
    }
}

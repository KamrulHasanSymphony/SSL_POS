using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
namespace ShampanPOS.Models
{

    public class SaleReturnDetail

    {
        public int Id { get; set; }

        [Display(Name = "Code(Auto Generate)")]
        public string? Code { get; set; }

        [Display(Name = "Branch")]
        public int BranchId { get; set; }

        [Display(Name = "Customer")]
        public int CustomerId { get; set; }
        public string? CustomerName { get; set; }

        [Display(Name = "Sale sperson")]
        public int SalePersonId { get; set; }

        [Display(Name = "Route")]
        public int RouteId { get; set; }

        [Display(Name = "Delivery Address")]
        public string? DeliveryAddress { get; set; }

        [Display(Name = "Vehicle No.")]
        public string? VehicleNo { get; set; }

        [Display(Name = "Vehicle Type")]
        public string? VehicleType { get; set; }


        public string? InvoiceDateTime { get; set; }

        public string? DeliveryDate { get; set; }

        [Display(Name = "Grand Total Amount")]
        public decimal GrandTotalAmount { get; set; }

        [Display(Name = "Grand Total SD Amount")]
        public decimal GrandTotalSDAmount { get; set; }

        [Display(Name = "Grand Total VAT Amount")]
        public decimal GrandTotalVATAmount { get; set; }

        [Display(Name = "Comments")]
        public string? Comments { get; set; }

        [Display(Name = "Printed")]
        public bool IsPrint { get; set; }

        [Display(Name = "Printed By")]
        public string? PrintBy { get; set; }


        public string? PrintOn { get; set; }

        [Display(Name = "Transaction Type")]
        public string? TransactionType { get; set; }

        [Display(Name = "Fiscal Year")]
        public string? FiscalYear { get; set; }

        [Display(Name = "Period")]
        public string? PeriodId { get; set; }

        [Display(Name = "Currency")]
        public int CurrencyId { get; set; }

        [Display(Name = "Currency Rate from BDT")]
        public decimal CurrencyRateFromBDT { get; set; }

        [Display(Name = "Posted")]
        public bool IsPost { get; set; }

        [Display(Name = "Posted By")]
        public string? PostBy { get; set; }


        public string? PostedOn { get; set; }

        [Display(Name = "Created By")]
        public string CreatedBy { get; set; }


        public string? CreatedOn { get; set; }

        [Display(Name = "Last Modified By")]
        public string? LastModifiedBy { get; set; }

        
        public string? LastModifiedOn { get; set; }

        public string? CreatedFrom { get; set; }

        public string? LastUpdateFrom { get; set; }
        public string? Operation { get; set; }
        [Display(Name = "Branch Name")]
        public int? Branchs { get; set; }

        [Display(Name = "From Date")]
        public string? FromDate { get; set; }

        [Display(Name = "To Date")]
        public string? ToDate { get; set; }
        public string?[] IDs { get; set; }
        public string? GrdTotalAmount { get; set; }
        public string? GrdTotalSDAmount { get; set; }
        public string? GrdTotalVATAmount { get; set; }
        public string? BranchName { get; set; }
        public string? SalePersonName { get; set; }
        public string? DeliveryPersonName { get; set; }
        public string? RouteName { get; set; }
        public string? Status { get; set; }
        public string? IsPosted { get; set; }
        public string? DriverPersonName { get; set; }

        [Display(Name = "Sale Return")]
        public int SaleReturnId { get; set; }

        [Display(Name = "Sale")]
        public int SaleId { get; set; }

        [Display(Name = "Sale Detail")]
        public int SaleDetailId { get; set; }

        [Display(Name = "Line")]
        public int? Line { get; set; }

        [Display(Name = "Product")]
        public int ProductId { get; set; }
        public string? ProductName { get; set; }

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

        [Display(Name = "UOM")]
        public int UOMId { get; set; }
        public string? UOMName { get; set; }

        [Display(Name = "UOM From")]
        public int UOMFromId { get; set; }
        public string? UOMFromName { get; set; }

        [Display(Name = "UOM Conversion")]
        public decimal UOMConversion { get; set; }

        [Display(Name = "Reason for Return")]
        public string? ReasonOfReturn { get; set; }

    }

}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{


    public class SaleVM
    {
        public int Id { get; set; }

        [Display(Name = "Sale Code(Auto Generate)")]
        public string? Code { get; set; }

        [Display(Name = "Distributor")]
        public int BranchId { get; set; }

        [Display(Name = "Customer")]
        public int? CustomerId { get; set; }
        public string? CustomerName { get; set; }

        [Display(Name = "Sale Person")]
        public int? SalePersonId { get; set; }
        [Display(Name = "Sale Order")]

        public int? SaleOrderId { get; set; }

        [Display(Name = "Route")]
        public int RouteId { get; set; }

        [Display(Name = "Delivery Address")]
        public string? DeliveryAddress { get; set; }

        [Display(Name = "Vehicle No.")]
        public string? VehicleNo { get; set; }

        [Display(Name = "Vehicle Type")]
        public string? VehicleType { get; set; }

        [Display(Name = "Invoice Date")]
        public string? InvoiceDateTime { get; set; }


        [Display(Name = " Delivery Date")]

        public string DeliveryDate { get; set; }


        [Display(Name = "Grand Total Amount")]

        public decimal GrandTotalAmount { get; set; }


        [Display(Name = "Grand Total SD Amount")]

        public decimal GrandTotalSDAmount { get; set; }

        [Display(Name = "Grand Total VAT Amount")]

        public decimal GrandTotalVATAmount { get; set; }

        [Display(Name = "Comments")]
        public string? Comments { get; set; }

        [Display(Name = "Printed")]
        public bool? IsPrint { get; set; }

        [Display(Name = "Printed By")]
        public string PrintBy { get; set; }

        [Display(Name = "Printed On")]

        public string? PrintOn { get; set; }
        public string? Name { get; set; }
        public string? DistributorCode { get; set; }
        public string?BanglaName { get; set; }

        [Display(Name = "Transaction Type")]
        public string? TransactionType { get; set; }

        [Required]
        [Display(Name = "Posted")]
        public bool IsPost { get; set; }

        [Display(Name = "Posted By")]
        public string? PostedBy { get; set; }

        [Display(Name = "Posted On")]

        public string? PostedOn { get; set; }

        [Display(Name = "Fiscal Year")]
        public string? FiscalYear { get; set; }

        [Display(Name = "Period")]
        public string PeriodId { get; set; }

        [Display(Name = "Currency")]
        public int? CurrencyId { get; set; }

        [Display(Name = "Currency Rate from BDT")]
        public decimal? CurrencyRateFromBDT { get; set; }

        [Display(Name = "Created By")]
        public string? CreatedBy { get; set; }

        [Display(Name = "Created On")]
   
        public string? CreatedOn { get; set; }
        public string? CreatedFrom { get; set; }

        [Display(Name = "Last Modified By")]
        public string? LastModifiedBy { get; set; }

        [Display(Name = "Last Modified On")]
        public string? LastModifiedOn { get; set; }
        public string? LastUpdateFrom { get; set; }

        public int? DecimalPlace { get; set; }
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
        public string? DriverPersonName { get; set; }
        public string? Status { get; set; }
        public string? IsPosted { get; set; }
        public List<SaleDetailVM> saleDetailsList { get; set; }

        public SaleVM()
        {
            saleDetailsList = new List<SaleDetailVM>();
        }
    }

    public class SaleDetail
    {
        public int Id { get; set; }

        [Display(Name = "Code(Auto Generate)")]
        public string? Code { get; set; }

        [Display(Name = "Branch")]
        public int BranchId { get; set; }

        [Display(Name = "Customer")]
        public int CustomerId { get; set; }
        public string? CustomerName { get; set; }

        [Display(Name = "Sale Person")]
        public int SalePersonId { get; set; }

        [Display(Name = "Route")]
        public int RouteId { get; set; }

        [Display(Name = "Delivery Address")]
        public string? DeliveryAddress { get; set; }

        [Display(Name = "Vehicle No.")]
        public string? VehicleNo { get; set; }

        [Display(Name = "Vehicle Type")]
        public string? VehicleType { get; set; }

        [Display(Name = "Invoice Date")]
        public string? InvoiceDateTime { get; set; }


        [Display(Name = " Delivery Date")]

        public string DeliveryDate { get; set; }


        [Display(Name = "Grand Total Amount")]

        public decimal GrandTotalAmount { get; set; }


        [Display(Name = "Grand Total SD Amount")]

        public decimal GrandTotalSDAmount { get; set; }

        [Display(Name = "Grand Total VAT Amount")]

        public decimal GrandTotalVATAmount { get; set; }

        [Display(Name = "Comments")]
        public string? Comments { get; set; }

        [Display(Name = "Printed")]
        public bool? IsPrint { get; set; }

        [Display(Name = "Printed By")]
        public string PrintBy { get; set; }

        [Display(Name = "Printed On")]

        public string? PrintOn { get; set; }
        public string? Name { get; set; }
        public string? DistributorCode { get; set; }
        public string? BanglaName { get; set; }

        [Display(Name = "Transaction Type")]
        public string? TransactionType { get; set; }

        [Required]
        [Display(Name = "Posted")]
        public bool IsPost { get; set; }

        [Display(Name = "Posted By")]
        public string? PostedBy { get; set; }

        [Display(Name = "Posted On")]

        public string? PostedOn { get; set; }

        [Display(Name = "Fiscal Year")]
        public string? FiscalYear { get; set; }

        [Display(Name = "Period")]
        public string PeriodId { get; set; }

        [Display(Name = "Currency")]
        public int? CurrencyId { get; set; }

        [Display(Name = "Currency Rate from BDT")]
        public decimal? CurrencyRateFromBDT { get; set; }

        [Display(Name = "Created By")]
        public string? CreatedBy { get; set; }

        [Display(Name = "Created On")]

        public string? CreatedOn { get; set; }
        public string? CreatedFrom { get; set; }

        [Display(Name = "Last Modified By")]
        public string? LastModifiedBy { get; set; }

        [Display(Name = "Last Modified On")]
        public string? LastModifiedOn { get; set; }
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
        public string? DriverPersonName { get; set; }
        public string? Status { get; set; }
        public string? IsPosted { get; set; }

        [Display(Name = "Sale")]
        public int SaleId { get; set; }

        [Display(Name = "Sale Delivery")]
        public int SaleDeliveryId { get; set; }

        [Display(Name = "Sale Delivery Detail")]
        public int SaleDeliveryDetailId { get; set; }

        [Display(Name = "Sale Order")]
        public int SaleOrderId { get; set; }

        [Display(Name = "Sale Order Detail")]
        public int SaleOrderDetailId { get; set; }

        [Display(Name = "Line")]
        public int Line { get; set; }

        [Display(Name = "Product")]
        public int ProductId { get; set; }
        public string? ProductName { get; set; }
        [Display(Name = "Quantity")]
        [DataType(DataType.Currency)]
        public decimal Quantity { get; set; }

        [Display(Name = "Unit Rate")]
        [DataType(DataType.Currency)]
        public decimal UnitRate { get; set; }

        [Display(Name = "Sub Total")]
        [DataType(DataType.Currency)]
        public decimal SubTotal { get; set; }

        [Display(Name = "SD")]
        [DataType(DataType.Currency)]
        public decimal SD { get; set; }

        [Display(Name = "SD Amount")]
        [DataType(DataType.Currency)]
        public decimal SDAmount { get; set; }

        [Display(Name = "VAT Rate")]
        public decimal VATRate { get; set; }

        [Display(Name = "VAT Amount")]
        [DataType(DataType.Currency)]
        public decimal VATAmount { get; set; }

        [Display(Name = "Line Total")]
        [DataType(DataType.Currency)]
        public decimal LineTotal { get; set; }

        [Display(Name = "UOM")]
        public int UOMId { get; set; }
        public string? UOMName { get; set; }

        [Display(Name = "UOM From")]
        public int UOMFromId { get; set; }
        public string? UOMFromName { get; set; }

        [Display(Name = "UOM Conversion")]
        public decimal UOMConversion { get; set; }

        [Display(Name = "VAT Type")]
        public string? VATType { get; set; }
        public int? CampaignTypeId { get; set; }
        public int? CampaignDetailsId { get; set; }
        public int? CampaignHeaderId { get; set; }

    }


}

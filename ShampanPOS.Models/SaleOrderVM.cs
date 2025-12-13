using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{

    public class SaleOrderVM
    {
        public int Id { get; set; }
        [Display(Name = "Code(Auto Generate)")]
        public string? Code { get; set; }
        [Display(Name = "Distributor")]
        public int BranchId { get; set; }

        [Display(Name = "Customer")]
        public int? CustomerId { get; set; }
        public string? CustomerName { get; set; }
        [Display(Name = "Sales Person")]
        public int? SalePersonId { get; set; }
        public string? SalePersonName { get; set; }
        [Display(Name = "Route")]
        public int? RouteId { get; set; }
        public string? RouteName { get; set; }
        [Display(Name = "Delivery Address")]
        public string? DeliveryAddress { get; set; }

        [Display(Name = "Order Date")]
        public string? InvoiceDateTime { get; set; }

        [Display(Name = "Expected Delivery Date")]
        public string? DeliveryDate { get; set; }

        [Display(Name = "Grand Total Amount")]

        public decimal? GrandTotalAmount { get; set; }

        [Display(Name = "Grand Total SD Amount")]
        public decimal? GrandTotalSDAmount { get; set; }

        [Display(Name = "Grand Total VAT Amount")]

        public decimal? GrandTotalVATAmount { get; set; }

        [Display(Name = "Comments")]
        public string? Comments { get; set; }

        [Display(Name = "Transaction Type")]
        public string? TransactionType { get; set; }
        public bool IsPost { get; set; }
        public string? PostBy { get; set; }
        public string? PosteOn { get; set; }

        [Display(Name = "Completed")]
        public bool? IsCompleted { get; set; }

        [Display(Name = "Currency")]
        public int? CurrencyId { get; set; }
        public string? CurrencyName { get; set; }


        [Display(Name = "Currency Rate From BDT")]
        public decimal? CurrencyRateFromBDT { get; set; }

        [Display(Name = "Created By")]
        public string? CreatedBy { get; set; }
        public string? Operation { get; set; }

        [Display(Name = "Created On")]
        public string? CreatedOn { get; set; }
        public string? CreatedFrom { get; set; }

        [Display(Name = "Last Modified By")]
        public string? LastModifiedBy { get; set; }
        [Display(Name = "Branch Name")]
        public int? Branchs { get; set; }
        [Display(Name = "Last Modified On")]
        public int? DecimalPlace { get; set; }
        public string? LastModifiedOn { get; set; }
        public string? LastUpdateFrom { get; set; }
        public int? ProductGroupId { get; set; }

        //public string?[] IDs { get; set; }
        public string? Status { get; set; }
        public string? PostStatus { get; set; }

        public string? Name { get; set; }
        [Display(Name = "From Date")]
        public string? FromDate { get; set; }

        [Display(Name = "To Date")]
        public string? ToDate { get; set; }
        [Display(Name = "Distributor Code")]
        public string? DistributorCode { get; set; }
        public string? BanglaName { get; set; }
        [Display(Name = "Posted")]
        public string? IsPosted { get; set; }
        public string? GrdTotalAmount { get; set; }
        public string? GrdTotalSDAmount { get; set; }
        public string? GrdTotalVATAmount { get; set; }
        public string? BranchName { get; set; }
        public string? DeliveryPersonName { get; set; }
        public string? DriverPersonName { get; set; }
        public int? UOMId { get; set; }
        public decimal? InvoiceDiscountRate { get; set; }
        public decimal? InvoiceDiscountAmount { get; set; }
        public decimal? RegularDiscountRate { get; set; }
        public decimal? RegularDiscountAmount { get; set; }
        public decimal? SpecialDiscountRate { get; set; }
        public decimal? SpecialDiscountAmount { get; set; }

        public decimal? Quantity { get; set; }
        public decimal? SubTotal { get; set; }
        public int? ProductId { get; set; }
        public string? ProductName { get; set; }
        public List<SaleOrderDetailVM> saleOrderDetailsList { get; set; }
        public decimal? Latitude { get; set; }

        public decimal? Longitude { get; set; }
        public SaleOrderVM()
        {
            saleOrderDetailsList = new List<SaleOrderDetailVM>();
        }

    }

    public class SaleOrderDetails
    {
        public int Id { get; set; }
        public string? Code { get; set; }
        public int BranchId { get; set; }
        public int? CustomerId { get; set; }
        public string? CustomerName { get; set; }
        public int? SalePersonId { get; set; }
        public string? SalePersonName { get; set; }
        public int? RouteId { get; set; }
        public string? RouteName { get; set; }
        public string? DeliveryAddress { get; set; }

        [Display(Name = "Order Date")]
        public string? InvoiceDateTime { get; set; }

        [Display(Name = "Expected Delivery Date")]
        public string? DeliveryDate { get; set; }

        [Display(Name = "Grand Total Amount")]
        public decimal? GrandTotalAmount { get; set; }

        [Display(Name = "Grand Total SD Amount")]
        public decimal? GrandTotalSDAmount { get; set; }

        [Display(Name = "Grand Total VAT Amount")]
        public decimal? GrandTotalVATAmount { get; set; }

        [Display(Name = "Comments")]
        public string? Comments { get; set; }

        [Display(Name = "Transaction Type")]
        public string? TransactionType { get; set; }

        public bool IsPost { get; set; }
        public string? PostBy { get; set; }
        public string? PosteOn { get; set; }

        [Display(Name = "Completed")]
        public bool? IsCompleted { get; set; }

        [Display(Name = "Currency")]
        public int? CurrencyId { get; set; }
        public string? CurrencyName { get; set; }

        [Display(Name = "Currency Rate From BDT")]
        public decimal? CurrencyRateFromBDT { get; set; }

        [Display(Name = "Created By")]
        public string? CreatedBy { get; set; }
        public string? Operation { get; set; }

        [Display(Name = "Created On")]
        public string? CreatedOn { get; set; }
        public string? CreatedFrom { get; set; }

        [Display(Name = "Last Modified By")]
        public string? LastModifiedBy { get; set; }

        [Display(Name = "Branch Name")]
        public int? Branchs { get; set; }

        [Display(Name = "Last Modified On")]
        public string? LastModifiedOn { get; set; }
        public string? LastUpdateFrom { get; set; }

        public int? ProductGroupId { get; set; }
        public string? Status { get; set; }
        public string? Name { get; set; }

        [Display(Name = "From Date")]
        public string? FromDate { get; set; }

        [Display(Name = "To Date")]
        public string? ToDate { get; set; }

        [Display(Name = "Distributor Code")]
        public string? DistributorCode { get; set; }
        public string? BanglaName { get; set; }

        [Display(Name = "Posted")]
        public string? IsPosted { get; set; }
        public string? GrdTotalAmount { get; set; }
        public string? GrdTotalSDAmount { get; set; }
        public string? GrdTotalVATAmount { get; set; }
        public string? BranchName { get; set; }
        public string? DeliveryPersonName { get; set; }
        public string? DriverPersonName { get; set; }

        [Display(Name = "Sale Order")]
        public int SaleOrderId { get; set; }

        [Display(Name = "Line")]
        public int Line { get; set; }

        [Display(Name = "Product")]
        public int ProductId { get; set; }
        public string? ProductName { get; set; }
        public string? ProductGroupName { get; set; }


        [Display(Name = "Input Qty")]
        [DataType(DataType.Currency)]
        public decimal InputQuantity { get; set; }


        [Display(Name = "CtnQty")]
        [DataType(DataType.Currency)]
        public decimal CtnQuantity { get; set; }

        [Display(Name = "PcsQty")]
        [DataType(DataType.Currency)]
        public decimal PcsQuantity { get; set; }
        [Display(Name = "Quantity")]
        [DataType(DataType.Currency)]
        public decimal Quantity { get; set; }

        [Display(Name = "Unit Rate")]
        [DataType(DataType.Currency)]
        public decimal UnitRate { get; set; }

        [Display(Name = "Subtotal")]
        [DataType(DataType.Currency)]
        public decimal SubTotal { get; set; }

        [Display(Name = "Inclusive Duty")]
        public bool IsInclusiveDuty { get; set; }

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
        public int? UOMId { get; set; }
        public string? UOMName { get; set; }

        [Display(Name = "UOM From")]
        public int UOMFromId { get; set; }
        public string? UOMFromName { get; set; }

        [Display(Name = "UOM Conversion")]
        public decimal UOMConversion { get; set; }

        public int? FreeProductId { get; set; }
        public string? FreeProductName { get; set; }
        public decimal? FreeQuantity { get; set; }
        public decimal? DiscountRate { get; set; }
        public decimal? DiscountAmount { get; set; }
        public decimal? LineDiscountRate { get; set; }
        public decimal? LineDiscountAmount { get; set; }
        public decimal? SubTotalAfterDiscount { get; set; }

        public int? CampaignTypeId { get; set; }
        public int? CampaignDetailsId { get; set; }
        public int? CampaignHeaderId { get; set; }

    }
}



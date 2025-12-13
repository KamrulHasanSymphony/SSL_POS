using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{
    public class PurchaseOrderDetail
    {
        public int Id { get; set; }

        [Display(Name = "Code(Auto Generate)")]
        public string? Code { get; set; }
        public int? BranchId { get; set; }
        public string? BranchName { get; set; }

        [Required]
        [Display(Name = "Supplier")]
        public int SupplierId { get; set; }
        public string? SupplierName { get; set; }

        public string? SupplierAddress { get; set; }

        [Display(Name = "BE Number")]
        public string? BENumber { get; set; }

        [Display(Name = "Order Date")]
        public string? OrderDate { get; set; }

        [Display(Name = " Expected Delivery Date")]
        public string? DeliveryDateTime { get; set; }
        public decimal? GrandTotalAmount { get; set; }
        public decimal? GrandTotalSDAmount { get; set; }
        public decimal? GrandTotalVATAmount { get; set; }

        [Display(Name = "Comments")]
        public string? Comments { get; set; }
        public string? TransactionType { get; set; }
        public bool IsCompleted { get; set; }
        public string? Completed { get; set; }
        public bool IsPost { get; set; }
        public string? PostBy { get; set; }
        public string? PosteOn { get; set; }

        [Display(Name = "Posted")]
        public string? IsPosted { get; set; }


        [Required]
        [Display(Name = "Currency")]
        public int CurrencyId { get; set; }
        public string? CurrencyName { get; set; }
        [Display(Name = "Rate From BDT")]
        public decimal? CurrencyRateFromBDT { get; set; }
        public string? ImportIDExcel { get; set; }
        public string? FileName { get; set; }
        public string? FiscalYear { get; set; }
        public string? PeriodId { get; set; }
        public string? CreatedBy { get; set; }
        public string? CreatedOn { get; set; }
        public string? CreatedFrom { get; set; }
        public string? LastModifiedBy { get; set; }
        public string? LastModifiedOn { get; set; }
        public string? LastUpdateFrom { get; set; }
        public int? ProductGroupId { get; set; }
        public int? UOMId { get; set; }
        public string?[] IDs { get; set; }

        [Display(Name = "Branch Name")]
        public int? Branchs { get; set; }

        [Display(Name = "From Date")]
        public string? FromDate { get; set; }

        [Display(Name = "To Date")]
        public string? ToDate { get; set; }
        public string? Operation { get; set; }
        public string? Status { get; set; }
        public string? GrdTotalAmount { get; set; }
        public string? GrdTotalSDAmount { get; set; }
        public string? GrdTotalVATAmount { get; set; }
        public decimal? TotalQuantity { get; set; }
        [Display(Name = "Purchase Order")]
        public int? PurchaseOrderId { get; set; }
        [Display(Name = "Line")]
        public int? Line { get; set; }
        [Display(Name = "Product")]
        public int? ProductId { get; set; }
        public string? ProductName { get; set; }
        [Display(Name = "Quantity")]
        [DataType(DataType.Currency)]
        public decimal? Quantity { get; set; }
        [Display(Name = "Unit Price")]
        [DataType(DataType.Currency)]
        public decimal? UnitPrice { get; set; }
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
        [Display(Name = "Others Amount")]
        [DataType(DataType.Currency)]
        public decimal? OthersAmount { get; set; }
        [Display(Name = "Line Total")]
        [DataType(DataType.Currency)]
        public decimal? LineTotal { get; set; }
        public string? UOMName { get; set; }

        [Display(Name = "UOM From")]
        public int? UOMFromId { get; set; }
        public string? UOMFromName { get; set; }

        [Display(Name = "UOM Conversion")]
        public decimal? UOMConversion { get; set; }
        [Display(Name = "VAT Type")]
        public string? VATType { get; set; }
        [Display(Name = "Invoice DateTime")]
        [DataType(DataType.DateTime)]
        public string? InvoiceDateTime { get; set; }
        [Display(Name = "Fixed VAT")]
        public bool IsFixedVAT { get; set; }
        [Display(Name = "Fixed VAT Amount")]
        [DataType(DataType.Currency)]
        public decimal? FixedVATAmount { get; set; }
    }

}

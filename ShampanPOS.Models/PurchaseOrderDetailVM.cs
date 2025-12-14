using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{

    public class PurchaseOrderDetailVM
    {
        public int Id { get; set; }


        [Display(Name = "Purchase Order")]
        public int? PurchaseOrderId { get; set; }


        [Display(Name = "Branch")]
        public int? BranchId { get; set; }


        [Display(Name = "Line")]
        public int? Line { get; set; }


        [Display(Name = "Product")]
        public int? ProductId { get; set; }
        public string? ProductCode { get; set; }
        public string? ProductName { get; set; }

        [Display(Name = "Quantity")]
        [DataType(DataType.Currency)]
        public decimal? Quantity { get; set; }


        //[Display(Name = "Ctn Qty")]
        //public decimal CtnQuantity { get; set; }

        //[Display(Name = "Input Qty")]
        //public decimal InputQuantity { get; set; }

        //[Display(Name = "Quantity")]
        //public decimal PcsQuantity { get; set; }

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


        //[Display(Name = "UOM")]
        //public int? UOMId { get; set; }
        //public string? UOMName { get; set; }


        //[Display(Name = "UOM From")]
        //public int? UOMFromId { get; set; }
        //public string? UOMFromName { get; set; }


        //[Display(Name = "UOM Conversion")]
        //public decimal? UOMConversion { get; set; }

        //[Display(Name = "Comments")]
        //public string? Comments { get; set; }


        [Display(Name = "VAT Type")]
        public string? VATType { get; set; }


        [Display(Name = "Transaction Type")]
        public string? TransactionType { get; set; }


        [Display(Name = "Posted")]
        public bool? IsPost { get; set; }


        //[Display(Name = "Invoice DateTime")]
        //[DataType(DataType.DateTime)]
        //public string? InvoiceDateTime { get; set; }


        //[Display(Name = "Fixed VAT")]
        //public bool IsFixedVAT { get; set; }


        //[Display(Name = "Fixed VAT Amount")]
        //[DataType(DataType.Currency)]
        //public decimal? FixedVATAmount { get; set; }
    }

}

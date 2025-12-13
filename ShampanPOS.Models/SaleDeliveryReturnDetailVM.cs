using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{

    public class SaleDeliveryReturnDetailVM
    {
        public int Id { get; set; }

        [Display(Name = "Sale Delivery")]
        public int? SaleDeliveryReturnId { get; set; }

        public int? SaleDeliveryId { get; set; }

        public int? SaleDeliveryDetailId { get; set; }

        [Display(Name = "Branch")]
        public int? BranchId { get; set; }

        [Display(Name = "Line")]
        public int? Line { get; set; }

        [Display(Name = "Product")]
        public int ProductId { get; set; }
        public string? ProductName { get; set; }
        public string? ProductCode { get; set; }
        public int? ProductGroupId { get; set; }
        public string? ProductGroupName { get; set; }

        [Display(Name = "Quantity")]
        public decimal? Quantity { get; set; }

        [Display(Name = "Unit Rate")]
        [DataType(DataType.Currency)]
        public decimal? UnitRate { get; set; }

        [Display(Name = "Subtotal")]
        [DataType(DataType.Currency)]
        public decimal SubTotal { get; set; }

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

        [Display(Name = "UOM")]
        public int? UOMId { get; set; }
        public string? UOMName { get; set; }

        [Display(Name = "UOM From")]
        public int? UOMFromId { get; set; }
        public string? UOMFromName { get; set; }

        [Display(Name = "UOM Conversion")]
        public decimal? UOMConversion { get; set; }

        [Display(Name = "Posted")]
        public bool? IsPost { get; set; }

        [Display(Name = "Comments")]
        public string? Comments { get; set; }

        [Display(Name = "Reason for Return")]
        public string? ReasonOfReturn { get; set; }


    }

}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{
    public class SaleDeliveryDetailVM
    {
        public int Id { get; set; }

        [Display(Name = "Sale Delivery")]
        public int SaleDeliveryId { get; set; }

        [Display(Name = "Sale Order Detail")]
        public int? SaleOrderDetailId { get; set; }

        [Display(Name = "Sale Order")]
        public int? SaleOrderId { get; set; }

        [Display(Name = "Branch")]
        public int? BranchId { get; set; }

        [Display(Name = "Line")]
        public int? Line { get; set; }

        [Display(Name = "Product")]
        public int? ProductId { get; set; }
        public string? ProductName { get; set; }
        public string? ProductCode { get; set; }
        public int? ProductGroupId { get; set; }
        public string? ProductGroupName { get; set; }

        [Display(Name = "Input Qty")]
        public decimal InputQuantity { get; set; }

        [Display(Name = "Ctn Qty")]
        public decimal CtnQuantity { get; set; }
        [Display(Name = "Pcs Qty")]
        public decimal PcsQuantity { get; set; }

        [Display(Name = "Quantity")]
        public decimal Quantity { get; set; }
        
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


        public int? CustomerId { get; set; }
        public int? FreeProductId { get; set; }
        public string? FreeProductName { get; set; }
        public decimal? FreeQuantity { get; set; }
        public decimal? DiscountRate { get; set; }
        public decimal? DiscountAmount { get; set; }
        public decimal? LineDiscountRate { get; set; }
        public decimal? LineDiscountAmount { get; set; }
        public decimal? SubTotalAfterDiscount { get; set; }
        public decimal? LineTotalAfterDiscount { get; set; }


        public int? CampaignTypeId { get; set; }
        public int? CampaignDetailsId { get; set; }
        public int? CampaignHeaderId { get; set; }
    }

}

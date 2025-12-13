using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class SaleDetailVM
    {
        public int Id { get; set; }

        [Display(Name = "Sale")]
        public string? SaleId { get; set; }

        [Display(Name = "Sale Delivery")]
        public int SaleDeliveryId { get; set; }

        [Display(Name = "Sale Delivery Detail")]
        public int SaleDeliveryDetailId { get; set; }

        [Display(Name = "Sale Order")]
        public int SaleOrderId { get; set; }

        [Display(Name = "Sale Order Detail")]
        public int SaleOrderDetailId { get; set; }

        [Display(Name = "Branch")]
        public int BranchId { get; set; }

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

        [Display(Name = "Comments")]
        public string? Comments { get; set; }

        [Display(Name = "VAT Type")]
        public string? VATType { get; set; }

        [Display(Name = "Transaction Type")]
        public string? TransactionType { get; set; }
        public string? Operation { get; set; }

        [Display(Name = "Posted")]
        public bool IsPost { get; set; }

        public int? CampaignTypeId { get; set; }
        public int? CampaignDetailsId { get; set; }
        public int? CampaignHeaderId { get; set; }

        [Display(Name = "Created By")]
        public string? CreatedBy { get; set; }
        public string? CreatedOn { get; set; }
        public string? CreatedFrom { get; set; }
        public string? LastModifiedBy { get; set; }
        public string? LastModifiedOn { get; set; }
        public string? LastUpdateFrom { get; set; }


    }


}

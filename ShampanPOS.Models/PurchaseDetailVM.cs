using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class PurchaseDetailVM
    {
        public int Id { get; set; }
        public int? PurchaseId { get; set; }
        public int? PurchaseOrderId { get; set; }
        public int? PurchaseOrderDetailId { get; set; }
        public int BranchId { get; set; }
        public int? Line { get; set; }
        public int ProductId { get; set; }
        public string? ProductCode { get; set; }
        public string? ProductName { get; set; }
        public string? POCode { get; set; }
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal SubTotal { get; set; }
        public decimal? SD { get; set; }
        public decimal? SDAmount { get; set; }
        public decimal? VATRate { get; set; }
        public decimal? VATAmount { get; set; }
        public decimal? OthersAmount { get; set; }
        public decimal? LineTotal { get; set; }
        public int? UOMId { get; set; }
        public string? UOMName { get; set; }
        public int? UOMFromId { get; set; }
        public string? UOMFromName { get; set; }
        public decimal? UOMConversion { get; set; }
        public string? Comments { get; set; }
        public string? VATType { get; set; }
        public string? TransactionType { get; set; }
        public bool IsPost { get; set; }
        public bool IsFixedVAT { get; set; }
        public decimal? FixedVATAmount { get; set; }
        [Display(Name = "Ctn Qty")]
        public decimal CtnQuantity { get; set; }

        [Display(Name = "Input Qty")]
        public decimal InputQuantity { get; set; }

        [Display(Name = "Quantity")]
        public decimal PcsQuantity { get; set; }


    }

}

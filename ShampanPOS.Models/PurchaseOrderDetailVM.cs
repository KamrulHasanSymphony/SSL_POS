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

        public int? CompanyId { get; set; }


        [Display(Name = "Line")]
        public int? Line { get; set; }


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
        public bool? IsCompleted { get; set; }

    }

}

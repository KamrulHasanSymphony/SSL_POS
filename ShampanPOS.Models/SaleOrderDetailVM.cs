using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace ShampanPOS.Models
{

    public class SaleOrderDetailVM
    {
        public int Id { get; set; }


        [Display(Name = "Sale Order")]
        public int SaleOrderId { get; set; }


        public int? CompanyId { get; set; }


        [Display(Name = "Line")]
        public int Line { get; set; }


        [Display(Name = "Product")]
        public int ProductId { get; set; }
        public string? ProductName { get; set; }
        public string? ProductCode { get; set; }

        [Display(Name = "Branch Name")]
        public int? Branchs { get; set; }

        [Display(Name = "Branch")]
        public int? BranchId { get; set; }
        [Display(Name = "Quantity")]
        [DataType(DataType.Currency)]
        public decimal Quantity { get; set; }


        [Display(Name = "Unit Rate")]
        [DataType(DataType.Currency)]
        public decimal UnitRate { get; set; }


        [Display(Name = "Subtotal")]
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

        [Display(Name = "Comments")]
        public string Comments { get; set; }
        public string Operation { get; set; }
        public decimal? CompletedQty { get; set; }
        public decimal? RemainQty { get; set; }
        [Display(Name = "From Date")]
        public string? FromDate { get; set; }

        [Display(Name = "To Date")]
        public string? ToDate { get; set; }
    }

}

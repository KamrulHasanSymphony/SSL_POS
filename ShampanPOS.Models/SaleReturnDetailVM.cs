using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class SaleReturnDetailVM
    {
        public int Id { get; set; }

        [Display(Name = "Sale Return")]
        public int SaleReturnId { get; set; }

        public int? CompanyId { get; set; }
        public string? SaleReturnCode { get; set; }
        public string? CustomerCode { get; set; }

        //[Display(Name = "Sale")]
        //public int SaleId { get; set; }

        //[Display(Name = "Sale Detail")]
        //public int SaleDetailId { get; set; }

        [Display(Name = "Line")]
        public int? Line { get; set; }

        [Display(Name = "Product")]
        public int ProductId { get; set; }
        public string? ProductName { get; set; }
        public string? CustomerName { get; set; }

        public string? ProductCode { get; set; }

        [Display(Name = "Quantity")]
        public decimal Quantity { get; set; }

        [Display(Name = "Unit Rate")]
        public decimal UnitRate { get; set; }

        [Display(Name = "Sub total")]
        public decimal SubTotal { get; set; }

        [Display(Name = "SD")]
        public decimal SD { get; set; }

        [Display(Name = "SD Amount")]
        public decimal SDAmount { get; set; }

        [Required]
        [Display(Name = "VAT Rate")]
        public decimal VATRate { get; set; }

        [Display(Name = "VAT Amount")]
        public decimal VATAmount { get; set; }

        [Display(Name = "Line Total")]
        public decimal LineTotal { get; set; }


        [Display(Name = "Branch Name")]
        public int? Branchs { get; set; }

        [Display(Name = "Branch")]
        public int? BranchId { get; set; }

        [Display(Name = "From Date")]
        public string? FromDate { get; set; }

        [Display(Name = "To Date")]
        public string? ToDate { get; set; }


        [Display(Name = "Posted")]
        public bool IsPost { get; set; }

        public string? InvoiceDateTime { get; set; }

    }
}

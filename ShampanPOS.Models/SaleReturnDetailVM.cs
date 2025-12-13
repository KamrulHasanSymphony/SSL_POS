using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{

    public class SaleReturnDetailVM
    {
        public int Id { get; set; }

        [Display(Name = "Sale Return")]
        public int SaleReturnId { get; set; }

        [Display(Name = "Sale")]
        public int SaleId { get; set; }

        [Display(Name = "Sale Detail")]
        public int SaleDetailId { get; set; }

        [Display(Name = "Branch")]
        public int BranchId { get; set; }

        [Display(Name = "Line")]
        public int? Line { get; set; }

        [Display(Name = "Product")]
        public int ProductId { get; set; }
        public string? ProductName { get; set; }

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

        [Display(Name = "UOM")]
        public int UOMId { get; set; }
        public string? UOMName { get; set; }

        [Display(Name = "UOM From")]
        public int UOMFromId { get; set; }
        public string? UOMFromName { get; set; }

        [Display(Name = "UOM Conversion")]
        public decimal UOMConversion { get; set; }

        [Display(Name = "Transaction Type")]
        public string? TransactionType { get; set; }

        [Display(Name = "Posted")]
        public bool? IsPost { get; set; }

        [Display(Name = "Reason for Return")]
        public string? ReasonOfReturn { get; set; }

        [Display(Name = "Comments")]
        public string? Comments { get; set; }

       
    }
}


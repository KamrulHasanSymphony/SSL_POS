using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{

    public class PurchaseReturnDetail
    {
        public int Id { get; set; }
        public int? PurchaseReturnId { get; set; }
        public int? PurchaseId { get; set; }
        public int? PurchaseDetailId { get; set; }
        public int BranchId { get; set; }
        public int? Line { get; set; }
        public int ProductId { get; set; }
        public string? ProductName { get; set; }
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal? SubTotal { get; set; }
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
        [Display(Name = "UOM Conversion")]
        public decimal? UOMConversion { get; set; }
        public string? Comments { get; set; }
        public string? VATType { get; set; }
        public string? TransactionType { get; set; }
        public bool? IsPost { get; set; }
        public bool? IsFixedVAT { get; set; }
        public decimal? FixedVATAmount { get; set; }
        public string? ReturnReason { get; set; }
        public string? POCode { get; set; }
        [Display(Name = "Code(Auto Generate)")]
        public string? Code { get; set; }
        [Required]
        [Display(Name = "Supplier")]
        public int SupplierId { get; set; }
        [Display(Name = "BE Number")]
        public string? BENumber { get; set; }
        [Required]
        [Display(Name = "  Purchase Return Date")]
        public string PurchaseReturnDate { get; set; }

        [Display(Name = "Grand Total Amount")]
        public decimal? GrandTotalAmount { get; set; }

        [Display(Name = "Grand Total SD Amount")]
        public decimal? GrandTotalSDAmount { get; set; }

        [Display(Name = "Grand Total VAT Amount")]
        public decimal? GrandTotalVATAmount { get; set; }

        [Display(Name = "Posted By")]
        public string? PostedBy { get; set; }

        [Display(Name = "Posted On")]
        public string? PostedOn { get; set; }
        public string? CreatedFrom { get; set; }

        [Required]
        [Display(Name = "Currency")]
        public int CurrencyId { get; set; }

        [Display(Name = "Currency Rate from BDT")]
        public decimal? CurrencyRateFromBDT { get; set; }

        [Display(Name = "Import ID Excel")]
        public string? ImportIDExcel { get; set; }

        [Display(Name = "File Name")]
        public string? FileName { get; set; }

        [Display(Name = "Fiscal Year")]
        public string? FiscalYear { get; set; }

        [Display(Name = "Period ID")]
        public string? PeriodId { get; set; }

        [Display(Name = "Created By")]
        public string? CreatedBy { get; set; }

        [Display(Name = "Created On")]
        public string? CreatedOn { get; set; }

        [Display(Name = "Last Modified By")]
        public string? LastModifiedBy { get; set; }

        [Display(Name = "Last Modified On")]
        public string? LastModifiedOn { get; set; }
        public string? LastUpdateFrom { get; set; }

        public string? Operation { get; set; }
        public string? Status { get; set; }
        public string?[] IDs { get; set; }
        [Display(Name = "Posted")]
        public string? IsPosted { get; set; }
        [Display(Name = "Branch Name")]
        public int? Branchs { get; set; }

        [Display(Name = "From Date")]
        public string? FromDate { get; set; }

        [Display(Name = "To Date")]
        public string? ToDate { get; set; }
        public string? SupplierName { get; set; }
        public string? SupplierAddress { get; set; }
        public string? CurrencyName { get; set; }
        public string? BranchName { get; set; }
        public decimal? TotalQuantity { get; set; }
    }

}

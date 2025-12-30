using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace ShampanPOS.Models
{

    public class PurchaseVM
    {
        public int Id { get; set; }

        [Display(Name = "Code (Auto Generate)")]
        public string? Code { get; set; }

        [Required]
        [Display(Name = "Distributor")]
        public int? BranchId { get; set; }

        [Required(ErrorMessage = "Supplier is required")]
        [Display(Name = "Supplier")]
        public int? SupplierId { get; set; }

        //[Required(ErrorMessage = "Currency is required")]
        //[Display(Name = "Currency")]
        //public int? CurrencyId { get; set; }

        [Required(ErrorMessage = "BE Number (Challan No.) is required")]
        [Display(Name = "BE Number (Challan No.)")]
        public string? BENumber { get; set; }

        [Required]
        [Display(Name = "Invoice Date")]
        public string? InvoiceDateTime { get; set; }

        [Required]
        [Display(Name = "Purchase Date")]
        public string? PurchaseDate { get; set; }

        //[Display(Name = "Grand Total Amount")]
        //public decimal? GrandTotalAmount { get; set; }

        //[Display(Name = "Grand Total SD Amount")]
        //public decimal? GrandTotalSDAmount { get; set; }

        //[Display(Name = "Grand Total VAT Amount")]
        //public decimal? GrandTotalVATAmount { get; set; }

        [Display(Name = "Comments")]
        public string? Comments { get; set; }

        [Required]
        [Display(Name = "Transaction Type")]
        public string? TransactionType { get; set; }
        //public bool IsCompleted { get; set; }

        [Required]
        [Display(Name = "Posted")]
        public bool IsPost { get; set; }

        [Display(Name = "Posted By")]
        public string? PostedBy { get; set; }

        [Display(Name = "Posted On")]
        public string? PostedOn { get; set; }
        public string? CreatedFrom { get; set; }


        //public int? UOMId { get; set; }
        public int? PurchaseOrderId { get; set; }

        //[Display(Name = "Currency Rate from BDT")]
        //public decimal? CurrencyRateFromBDT { get; set; }

        //[Display(Name = "Import ID Excel")]
        //public string? ImportIDExcel { get; set; }

        //[Display(Name = "File Name")]
        //public string? FileName { get; set; }

        //[Display(Name = "Custom House")]
        //public string? CustomHouse { get; set; }

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
        //public string? Completed { get; set; }
        public string?[] IDs { get; set; }
        public string? Operation { get; set; }
        public string? Status { get; set; }
        public string? BranchAddress { get; set; }
        [Display(Name = "Branch Name")]
        public int? Branchs { get; set; }
        [Display(Name = "Posted")]
        public string? IsPosted { get; set; }
        [Display(Name = "From Date")]
        public string? FromDate { get; set; }
        public int? DecimalPlace { get; set; }
        [Display(Name = "To Date")]
        public string? ToDate { get; set; }
        public string? SupplierName { get; set; }
        //[Display(Name = "Currency")]
        //public string? CurrencyName { get; set; }
        public string? BranchName { get; set; }
        public int? CompanyId { get; set; }
        public string? CompanyName { get; set; }
        //public decimal? TotalQuantity { get; set; }

        //Add
        //public HttpPostedFileBase File { get; set; }

        //End

        public List<PurchaseDetailVM> purchaseDetailList { get; set; }
        //public List<PurchaseDetailExportVM> purchaseDetailExportList { get; set; }

        public PurchaseVM()
        {
            purchaseDetailList = new List<PurchaseDetailVM>();
            //purchaseDetailExportList = new List<PurchaseDetailExportVM>();
        }


    }

}
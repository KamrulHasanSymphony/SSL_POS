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

        [Display(Name = "Purchase Order Code")]

        public string? PurchaseOrderCode { get; set; }

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



        [Display(Name = "Comments")]
        public string? Comments { get; set; }

        [Required]
        [Display(Name = "Transaction Type")]
        public string? TransactionType { get; set; }

        [Required]
        [Display(Name = "Posted")]
        public bool IsPost { get; set; }

        [Display(Name = "Posted By")]
        public string? PostedBy { get; set; }

        [Display(Name = "Posted On")]
        public string? PostedOn { get; set; }
        public string? CreatedFrom { get; set; }


        [Display(Name = "Purchase Order")]
        public int? PurchaseOrderId { get; set; }

        public decimal SubTotal { get; set; }
        public decimal TotalSD { get; set; }
        public decimal TotalVAT { get; set; }
        public decimal GrandTotal { get; set; }
        public decimal PaidAmount { get; set; }



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
        public string[]? IDs { get; set; }
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

        public string? BranchName { get; set; }
        public int? CompanyId { get; set; }
        public string? CompanyName { get; set; }

        public PeramModel PeramModel { get; set; }
        public List<PurchaseDetailVM> purchaseDetailList { get; set; }
        //public List<PurchaseDetailExportVM> purchaseDetailExportList { get; set; }

        public PurchaseVM()
        {
            purchaseDetailList = new List<PurchaseDetailVM>();
            PeramModel = new PeramModel();
            //purchaseDetailExportList = new List<PurchaseDetailExportVM>();
        }


    }

}
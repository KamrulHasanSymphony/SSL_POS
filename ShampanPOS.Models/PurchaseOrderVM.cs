using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{

    public class PurchaseOrderVM
    {
        public int Id { get; set; }

        [Display(Name = "Code (Auto Generate)")]
        public string? Code { get; set; }
        public int? BranchId { get; set; }
        public string? BranchName { get; set; }

        [Required]
        [Display(Name = "Supplier")]
        public int? SupplierId { get; set; }
        public string? SupplierName { get; set; }

        [Display(Name = "Order Date")]
        public string? OrderDate { get; set; }

        [Display(Name = " Expected Delivery Date")]
        public string? DeliveryDateTime { get; set; }

        [Display(Name = "Comments")]
        public string? Comments { get; set; }
        public string? TransactionType { get; set; }
        public bool IsPost { get; set; }
        public string? PostBy { get; set; }
        public string? PosteOn { get; set; }

        [Display(Name = "Posted")]
        public string? IsPosted { get; set; }

        public string? PeriodId { get; set; }
        public string? CreatedBy { get; set; }
        public string? CreatedOn { get; set; }
        public string? CreatedFrom { get; set; }
        public string? LastModifiedBy { get; set; }
        public string? LastModifiedOn { get; set; }
        public string? LastUpdateFrom { get; set; }
        public string?[] IDs { get; set; }

        [Display(Name = "Branch Name")]
        public int? Branchs { get; set; }

        [Display(Name = "From Date")]
        public string? FromDate { get; set; }
        public int? DecimalPlace { get; set; }
        [Display(Name = "To Date")]
        public string? ToDate { get; set; }
        public string? Operation { get; set; }
        public string? Status { get; set; }
        public string? CompanyName { get; set; }


        public List<PurchaseOrderDetailVM> purchaseOrderDetailsList { get; set; }

        public PurchaseOrderVM()
        {
            purchaseOrderDetailsList = new List<PurchaseOrderDetailVM>();
        }
    }

}

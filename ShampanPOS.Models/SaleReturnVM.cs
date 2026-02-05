using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class SaleReturnVM
    {
        public int Id { get; set; }

        [Display(Name = "Sale Return Code(Auto Generate)")]
        public string? Code { get; set; }

        [Display(Name = "Distributor")]
        public int BranchId { get; set; }
        public int? CompanyId { get; set; }
        public string? UserId { get; set; }

        [Display(Name = "Customer")]
        public int CustomerId { get; set; }
        public string? CustomerName { get; set; }

        [Display(Name = "Delivery Address")]
        public string? DeliveryAddress { get; set; }
        public int? DecimalPlace { get; set; }

        public string? InvoiceDateTime { get; set; }

        [Display(Name = "Comments")]
        public string? Comments { get; set; }

        [Display(Name = "Transaction Type")]
        public string? TransactionType { get; set; }

        [Display(Name = "Period")]
        public string? PeriodId { get; set; }

        [Display(Name = "Posted")]
        public bool IsPost { get; set; }

        [Display(Name = "Posted By")]
        public string? PostBy { get; set; }


        public string? PostedOn { get; set; }

        [Display(Name = "Created By")]
        public string? CreatedBy { get; set; }


        public string? CreatedOn { get; set; }

        [Display(Name = "Last Modified By")]
        public string? LastModifiedBy { get; set; }


        public string? LastModifiedOn { get; set; }

        public string? CreatedFrom { get; set; }

        public string? LastUpdateFrom { get; set; }
        public string? Operation { get; set; }
        [Display(Name = "Branch Name")]
        public int? Branchs { get; set; }

        [Display(Name = "From Date")]
        public string? FromDate { get; set; }

        [Display(Name = "To Date")]
        public string? ToDate { get; set; }
        public string?[] IDs { get; set; }
        public string? BranchName { get; set; }
        public string? BranchAddress { get; set; }
        public string? CompanyAddress { get; set; }
        public string? CompanyName { get; set; }

        public string? Status { get; set; }
        public string? IsPosted { get; set; }
        public List<SaleReturnDetailVM> saleReturnDetailList { get; set; }

        public SaleReturnVM()
        {
            saleReturnDetailList = new List<SaleReturnDetailVM>();
        }
    }

}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class ProductReplaceIssueVM
    {
        public int Id { get; set; }
        public int? ProductReplaceReceiveId { get; set; }
        [Display(Name = "Code")]
        public string Code { get; set; }
        [Display(Name = "Issue Date")]
        public string IssueDate { get; set; }
        [Display(Name = "Branch")]
        public int BranchId { get; set; }
        public string BranchName { get; set; }
        [Display(Name = "Customer")]
        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string Operation { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        [Display(Name = "Created By")]
        public string CreatedBy { get; set; }
        [Display(Name = "Created On")]
        public string CreatedOn { get; set; }
        [Display(Name = "Last Modified By")]
        public string LastModifiedBy { get; set; }

        [Display(Name = "Last Modified On")]
        public string LastModifiedOn { get; set; }

        [Display(Name = "Created From")]
        public string CreatedFrom { get; set; }

        [Display(Name = "Last Update From")]
        public string LastUpdateFrom { get; set; }
        [Display(Name = "Posted")]
        public bool IsPost { get; set; }

        [Display(Name = "Posted By")]
        public string? PostedBy { get; set; }

        [Display(Name = "Posted On")]
        public string? PostedOn { get; set; }
        [Display(Name = "Branch Name")]
        public int? Branchs { get; set; }
        public string? Status { get; set; }
        public int? DecimalPlace { get; set; }

        public List<ProductReplaceIssueDetailsVM> ProductReplaceIssueDetails { get; set; }
        public string?[] IDs { get; set; }
        public ProductReplaceIssueVM()
        {
            ProductReplaceIssueDetails = new List<ProductReplaceIssueDetailsVM>();
        }
    }

}

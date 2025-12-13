using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{
    public class BranchCreditLimitVM
    {
        public int Id { get; set; }
     
        [Display(Name = "Branch")]
        public int BranchId { get; set; }
        public string? BranchName { get; set; }
        public string? BranchCode { get; set; }

        [Display(Name = "Limit Entry Date")]
        public string? LimitEntryDate { get; set; }

        [Display(Name = "Self Credit Limit")]
        public decimal SelfCreditLimit { get; set; }

        [Display(Name = "Other Credit Limit")]
        public decimal OtherCreditLimit { get; set; }

        [Display(Name = "Latest Entry")]
        public bool IsLatest { get; set; }

        [Display(Name = "Approved")]
        public bool IsApproved { get; set; }

        [Display(Name = "Approved By")]
        public string? ApprovedBy { get; set; }

        [Display(Name = "Approval Date")]
        public string? ApprovedDate { get; set; }

        [Display(Name = "Posted")]
        public bool IsPosted { get; set; }
        public bool IsPost { get; set; }


        [Display(Name = "Posted By")]
        public string? PostedBy { get; set; }

        [Display(Name = "Posted Date")]

        public string? PostedDate { get; set; }

 
        [Display(Name = "Created By")]
        public string? CreatedBy { get; set; }
        [Display(Name = "Created From")]
        public string? CreatedFrom { get; set; }
        [Display(Name = "Distributor Code")]

        public string? DistributorCode { get; set; }
        public string? Name { get; set; }
        public string? Code { get; set; }


        [Display(Name = "Created On")]
        public string? CreatedOn { get; set; }

        [Display(Name = "Last Modified By")]
        public string? LastModifiedBy { get; set; }
        [Display(Name = "Last Update From")]
        public string? LastUpdateFrom { get; set; }
        public string? Operation { get; set; }

        [Display(Name = "Last Modified On")]
        public string? LastModifiedOn { get; set; }

        public string?[] IDs { get; set; }
        public string? Status { get; set; }
        public string? PostedOn { get; set; }
        public bool? IsIndex { get; set; }



    }


}

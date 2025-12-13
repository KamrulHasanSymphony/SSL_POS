using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{

    public class SalePersonCampaignTargetVM
    {
        public int Id { get; set; }

        [Display(Name = "Branch")]
        public int BranchId { get; set; }

        [Required]
        [Display(Name = "Sales Person")]
        public int? SalePersonId { get; set; }
        public string? Value { get; set; }

        [Required]
        [Display(Name = "Campaign")]
        public int? CampaignId { get; set; }

        [Required]
        [Display(Name = "Total Target")]
        public decimal TotalTarget { get; set; }

        [Required]
        [Display(Name = "Total Sale")]
        public decimal TotalSale { get; set; }

        [Required]
        [Display(Name = "Self Sale Commission Rate")]
        public decimal SelfSaleCommissionRate { get; set; }

        [Required]
        [Display(Name = "Other Sale Commission Rate")]
        public decimal OtherSaleCommissionRate { get; set; }

        [Required]
        [Display(Name = "Start Date")]
        public string StartDate { get; set; }

        [Required]
        [Display(Name = "End Date")]
        public string EndDate { get; set; }

        [Display(Name = "Approved")]
        public bool IsApproved { get; set; }

        [Display(Name = "Approved By")]
        public string? ApprovedBy { get; set; }

        [Display(Name = "Approval Date")]
        public string? ApprovedDate { get; set; }

        [Display(Name = "Posted")]
        public bool IsPost { get; set; }

        [Display(Name = "Posted By")]
        public string? PostedBy { get; set; }

        [Display(Name = "Posted On")]
        public string? PostedOn { get; set; }

        [Display(Name = "Created By")]
        public string? CreatedBy { get; set; }

        [Display(Name = "Created On")]
        public string? CreatedOn { get; set; }

        [Display(Name = "Last Modified By")]
        public string? LastModifiedBy { get; set; }

        [Display(Name = "Last Modified On")]
        public string? LastModifiedOn { get; set; }

        public string? CreatedFrom { get; set; }
        public string? LastUpdateFrom { get; set; }
        public string? Operation { get; set; }
        public string? Status { get; set; }
        public string?[] IDs { get; set; }

        public string? BranchName { get; set; }
        public string? SalePersonName { get; set; }
        public string? CampaignName { get; set; }


    }

}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace ShampanPOS.Models
{

    public class CampaignVM
    {
        [Required(ErrorMessage = "Name is required.")]
        public int Id { get; set; }
        [Display(Name = "Distributor")]
        public int? BranchId { get; set; }
        [Display(Name = "Code(Auto Generate)")]
        public string? Code { get; set; }
        public string? DistributorCode { get; set; }
        
        [Display(Name = "Name")]
        public string Name { get; set; }

        [Display(Name = "Description")]
        public string? Description { get; set; }

        [Display(Name = "Campaign Start Date")]
        public string? CampaignStartDate { get; set; }

        [Display(Name = "Campaign End Date")]
        public string? CampaignEndDate { get; set; }
        [Display(Name = "Campaign Entry Date")]
        public string? CampaignEntryDate { get; set; }

        [Display(Name = "Campaign Type")]
        public int? EnumTypeId { get; set; }

        [Display(Name = "Campaign Type")]
        public string? EnumName { get; set; }
        [Display(Name = "Posted")]
        public bool IsPost { get; set; }
        [Display(Name = "Posted By")]

        public string? PostedBy { get; set; }
        [Display(Name = "Posted On")]

        public string? PostedOn { get; set; }

        [Display(Name = "Archived")]
        public bool IsArchive { get; set; }
        [Display(Name = "Active Status")]
        public bool IsActive { get; set; }
        [Display(Name = "Created By")]
        public string? CreatedBy { get; set; }

        [Display(Name = "Created On")]
        public string? CreatedOn { get; set; }

        [Display(Name = "Last Modified By")]
        public string? LastModifiedBy { get; set; }
        [Display(Name = "Last Modified On")]
        public string? LastModifiedOn { get; set; }
        public string? Operation { get; set; }
        public string? CreatedFrom { get; set; }
        public string? LastUpdateFrom { get; set; }
        public string? Status { get; set; }
        public string? BranchName { get; set; }
        public string? IsPosted { get; set; }
        [Display(Name = "Branch Name")]
        public int? Branchs { get; set; }

        [Display(Name = "From Date")]
        public string? FromDate { get; set; }

        [Display(Name = "To Date")]
        public string? ToDate { get; set; }
        public List<CampaignDetailByQuantityVM> campaignDetailByQuantity { get; set; }
        public List<CampaignDetailByProductValueVM> campaignDetailByProductValue { get; set; }
        public List<CampaignDetailByProductTotalValueVM> campaignDetailByProductTotalValue { get; set; }
        public List<CampaignDetailByInvoiceValueVM> campaignDetailByInvoiceValue { get; set; }
        
        public CampaignVM()
        {
            campaignDetailByQuantity = new List<CampaignDetailByQuantityVM>();
            campaignDetailByProductValue = new List<CampaignDetailByProductValueVM>();
            campaignDetailByProductTotalValue = new List<CampaignDetailByProductTotalValueVM>();
            campaignDetailByInvoiceValue = new List<CampaignDetailByInvoiceValueVM>();
        }
    }


}

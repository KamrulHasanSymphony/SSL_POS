using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{

    public class CampaignDetail
    {
        [Required(ErrorMessage = "Name is required.")]
        public int Id { get; set; }
        [Display(Name = "Branch")]
        public int? BranchId { get; set; }
        [Display(Name = "Code(Auto Generate)")]
        public string? Code { get; set; }
        public string? DistributorCode { get; set; }
        [Display(Name = "Name")]

        [Required]
        public string? Name { get; set; }
        [Display(Name = "Description")]
        public string? Description { get; set; }
        [Display(Name = "Campaign Start Date")]
        public string? CampaignStartDate { get; set; }
        [Display(Name = "Campaign End Date")]
        public string? CampaignEndDate { get; set; }
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
        public int CampaignId { get; set; }
        public string? CustomerName { get; set; }

        public int CustomerId { get; set; }
        public string? ProductName { get; set; }
        public int ProductId { get; set; }
        public decimal FromAmount { get; set; }
        public decimal ToAmount { get; set; }
        public decimal DiscountRateBasedOnTotalPrice { get; set; }
        public decimal FromQuantity { get; set; }
        public decimal ToQuantity { get; set; }
        public decimal DiscountRateBasedOnUnitPrice { get; set; }
        public int FreeProductId { get; set; }
        public string? FreeProductName { get; set; }

        public decimal? FreeQuantity { get; set; } 
        //public decimal? CampaignDetailByInvoiceValueFromAmount { get; set; }
        public decimal? InvoiceValueFromAmount { get; set; }
        public decimal? InvoiceValueToAmount { get; set; }
        public decimal? InvoiceValueDiscountRateBasedOnTotalPrice { get; set; }


    }


}

using System;
using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{

    public class BranchProfileVM
    {
        public int Id { get; set; }
        [Display(Name = "Code(Auto Generate)")]
        public string? Code { get; set; }
        [Required]
        [Display(Name = "Distributor Code")]
        public string? DistributorCode { get; set; }

        [Display(Name = "Name")]
        [Required(ErrorMessage = "Distributor Name is required")]
        public string Name { get; set; }

        [Display(Name = "Bangla Name")]
        public string? BanglaName { get; set; }

        [Required]
        [Display(Name = "Area")]
        public int? AreaId { get; set; }

        [Display(Name = "Area Name")]
        public string? AreaName { get; set; }

        [Display(Name = "Telephone No.")]
        [Required(ErrorMessage = "Telephone No. is required.")]
        [StringLength(15, ErrorMessage = "Telephone No. cannot exceed 15 characters.")]
        [RegularExpression(@"^\+?\d{10,15}$", ErrorMessage = "Invalid Telephone No. format.")]
        public string TelephoneNo { get; set; }

        [Display(Name = "Email")]
        public string Email { get; set; }

        [Display(Name = "VAT Registration No.")]
        public string VATRegistrationNo { get; set; }

        [Display(Name = "BIN")]
        public string BIN { get; set; }

        [Display(Name = "TIN No.")]
        public string TINNO { get; set; }

        [Display(Name = "Comments")]
        public string Comments { get; set; }

        [Display(Name = "Address")]
        public string Address { get; set; }

        [Display(Name = "Archived")]
        public bool IsArchive { get; set; }
        [Display(Name = "Currency")]
        public int? CurrencyId { get; set; }

        [Display(Name = "Active Status")]
        public bool IsActive { get; set; }

        [Display(Name = "Created By")]
        public string? CreatedBy { get; set; }
        public string? CreatedFrom { get; set; }

        [Display(Name = "Created On")]
      
        public string? CreatedOn { get; set; }

        [Display(Name = "Last Modified By")]
        public string? LastModifiedBy { get; set; }
        public string? LastUpdateFrom { get; set; }

        [Display(Name = "Last Modified On")]
  
        public string? LastModifiedOn { get; set; }

        public string? Operation { get; set; }
        public string?[] IDs { get; set; }
        public string? Status { get; set; }
        public string? UserId { get; set; }

    }

}

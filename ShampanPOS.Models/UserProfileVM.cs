using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{
    public class UserProfileVM
    {
        public string? Id { get; set; }

        public string? UserId { get; set; }

        [Required]
        [Display(Name = "User Name")]
        public string? UserName { get; set; }

        public string? RoleId { get; set; }

        [Required]
        [Display(Name = "Full Name")]
        public string? FullName { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        [Display(Name = "Confirm Password")]
        public string ConfirmPassword { get; set; }

        [Display(Name = "Current Password")]
        public string? CurrentPassword { get; set; }

        [Required(ErrorMessage = "Please enter your email address.")]
        [EmailAddress(ErrorMessage = "Please enter a valid email address.")]
        public string? Email { get; set; }
        [Display(Name = "Phone Number")]

        [Required(ErrorMessage = "Please enter your phone number.")]
        [RegularExpression(@"^\d{11}$", ErrorMessage = "Please enter a valid 11-digit phone number.")]
        public string? PhoneNumber { get; set; }
        public string? NormalizedPassword { get; set; }
        public string? Operation { get; set; }
        public string? Mode { get; set; }
        public bool? IsAdmin { get; set; }


        [Display(Name = "Email as Login ID")]
        [StringLength(200, ErrorMessage = "Email cannot exceed 200 characters.")]
        [EmailAddress(ErrorMessage = "Invalid Email Address.")]
        public string? EmailAsLoginId { get; set; }

        [Required(ErrorMessage = "Company Name is required.")]
        [Display(Name = "Company Name")]
        [StringLength(200, ErrorMessage = "Company Name cannot exceed 200 characters.")]
        public string? CompanyName { get; set; }

        [Display(Name = "Company Legal Name")]
        [StringLength(200, ErrorMessage = "Company Legal Name cannot exceed 200 characters.")]
        public string? CompanyLegalName { get; set; }

        [Display(Name = "Company Address")]
        [StringLength(200, ErrorMessage = "Company Address cannot exceed 200 characters.")]
        public string? CompanyAddress { get; set; }

        public bool? IsRegistration { get; set; }


        //[Display(Name = "Sale Person")]
        //public int? SalePersonId { get; set; }

        //[Display(Name = "Is Head Office")]
        //public bool? IsHeadOffice { get; set; }


        //[Display(Name = "Is Sale Person")]
        //public bool? IsSalePerson { get; set; }
        //public string? SalePersonName { get; set; }
        //public string? SalePersonCode { get; set; }

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
        public string? ImagePath { get; set; }
        public string?[] IDs { get; set; }

        public int? BranchId { get; set; }

        [Display(Name = "Branch Name")]
        public string? BranchName { get; set; }
        public int? CompanyId { get; set; }
    }

}

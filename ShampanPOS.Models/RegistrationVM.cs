using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class RegistrationVM
    {
        public int Id { get; set; }

        public string? UserId { get; set; }
        [Display(Name = "Code")]
        public string? Code { get; set; }

        //[Required(ErrorMessage = "User Name is required.")]
        //[Display(Name = "User Name")]
        //[StringLength(256, ErrorMessage = "User Name cannot exceed 256 characters.")]
        //public string UserName { get; set; }



        //[Required(ErrorMessage = "Role is required.")]
        //[Display(Name = "Role")]
        //public int? RoleId { get; set; }

        [Required(ErrorMessage = "Full Name is required.")]
        [Display(Name = "User Full Name")]
        [StringLength(500, ErrorMessage = "Full Name cannot exceed 500 characters.")]
        public string FullName { get; set; }

        [Display(Name = "Phone Number")]
        [StringLength(15, ErrorMessage = "Phone Number cannot exceed 15 characters.")]
        [Phone(ErrorMessage = "Invalid Phone Number.")]
        public string? PhoneNumber { get; set; }

        [Display(Name = "Email as Login ID")]
        [StringLength(200, ErrorMessage = "Email cannot exceed 200 characters.")]
        [EmailAddress(ErrorMessage = "Invalid Email Address.")]
        public string? EmailAsLoginId { get; set; }

        [Display(Name = "Password")]
        //[StringLength(200, ErrorMessage = "Password cannot exceed 200 characters.")]
        [EmailAddress(ErrorMessage = "Invalid Password.")]
        public string? Password { get; set; }

        [Display(Name = "Confirm Password")]
        //[StringLength(200, ErrorMessage = "ConfirmPassword cannot exceed 200 characters.")]
        [EmailAddress(ErrorMessage = "Invalid ConfirmPassword.")]
        public string? ConfirmPassword { get; set; }

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

        [Display(Name = "BIN")]
        [StringLength(50, ErrorMessage = "BIN cannot exceed 50 characters.")]
        public string? BIN { get; set; }

        [Display(Name = "Created By")]
        public string? CreatedBy { get; set; }

        [Display(Name = "Created On")]
        public string? CreatedOn { get; set; }

        [Display(Name = "Created From")]
        public string? CreatedFrom { get; set; }

        [Display(Name = "Last Modified By")]
        public string? LastModifiedBy { get; set; }

        [Display(Name = "Last Modified On")]
        public string? LastModifiedOn { get; set; }

        [Display(Name = "Last Update From")]
        public string? LastUpdateFrom { get; set; }

        [Display(Name = "Status")]
        public bool IsActive { get; set; }

        [Display(Name = "Status")]
        public string? Status { get; set; }

        [Display(Name = "Operation")]
        public string? Operation { get; set; }

        //public string?[] IDs { get; set; }

        [Display(Name = "Role Name")]
        public string? RoleName { get; set; }

        public int? BranchId { get; set; }

        public int? CompanyId { get; set; }

        public string? BranchName { get; set; }

        public string? Mode { get; set; }

        public bool? IsRegistration { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class UserInfoVM
    {
        public int Id { get; set; }

        public string? UserId { get; set; }

        [Required]
        [Display(Name = "User Name")]
        public string? UserName { get; set; }

        [Required]
        [Display(Name = "Full Name")]
        public string? FullName { get; set; }

        [Display(Name = "Phone Number")]
        [RegularExpression(@"^\d{11}$", ErrorMessage = "Please enter a valid 11-digit phone number.")]
        public string? PhoneNumber { get; set; }

        [Required(ErrorMessage = "Please enter your email address.")]
        [EmailAddress(ErrorMessage = "Please enter a valid email address.")]
        public string? Email { get; set; }

        [Display(Name = "Branch")]
        public int? BranchId { get; set; }

        [Display(Name = "Company")]
        public int? CompanyId { get; set; }

        [Display(Name = "Created By")]
        public string? CreatedBy { get; set; }

        [Display(Name = "Created On")]
        public DateTime? CreatedAt { get; set; }

        public string? CreatedFrom { get; set; }

        [Display(Name = "Last Modified By")]
        public string? LastUpdateBy { get; set; }

        [Display(Name = "Last Modified On")]
        public DateTime? LastUpdateAt { get; set; }

        public string? LastUpdateFrom { get; set; }

        // UI Support
        public string? Operation { get; set; }
        public string? Mode { get; set; }

        public int?[] IDs { get; set; }
    }
}

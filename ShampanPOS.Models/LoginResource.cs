using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{
    public class LoginResource
    {
        public LoginResource()
        {
            CompanyInfos = new List<CompanyInfo>();
            UserInfos = new List<UserProfileVM>();
        }

        [Required]
        [DisplayName("User Name")]
        public string UserName { get; set; }

        [Required]
        [MinLength(6, ErrorMessage = "The password must be at least 6 characters long.")]
        public string Password { get; set; }

        public string? Message { get; set; }
        public bool RememberMe { get; set; }
        public bool shouldLockout { get; set; }
        
        public string? returnUrl { get; set; }
        public string? dbName { get; set; }

        [Required]
        public int CompanyId { get; set; }

        public string? CompanyName { get; set; }
        public string? CompanyDatabase { get; set; }

        public List<CompanyInfo> CompanyInfos { get; set; }
        public List<UserProfileVM> UserInfos { get; set; }
    }

    public static class DefaultRoles
    {
        public const string User = "Admin";
    }

}

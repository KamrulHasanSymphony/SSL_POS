using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{
    public class SettingsModel
    {
        public int Id { get; set; }
        public string? SettingGroup { get; set; }
        public string? SettingName { get; set; }
        [Required(ErrorMessage = "Setting Value is required")]
        public string SettingValue { get; set; }
        public string? SettingType { get; set; }
        public string? Remarks { get; set; }
        public bool IsActive { get; set; }
        public bool IsArchive { get; set; }

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

    }

    public class CodeVM
    {
        public int Id { get; set; }
        public int CodeId { get; set; }
        public string CodeGroup { get; set; }
        public string CodeName { get; set; }
        public string prefix { get; set; }
        public string Lenth { get; set; }
        public string ActiveStatus { get; set; }
        public int LastId { get; set; }

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

    }


}

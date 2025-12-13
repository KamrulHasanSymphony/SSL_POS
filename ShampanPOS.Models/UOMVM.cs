using System.ComponentModel.DataAnnotations;
using System;
using System.Web;

namespace ShampanPOS.Models
{
    public class UOMVM
    {
        public int Id { get; set; }

        [Display(Name = " Name")]
        [Required(ErrorMessage = "Name is required.")]
        public string Name { get; set; }
        
        [Display(Name = "Code(Auto Generate)")]
        public string? Code { get; set; }
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
        [Display(Name = "Created From")]
        public string? CreatedFrom { get; set; }
        [Display(Name = "Last Update From")]
        public string? LastUpdateFrom { get; set; }
        public string? Operation { get; set; }
        public string? Status { get; set; }

        public string?[] IDs { get; set; }
    }


}

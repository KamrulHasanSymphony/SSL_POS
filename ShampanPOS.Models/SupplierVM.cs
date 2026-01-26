using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{

    public class SupplierVM
    {
        public int Id { get; set; }
        [Display(Name = "Code(Auto Generate)")]
        public string? Code { get; set; }
        [Required(ErrorMessage = "Name is required.")]
        [Display(Name = "Name")]
        public string? Name { get; set; }

        [Display(Name = "Supplier Group")]
        [Required(ErrorMessage ="Supplier Group is required")]
        public int? SupplierGroupId { get; set; }
        public string? GroupName { get; set; }

        [Display(Name = "Bangla Name")]
        public string? BanglaName { get; set; }

        [Display(Name = "Address")]
        public string? Address { get; set; }

        [Display(Name = "City")]
        public string? City { get; set; }

        [Display(Name = "Telephone No.")]
        
        public string? TelephoneNo { get; set; }

        [Display(Name = "Email")]

        public string? Email { get; set; }

        [Display(Name = "Contact Person")]
        public string? ContactPerson { get; set; }

        [Display(Name = "Comments")]
        public string? Comments { get; set; }

        [Display(Name = "Archived")]
        public bool IsArchive { get; set; }

        [Display(Name = "Active Status")]
        public bool IsActive { get; set; }

        [Display(Name = "Created By")]
        public string? CreatedBy { get; set; }

        [Display(Name = "Created On")]
        public string? CreatedOn { get; set; }
        public string? CreatedFrom { get; set; }

        [Display(Name = "Last Modified By")]
        public string? LastModifiedBy { get; set; }

        [Display(Name = "Last Modified On")]
        public string? LastModifiedOn { get; set; }
        public string? LastUpdateFrom { get; set; }
        [Display(Name = "Image")]
        public string? ImagePath { get; set; }
        public string?[] IDs { get; set; }
        public string? Operation { get; set; }
        public string? Status { get; set; }

        public Dictionary<string, string>? ColunWidth { get; set; }
        public Dictionary<string, string>? PageSize { get; set; }

    }

}

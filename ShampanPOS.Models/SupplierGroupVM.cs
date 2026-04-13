using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{

    public class SupplierGroupVM : Entity
    {
       
        public int Id { get; set; }

        [Display(Name = "Code (Auto Generate)")]
        [StringLength(120, ErrorMessage = "Code cannot exceed 120 characters.")]
        public string? Code { get; set; }

        [Display(Name = "User ID")]
        public string? UserId { get; set; }

        [Required(ErrorMessage = "Supplier Group Name is required.")]
        [Display(Name = "Name")]
        [StringLength(120, ErrorMessage = "Supplier Group Name cannot exceed 120 characters.")]
        public string? Name { get; set; }

        [StringLength(120, ErrorMessage = "Description cannot exceed 120 characters.")]
        [Display(Name = "Description")]
        public string? Description { get; set; }

        [StringLength(200, ErrorMessage = "Comments cannot exceed 200 characters.")]
        [Display(Name = "Comments")]
        public string? Comments { get; set; }

        [Display(Name = "Archived")]
        public bool IsArchive { get; set; }

        [Display(Name = "Status")]
        public bool IsActive { get; set; }

        [StringLength(120, ErrorMessage = "Created By cannot exceed 120 characters.")]
        [Display(Name = "Created By")]
        public string? CreatedBy { get; set; }

        [Display(Name = "Created On")]
        public string? CreatedOn { get; set; }

        [StringLength(64, ErrorMessage = "Created From cannot exceed 64 characters.")]
        [Display(Name = "Created From")]
        public string? CreatedFrom { get; set; }

        [StringLength(120, ErrorMessage = "Last Modified By cannot exceed 120 characters.")]
        [Display(Name = "Last Modified By")]
        public string? LastModifiedBy { get; set; }

        [Display(Name = "Last Modified On")]
        public string? LastModifiedOn { get; set; }

        [StringLength(64, ErrorMessage = "Last Update From cannot exceed 64 characters.")]
        [Display(Name = "Last Update From")]
        public string? LastUpdateFrom { get; set; }

        public string?[] IDs { get; set; }

        [StringLength(50, ErrorMessage = "Operation cannot exceed 50 characters.")]
        [Display(Name = "Operation")]
        public string? Operation { get; set; }

        [StringLength(50, ErrorMessage = "Status cannot exceed 50 characters.")]
        [Display(Name = "Status")]
        public string? Status { get; set; }
        public int? BranchId { get; set; }
        public int? CompanyId { get; set; }


    }

}

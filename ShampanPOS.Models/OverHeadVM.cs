using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class OverHeadVM
    {

        public int Id { get; set; }

        [StringLength(50, ErrorMessage = "Code cannot exceed 50 characters.")]
        [Display(Name = "Code")]
        public string? Code { get; set; }

        [Required(ErrorMessage = "Over Head is required.")]
        [StringLength(300, ErrorMessage = "Over Head cannot exceed 300 characters.")]
        [Display(Name = "Over Head")]
        public string? OverHead { get; set; }

        [StringLength(50, ErrorMessage = "Comments cannot exceed 50 characters.")]
        [Display(Name = "Comments")]
        public string? Comments { get; set; }

        [Display(Name = "Archived")]
        public bool IsArchive { get; set; }

        [Display(Name = "IsActive")]
        public bool IsActive { get; set; }

        [StringLength(120, ErrorMessage = "Created By cannot exceed 120 characters.")]
        [Display(Name = "Created By")]
        public string? CreatedBy { get; set; }

        [Display(Name = "Created On")]
        public string? CreatedOn { get; set; }

        [StringLength(120, ErrorMessage = "Last Modified By cannot exceed 120 characters.")]
        [Display(Name = "Last Modified By")]
        public string? LastModifiedBy { get; set; }

        [Display(Name = "Last Modified On")]
        public string? LastModifiedOn { get; set; }

        [Display(Name = "Operation")]
        public string? Operation { get; set; }

        [StringLength(64, ErrorMessage = "Created From cannot exceed 64 characters.")]
        [Display(Name = "CreatedFrom")]
        public string? CreatedFrom { get; set; }

        [StringLength(64, ErrorMessage = "Last Update From cannot exceed 64 characters.")]
        [Display(Name = "Last Update From")]
        public string? LastUpdateFrom { get; set; }

        [StringLength(50, ErrorMessage = "Status cannot exceed 50 characters.")]
        [Display(Name = "Status")]
        public string? Status { get; set; }
        public int? BranchId { get; set; }


    }
}

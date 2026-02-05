using System;
using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{
    public class ProductGroupVM : Entity
    {
        public int Id { get; set; }

        [Display(Name = "Code(Auto Generate)")]
        public string? Code { get; set; }
        public int? CompanyId { get; set; }
        public string? UserId { get; set; }

        [Display(Name = "Name")]
        [Required(ErrorMessage = "Name is required.")]
        public string? Name { get; set; }

        [Display(Name = "Description")]
        public string? Description { get; set; }

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

        public string?[] IDs { get; set; }
        public string? Operation { get; set; }        
        public string? Status { get; set; }


    }

}

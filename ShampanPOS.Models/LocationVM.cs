using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{

    public class LocationVM
    {
        public int Id { get; set; }
        [Display(Name = "Code(Auto Generate)")]
        public string Code { get; set; }
        [Display(Name = "Name"),Required]
        public string Name { get; set; }
        [Display(Name = "Parent Location"),Required]
        public int? ParentId { get; set; }

        public string? EnumType { get; set; }
        [Display(Name = "Location Type "),Required]
        public string? EnumTypeId { get; set; }
        [Display(Name = "Location Name")]
        public string? EnumName { get; set; }
        [Display(Name = "Country Name")]
        public string? CountryName { get; set; }
        [Display(Name = "Division Name")]
        public string? DivisionName { get; set; }
        [Display(Name = "District Name")]
        public string? DistrictName { get; set; }
        [Display(Name = "Thana Name")]
        public string? ThanaName { get; set; }
        [Display(Name = "Archived")]
        public bool IsArchive { get; set; } = false;

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
        public string? Operation { get; set; }
        public string? CreatedFrom { get; set; }
        public string? LastUpdateFrom { get; set; }
        public string?[] IDs { get; set; }

        public string? Status { get; set; }
    }
    

}

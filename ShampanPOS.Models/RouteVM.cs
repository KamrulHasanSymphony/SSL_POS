using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace ShampanPOS.Models
{

    public class RouteVM
    {
        public int Id { get; set; }
        [DisplayName("Code(Auto Generate)")]
        public string Code { get; set; }
        [Required]
        [Display(Name = "Name")]
        public string? Name { get; set; }
        [Display(Name = "Bangla Name")]
        public string? BanglaName { get; set; }
        [Display(Name = "Branch")]
        public int? BranchId { get; set; }
        [Display(Name = "Area")]
        public int? AreaId { get; set; }
        [Display(Name = "Address")]
        public string? Address { get; set; }
        [Display(Name = "Area Name")]
        public string? AreaName { get; set; }

        [Display(Name = "Zip Code")]
        public string? ZipCode { get; set; }

        [Display(Name = "Address Bangla")]
        public string? AddressBangla { get; set; }
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
        public string? Operation { get; set; }
        public string?[] IDs { get; set; }
        public string? Status { get; set; }
    }


}

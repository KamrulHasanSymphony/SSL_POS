using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{

    public class SalePersonRouteVM
    {
        public int Id { get; set; }

        [Display(Name = "Code(Auto Generate)")]
        public string? Code { get; set; }
       
        [Display(Name = "Name")]
        public string? Name { get; set; }

        [Display(Name = "Bangla Name")]
        public string? BanglaName { get; set; }

        [Display(Name = "Distributor Code")]
        public string? DistributorCode { get; set; }
        [Display(Name = "Sales person")]
        [Required(ErrorMessage = "Name is required.")]
        public int? SalePersonId { get; set; }
        public string? SalePersonName { get; set; }

        [Display(Name = "Branch")]
        public int? BranchId { get; set; }
        public string? BranchName { get; set; }
        [Display(Name = "Route")]
        public int? RouteId { get; set; }
        public string? RouteName { get; set; }

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
        public string? CreatedFrom { get; set; }
        public string? LastUpdateFrom { get; set; }
        public string? Operation { get; set; }
        public string? Status { get; set; }
        public string?[] IDs { get; set; }
        public bool? IsIndex { get; set; }
    }

}

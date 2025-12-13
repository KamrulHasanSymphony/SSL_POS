using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class CurrencieVM
    {
        public int? Id { get; set; }
        [Display(Name = "Country")]
        public int? CountryId { get; set; }
        [DisplayName("Name")]
        public string Name { get; set; }
        [DisplayName(" Code(Auto Generate)")]
        public string? Code { get; set; }
     
        [Display(Name = "Archived")]
        public bool IsArchive { get; set; }
        [Display(Name = "Active Status")]
        public bool IsActive { get; set; }
        public string? CreatedBy { get; set; }
        [Display(Name = "Created On")]
        public string? CreatedOn { get; set; }
        public string? LastModifiedBy { get; set; }
        public string? LastModifiedOn { get; set; }
        public string? LastUpdateFrom { get; set; }
        public string? Operation { get; set; }
        public string? CreatedFrom { get; set; }
        public string?[] IDs { get; set; }
        public string? Status { get; set; }
    }

}

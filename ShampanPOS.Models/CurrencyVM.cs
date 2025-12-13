using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{

    public class CurrencyVM
    {
        
        public int Id { get; set; }
        [Required(ErrorMessage = "Name is required.")]
        [Display(Name = "Name")]
        public string Name { get; set; }

        [Display(Name = "Code(Auto Generate)")]
        public string Code { get; set; }

        [Display(Name = "Country")]
        public int? CountryId { get; set; }

        [Required]
        [Display(Name = "Archived")]
        public bool IsArchive { get; set; }

        [Required]
        [Display(Name = "Active")]
        public bool IsActive { get; set; }

        [Required]
        [Display(Name = "Created By")]
        public string CreatedBy { get; set; }

        [Required]
        [Display(Name = "Created On")]
        [DataType(DataType.DateTime)]
        public DateTime CreatedOn { get; set; }

        [Display(Name = "Last Modified By")]
        public string LastModifiedBy { get; set; }

        [Display(Name = "Last Modified On")]
        [DataType(DataType.DateTime)]
        public DateTime? LastModifiedOn { get; set; }

        [Required]
        [Display(Name = "Created From")]
        public string CreatedFrom { get; set; }

        [Display(Name = "Last Update From")]
        public string LastUpdateFrom { get; set; }
    }

}

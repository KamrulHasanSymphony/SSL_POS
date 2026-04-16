using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class ProductNewVM
    {
        public int Id { get; set; }

        [Display(Name = "Code (Auto Generate)")]

        public string? Code { get; set; }

        [Display(Name = "Name")]
        public string Name { get; set; }

        [Display(Name = "Bangla Name")]
        public string? BanglaName { get; set; }

        [Display(Name = "Product Group Name")]
        public string? ProductGroupName { get; set; }

        [Display(Name = "Description")]
        public string? Description { get; set; }

        [Display(Name = "UOM")]
        public int? UOMId { get; set; }

        [Display(Name = "HS Code No.")]
        public string? HSCodeNo { get; set; }

        [Display(Name = "VAT Rate")]
        public decimal? VATRate { get; set; }

        [Display(Name = "SD Rate")]
        public decimal? SDRate { get; set; }
        [Display(Name = "Product Group")]
        public int? ProductGroupId { get; set; }
        [Display(Name = "Archived")]
        public bool IsArchive { get; set; }

        [Display(Name = "Active Status")]
        public bool IsActive { get; set; }

        [Display(Name = "Created By")]
        public string? CreatedBy { get; set; }

        [Display(Name = "Created On")]
        public string? CreatedOn { get; set; }
        public string? CreatedFrom { get; set; }

        [Display(Name = "Last Modified On")]
        public string? LastModifiedOn { get; set; }
        public string? LastUpdateFrom { get; set; }
        [Display(Name = "Last Modified By")]
        public string? LastModifiedBy { get; set; }
    }
}

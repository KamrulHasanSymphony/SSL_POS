using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{


    public class ProductPriceGroupDetailVM
    {
        public int Id { get; set; }

        [Display(Name = "Product Price Group")]
        public int? ProductPriceGroupId { get; set; }
        public int? ProductId { get; set; }
        [Display(Name = "Cost Price")]

        public decimal? CosePrice { get; set; }
        [Display(Name = "Sale Price")]

        public decimal? SalePrice { get; set; }
        public decimal? VATRate { get; set; }
        public string? Name { get; set; }
        public string? Code { get; set; }
        [Display(Name = "Bangla Name")]
        public string? BanglaName { get; set; }
        [Display(Name = "Created By")]
        public string? CreatedBy { get; set; }
        [Display(Name = "Created On")]
        public string? CreatedOn { get; set; }

        [Display(Name = "Last Modified By")]
        public string? LastModifiedBy { get; set; }

        [Display(Name = "Last Modified On")]
        [DataType(DataType.DateTime)]
        public string? LastModifiedOn { get; set; }
    }


}

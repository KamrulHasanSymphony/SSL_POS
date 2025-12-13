using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class ProductStockVM
    {
        public int Id { get; set; }

        [Display(Name = "Product")]
        public int? ProductId { get; set; }
        public string ? ProductName { get; set; }
        public string ? ProductCode { get; set; }
        [Display(Name = "Branch")]
        public int? BranchId { get; set; }
        public string ? BranchName { get; set; }

        [Display(Name = "Opening Quantity")]
        public int? OpeningQuantity { get; set; }

        [Display(Name = "Opening Value")]
        public decimal? OpeningValue { get; set; }

        [Display(Name = "Opening Date")]
        public string? OpeningDate { get; set; }

        [Display(Name = "Created By")]
        public string? CreatedBy { get; set; }

        [Display(Name = "Created On")]
        public string? CreatedOn { get; set; }

        [Display(Name = "Last Modified By")]
        public string? LastModifiedBy { get; set; }

        [Display(Name = "Last Modified On")]
        public string? LastModifiedOn { get; set; }

        [Display(Name = "Created From")]
        public string? CreatedFrom { get; set; }

        [Display(Name = "Last Update From")]
        public string? LastUpdateFrom { get; set; }
    }

}

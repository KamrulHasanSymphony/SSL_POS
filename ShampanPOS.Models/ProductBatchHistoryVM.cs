using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;


namespace ShampanPOS.Models
{

    public class ProductBatchHistoryVM
    {
        public int Id { get; set; }

        
        [Display(Name = "Product")]
        public int?  ProductId { get; set; }
        public string?  ProductName { get; set; }
        public string? BanglaName { get; set; }
        public string? ProductCode { get; set; }

        public string?  Name { get; set; }

        [Display(Name = "Branch")]
        public int? BranchId { get; set; }

        [Display(Name = "Batch No.")]
        public string? BatchNo { get; set; }

      
        [Display(Name = "Entry Date")]
        public string? EntryDate { get; set; }

        [Display(Name = "Manufacturing Date")]
        public string? MFGDate { get; set; }

        [Display(Name = "Expiration Date")]
        public string? EXPDate { get; set; }

        [Required]
        [Display(Name = "Effect Date")]
        public string? EffectDate { get; set; }

        [Display(Name = "Price Category")]
        public string? PriceCategory { get; set; }


        [Display(Name = "Cost Price")]
        public decimal CostPrice { get; set; }

       
        [Display(Name = "Sales Price")]
        public decimal SalesPrice { get; set; }

       
        [Display(Name = "Purchase Price")]
        public decimal PurchasePrice { get; set; }

        [Display(Name = "SD Rate")]
        public decimal SD { get; set; }

        [Display(Name = "SD Amount")]
        public decimal? SDAmount { get; set; }

        [Display(Name = "VAT Rate")]
        public decimal VATRate { get; set; }

        [Display(Name = "VAT Amount")]
        public decimal? VATAmount { get; set; }


        [Display(Name = "Created By")]
        public string? CreatedBy { get; set; }


        [Display(Name = "Created On")]
        public string? CreatedOn { get; set; }


        [Display(Name = "Last Modified By")]
        public string? LastModifiedBy { get; set; }


        [Display(Name = "Last Modified On")]
        public string? LastModifiedOn { get; set; }

        [Display(Name = "Operation")]
        public string? Operation { get; set; }
        public string?[] IDs { get; set; }

        [Display(Name = "CreatedFrom")]
        public string? CreatedFrom { get; set; }

        [Display(Name = "LastUpdateFrom")]
        public string? LastUpdateFrom { get; set; }
        public bool? IsIndex { get; set; }

        public string? ProductGroupCode { get; set; }
        public string? ProductGroupName { get; set; }
        public string? UOMName { get; set; }
        public string? UOMFromName { get; set; }
        public string? UOMConversion { get; set; }
        public string? ProductDescription { get; set; }
        public string? HSCodeNo { get; set; }
        public string? Status { get; set; }

    }

}

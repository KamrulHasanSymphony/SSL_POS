using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{

    public class ProductPriceGroupVM
    {
        
        public int Id { get; set; }
        public int? BranchId { get; set; }
        [Display(Name = "Effect Date")]
        public string? EffectDate { get; set; }

        [Display(Name = "Name")]
        public string Name { get; set; }
        public bool IsArchive { get; set; }
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
        public string? Operation { get; set; }
        public string? Status { get; set; }
        //public string?[] IDs { get; set; }
        
        public List<ProductPriceGroupDetailVM> ProductPriceGroupDetails { get; set; }
        public List<ProductPriceGroupDetailVM> ProductPriceGroupDetailsExcel { get; set; }
        public List<BranchProfileVM> BranchProfileList { get; set; }
        public ProductPriceGroupVM()
        {
            ProductPriceGroupDetails = new List<ProductPriceGroupDetailVM>();
            BranchProfileList = new List<BranchProfileVM>();           

        }
    }


}

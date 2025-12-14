using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Web;

namespace ShampanPOS.Models
{
    public class ProductFileVm
    {
       
         public HttpPostedFileBase? File { get; set; }
        [Display(Name = "Created By")]
        public string? CreatedBy { get; set; }

        [Display(Name = "Created On")]
        public string? CreatedOn { get; set; }
        public string? CreatedFrom { get; set; }
        [Display(Name = "Carton Size")]
        public string? CtnSize { get; set; }
        [Display(Name = "Carton Size Factor")]
        public string? CtnSizeFactor { get; set; }
        public List<BranchProfileVM> BranchProfileList { get; set; }
       
        public ProductFileVm()
        {
            BranchProfileList = new List<BranchProfileVM>();
            
        }


    }

}

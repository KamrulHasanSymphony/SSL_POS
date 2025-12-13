using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace ShampanPOS.Models
{
    public class ProductStockFileVM
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
        public List<ProductStockImportVM> ProductStockImportList { get; set; }

        public ProductStockFileVM()
        {
            ProductStockImportList = new List<ProductStockImportVM>();
        }
    }
}

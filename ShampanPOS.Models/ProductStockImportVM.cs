using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class ProductStockImportVM
    {
        public int Id { set; get; }
        public int ProductId { set; get; }
        public int BranchId { set; get; }
        public string ProductName { get; set; }
        public string ProductCode { get; set; }
        public string OpeningDate { get; set; }
        public string OpeningQuantity { get; set; }
        public string OpeningValue { get; set; }
        public string? CreatedBy { get; set; }
        public string? CreatedOn { get; set; }
        public string? CreatedFrom { get; set; }

    }
}

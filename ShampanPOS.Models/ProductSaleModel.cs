using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class ProductSaleModel
    {
        public int ProductId { get; set; }
        public int BranchId { get; set; }
        public string ProductName { get; set; }
        public decimal TotalQuantity { get; set; }
        public decimal AverageUnitRate { get; set; }
        public decimal TotalSaleValue { get; set; }
    }
}

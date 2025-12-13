using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class ProductStockSummary
    {
        public string ProductName { get; set; }
        public string ProductCode { get; set; }
        public string OpeningDate { get; set; }
        public string OpeningQuantity { get; set; }
        public string OpeningValue { get; set; }
    }
}

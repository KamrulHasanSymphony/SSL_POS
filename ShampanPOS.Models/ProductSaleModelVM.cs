using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class ProductSaleModelVM
    {
        public string ProductName { get; set; }
        public decimal TotalSaleValue { get; set; }
        public decimal TotalQuantity { get; set; }

    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class SaleDataVM
    {
        public int Id { get; set; }
        public int? SaleOrderId { get; set; }

        public string? Code { get; set; }
        public string? SaleOrderCode { get; set; }
        public int? CustomerId { get; set; }
        public string? CustomerName { get; set; }
        public string? Comments { get; set; }
        public decimal GrandTotal { get; set; }

        public PeramModel PeramModel { get; set; }
        public SaleDataVM()
        {
            PeramModel = new PeramModel();
        }
    }
}

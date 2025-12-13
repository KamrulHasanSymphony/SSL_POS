using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class SaleDeliveryReportVM
    {
        public int SL { get; set; }
        public int ProductId { get; set; }
        public string ProductGroupName { get; set; }
        public string ProductCode { get; set; }
        public string ProductName { get; set; }
        public string HSCodeNo { get; set; }
        public string UOMName { get; set; }
        public int Quantity { get; set; }
    }
}

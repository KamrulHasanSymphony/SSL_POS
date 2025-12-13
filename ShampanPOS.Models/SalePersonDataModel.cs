using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class SalePersonDataModel
    {
        public int SalePersonId { get; set; }
        public string SalePersonName { get; set; }
        public decimal TotalQuantity { get; set; }
        public decimal GrandTotalAmount { get; set; }        
    }
}

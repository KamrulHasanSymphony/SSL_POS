using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class PurchaseByMonthModelVM
    {
        public string MonthYear { get; set; }  
        public decimal TotalPurchaseValue { get; set; }
        public int CompanyId { get; set; }

    }
}

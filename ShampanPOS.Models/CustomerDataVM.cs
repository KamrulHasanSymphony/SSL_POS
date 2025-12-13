using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class CustomerDataVM
    {
        public int? Id { get; set; }
        public int? CustomerId { get; set; }
        public string? CustomerName { get; set; }
        public string? BanglaName { get; set; }
        public string? CustomerCode { get; set; }

        public string? Status { get; set; }
        public string? BranchId { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class DayEndDetailsVM
    {
        public int Id { get; set; }
        public int? DayEndHeaderId { get; set; }
        public string? Date { get; set; }
        public int? BranchId { get; set; }
        public int? ProductId { get; set; }
        public string? ProductName { get; set; }
        public decimal? Quantity { get; set; }
        public string? Type { get; set; }
    }
}

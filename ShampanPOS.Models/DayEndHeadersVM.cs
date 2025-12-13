using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class DayEndHeadersVM
    {
        public int Id { get; set; }
        public string? Date { get; set; }
        public int? BranchId { get; set; }
        public bool IsLocked { get; set; }
        //public Audit Audit { get; set; }
        public List<DayEndDetailsVM> dayEndDetails { get; set; }
        public DayEndHeadersVM()
        {
            dayEndDetails = new List<DayEndDetailsVM>();
            //Audit = new Audit();

        }
    }
}

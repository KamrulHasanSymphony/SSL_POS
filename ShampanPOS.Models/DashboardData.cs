using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class DashboardData
    {
        public int PendingPO { get; set; }
        public int CompletedPO { get; set; }
        public int UnPostPO { get; set; }
        public int PostedPO { get; set; }
    }
}

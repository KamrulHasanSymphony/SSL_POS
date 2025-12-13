using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class CustomerDueListCustomerWiseVM
    {
        public int? SL { get; set; }
        public string? CustomerName { get; set; }
        public decimal? DueAmount { get; set; }
        public string? FirstDueBill { get; set; }
        public string? FirstDueDate { get; set; }


        public string? BranchName { get; set; }
        public string? BranchAddress { get; set; }


    }
}

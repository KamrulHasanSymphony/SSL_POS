using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class CustomerCollectionDueVM
    {
        [DisplayName("Customer")]
        public int? CustomerId { get; set; }
        [DisplayName("Customer Code")]
        public string? CustomerCode { get; set; }
        [DisplayName("Customer Name")]
        public string? CustomerName { get; set; }
        [DisplayName("Branch")]
        public int? BranchId { get; set; }
        [DisplayName("Company")]
        public int? CompanyId { get; set; }
        [DisplayName("Branch Name")]
        public string? BranchName { get; set; }
        [DisplayName("Branch Address")]
        public string? BranchAddress { get; set; }
        [DisplayName("Company Name")]
        public string? CompanyName { get; set; }
        [DisplayName("Total Sale Amount")]
        public decimal TotalSaleAmount { get; set; }
        [DisplayName("Sale Count")]
        public int? SaleCount { get; set; }
        [DisplayName("Total Collection Amount")]
        public decimal TotalCollectionAmount { get; set; }
        [DisplayName("Collection Count")]
        public int? CollectionCount { get; set; }
        [DisplayName("Due Amount")] 
        public decimal DueAmount { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class ProductImportVM
    {
        public int Id { set; get; }
        public int ProductId { set; get; }
        public int BranchId { set; get; }
        public string ProductName { get; set; }
        public string ProductCode { get; set; }
        public string EffectDate { get; set; }
        public string GroupName { get; set; }
        public decimal SalesPrice { get; set; }
        public decimal CostPrice { get; set; }
        public string? CreatedBy { get; set; }
        public string? CreatedOn { get; set; }
        public string? CreatedFrom { get; set; }
        public decimal VATRate { get; set; }


    }

}

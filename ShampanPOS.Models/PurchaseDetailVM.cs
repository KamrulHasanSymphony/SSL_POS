using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{

    public class PurchaseDetailVM
    {
        public int Id { get; set; }
        public int? PurchaseId { get; set; }
        public int? PurchaseOrderId { get; set; }
        public int? PurchaseOrderDetailId { get; set; }
        public int? BranchId { get; set; }
        public int? CompanyId { get; set; }
        public string? BENumber { get; set; }

        public int? Line { get; set; }
        public int ProductId { get; set; }
        public string? ProductCode { get; set; }
        public string? ProductName { get; set; }
        //public string? POCode { get; set; }
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal SubTotal { get; set; }
        public decimal? SD { get; set; }
        public decimal? SDAmount { get; set; }
        public decimal? VATRate { get; set; }
        public decimal? VATAmount { get; set; }
        public decimal? OthersAmount { get; set; }
        public decimal? LineTotal { get; set; }
        public string? PurchaseCode { get; set; }
        public string? SupplierAddress { get; set; }
        public string? SupplierName { get; set; }
        [Display(Name = "Branch Name")]
        public int? Branchs { get; set; }

        [Display(Name = "From Date")]
        public string? FromDate { get; set; }

        [Display(Name = "To Date")]
        public string? ToDate { get; set; }

    }

}

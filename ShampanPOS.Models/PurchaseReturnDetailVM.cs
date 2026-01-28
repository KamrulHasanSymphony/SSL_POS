using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace ShampanPOS.Models
{

    public class PurchaseReturnDetailVM
    {
        public int Id { get; set; }
        public int? PurchaseReturnId { get; set; }
        public int? PurchaseId { get; set; }
        public int? PurchaseDetailId { get; set; }
        public int? BranchId { get; set; }
        public int? CompanyId { get; set; }
        public int? Line { get; set; }
        public string? PurchaseDate { get; set; }
        public string? PurchaseReturnDate { get; set; }
        public string? SupplierCode { get; set; }
        public int ProductId { get; set; }
        public string? ProductCode { get; set; }
        public string? PurchasesReturnCode { get; set; }
        public string? ProductName { get; set; }
        public string? SupplierName { get; set; }
        public string? SupplierAddress { get; set; }
        public string? BENumber { get; set; }
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal? SubTotal { get; set; }
        public decimal? SD { get; set; }
        public decimal? SDAmount { get; set; }
        public decimal? VATRate { get; set; }
        public decimal? VATAmount { get; set; }
        public decimal? OthersAmount { get; set; }
        public decimal? LineTotal { get; set; }

        public string? POCode { get; set; }

        [Display(Name = "Branch Name")]
        public int? Branchs { get; set; }

        [Display(Name = "From Date")]
        public string? FromDate { get; set; }

        [Display(Name = "To Date")]
        public string? ToDate { get; set; }
    }

}

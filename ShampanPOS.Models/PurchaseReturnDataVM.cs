using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace ShampanPOS.Models
{

    public class PurchaseReturnDataVM
    {
        public int Id { get; set; }
        public string? Code { get; set; }
        public int? BranchId { get; set; }
        public int? CompanyId { get; set; }
        public string? UserId { get; set; }
        public int? SupplierId { get; set; }
        public string? BENumber { get; set; }
        public string PurchaseDate { get; set; }
        public string? InvoiceDateTime { get; set; }
        public string? TransactionType { get; set; }
        public int? DecimalPlace { get; set; }
        public int? PurchaseId { get; set; }
        public string? Operation { get; set; }
        public string? CompanyName { get; set; }
        public string? FromDate { get; set; }

        public string? ToDate { get; set; }

        [Display(Name = "Supplier Name")]
        public string? SupplierName { get; set; }
        public string? BranchName { get; set; }
        public decimal Quantity { get; set; }
        public decimal? UnitPrice { get; set; }
        public decimal? SubTotal { get; set; }

        public PeramModel PeramModel { get; set; }

        public PurchaseReturnDataVM()
        {
            PeramModel = new PeramModel();
        }


    }

}

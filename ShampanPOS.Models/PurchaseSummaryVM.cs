using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class PurchaseSummaryVM
    {
        public int SL { get; set; }
        [Display(Name = "Purchase Code")]
        public string Code { get; set; }

        [Display(Name = "Branch Code")]
        public string BranchCode { get; set; }

        [Display(Name = "Supplier Code")]
        public string SupplierCode { get; set; }

        [Display(Name = "Invoice Date")]
        public string InvoiceDate { get; set; }
        [Display(Name = "Product Code")]
        public string ProductCode { get; set; }
        public string UOMCode { get; set; }

        [Display(Name = "Quantity")]
        public decimal Quantity { get; set; }


        //[Display(Name = "Supplier Name")]
        //public string SupplierName { get; set; }
        //[Display(Name = "Purchase Date")]
        //public string PurchaseDate { get; set; }
        //[Display(Name = "BE Number")]
        //public string BENumber { get; set; }
        //[Display(Name = "Fiscal Year")]
        //public string FiscalYear { get; set; }
        //[Display(Name = "Transaction Type")]
        //public string TransactionType { get; set; }

        //[Display(Name = "Currency Name")]
        //public string CurrencyName { get; set; }

        //[Display(Name = "Product Group Code")]
        //public string ProductGroupCode { get; set; }

        //[Display(Name = "Unit Price")]
        //public decimal UnitPrice { get; set; }

        //[Display(Name = "SD Rate")]
        //public decimal SDRate { get; set; }

        //[Display(Name = "VAT Rate")]
        //public decimal VATRate { get; set; }
    }
}

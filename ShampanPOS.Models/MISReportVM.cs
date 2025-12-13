using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class MISReportVM
    {
        [Display(Name = "From Date")]

        public string? DateFrom { get; set; }
        [Display(Name = "To Date")]

        public string? DateTo { get; set; }

        [Display(Name = "Branch Name")]
        public string? BranchId { get; set; }
        [Display(Name = "Customer Name")]

        public string? CustomerId { get; set; }
        [Display(Name = "Product Name")]

        public string? ProductId { get; set; }
        public string? CompanyId { get; set; }
        public string? FileName { get; set; }
        public string? ReportName { get; set; }
        public bool IsDetail { get; set; }
        public bool IsSummary { get; set; }
        [Display(Name = "Sales Report")]
        public bool IsSalesReport { get; set; }
        [Display(Name = "Inventory Report")]
        public bool IsInventoryReport { get; set; }
        public bool IsCustomerWise { get; set; }
        public bool IsProductWise { get; set; }
        public bool IsCustomerBill { get; set; }
        public bool IsSinglePorductInventory { get; set; }
        public bool IsCustomerDueList { get; set; }
        public bool IsCustomerDueListCustomerWise { get; set; }

        public string ReportType { get; set; }
        public string ReportOption { get; set; }
        [Display(Name = "Post")]
        public string? Post { get; set; }
    }
}

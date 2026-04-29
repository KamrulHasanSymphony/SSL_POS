using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class SaleOrderReportVM
    {

        public int Id { get; set; }

        [Display(Name = "Code(Auto Generate)")]
        public string? Code { get; set; }

        [Display(Name = "Distributor")]
        public int? BranchId { get; set; }
        public string? UserId { get; set; }

        [Display(Name = "Order From Date")]
        public string? OrderFromDate { get; set; }

        [Display(Name = "Order To Date")]
        public string? OrderToDate { get; set; }


        [Display(Name = "Delivery From Date")]
        public string? DeliveryFromDate { get; set; }

        [Display(Name = "Delivery To Date")]
        public string? DeliveryToDate { get; set; }


        [Display(Name = "Customer")]
        [Required(ErrorMessage = "Customer is required.")]
        public int? CustomerId { get; set; }

        [Display(Name = "Customer Name")]
        public string? CustomerName { get; set; }

        [Display(Name = "Delivery Address")]
        public string? DeliveryAddress { get; set; }

        [Display(Name = "Expected Delivery Date")]
        public string? DeliveryDate { get; set; }

        [Display(Name = "Order Date")]
        public string? OrderDate { get; set; }

        [Display(Name = "Transaction Type")]
        public string? TransactionType { get; set; }
        public bool IsPost { get; set; }
        public string? PostBy { get; set; }
        public string? PosteOn { get; set; }

        [Display(Name = "Created By")]
        public string? CreatedBy { get; set; }
        public string? Operation { get; set; }

        [Display(Name = "Created On")]
        public string? CreatedOn { get; set; }
        public string? CreatedFrom { get; set; }

        [Display(Name = "Last Modified By")]
        public string? LastModifiedBy { get; set; }
        [Display(Name = "Branch Name")]
        public int? Branchs { get; set; }
        [Display(Name = "Last Modified On")]
        public int? DecimalPlace { get; set; }
        public string? LastModifiedOn { get; set; }
        public string? LastUpdateFrom { get; set; }

        //public string?[] IDs { get; set; }


        [Display(Name = "From Date")]
        public string? FromDate { get; set; }

        [Display(Name = "To Date")]
        public string? ToDate { get; set; }

        public string? BranchName { get; set; }
        public int? CompanyId { get; set; }
        public string? BranchAddress { get; set; }
        public string? CompanyAddress { get; set; }
        public string? CompanyName { get; set; }

        [Display(Name = "Report Type")]
        public int ReportType { get; set; }

        public bool IsSummary { get; set; }
    }
}

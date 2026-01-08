using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class SaleVM
    {
        public int Id { get; set; }

        [Display(Name = "Sale Code(Auto Generate)")]
        public string? Code { get; set; }

        [Display(Name = "Distributor")]
        public int? BranchId { get; set; }
        public int? CompanyId { get; set; }

        [Display(Name = "Customer")]
        public int? CustomerId { get; set; }
        public string? CustomerName { get; set; }

        [Display(Name = "Sale Order")]

        public int? SaleOrderId { get; set; }
        public string? SaleOrderCode { get; set; }

        public decimal SubTotal { get; set; }
        public decimal TotalSD { get; set; }
        public decimal TotalVAT { get; set; }
        public decimal GrandTotal { get; set; }
        public decimal PaidAmount { get; set; }

        [Display(Name = "Delivery Address")]
        public string? DeliveryAddress { get; set; }

        [Display(Name = "Invoice Date")]
        public string? InvoiceDateTime { get; set; }

        [Display(Name = "Comments")]
        public string? Comments { get; set; }

        [Display(Name = "Transaction Type")]
        public string? TransactionType { get; set; }

        [Required]
        [Display(Name = "Posted")]
        public bool IsPost { get; set; }

        [Display(Name = "Posted By")]
        public string? PostedBy { get; set; }

        [Display(Name = "Posted On")]

        public string? PostedOn { get; set; }

        [Display(Name = "Period")]
        public string? PeriodId { get; set; }

        [Display(Name = "Created By")]
        public string? CreatedBy { get; set; }

        [Display(Name = "Created On")]

        public string? CreatedOn { get; set; }
        public string? CreatedFrom { get; set; }

        [Display(Name = "Last Modified By")]
        public string? LastModifiedBy { get; set; }

        [Display(Name = "Last Modified On")]
        public string? LastModifiedOn { get; set; }
        public string? LastUpdateFrom { get; set; }

        public int? DecimalPlace { get; set; }
        public string? Operation { get; set; }
        [Display(Name = "Branch Name")]
        public int? Branchs { get; set; }

        [Display(Name = "From Date")]
        public string? FromDate { get; set; }

        [Display(Name = "To Date")]
        public string? ToDate { get; set; }
        public string?[] IDs { get; set; }
        public string? BranchName { get; set; }
        public string? Status { get; set; }
        public string? IsPosted { get; set; }
        public List<SaleDetailVM> saleDetailsList { get; set; }

        public SaleVM()
        {
            saleDetailsList = new List<SaleDetailVM>();
        }
    }


}

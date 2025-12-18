using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace ShampanPOS.Models
{

    public class SaleOrderVM
    {
        public int Id { get; set; }
        [Display(Name = "Code(Auto Generate)")]
        public string? Code { get; set; }
        [Display(Name = "Distributor")]
        public int BranchId { get; set; }

        [Display(Name = "Customer")]
        public int? CustomerId { get; set; }
        public string? CustomerName { get; set; }

        [Display(Name = "Delivery Address")]
        public string? DeliveryAddress { get; set; }

        [Display(Name = "Expected Delivery Date")]
        public string? DeliveryDate { get; set; }
        public string? OrderDate { get; set; }

        [Display(Name = "Comments")]
        public string? Comments { get; set; }

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
        public string? Status { get; set; }
        public string? PostStatus { get; set; }

        [Display(Name = "From Date")]
        public string? FromDate { get; set; }

        [Display(Name = "To Date")]
        public string? ToDate { get; set; }

        [Display(Name = "Posted")]
        public string? IsPosted { get; set; }

        public string? BranchName { get; set; }

        public List<SaleOrderDetailVM> saleOrderDetailsList { get; set; }
        //public decimal? Latitude { get; set; }

        //public decimal? Longitude { get; set; }
        public SaleOrderVM()
        {
            saleOrderDetailsList = new List<SaleOrderDetailVM>();
        }

    }


}
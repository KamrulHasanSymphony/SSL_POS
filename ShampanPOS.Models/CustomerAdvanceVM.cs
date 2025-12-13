using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{

    public class CustomerAdvanceVM
    {

        public int Id { get; set; }


        [Display(Name = "Customer")]
        public int CustomerId { get; set; }
        public string? CustomerName { get; set; }

        public string? BranchName { get; set; }

        [Display(Name = "Advance Entry Date")]
        public string? AdvanceEntryDate { get; set; }
        public string? Name { get; set; }
        public string? EnumType { get; set; }
        public string? Operation { get; set; }

        [Display(Name = "Advance Amount")]
        [DataType(DataType.Currency)]
        [Range(1,double.MaxValue, ErrorMessage = "Advance Amount must be greater than zero.")]
        public decimal? AdvanceAmount { get; set; }

        [Display(Name = "Payment Type")]
        public int? PaymentEnumTypeId { get; set; }

        [Display(Name = "Payment Date")]
        public string? PaymentDate { get; set; }

        [Display(Name = "Document No.")]
        public string? DocumentNo { get; set; }

        [Display(Name = "Bank Name")]
        public string? BankName { get; set; }

        [Display(Name = "Bank Branch Name")]
        public string? BankBranchName { get; set; }
        [Display(Name = "Distributor Code")]

        public string? DistributorCode { get; set; }
        public string? Code { get; set; }


        [Display(Name = "Received By Delivery Person")]
        public int? ReceiveByDeliveryPersonId { get; set; }

        [Display(Name = "Received By Enum Type")]
        public int? ReceiveByEnumTypeId { get; set; }

        [Display(Name = "Approved")]
        public bool IsApproved { get; set; }

        [Display(Name = "Approved By")]
        public int? ApproveBy { get; set; }

        [Display(Name = "Approval Date")]
        public string? ApproveDate { get; set; }

        [Display(Name = "Posted")]
        public bool IsPosted { get; set; }

        [Display(Name = "Posted By")]
        public string? PostedBy { get; set; }

        [Display(Name = "Posted Date")]
        public string? PostedDate { get; set; }

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
        public string? BanglaName { get; set; }
        public string? PostedOn { get; set; }
        public string? Status { get; set; }
        public bool IsPost { get; set; }
        public int BranchId { get; set; }
        public bool? IsIndex { get; set; }
        public string? CustomerCode { get; set; }

    }


}

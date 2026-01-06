using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class PaymentVM
    {
        public int Id { get; set; }

        [Display(Name = "Code")]
        public string? Code { get; set; }
        public string? PaymentCode { get; set; }

        [Display(Name = "Supplier")]
        public int SupplierId { get; set; }

        public string? SupplierName { get; set; }
        public string? AccountName { get; set; }
        public string? AccountNo { get; set; }

        [Display(Name = "Transaction Date")]
        public string TransactionDate { get; set; }

        [Display(Name = "Bank Account")]
        public int BankAccountId { get; set; }

        [Display(Name = "Cash")]
        public bool IsCash { get; set; }

        [Display(Name = "Comments")]
        public string? Comments { get; set; }

        [Display(Name = "Reference")]
        public string? Reference { get; set; }

        [Display(Name = "Total Payment Amount")]

        public decimal TotalPaymentAmount { get; set; }

        [Display(Name = "Archived")]
        public bool IsArchive { get; set; }

        [Display(Name = "Created By")]
        public string? CreatedBy { get; set; }

        [Display(Name = "Created On")]
        public string? CreatedOn { get; set; }

        [Display(Name = "Last Modified By")]
        public string? LastModifiedBy { get; set; }

        [Display(Name = "Last Modified On")]
        public string? LastModifiedOn { get; set; }

        [Display(Name = "Operation")]
        public string? Operation { get; set; }

        [Display(Name = "IsActive")]
        public bool IsActive { get; set; }

        [Display(Name = "CreatedFrom")]
        public string? CreatedFrom { get; set; }

        [Display(Name = "Last Update From")]
        public string? LastUpdateFrom { get; set; }
        public string? Status { get; set; }

        public string?[] IDs { get; set; }


        public List<PaymentDetailVM> paymentDetailList { get; set; }
       
        public PaymentVM()
        {
            paymentDetailList = new List<PaymentDetailVM>();

        }
    }
}

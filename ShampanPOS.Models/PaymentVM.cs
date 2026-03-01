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

            [StringLength(50)]
            [Display(Name = "Code")]
            public string? Code { get; set; }

            [Display(Name = "Supplier")]
            [Required(ErrorMessage = "Supplier is required.")]
            public int? SupplierId { get; set; }

            public string? UserId { get; set; }
            public string? SupplierName { get; set; }
            public string? AccountName { get; set; }
            public string? AccountNo { get; set; }

            [Required(ErrorMessage = "Transaction Date is required.")]
            [DataType(DataType.Date)]
            [Display(Name = "Transaction Date")]
            public DateTime? TransactionDate { get; set; }

            [Required(ErrorMessage = "Bank Account is required.")]
            [Display(Name = "Bank Account")]
            public int? BankAccountId { get; set; }

            [Required(ErrorMessage = "Payment type (Cash/Bank) is required.")]
            [Display(Name = "Cash")]
            public bool IsCash { get; set; }

            [StringLength(50)]
            [Display(Name = "Comments")]
            public string? Comments { get; set; }

            [StringLength(500)]
            [Display(Name = "Reference")]
            public string? Reference { get; set; }

            [Required(ErrorMessage = "Total Payment Amount is required.")]
            //[Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than zero.")]
            [Display(Name = "Total Payment Amount")]
            public decimal? TotalPaymentAmount { get; set; }

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

            public string? Operation { get; set; }
            public bool IsActive { get; set; }

            public string? CreatedFrom { get; set; }
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


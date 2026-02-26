using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class WithdrawalVM
    {

        public int Id { get; set; }

        [StringLength(50, ErrorMessage = "Code cannot exceed 50 characters.")]
        [Display(Name = "Code")]
        public string? Code { get; set; }

        [Required(ErrorMessage = "From Bank Account is required.")]
        [Display(Name = "From Bank Account")]
        public int? FromBankAccountId { get; set; }

        [Required(ErrorMessage = "To Bank Account is required.")]
        [Display(Name = "To Bank Account")]
        public int? ToBankAccountId { get; set; }

        [StringLength(500, ErrorMessage = "Cheque No cannot exceed 500 characters.")]
        [Display(Name = "Cheque No")]
        public string? ChequeNo { get; set; }

        [StringLength(50, ErrorMessage = "Account No cannot exceed 50 characters.")]
        [Display(Name = "Account No")]
        public string? AccountNo { get; set; }

        [StringLength(500, ErrorMessage = "Cheque Bank Name cannot exceed 500 characters.")]
        [Display(Name = "Cheque Bank Name")]
        public string? ChequeBankName { get; set; }

        [StringLength(300, ErrorMessage = "Account Name cannot exceed 300 characters.")]
        [Display(Name = "Account Name")]
        public string? AccountName { get; set; }

        [Required(ErrorMessage = "Transaction Date is required.")]
        [Display(Name = "Transaction Date")]
        public string TransactionDate { get; set; }

        [Required(ErrorMessage = "Cheque Date is required.")]
        [Display(Name = "Cheque Date")]
        public string ChequeDate { get; set; }

        [Required(ErrorMessage = "Cash is required.")]
        [Display(Name = "Cash")]
        public bool IsCash { get; set; }

        [StringLength(50, ErrorMessage = "Comments cannot exceed 50 characters.")]
        [Display(Name = "Comments")]
        public string? Comments { get; set; }

        [StringLength(50, ErrorMessage = "Reference cannot exceed 50 characters.")]
        [Display(Name = "Reference")]
        public string? Reference { get; set; }

        //[Range(0, double.MaxValue, ErrorMessage = "Total Deposit Amount must be a positive value.")]
        [Display(Name = "Total Deposit Amount")]
        public decimal? TotalDepositAmount { get; set; }

        [Display(Name = "Archived")]
        public bool IsArchive { get; set; }

        [Display(Name = "Active")]
        public bool IsActive { get; set; }

        [StringLength(120, ErrorMessage = "Created By cannot exceed 120 characters.")]
        [Display(Name = "Created By")]
        public string? CreatedBy { get; set; }

        [Display(Name = "Created On")]
        public string? CreatedOn { get; set; }

        [StringLength(120, ErrorMessage = "Last Modified By cannot exceed 120 characters.")]
        [Display(Name = "Last Modified By")]
        public string? LastModifiedBy { get; set; }

        [Display(Name = "Last Modified On")]
        public string? LastModifiedOn { get; set; }

        [StringLength(64, ErrorMessage = "Created From cannot exceed 64 characters.")]
        [Display(Name = "CreatedFrom")]
        public string? CreatedFrom { get; set; }

        [StringLength(64, ErrorMessage = "Last Update From cannot exceed 64 characters.")]
        [Display(Name = "Last Update From")]
        public string? LastUpdateFrom { get; set; }

        [StringLength(50, ErrorMessage = "Status cannot exceed 50 characters.")]
        [Display(Name = "Status")]
        public string? Status { get; set; }

        [StringLength(50, ErrorMessage = "Operation cannot exceed 50 characters.")]
        [Display(Name = "Operation")]
        public string? Operation { get; set; }



    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class CollectionVM
    {
            public int Id { get; set; }

            [Display(Name = "Code")]
            [StringLength(50, ErrorMessage = "Code cannot exceed 50 characters.")]
            public string? Code { get; set; }

            [Display(Name = "Sale Code")]
            [StringLength(50, ErrorMessage = "Sale Code cannot exceed 50 characters.")]
            public string? SaleCode { get; set; }

            //[Required(ErrorMessage = "Bank Account is required.")]
            [Display(Name = "Bank Account")]
            public int BankAccountId { get; set; }

            [Required(ErrorMessage = "Customer is required.")]
            [Display(Name = "Customer")]
            public int CustomerId { get; set; }

            [Display(Name = "Customer Name")]
            [StringLength(100, ErrorMessage = "Customer Name cannot exceed 100 characters.")]
            public string? CustomerName { get; set; }

            [StringLength(50, ErrorMessage = "Account No cannot exceed 50 characters.")]
            [Display(Name = "Account No")]
            public string? AccountNo { get; set; }

            [StringLength(100, ErrorMessage = "Account Name cannot exceed 100 characters.")]
            [Display(Name = "Account Name")]
            public string? AccountName { get; set; }

            [StringLength(500, ErrorMessage = "Cheque No cannot exceed 500 characters.")]
            [Display(Name = "Cheque No")]
            public string? ChequeNo { get; set; }

            [StringLength(500, ErrorMessage = "Cheque Bank Name cannot exceed 500 characters.")]
            [Display(Name = "Cheque Bank Name")]
            public string? ChequeBankName { get; set; }

            [Required(ErrorMessage = "Cheque Date is required.")]
            [Display(Name = "Cheque Date")]
            [DataType(DataType.Date)]
            public string ChequeDate { get; set; }

            [Required(ErrorMessage = "Transaction Date is required.")]
            [Display(Name = "Transaction Date")]
            [DataType(DataType.Date)]
            public string TransactionDate { get; set; }

            [Required(ErrorMessage = "Cash is required.")]
            [Display(Name = "Cash")]
            public bool IsCash { get; set; }

            [StringLength(250, ErrorMessage = "Comments cannot exceed 250 characters.")]
            [Display(Name = "Comments")]
            public string? Comments { get; set; }

            [Required(ErrorMessage = "Total Collect Amount is required.")]
            //[Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than zero.")]
            [Display(Name = "Total Collect Amount")]
            public decimal TotalCollectAmount { get; set; }

            [Display(Name = "Archived")]
            public bool IsArchive { get; set; }

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

            [StringLength(50, ErrorMessage = "Operation cannot exceed 50 characters.")]
            [Display(Name = "Operation")]
            public string? Operation { get; set; }

            [Display(Name = "Active")]
            public bool IsActive { get; set; }

            [StringLength(64, ErrorMessage = "Created From cannot exceed 64 characters.")]
            [Display(Name = "Created From")]
            public string? CreatedFrom { get; set; }

            [StringLength(64, ErrorMessage = "Last Update From cannot exceed 64 characters.")]
            [Display(Name = "Last Update From")]
            public string? LastUpdateFrom { get; set; }

            [StringLength(50, ErrorMessage = "Status cannot exceed 50 characters.")]
            [Display(Name = "Status")]
            public string? Status { get; set; }

            [Display(Name = "Grand Total")]
            public decimal? GrandTotal { get; set; }

            [Display(Name = "Transaction Type")]
            [StringLength(50, ErrorMessage = "Transaction Type cannot exceed 50 characters.")]
            public string? TransactionType { get; set; }

            public List<CollectionDetailVM> collectionDetailList { get; set; }

            public CollectionVM()
            {
                collectionDetailList = new List<CollectionDetailVM>();
            }
        }


    }


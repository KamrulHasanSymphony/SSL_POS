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
        public string? Code { get; set; }

        public string? SaleCode { get; set; }

        [Display(Name = "Bank Account")]
        public int BankAccountId { get; set; }

        [Display(Name = "Customer")]
        public int CustomerId { get; set; }

        public string? CustomerName { get; set; }
        public string? AccountNo { get; set; }
        public string? AccountName { get; set; }

        [Display(Name = "Cheque No")]
        public string? ChequeNo { get; set; }
        [Display(Name = "Cheque Bank Name")]
        public string? ChequeBankName { get; set; }

        [Display(Name = "Cheque Date")]
        public string ChequeDate { get; set; }

        [Display(Name = "Transaction Date")]
        public string TransactionDate { get; set; }

        [Display(Name = "Is Cash")]
        public bool IsCash { get; set; }

        [Display(Name = "Comments")]
        public string? Comments { get; set; }

        [Display(Name = "Total Collect Amount")]

        public decimal TotalCollectAmount { get; set; }

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
        public decimal? GrandTotal { get; set; }

        public string? TransactionType { get; set; }


        public List<CollectionDetailVM> collectionDetailList { get; set; }

        public CollectionVM()
        {
            collectionDetailList = new List<CollectionDetailVM>();

        }
    }
}

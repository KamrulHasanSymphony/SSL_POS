using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class BankTransactionReportVM
    {
        // Filters
        public int? BankId { get; set; }
        public int? BankAccountId { get; set; }
        public int? TransactionId { get; set; }
        public int? BranchId { get; set; }
        public string? TransactionType { get; set; } // "Deposit", "Withdrawal", or null (All)
        public string? FromDate { get; set; }
        public string? ToDate { get; set; }
        public bool IsSummary { get; set; }
        public string? Operation { get; set; }

        // Report Data Fields
        public string? TransactionCode { get; set; }
        public string? TransactionDate { get; set; }
        public string? Reference { get; set; }
        public decimal Amount { get; set; }
        public bool IsCash { get; set; }
        public string? ChequeNo { get; set; }
        public string? ChequeBankName { get; set; }
        public string? ChequeDate { get; set; }
        public string? Comments { get; set; }

        // Account
        public int? AccountId { get; set; }
        public string? AccountNo { get; set; }
        public string? AccountName { get; set; }

        // Bank
        public string? BankName { get; set; }
        public string? BankCode { get; set; }

        // Metadata
        public string? CreatedBy { get; set; }
        public string? CreatedOn { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsArchive { get; set; }

        // Company / Branch (for report header)
        public int? CompanyId { get; set; }
        public string? CompanyName { get; set; }
        public string? BranchName { get; set; }


        // Add these two new properties to BankTransactionReportVM
        public int? DepositId { get; set; }
        public string? DepositCode { get; set; }

        public int? WithdrawalId { get; set; }
        public string? WithdrawalCode { get; set; }
    }
}

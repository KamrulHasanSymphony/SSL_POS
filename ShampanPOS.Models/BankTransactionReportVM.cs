using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class BankTransactionReportVM
    {
        // Filters
        [DisplayName("Bank")]
        public int? BankId { get; set; }
        [DisplayName("BankAccount")]
        public int? BankAccountId { get; set; }
        [DisplayName("Transaction No")]
        public int? TransactionId { get; set; }
        [DisplayName("Branch")]
        public int? BranchId { get; set; }
        [DisplayName("Source")]
        public string? TransactionType { get; set; } // "Deposit", "Withdrawal", or null (All)

        [DisplayName("Type")]
        public string InOut { get; set; }
        [DisplayName("Source")]
        public string? SourceTable { get; set; }
        public decimal? OpeningBalance { get; set; }
        public decimal? RunningBalance { get; set; }
        [DisplayName("From Date")]
        public string? FromDate { get; set; }
        [DisplayName("To Date")]
        public string? ToDate { get; set; }
        [DisplayName("Summary")]
        public bool IsSummary { get; set; }
        public string? Operation { get; set; }

        // Report Data Fields
        [DisplayName("Transaction Code")]
        public string? TransactionCode { get; set; }
        [DisplayName("Transaction Date")]
        public string? TransactionDate { get; set; }
        [DisplayName("Reference")]
        public string? Reference { get; set; }
        [DisplayName("Amount")]
        public decimal Amount { get; set; }
        [DisplayName("Cash")]
        public bool IsCash { get; set; }
        [DisplayName("Cheque No")]
        public string? ChequeNo { get; set; }
        [DisplayName("Cheque Bank Name")]
        public string? ChequeBankName { get; set; }
        [DisplayName("Cheque Date")]
        public string? ChequeDate { get; set; }
        [DisplayName("Comments")]
        public string? Comments { get; set; }

        // Account
        [DisplayName("Account")]
        public int? AccountId { get; set; }
        [DisplayName("Account No")]
        public string? AccountNo { get; set; }
        [DisplayName("Account Name")]
        public string? AccountName { get; set; }

        [DisplayName("Customer / Party")]
        public string? PartyName { get; set; }
        [DisplayName("Bank Branch")]
        public string? BankBranchName { get; set; }

        // Bank
        [DisplayName("Bank Name")]
        public string? BankName { get; set; }
        [DisplayName("Bank Code")]
        public string? BankCode { get; set; }

        // Metadata
        [DisplayName("Created By")]
        public string? CreatedBy { get; set; }
        [DisplayName("Created On")]
        public string? CreatedOn { get; set; }
        [DisplayName("Is Active")]
        public bool? IsActive { get; set; }
        [DisplayName("Is Archive")]
        public bool? IsArchive { get; set; }

        // Company / Branch (for report header)
        [DisplayName("Company")]
        public int? CompanyId { get; set; }
        [DisplayName("Company Name")]
        public string? CompanyName { get; set; }
        [DisplayName("Branch Name")]
        public string? BranchName { get; set; }


        // Add these two new properties to BankTransactionReportVM
        [DisplayName("Deposit")]
        public int? DepositId { get; set; }
        [DisplayName("Deposit Code")]
        public string? DepositCode { get; set; }

        [DisplayName("Withdrawal")]
        public int? WithdrawalId { get; set; }
        [DisplayName("Withdrawal Code")]
        public string? WithdrawalCode { get; set; }
    }

    public class BankAccountDataVM
    {
        [DisplayName("Id")]
        public int Id { get; set; }
        [DisplayName("Account No")]
        public string AccountNo { get; set; }
        [DisplayName("Account Name")]
        public string AccountName { get; set; }
        [DisplayName("Bank")]
        public int BankId { get; set; }
        [DisplayName("Bank Name")]
        public string BankName { get; set; }
        [DisplayName("Bank Code")]
        public string BankCode { get; set; }
    }

    public class DepositDataVM
    {
        [DisplayName("Id")]
        public int Id { get; set; }
        [DisplayName("Code")]
        public string Code { get; set; }
        [DisplayName("Transaction Date")]
        public string? TransactionDate { get; set; }
        [DisplayName("Total Deposit Amount")]
        public decimal TotalDepositAmount { get; set; }
        [DisplayName("To Bank Account")]
        public int ToBankAccountId { get; set; }
        [DisplayName("Account No")]
        public string AccountNo { get; set; }
        [DisplayName("Account Name")]
        public string AccountName { get; set; }
        [DisplayName("Bank Name")]
        public string BankName { get; set; }
        [DisplayName("Reference")]
        public string Reference { get; set; }
    }

    public class WithdrawalDataVM
    {
        [DisplayName("Id")]
        public int Id { get; set; }
        [DisplayName("Code")]
        public string Code { get; set; }
        [DisplayName("Transaction Date")]
        public string? TransactionDate { get; set; }
        [DisplayName("Total Deposit Amount")]
        public decimal TotalDepositAmount { get; set; }
        [DisplayName("From Bank Account")]
        public int FromBankAccountId { get; set; }
        [DisplayName("Account No")]
        public string AccountNo { get; set; }
        [DisplayName("Account Name")]
        public string AccountName { get; set; }
        [DisplayName("Bank Name")]
        public string BankName { get; set; }
        [DisplayName("Reference")]
        public string Reference { get; set; }
    }
}

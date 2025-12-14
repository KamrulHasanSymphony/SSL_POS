using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Web;


namespace ShampanPOS.Models
{
    public class CustomerPaymentCollectionVM
    {
        public int? Id { get; set; }
        [Display(Name = "Code")]
        public string? Code { get; set; }
        [Display(Name = "Customer Name")]
        public int? CustomerId { get; set; }

        //[Display(Name = "Sale Delevery ")]
        //public int? SaleDeleveryId { get; set; }
        //[Display(Name = "Sale Delevery No")]
        //public string? SaleDeleveryNo { get; set; }

        [Display(Name = "Transaction Date")]
        public string? TransactionDate { get; set; }
        public string? Name { get; set; }
        [Display(Name = "Mode Of Payment")]
        public string? ModeOfPayment { get; set; }
        [Display(Name = "Mode Of Payment No")]
        public string? ModeOfPaymentNo { get; set; }
        [Display(Name = "Mode Of Payment Date")]

        public string? ModeOfPaymentDate { get; set; }
        [Display(Name = "Sale Person ")]
        public string? UserId { get; set; }
        public string? Attachment { get; set; }
        public decimal? Amount { get; set; }
        public decimal? RestAmount { get; set; }
        [Display(Name = "Created By")]
        public string? CreatedBy { get; set; }

        [Display(Name = "Created On")]
        public string? CreatedOn { get; set; }

        [Display(Name = "Last Modified By")]
        public string? LastModifiedBy { get; set; }

        [Display(Name = "Last Modified On")]
        public string? LastModifiedOn { get; set; }
        public string? Operation { get; set; }
        public string? Status { get; set; }
        public string? ModeOfPaymentName { get; set; }
        public string? CustomerName { get; set; }
        public string? FileName { get; set; }
        public string?[] IDs { get; set; }
        public bool IsPost { get; set; }
        public bool IsProcessed { get; set; }
        [Display(Name = "File Name")]
        [Required(ErrorMessage = "Please upload an image file.")]
        public string? ImagePath { get; set; }
        public int BranchId { get; set; }


    }


}

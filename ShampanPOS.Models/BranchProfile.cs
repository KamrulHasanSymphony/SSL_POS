using System;
using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{
    public class BranchProfile
    {
        public int? BranchID { get; set; }
        [Display(Name = "Code(Auto Generate)")]
        public string BranchCode { get; set; }
        [Display(Name = "Name")]
        [Required(ErrorMessage = "Distributor Name is required")]
        public string BranchName { get; set; }
        [Display(Name = "Branch Legal Name")]
        public string BranchLegalName { get; set; }
        [Display(Name = "Address")]
        public string? Address { get; set; }
        [Display(Name = "City")]
        public string? City { get; set; }
        [Display(Name = "Zip Code")]
        public string? ZipCode { get; set; }
        [Display(Name = "Telephone No")]
        public string? TelephoneNo { get; set; }
        [Display(Name = "Fax No.")]
        public string? FaxNo { get; set; }
        [Display(Name = "Email")]
        public string? Email { get; set; }
        [Display(Name = "Contact Person")]
        public string? ContactPerson { get; set; }
        [Display(Name = "Contact Person Designation")]
        public string? ContactPersonDesignation { get; set; }
        [Display(Name = "Contact Person Telephone")]
        public string? ContactPersonTelephone { get; set; }
        [Display(Name = "Contact Person Email")]
        public string? ContactPersonEmail { get; set; }
        [Display(Name = "VatRegistrationNo")]
        public string? VatRegistrationNo { get; set; }
        [Display(Name = "BIN")]
        public string? BIN { get; set; }
        [Display(Name = "TINNo")]
        public string? TINNo { get; set; }
        [Display(Name = "Comments")]
        public string? Comments { get; set; }
        [Display(Name = "Active Status")]
        public bool ActiveStatus { get; set; }
        [Display(Name = "Currency")]
        public int? CurrencyId { get; set; }
        public string CreatedBy { get; set; }
        [Display(Name = "Cogs Code")]

        public string? CogsCode { get; set; }
        [Display(Name = "CogsCode Description")]

        public string? CogsCodeDescription { get; set; }
        [Display(Name = "Tax Code")]

        public string? TaxCode { get; set; }
        [Display(Name = "TaxCode Description")]

        public string? TaxCodeDescription { get; set; }
        [Display(Name = "Vat Code")]

        public string? VatCode { get; set; }

        [Display(Name = "VatCode Description")]
        public string? VatCodeDescription { get; set; }

        [Display(Name = "Company Code")]
        public string CompanyCode { get; set; }
        [Display(Name = "Company Name")]
        public string CompanyName { get; set; }


        [Display(Name = "Company Address")]
        public string? CompanyAddress { get; set; }

        [Display(Name = "From Date")]
        public string FromDate { get; set; }
        [Display(Name = "To Date")]
        public string ToDate { get; set; }

        public DateTime? CreatedOn { get; set; }

        public string LastModifiedBy { get; set; }

        public DateTime? LastModifiedOn { get; set; }

        public bool IsArchive { get; set; }

        [Display(Name = "Sage Branch Code")]
        public string? CurrentBranchId { get; set; }
        public string? SageBranchCode { get; set; }
        public string? DLRCreditCOA { get; set; }
        public string msg { get; set; }
        public string IP { get; set; }
        public string DbName { get; set; }
        public string Id { get; set; }
        public string Pass { get; set; }
        public string DbType { get; set; }
        public string IsWCF { get; set; }
        public string IntegrationCode { get; set; }
        public string IsCentral { get; set; }
        public string Operation { get; set; }

        [Display(Name = "Branch Name")]
        public int? Branchs { get; set; }       
        public Audit Audit { get; set; }
        public string? UserId { get; set; }

        public BranchProfile()
        {
            Audit = new Audit();
        }

    }

}

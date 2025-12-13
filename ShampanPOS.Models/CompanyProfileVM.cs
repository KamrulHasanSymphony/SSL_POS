using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{
    public class CompanyProfileVM
    {
        public int Id { get; set; }

        [DisplayName("Code")]
        public string? Code { get; set; }

        [Required]
        [DisplayName("Company Name")]
        public string CompanyName { get; set; }

        [DisplayName("Company Bangla Name")]
        public string? CompanyBanglaName { get; set; }

        [DisplayName("Company Legal Name")]
        public string? CompanyLegalName { get; set; }

        [DisplayName("Address Line")]
        public string? Address { get; set; }

        [DisplayName("City")]
        public string? City { get; set; }

        [DisplayName("Zip Code")]
        public string? ZipCode { get; set; }

        [DisplayName("Telephone No.")]
        public string? TelephoneNo { get; set; }

        [DisplayName("Fax No.")]
        public string? FaxNo { get; set; }

        [DisplayName("Email")]
        public string? Email { get; set; }

        [DisplayName("Contact Person")]
        public string? ContactPerson { get; set; }

        [DisplayName("Contact Person's Designation")]
        public string? ContactPersonDesignation { get; set; }

        [DisplayName("Contact Person's Telephone")]
        public string? ContactPersonTelephone { get; set; }

        [DisplayName("Contact Person's Email")]
        public string? ContactPersonEmail { get; set; }

        [DisplayName("Comments")]
        public string? Comments { get; set; }

        [Required]
        [DisplayName("Fiscal Year Start")]
        [DataType(DataType.Date)]
        public DateTime FYearStart { get; set; }

        [Required]
        [DisplayName("Fiscal Year End")]
        [DataType(DataType.Date)]
        public DateTime FYearEnd { get; set; }

        [DisplayName("Business Nature")]
        public string? BusinessNature { get; set; }

        [DisplayName("BIN")]
        public string? BIN { get; set; }

        [DisplayName("TIN")]
        public string? TIN { get; set; }

        [Display(Name = "Archived")]
        public bool IsArchive { get; set; }

        [Display(Name = "Active Status")]
        public bool IsActive { get; set; }

        [Display(Name = "Created By")]
        public string? CreatedBy { get; set; }

        [Display(Name = "Created From")]
        public string? CreatedFrom { get; set; }

        [Display(Name = "Created On")]
        [DataType(DataType.DateTime)]
        public DateTime? CreatedOn { get; set; }

        [Display(Name = "Last Modified By")]
        public string? LastModifiedBy { get; set; }

        [Display(Name = "Last Update From")]
        public string? LastUpdateFrom { get; set; }

        [Display(Name = "Last Modified On")]
        [DataType(DataType.DateTime)]
        public DateTime? LastModifiedOn { get; set; }


        public string? Operation { get; set; }

        public string? Status { get; set; }
    }

}



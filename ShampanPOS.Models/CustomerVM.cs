using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{

    public class CustomerVM
    {
        //public int Id { get; set; }
        //[Display(Name = "Code(Auto Generate)")]
        //public string? Code { get; set; }
        //[Required(ErrorMessage = "Customer Name is required.")]
        //[StringLength(50, ErrorMessage = "Name cannot exceed 50 characters.")]
        //[Display(Name = "Name ")]
        //public string? Name { get; set; }
        //[Display(Name = "Branch")]
        //public int? BranchId { get; set; }
        //[Display(Name = "Customer Group")]
        //public int? CustomerGroupId { get; set; }

        //[Display(Name = "Bangla Name")]
        //public string? BanglaName { get; set; }

        //[Display(Name = "Address")]
        //public string? Address { get; set; }

        //[Display(Name = "Bangla Address")]
        //public string? BanglaAddress { get; set; }


        //[Display(Name = "Mobile No.")]
        //[Required(ErrorMessage = "Telephone No. is required.")]

        //public string? TelephoneNo { get; set; }

        //[Display(Name = "Fax No.")]
        //public string? FaxNo { get; set; }

        //[Display(Name = "Email")]
        //[RegularExpression(@"^[^@\s]+@[^@\s]+\.[^@\s]+$",ErrorMessage = "Invalid email format")]
        //public string? Email { get; set; }

        //[Display(Name = "TIN No.")]
        //public string? TINNo { get; set; }

        //[Display(Name = "BIN No.")]
        //public string? BINNo { get; set; }

        //[Display(Name = "NID No.")]
        //public string? NIDNo { get; set; }

        //[Display(Name = "Comments")]
        //public string? Comments { get; set; }

        //[Display(Name = "Archived")]
        //public bool IsArchive { get; set; }

        //[Display(Name = "Active Status")]
        //public bool IsActive { get; set; }

        //[Display(Name = "Created By")]
        //public string? CreatedBy { get; set; }

        //[Display(Name = "Created On")]
        //public string? CreatedOn { get; set; }

        //[Display(Name = "Last Modified By")]
        //public string? LastModifiedBy { get; set; }

        //[Display(Name = "Last Modified On")]
        //public string? LastModifiedOn { get; set; }

        //[Display(Name = "Operation")]
        //public string? Operation { get; set; }
        //[Display(Name = "CreatedFrom")]
        //public string? CreatedFrom { get; set; }

        //[Display(Name = "Last Update From")]
        //public string? LastUpdateFrom { get; set; }
        //[Display(Name = "Image")]
        //public string? ImagePath { get; set; }
        //public string?[] IDs { get; set; }


        //[Display(Name = "Branch Name")]
        //public int? Branchs { get; set; }

        //[Display(Name = "From Date")]
        //public string? FromDate { get; set; }
        //public int? DecimalPlace { get; set; }
        //[Display(Name = "To Date")]
        //public string? ToDate { get; set; }
        //[Display(Name = "Posted")]
        //public string? IsPosted { get; set; }

        //public string? Status { get; set; }
        //public string? CustomerGroupName { get; set; }

        //public string? BranchAddress { get; set; }
        //public string? CompanyAddress { get; set; }
        //public string? CompanyName { get; set; }
        //public string? CompanyTelephoneNo { get; set; }
        //public string? CompanyEmail { get; set; }
        //public string? BranchName { get; set; }
        //public string? ByGroup { get; set; }
        //public int CompanyId { get; set; }

        //public Dictionary<string, string>? ColunWidth { get; set; }
        //public Dictionary<string, string>? PageSize { get; set; }




        public int Id { get; set; }

        [Display(Name = "Code(Auto Generate)")]
        public string? Code { get; set; }

        [Required(ErrorMessage = "Customer Name is required.")]
        [StringLength(50, ErrorMessage = "Name cannot exceed 50 characters.")]
        [Display(Name = "Name")]
        public string? Name { get; set; }

        [Display(Name = "Branch")]
        public int? BranchId { get; set; }

        [Required(ErrorMessage = "Customer Group is required.")]

        [Display(Name = "Customer Group")]
        public int? CustomerGroupId { get; set; }

        [Display(Name = "Bangla Name")]
        public string? BanglaName { get; set; }

        [Display(Name = "Address")]
        public string? Address { get; set; }

        [Display(Name = "Bangla Address")]
        public string? BanglaAddress { get; set; }

        [Required(ErrorMessage = "Telephone No. is required.")]
        [Display(Name = "Mobile No.")]
        public string? TelephoneNo { get; set; }

        [Display(Name = "Fax No.")]
        public string? FaxNo { get; set; }

        [Display(Name = "Email")]
        [RegularExpression(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", ErrorMessage = "Invalid email format")]
        public string? Email { get; set; }

        [Display(Name = "TIN No.")]
        public string? TINNo { get; set; }

        [Display(Name = "BIN No.")]
        public string? BINNo { get; set; }

        [Display(Name = "NID No.")]
        public string? NIDNo { get; set; }

        [Display(Name = "Comments")]
        public string? Comments { get; set; }

        [Display(Name = "Archived")]
        public bool IsArchive { get; set; }

        [Display(Name = "Active Status")]
        public bool IsActive { get; set; }

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

        [Display(Name = "Created From")]
        public string? CreatedFrom { get; set; }

        [Display(Name = "Last Update From")]
        public string? LastUpdateFrom { get; set; }

        [Display(Name = "Image")]
        public string? ImagePath { get; set; }

        public string?[] IDs { get; set; }

        [Display(Name = "Branch Name")]
        public int? Branchs { get; set; }

        [Display(Name = "From Date")]
        public string? FromDate { get; set; }

        public int? DecimalPlace { get; set; }

        [Display(Name = "To Date")]
        public string? ToDate { get; set; }

        [Display(Name = "Posted")]
        public string? IsPosted { get; set; }

        public string? Status { get; set; }

        public string? CustomerGroupName { get; set; }

        public string? BranchAddress { get; set; }
        public string? CompanyAddress { get; set; }
        public string? CompanyName { get; set; }
        public string? CompanyTelephoneNo { get; set; }
        public string? CompanyEmail { get; set; }
        public string? BranchName { get; set; }
        public string? ByGroup { get; set; }

        public int CompanyId { get; set; }

        public Dictionary<string, string>? ColunWidth { get; set; }
        public Dictionary<string, string>? PageSize { get; set; }




    }
}

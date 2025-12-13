using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{


    public class DeliveryPersonVM
    {
        public int Id { get; set; }
        [Display(Name = "Code(Auto Generate)")]
        public string? Code { get; set; }
        [Display(Name = "Distributor Code")]
        public string? DistributorCode { get; set; }
        [Display(Name = "Name")]
        [Required(ErrorMessage = "Delivery Person Name is required.")]
        public string Name { get; set; }
        [Display(Name = "Bangla Name")]
        public string? BanglaName { get; set; }
        [Display(Name = "Branch")]
        public int? BranchId { get; set; }
        [Display(Name = "Type")]
        public int? EnumTypeId { get; set; }
        [Display(Name = "Name")]
        public string? EnumName { get; set; }
        public string? EnumType { get; set; }

        [Display(Name = "Comments")]
        public string? Comments { get; set; }
        [Display(Name = "City")]
        public string? City { get; set; }

        [Display(Name = "Fax No.")]
        public string? FaxNo { get; set; }

        [Display(Name = "NID No.")]
        [Required(ErrorMessage = "NID No. is required.")]
        public string NIDNo { get; set; }

        [Display(Name = "Mobile")]
        [Required(ErrorMessage = "Mobile No. is required.")]
        [RegularExpression(@"^\+?[0-9]{10,15}$", ErrorMessage = "Mobile No. must be between 10 and 15 digits, with an optional '+' sign.")]
        public string Mobile { get; set; }

        [Display(Name = "Alternate Mobile")]
        [RegularExpression(@"^[0-9]{10}$", ErrorMessage = "Alternate Mobile No. must be 10 digits.")]
        public string AlternateMobile { get; set; }
        [Display(Name = "Alternate Mobile")]
        [RegularExpression(@"^\+?[0-9]{10,15}$", ErrorMessage = "Mobile No. must be between 10 and 15 digits, with an optional '+' sign.")]
        public string Mobile2 { get; set; }

        [Display(Name = "Phone")]
        
        [RegularExpression(@"^[0-9]{10}$", ErrorMessage = "Phone No. must be 10 digits.")]
        public string Phone { get; set; }

        [Display(Name = "Alternate Phone")]
        [RegularExpression(@"^[0-9]{10}$", ErrorMessage = "Alternate Phone No. must be 10 digits.")]
        
        public string Phone2 { get; set; }

        [Display(Name = "Email Address")]
        //[Required(ErrorMessage = "Email Address is required.")]
        [EmailAddress(ErrorMessage = "Invalid Email Address format.")]
        public string EmailAddress { get; set; }

        [Display(Name = "Alternate Email Address")]
        [EmailAddress(ErrorMessage = "Invalid Alternate Email Address format.")]
        
        public string EmailAddress2 { get; set; }

        [Display(Name = "Fax")]
        [RegularExpression(@"^[0-9]{10}$", ErrorMessage = "Fax must be 10 digits.")]
        public string Fax { get; set; }
       
        [Display(Name = "Address")]
        public string? Address { get; set; }

        [Display(Name = "Zip Code")]
        public string? ZipCode { get; set; }
        [Display(Name = "Created By")]
        public string? CreatedBy { get; set; }
        [Display(Name = "Created On")]
        public string? CreatedOn { get; set; }

        [Display(Name = "Last Modified By")]
        public string? LastModifiedBy { get; set; }

        [Display(Name = "Last Modified On")]
        public string? LastModifiedOn { get; set; }

        [Display(Name = "Created From")]
        public string? CreatedFrom { get; set; }

        [Display(Name = "Last Update From")]
        public string? LastUpdateFrom { get; set; }
        public string? Operation { get; set; }
        public string? Status { get; set; }
        public string?[] IDs { get; set; }
    }

}

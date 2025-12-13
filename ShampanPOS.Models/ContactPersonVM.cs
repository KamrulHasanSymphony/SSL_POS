using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{

    public class ContactPersonVM
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Contact Person Name is required.")]
        [Display(Name = "Name")]
       
        public string? Name { get; set; }

      
        [Display(Name = "Code(Auto Generate)")]
        public string? Code { get; set; }

        [Display(Name = "Designation")]

        public string? Designation { get; set; }


        [Display(Name = "Mobile")]
        [Required(ErrorMessage = "Mobile number is required.")]
        [StringLength(15, ErrorMessage = "Mobile number cannot exceed 15 characters.")]
        [RegularExpression(@"^\+?\d{10,15}$", ErrorMessage = "Invalid mobile number format.")]
        public string? Mobile { get; set; }

        [Display(Name = "Alternate Mobile No.")]
        [StringLength(15, ErrorMessage = "mobile number cannot exceed 15 characters.")]
        [RegularExpression(@"^\+?\d{10,15}$", ErrorMessage = "Invalid mobile number format.")]
        public string? Mobile2 { get; set; }

        [Display(Name = "Phone")]
        [StringLength(15, ErrorMessage = "Phone number cannot exceed 15 characters.")]
        [RegularExpression(@"^\+?\d{10,15}$", ErrorMessage = "Invalid phone number format.")]
        public string? Phone { get; set; }

        [Display(Name = "Alternate Phone No.")]
        [StringLength(15, ErrorMessage = "phone number cannot exceed 15 characters.")]
        [RegularExpression(@"^\+?\d{10,15}$", ErrorMessage = "Invalid  phone number format.")]
        public string? Phone2 { get; set; }

        [Display(Name = "Email Address")]
        [Required(ErrorMessage = "Email address is required.")]
        [StringLength(100, ErrorMessage = "Email address cannot exceed 100 characters.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        public string? EmailAddress { get; set; }

        [Display(Name = "Alternate Email Address")]
        [StringLength(100, ErrorMessage = "Email address cannot exceed 100 characters.")]
        [EmailAddress(ErrorMessage = "Invalid Email format.")]
        public string? EmailAddress2 { get; set; }

        [Display(Name = "Fax")]
        [StringLength(15, ErrorMessage = "Fax number cannot exceed 15 characters.")]
        [RegularExpression(@"^\+?\d{10,15}$", ErrorMessage = "Invalid fax number format.")]
        public string? Fax { get; set; }

        [Display(Name = "Address")]
        public string? Address { get; set; }

       
        [Display(Name = "Country")]
        public int? CountryId { get; set; }


        [Display(Name = "Division")]
        public int? DivisionId { get; set; }

  
        [Display(Name = "District")]
        public int? DistrictId { get; set; }

      
        [Display(Name = "Thana")]
        public int? ThanaId { get; set; }

      
        [Display(Name = "Zip Code")]
        public string? ZipCode { get; set; }

        [Display(Name = "Archived")]
        public bool IsArchive { get; set; }

        [Display(Name = "Active Status")]
        public bool IsActive { get; set; }

        [Display(Name = "Operation")]
        public string? Operation { get; set; }


        [Display(Name = "Active Status")]
        public string? Status { get; set; }

        [Display(Name = "Created By")]
        public string? CreatedBy { get; set; }

 
        [Display(Name = "Created On")]
        public string? CreatedOn { get; set; }

        [Display(Name = "Last Modified By")]
        public string? LastModifiedBy { get; set; }

        [Display(Name = "Last Modified On")]
        public string? LastModifiedOn { get; set; }

        [Display(Name = "Last Update From")]
        public string? LastUpdateFrom { get; set; }

        public string?[] IDs { get; set; }
        public string? CountryName { get; set; }
        public string? DivisionName { get; set; }
        public string? DistrictName { get; set; }
        public string? ThanaName { get; set; }


    }


}

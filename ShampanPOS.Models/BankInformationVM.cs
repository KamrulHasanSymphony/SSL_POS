using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class BankInformationVM
    {

        public int Id { get; set; }

        [StringLength(50, ErrorMessage = "Code cannot exceed 50 characters.")]
        [Display(Name = "Code")]
        public string? Code { get; set; }

        public string? UserId { get; set; }

        [Required(ErrorMessage = "Name is required.")]
        [StringLength(300, ErrorMessage = "Name cannot exceed 300 characters.")]
        [Display(Name = "Name")]
        public string? Name { get; set; }

        [StringLength(300, ErrorMessage = "Bangla Name cannot exceed 300 characters.")]
        [Display(Name = "Bangla Name")]
        public string? BanglaName { get; set; }

        [StringLength(500, ErrorMessage = "Address cannot exceed 500 characters.")]
        [Display(Name = "Address")]
        public string? Address { get; set; }

        [StringLength(500, ErrorMessage = "Bangla Address cannot exceed 500 characters.")]
        [Display(Name = "Bangla Address")]
        public string? BanglaAddress { get; set; }

        [StringLength(50, ErrorMessage = "Telephone No cannot exceed 50 characters.")]
        [Display(Name = "Telephone No")]
        public string? TelephoneNo { get; set; }

        [StringLength(50, ErrorMessage = "Fax No cannot exceed 50 characters.")]
        [Display(Name = "Fax No")]
        public string? FaxNo { get; set; }

        [StringLength(50, ErrorMessage = "Email cannot exceed 50 characters.")]
        [Display(Name = "Email")]
        public string? Email { get; set; }

        [StringLength(50, ErrorMessage = "Comments cannot exceed 50 characters.")]
        [Display(Name = "Comments")]
        public string? Comments { get; set; }

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

        [Display(Name = "CreatedFrom")]
        public string? CreatedFrom { get; set; }

        [Display(Name = "Last Update From")]
        public string? LastUpdateFrom { get; set; }

        [Display(Name = "Status")]
        public string? Status { get; set; }

        [Display(Name = "Operation")]
        public string? Operation { get; set; }

        [Display(Name = "IsActive")]
        public bool IsActive { get; set; }



    }
}

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

        [Display(Name = "Code")]
        public string? Code { get; set; }

        public string? UserId { get; set; }

        [Display(Name = "Name")]
        public string? Name { get; set; }

        [Display(Name = "Bangla Name")]
        public string? BanglaName { get; set; }

        [Display(Name = "Address")]
        public string? Address { get; set; }

        [Display(Name = "Bangla Address")]
        public string? BanglaAddress { get; set; }

        [Display(Name = "Telephone No")]
        public string? TelephoneNo { get; set; }

        [Display(Name = "Fax No")]
        public string? FaxNo { get; set; }


        [Display(Name = "Email")]
        public string? Email { get; set; }


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

        [Display(Name = "Operation")]
        public string? Operation { get; set; }

        [Display(Name = "IsActive")]
        public bool IsActive { get; set; }

        [Display(Name = "CreatedFrom")]
        public string? CreatedFrom { get; set; }

        [Display(Name = "Last Update From")]
        public string? LastUpdateFrom { get; set; }
        public string? Status { get; set; }

    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class BankAccountVM
    {
            public int Id { get; set; }

            [Required(ErrorMessage = "Account No is required.")]
            [StringLength(50, ErrorMessage = "Account No cannot exceed 50 characters.")]
            [Display(Name = "Account No")]
            public string? AccountNo { get; set; }

            [Required(ErrorMessage = "Account Name is required.")]
            [StringLength(300, ErrorMessage = "Account Name cannot exceed 300 characters.")]
            [Display(Name = "Account Name")]
            public string? AccountName { get; set; }
            public string? BankName { get; set; }

            public string? UserId { get; set; }

            [Required(ErrorMessage = "Bank Id is required.")]
            [Display(Name = "Bank Id")]
            public int BankId { get; set; }

            [Required(ErrorMessage = "Branch Name is required.")]
            [StringLength(300, ErrorMessage = "Branch Name cannot exceed 300 characters.")]
            [Display(Name = "Branch Name")]
            public string? BranchName { get; set; }

            [Display(Name = "IsCash")]
            public bool IsCash { get; set; }

            [StringLength(50, ErrorMessage = "Comments cannot exceed 50 characters.")]
            [Display(Name = "Comments")]
            public string? Comments { get; set; }

            [Required(ErrorMessage = "IsArchive is required.")]
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

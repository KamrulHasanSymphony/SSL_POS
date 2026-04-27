using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class TableInfoVM
    {
        public int Id { get; set; }

        [Display(Name = "Code")]
        public string? Code { get; set; }

        [Display(Name = "Table Number")]
        public string? TableNumber { get; set; }

        [Display(Name = "Capacity")]
        public int? Capacity { get; set; }

        [Display(Name = "Section")]
        public int? SectionId { get; set; }

        [Display(Name = "Section Name")]
        public string? SectionName { get; set; }

        [Display(Name = "Status")]
        public string? Status { get; set; }

        [Display(Name = "Is Archived")]
        public bool IsArchive { get; set; }

        [Display(Name = "Is Active")]
        public bool IsActive { get; set; }

        [Display(Name = "Created By")]
        public string? CreatedBy { get; set; }

        [Display(Name = "Created On")]
        public string? CreatedOn { get; set; }

        [Display(Name = "Created From")]
        public string? CreatedFrom { get; set; }

        [Display(Name = "Last Modified By")]
        public string? LastModifiedBy { get; set; }

        [Display(Name = "Last Modified On")]
        public string? LastModifiedOn { get; set; }

        [Display(Name = "Last Update From")]
        public string? LastUpdateFrom { get; set; }

        [Display(Name = "Branch Id")]
        public int? BranchId { get; set; }

        [Display(Name = "Company Id")]
        public int? CompanyId { get; set; }

        [Display(Name = "Operation")]
        public string? Operation { get; set; }
    }
}
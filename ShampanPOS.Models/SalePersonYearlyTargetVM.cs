using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{

    public class SalePersonYearlyTargetVM
    {
        public int Id { get; set; }

        public string? Code { get; set; }
        [Required]
        [Display(Name = "Sale person")]
        public int? SalePersonId { get; set; }

        [Display(Name = "Branch")]
        public int BranchId { get; set; }
        [Display(Name = "Yearly Target")]
        public decimal YearlyTarget { get; set; }

        [Display(Name = "Self Sale Commission Rate")]
        public decimal SelfSaleCommissionRate { get; set; }

        [Display(Name = "Other Sale Commission Rate")]
        public decimal OtherSaleCommissionRate { get; set; }
        [Display(Name = "Fiscal Year for Sale")]
        [Required]
        public int? FiscalYearForSaleId { get; set; }

        [Display(Name = "Year")]
        public int Year { get; set; }

        [Display(Name = "Year Start")]
        public string? YearStart { get; set; }

        [Display(Name = "Year End")]
        public string? YearEnd { get; set; }
        [Display(Name = "Approved")]
        public bool IsApproveed { get; set; }

        [Display(Name = "Approved By")]
        public string? ApprovedBy { get; set; }

        [Display(Name = "Approval Date")]
        public string? ApprovedDate { get; set; }

        [Display(Name = "Posted")]
        public bool IsPosted { get; set; }
        public bool IsPost { get; set; }

        [Display(Name = "Posted By")]
        public string? PostedBy { get; set; }

        [Display(Name = "Posted Date")]
        public string? PostedDate { get; set; }

        [Display(Name = "Created By")]
        public string CreatedBy { get; set; }
        [Display(Name = "Created On")]
        public string? CreatedOn { get; set; }

        [Display(Name = "Last Modified By")]
        public string? LastModifiedBy { get; set; }

        [Display(Name = "Last Modified On")]
        public string? LastModifiedOn { get; set; }
        public string? Operation { get; set; }
        public string? LastUpdateFrom { get; set; }
        public string? CreatedFrom { get; set; }
        public string? FromDate { get; set; }
        public string? ToDate { get; set; }
        public string? PostBy { get; set; }
        public string? PosteOn { get; set; }
        public string? Remarks { get; set; }
        [Display(Name = "Branch Name")]
        public int? Branchs { get; set; }
        public string? Status { get; set; }
        public bool? IsIndex { get; set; }



        public List<SalePersonYearlyTargetDetailVM> SalePersonYearlyTargetDetailList { get; set; }
        public SalePersonYearlyTargetVM()
        {
            SalePersonYearlyTargetDetailList = new List<SalePersonYearlyTargetDetailVM>();
        }
    }

}

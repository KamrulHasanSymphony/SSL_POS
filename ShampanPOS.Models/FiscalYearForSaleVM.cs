using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{

    public class FiscalYearForSaleVM
    {
        public int Id { get; set; }

        [Display(Name = "Year")]
        public int? Year { get; set; }
        public int? YearPeriod { get; set; }

        [Display(Name = "Year Start Date")]
        [DataType(DataType.Date)]
        public string? YearStart { get; set; }

        [Display(Name = "Year End Date")]
        [DataType(DataType.Date)]
        public string? YearEnd { get; set; }

        [Display(Name = "Year Locked")]
        public bool YearLock { get; set; }

        [Display(Name = "Remarks")]
        public string? Remarks { get; set; }

        [Display(Name = "Created By")]
        public string? CreatedBy { get; set; }

        [Display(Name = "Created On")]
        [DataType(DataType.DateTime)]
        public string? CreatedOn { get; set; }
        public string? CreatedFrom { get; set; }

        [Display(Name = "Last Modified By")]
        public string? LastModifiedBy { get; set; }

        [Display(Name = "Last Modified On")]
        [DataType(DataType.DateTime)]
        public string? LastModifiedOn { get; set; }
        public string? LastUpdateFrom { get; set; }
        public string? Operation { get; set; }
        public string? Status { get; set; }
        public string?[] IDs { get; set; }
        public Audit Audit { get; set; }
        public List<FiscalYearDetailForSaleVM> fiscalYearForSaleDetails { get; set; }
        public FiscalYearForSaleVM()
        {
            fiscalYearForSaleDetails = new List<FiscalYearDetailForSaleVM>();
            Audit = new Audit();

        }
    }

}

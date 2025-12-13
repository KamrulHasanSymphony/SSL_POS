using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{

    public class FiscalYearDetailForSaleVM
    {
        public int Id { get; set; }

        [Display(Name = "Fiscal Year for Sale ID")]
        public int? FiscalYearForSaleId { get; set; }

        [Display(Name = "Year")]
        public int Year { get; set; }

        [Display(Name = "Month")]
        public int? MonthId { get; set; }

        [Display(Name = "Month Start")]
        public string MonthStart { get; set; }

        [Display(Name = "Month End")]
        public string MonthEnd { get; set; }

        [Display(Name = "Month Name")]
        public string MonthName { get; set; }

        [Display(Name = "Month Lock")]
        public bool MonthLock { get; set; }

        [Display(Name = "Remarks")]
        public string Remarks { get; set; }

        [Display(Name = "Created By")]
        public string CreatedBy { get; set; }

        [Display(Name = "Created On")]
        public string CreatedOn { get; set; }

        [Display(Name = "Last Modified By")]
        public string LastModifiedBy { get; set; }

        [Display(Name = "Last Modified On")]
        [DataType(DataType.DateTime)]
        public string? LastModifiedOn { get; set; }

        [Display(Name = "Created From")]
        public string CreatedFrom { get; set; }

        [Display(Name = "Last Update From")]
        public string LastUpdateFrom { get; set; }
    }

}

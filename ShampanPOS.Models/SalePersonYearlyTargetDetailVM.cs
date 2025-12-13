using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{

    public class SalePersonYearlyTargetDetailVM
    {
        public int Id { get; set; }

        [Display(Name = "Branch")]
        public int BranchId { get; set; }

        [Display(Name = "Salesperson")]
        public int? SalePersonId { get; set; }

        [Display(Name = "Yearly Target")]
        public int? SalePersonYearlyTargetId { get; set; }
        public string? SalePersonYearlyTargetName { get; set; }

        [Display(Name = "Fiscal Year Detail for Sale")]
        public int? FiscalYearDetailForSaleId { get; set; }
        public string? FiscalYearDetailForSaleName { get; set; }

        [Display(Name = "Fiscal Year for Sale")]
        public int? FiscalYearForSaleId { get; set; }
        public string? FiscalYearForSaleName { get; set; }

        [Display(Name = "Monthly Target")]
        public decimal? MonthlyTarget { get; set; }

        [Display(Name = "Self Sale Commission Rate")]
        public decimal? SelfSaleCommissionRate { get; set; }

        [Display(Name = "Other Sale Commission Rate")]
        public decimal? OtherSaleCommissionRate { get; set; }

        [Display(Name = "Year")]
        public int? Year { get; set; }


        [Display(Name = "Month")]
        public int? MonthId { get; set; }
        public string? MonthName { get; set; }


        [Display(Name = "Month Start")]
        public string? MonthStart { get; set; }


        [Display(Name = "Month End")]
        public string? MonthEnd { get; set; }
        public int? Line { get; set; }
    }

}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{

    public class SalePersonMonthlyAchievementVM
    {
        public int Id { get; set; }

        
        [Display(Name = "Branch")]
        public int BranchId { get; set; }

        
        [Required,Display(Name = "Sales Person")]
        public int? SalePersonId { get; set; }
        public string? SalePersonName { get; set; }


        [Display(Name = "Monthly Sales")]
        [DataType(DataType.Currency)]
        public decimal MonthlySales { get; set; }

        
        [Display(Name = "Monthly Target")]
        [DataType(DataType.Currency)]
        public decimal MonthlyTarget { get; set; }

        
        [Display(Name = "Self Sale Commission Rate")]
        public decimal SelfSaleCommissionRate { get; set; }

        
        [Display(Name = "Other Sale Commission Rate")]
        public decimal OtherSaleCommissionRate { get; set; }


        [Display(Name = "Year"),Required]
        [Range(2025, 2035, ErrorMessage = "Year must be between 2025 and 2035.")]
        public int? Year { get; set; }

        [Display(Name = "Month"),Required]
        [Range(1, 12, ErrorMessage = "Month must be between 1 and 12.")]
        public int? MonthId { get; set; }

        [Display(Name = "Month Start"), Required]
        [RegularExpression(@"^(January|February|March|April|May|June|July|August|September|October|November|December)$", ErrorMessage = "Please enter a valid month name (January to December).")]
        public string? MonthStart { get; set; }

        [Display(Name = "Month End"), Required]
        [RegularExpression(@"^(January|February|March|April|May|June|July|August|September|October|November|December)$", ErrorMessage = "Please enter a valid month name (January to December).")]
        [MonthEndGreaterThanOrEqualToMonthStart(ErrorMessage = "Month End must be greater than or equal to Month Start.")]
        public string? MonthEnd { get; set; }


        [Display(Name = "Created By")]
        public string CreatedBy { get; set; }

        
        [Display(Name = "Created On")]
        [DataType(DataType.DateTime)]
        public string CreatedOn { get; set; }
        [Display(Name = "Created From")]
        public string? CreatedFrom { get; set; }

        [Display(Name = "Last Modified By")]
        public string LastModifiedBy { get; set; }

        [Display(Name = "Last Modified On")]
        [DataType(DataType.DateTime)]
        public string? LastModifiedOn { get; set; }
        [Display(Name = "Last Update From")]
        public string? LastUpdateFrom { get; set; }
        public string? Operation { get; set; }
        public string? Status { get; set; }
        public string?[] IDs { get; set; }
        public int? Branchs { get; set; }

        [Display(Name = "From Date")]
        public string? FromDate { get; set; }

        [Display(Name = "To Date")]
        public string? ToDate { get; set; }
        public decimal? BonusAmount { get; set; }
        public decimal? TotalBonus { get; set; }
        public decimal? OtherCommissionBonus { get; set; }

    }


    public class MonthEndGreaterThanOrEqualToMonthStartAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var model = (SalePersonMonthlyAchievementVM)validationContext.ObjectInstance;

            if (string.IsNullOrEmpty(model.MonthStart) || string.IsNullOrEmpty(model.MonthEnd))
            {
                return ValidationResult.Success;
            }

            var monthStartIndex = GetMonthIndex(model.MonthStart);
            var monthEndIndex = GetMonthIndex(model.MonthEnd);

            if (monthEndIndex >= monthStartIndex)
            {
                return ValidationResult.Success;
            }

            return new ValidationResult("Month End must be greater than or equal to Month Start.");
        }

        private int GetMonthIndex(string monthName)
        {
            var months = new List<string> {
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        };

            return months.IndexOf(monthName) + 1;
        }
    }
}

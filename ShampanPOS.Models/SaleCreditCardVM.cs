using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class SaleCreditCardVM 
    {
        public int Id { get; set; }

        [Display(Name = "Sale Id")]
        public int? SaleId { get; set; }

        [Display(Name = "Credit Card Id")]
        public int? CreditCardId { get; set; }
        public string? CreditCardName { get; set; }

        [Display(Name = "Card Total")]
        public decimal? CardTotal { get; set; }

        [Display(Name = "Remarks")]
        public string? Remarks { get; set; }

        //public PeramModel PeramModel { get; set; }

        //public SaleCreditCardVM()
        //{
        //    PeramModel = new PeramModel();
        //}

    }
}

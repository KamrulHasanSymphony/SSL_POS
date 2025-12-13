using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{


    public class SalePersonVisitHistrieDetailVM
    {
        public int Id { get; set; }
        public int RowId { get; set; }
        [Display(Name = "Sale Order")]
        public int? SaleOrderId { get; set; }

        [Display(Name = "Branch")]
        public int? BranchId { get; set; }

        [Display(Name = "Sale Person Visit Histroy")]
        public int? SalePersonVisitHistroyId { get; set; }

        [Display(Name = "Customer")]
        public int? CustomerId { get; set; }
        [Display(Name = "Visited")]
        public bool IsVisited { get; set; }

        public decimal? Latitude { get; set; }

        public decimal? Longitude { get; set; }
        public string? Operation { get; set; }
        [Display(Name ="Invoice Number")]
        public string? SaleOrderCode { get; set; }
        [Display(Name = "Customer Name")]
        public string? Name { get; set; }
        [Display(Name = "Customer Code")]
        public string? Code { get; set; }
        [Display(Name = "Address")]
        public string? Address { get; set; }



    }


}

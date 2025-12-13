using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{


    public class SalePersonVisitHistrieVM
    {
        public int Id { get; set; }

        [Display(Name = "Branch")]
        public int? BranchId { get; set; }
        public string? BranchName { get; set; }

        [Display(Name = "Sale Person")]
        public int? SalePersonId { get; set; }

        public string? RouteName { get; set; }
        public string? RouteAddress { get; set; }
        public string? CustomerName { get; set; }
        public string? SalesPersonName { get; set; }
        public string? CustomerBanglaName { get; set; }
        public string? CustomerAddress { get; set; }
        public string? CustomerBanglaAddress { get; set; }
        public string? SaleOrderNo { get; set; }

        [Display(Name = "Route")]
        public int? RouteId { get; set; }
        public string? SalePersonName { get; set; }

        [Display(Name = "Date")]
        public string? Date { get; set; }
        public string? VisitDate { get; set; }

        public string?[] IDs { get; set; }

        public bool? IsIndex { get; set; }

        public bool? IsGrid { get; set; }
        public bool? IsVisited { get; set; }
        public string? Operation { get; set; }

        [Display(Name = "Branch Name")]
        public int? Branchs { get; set; }

        [Display(Name = "From Date")]
        public string? FromDate { get; set; }

        [Display(Name = "To Date")]
        public string? ToDate { get; set; }
        public string? Visited { get; set; }


        public List<SalePersonVisitHistrieDetailVM> SalePersonVisitHistrieDetails { get; set; }
        public SalePersonVisitHistrieVM()
        {
            SalePersonVisitHistrieDetails = new List<SalePersonVisitHistrieDetailVM>();

        }

    }


}

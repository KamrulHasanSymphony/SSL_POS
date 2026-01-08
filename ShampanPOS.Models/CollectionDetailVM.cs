using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class CollectionDetailVM
    {
        public int Id { get; set; }

        [Display(Name = "Collection")]
        public int? CollectionId { get; set; }
        public string? SaleCode { get; set; }
        public int? CustomerId { get; set; }
        //public string? PurchaseCode { get; set; }

        [Display(Name = "Sale")]
        public int? SaleId { get; set; }

        //public string? SupplierName { get; set; }

        [Display(Name = "Comments")]
        public string? Comments { get; set; }

        public decimal SaleAmount { get; set; }
        public decimal CollectionAmount { get; set; }


    }
}


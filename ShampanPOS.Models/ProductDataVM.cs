using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class ProductDataVM
    {
        public int? Id { get; set; }
        public int? ProductId { get; set; }
        public int? BranchId { get; set; }
        public string? ProductCode { get; set; }
        public string? ProductName { get; set; }
        public string? BanglaName { get; set; }
        public int? ProductGroupId { get; set; }

        [Display(Name = "Barcode")]
        public string? BarCode { get; set; }

        public string? ProductGroupCode { get; set; }
        public string? ProductGroupName { get; set; }
        public decimal? SDRate { get; set; }
        public decimal? VATRate { get; set; }
        public decimal? UnitRate { get; set; }
        public decimal? CostPrice { get; set; }
        public decimal? SalesPrice { get; set; }
        public decimal? PurchasePrice { get; set; }
        public decimal? QuantityInHand { get; set; }
        public int? UOMId { get; set; }
        public string? UOMName { get; set; }
        public int? UOMFromId { get; set; }
        public string? UOMFromName { get; set; }
        public string? UOMConversion { get; set; }
        public string? HSCodeNo { get; set; }
        public string? Status { get; set; }
        public string? Comments { get; set; }
        public PeramModel PeramModel { get; set; }
        public string? ImagePath { get; set; }
        public string? CtnSize { get; set; }
        public int? CompanyId { get; set; }
        public string? CompanyName { get; set; }
        public string? BranchName { get; set; }


        public decimal? DiscountRate { get; set; }

        public ProductDataVM()
        {
            PeramModel = new PeramModel();
        }
    }
}

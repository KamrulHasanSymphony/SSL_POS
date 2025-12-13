using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class SaleDeleveryInformationVM
    {
        // Header Information
        public string? Code { get; set; }
        public string? Date { get; set; }


        // Branch Info
        public string? BranchName { get; set; }
        public string? BranchBanglaName { get; set; }

        // Route Info
        public string? RouteName { get; set; }
        public string? RouteBanglaName { get; set; }

        // Sales Person Info
        public string? SalesPersonName { get; set; }
        public string? SalesPersonBanglaName { get; set; }

        // Customer Info
        public string? CustomerName { get; set; }
        public string? CustomerBanglaName { get; set; }
        public string? CustomerAddress { get; set; }
        public string? CustomerBanglaAddress { get; set; }

        // Invoice Details
        public string? InvoiceDateTime { get; set; }
        public string? DeliveryDate { get; set; }
        public decimal SpecialDiscountAmount { get; set; }
        public decimal RegularDiscountAmount { get; set; }
        public decimal GrandTotalAmount { get; set; }
        public string? InvoiceID { get; set; }
        public decimal? SaleQuantity { get; set; }

        // Product Info
        public string? ProductName { get; set; }
        public string? ProductBanglaName { get; set; }
        public string CtnSize { get; set; }
        public decimal CtnSizeFactor { get; set; }
        public int ProductId { get; set; }

        // Product Quantities & Prices
        public decimal CtnQuantity { get; set; }
        public decimal PcsQuantity { get; set; }
        public decimal Quantity { get; set; }
        public decimal UnitRate { get; set; }
        public decimal UOMConversion { get; set; }
        public decimal SubTotal { get; set; }

        public decimal OpeningStorck { get; set; }
        public decimal StoreReceive { get; set; }
        public decimal GoodsRtn { get; set; }
        public decimal TotalBanlance { get; set; }
    }
}

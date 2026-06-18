using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class SaleOrderStatusVM
    {
        // Filter params
        [DisplayName("Branch")]
        public int? BranchId { get; set; }
        [DisplayName("Company")]
        public int? CompanyId { get; set; }
        [DisplayName("Customer")]
        public int? CustomerId { get; set; }
        [DisplayName("Product")]
        public int? ProductId { get; set; }
        [DisplayName("Sale Order")]
        public int? SaleOrderId { get; set; }
        [DisplayName("From Date")]
        public string? FromDate { get; set; }
        [DisplayName("To Date")]
        public string? ToDate { get; set; }
        [DisplayName("Status Filter")]
        public string? StatusFilter { get; set; } // "All", "Completed", "Remaining"

        // Report output — Order level
        [DisplayName("Order")]
        public int? OrderId { get; set; }
        [DisplayName("Order Code")]
        public string? OrderCode { get; set; }
        [DisplayName("Order Date")]
        public string? OrderDate { get; set; }
        [DisplayName("Delivery Date")]
        public string? DeliveryDate { get; set; }
        [DisplayName("Customer Code")]
        public string? CustomerCode { get; set; }
        [DisplayName("Customer Name")]
        public string? CustomerName { get; set; }

        // Report output — Detail level
        [DisplayName("Detail")]
        public int? DetailId { get; set; }
        [DisplayName("Product Code")]
        public string? ProductCode { get; set; }
        [DisplayName("Product Name")]
        public string? ProductName { get; set; }
        [DisplayName("Ordered Quantity")]
        public decimal OrderedQty { get; set; }
        [DisplayName("Completed Quantity")]
        public decimal CompletedQty { get; set; }
        [DisplayName("Remaining Quantity")]
        public decimal RemainQty { get; set; }
        [DisplayName("Unit Rate")]
        public decimal UnitRate { get; set; }
        [DisplayName("Line Total")]
        public decimal LineTotal { get; set; }
        [DisplayName("Completed")]
        public bool IsCompleted { get; set; }

        // Header info
        [DisplayName("Branch Name")]
        public string? BranchName { get; set; }
        [DisplayName("Branch Address")]
        public string? BranchAddress { get; set; }
        [DisplayName("Company Name")]
        public string? CompanyName { get; set; }
    }
}

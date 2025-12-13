using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{

    public class SaleDeliveryReturnVM
    {
        public int? Id { get; set; }

        [Display(Name = "Code(Auto Generate)")]
        public string? Code { get; set; }

        [Display(Name = "Distributor")]
        public int? BranchId { get; set; }

        [Display(Name = "Customer")]
        public int? CustomerId { get; set; }

        [Display(Name = "Sales Person")]
        public int? SalePersonId { get; set; }

        [Display(Name = "Delivery Person")]
        public int? DeliveryPersonId { get; set; }

        [Display(Name = "Driver Person")]
        public int? DriverPersonId { get; set; }

        [Display(Name = "Route")]
        public int? RouteId { get; set; }

        [Display(Name = "Vehicle No.")]
        public string? VehicleNo { get; set; }

        [Display(Name = "Vehicle Type")]
        public string? VehicleType { get; set; }

        [Display(Name = "Delivery Address")]
        public string? DeliveryAddress { get; set; }

        [Display(Name = "Invoice Date")]
        public string? InvoiceDateTime { get; set; }

        [Display(Name = " Delivery Date")]
        public string? DeliveryDate { get; set; }

        [Display(Name = "Grand Total Amount")]
        public decimal? GrandTotalAmount { get; set; }

        [Display(Name = "Grand Total SD Amount")]
        public decimal? GrandTotalSDAmount { get; set; }

        [Display(Name = "Grand Total VAT Amount")]
        public decimal? GrandTotalVATAmount { get; set; }

        [Display(Name = "Comments")]
        public string? Comments { get; set; }

        [Display(Name = "Transaction Type")]
        public string? TransactionType { get; set; }

        [Display(Name = "Completed")]
        public bool IsCompleted { get; set; }

        [Display(Name = "Currency")]
        public int? CurrencyId { get; set; }

        [Display(Name = "Currency Rate from BDT")]
        public decimal? CurrencyRateFromBDT { get; set; }
        public int? DecimalPlace { get; set; }
        [Display(Name = "Posted")]
        public bool IsPost { get; set; }

        [Display(Name = "Posted By")]
        public string? PostedBy { get; set; }

        [Display(Name = "Posted On")]
        public string? PostedOn { get; set; }

        [Display(Name = "Created By")]
        public string? CreatedBy { get; set; }

        [Display(Name = "Created On")]
        public string? CreatedOn { get; set; }
        public string? CreatedFrom { get; set; }

        [Display(Name = "Last Modified By")]
        public string? LastModifiedBy { get; set; }

        [Display(Name = "Last Modified On")]
        public string? LastModifiedOn { get; set; }
        public string? LastUpdateFrom { get; set; }
        public int? ProductGroupId { get; set; }
        public int? UOMId { get; set; }
        public string?[] IDs { get; set; }
        public string? Operation { get; set; }
        public string? Status { get; set; }


        [Display(Name = "Posted")]
        public string? IsPosted { get; set; }
        [Display(Name = "Branch Name")]
        public int? Branchs { get; set; }

        [Display(Name = "From Date")]
        public string? FromDate { get; set; }

        [Display(Name = "To Date")]
        public string? ToDate { get; set; }

        public string? GrdTotalAmount { get; set; }
        public string? GrdTotalSDAmount { get; set; }
        public string? GrdTotalVATAmount { get; set; }
        public string? BranchName { get; set; }
        public string? CustomerName { get; set; }
        public string? SalePersonName { get; set; }
        public string? DeliveryPersonName { get; set; }
        public string? RouteName { get; set; }
        public string? DriverPersonName { get; set; }
        public string? CurrencyName { get; set; }
        public int? SaleDeliveryId { get; set; }
        public int? SaleDeliveryDetailId { get; set; }



        public List<SaleDeliveryReturnDetailVM> saleDeliveryReturnDetailList { get; set; }

        public SaleDeliveryReturnVM()
        {
            saleDeliveryReturnDetailList = new List<SaleDeliveryReturnDetailVM>();
        }
    }

}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{
    public class TransactionalReportVm
    {

        public int Id { get; set; }
        public string Code { get; set; }
        public string TransactionType { get; set; }


        public int BranchId { get; set; }
        public string BranchName { get; set; }
        public string BranchCode { get; set; }
        public string BranchAddress { get; set; }

        public int CompanyId { get; set; }
        public string CompanyName { get; set; }
        public string CompanyCode { get; set; }
        public string CompanyAddress { get; set; }

        public int SupplierId { get; set; }
        public string SupplierName { get; set; }
        public string SupplierAddress { get; set; }

        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string CustomerAddress { get; set; }

        public int SalePersonId { get; set; }
        public string SalePersonName { get; set; }
        public string SalePersonAddress { get; set; }

        public int DeliveryPersonId { get; set; }
        public string DeliveryPersonName { get; set; }
        public string DeliveryPersonAddress { get; set; }

        public int DriverPersonId { get; set; }
        public string DriverPersonName { get; set; }
        public string DriverPersonAddress { get; set; }

        public int RouteId { get; set; }
        public string RouteAddress { get; set; }

        public int CurrencyId { get; set; }
        public string CurrencyName { get; set; }

        public int ProductGroupId { get; set; }
        public string ProductGroupName { get; set; }

        public int UOMId { get; set; }
        public string UOMName { get; set; }

        public int UOMFromId { get; set; }
        public string UOMFromName { get; set; }

        public int ProductId { get; set; }
        public string ProductName { get; set; }


        public string VehicleNo { get; set; }
        public string VehicleType { get; set; }
        public string DeliveryAddress { get; set; }
        public string BENumber { get; set; }
        public string Description { get; set; }
        public string Remarks { get; set; }

        public DateTime OrderDate { get; set; }
        public DateTime DeliveryDateTime { get; set; }
        public DateTime PurchaseReturnDate { get; set; }
        public DateTime InvoiceDateTime { get; set; }
        public DateTime PurchaseDate { get; set; }
        public DateTime PostedOn { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime PrintOn { get; set; }
        public DateTime LastModifiedOn { get; set; }


        public decimal GrandTotalAmount { get; set; }
        public decimal GrandTotalSDAmount { get; set; }
        public decimal GrandTotalVATAmount { get; set; }
        public decimal CurrencyRateFromBDT { get; set; }
        public decimal TotalQuantity { get; set; }

        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal UnitRate { get; set; }
        public decimal SubTotal { get; set; }
        public decimal SD { get; set; }
        public decimal SDAmount { get; set; }
        public decimal VATRate { get; set; }
        public decimal VATAmount { get; set; }
        public decimal OthersAmount { get; set; }
        public decimal LineTotal { get; set; }
        public decimal UOMConversion { get; set; }
        public decimal FixedVATAmount { get; set; }


        public bool IsPosted { get; set; }
        public bool IsPrint { get; set; }
        public bool IsCompleted { get; set; }
        public bool IsFixedVAT { get; set; }
        public bool IsDuplicate { get; set; }

        public string Comments { get; set; }
        public string Completed { get; set; }
        public string PostedBy { get; set; }
        public string PrintBy { get; set; }

        public string ImportIDExcel { get; set; }
        public string FileName { get; set; }
        public string FiscalYear { get; set; }
        public string MonthName { get; set; }
        public string CreatedBy { get; set; }


        public string CreatedFrom { get; set; }
        public string LastModifiedBy { get; set; }
        public string LastUpdateFrom { get; set; }

        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public string Status { get; set; }


        public int PeriodId { get; set; }
        public int DetailId { get; set; }
        public int Line { get; set; }

        public string DetailComments { get; set; }
        public string VATType { get; set; }
        public string ReasonOfReturn { get; set; }


    }

}

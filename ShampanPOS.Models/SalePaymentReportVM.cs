using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class SalePaymentReportVM
    {
        public string? SL { get; set; }
        public string? CustomerName { get; set; }
        public string? InvoiceNo { get; set; }
        public string? PaymentNo { get; set; }
        public string? PaymentMode { get; set; }
        public string? Opening { get; set; }
        public int? ReceiveAmount { get; set; }
        public int? SalesAmount { get; set; }
        public int? ClosingBalance { get; set; }
        public string? Remarks { get; set; }
    }
}

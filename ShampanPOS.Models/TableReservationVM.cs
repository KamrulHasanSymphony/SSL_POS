using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class TableReservationVM
    {
        public int Id { get; set; }

        [Display(Name = "Table No")]
        public int? TableId { get; set; }
        public string? TableNumber { get; set; }
        public string? SectionName { get; set; }
        public string? StatusName { get; set; }

        [Display(Name = "Customer")]

        public string? CustomerName { get; set; }

        [Display(Name = "Phone No.")]
        public string? PhoneNumber { get; set; }

        [Display(Name = "Reservation Time")]
        public DateTime? ReservationTime { get; set; }

        public string? Status { get; set; }

        public string? CreatedBy { get; set; }

        public string? CreatedOn { get; set; }

        public string? CreatedFrom { get; set; }

        public string? LastModifiedBy { get; set; }

        public string? LastModifiedOn { get; set; }

        public string? LastUpdateFrom { get; set; }

        public int? BranchId { get; set; }
        public string? BranchName { get; set; }

        public int? CompanyId { get; set; }

        [Display(Name = "Operation")]
        public string? Operation { get; set; }

    }
}

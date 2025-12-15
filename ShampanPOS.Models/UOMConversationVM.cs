using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{


    public class UOMConversationVM
    {
        public int Id { get; set; }
        [Display(Name = "Code(Auto Generate)")]
        public string? Code { get; set; }

        [Display(Name = "From")]
        public int? FromId { get; set; }

        [Display(Name = "To")]
      
        public int? ToId { get; set; }

        [Display(Name = "Conversion")]
        public decimal? ConversationFactor { get; set; }
        [Display(Name = "Archived")]
        public bool IsArchive { get; set; }
        [Display(Name = "Active")]
        public bool IsActive { get; set; }
        [Display(Name = "Created By")]
        public string? CreatedBy { get; set; }
        [Display(Name = "Created On")]
        public string? CreatedOn { get; set; }
        [Display(Name = "Last Modified By")]
        public string? LastModifiedBy { get; set; }
        [Display(Name = "Last Modified On")]
        public string? LastModifiedOn { get; set; }
        [Display(Name = "Created From")]
        public string? CreatedFrom { get; set; }
        [Display(Name = "Last Update From")]
        public string? LastUpdateFrom { get; set; }
        public string? Operation { get; set; }
        public string?[] IDs { get; set; }
        public string? Status { get; set; }
        public string? FromName { get; set; }
        public string? ToName { get; set; }
        //public bool? IsIndex { get; set; }


        //public int UOMId { get; set; }

    }


}

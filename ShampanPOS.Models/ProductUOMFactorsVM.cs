using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{
    public class ProductUOMFactorsVM
    {
        public int Id { get; set; }

        [Display(Name = "Name")]
        public string? Name { get; set; }
        public int ProductId { get; set; }

        [Display(Name = "Pack size")]
        public string? Packsize { get; set; }
        public int? BranchId { get; set; }

        [Display(Name = "Conversation Factor")]
        public decimal? ConversationFactor { get; set; }

        [Display(Name = "Description")]
        public bool IsArchive { get; set; }
        public bool IsActive { get; set; }
        public string? ProductName { get; set; }
        public string? ProductCode { get; set; }

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
        [Display(Name = "Operation")]
        public string? Operation { get; set; }

    }

}

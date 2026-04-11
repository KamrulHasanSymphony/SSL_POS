using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Web;

namespace ShampanPOS.Models
{
    public class ProductVM
    {
        public int Id { get; set; } 

        [Display(Name = "Code (Auto Generate)")]
        [StringLength(50, ErrorMessage = "Code cannot exceed 50 characters.")]
        public string? Code { get; set; }

        [Display(Name = "Company")]
        public int? CompanyId { get; set; }

        [Display(Name = "User ID")]
        public string? UserId { get; set; }

        [Required(ErrorMessage = "Product Name is required.")]
        [Display(Name = "Name")]
        [StringLength(300, ErrorMessage = "Product Name cannot exceed 300 characters.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Product Group is required.")]
        [Display(Name = "Product Group")]
        public int? ProductGroupId { get; set; }

        public int? MasterItemId { get; set; }

        public int? MasterItemGroupId { get; set; }

        [StringLength(500, ErrorMessage = "Bangla Name cannot exceed 500 characters.")]
        [Display(Name = "Bangla Name")]
        public string? BanglaName { get; set; }

        [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters.")]
        [Display(Name = "Description")]
        public string? Description { get; set; }

        [Required(ErrorMessage = "UOM is required.")]
        [Display(Name = "UOM")]
        public int? UOMId { get; set; }

        [StringLength(50, ErrorMessage = "HS Code No. cannot exceed 50 characters.")]
        [Display(Name = "HS Code No.")]
        public string? HSCodeNo { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "VAT Rate must be a positive value.")]
        [Display(Name = "VAT Rate")]
        public decimal? VATRate { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "SD Rate must be a positive value.")]
        [Display(Name = "SD Rate")]
        public decimal? SDRate { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Purchase Price must be a positive value.")]
        [Display(Name = "Purchase Price")]
        public decimal? PurchasePrice { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Sale Price must be a positive value.")]
        [Display(Name = "Sale Price")]
        public decimal? SalePrice { get; set; }

        [Display(Name = "Archived")]
        public bool IsArchive { get; set; }

        [Display(Name = "Active Status")]
        public bool IsActive { get; set; }

        [StringLength(120, ErrorMessage = "Created By cannot exceed 120 characters.")]
        [Display(Name = "Created By")]
        public string? CreatedBy { get; set; }

        [Display(Name = "Created On")]
        public string? CreatedOn { get; set; }

        [StringLength(120, ErrorMessage = "Last Modified By cannot exceed 120 characters.")]
        [Display(Name = "Last Modified By")]
        public string? LastModifiedBy { get; set; }

        [Display(Name = "Last Modified On")]
        public string? LastModifiedOn { get; set; }

        [StringLength(64, ErrorMessage = "Created From cannot exceed 64 characters.")]
        [Display(Name = "Created From")]
        public string? CreatedFrom { get; set; }

        [StringLength(64, ErrorMessage = "Last Update From cannot exceed 64 characters.")]
        [Display(Name = "Last Update From")]
        public string? LastUpdateFrom { get; set; }

        [StringLength(50, ErrorMessage = "Status cannot exceed 50 characters.")]
        [Display(Name = "Status")]
        public string? Status { get; set; }

        [StringLength(50, ErrorMessage = "Operation cannot exceed 50 characters.")]
        [Display(Name = "Operation")]
        public string? Operation { get; set; }

        public string?[] IDs { get; set; }

        [Display(Name = "Product Group Name")]
        public string? ProductGroupName { get; set; }

        [Display(Name = "Master Item Group Name")]
        public string? MasterItemGroupName { get; set; }

        [Display(Name = "UOM Name")]
        public string? UOMName { get; set; }

        [StringLength(500, ErrorMessage = "Image Path cannot exceed 500 characters.")]
        [Display(Name = "Image")]
        public string? ImagePath { get; set; }

        public List<BranchProfileVM> BranchProfileList { get; set; }

        public Dictionary<string, string>? ColunWidth { get; set; }
        public Dictionary<string, string>? PageSize { get; set; }

        public string? ByGroup { get; set; }

        public int? BranchId { get; set; }

        public string? CompanyName { get; set; }
        public string? BranchName { get; set; }

        public PeramModel PeramModel { get; set; }

        public List<ProductVM> MasterItemList { get; set; }

        public ProductVM()
        {
            BranchProfileList = new List<BranchProfileVM>();
            PeramModel = new PeramModel();
            MasterItemList = new List<ProductVM>();
        }


    }

}

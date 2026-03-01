using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class MasterItemVM
    {

        public int Id { get; set; }

        [Display(Name = "Code (Auto Generate)")]
        [StringLength(50, ErrorMessage = "Code cannot exceed 50 characters.")]
        public string? Code { get; set; }

        [Display(Name = "Company")]
        public int? CompanyId { get; set; }

        [Required(ErrorMessage = "Product Name is required.")]
        [Display(Name = "Name")]
        [StringLength(300, ErrorMessage = "Product Name cannot exceed 300 characters.")]
        public string? Name { get; set; }
        public string? MasterItemGroupDescription { get; set; }

        [Required(ErrorMessage = "Product Group is required.")]
        [Display(Name = "Product Group")]
        public int? MasterItemGroupId { get; set; }
        public string? MasterItemGroupName { get; set; }
        public string? MasterItemGroupCode { get; set; }

        public int? MasterSupplierId { get; set; }

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

        [Display(Name = "Archived")]
        public bool IsArchive { get; set; }

        [Display(Name = "Active Status")]
        public bool IsActive { get; set; }

        [StringLength(120, ErrorMessage = "Created By cannot exceed 120 characters.")]
        [Display(Name = "Created By")]
        public string? CreatedBy { get; set; }

        [Display(Name = "Created On")]
        public string? CreatedOn { get; set; }

        [StringLength(64, ErrorMessage = "Created From cannot exceed 64 characters.")]
        [Display(Name = "Created From")]
        public string? CreatedFrom { get; set; }

        [StringLength(120, ErrorMessage = "Last Modified By cannot exceed 120 characters.")]
        [Display(Name = "Last Modified By")]
        public string? LastModifiedBy { get; set; }

        [Display(Name = "Last Modified On")]
        public string? LastModifiedOn { get; set; }


        [StringLength(64, ErrorMessage = "Last Update From cannot exceed 64 characters.")]
        [Display(Name = "Last Update From")]
        public string? LastUpdateFrom { get; set; }
        //public string?[] IDs { get; set; }
        public string? Operation { get; set; }
        public string? Status { get; set; }

        [Display(Name = "Product Group Name")]
        public string? ProductGroupName { get; set; }
        [Display(Name = "UOM Name")]

        public string? UOMName { get; set; }
        [StringLength(500, ErrorMessage = "Image Path cannot exceed 500 characters.")]
        [Display(Name = "Image")]
        public string? ImagePath { get; set; }

        public int? ProductId { get; set; }

        [Display(Name = "User ID")]
        public string? UserId { get; set; }

        public int? MasterProductId { get; set; }
        public string? MasterItemName { get; set; }
        public string? MasterItemCode { get; set; }

        public int? SupplierId { get; set; }
        public string? SupplierName { get; set; }
        public string? SupplierCode { get; set; }

        public int? MasterSupplierGroupId { get; set; }
        public string? MasterSupplierGroupName { get; set; }
        public string? MasterSupplierGroupCode { get; set; }
        // 🔥 VERY IMPORTANT (JS → Controller)
        public string? SelectedMasterItemsJson { get; set; }


        public PeramModel PeramModel { get; set; }


        public List<MasterItemVM> MasterItemList { get; set; }


        public MasterItemVM()
        {
            PeramModel = new PeramModel();
            MasterItemList = new List<MasterItemVM>();
        }

    }
}

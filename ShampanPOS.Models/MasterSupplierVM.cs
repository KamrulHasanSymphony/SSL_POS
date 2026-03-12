using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{

    public class MasterSupplierVM: Audit
    {
        public int Id { get; set; }

        public int? CompanyId { get; set; }

        [Display(Name = "Code (Auto Generate)")]
        [StringLength(50, ErrorMessage = "Code cannot exceed 50 characters.")]
        public string? Code { get; set; }
        public string? MasterItemCode { get; set; }

        public string? MasterSupplierGroupCode { get; set; }
        public string? MasterSupplierGroupDescription { get; set; }

        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters.")]
        [Display(Name = "Description")]
        public string? Description { get; set; }

        [Required(ErrorMessage = "Name is required.")]
        [Display(Name = "Name")]
        [StringLength(150, ErrorMessage = "Name cannot exceed 150 characters.")]
        public string? Name { get; set; }

        [Display(Name = "Supplier Group")]
        [Required(ErrorMessage ="Supplier Group is required")]
        public int? SupplierGroupId { get; set; }
        public int? MasterItemId { get; set; }
        public string? MasterItemName { get; set; }
        public int? MasterItemGroupId { get; set; }
        public string? MasterItemGroupName { get; set; }
        public string? MasterItemGroupCode { get; set; }
        public int? MasterProductId { get; set; }

        [StringLength(100, ErrorMessage = "Group Name cannot exceed 100 characters.")]
        [Display(Name = "Group Name")]
        public string? GroupName { get; set; }

        [Required(ErrorMessage = "Master Supplier Group is required.")]

        [Display(Name = "Master Supplier Group")]
        public int? MasterSupplierGroupId { get; set; }
        public string? MasterSupplierGroupName { get; set; }

        [StringLength(150, ErrorMessage = "Bangla Name cannot exceed 150 characters.")]
        [Display(Name = "Bangla Name")]
        public string? BanglaName { get; set; }

        [Required(ErrorMessage = "Address is required.")]
        [Display(Name = "Address")]
        [StringLength(500, ErrorMessage = "Address cannot exceed 500 characters.")]
        public string? Address { get; set; }

        [StringLength(50, ErrorMessage = "City cannot exceed 50 characters.")]
        [Display(Name = "City")]
        public string? City { get; set; }

        [Display(Name = "Telephone No.")]
        [StringLength(50, ErrorMessage = "Telephone No. cannot exceed 50 characters.")]
        public string? TelephoneNo { get; set; }

        [StringLength(50, ErrorMessage = "Email cannot exceed 50 characters.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        [Display(Name = "Email")]

        public string? Email { get; set; }
        [StringLength(100, ErrorMessage = "Contact Person cannot exceed 100 characters.")]
        [Display(Name = "Contact Person")]
        public string? ContactPerson { get; set; }

        [Display(Name = "Archived")]
        public bool IsArchive { get; set; }

        [Display(Name = "Active Status")]
        public bool IsActive { get; set; }

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
        [Display(Name = "Image")]
        public string? ImagePath { get; set; }
        public string?[] IDs { get; set; }
        public string? Operation { get; set; }
        public string? Status { get; set; }

        public int? UOMId { get; set; }

        public string? HSCodeNo { get; set; }

        public Dictionary<string, string>? ColunWidth { get; set; }
        public Dictionary<string, string>? PageSize { get; set; }


        public string? SelectedMasterItemsJson { get; set; }

        public bool IsAlreadyAdded { get; set; }

        public PeramModel PeramModel { get; set; }


        public List<MasterSupplierVM> MasterSupplierList { get; set; }


        public MasterSupplierVM()
        {
            PeramModel = new PeramModel();
            MasterSupplierList = new List<MasterSupplierVM>();
        }
    }

}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{

    public class SupplierVM: Audit
    {
        public int Id { get; set; }

        public int? CompanyId { get; set; }

        public string? UserId { get; set; }

        [Display(Name = "Code (Auto Generate)")]
        [StringLength(50, ErrorMessage = "Code cannot exceed 50 characters.")]
        public string? Code { get; set; }

        [Required(ErrorMessage = "Name is required.")]
        [Display(Name = "Name")]
        [StringLength(150, ErrorMessage = "Name cannot exceed 150 characters.")]
        public string? Name { get; set; }

        [Required(ErrorMessage = "Supplier Group is required.")]
        [Display(Name = "Supplier Group")]
        public int? SupplierGroupId { get; set; }

        [StringLength(150, ErrorMessage = "Supplier Group Name cannot exceed 150 characters.")]
        [Display(Name = "Supplier Group Name")]
        public string? SupplierGroupName { get; set; }

        public int? MasterSupplierId { get; set; }
        public int? MasterSupplierGroupId { get; set; }
        public string? MasterSupplierGroupName { get; set; }

        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters.")]
        [Display(Name = "Description")]
        public string? Description { get; set; }

        [StringLength(100, ErrorMessage = "Group Name cannot exceed 100 characters.")]
        [Display(Name = "Group Name")]
        public string? GroupName { get; set; }

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

        [StringLength(50, ErrorMessage = "Telephone No. cannot exceed 50 characters.")]
        [Display(Name = "Telephone No.")]
        public string? TelephoneNo { get; set; }

        [StringLength(50, ErrorMessage = "Email cannot exceed 50 characters.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        [Display(Name = "Email")]
        public string? Email { get; set; }

        [StringLength(100, ErrorMessage = "Contact Person cannot exceed 100 characters.")]
        [Display(Name = "Contact Person")]
        public string? ContactPerson { get; set; }

        [StringLength(200, ErrorMessage = "Comments cannot exceed 200 characters.")]
        [Display(Name = "Comments")]
        public string? Comments { get; set; }

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

        [StringLength(500, ErrorMessage = "Image Path cannot exceed 500 characters.")]
        [Display(Name = "Image")]
        public string? ImagePath { get; set; }

        public string?[] IDs { get; set; }

        [StringLength(50, ErrorMessage = "Operation cannot exceed 50 characters.")]
        [Display(Name = "Operation")]
        public string? Operation { get; set; }

        [StringLength(50, ErrorMessage = "Status cannot exceed 50 characters.")]
        [Display(Name = "Status")]
        public string? Status { get; set; }


        public int ProductGroupId { get; set; }

        public string? ProductGroupName { get; set; }
        public string? ProductGroupCode { get; set; }
        public string? ProductGroupDescription { get; set; }



        public string? ByGroup { get; set; }

        public Dictionary<string, string>? ColunWidth { get; set; }
        public Dictionary<string, string>? PageSize { get; set; }

        public PeramModel PeramModel { get; set; }

        public List<MasterItemVM> MasterItemList { get; set; }

        public List<SupplierVM> MasterSupplierList { get; set; }

        public SupplierVM()
        {
            PeramModel = new PeramModel();
            MasterSupplierList = new List<SupplierVM>();
            MasterItemList = new List<MasterItemVM>();

        }




    }

}

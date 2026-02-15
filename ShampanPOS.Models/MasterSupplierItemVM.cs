using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class MasterSupplierItemVM
    {
        public int Id { get; set; }

        [Display(Name = "Supplier")]
        public int? MasterSupplierId { get; set; }
        public string? UserId { get; set; }

        public string? MasterSupplierName { get; set; }
        public int? CompanyId { get; set; }

        [Display(Name = "Product")]
        public int? MasterProductId { get; set; }
        public int? MasterItemId { get; set; }

        public string? MasterProductName { get; set; }

        [Display(Name = "Master Item Group")]
        public int MasterItemGroupId { get; set; }

        public string? MasterItemGroupDescription { get; set; }
        public string? MasterItemGroupCode { get; set; }

        public string? MasterItemGroupName { get; set; }




        [Display(Name = "Archived")]
        public bool IsArchive { get; set; }

        [Display(Name = "Created By")]
        public string? CreatedBy { get; set; }

        [Display(Name = "Created On")]
        public string? CreatedOn { get; set; }

        [Display(Name = "Last Modified By")]
        public string? LastModifiedBy { get; set; }

        [Display(Name = "Last Modified On")]
        public string? LastModifiedOn { get; set; }

        [Display(Name = "Operation")]
        public string? Operation { get; set; }

        [Display(Name = "IsActive")]
        public bool IsActive { get; set; }

        [Display(Name = "CreatedFrom")]
        public string? CreatedFrom { get; set; }

        [Display(Name = "Last Update From")]
        public string? LastUpdateFrom { get; set; }
        public string? Status { get; set; }
        public string[]? IDs { get; set; }

        public PeramModel PeramModel { get; set; }


        public List<MasterItemVM> MasterItemList { get; set; }


        public MasterSupplierItemVM()
        {
            PeramModel = new PeramModel();
            MasterItemList = new List<MasterItemVM>();
        }



    }
}

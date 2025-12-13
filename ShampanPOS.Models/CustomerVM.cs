using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{

    public class CustomerVM
    {
        public int Id { get; set; }
        [Display(Name = "Code(Auto Generate)")]
        public string? Code { get; set; }
        [Required(ErrorMessage = "Customer Name is required.")]
        [StringLength(50, ErrorMessage = "Name cannot exceed 50 characters.")]
        [Display(Name = "Name ")]
        public string? Name { get; set; }      
        [Display(Name = "Branch")]
        public int? BranchId { get; set; }  
        [Display(Name = "Customer Group")]
        public int? CustomerGroupId { get; set; }

        [Display(Name = "Bangla Name")]
        public string? BanglaName { get; set; }

        [Display(Name = "Address")]
        public string? Address { get; set; }

        [Display(Name = "Bangla Address")]
        public string? BanglaAddress { get; set; }
   
        [Display(Name = "Route")]
        public int? RouteId { get; set; }

        [Display(Name = "Area")]
        public int? AreaId { get; set; }

        [Display(Name = "Focal Point")]
        public int? FocalPointId { get; set; }

        [Display(Name = "City")]
        public string? City { get; set; }
        [Display(Name = "Customer")]
        public int? CustomerId { get; set; }

        [Display(Name = "Customer")]
        public string? CustomerCode { get; set; }
        public string? CustomerName { get; set; }

        [Display(Name = "Mobile No.")]
        //[Required(ErrorMessage = "Telephone No. is required.")]
        //[StringLength(15, ErrorMessage = "Telephone No. cannot exceed 15 characters.")]
        //[RegularExpression(@"^\+?\d{10,15}$", ErrorMessage = "Invalid Telephone No. format.")]
        public string? TelephoneNo { get; set; }

        [Display(Name = "Fax No.")]
        public string? FaxNo { get; set; }
        
        [Display(Name = "Email")]
        public string? Email { get; set; }

        [Display(Name = "TIN No.")]
        public string? TINNo { get; set; }

        [Display(Name = "BIN No.")]
        public string? BINNo { get; set; }

        [Display(Name = "NID No.")]
        public string? NIDNo { get; set; }

        [Display(Name = "Comments")]
        public string? Comments { get; set; }
       
        [Display(Name = "Archived")]
        public bool IsArchive { get; set; }

        [Display(Name = "Active Status")]
        public bool IsActive { get; set; }

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
        [Display(Name = "CreatedFrom")]
        public string? CreatedFrom { get; set; }

        [Display(Name = "Last Update From")]
        public string? LastUpdateFrom { get; set; }
        [Display(Name = "Image")]
        public string? ImagePath { get; set; }
        public string?[] IDs { get; set; }


        [Display(Name = "Branch Name")]
        public int? Branchs { get; set; }

        [Display(Name = "From Date")]
        public string? FromDate { get; set; }
        public int? DecimalPlace { get; set; }
        [Display(Name = "To Date")]
        public string? ToDate { get; set; }
        [Display(Name = "Posted")]
        public string? IsPosted { get; set; }

        public string? Status { get; set; }
        public string? CustomerGroupName { get; set; }
        public string? BranchName { get; set; }
        public string? AreaName { get; set; }
        public string? RouteName { get; set; }
        [Display(Name = " Price Group")]

        public string? CustomerCategory { get; set; }
        

        [Display(Name = "Discount Rate (%)")]

        public decimal?  RegularDiscountRate { get; set; }
        public string? FocalPoint { get; set; }
        public decimal? Potential { get; set; }
    }


}

using System.ComponentModel.DataAnnotations;

namespace ShampanPOS.Models
{
    public class CompanyInfo
    {
        public int Id { get; set; }

        [Required]
        public int CompanyId { get; set; }
        public string CompanyName { get; set; }
        public string CompanyDataBase { get; set; }
        public int SerialNo { get; set; }
        public string DatabaseName { get; set; }
    }
}

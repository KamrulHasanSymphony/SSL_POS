using System.Web;

namespace ShampanPOS.Models
{
    public class SessionClass
    {
        private SessionClass()
        {

        }
        public static string authDB { get; set; }
        public static string DBName { get; set; }
        public static string SettingValue { get; set; }
        public static string CompanyName { get; set; }
        public static string AuthConnectionString { get; set; }
        public static string ConnectionString { get; set; }
        public static string apiUrl { get; set; }
        public static string reportApiUrl { get; set; }


    }



}

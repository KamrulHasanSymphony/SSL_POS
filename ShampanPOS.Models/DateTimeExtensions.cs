using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public static class DateTimeExtensions
    {
        public static string DateFormatChange(this string dateString)
        {
            // Try to parse the input string to a DateTime object
            DateTime parsedDate;
            if (DateTime.TryParse(dateString, out parsedDate))
            {
                // Format the date to a specific format, e.g., "yyyy-MM-dd"
                return parsedDate.ToString("yyyy-MM-dd");
            }
            else
            {
                // If parsing fails, return the original string (or handle error as needed)
                return dateString;
            }
        }
    }
}

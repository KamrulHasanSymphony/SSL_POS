using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Runtime.InteropServices;
using System.Security.Permissions;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class ResultVM
    {
        public string Status { get; set; }
        public string Message { get; set; }
        public string ExMessage { get; set; }
        public string Id { get; set; }
        public string Value { get; set; }
        public int Count { get; set; }
        public string?[] IDs { get; set; }
        public object Data { get; set; }
        public object DataVM { get; set; }
        public HttpResponseMessage respone { get; set; }
        public string DetailId { get; set; }

        public async Task CopyToAsync(MemoryStream memoryStream)
        {
            throw new NotImplementedException();
        }
    }
}

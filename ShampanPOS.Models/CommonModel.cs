using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Models
{
    public class CommonModel
    {
        public class CredentialModel
        {
            public string UserName { get; set; }
            public string Password { get; set; }           
        }
        public class AuthModel
        {
            public string token { get; set; }

            public string Token_type { get; set; }

            public string Expires_in { get; set; }

            public AspNetUsersVM userInfo { get; set; }
        }
    }
}

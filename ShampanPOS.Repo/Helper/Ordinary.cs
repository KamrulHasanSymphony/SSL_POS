using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace ShampanPOS.Repo.Helper
{
    public class Ordinary
    {
        public static string GetLocalIpAddress()
        {
            string localIpAddress = "";
            foreach (var ip in Dns.GetHostAddresses(Dns.GetHostName()))
            {
                if (ip.AddressFamily == AddressFamily.InterNetwork && !IPAddress.IsLoopback(ip))
                {
                    localIpAddress = ip.ToString();
                    break;
                }
            }
            return localIpAddress;
        }

    }

}

using Newtonsoft.Json;
using Shampan.Services.CommonKendo;
using ShampanPOS.Models;
using ShampanPOS.Repo.Configuration;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using static ShampanPOS.Models.CommonModel;

namespace ShampanPOS.Repo
{
    public class AuthRepo
    {
        public AuthModel SignInAuthentication(LoginResource model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                var result = httpRequestHelper.GetLoginAuthentication(new CredentialModel { UserName = model.UserName, Password = model.Password });                             

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

    }
}

using Newtonsoft.Json;
using Shampan.Services.CommonKendo;
using ShampanPOS.Models.KendoCommon;
using ShampanPOS.Models;
using ShampanPOS.Repo.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static ShampanPOS.Models.CommonModel;
using System.IO;

namespace ShampanPOS.Repo
{
    public class PurchaseReportRepo
    {
        public ResultVM PurchaseReturnvsPurchaseReportList(PurchaseReportVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Report/PurchaseReturnvsPurchaseReportList", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

    }
}



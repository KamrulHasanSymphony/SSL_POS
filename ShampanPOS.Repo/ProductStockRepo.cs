using Newtonsoft.Json;
using ShampanPOS.Models;
using ShampanPOS.Repo.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static ShampanPOS.Models.CommonModel;

namespace ShampanPOS.Repo
{
    public class ProductStockRepo
    {
        public ResultVM Insert(List<ProductStockVM> model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/ProductStock/Insert", authModel, JsonConvert.SerializeObject(model));
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

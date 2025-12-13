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
    public class DayEndRepo
    {
        public ResultVM ProcessData(string startDate, int? branchId)
        {
            try
            {
                // Create the object to send in the request body
                var model = new
                {
                    Date = startDate,
                    BranchId = branchId
                };

                // Create the authentication model
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };

                #region Invoke API
                // Make the POST request with the model serialized to JSON
                var data = httpRequestHelper.PostData("api/DayEnd/ProcessData", authModel, JsonConvert.SerializeObject(model));

                // Deserialize the response to ResultVM
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

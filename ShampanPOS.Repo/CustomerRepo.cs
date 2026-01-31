using Newtonsoft.Json;
using ShampanPOS.Models;
using ShampanPOS.Models.KendoCommon;
using ShampanPOS.Repo.Configuration;
using System;
using System.IO;
using static ShampanPOS.Models.CommonModel;

namespace ShampanPOS.Repo
{
    public class CustomerRepo
    {
        public ResultVM Dropdown()
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };

                #region Invoke API
                var data = httpRequestHelper.PostData("/api/Customer/Dropdown", authModel, JsonConvert.SerializeObject(authModel));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion

                return result;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public ResultVM List(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Customer/List", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM Insert(CustomerVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Customer/Insert", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM Update(CustomerVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Customer/Update", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM Delete(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Customer/Delete", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM GetGridData(GridOptions options)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };

                #region Invoke API 

                var data = httpRequestHelper.PostData("api/Customer/GetGridData", authModel, JsonConvert.SerializeObject(options,
                    new JsonSerializerSettings
                    {
                        NullValueHandling = NullValueHandling.Ignore
                    }));

                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);

                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public Stream ReportPreview(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                var result = httpRequestHelper.PostDataReport("api/Customer/ReportPreview", authModel, JsonConvert.SerializeObject(model));

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM DevitCredit(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };

                #region Invoke API
                var data = httpRequestHelper.PostData("api/Customer/DevitCredit", authModel, JsonConvert.SerializeObject(model));

                if (string.IsNullOrEmpty(data))
                {
                    throw new Exception("API response is empty or null");
                }
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                if (result.Status != "Success")
                {
                    throw new Exception($"API returned an error: {result.Message}");
                }
                return result;
                #endregion
            }
            catch (Exception e)
            {
                throw new Exception("Error in DevitCredit repository: " + e.Message);
            }
        }

        public ResultVM GetCustomerReport(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Report/GetCustomerReport", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        public ResultVM GetCustomerByCategory(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Report/GetCustomerByCategory", authModel, JsonConvert.SerializeObject(model));
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

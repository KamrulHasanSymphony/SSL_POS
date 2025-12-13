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
using System.Runtime.InteropServices.ComTypes;

namespace ShampanPOS.Repo
{
    public class SalePersonMonthlyAchievementRepo
    {
        public ResultVM Dropdown()
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };

                #region Invoke API
                var data = httpRequestHelper.PostData("/api/SalePersonMonthlyAchievement/Dropdown", authModel, JsonConvert.SerializeObject(authModel));
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
                var data = httpRequestHelper.PostData("api/SalePersonMonthlyAchievement/List", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM Insert(SalePersonMonthlyAchievementVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/SalePersonMonthlyAchievement/Insert", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM Update(SalePersonMonthlyAchievementVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/SalePersonMonthlyAchievement/Update", authModel, JsonConvert.SerializeObject(model));
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
                var data = httpRequestHelper.PostData("api/SalePersonMonthlyAchievement/Delete", authModel, JsonConvert.SerializeObject(model));
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

                var data = httpRequestHelper.PostData("api/SalePersonMonthlyAchievement/GetGridData", authModel, JsonConvert.SerializeObject(options,
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

        public List<SalePersonMonthlyAchievementVM> GetParentSalePersonMonthlyAchievementList()
        {
            try
            {
                CommonDataService kendoList = new CommonDataService();
                string sqlQuery = @"
                Select
                    s.Id,
                    S.Code,
                    s.Name

                    from SalePersonMonthlyAchievements s

                    Where s.IsArchive = 0
                                    ";


                return kendoList.Select_Data_ListCMD<SalePersonMonthlyAchievementVM>(sqlQuery);
            }
            catch (Exception ex)
            {
                throw ex.InnerException;
            }
        }

        public ResultVM ProcessData(int salePersonId, string year, int? branchId)
        {
            try
            {
                // Create the object to send in the request body
                var model = new
                {
                    SalePersonId = salePersonId,
                    Year = year,
                    BranchId = branchId
                };

                // Create the authentication model
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };

                #region Invoke API
                // Make the POST request with the model serialized to JSON
                var data = httpRequestHelper.PostData("api/SalePersonMonthlyAchievement/ProcessData", authModel, JsonConvert.SerializeObject(model));

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

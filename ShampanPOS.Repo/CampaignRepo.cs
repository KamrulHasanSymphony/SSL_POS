using Newtonsoft.Json;
using Shampan.Services.CommonKendo;
using ShampanPOS.Models;
using ShampanPOS.Models.KendoCommon;
using ShampanPOS.Repo.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using static ShampanPOS.Models.CommonModel;

namespace ShampanPOS.Repo
{
    public class CampaignRepo
    {
        public ResultVM Dropdown()
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };

                #region Invoke API
                var data = httpRequestHelper.PostData("/api/Campaign/Dropdown", authModel, JsonConvert.SerializeObject(authModel));
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
                var data = httpRequestHelper.PostData("api/Campaign/List", authModel, JsonConvert.SerializeObject(model));
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
                var result = httpRequestHelper.PostDataReport("api/Campaign/ReportPreview", authModel, JsonConvert.SerializeObject(model));

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM Insert(CampaignVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };

                #region Invoke API
                var data = httpRequestHelper.PostData("api/Campaign/Insert", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM Update(CampaignVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };

                #region Invoke API
                var data = httpRequestHelper.PostData("api/Campaign/Update", authModel, JsonConvert.SerializeObject(model));
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
                var data = httpRequestHelper.PostData("/api/Campaign/Delete", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM GetGridData(GridOptions options, string EnumId)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };

                #region Invoke API 
                // Pass EnumId as a query string parameter
                var url = $"api/Campaign/GetGridData?EnumId={EnumId}";

                // Serialize options and send them in the body
                var data = httpRequestHelper.PostData(url, authModel, JsonConvert.SerializeObject(options,
                    new JsonSerializerSettings
                    {
                        NullValueHandling = NullValueHandling.Ignore
                    }));

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

        public ResultVM GetDetailsGridData(GridOptions options, string EnumId)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };

                #region Invoke API 
                // Pass EnumId as a query string parameter
                var url = $"api/Campaign/GetDetailsGridData?EnumId={EnumId}";

                // Serialize options and send them in the body
                var data = httpRequestHelper.PostData(url, authModel, JsonConvert.SerializeObject(options,
                    new JsonSerializerSettings
                    {
                        NullValueHandling = NullValueHandling.Ignore
                    }));

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

        //public ResultVM GetGridData(GridOptions options,string EnumId)
        //{
        //    try
        //    {
        //        HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
        //        AuthModel authModel = new AuthModel { token = ClaimNames.token };

        //        #region Invoke API 

        //        var data = httpRequestHelper.PostData("api/Campaign/GetGridData", authModel, JsonConvert.SerializeObject(options,
        //            new JsonSerializerSettings
        //            {
        //                NullValueHandling = NullValueHandling.Ignore
        //            }));

        //        ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);

        //        #endregion                

        //        return result;
        //    }
        //    catch (Exception e)
        //    {
        //        throw e;
        //    }
        //}

        public List<CampaignVM> GetBranchList()
        {
            try
            {
                CommonDataService kendoList = new CommonDataService();
                string sqlQuery = @"
                    SELECT DISTINCT

			 ISNULL(H.Id,0)	Id
			,ISNULL(H.Id,0)	Value
			,ISNULL(H.Code,'') Code
			,ISNULL(H.Name,'') Name
			,ISNULL(H.DistributorCode,'')	DistributorCode
			,ISNULL(H.Comments,'') Comments
			,CASE WHEN ISNULL(H.IsActive,0) = 1 THEN 'Active' ELSE 'Inactive'	END Status
		
			FROM BranchProfiles H
			
			WHERE H.IsArchive != 1 
                ";

                return kendoList.Select_Data_ListCMD<CampaignVM>(sqlQuery);
            }
            catch (Exception ex)
            {
                throw ex.InnerException;
            }
        }

        //public List<CampaignVM> GetEnumTypeList()
        //{
        //    try
        //    {
        //        CommonDataService kendoList = new CommonDataService();
        //        string sqlQuery = @"
        //            SELECT DISTINCT
        //                ISNULL(H.Id, 0) AS Id,
        //                ISNULL(H.Name, '') AS Name
                    
        //            From EnumTypes H
        //        ";

        //        return kendoList.Select_Data_ListCMD<CampaignVM>(sqlQuery);
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex.InnerException;
        //    }
        //}

        public ResultVM EnumList(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };

                #region Invoke API
                var data = httpRequestHelper.PostData("api/Common/EnumList", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM MultiplePost(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Campaign/MultiplePost", authModel, JsonConvert.SerializeObject(model));
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

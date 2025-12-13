using Newtonsoft.Json;
using Shampan.Services.CommonKendo;
using ShampanPOS.Models;
using ShampanPOS.Models.KendoCommon;
using ShampanPOS.Repo.Configuration;
using System;
using System.Collections.Generic;
using static ShampanPOS.Models.CommonModel;

namespace ShampanPOS.Repo
{
    public class SalePersonRouteRepo
    {
        public ResultVM Dropdown()
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };

                #region Invoke API
                var data = httpRequestHelper.PostData("/api/SalePersonRoute/Dropdown", authModel, JsonConvert.SerializeObject(authModel));
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
                var data = httpRequestHelper.PostData("api/SalePersonRoute/List", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public ResultVM Insert(SalePersonRouteVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };

                #region Invoke API
                var data = httpRequestHelper.PostData("api/SalePersonRoute/Insert", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public ResultVM Update(SalePersonRouteVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };

                #region Invoke API
                var data = httpRequestHelper.PostData("api/SalePersonRoute/Update", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public ResultVM Delete(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };

                #region Invoke API
                var data = httpRequestHelper.PostData("api/SalePersonRoute/Delete", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public ResultVM GetGridData(GridOptions options, string salePersonId)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };

                #region Invoke API 

                // Add salePersonId as a query parameter, send options in the request body
                var data = httpRequestHelper.PostData($"api/SalePersonRoute/GetGridData?salePersonId={salePersonId}", authModel, JsonConvert.SerializeObject(options,
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



        //public ResultVM GetGridData(GridOptions options,string salePersonId)
        //{
        //    try
        //    {
        //        HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
        //        AuthModel authModel = new AuthModel { token = ClaimNames.token };

        //        #region Invoke API 

        //        var data = httpRequestHelper.PostData("api/SalePersonRoute/GetGridData", authModel, JsonConvert.SerializeObject(options,
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

        public List<SalePersonRouteVM> GetRouteList()
        {
            try
            {
                CommonDataService kendoList = new CommonDataService();
                string sqlQuery = @"
                    SELECT DISTINCT
                     ISNULL(H.Id, 0) AS Id,
                     ISNULL(H.Name, '') AS Name,
	                 ISNULL(H.BanglaName, '') AS BanglaName,
                     CASE WHEN ISNULL(H.IsActive,0) = 1 THEN 'Active' ELSE 'Inactive'	END Status
                     FROM Routes H
                     WHERE H.IsArchive != 1
                ";

                return kendoList.Select_Data_ListCMD<SalePersonRouteVM>(sqlQuery);
            }
            catch (Exception ex)
            {
                throw ex.InnerException;
            }
        }

        public List<SalePersonRouteVM> GetBranchList()
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

                return kendoList.Select_Data_ListCMD<SalePersonRouteVM>(sqlQuery);
            }
            catch (Exception ex)
            {
                throw ex.InnerException;
            }
        }

        //public List<SalePersonRouteVM> GetSalePersonList()
        //{
        //    try
        //    {
        //        CommonDataService kendoList = new CommonDataService();
        //string sqlQuery = @"
        //              SELECT DISTINCT
        //                 ISNULL(H.Id, 0) AS Id,
        //                 ISNULL(H.Name, '') AS Name,
	       //              ISNULL(H.BanglaName, '') AS BanglaName,
	       //              CASE WHEN ISNULL(H.IsActive,0) = 1 THEN 'Active' ELSE 'Inactive'	END Status
        //             FROM SalesPersons H
        //             WHERE H.IsArchive != 1
        //        ";

        //        return kendoList.Select_Data_ListCMD<SalePersonRouteVM>(sqlQuery);
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex.InnerException;
        //    }
        //}
    }
}

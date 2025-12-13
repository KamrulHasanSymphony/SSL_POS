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
    public class BranchAdvanceRepo
    {
        public ResultVM Dropdown()
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };

                #region Invoke API
                var data = httpRequestHelper.PostData("/api/BranchAdvance/Dropdown", authModel, JsonConvert.SerializeObject(authModel));
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
                var data = httpRequestHelper.PostData("api/BranchAdvance/List", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM Insert(BranchAdvanceVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/BranchAdvance/Insert", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM Update(BranchAdvanceVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/BranchAdvance/Update", authModel, JsonConvert.SerializeObject(model));
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
                var data = httpRequestHelper.PostData("api/BranchAdvance/Delete", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM GetGridData(GridOptions options, string BranchId)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };

                #region Invoke API 

                var data = httpRequestHelper.PostData($"api/BranchAdvance/GetGridData?BranchId={BranchId}", authModel, JsonConvert.SerializeObject(options,
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

        //public List<ProductGroupVM> GetProductGroupList()
        //{
        //    try
        //    {
        //        CommonDataService kendoList = new CommonDataService();
        //        string sqlQuery = @"
        //        SELECT DISTINCT
        //            ISNULL(H.Id, 0) AS Id,
        //            ISNULL(H.Id, 0) AS Value,
        //            ISNULL(H.Code, '') AS Code,
        //            ISNULL(H.Name, '') AS Name,
        //            ISNULL(H.Description, '') AS Description,
        //            ISNULL(H.Comments, '') AS Comments,
        //            CASE WHEN ISNULL(H.IsActive, 0) = 1 THEN 'Active' ELSE 'Inactive' END AS Status
        //        FROM ProductGroups H
        //        WHERE H.IsArchive != 1
        //        ";


        //        return kendoList.Select_Data_ListCMD<ProductGroupVM>(sqlQuery);
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex.InnerException;
        //    }
        //}        

   //     public List<UOMVM> GetUOMList()
   //     {
   //         try
   //         {
   //             CommonDataService kendoList = new CommonDataService();
   //             string sqlQuery = @"
   //             SELECT DISTINCT

			// 1	Id
			//,'UOM-00001' Code
			//,'Ltr' Name
			//,'Active' Status

			//UNION ALL

   //         SELECT DISTINCT

			// ISNULL(H.Id,0)	Id
			//,ISNULL(H.Code,'') Code
			//,ISNULL(H.Name,'') Name
			//,CASE WHEN ISNULL(H.IsActive,0) = 1 THEN 'Active' ELSE 'Inactive'	END Status
		
			//FROM UOMs H
			
			//WHERE H.IsArchive != 1  
   //             ";

   //             return kendoList.Select_Data_ListCMD<UOMVM>(sqlQuery);
   //         }
   //         catch (Exception ex)
   //         {
   //             throw ex.InnerException;
   //         }
   //     }


        public ResultVM MultiplePost(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/BranchAdvance/MultiplePost", authModel, JsonConvert.SerializeObject(model));
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

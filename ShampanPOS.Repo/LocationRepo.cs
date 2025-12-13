using Newtonsoft.Json;
using Shampan.Services.CommonKendo;
using ShampanPOS.Models;
using ShampanPOS.Models.KendoCommon;
using ShampanPOS.Repo.Configuration;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using static ShampanPOS.Models.CommonModel;

namespace ShampanPOS.Repo
{
    public class LocationRepo
    {
       
        public ResultVM Dropdown()
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };

                #region Invoke API
                var data = httpRequestHelper.PostData("/api/Location/Dropdown", authModel, JsonConvert.SerializeObject(authModel));
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
                var data = httpRequestHelper.PostData("api/Location/List", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM Insert(LocationVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Location/Insert", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM Update(LocationVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Location/Update", authModel, JsonConvert.SerializeObject(model));
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
                var data = httpRequestHelper.PostData("api/Location/Delete", authModel, JsonConvert.SerializeObject(model));
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

                var data = httpRequestHelper.PostData("api/Location/GetGridData", authModel, JsonConvert.SerializeObject(options,
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

        //public ResultVM GetEnumTypeList(CommonVM model)
        //{
        //    try
        //    {
        //        HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
        //        AuthModel authModel = new AuthModel { token = ClaimNames.token };
        //        #region Invoke API
        //        var data = httpRequestHelper.PostData("api/Common/EnumTypeList", authModel, JsonConvert.SerializeObject(model));
        //        ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
        //        #endregion                

        //        return result;
        //    }
        //    catch (Exception e)
        //    {
        //        throw e;
        //    }
        //}
        //     public List<LocationVM> GetEnumTypeList()
        //     {
        //         try
        //         {
        //             CommonDataService kendoList = new CommonDataService();
        //             string sqlQuery = @"
        //            SELECT DISTINCT

        // ISNULL(H.Id,0)	 EnumTypeId
        //,ISNULL(H.Name,'') EnumName	

        //FROM EnumTypes H  where EnumType='location'";


        //             return kendoList.Select_Data_ListCMD<LocationVM>(sqlQuery);


        //         }
        //         catch (Exception ex)
        //         {
        //             throw ex.InnerException;
        //         }
        //     }



        public List<LocationVM> GetParentList()
        {
            try
            {
                CommonDataService kendoList = new CommonDataService();
                string sqlQuery = @"
               SELECT DISTINCT

        ISNULL(H.Id,0)	Id
		,ISNULL(H.Code,'') Code
		,ISNULL(H.Name,'') Name	
		,ISNULL(H.EnumType,'') EnumType	
		,ISNULL(H.ParentId,0) parent	
		
						

		FROM Locations H  
		where 1=1
                ";


                return kendoList.Select_Data_ListCMD<LocationVM>(sqlQuery);

               // return kendoList.Select_Data_List<LocationVM>("sp_GetParentList", "get_List");
            }
            catch (Exception ex)
            {
                throw ex.InnerException;
            }
        }

        public Stream ReportPreview(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                var result = httpRequestHelper.PostDataReport("api/Location/ReportPreview", authModel, JsonConvert.SerializeObject(model));

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }


    }
}

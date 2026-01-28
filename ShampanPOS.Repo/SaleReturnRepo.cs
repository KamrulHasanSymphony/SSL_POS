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
    public class SaleReturnRepo
    {
        public ResultVM Dropdown()
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };

                #region Invoke API
                var data = httpRequestHelper.PostData("/api/SaleReturn/Dropdown", authModel, JsonConvert.SerializeObject(authModel));
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
                var data = httpRequestHelper.PostData("api/SaleReturn/List", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM Insert(SaleReturnVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/SaleReturn/Insert", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM Update(SaleReturnVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/SaleReturn/Update", authModel, JsonConvert.SerializeObject(model));
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
                var data = httpRequestHelper.PostData("api/SaleReturn/Delete", authModel, JsonConvert.SerializeObject(model));
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
                var data = httpRequestHelper.PostData("api/SaleReturn/MultiplePost", authModel, JsonConvert.SerializeObject(model));
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

                var data = httpRequestHelper.PostData("api/SaleReturn/GetGridData", authModel, JsonConvert.SerializeObject(options,
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

        public ResultVM GetDetailsGridData(GridOptions options)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };

                #region Invoke API 

                var data = httpRequestHelper.PostData("api/SaleReturn/GetDetailsGridData", authModel, JsonConvert.SerializeObject(options,
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

        //public List<DeliveryPersonVM> GetDeliveryList()
        //{
        //    try
        //    {
        //        CommonDataService kendoList = new CommonDataService();
        //        string sqlQuery = @"
        //         SELECT DISTINCT
        //         ISNULL(H.Id, 0) AS Id,
        //         ISNULL(H.Id, 0) AS Value,
        //         ISNULL(H.Code, '') AS Code,
        //         ISNULL(H.Name, '') AS Name,
        //         ISNULL(H.Comments, '') AS Comments
     
        //         FROM DeliveryPersons H
        //        ";


        //        return kendoList.Select_Data_ListCMD<DeliveryPersonVM>(sqlQuery);
        //    }
        //    catch (Exception)
        //    {

        //        throw;
        //    }
        //}

        public List<EnumTypeVM> GetDriverList()
        {
            try
            {
                CommonDataService kendoList = new CommonDataService();
                string sqlQuery = @"
                 Select
                 ISNULL(H.Id,0)	Id,
                 ISNULL(H.Name,'') Name

                from EnumTypes H Where EnumType = 'DriverPerson'
                ";


                return kendoList.Select_Data_ListCMD<EnumTypeVM>(sqlQuery);
            }
            catch (Exception)
            {

                throw;
            }
        }
        public List<SaleReturnVM> GetBranchList()
        {
            try
            {
                CommonDataService kendoList = new CommonDataService();
                return kendoList.Select_Data_List<SaleReturnVM>("sp_GetBranchList", "get_List");
            }
            catch (Exception ex)
            {
                throw ex.InnerException;
            }
        }
        //public List<SaleReturnVM> GetCustomerList()
        //{
        //    try
        //    {
        //        CommonDataService kendoList = new CommonDataService();
        //        return kendoList.Select_Data_List<SaleReturnVM>("sp_GetCustomerList", "get_List");
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex.InnerException;
        //    }
        //}
        public List<SaleReturnVM> GetRouteList()
        {
            try
            {
                CommonDataService kendoList = new CommonDataService();
                return kendoList.Select_Data_List<SaleReturnVM>("sp_GetRouteList", "get_List");
            }
            catch (Exception ex)
            {
                throw ex.InnerException;
            }
        }
        public List<SaleReturnVM> GetSaleReturnPersonList()
        {
            try
            {
                CommonDataService kendoList = new CommonDataService();
                return kendoList.Select_Data_List<SaleReturnVM>("sp_GetSaleReturnPersonList", "get_List");
            }
            catch (Exception ex)
            {
                throw ex.InnerException;
            }
        }
        //public List<SaleReturnVM> GetCurrencieList()
        //{
        //    try
        //    {
        //        CommonDataService kendoList = new CommonDataService();
        //        return kendoList.Select_Data_List<SaleReturnVM>("sp_GetCurrencieList", "get_List");
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex.InnerException;
        //    }
        //}
        public Stream ReportPreview(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                var result = httpRequestHelper.PostDataReport("api/SaleReturn/ReportPreview", authModel, JsonConvert.SerializeObject(model));

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM SummaryReport(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/SaleReturn/SummaryReport", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }



        public ResultVM GetSaleReturnDetailDataById(GridOptions options, int masterId)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };

                #region Invoke API 

                var data = httpRequestHelper.PostData($"api/SaleReturn/GetSaleReturnDetailDataById?masterId={masterId}", authModel, JsonConvert.SerializeObject(options,
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


        public ResultVM GetSaleReturnReport(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Report/GetSaleReturnReport", authModel, JsonConvert.SerializeObject(model));
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

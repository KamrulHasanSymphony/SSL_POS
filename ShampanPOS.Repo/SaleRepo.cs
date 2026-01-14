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
    public class SaleRepo
    {
        public ResultVM Dropdown()
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };

                #region Invoke API
                var data = httpRequestHelper.PostData("/api/Sale/Dropdown", authModel, JsonConvert.SerializeObject(authModel));
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
                var data = httpRequestHelper.PostData("api/Sale/List", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM Insert(SaleVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Sale/Insert", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM Update(SaleVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Sale/Update", authModel, JsonConvert.SerializeObject(model));
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
                var data = httpRequestHelper.PostData("api/Sale/Delete", authModel, JsonConvert.SerializeObject(model));
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
                var data = httpRequestHelper.PostData("api/Sale/MultiplePost", authModel, JsonConvert.SerializeObject(model));
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

                var data = httpRequestHelper.PostData("api/Sale/GetGridData", authModel, JsonConvert.SerializeObject(options,
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

                var data = httpRequestHelper.PostData("api/Sale/GetDetailsGridData", authModel, JsonConvert.SerializeObject(options,
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
        public List<SaleVM> GetBranchList()
        {
            try
            {
                CommonDataService kendoList = new CommonDataService();
                return kendoList.Select_Data_List<SaleVM>("sp_GetBranchList", "get_List");
            }
            catch (Exception ex)
            {
                throw ex.InnerException;
            }
        }
        //public List<SaleVM> GetCustomerList()
        //{
        //    try
        //    {
        //        CommonDataService kendoList = new CommonDataService();
        //        return kendoList.Select_Data_List<SaleVM>("sp_GetCustomerList", "get_List");
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex.InnerException;
        //    }
        //}
        public List<SaleVM> GetRouteList()
        {
            try
            {
                CommonDataService kendoList = new CommonDataService();
                return kendoList.Select_Data_List<SaleVM>("sp_GetRouteList", "get_List");
            }
            catch (Exception ex)
            {
                throw ex.InnerException;
            }
        }
        //public List<SaleVM> GetSalePersonList()
        //{
        //    try
        //    {
        //        CommonDataService kendoList = new CommonDataService();
        //        return kendoList.Select_Data_List<SaleVM>("sp_GetSalePersonList", "get_List");
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex.InnerException;
        //    }
        //}
        //public List<SaleVM> GetCurrencieList()
        //{
        //    try
        //    {
        //        CommonDataService kendoList = new CommonDataService();
        //        return kendoList.Select_Data_List<SaleVM>("sp_GetCurrencieList", "get_List");
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
                var result = httpRequestHelper.PostDataReport("api/Sale/ReportPreview", authModel, JsonConvert.SerializeObject(model));

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
                var data = httpRequestHelper.PostData("api/Sale/SummaryReport", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM GetSaleDetailDataById(GridOptions options, int masterId)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };

                #region Invoke API 

                var data = httpRequestHelper.PostData($"api/Sale/GetSaleDetailDataById?masterId={masterId}", authModel, JsonConvert.SerializeObject(options,
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


        public ResultVM SaleList(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Sale/SaleList", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }


        public ResultVM SaleListForPayment(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Sale/SaleListForPayment", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }



        public ResultVM FromSaleGridData(GridOptions options)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };

                #region Invoke API 

                var data = httpRequestHelper.PostData("api/Sale/FromSaleGridData", authModel, JsonConvert.SerializeObject(options,
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

    }
}

using Newtonsoft.Json;
using Shampan.Services.CommonKendo;
using ShampanPOS.Models;
using ShampanPOS.Repo.Configuration;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Net.Http;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using static ShampanPOS.Models.CommonModel;

namespace ShampanPOS.Repo
{
    public class CommonRepo
    {
        public ResultVM SignInAuthentication(LoginResource model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = model.UserName, Password = model.Password });
                #region Invoke API
                var data = httpRequestHelper.PostData("api/UserLogin/SignIn", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public List<UserMenu> GetAssignedMenuList(string userName)
        {
            try
            {
                CommonDataService kendoList = new CommonDataService();

                return kendoList.Select_Data_List<UserMenu>("sp_GetAssignedMenuList", "get_List", userName);
            }
            catch (Exception ex)
            {
                throw ex.InnerException;
            }
        }

        public ResultVM NextPrevious(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Common/NextPrevious", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM GetSettingsValue(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Common/GetSettingsValue", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM GetProductModalForSaleData(ProductDataVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Common/GetProductModalForSaleData", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM GetProductModalForPurchaseData(ProductDataVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Common/GetProductModalForPurchaseData", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM GetProductModalData(ProductDataVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Common/GetProductModalData", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM GetUOMFromNameData(ProductDataVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Product/GetUOMFromNameData", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM GetProductGroupModalData(ProductDataVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Product/GetProductGroupModalData", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM GetAreaList(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Common/GetAreaList", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultModel<List<CommonDropDown>> GetBooleanDropDown()
        {
            try
            {
                var data = new List<CommonDropDown>
                {
                    new CommonDropDown
                    {
                        Value = "0",
                        Name = "Not-posted"
                    },
                    new CommonDropDown
                    {
                        Value = "1",
                        Name = "Posted"
                    }
                    ,
                    new CommonDropDown
                    {
                        Value = "",
                        Name = "All"
                    }
                };

                return new ResultModel<List<CommonDropDown>>
                {
                    Status = Status.Success,
                    Message = "Data Loaded",
                    Data = data
                };
            }
            catch (Exception ex)
            {
                return new ResultModel<List<CommonDropDown>>
                {
                    Status = Status.Fail,
                    Data = null
                };
            }
        }

        public ResultVM GetProductGroupList(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Common/ProductGroupList", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        public ResultVM GetUOMList(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Common/UOMList", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        //     public List<UOMVM> GetUOMList()
        //     {
        //         try
        //         {
        //             CommonDataService kendoList = new CommonDataService();
        //             string sqlQuery = @"

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

        public ResultVM GetEnumTypeList(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Common/EnumTypeList", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        //public List<EnumTypeVM> GetEnumTypeList()
        //{
        //    try
        //    {
        //        CommonDataService kendoList = new CommonDataService();
        //        string sqlQuery = @"

        //        SELECT DISTINCT
        //      ISNULL(H.Id, 0) AS Id,
        //      ISNULL(H.Name, '') AS Name,
        //      ISNULL(H.EnumType, '') AS EnumType

        //      From EnumTypes H 
        //        WHERE 1 = 1  ";

        //        return kendoList.Select_Data_ListCMD<EnumTypeVM>(sqlQuery);
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex.InnerException;
        //    }
        //}

        public ResultVM GetSalePersonList(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Common/SalePersonList", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }


        public ResultVM GetSaleOrderList(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Common/SaleOrderList", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }


        public ResultVM GetSalePersonParentList(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Common/GetSalePersonParentList", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        //public List<SaleOrderVM> GetSalePersonList()
        //{
        //    try
        //    {
        //        CommonDataService kendoList = new CommonDataService();
        //        return kendoList.Select_Data_List<SaleOrderVM>("sp_GetSalePersonList", "get_List");
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex.InnerException;
        //    }
        //}

        public ResultVM GetCurrencieList(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Common/CurrencieList", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        public ResultVM GetCustomerCategoryList(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Common/CustomerCategoryList", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM GetProductList(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Common/ProductList", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        //     public List<CurrencieVM> GetCurrencieList()
        //     {
        //         try
        //         {
        //             CommonDataService kendoList = new CommonDataService();
        //             string sqlQuery = @"
        //       SELECT DISTINCT
        //          ISNULL(H.Id,0)	Id
        //,ISNULL(H.Id,0)	Value
        //,ISNULL(H.Code,'') Code
        //,ISNULL(H.Name,'') Name

        //,CASE WHEN ISNULL(H.IsActive,0) = 1 THEN 'Active' ELSE 'Inactive'	END Status

        //FROM Currencies H

        //WHERE H.IsActive = 1  
        //             ";


        //             return kendoList.Select_Data_ListCMD<CurrencieVM>(sqlQuery);
        //         }
        //         catch (Exception)
        //         {

        //             throw;
        //         }
        //     }
        public ResultVM GetDeliveryList(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Common/DeliveryPersonList", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        //public List<DeliveryPersonVM> GetDeliveryList()
        //{
        //    try
        //    {
        //        CommonDataService kendoList = new CommonDataService();
        //        string sqlQuery = @"
        //SELECT DISTINCT
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
        //public ResultVM GetDriverList(CommonVM model)
        //{
        //    try
        //    {
        //        HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
        //        AuthModel authModel = new AuthModel { token = ClaimNames.token };
        //        #region Invoke API
        //        var data = httpRequestHelper.PostData("api/Common/DriverList", authModel, JsonConvert.SerializeObject(model));
        //        ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
        //        #endregion 

        //        return result;
        //    }
        //    catch (Exception e)
        //    {
        //        throw e;
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

        public ResultVM GetCustomerList(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Common/CustomerList", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        //     public List<CustomerVM> GetCustomerList(CommonVM param)
        //     {
        //         try
        //         {
        //             CommonDataService kendoList = new CommonDataService();
        //             string sqlQuery = @"
        //         SELECT DISTINCT

        // ISNULL(H.Id,0)	Id
        //,ISNULL(H.Code,'') Code
        //,ISNULL(H.Name,'') Name
        //,ISNULL(H.Address,'') Address
        //,ISNULL(H.Email,'') Email
        //,ISNULL(H.City,'') City
        //,ISNULL(H.BanglaName,'') BanglaName
        //,ISNULL(H.Comments,'') Comments
        //,CASE WHEN ISNULL(H.IsActive,0) = 1 THEN 'Active' ELSE 'Inactive'	END Status

        //FROM Customers H

        //WHERE H.IsActive = 1

        //             ";

        //             if(!string.IsNullOrEmpty(param.BranchId))
        //             {
        //                 sqlQuery += " AND H.BranchId = " + param.BranchId + " ";
        //             }

        //             return kendoList.Select_Data_ListCMD<CustomerVM>(sqlQuery);
        //         }
        //         catch (Exception ex)
        //         {
        //             throw ex.InnerException;
        //         }
        //     }
        public ResultVM GetReceiveByDeliveryPersonList(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Common/ReceiveByDeliveryPersonList", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        //     public List<CustomerAdvanceVM> GetReceiveByDeliveryPersonList()
        //     {
        //         try
        //         {
        //             CommonDataService kendoList = new CommonDataService();
        //string sqlQuery = @"

        //         SELECT DISTINCT

        // ISNULL(H.Id,0)	Id
        //,ISNULL(H.Name,'') Name
        //,ISNULL(H.EnumType,'') EnumType

        //FROM EnumTypes H

        //WHERE H.EnumType = 'DeliveryPerson' 
        //             ";

        //             return kendoList.Select_Data_ListCMD<CustomerAdvanceVM>(sqlQuery);
        //         }
        //         catch (Exception ex)
        //         {
        //             throw ex.InnerException;
        //         }
        //     }

        public ResultVM GetSupplierList(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Common/SupplierList", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        //public List<CommonDropDown> GetSupplierList()
        //{
        //    try
        //    {
        //        CommonDataService kendoList = new CommonDataService();
        //        string sqlQuery = @"
        //         Select
        //         ISNULL(H.Id,0)	Id,
        //         ISNULL(H.Name,'') Name,              
        //         ISNULL(H.Code,'') Code


        //        FROM Suppliers H
        //        WHERE H.IsActive =1 ";


        //        return kendoList.Select_Data_ListCMD<CommonDropDown>(sqlQuery);
        //    }
        //    catch (Exception)
        //    {

        //        throw;
        //    }
        //}
        public ResultVM GetCampaignTargetList(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Common/CampaignTargetList", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        //public List<CommonDropDown> GetCampaignTargetList()
        //{
        //    try
        //    {
        //        CommonDataService kendoList = new CommonDataService();
        //        string sqlQuery = @"
        //         Select
        //         ISNULL(H.Id,0)	Id,
        //         ISNULL(H.TotalTarget,'') Value

        //        FROM SalePersonCampaignTargets H
        //        WHERE 1 =1 ";


        //        return kendoList.Select_Data_ListCMD<CommonDropDown>(sqlQuery);
        //    }
        //    catch (Exception)
        //    {

        //        throw;
        //    }
        //}

        public ResultVM GetCampaignList(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Common/GetCampaignList", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        public ResultVM GetCustomerModalData(CustomerDataVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Customer/GetCustomerModalData", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM GetFiscalYearForSaleList(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Common/GetFiscalYearForSaleList", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }
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

        public ResultVM GetAreaLocationList(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Common/AreaLocationList", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM GetParentAreaList(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Common/ParentAreaList", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }


        public ResultVM GetParentBranchProfileList(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                string url = "api/Common/ParentBranchProfileList";
                if (!string.IsNullOrEmpty(model.UserId) && model.UserId.ToLower() != "erp")
                {
                    url = "api/Common/AssingedBranchList";
                }
                var data = httpRequestHelper.PostData(url, authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM GetCustomerGroupList(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Common/CustomerGroupList", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM GetCustomerRouteList(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Common/CustomerRouteList", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM GetSupplierGroupList(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Common/SupplierGroupList", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM SalePersonList(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Common/ParentSalePersonList", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM GetCustomersBySalePersonAndBranch(int salePersonId, int branchId)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };

                // Create a new instance of a model or DTO to pass the parameters to the API
                var requestParam = new CustomerData
                {
                    SalePersonId = salePersonId,
                    BranchId = branchId
                };

                #region Invoke API
                // Now passing the SalePersonId and BranchId in the request as JSON
                var data = httpRequestHelper.PostData("api/Common/GetCustomersBySalePersonAndBranch", authModel, JsonConvert.SerializeObject(requestParam));

                // Deserialize the response into ResultVM
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion

                return result;
            }
            catch (Exception e)
            {
                // Log the exception (you could add logging here as well)
                throw e;
            }
        }


        public ResultVM GetRouteBySalePersonAndBranch(int salePersonId, int branchId)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };

                // Create a new instance of a model or DTO to pass the parameters to the API
                var requestParam = new CustomerData
                {
                    SalePersonId = salePersonId,
                    BranchId = branchId
                };

                #region Invoke API
                // Now passing the SalePersonId and BranchId in the request as JSON
                var data = httpRequestHelper.PostData("api/Common/GetRouteBySalePersonAndBranch", authModel, JsonConvert.SerializeObject(requestParam));

                // Deserialize the response into ResultVM
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion

                return result;
            }
            catch (Exception e)
            {
                // Log the exception (you could add logging here as well)
                throw e;
            }
        }


        public ResultVM GetTop10Customers(CommonVM param)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Common/GetTop10Customers", authModel, JsonConvert.SerializeObject(param));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM GetBottom10Customers(CommonVM param)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Common/GetBottom10Customers", authModel, JsonConvert.SerializeObject(param));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM GetTop10Products(CommonVM param)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Common/GetTop10Products", authModel, JsonConvert.SerializeObject(param));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM GetBottom10Products(CommonVM param)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Common/GetBottom10Products", authModel, JsonConvert.SerializeObject(param));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM GetTop10SalePersons(CommonVM param)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Common/GetTop10SalePersons", authModel, JsonConvert.SerializeObject(param));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM GetBottom10SalePersons(CommonVM param)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Common/GetBottom10SalePersons", authModel, JsonConvert.SerializeObject(param));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM GetOrderPurchasePOReturnData(CommonVM param)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Common/GetOrderPurchasePOReturnData", authModel, JsonConvert.SerializeObject(param));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM GetSalesData(CommonVM param)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Common/GetSalesData", authModel, JsonConvert.SerializeObject(param));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM GetPendingSales(CommonVM param)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Common/GetPendingSales", authModel, JsonConvert.SerializeObject(param));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        //public ResultVM CampaignMudularityCalculation(CampaignUtilty vm)
        //{
        //    try
        //    {
        //        HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
        //        AuthModel authModel = new AuthModel { token = ClaimNames.token };
        //        #region Invoke API
        //        var data = httpRequestHelper.PostData("api/Common/CampaignMudularityCalculation", authModel, JsonConvert.SerializeObject(vm));
        //        ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
        //        #endregion                

        //        return result;
        //    }
        //    catch (Exception e)
        //    {
        //        throw e;
        //    }
        //}

        //public ResultVM CampaignInvoiceCalculation(CampaignUtilty vm)
        //{
        //    try
        //    {
        //        HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
        //        AuthModel authModel = new AuthModel { token = ClaimNames.token };
        //        #region Invoke API
        //        var data = httpRequestHelper.PostData("api/Common/CampaignInvoiceCalculation", authModel, JsonConvert.SerializeObject(vm));
        //        ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
        //        #endregion                

        //        return result;
        //    }
        //    catch (Exception e)
        //    {
        //        throw e;
        //    }
        //}

        public ResultVM GetPaymentTypeList(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Common/PaymentTypeList", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM GetSaleDeleveryByCustomerAndBranch(int CustomerId, int branchId)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };

                // Create a new instance of a model or DTO to pass the parameters to the API
                var requestParam = new CustomerData
                {
                    CustomerId = CustomerId,
                    BranchId = branchId
                };

                #region Invoke API
                // Now passing the SalePersonId and BranchId in the request as JSON
                var data = httpRequestHelper.PostData("api/Common/GetSaleDeleveryByCustomerAndBranch", authModel, JsonConvert.SerializeObject(requestParam));

                // Deserialize the response into ResultVM
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion

                return result;
            }
            catch (Exception e)
            {
                // Log the exception (you could add logging here as well)
                throw e;
            }
        }

        public ResultVM GetSaleDeleveryList(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Common/SaleDeleveryList", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        //public ResultVM GetSaleDeleveryModal(SaleDeliveryVM model)
        //{
        //    try
        //    {
        //        HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
        //        AuthModel authModel = new AuthModel { token = ClaimNames.token };
        //        #region Invoke API
        //        var data = httpRequestHelper.PostData("api/Common/GetSaleDeleveryModal", authModel, JsonConvert.SerializeObject(model));
        //        ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
        //        #endregion                

        //        return result;
        //    }
        //    catch (Exception e)
        //    {
        //        throw e;
        //    }
        //}


        public ResultVM GetFocalPointList(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                CommonModel.AuthModel auth = new CommonModel.AuthModel
                {
                    token = ClaimNames.token
                };
                string value = httpRequestHelper.PostData("api/Common/GetFocalPointList", auth, JsonConvert.SerializeObject(model));
                return JsonConvert.DeserializeObject<ResultVM>(value);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public ResultVM HasDayEndData(string branchId)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();

                CommonModel.AuthModel auth = new CommonModel.AuthModel
                {
                    token = ClaimNames.token
                };
               
                var payload = new { Id = branchId };
                string jsonPayload = JsonConvert.SerializeObject(payload);

                string apiUrl = "api/Common/CheckDayEnd";
                string response = httpRequestHelper.PostData(apiUrl, auth, jsonPayload);

                return JsonConvert.DeserializeObject<ResultVM>(response);
            }
            catch (Exception ex)
            {
                throw;
            }
        }


        //public ResultVM HasDayEndData(string branchId)
        //{
        //    try
        //    {
        //        HttpRequestHelper httpRequestHelper = new HttpRequestHelper();

        //        // Authentication model
        //        CommonModel.AuthModel auth = new CommonModel.AuthModel
        //        {
        //            token = ClaimNames.token
        //        };

        //        // Prepare request payload
        //        var payload = new { branchCode = branchId };
        //        string jsonPayload = JsonConvert.SerializeObject(payload);

        //        // Call the API
        //        string apiUrl = "api/Common/CheckDayEnd"; // your API endpoint
        //        string response = httpRequestHelper.PostData(apiUrl, auth, jsonPayload);

        //        // Deserialize the result and return
        //        return JsonConvert.DeserializeObject<ResultVM>(response);
        //    }
        //    catch (Exception ex)
        //    {
        //        // Optionally log exception here
        //        throw;
        //    }
        //}

    }
}

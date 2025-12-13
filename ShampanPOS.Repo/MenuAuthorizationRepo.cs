using Newtonsoft.Json;
using Shampan.Services.CommonKendo;
using ShampanPOS.Models;
using ShampanPOS.Models.KendoCommon;
using ShampanPOS.Repo.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Runtime.Remoting.Contexts;
using System.Security.Policy;
using System.Threading.Tasks;
using static ShampanPOS.Models.CommonModel;

namespace ShampanPOS.Repo
{
    public class MenuAuthorizationRepo
    {
        public ResultVM RoleIndex(GridOptions options)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };

                #region Invoke API 

                var data = httpRequestHelper.PostData("api/MenuAuthorization/GetRoleIndexData", authModel, JsonConvert.SerializeObject(options,
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
        public GridEntity<UserGroupVM> UserGroupIndex(GridOptions options)
        {
            try
            {
                var result = new GridEntity<UserGroupVM>();
                result = KendoGrid<UserGroupVM>.GetGridData(options, "sp_Select_UserGroupIndex_Grid", "get_summary", "H.Id");
                return result;
            }
            catch (Exception ex)
            {
                throw ex.InnerException;
            }
        }
        public ResultVM UserGroupCreateEdit(UserGroupVM model)
        {
            try
            {
                model.Operation = model.Operation.ToLower();
                var respone = KendoGrid<UserGroupVM>.UserGroupCreateEdit("sp_UserGroupCreateEdit", model);
                model.Id = Convert.ToInt32(respone[2]);
                var data = JsonConvert.SerializeObject(model);
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                result.Status = ResultStatus.Success.ToString();
                result.Message = model.Operation.ToLower() == "add" ? MessageModel.InsertSuccess : MessageModel.UpdateSuccess;
                result.Id = respone[2];
                result.DataVM = model;
                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        public ResultModel<List<UserGroupVM>> GetUserGroupAll(int id)
        {
            try
            {
                var result = KendoGrid<DataTable>.GetAll("sp_Select_GetUserGroupAll", id, "");

                var model = new List<UserGroupVM>();
                foreach (DataRow row in result.Rows)
                {
                    model.Add(new UserGroupVM
                    {
                        Id = Convert.ToInt32(row["Id"]),
                        Name = row["Name"].ToString(),
                        CreatedBy = row["CreatedBy"].ToString(),
                        CreatedFrom = row["CreatedFrom"].ToString(),
                        LastModifiedBy = row["LastModifiedBy"].ToString(),
                        LastUpdateFrom = row["LastUpdateFrom"].ToString(),
                        CreatedOn = row["CreatedOn"].ToString(),
                        LastModifiedOn = row["LastModifiedOn"].ToString(),
                    });
                }

                return new ResultModel<List<UserGroupVM>>()
                {
                    Status = Status.Success,
                    Message = MessageModel.DataLoaded,
                    Data = model
                };
            }
            catch (Exception ex)
            {
                throw ex.InnerException;
            }
        }
        public ResultModel<List<RoleMenuVM>> GetUserGroupWiseMenuAccessData(int id)
        {
            try
            {
                var result = KendoGrid<DataTable>.GetAll("sp_GetUserGroupWiseMenuAccessData", id, "");

                var model = new List<RoleMenuVM>();
                foreach (DataRow row in result.Rows)
                {
                    model.Add(new RoleMenuVM
                    {
                        Id = Convert.ToInt32(row["Id"]),
                        IsChecked = Convert.ToBoolean(row["IsChecked"]),
                        RoleId = row["RoleId"].ToString(),
                        UserGroupId = row["UserGroupId"].ToString(),
                        MenuId = Convert.ToInt32(row["MenuId"]),
                        ParentId = Convert.ToInt32(row["ParentId"]),
                        Url = row["Url"].ToString(),
                        MenuName = row["MenuName"].ToString(),
                        Controller = row["Controller"].ToString(),
                        DisplayOrder = Convert.ToInt32(row["DisplayOrder"]),
                    });
                }

                return new ResultModel<List<RoleMenuVM>>()
                {
                    Status = Status.Success,
                    Message = MessageModel.DataLoaded,
                    Data = model
                };
            }
            catch (Exception ex)
            {
                throw ex.InnerException;
            }
        }
        public ResultVM UserGroupMenuCreateEdit(RoleMenuVM model)
        {
            try
            {
                string[] respone = new string[2];

                respone = KendoGrid<RoleMenuVM>.Delete("sp_Delete", "", "", model.UserGroupId);

                foreach (var item in model.roleMenuList)
                {
                    if (item.MenuId > 0 && item.IsChecked)
                    {
                        item.CreatedBy = model.CreatedBy;
                        item.CreatedOn = model.CreatedOn;
                        item.CreatedFrom = model.CreatedFrom;
                        item.RoleId = model.RoleId;
                        item.UserGroupId = model.UserGroupId;
                        respone = KendoGrid<RoleMenuVM>.RoleMenuCreateEdit("sp_RoleMenuCreateEdit", item);
                    }
                }

                var data = JsonConvert.SerializeObject(model);
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                result.Status = ResultStatus.Success.ToString();
                result.Message = MessageModel.SubmissionSuccess;
                result.DataVM = model;
                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        public ResultVM UserMenuIndex(GridOptions options)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };

                #region Invoke API 

                var data = httpRequestHelper.PostData("api/MenuAuthorization/GetUserMenuIndexData", authModel, JsonConvert.SerializeObject(options,
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
        public ResultVM RoleCreateEdit(UserRoleVM model)
        {
            try
            {
                model.Operation = model.Operation.ToLower();
                var respone = KendoGrid<UserRoleVM>.RoleCreateEdit("sp_RoleCreateEdit", model);
                model.Id = Convert.ToInt32(respone[2]);
                var data = JsonConvert.SerializeObject(model);
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                result.Status = ResultStatus.Success.ToString();
                result.Message = model.Operation.ToLower() == "add" ? MessageModel.InsertSuccess : MessageModel.UpdateSuccess;
                result.Id = respone[2];
                result.DataVM = model;
                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        public ResultVM Insert(UserRoleVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/MenuAuthorization/Insert", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        public ResultVM Update(UserRoleVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/MenuAuthorization/Update", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        public ResultModel<List<UserRoleVM>> GetRoleAll(int id)
        {
            try
            {
                var result = KendoGrid<DataTable>.GetAll("sp_Select_GetRoleAll", id, "");

                var model = new List<UserRoleVM>();
                foreach (DataRow row in result.Rows)
                {
                    model.Add(new UserRoleVM
                    {
                        Id = Convert.ToInt32(row["Id"]),
                        Name = row["Name"].ToString(),
                        CreatedBy = row["CreatedBy"].ToString(),
                        CreatedFrom = row["CreatedFrom"].ToString(),
                        LastModifiedBy = row["LastModifiedBy"].ToString(),
                        LastUpdateFrom = row["LastUpdateFrom"].ToString(),
                        CreatedOn = row["CreatedOn"].ToString(),
                        LastModifiedOn = row["LastModifiedOn"].ToString(),
                    });
                }

                return new ResultModel<List<UserRoleVM>>()
                {
                    Status = Status.Success,
                    Message = MessageModel.DataLoaded,
                    Data = model
                };
            }
            catch (Exception ex)
            {
                throw ex.InnerException;
            }
        }
        public ResultVM List(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/MenuAuthorization/List", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        public ResultVM GetMenuAccessData(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/MenuAuthorization/GetMenuAccessData", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        public ResultVM RoleMenuInsert(RoleMenuVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/MenuAuthorization/RoleMenuInsert", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        public ResultVM GetUserMenuAccessData(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/MenuAuthorization/GetUserMenuAccessData", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        public ResultVM GetUserRoleWiseMenuAccessData(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/MenuAuthorization/GetUserRoleWiseMenuAccessData", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        public ResultVM UserMenuInsert(UserMenuVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/MenuAuthorization/UserMenuInsert", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        public ResultVM GetRoleData(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/MenuAuthorization/GetRoleData", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        public List<UserVM> GetUserGroupData()
        {
            try
            {
                CommonDataService kendoList = new CommonDataService();

                return kendoList.Select_Data_List<UserVM>("sp_GetUserGroupData", "get_List");
            }
            catch (Exception ex)
            {
                throw ex.InnerException;
            }
        }


    }
}

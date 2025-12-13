using Newtonsoft.Json;

using ShampanPOSUI.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Unity.Injection;
using System.Net;
using System.Threading.Tasks;
using DocumentFormat.OpenXml.EMMA;
using DocumentFormat.OpenXml.Office2010.Excel;
using ShampanPOS.Repo;
using ShampanPOS.Models;
using ShampanPOS.Models.KendoCommon;
using ShampanPOS.Models.Helper;

namespace ShampanPOSUI.Areas.SetUp.Controllers
{
    public class MenuAuthorizationController : Controller
    {
        // GET: SetUp/MenuAuthorization
        private readonly ApplicationDbContext _applicationDb;
        MenuAuthorizationRepo _repo = new MenuAuthorizationRepo();
        #region Role
        public ActionResult Role()
        {
            return View();
        }
        [HttpPost]

        public JsonResult RoleIndex(GridOptions options)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new MenuAuthorizationRepo();

            try
            {
                result = _repo.RoleIndex(options);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<UserRoleVM>>(result.DataVM.ToString());

                    return Json(new
                    {
                        Items = gridData.Items,
                        TotalCount = gridData.TotalCount
                    }, JsonRequestBehavior.AllowGet);
                }

                return Json(new { Error = true, Message = "No data found." }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult RoleCreate()
        {
            _repo = new MenuAuthorizationRepo();
            try
            {
                UserRoleVM vm = new UserRoleVM();
                vm.Operation = "add";
                return View("RoleCreateEdit", vm);
            }
            catch (Exception ex)
            {
                Session["result"] = "Fail" + "~" + ex.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                throw ex;
            }
        }

        [HttpPost]

        public ActionResult RoleCreateEdit(UserRoleVM model)
        {
            ResultModel<UserRoleVM> result = new ResultModel<UserRoleVM>();
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new MenuAuthorizationRepo();

            if (ModelState.IsValid)
            {
                try
                {
                    if (model.Operation.ToLower() == "add")
                    {
                        model.CreatedBy = Session["UserId"].ToString();
                        model.CreatedOn = DateTime.Now.ToString();
                        model.CreatedFrom = Ordinary.GetLocalIpAddress();

                        resultVM = _repo.Insert(model);

                        if (resultVM.Status == ResultStatus.Success.ToString())
                        {
                            model = JsonConvert.DeserializeObject<UserRoleVM>(resultVM.DataVM.ToString());
                            model.Operation = "add";
                            Session["result"] = resultVM.Status + "~" + resultVM.Message;
                            result = new ResultModel<UserRoleVM>()
                            {
                                Success = true,
                                Status = Status.Success,
                                Message = resultVM.Message,
                                Data = model
                            };
                            return Json(result);
                        }
                        else
                        {
                            Session["result"] = "Fail" + "~" + resultVM.Message;

                            result = new ResultModel<UserRoleVM>()
                            {
                                Status = Status.Fail,
                                Message = resultVM.Message,
                                Data = model
                            };
                            return Json(result);
                        }

                    }
                    else if (model.Operation.ToLower() == "update")
                    {
                        model.LastModifiedBy = Session["UserId"].ToString();
                        model.LastModifiedOn = DateTime.Now.ToString();
                        model.LastUpdateFrom = Ordinary.GetLocalIpAddress();

                        resultVM = _repo.Update(model);

                        if (resultVM.Status == ResultStatus.Success.ToString())
                        {
                            Session["result"] = resultVM.Status + "~" + resultVM.Message;
                            result = new ResultModel<UserRoleVM>()
                            {
                                Success = true,
                                Status = Status.Success,
                                Message = resultVM.Message,
                                Data = model
                            };
                            return Json(result);
                        }
                        else
                        {
                            Session["result"] = "Fail" + "~" + resultVM.Message;

                            result = new ResultModel<UserRoleVM>()
                            {
                                Status = Status.Fail,
                                Message = resultVM.Message,
                                Data = model
                            };
                            return Json(result);
                        }
                    }
                    else
                    {
                        return RedirectToAction("Index");
                    }
                }
                catch (Exception e)
                {
                    Session["result"] = "Fail" + "~" + e.Message;
                    Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                    return View("Create", model);
                }
            }
            return View("Create", model);

        }


        [HttpGet]
        public ActionResult RoleEdit(string id)
        {
            try
            {
                _repo = new MenuAuthorizationRepo();

                UserRoleVM vm = new UserRoleVM();
                CommonVM param = new CommonVM();
                param.Id = id;
                ResultVM result = _repo.List(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<UserRoleVM>>(result.DataVM.ToString()).FirstOrDefault();
                }
                else
                {
                    vm = null;
                }

                vm.Operation = "update";

                return View("RoleCreateEdit", vm);
            }
            catch (Exception e)
            {
                Session["result"] = "Fail" + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return RedirectToAction("Role");
            }
        }
        #endregion
        #region Role Menu
        public ActionResult RoleMenu()
        {
            return View();
        }
        [HttpPost]
        public JsonResult RoleMenuIndex(GridOptions options)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new MenuAuthorizationRepo();

            try
            {
                result = _repo.RoleIndex(options);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<RoleMenuVM>>(result.DataVM.ToString());

                    return Json(new
                    {
                        Items = gridData.Items,
                        TotalCount = gridData.TotalCount
                    }, JsonRequestBehavior.AllowGet);
                }

                return Json(new { Error = true, Message = "No data found." }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult Create()
        {
            try
            {
                RoleMenuVM vm = new RoleMenuVM();
                vm.roleMenuList = new List<RoleMenuVM>();
                vm.Operation = "add";
                return View("RoleMenuCreateEdit", vm);
            }
            catch (Exception ex)
            {
                Session["result"] = "Fail" + "~" + ex.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                throw ex;
            }
        }
        [HttpGet]
        public ActionResult RoleMenuEdit(string id, string roleName)
        {
            try
            {
                _repo = new MenuAuthorizationRepo();

                RoleMenuVM vm = new RoleMenuVM();
                UserRoleVM vms = new UserRoleVM();

                CommonVM param = new CommonVM();
                param.Id = id;
                vm.RoleName = roleName;

                ResultVM result = _repo.GetMenuAccessData(param);

                vm.roleMenuList = new List<RoleMenuVM>();
                List<UserRoleVM> UserRole = new List<UserRoleVM>();
                vm.RoleId = id.ToString();
                vm.UserGroupId = "0";

                vm.Type = "User Role";
                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm.roleMenuList = JsonConvert.DeserializeObject<List<RoleMenuVM>>(result.DataVM.ToString());
                }
                else
                {
                    vm = null;
                }



                vm.Operation = "update";

                return View("RoleMenuCreateEdit", vm);
            }
            catch (Exception e)
            {
                Session["result"] = "Fail" + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return RedirectToAction("RoleMenu");
            }
        }
        public ActionResult RoleMenuCreateEdit(RoleMenuVM model)
        {
            ResultModel<RoleMenuVM> result = new ResultModel<RoleMenuVM>();
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new MenuAuthorizationRepo();
            try
            {
                model.CreatedBy = Session["UserId"].ToString();
                model.CreatedOn = DateTime.Now.ToString();
                model.CreatedFrom = Ordinary.GetLocalIpAddress();
                resultVM = _repo.RoleMenuInsert(model);

                if (resultVM.Status == ResultStatus.Success.ToString())
                {
                    model = JsonConvert.DeserializeObject<RoleMenuVM>(resultVM.DataVM.ToString());
                    model.Operation = "add";
                    Session["result"] = resultVM.Status + "~" + resultVM.Message;
                    result = new ResultModel<RoleMenuVM>()
                    {
                        Success = true,
                        Status = Status.Success,
                        Message = resultVM.Message,
                        Data = model
                    };
                    return Json(result);
                }
                else
                {
                    Session["result"] = "Fail" + "~" + resultVM.Message;

                    result = new ResultModel<RoleMenuVM>()
                    {
                        Status = Status.Fail,
                        Message = resultVM.Message,
                        Data = model
                    };
                    return Json(result);
                }
            }
            catch (Exception e)
            {
                Session["result"] = "Fail" + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return View("Create", model);
            }
        }
        #endregion
        #region User Menu

        public ActionResult UserMenu()
        {
            try
            {
                return View();
            }
            catch (Exception ex)
            {
                Session["result"] = "Fail" + "~" + ex.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                throw ex;
            }
        }
        [HttpPost]
        public JsonResult UserMenuIndex(GridOptions options)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new MenuAuthorizationRepo();

            try
            {
                result = _repo.UserMenuIndex(options);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<UserMenuVM>>(result.DataVM.ToString());

                    return Json(new
                    {
                        Items = gridData.Items,
                        TotalCount = gridData.TotalCount
                    }, JsonRequestBehavior.AllowGet);
                }

                return Json(new { Error = true, Message = "No data found." }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult UserMenuCreate()
        {
            _repo = new MenuAuthorizationRepo();
            try
            {
                UserMenuVM vm = new UserMenuVM();
                vm.userMenuList = new List<UserMenuVM>();
                vm.Operation = "add";
                return View("UserMenuCreateEdit", vm);
            }
            catch (Exception ex)
            {
                Session["result"] = "Fail" + "~" + ex.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                throw ex;
            }
        }
        [HttpGet]
        public ActionResult UserMenuEdit(string roleId, string UserId)
        {
            try
            {
                _repo = new MenuAuthorizationRepo();

                UserMenuVM vm = new UserMenuVM();
                UserRoleVM vms = new UserRoleVM();

                CommonVM param = new CommonVM();
                param.Id = roleId;
                
                vm.UserName = UserId;

                ResultVM result = _repo.GetUserMenuAccessData(param);

                vm.userMenuList = new List<UserMenuVM>();
                List<UserMenuVM> UserRole = new List<UserMenuVM>();
                vm.RoleId = roleId.ToString();
                //vm.UserGroupId = "0";

                //vm.Type = "User Role";
                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm.userMenuList = JsonConvert.DeserializeObject<List<UserMenuVM>>(result.DataVM.ToString());
                }
                else
                {
                    vm = null;
                }



                vm.Operation = "update";

                return View("UserMenuCreateEdit", vm);
            }
            catch (Exception e)
            {
                Session["result"] = "Fail" + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return RedirectToAction("UserMenu");
            }
        }

        public ActionResult GetAssignedData(string roleId, string userId)
        {
            _repo = new MenuAuthorizationRepo();
            try
            {
                UserMenuVM vm = new UserMenuVM();
                CommonVM param = new CommonVM();
                if (!string.IsNullOrEmpty(roleId) && !string.IsNullOrEmpty(userId))
                {

                    ResultVM result = _repo.GetUserMenuAccessData(param);
                    vm.userMenuList = new List<UserMenuVM>();
                    vm.RoleId = roleId.ToString();
                    List<UserMenuVM> UserRole = new List<UserMenuVM>();
                    // vm.RoleId = Convert.ToInt32(roleId);
                    vm.UserId = userId;
                }
                else
                {
                    vm.userMenuList = new List<UserMenuVM>();
                }

                return Json(vm.userMenuList);
            }
            catch (Exception ex)
            {
                Session["result"] = "Fail" + "~" + ex.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                throw ex;
            }
        }
        public ActionResult GetUserRoleWiseData(string roleId)
        {
            _repo = new MenuAuthorizationRepo();
            try
            {
                UserMenuVM vm = new UserMenuVM();
                CommonVM param = new CommonVM();
                if (!string.IsNullOrEmpty(roleId))
                {
                    param.Id = roleId;

                    ResultVM result = _repo.GetUserRoleWiseMenuAccessData(param);
                    vm.userMenuList = new List<UserMenuVM>();
                    vm.RoleId = roleId.ToString();
                    List<UserMenuVM> UserRole = new List<UserMenuVM>();

                    if (result.Status == "Success" && result.DataVM != null)
                    {
                        vm.userMenuList = JsonConvert.DeserializeObject<List<UserMenuVM>>(result.DataVM.ToString());
                    }
                    else
                    {
                        vm = null;
                    }
                    // vm.RoleId = Convert.ToInt32(roleId);
                    // vm.UserId = userId;
                }
                else
                {
                    vm.userMenuList = new List<UserMenuVM>();
                }

                return Json(vm.userMenuList);
            }
            catch (Exception ex)
            {
                Session["result"] = "Fail" + "~" + ex.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                throw ex;
            }
        }
        public ActionResult UserMenuCreateEdit(UserMenuVM model)
        {
            ResultModel<UserMenuVM> result = new ResultModel<UserMenuVM>();
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new MenuAuthorizationRepo();
            try
            {
                model.CreatedBy = Session["UserId"].ToString();
                model.CreatedOn = DateTime.Now.ToString();
                model.CreatedFrom = Ordinary.GetLocalIpAddress();
               
                resultVM = _repo.UserMenuInsert(model);

                if (resultVM.Status == ResultStatus.Success.ToString())
                {
                    model = JsonConvert.DeserializeObject<UserMenuVM>(resultVM.DataVM.ToString());
                    model.Operation = "add";
                    Session["result"] = resultVM.Status + "~" + resultVM.Message;
                    result = new ResultModel<UserMenuVM>()
                    {
                        Success = true,
                        Status = Status.Success,
                        Message = resultVM.Message,
                        Data = model
                    };
                    return Json(result);
                }
                else
                {
                    Session["result"] = "Fail" + "~" + resultVM.Message;

                    result = new ResultModel<UserMenuVM>()
                    {
                        Status = Status.Fail,
                        Message = resultVM.Message,
                        Data = model
                    };
                    return Json(result);
                }
            }
            catch (Exception e)
            {
                Session["result"] = "Fail" + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return View("Create", model);
            }
        }

        #endregion

        #region Common

        [HttpGet]
        public ActionResult GetRoleData(string value)
        {
           
            _repo = new MenuAuthorizationRepo();
            try
            {
                List<UserVM> lst = new List<UserVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                ResultVM result = _repo.GetRoleData(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<UserVM>>(result.DataVM.ToString());
                }
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpGet]
        public ActionResult GetUserGroupData()
        {
            _repo = new MenuAuthorizationRepo();
            try
            {
                var result = _repo.GetUserGroupData();
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        #endregion

    }
}
using Newtonsoft.Json;
using ShampanPOS.Models;
using ShampanPOS.Repo;
using ShampanPOSUI.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ShampanPOSUI.Areas.SetUp.Controllers
{
    public class SignUpController : Controller
    {
        private readonly ApplicationDbContext _applicationDb;
        UserProfileRepo _repo = new UserProfileRepo();
        UserInfoRepo _userrepo = new UserInfoRepo();
        // GET: SetUp/SignUp
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult SignUpCreate()
        {
            UserProfileVM vm = new UserProfileVM();
            vm.Operation = "add";
            vm.Mode = "new";

            return View("SignUpCreate", vm);
        }

        [HttpPost]
        public ActionResult SignUpCreateEdit(UserProfileVM model)
        {
            _repo = new UserProfileRepo();
            _userrepo = new UserInfoRepo();
            ResultModel<UserProfileVM> result = new ResultModel<UserProfileVM>();
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };


            try
            {
                // Case 1: New Entry (Add)
                if (model.Operation.ToLower() == "add")
                {
                    resultVM = _repo.Insert(model);

                    if (resultVM.Status == ResultStatus.Success.ToString())
                    {
                        var user = JsonConvert.DeserializeObject<UserProfileVM>(resultVM.DataVM.ToString());

                        // 2️⃣ Prepare UserInfoVM
                        UserInfoVM userInfo = new UserInfoVM();

                        userInfo.UserId = user.Id.ToString();
                        userInfo.UserName = user.UserName;
                        userInfo.FullName = user.FullName;
                        userInfo.PhoneNumber = user.PhoneNumber;
                        userInfo.Email = user.Email;
                        userInfo.CreatedBy = user.UserName;
                        userInfo.CreatedAt = DateTime.Now;

                        // 3️⃣ Insert UserInformations
                        _userrepo.Insert(userInfo);

                        result = new ResultModel<UserProfileVM>()
                        {
                            Success = true,
                            Status = Status.Success,
                            Message = "User Created Successfully",
                            Data = user
                        };

                        return Json(result);
                    }
                    else
                    {
                        Session["result"] = "Fail" + "~" + resultVM.Message;
                        result = new ResultModel<UserProfileVM>()
                        {
                            Status = Status.Fail,
                            Message = resultVM.Message,
                            Data = model
                        };
                        return Json(result);
                    }
                }
                // Case 2: Password Update
                else if (model.Operation.ToLower() == "update" && model.Mode.ToLower() == "passwordchange")
                {
                    resultVM = _repo.PasswordUpdate(model);

                    if (resultVM.Status == ResultStatus.Success.ToString())
                    {
                        Session["result"] = resultVM.Status + "~" + resultVM.Message;
                        result = new ResultModel<UserProfileVM>()
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
                        result = new ResultModel<UserProfileVM>()
                        {
                            Status = Status.Fail,
                            Message = resultVM.Message,
                            Data = model
                        };
                        return Json(result);
                    }
                }
                // Case 3: Profile Info Update
                else if (model.Operation.ToLower() == "update" && model.Mode.ToLower() == "profileupdate")
                {
                    resultVM = _repo.Update(model);

                    if (resultVM.Status == ResultStatus.Success.ToString())
                    {
                        Session["result"] = resultVM.Status + "~" + resultVM.Message;
                        result = new ResultModel<UserProfileVM>()
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
                        result = new ResultModel<UserProfileVM>()
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



        //[HttpPost]
        //public ActionResult UserInfoCreateEdit(UserInfoVM model)
        //{
        //    _userrepo = new UserInfoRepo();
        //    ResultModel<UserInfoVM> result = new ResultModel<UserInfoVM>();
        //    ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };


        //    try
        //    {
        //        // Case 1: New Entry (Add)
        //        if (model.Operation.ToLower() == "add")
        //        {
        //            resultVM = _userrepo.Insert(model);

        //            if (resultVM.Status == ResultStatus.Success.ToString())
        //            {
        //                model = JsonConvert.DeserializeObject<UserInfoVM>(resultVM.DataVM.ToString());
        //                model.Operation = "add";
        //                Session["result"] = resultVM.Status + "~" + resultVM.Message;
        //                result = new ResultModel<UserInfoVM>()
        //                {
        //                    Success = true,
        //                    Status = Status.Success,
        //                    Message = resultVM.Message,
        //                    Data = model
        //                };
        //                return Json(result);
        //            }
        //            else
        //            {
        //                Session["result"] = "Fail" + "~" + resultVM.Message;
        //                result = new ResultModel<UserInfoVM>()
        //                {
        //                    Status = Status.Fail,
        //                    Message = resultVM.Message,
        //                    Data = model
        //                };
        //                return Json(result);
        //            }
        //        }
        //        // Case 2: Password Update
        //        else if (model.Operation.ToLower() == "update" && model.Mode.ToLower() == "passwordchange")
        //        {
        //            resultVM = _userrepo.PasswordUpdate(model);

        //            if (resultVM.Status == ResultStatus.Success.ToString())
        //            {
        //                Session["result"] = resultVM.Status + "~" + resultVM.Message;
        //                result = new ResultModel<UserInfoVM>()
        //                {
        //                    Success = true,
        //                    Status = Status.Success,
        //                    Message = resultVM.Message,
        //                    Data = model
        //                };
        //                return Json(result);
        //            }
        //            else
        //            {
        //                Session["result"] = "Fail" + "~" + resultVM.Message;
        //                result = new ResultModel<UserInfoVM>()
        //                {
        //                    Status = Status.Fail,
        //                    Message = resultVM.Message,
        //                    Data = model
        //                };
        //                return Json(result);
        //            }
        //        }
        //        // Case 3: Profile Info Update
        //        else if (model.Operation.ToLower() == "update" && model.Mode.ToLower() == "profileupdate")
        //        {
        //            resultVM = _userrepo.Update(model);

        //            if (resultVM.Status == ResultStatus.Success.ToString())
        //            {
        //                Session["result"] = resultVM.Status + "~" + resultVM.Message;
        //                result = new ResultModel<UserInfoVM>()
        //                {
        //                    Success = true,
        //                    Status = Status.Success,
        //                    Message = resultVM.Message,
        //                    Data = model
        //                };
        //                return Json(result);
        //            }
        //            else
        //            {
        //                Session["result"] = "Fail" + "~" + resultVM.Message;
        //                result = new ResultModel<UserInfoVM>()
        //                {
        //                    Status = Status.Fail,
        //                    Message = resultVM.Message,
        //                    Data = model
        //                };
        //                return Json(result);
        //            }
        //        }
        //        else
        //        {
        //            return RedirectToAction("Index");
        //        }
        //    }
        //    catch (Exception e)
        //    {
        //        Session["result"] = "Fail" + "~" + e.Message;
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return View("Create", model);
        //    }
        //}



    }
}
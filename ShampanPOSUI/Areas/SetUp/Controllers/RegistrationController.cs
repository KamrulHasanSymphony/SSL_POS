using Newtonsoft.Json;
using ShampanPOS.Models;
using ShampanPOS.Models.Helper;
using ShampanPOS.Repo;
using ShampanPOSUI.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ShampanPOSUI.Areas.SetUp.Controllers
{
    public class RegistrationController : Controller
    {
        private readonly ApplicationDbContext _applicationDb;
        RegistrationRepo _repo = new RegistrationRepo();
        UserProfileRepo _userProfilerepo = new UserProfileRepo();
        CommonRepo _commonRepo = new CommonRepo();

        // GET: SetUp/Registration
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult RegistrationCreate()
        {
            RegistrationVM vm = new RegistrationVM();
            vm.Operation = "add";
            vm.Mode = "new";

            return View("RegistrationCreate", vm);
        }

        //[HttpPost]
        //public ActionResult RegistrationCreateEdit(RegistrationVM model)
        //{
        //    ResultModel<RegistrationVM> result = new ResultModel<RegistrationVM>();
        //    ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
        //    _repo = new RegistrationRepo();

        //    try
        //    {
        //        var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
        //        model.BranchId = Convert.ToInt32(currentBranchId);
        //        //model.CompanyId = Convert.ToInt32(Session["CompanyId"] != null ? Session["CompanyId"].ToString() : "");
        //        model.CompanyId = Session["CompanyId"] != null
        //            ? Convert.ToInt32(Session["CompanyId"])
        //            : 0;

        //        if (model.Operation.ToLower() == "add")
        //        {
        //            //model.CreatedBy = Session["UserId"].ToString();
        //            // model.UserId = Session["UserHashId"]?.ToString();

        //            model.CreatedOn = DateTime.Now.ToString();
        //            model.CreatedFrom = Ordinary.GetLocalIpAddress();

        //            resultVM = _repo.Insert(model);

        //            if (resultVM.Status == ResultStatus.Success.ToString())
        //            {
        //                if (resultVM.DataVM != null)
        //                {
        //                    model = JsonConvert.DeserializeObject<RegistrationVM>(
        //                        resultVM.DataVM.ToString());
        //                }

        //                model.Operation = "add";

        //                Session["result"] = resultVM.Status + "~" + resultVM.Message;

        //                result = new ResultModel<RegistrationVM>()
        //                {
        //                    Success = true,
        //                    Status = Status.Success,
        //                    Message = resultVM.Message,
        //                    Data = model
        //                };
        //            }

        //            else
        //            {
        //                Session["result"] = "Fail~" + resultVM.Message;

        //                result = new ResultModel<RegistrationVM>()
        //                {
        //                    Status = Status.Fail,
        //                    Message = resultVM.Message,
        //                    Data = model
        //                };
        //            }
        //        }
        //        else if (model.Operation.ToLower() == "update")
        //        {

        //            //model.LastModifiedBy = Session["UserId"].ToString();
        //            model.LastModifiedOn = DateTime.Now.ToString();
        //            model.LastUpdateFrom = Ordinary.GetLocalIpAddress();

        //            resultVM = _repo.Update(model);

        //            if (resultVM.Status == ResultStatus.Success.ToString())
        //            {
        //                Session["result"] = resultVM.Status + "~" + resultVM.Message;

        //                result = new ResultModel<RegistrationVM>()
        //                {
        //                    Success = true,
        //                    Status = Status.Success,
        //                    Message = resultVM.Message,
        //                    Data = model
        //                };
        //            }
        //            else
        //            {
        //                Session["result"] = "Fail~" + resultVM.Message;

        //                result = new ResultModel<RegistrationVM>()
        //                {
        //                    Status = Status.Fail,
        //                    Message = resultVM.Message,
        //                    Data = model
        //                };
        //            }
        //        }
        //        else
        //        {
        //            return RedirectToAction("Index");
        //        }
        //    }
        //    catch (Exception e)
        //    {
        //        Session["result"] = "Fail~" + e.Message;
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return View("Create", model);
        //    }

        //    return Json(result);
        //}



        [HttpPost]
        public ActionResult RegistrationCreateEdit(UserProfileVM model)
        {
            ResultModel<UserProfileVM> result = new ResultModel<UserProfileVM>();
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _userProfilerepo = new UserProfileRepo();

            try
            {
                var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
                model.BranchId = Convert.ToInt32(currentBranchId);
                //model.CompanyId = Convert.ToInt32(Session["CompanyId"] != null ? Session["CompanyId"].ToString() : "");
                model.CompanyId = Session["CompanyId"] != null
                    ? Convert.ToInt32(Session["CompanyId"])
                    : 0;

                if (model.Operation.ToLower() == "add")
                {
                    //model.CreatedBy = Session["UserId"].ToString();
                     //model.UserId = Session["UserHashId"]?.ToString();
                    model.UserId = Session["UserId"]?.ToString();

                    model.CreatedOn = DateTime.Now.ToString();
                    model.CreatedFrom = Ordinary.GetLocalIpAddress();
                    model.UserName = model.EmailAsLoginId;
                    model.Email = model.EmailAsLoginId;
                    resultVM = _repo.Insert(model);

                    if (resultVM.Status == ResultStatus.Success.ToString())
                    {
                        if (resultVM.DataVM != null)
                        {
                            model = JsonConvert.DeserializeObject<UserProfileVM>(
                                resultVM.DataVM.ToString());
                        }

                        model.Operation = "add";

                        Session["result"] = resultVM.Status + "~" + resultVM.Message;

                        result = new ResultModel<UserProfileVM>()
                        {
                            Success = true,
                            Status = Status.Success,
                            Message = resultVM.Message,
                            Data = model
                        };
                    }

                    else
                    {
                        Session["result"] = "Fail~" + resultVM.Message;

                        result = new ResultModel<UserProfileVM>()
                        {
                            Status = Status.Fail,
                            Message = resultVM.Message,
                            Data = model
                        };
                    }
                }
                else if (model.Operation.ToLower() == "update")
                {

                    //model.LastModifiedBy = Session["UserId"].ToString();
                    model.LastModifiedOn = DateTime.Now.ToString();
                    model.LastUpdateFrom = Ordinary.GetLocalIpAddress();

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
                    }
                    else
                    {
                        Session["result"] = "Fail~" + resultVM.Message;

                        result = new ResultModel<UserProfileVM>()
                        {
                            Status = Status.Fail,
                            Message = resultVM.Message,
                            Data = model
                        };
                    }
                }
                else
                {
                    return RedirectToAction("Index");
                }
            }
            catch (Exception e)
            {
                Session["result"] = "Fail~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return View("Create", model);
            }

            return Json(result);
        }






    }
}
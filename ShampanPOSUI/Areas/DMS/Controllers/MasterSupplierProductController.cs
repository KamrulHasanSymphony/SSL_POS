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

namespace ShampanPOSUI.Areas.DMS.Controllers
{
    public class MasterSupplierProductController : Controller
    {

        private readonly ApplicationDbContext _applicationDb;
        MasterSupplierRepo _repo = new MasterSupplierRepo();
        CommonRepo _commonRepo = new CommonRepo();

        // GET: DMS/MasterSupplierProduct
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Create()
        {
            MasterSupplierVM vm = new MasterSupplierVM();
            var companyId = Session["CompanyId"];
            //var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
            //vm.BranchId = Convert.ToInt32(currentBranchId);
            vm.CompanyId = Convert.ToInt32(companyId);
            vm.Operation = "add";
            vm.IsActive = true;

            return View("Create", vm);
        }


        [HttpPost]
        public ActionResult CreateEdit(SupplierVM model)
        {
            ResultModel<SupplierVM> result;
            ResultVM resultVM;

            _repo = new MasterSupplierRepo();

            try
            {
                model.CompanyId = Convert.ToInt32(Session["CompanyId"] != null ? Session["CompanyId"].ToString() : "");

                if (model.Operation.ToLower() == "add")
                {

                    model.CreatedBy = Session["UserId"]?.ToString();
                    model.UserId = Session["UserHashId"]?.ToString();
                    model.CreatedOn = DateTime.Now.ToString();
                    model.CreatedFrom = Ordinary.GetLocalIpAddress();

                    //var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
                    //model.BranchId = Convert.ToInt32(currentBranchId);
                    var companyId = Session["CompanyId"] != null ? Session["CompanyId"].ToString() : "0";
                    model.CompanyId = Convert.ToInt32(companyId);


                    resultVM = _repo.InsertSupplierFromMasterSupplier(model);

                    if (resultVM.Status == ResultStatus.Success.ToString())
                    {
                        model.Operation = "add";

                        Session["result"] = resultVM.Status + "~" + resultVM.Message;

                        result = new ResultModel<SupplierVM>()
                        {
                            Success = true,
                            Status = Status.Success,
                            Message = resultVM.Message,
                            Data = model   // 🔹 NO DESERIALIZE
                        };

                        return Json(result);
                    }
                    else
                    {
                        Session["result"] = "Fail~" + resultVM.Message;

                        return Json(new ResultModel<SupplierVM>()
                        {
                            Success = false,
                            Status = Status.Fail,
                            Message = resultVM.Message,
                            Data = model
                        });
                    }
                }
                else if (model.Operation.ToLower() == "update")
                {
                    model.LastModifiedBy = Session["UserId"]?.ToString();
                    model.LastModifiedOn = Ordinary.GetLocalIpAddress();

                    resultVM = _repo.MasterUpdate(model);

                    if (resultVM.Status == ResultStatus.Success.ToString())
                    {
                        Session["result"] = resultVM.Status + "~" + resultVM.Message;

                        return Json(new ResultModel<SupplierVM>()
                        {
                            Success = true,
                            Status = Status.Success,
                            Message = resultVM.Message,
                            Data = model
                        });
                    }
                    else
                    {
                        Session["result"] = "Fail~" + resultVM.Message;

                        return Json(new ResultModel<SupplierVM>()
                        {
                            Success = false,
                            Status = Status.Fail,
                            Message = resultVM.Message,
                            Data = model
                        });
                    }
                }

                return RedirectToAction("Index");
            }
            catch (Exception e)
            {
                Session["result"] = "Fail~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return View("Create", model);
            }
        }

        //[HttpPost]
        //public ActionResult CreateEdit(SupplierVM model)
        //{
        //    ResultModel<SupplierVM> result;
        //    ResultVM resultVM;

        //    _repo = new MasterSupplierRepo();

        //    try
        //    {
        //        int companyId = 0;
        //        int userId = 0;

        //        int.TryParse(Session["CompanyId"]?.ToString(), out companyId);
        //        int.TryParse(Session["UserId"]?.ToString(), out userId);

        //        model.CompanyId = companyId;

        //        if (model.Operation.ToLower() == "add")
        //        {
        //            model.CreatedBy = userId.ToString();
        //            model.UserId = userId;
        //            model.CreatedOn = DateTime.Now.ToString();
        //            model.CreatedFrom = Ordinary.GetLocalIpAddress();

        //            model.CompanyId = companyId;

        //            resultVM = _repo.InsertSupplierFromMasterSupplier(model);

        //            if (resultVM.Status == ResultStatus.Success.ToString())
        //            {
        //                model.Operation = "add";
        //                Session["result"] = resultVM.Status + "~" + resultVM.Message;

        //                result = new ResultModel<SupplierVM>()
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
        //                Session["result"] = "Fail~" + resultVM.Message;

        //                return Json(new ResultModel<SupplierVM>()
        //                {
        //                    Success = false,
        //                    Status = Status.Fail,
        //                    Message = resultVM.Message,
        //                    Data = model
        //                });
        //            }
        //        }
        //        else if (model.Operation.ToLower() == "update")
        //        {
        //            model.LastModifiedBy = userId.ToString();
        //            model.LastModifiedOn = Ordinary.GetLocalIpAddress();

        //            resultVM = _repo.MasterUpdate(model);

        //            if (resultVM.Status == ResultStatus.Success.ToString())
        //            {
        //                Session["result"] = resultVM.Status + "~" + resultVM.Message;

        //                return Json(new ResultModel<SupplierVM>()
        //                {
        //                    Success = true,
        //                    Status = Status.Success,
        //                    Message = resultVM.Message,
        //                    Data = model
        //                });
        //            }
        //            else
        //            {
        //                Session["result"] = "Fail~" + resultVM.Message;

        //                return Json(new ResultModel<SupplierVM>()
        //                {
        //                    Success = false,
        //                    Status = Status.Fail,
        //                    Message = resultVM.Message,
        //                    Data = model
        //                });
        //            }
        //        }

        //        return RedirectToAction("Index");
        //    }
        //    catch (Exception e)
        //    {
        //        Session["result"] = "Fail~" + e.Message;
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return View("Create", model);
        //    }
        //}



    }
}
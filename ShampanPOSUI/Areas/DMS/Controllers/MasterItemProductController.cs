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
    [Authorize]
    [RouteArea("DMS")]
    public class MasterItemProductController : Controller
    {

        private readonly ApplicationDbContext _applicationDb;
        MasterItemRepo _repo = new MasterItemRepo();
        CommonRepo _commonRepo = new CommonRepo();

        // GET: DMS/MasterItemProduct
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Create()
        {
            MasterItemVM vm = new MasterItemVM();
            vm.Operation = "add";
            var companyId = Session["CompanyId"];
            vm.CompanyId = Convert.ToInt32(companyId);

            vm.IsActive = true;

            return View("Create", vm);

        }

        //public ActionResult Create(int? groupId = null)
        //{
        //    MasterItemVM vm = new MasterItemVM();
        //    vm.Operation = "add";
        //    vm.CompanyId = Convert.ToInt32(Session["CompanyId"]);
        //    vm.IsActive = true;

        //    if (groupId.HasValue)
        //        vm.MasterItemGroupId = groupId.Value;

        //    ViewBag.Status = TempData["Status"];
        //    ViewBag.Message = TempData["Message"];

        //    return View(vm);
        //}


        [HttpPost]
        public ActionResult CreateEdit(ProductVM model)
        {
            ResultModel<ProductVM> result;
            ResultVM resultVM;

            _repo = new MasterItemRepo();

            try
            {
                model.CompanyId = Convert.ToInt32(Session["CompanyId"] != null ? Session["CompanyId"].ToString() : "");

                if (model.Operation.ToLower() == "add")
                {
                    model.CreatedBy = Session["UserId"]?.ToString();
                    model.UserId = Session["UserHashId"]?.ToString();

                    model.CreatedOn = DateTime.Now.ToString();
                    model.CreatedFrom = Ordinary.GetLocalIpAddress();

                    resultVM = _repo.InsertProductFromMasterItem(model);


                    //if (resultVM.Status == ResultStatus.Success.ToString())
                    //{
                    //    TempData["Status"] = resultVM.Status;
                    //    TempData["Message"] = resultVM.Message;

                    //    return Json(new
                    //    {
                    //        RedirectUrl = Url.Action(
                    //            "Create",
                    //            "MasterItemProduct",
                    //            new
                    //            {
                    //                area = "DMS",
                    //                groupId = model.MasterItemGroupId
                    //            })
                    //    });
                    //}


                    if (resultVM.Status == ResultStatus.Success.ToString())
                    {
                        model.Operation = "add";

                        Session["result"] = resultVM.Status + "~" + resultVM.Message;

                        result = new ResultModel<ProductVM>()
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

                        return Json(new ResultModel<ProductVM>()
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

                        return Json(new ResultModel<ProductVM>()
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

                        return Json(new ResultModel<ProductVM>()
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

    }
}
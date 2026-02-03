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
                if (model.Operation.ToLower() == "add")
                {
                    model.CreatedBy = Session["UserId"]?.ToString();
                    model.CreatedOn = DateTime.Now.ToString();
                    model.CreatedFrom = Ordinary.GetLocalIpAddress();

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



    }
}
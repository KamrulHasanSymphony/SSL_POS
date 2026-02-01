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
            vm.IsActive = true;

            return View("Create", vm);
        }


        [HttpPost]
        public ActionResult CreateEdit(ProductVM model)
        {
            ResultModel<ProductVM> result = new ResultModel<ProductVM>();
            ResultVM resultVM = new ResultVM { Status ="Success", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new MasterItemRepo();

    
            try
            {
                if (model.Operation.ToLower() == "add")
                {
                    model.CreatedBy = Session["UserId"].ToString();
                    model.CreatedOn = DateTime.Now.ToString();
                    model.CreatedFrom = Ordinary.GetLocalIpAddress();


                    resultVM = _repo.InsertProductFromMasterItem(model);

                    if (resultVM.Status == ResultStatus.Success.ToString())
                    {
                        model = JsonConvert.DeserializeObject<ProductVM>(resultVM.DataVM.ToString());
                        model.Operation = "add";
                        Session["result"] = resultVM.Status + "~" + resultVM.Message;
                        result = new ResultModel<ProductVM>()
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

                        result = new ResultModel<ProductVM>()
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
                    model.LastModifiedOn = Ordinary.GetLocalIpAddress();

                    resultVM = _repo.MasterUpdate(model);

                    if (resultVM.Status == ResultStatus.Success.ToString())
                    {
                        Session["result"] = resultVM.Status + "~" + resultVM.Message;
                        result = new ResultModel<ProductVM>()
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

                        result = new ResultModel<ProductVM>()
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
        //public ActionResult CreateEdit(MasterItemVM model)
        //{
        //    try
        //    {
        //        if (model.MasterItemGroupId <= 0)
        //        {
        //            return Json(new { Status = 400, Message = "Master Item Group is required" });
        //        }

        //        if (string.IsNullOrEmpty(model.SelectedMasterItemsJson))
        //        {
        //            return Json(new { Status = 400, Message = "No item selected" });
        //        }

        //        // ✅ only service call
        //        ResultVM result = _repo.InsertProductFromMasterItem(model);

        //        return Json(new
        //        {
        //            Status = result.Status == "Success" ? 200 : 400,
        //            Message = result.Message
        //        });
        //    }
        //    catch (Exception ex)
        //    {
        //        return Json(new
        //        {
        //            Status = 500,
        //            Message = "Query Exception!",
        //            Error = ex.Message
        //        });
        //    }
        //}




    }
}
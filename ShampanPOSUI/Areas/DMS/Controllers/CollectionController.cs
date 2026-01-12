using Newtonsoft.Json;
using ShampanPOS.Models;
using ShampanPOS.Models.Helper;
using ShampanPOS.Models.KendoCommon;
using ShampanPOS.Repo;
using ShampanPOSUI.Persistence;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace ShampanPOSUI.Areas.DMS.Controllers
{
    [Authorize]
    [RouteArea("DMS")]
    public class CollectionController : Controller
    {

        private readonly ApplicationDbContext _applicationDb;
        CollectionRepo _repo = new CollectionRepo();
        CommonRepo _commonRepo = new CommonRepo();


        // GET: DMS/Collection
        public ActionResult Index()
        {
            CollectionVM vm = new CollectionVM();
            var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
            DateTime currentDate = DateTime.Now;
            DateTime firstDayOfMonth = new DateTime(currentDate.Year, currentDate.Month, 1);
            DateTime lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);
            firstDayOfMonth = firstDayOfMonth.AddMonths(-5);

            return View(vm);
        }

        public ActionResult DetailsIndex()
        {
            CollectionDetailVM vm = new CollectionDetailVM();

            var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
            //vm.Branchs = Convert.ToInt32(currentBranchId);
            DateTime currentDate = DateTime.Now;
            DateTime firstDayOfMonth = new DateTime(currentDate.Year, currentDate.Month, 1);
            DateTime lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);
            firstDayOfMonth = firstDayOfMonth.AddMonths(-5);


            #region  UserInfo

            #endregion
            return View(vm);
        }

        public ActionResult Create()
        {
            CollectionVM vm = new CollectionVM();
            vm.Operation = "add";
            //vm.TransactionType = "Purchase";
            var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
            //vm.BranchId = Convert.ToInt32(currentBranchId);
            //var currencyId = Session["CurrencyId"] != null ? Session["CurrencyId"].ToString() : "1";
            //vm.CurrencyId = Convert.ToInt32(currencyId);



            return View("Create", vm);
        }

        [HttpPost]
        public ActionResult CreateEdit(CollectionVM model)
        {
            ResultModel<CollectionVM> result = new ResultModel<CollectionVM>();
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new CollectionRepo();


            try
            {

                var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
                //model.BranchId = Convert.ToInt32(currentBranchId);
                //model.CompanyId = Convert.ToInt32(Session["CompanyId"] != null ? Session["CompanyId"].ToString() : "");


                if (model.Operation.ToLower() == "add")
                {
                    model.CreatedBy = Session["UserId"].ToString();
                    model.CreatedOn = DateTime.Now.ToString();
                    model.CreatedFrom = Ordinary.GetLocalIpAddress();

                    resultVM = _repo.Insert(model);

                    if (resultVM.Status == ResultStatus.Success.ToString())
                    {
                        model = JsonConvert.DeserializeObject<CollectionVM>(resultVM.DataVM.ToString());
                        model.Operation = "add";
                        Session["result"] = resultVM.Status + "~" + resultVM.Message;
                        result = new ResultModel<CollectionVM>()
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

                        result = new ResultModel<CollectionVM>()
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
                        result = new ResultModel<CollectionVM>()
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

                        result = new ResultModel<CollectionVM>()
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

        [HttpGet]
        public ActionResult Edit(string id)
        {
            try
            {
                _repo = new CollectionRepo();

                CollectionVM vm = new CollectionVM();
                CommonVM param = new CommonVM();
                param.Id = id;
                ResultVM result = _repo.List(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<CollectionVM>>(result.DataVM.ToString()).FirstOrDefault();
                }
                else
                {
                    vm = null;
                }

                vm.Operation = "update";

                //#region DecimalPlace
                //CommonVM commonVM = new CommonVM();
                //commonVM.Group = "SaleDecimalPlace";
                //commonVM.Name = "SaleDecimalPlace";
                //var settingsValue = _commonRepo.GetSettingsValue(commonVM);

                //if (settingsValue.Status == "Success" && settingsValue.DataVM != null)
                //{
                //    var data = JsonConvert.DeserializeObject<List<CommonVM>>(settingsValue.DataVM.ToString()).FirstOrDefault();

                //    vm.DecimalPlace = string.IsNullOrEmpty(data.SettingValue) ? 2 : Convert.ToInt32(data.SettingValue);
                //}

                //#endregion

                return View("Create", vm);
            }
            catch (Exception e)
            {
                Session["result"] = "Fail" + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return RedirectToAction("Index");
            }
        }

        //[HttpPost]
        //public ActionResult GetFromPurchase(CommonVM vm)
        //{
        //    try
        //    {
        //        CollectionRepo _repoo = new CollectionRepo();

        //        CollectionVM purchase = new CollectionVM();
        //        ResultVM result = _repoo.PurchaseListForPayment(vm);

        //        if (result.Status == "Success" && result.DataVM != null)
        //        {
        //            purchase = JsonConvert.DeserializeObject<List<CollectionVM>>(result.DataVM.ToString()).FirstOrDefault();
        //        }
        //        else
        //        {
        //            TempData["message"] = result.Message;
        //            return RedirectToAction("FromPurchaseOrder", "Purchase", new { area = "DMS" });
        //        }

        //        purchase.Operation = "add";
        //        //purchase.IsPost = false;

        //        #region DecimalPlace
        //        CommonVM commonVM = new CommonVM();
        //        commonVM.Group = "SaleDecimalPlace";
        //        commonVM.Name = "SaleDecimalPlace";
        //        var settingsValue = _commonRepo.GetSettingsValue(commonVM);

        //        if (settingsValue.Status == "Success" && settingsValue.DataVM != null)
        //        {
        //            var data = JsonConvert.DeserializeObject<List<CommonVM>>(settingsValue.DataVM.ToString()).FirstOrDefault();

        //            //purchase.DecimalPlace = string.IsNullOrEmpty(data.SettingValue) ? 2 : Convert.ToInt32(data.SettingValue);
        //        }

        //        #endregion

        //        return View("Create", purchase);
        //    }
        //    catch (Exception e)
        //    {
        //        Session["result"] = "Fail" + "~" + e.Message;
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return RedirectToAction("Index");
        //    }
        //}

        [HttpGet]
        public JsonResult GetCollectionDetailDataById(GridOptions options, int masterId)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new CollectionRepo();

            try
            {
                result = _repo.GetCollectionDetailDataById(options, masterId);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<CollectionDetailVM>>(result.DataVM.ToString());

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

        [HttpPost]
        public ActionResult Delete(CollectionVM vm)
        {
            ResultModel<CollectionVM> result = new ResultModel<CollectionVM>();

            try
            {
                _repo = new CollectionRepo();

                CommonVM param = new CommonVM();

                //param.IDs = vm.IDs;
                param.ModifyBy = Session["UserId"].ToString();
                param.ModifyFrom = Ordinary.GetLocalIpAddress();

                ResultVM resultData = _repo.Delete(param);

                Session["result"] = resultData.Status + "~" + resultData.Message;

                if (resultData.Status == "Success")
                {
                    result = new ResultModel<CollectionVM>()
                    {
                        Success = true,
                        Status = Status.Success,
                        Message = resultData.Message,
                        Data = null
                    };
                }
                else
                {
                    result = new ResultModel<CollectionVM>()
                    {
                        Success = false,
                        Status = Status.Fail,
                        Message = resultData.Message,
                        Data = null
                    };
                }

                return Json(result);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return RedirectToAction("Index");
            }
        }

        [HttpPost]
        public ActionResult MultiplePost(CollectionVM vm)
        {
            ResultModel<CollectionVM> result = new ResultModel<CollectionVM>();

            try
            {
                _repo = new CollectionRepo();

                CommonVM param = new CommonVM();

                //param.IDs = vm.IDs;
                param.ModifyBy = Session["UserId"].ToString();
                param.ModifyFrom = Ordinary.GetLocalIpAddress();

                ResultVM resultData = _repo.MultiplePost(param);

                Session["result"] = resultData.Status + "~" + resultData.Message;

                if (resultData.Status == "Success")
                {
                    result = new ResultModel<CollectionVM>()
                    {
                        Success = true,
                        Status = Status.Success,
                        Message = resultData.Message,
                        Data = null
                    };
                }
                else
                {
                    result = new ResultModel<CollectionVM>()
                    {
                        Success = false,
                        Status = Status.Fail,
                        Message = resultData.Message,
                        Data = null
                    };
                }
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return RedirectToAction("Index");
            }

            return Json(result);
        }


        [HttpPost]
        public JsonResult GetGridData(GridOptions options)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new CollectionRepo();

            try
            {
                //options.vm.BranchId = branchId == "0" ? "" : branchId;
                //options.vm.IsPost = isPost;
                //options.vm.FromDate = fromDate;
                //options.vm.ToDate = toDate;
                //options.vm.CompanyId = Session["CompanyId"] != null ? Session["CompanyId"].ToString() : "";

                result = _repo.GetGridData(options);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<CollectionVM>>(result.DataVM.ToString());

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

        [HttpPost]
        public JsonResult GetDetailsGridData(GridOptions options, string branchId, string isPost, string fromDate, string toDate)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new CollectionRepo();

            try
            {
                options.vm.BranchId = branchId == "0" ? "" : branchId;
                options.vm.IsPost = isPost;
                options.vm.FromDate = fromDate;
                options.vm.ToDate = toDate;

                result = _repo.GetDetailsGridData(options);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<CollectionDetailVM>>(result.DataVM.ToString());

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

        [HttpPost]
        public ActionResult GetFromSale(CommonVM vm)
        {
            try
            {
                SaleRepo _repoo = new SaleRepo();

                CollectionVM purchase = new CollectionVM();
                ResultVM result = _repoo.SaleListForPayment(vm);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    purchase = JsonConvert.DeserializeObject<List<CollectionVM>>(result.DataVM.ToString()).FirstOrDefault();
                }
                else
                {
                    TempData["message"] = result.Message;
                    return RedirectToAction("FromPurchaseOrder", "Purchase", new { area = "DMS" });
                }

                purchase.Operation = "add";
                //purchase.IsPost = false;

                #region DecimalPlace
                CommonVM commonVM = new CommonVM();
                commonVM.Group = "SaleDecimalPlace";
                commonVM.Name = "SaleDecimalPlace";
                var settingsValue = _commonRepo.GetSettingsValue(commonVM);

                if (settingsValue.Status == "Success" && settingsValue.DataVM != null)
                {
                    var data = JsonConvert.DeserializeObject<List<CommonVM>>(settingsValue.DataVM.ToString()).FirstOrDefault();

                    //purchase.DecimalPlace = string.IsNullOrEmpty(data.SettingValue) ? 2 : Convert.ToInt32(data.SettingValue);
                }

                #endregion

                return View("Create", purchase);
            }
            catch (Exception e)
            {
                Session["result"] = "Fail" + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return RedirectToAction("Index");
            }
        }
    }
}
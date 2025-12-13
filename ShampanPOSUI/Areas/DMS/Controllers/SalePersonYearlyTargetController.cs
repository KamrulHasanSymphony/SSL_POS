using DocumentFormat.OpenXml.Wordprocessing;
using Newtonsoft.Json;
using ShampanPOS.Models;
using ShampanPOS.Models.KendoCommon;
using ShampanPOS.Repo;
using ShampanPOS.Repo.Helper;
using ShampanPOSUI.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace ShampanPOSUI.Areas.DMS.Controllers
{
    [Authorize]
    [RouteArea("DMS")]
    public class SalePersonYearlyTargetController : Controller
    {
        private readonly ApplicationDbContext _applicationDb;
        SalePersonYearlyTargetRepo _repo = new SalePersonYearlyTargetRepo();

        // GET: DMS/SalePersonYearlyTarget
        public ActionResult Index()
        {
            SalePersonYearlyTargetVM vm = new SalePersonYearlyTargetVM();
            var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
            vm.BranchId = Convert.ToInt32(currentBranchId);
            vm.Branchs = Convert.ToInt32(currentBranchId);
            DateTime currentDate = DateTime.Now;
            DateTime firstDayOfMonth = new DateTime(currentDate.Year, currentDate.Month, 1);
            DateTime lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);
            firstDayOfMonth = firstDayOfMonth.AddMonths(-5);
            vm.FromDate = firstDayOfMonth.ToString("yyyy/MM/dd");
            vm.ToDate = lastDayOfMonth.ToString("yyyy/MM/dd");
            return View();
        }

        public ActionResult Create()
        {
            SalePersonYearlyTargetVM vm = new SalePersonYearlyTargetVM();
            vm.Operation = "add";
            var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
            vm.BranchId = Convert.ToInt32(currentBranchId);
            return View("Create", vm);
        }

        [HttpPost]
        public ActionResult CreateEdit(SalePersonYearlyTargetVM model)
        {
            ResultModel<SalePersonYearlyTargetVM> result = new ResultModel<SalePersonYearlyTargetVM>();
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new SalePersonYearlyTargetRepo();
            //int selectedYear = model.Year;

            try
            {
                if (model.Operation.ToLower() == "add")
                {

                    int selectedYear = model.Year;
                    model.CreatedBy = Session["UserId"].ToString();
                    model.CreatedOn = DateTime.Now.ToString();
                    model.CreatedFrom = Ordinary.GetLocalIpAddress();
                    var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
                    model.BranchId = Convert.ToInt32(currentBranchId);
                    resultVM = _repo.Insert(model);

                    if (resultVM.Status == ResultStatus.Success.ToString())
                    {
                        model.Id = Convert.ToInt32(resultVM.Id);
                        model.Operation = "add";
                        Session["result"] = resultVM.Status + "~" + resultVM.Message;
                        result = new ResultModel<SalePersonYearlyTargetVM>()
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
                        string msg = string.Empty;
                        foreach (var entry in ModelState.Values)
                        {
                            if (entry.Errors.Count > 0)
                            {
                                foreach (var error in entry.Errors)
                                {
                                    msg += "," + error.ErrorMessage;
                                }
                            }
                        }

                        result = new ResultModel<SalePersonYearlyTargetVM>()
                        {
                            Success = false,
                            Status = Status.Fail,
                            Message = msg + " Model State Error!",
                            Data = model
                        };
                        return Json(result);
                    }

                }
                else if (model.Operation.ToLower() == "update")
                {
                    DateTime date = DateTime.Parse(model.YearStart);
                    int year = date.Year;
                    
                    model.Year = year;
                    model.LastModifiedBy = Session["UserId"].ToString();
                    model.LastModifiedOn = DateTime.Now.ToString();
                    model.LastUpdateFrom = Ordinary.GetLocalIpAddress();
                   
                    var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
                    model.BranchId = Convert.ToInt32(currentBranchId);
                    resultVM = _repo.Update(model);

                    if (resultVM.Status == ResultStatus.Success.ToString())
                    {
                        Session["result"] = resultVM.Status + "~" + resultVM.Message;
                        result = new ResultModel<SalePersonYearlyTargetVM>()
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
                        string msg = string.Empty;
                        foreach (var entry in ModelState.Values)
                        {
                            if (entry.Errors.Count > 0)
                            {
                                foreach (var error in entry.Errors)
                                {
                                    msg += "," + error.ErrorMessage;
                                }
                            }
                        }

                        result = new ResultModel<SalePersonYearlyTargetVM>()
                        {
                            Success = false,
                            Status = Status.Fail,
                            Message = msg + " Model State Error!",
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
                return View("CreateEdit", model);
            }
            // return View("CreateEdit", model);

        }

        [HttpGet]
        public ActionResult Edit(string id)
        {
            try
            {
                _repo = new SalePersonYearlyTargetRepo();

                SalePersonYearlyTargetVM model = new SalePersonYearlyTargetVM();
                CommonVM param = new CommonVM();
                param.Id = id;

                ResultVM result = _repo.List(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    model = JsonConvert.DeserializeObject<List<SalePersonYearlyTargetVM>>(result.DataVM.ToString()).FirstOrDefault();
                }
                else
                {
                    model = null;
                }

                model.Operation = "update";

                return View("CreateEdit", model);
            }
            catch (Exception e)
            {
                Session["result"] = "Fail" + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return RedirectToAction("Index");
            }
        }

        [HttpPost]
        public ActionResult Delete(SalePersonYearlyTargetVM vm)
        {
            ResultModel<SalePersonYearlyTargetVM> result = new ResultModel<SalePersonYearlyTargetVM>();

            try
            {
                _repo = new SalePersonYearlyTargetRepo();

                ResultVM resultData = _repo.Delete(vm);

                Session["result"] = resultData.Status + "~" + resultData.Message;

                result = new ResultModel<SalePersonYearlyTargetVM>()
                {
                    Success = true,
                    Status = Status.Success,
                    Message = resultData.Message,
                    Data = null
                };

                return Json(result);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return RedirectToAction("Index");
            }
        }

        [HttpPost]
        public JsonResult GetGridData(GridOptions options)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new SalePersonYearlyTargetRepo();
            try
            {
                result = _repo.GetGridData(options);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<SalePersonYearlyTargetVM>>(result.DataVM.ToString());

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
        public ActionResult MultiplePost(SaleDeliveryVM vm)
        {
            ResultModel<SalePersonYearlyTargetVM> result = new ResultModel<SalePersonYearlyTargetVM>();

            try
            {
                _repo = new SalePersonYearlyTargetRepo();

                CommonVM param = new CommonVM();

                param.IDs = vm.IDs;
                param.ModifyBy = Session["UserId"].ToString();
                param.ModifyFrom = Ordinary.GetLocalIpAddress();

                ResultVM resultData = _repo.MultiplePost(param);

                Session["result"] = resultData.Status + "~" + resultData.Message;

                result = new ResultModel<SalePersonYearlyTargetVM>()
                {
                    Success = true,
                    Status = Status.Success,
                    Message = resultData.Message,
                    Data = null
                };

                return Json(result);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return RedirectToAction("Index");
            }
        }




    }
}
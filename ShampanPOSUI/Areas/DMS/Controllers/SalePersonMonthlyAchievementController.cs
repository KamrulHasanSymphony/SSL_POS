using Newtonsoft.Json;
using ShampanPOS.Models;
using ShampanPOS.Models.KendoCommon;
using ShampanPOS.Repo;
using ShampanPOS.Repo.Helper;
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
    public class SalePersonMonthlyAchievementController : Controller
    {
        private readonly ApplicationDbContext _applicationDb;
        SalePersonMonthlyAchievementRepo _repo = new SalePersonMonthlyAchievementRepo();
        // GET: DMS/SalePersonMonthlyAchievement
        public ActionResult Index()
        {
            SalePersonMonthlyAchievementVM vm = new SalePersonMonthlyAchievementVM();
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

            //ModelState.Clear();
            SalePersonMonthlyAchievementVM vm = new SalePersonMonthlyAchievementVM();
            vm.Operation = "add";
            var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
            vm.BranchId = Convert.ToInt32(currentBranchId);
            return View("Create", vm);
        }

        [HttpPost]
        public ActionResult CreateEdit(SalePersonMonthlyAchievementVM model)
        {
            ResultModel<SalePersonMonthlyAchievementVM> result = new ResultModel<SalePersonMonthlyAchievementVM>();
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new SalePersonMonthlyAchievementRepo();


            try
            {
                if (model.Operation.ToLower() == "add")
                {
                    model.CreatedBy = Session["UserId"].ToString();
                    model.CreatedOn = DateTime.Now.ToString();
                    model.CreatedFrom = Ordinary.GetLocalIpAddress();
                    var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
                    model.BranchId = Convert.ToInt32(currentBranchId);
                    resultVM = _repo.Insert(model);

                    if (resultVM.Status == ResultStatus.Success.ToString())
                    {
                        model = JsonConvert.DeserializeObject<SalePersonMonthlyAchievementVM>(resultVM.DataVM.ToString());
                        model.Operation = "add";
                        Session["result"] = resultVM.Status + "~" + resultVM.Message;
                        result = new ResultModel<SalePersonMonthlyAchievementVM>()
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

                        result = new ResultModel<SalePersonMonthlyAchievementVM>()
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
                        result = new ResultModel<SalePersonMonthlyAchievementVM>()
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

                        result = new ResultModel<SalePersonMonthlyAchievementVM>()
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

            //return View("Create", model);

        }

        [HttpGet]
        public ActionResult Edit(int id)
        {
            try
            {
                _repo = new SalePersonMonthlyAchievementRepo();

                SalePersonMonthlyAchievementVM vm = new SalePersonMonthlyAchievementVM();
                CommonVM param = new CommonVM();
                param.Id = id.ToString();
                ResultVM result = _repo.List(param);
                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<SalePersonMonthlyAchievementVM>>(result.DataVM.ToString()).FirstOrDefault();
                }
                else
                {
                    vm = null;
                }

                vm.Operation = "update";

                return View("Create", vm);
            }
            catch (Exception e)
            {
                Session["result"] = "Fail" + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return RedirectToAction("Index");
            }
        }

        [HttpPost]
        public ActionResult Delete(SalePersonMonthlyAchievementVM vm)
        {
            ResultModel<SalePersonMonthlyAchievementVM> result = new ResultModel<SalePersonMonthlyAchievementVM>();

            try
            {
                _repo = new SalePersonMonthlyAchievementRepo();
                CommonVM param = new CommonVM();
                param.IDs = vm.IDs;
                param.ModifyBy = Session["UserId"].ToString();
                param.ModifyFrom = Ordinary.GetLocalIpAddress();
                ResultVM resultData = _repo.Delete(param);

                Session["result"] = resultData.Status + "~" + resultData.Message;

                result = new ResultModel<SalePersonMonthlyAchievementVM>()
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
        public JsonResult GetSalePersonMonthlyAchievementGrid(GridOptions options)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new SalePersonMonthlyAchievementRepo();

            try
            {
                result = _repo.GetGridData(options);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<SalePersonMonthlyAchievementVM>>(result.DataVM.ToString());

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
        public ActionResult ProcessData(int salePersonId, string year, int? branchId)
        {
            ResultModel<SalePersonMonthlyAchievementVM> result = new ResultModel<SalePersonMonthlyAchievementVM>();
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new SalePersonMonthlyAchievementRepo();

            var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
            branchId = Convert.ToInt32(currentBranchId);
            try
            {
                resultVM = _repo.ProcessData(salePersonId, year, branchId);

                if (resultVM.Status == ResultStatus.Success.ToString())
                {
                    var data = JsonConvert.DeserializeObject<SalePersonMonthlyAchievementVM>(resultVM.DataVM.ToString());

                    Session["result"] = resultVM.Status + "~" + resultVM.Message;
                    result = new ResultModel<SalePersonMonthlyAchievementVM>()
                    {
                        Success = true,
                        Status = Status.Success,
                        Message = resultVM.Message,
                        Data = data
                    };
                    return Json(result);
                }
                else
                {
                    Session["result"] = "Fail" + "~" + resultVM.Message;

                    result = new ResultModel<SalePersonMonthlyAchievementVM>()
                    {
                        Status = Status.Fail,
                        Message = resultVM.Message,
                        Data = null
                    };
                    return Json(result);
                }
            }
            catch (Exception ex)
            {

                throw ex.InnerException;
            }


        }
    }
}
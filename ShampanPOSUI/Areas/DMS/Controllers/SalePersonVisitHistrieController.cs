using Newtonsoft.Json;
using ShampanPOS.Models;
using ShampanPOS.Models.KendoCommon;
using ShampanPOS.Repo;
using ShampanPOS.Repo.Helper;
using ShampanPOS.Service.ViewModel;
using ShampanPOSUI.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace ShampanPOSUI.Areas.DMS.Controllers
{
    [Authorize]
    [RouteArea("DMS")]
    public class SalePersonVisitHistrieController : Controller
    {
        private readonly ApplicationDbContext _applicationDb;
        SalePersonVisitHistrieRepo _repo = new SalePersonVisitHistrieRepo();

        // GET: DMS/SalePersonRoute
        public ActionResult Index(int? id)
        {
            if (id == 0 || id == null)
            {
                return View();
            }
            else
            {
                SalePersonVisitHistrieVM SalePersonVisitHistrie = new SalePersonVisitHistrieVM()
                {
                    IsIndex = true,
                   // IsGrid = true,
                    SalePersonId = id.Value,
           
                };
                return View("Index", SalePersonVisitHistrie);
            }
        }

        public ActionResult Create(int SalePersonId , string SalePersonName)
        {
            SalePersonVisitHistrieVM vm = new SalePersonVisitHistrieVM();
            vm.Operation = "add";
            vm.IsIndex = false;
            
            vm.SalePersonId = SalePersonId;
            vm.SalePersonName = SalePersonName;
            var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
            vm.BranchId = Convert.ToInt32(currentBranchId);
            vm.Date = DateTime.Now.ToString("dd-MMM-yyyy");
            return View("Create", vm);
        }
      
        [HttpPost]
        public ActionResult CreateEdit(SalePersonVisitHistrieVM model)
        {
            ResultModel<SalePersonVisitHistrieVM> result = new ResultModel<SalePersonVisitHistrieVM>();
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new SalePersonVisitHistrieRepo();

            if (ModelState.IsValid)
            {
                try
                {
                    if (model.Operation.ToLower() == "add")
                    {


                        resultVM = _repo.Insert(model);

                        if (resultVM.Status == ResultStatus.Success.ToString())
                        {
                            //model = JsonConvert.DeserializeObject<SalePersonVisitHistrieVM>(resultVM.DataVM.ToString());
                            model.Operation = "add";
                            Session["result"] = resultVM.Status + "~" + resultVM.Message;
                            result = new ResultModel<SalePersonVisitHistrieVM>()
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

                            result = new ResultModel<SalePersonVisitHistrieVM>()
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


                        resultVM = _repo.Update(model);

                        if (resultVM.Status == ResultStatus.Success.ToString())
                        {
                            Session["result"] = resultVM.Status + "~" + resultVM.Message;
                            result = new ResultModel<SalePersonVisitHistrieVM>()
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

                            result = new ResultModel<SalePersonVisitHistrieVM>()
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
            else
            {
                result = new ResultModel<SalePersonVisitHistrieVM>()
                {
                    Success = false,
                    Status = Status.Fail,
                    Message = "Model State Error!",
                    Data = model
                };
                return Json(result);
            }
        }

        //[HttpGet]
        //public ActionResult Edit(string id)
        //{
        //    try
        //    {
        //        _repo = new SalePersonVisitHistrieRepo();

        //        SalePersonVisitHistrieVM vm = new SalePersonVisitHistrieVM();
        //        CommonVM param = new CommonVM();
        //        param.Id = id;
        //        ResultVM result = _repo.List(param);

        //        if (result.Status == "Success" && result.DataVM != null)
        //        {
        //            vm = JsonConvert.DeserializeObject<List<SalePersonVisitHistrieVM>>(result.DataVM.ToString()).FirstOrDefault();
        //        }
        //        else
        //        {
        //            vm = null;
        //        }

        //        vm.Operation = "update";

        //        return View("Create", vm);
        //    }
        //    catch (Exception e)
        //    {
        //        Session["result"] = "Fail" + "~" + e.Message;
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return RedirectToAction("Index");
        //    }
        //}

        [HttpGet]
        public ActionResult Edit(int id)
        {
            try
            {
                _repo = new SalePersonVisitHistrieRepo();

                SalePersonVisitHistrieVM vm = new SalePersonVisitHistrieVM();
                CommonVM param = new CommonVM();
                param.Id = id.ToString();


                ResultVM result = _repo.List(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<SalePersonVisitHistrieVM>>(result.DataVM.ToString()).FirstOrDefault();
                }
                else
                {
                    vm = null;
                }

                vm.Operation = "update";
                //vm.YearPeriod = id;
                //vm.YearPeriod = vm.Year;

                return View("CreateEdit", vm);
            }
            catch (Exception e)
            {
                Session["result"] = "Fail" + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return RedirectToAction("Index");
            }
        }

        [HttpPost]
        public ActionResult Delete(SalePersonVisitHistrieVM vm)
        {
            ResultModel<SalePersonVisitHistrieVM> result = new ResultModel<SalePersonVisitHistrieVM>();

            try
            {
                _repo = new SalePersonVisitHistrieRepo();

                CommonVM param = new CommonVM();

                param.IDs = vm.IDs;
                param.ModifyBy = Session["UserId"].ToString();
                param.ModifyFrom = Ordinary.GetLocalIpAddress();

                ResultVM resultData = _repo.Delete(param);

                Session["result"] = resultData.Status + "~" + resultData.Message;

                result = new ResultModel<SalePersonVisitHistrieVM>()
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
        public JsonResult GetGridData(GridOptions options, string getSalePersonId, string branchId, string fromDate, string toDate)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new SalePersonVisitHistrieRepo();

            try
            {
                options.vm.BranchId = branchId == "0" ? "" : branchId;
                options.vm.FromDate = fromDate;
                options.vm.ToDate = toDate;
                result = _repo.GetGridData(options, getSalePersonId);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<SalePersonVisitHistrieVM>>(result.DataVM.ToString());

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


        public ActionResult Visit()
        {
            SalePersonVisitHistrieVM vm = new SalePersonVisitHistrieVM();
            var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
            vm.BranchId = Convert.ToInt32(currentBranchId);
            vm.Branchs = Convert.ToInt32(currentBranchId);
            DateTime currentDate = DateTime.Now;
            DateTime firstDayOfMonth = new DateTime(currentDate.Year, currentDate.Month, 1);
            DateTime lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);
            firstDayOfMonth = firstDayOfMonth.AddMonths(-5);
            vm.FromDate = firstDayOfMonth.ToString("yyyy/MM/dd");
            vm.ToDate = lastDayOfMonth.ToString("yyyy/MM/dd");
            return View(vm);
        }

        [HttpPost]
        public JsonResult GetAllGridData(GridOptions options, string branchId, string fromDate, string toDate)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new SalePersonVisitHistrieRepo();
            try
            {
                options.vm.BranchId = branchId == "0" ? "" : branchId;
                options.vm.FromDate = fromDate;
                options.vm.ToDate = toDate;
                result = _repo.GetAllGridData(options);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<SalePersonVisitHistrieVM>>(result.DataVM.ToString());

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





    }
}
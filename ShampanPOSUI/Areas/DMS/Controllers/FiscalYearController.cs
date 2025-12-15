using Newtonsoft.Json;
using ShampanPOS.Models;
using ShampanPOS.Models.KendoCommon;
using ShampanPOS.Repo;
using ShampanPOS.Repo.Helper;
//using ShampanPOS.Service.ViewModel;
using ShampanPOSUI.Persistence;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web.Mvc;
using System.Web.WebPages;

namespace ShampanPOSUI.Areas.DMS.Controllers
{
    [Authorize]
    [RouteArea("DMS")]
    public class FiscalYearController : Controller
    {
        private readonly ApplicationDbContext _applicationDb;
        FiscalYearsRepo _repo = new FiscalYearsRepo();
        public string YearEnd { get; set; }


        // GET: DMS/FiscalYears
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Create()
        {            
            FiscalYearsRepo _fiscalRepo = new FiscalYearsRepo();
            CompanyProfileRepo _repo = new CompanyProfileRepo();
            CommonVM param = new CommonVM();
            FiscalYearVM vm = new FiscalYearVM();
            CompanyProfileVM companyVm = new CompanyProfileVM();
            List<FiscalYearVM> fiscalYearLists = new List<FiscalYearVM>();

            string yearStartDate = "";

            int year;

            var companyId = Session["CompanyId"];
            param.Id = companyId.ToString();
            ResultVM companyData =  _repo.List(param);
            if (companyData.Status == "Success" && companyData.DataVM != null)
            {
                companyVm = JsonConvert.DeserializeObject<List<CompanyProfileVM>>(companyData.DataVM.ToString()).FirstOrDefault();
                //yearStartDate = companyVm.FYearStart;
                 year = DateTime.ParseExact(yearStartDate, "yyyy-MM-dd", null).Year;
                vm.YearStart = yearStartDate;

                //vm.YearPeriod =Convert.ToInt32( Convert.ToDateTime( vm.YearStart).ToString("yyyyMM"));
                vm.Year = year;
            }
            else
            {
                vm = null;
            }

            List<FiscalYearDetailVM> detailVMs = new List<FiscalYearDetailVM>();
            FiscalYearDetailVM dvm;
            //for (int i = 0; i <= 12; i++)
            //{
            //    dvm = new FiscalYearDetailVM();
            //        var month =Convert.ToDateTime( vm.YearStart).ToString("MM");
            //        var day =Convert.ToDateTime( vm.YearStart).ToString("dd");
            //    dvm.MonthStart =Convert.ToDateTime( year + "/" + month + "/" + day).AddMonths(i).ToString("dd-MMM-yyyy");
                
            //    DateTime originalDate = Convert.ToDateTime(dvm.MonthStart);
            //    DateTime lastDateOfMonth = new DateTime(originalDate.Year, originalDate.Month, DateTime.DaysInMonth(originalDate.Year, originalDate.Month));
            //    dvm.MonthEnd = lastDateOfMonth.ToString("dd-MMM-yyyy");
            //    dvm.MonthId = Convert.ToInt32( originalDate.ToString("yyyyMM"));
            //    dvm.Year = year;
            //    detailVMs.Add(dvm);
            //}
            vm.fiscalYearDetails = detailVMs;            
            vm = DesignFiscalYear(vm);
            vm.Operation = "add";
            //vm.Year = year;
            return View("Create", vm);
        }
        private FiscalYearVM DesignFiscalYear(FiscalYearVM model)
        {
            try
            {
                // Attempt to parse the input date string using the correct format
                DateTime start_date;
                bool parsed = DateTime.TryParseExact(model.YearStart, new[] { "yyyy/MM/dd", "yyyy-MM-dd" }, null, System.Globalization.DateTimeStyles.None, out start_date);

                if (!parsed)
                {
                    throw new FormatException($"Invalid date format for YearStart: {model.YearStart}");
                }

                model.YearEnd = start_date.AddYears(1).AddDays(-1).ToString("yyyy/MM/dd");
                model.Year = start_date.AddYears(1).AddDays(-1).Year;

                var fvms = Enumerable.Range(0, 12)
                                     .Select(i => new FiscalYearDetailVM
                                     {
                                         MonthName = start_date.AddMonths(i).ToString("MMM-yy"),
                                         MonthStart = start_date.AddMonths(i).ToString("yyyy/MM/dd"),
                                         MonthEnd = start_date.AddMonths(i + 1).AddDays(-1).ToString("yyyy/MM/dd"),
                                         MonthId = Convert.ToInt32(start_date.AddMonths(i).ToString("yyyyMM"))
                                     })
                                     .ToList();

                model.fiscalYearDetails = fvms;
                return model;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpGet]
        public ActionResult FiscalYearSet(FiscalYearVM model)
        {
            try
            {

                DateTime start_date = DateTime.ParseExact(model.YearStart, "yyyy-MM-dd", null);
                model.YearEnd = start_date.AddYears(1).AddDays(-1).ToString("yyyy-MM-dd");
                model.Year = start_date.AddYears(1).AddDays(-1).Year;

                var fvms = Enumerable.Range(0, 12)
                                     .Select(i => new FiscalYearDetailVM
                                     {
                                         MonthName = start_date.AddMonths(i).ToString("MMM-yy"),
                                         MonthStart = start_date.AddMonths(i).ToString("dd-MMM-yyyy"),
                                         MonthEnd = start_date.AddMonths(i + 1).AddDays(-1).ToString("dd-MMM-yyyy"),
                                         MonthId = Convert.ToInt32(start_date.AddMonths(i).ToString("yyyyMM"))
                                     })
                                     .ToList();

                model.fiscalYearDetails = fvms;
                model.Operation = "add";
                return PartialView("_period", model.fiscalYearDetails);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost]
        public ActionResult CreateEdit(FiscalYearVM model)
        {
            ResultModel<FiscalYearVM> result = new ResultModel<FiscalYearVM>();
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new FiscalYearsRepo();


            try
            {
                if (model.Operation.ToLower() == "add")
                {
                    model.CreatedBy = Session["UserId"].ToString();
                    model.CreatedOn = DateTime.Now.ToString();
                    model.CreatedFrom = Ordinary.GetLocalIpAddress();

                    //FiscalYearVM newVM = DesignFiscalYear(model);

                    resultVM = _repo.Insert(model);

                    if (resultVM.Status == "Success")
                    {
                        model = JsonConvert.DeserializeObject<FiscalYearVM>(resultVM.DataVM.ToString());
                        model.Operation = "add";
                        Session["result"] = resultVM.Status + "~" + resultVM.Message;
                        result = new ResultModel<FiscalYearVM>()
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

                        result = new ResultModel<FiscalYearVM>()
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
                        result = new ResultModel<FiscalYearVM>()
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

                        result = new ResultModel<FiscalYearVM>()
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

           // return View("Create", model);

        }

        [HttpGet]
        public ActionResult Edit(int id)
        {
            try
            {
                _repo = new FiscalYearsRepo();

                FiscalYearVM vm = new FiscalYearVM();
                CommonVM param = new CommonVM();
                param.Id = id.ToString();
                ResultVM result = _repo.List(param);
                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<FiscalYearVM>>(result.DataVM.ToString()).FirstOrDefault();
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
        public ActionResult Delete(FiscalYearVM vm)
        {
            ResultModel<FiscalYearVM> result = new ResultModel<FiscalYearVM>();

            try
            {
                _repo = new FiscalYearsRepo();
                CommonVM param = new CommonVM();
                param.IDs = vm.IDs;
                param.ModifyBy = Session["UserId"].ToString();
                param.ModifyFrom = Ordinary.GetLocalIpAddress();
                ResultVM resultData = _repo.Delete(param);

                Session["result"] = resultData.Status + "~" + resultData.Message;

                result = new ResultModel<FiscalYearVM>()
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
        public JsonResult GetFiscalYearsGrid(GridOptions options)
        {

            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new FiscalYearsRepo();

            try
            {
                result = _repo.GetGridData(options);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<FiscalYearVM>>(result.DataVM.ToString());

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
using Newtonsoft.Json;
using OfficeOpenXml.Style;
using OfficeOpenXml;
using ShampanPOS.Models;
using ShampanPOS.Models.KendoCommon;
using ShampanPOS.Repo;
using ShampanPOS.Repo.Helper;
using ShampanPOSUI.Persistence;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace ShampanPOSUI.Areas.DMS.Controllers
{
    [Authorize]
    [RouteArea("DMS")]
    public class SaleController : Controller
    {
        private readonly ApplicationDbContext _applicationDb;
        SaleRepo _repo = new SaleRepo();
        CommonRepo _common = new CommonRepo();


        // GET: DMS/Sale
        public ActionResult Index()
        {
            SaleVM vm = new SaleVM();
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

        public ActionResult Create()
        {
            try
            {
                SaleVM vm = new SaleVM();
                vm.Operation = "add";
                vm.TransactionType = "Sale";
                vm.IsManualSale = true;

                var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
                vm.BranchId = Convert.ToInt32(currentBranchId);

                #region DecimalPlace
                CommonVM commonVM = new CommonVM();
                commonVM.Group = "SaleDecimalPlace";
                commonVM.Name = "SaleDecimalPlace";
                var settingsValue = _common.GetSettingsValue(commonVM);

                if (settingsValue.Status == "Success" && settingsValue.DataVM != null)
                {
                    var data = JsonConvert.DeserializeObject<List<CommonVM>>(settingsValue.DataVM.ToString()).FirstOrDefault();

                    vm.DecimalPlace = string.IsNullOrEmpty(data.SettingValue) ? 2 : Convert.ToInt32(data.SettingValue);
                }

                #endregion

                return View("Create", vm);
            }
            catch (Exception e)
            {
                Session["result"] = "Fail" + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return RedirectToAction("Index");
            }
        }


        public ActionResult ProductCardCreate()
        {
            try
            {
                SaleVM vm = new SaleVM();
                vm.Operation = "add";
                vm.TransactionType = "Sale";
                vm.IsManualSale = true;

                var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
                vm.BranchId = Convert.ToInt32(currentBranchId);

                #region DecimalPlace
                CommonVM commonVM = new CommonVM();
                commonVM.Group = "SaleDecimalPlace";
                commonVM.Name = "SaleDecimalPlace";
                var settingsValue = _common.GetSettingsValue(commonVM);

                if (settingsValue.Status == "Success" && settingsValue.DataVM != null)
                {
                    var data = JsonConvert.DeserializeObject<List<CommonVM>>(settingsValue.DataVM.ToString()).FirstOrDefault();

                    vm.DecimalPlace = string.IsNullOrEmpty(data.SettingValue) ? 2 : Convert.ToInt32(data.SettingValue);
                }

                #endregion

                return View("ProductCardCreate", vm);
            }
            catch (Exception e)
            {
                Session["result"] = "Fail" + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return RedirectToAction("Index");
            }
        }


        public ActionResult DetailsIndex()
        {
            SaleDetailVM vm = new SaleDetailVM();

            var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
            vm.BranchId = Convert.ToInt32(currentBranchId);
            //vm.Branchs = Convert.ToInt32(currentBranchId);
            DateTime currentDate = DateTime.Now;
            DateTime firstDayOfMonth = new DateTime(currentDate.Year, currentDate.Month, 1);
            DateTime lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);
            firstDayOfMonth = firstDayOfMonth.AddMonths(-5);
           // vm.FromDate = firstDayOfMonth.ToString("yyyy/MM/dd");
            vm.FromDate = "";
            //vm.ToDate = lastDayOfMonth.ToString("yyyy/MM/dd");
            vm.ToDate = "";

            #region  UserInfo


            //string userName = User.Identity.Name;
            //ApplicationUser user = _applicationDb.Users.FirstOrDefault(model => model.UserName == userName);

            // vm.IsPushAllow = user.IsPushAllow;
            #endregion
            return View(vm);
        }


        [HttpPost]
        public ActionResult CreateEdit(SaleVM model)
        {
            ResultModel<SaleVM> result = new ResultModel<SaleVM>();
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new SaleRepo();
                try
                {
                var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
                model.BranchId = Convert.ToInt32(currentBranchId);
                model.CompanyId = Convert.ToInt32(Session["CompanyId"] != null ? Session["CompanyId"].ToString() : "");


                if (model.Operation.ToLower() == "add")
                    {
                        model.CreatedBy = Session["UserId"].ToString();
                        model.UserId = Session["UserHashId"]?.ToString();

                        model.CreatedOn = DateTime.Now.ToString();
                        model.CreatedFrom = Ordinary.GetLocalIpAddress();

                        resultVM = _repo.Insert(model);

                        if (resultVM.Status == ResultStatus.Success.ToString())
                        {
                            model = JsonConvert.DeserializeObject<SaleVM>(resultVM.DataVM.ToString());
                            model.Operation = "add";
                            Session["result"] = resultVM.Status + "~" + resultVM.Message;
                            result = new ResultModel<SaleVM>()
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

                            result = new ResultModel<SaleVM>()
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
                            result = new ResultModel<SaleVM>()
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

                            result = new ResultModel<SaleVM>()
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
                _repo = new SaleRepo();

                SaleVM vm = new SaleVM();
                CommonVM param = new CommonVM();
                param.Id = id;
                ResultVM result = _repo.List(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<SaleVM>>(result.DataVM.ToString()).FirstOrDefault();
                }
                else
                {
                    vm = null;
                }

                vm.Operation = "update";

                #region DecimalPlace
                CommonVM commonVM = new CommonVM();
                commonVM.Group = "SaleDecimalPlace";
                commonVM.Name = "SaleDecimalPlace";
                var settingsValue = _common.GetSettingsValue(commonVM);

                if (settingsValue.Status == "Success" && settingsValue.DataVM != null)
                {
                    var data = JsonConvert.DeserializeObject<List<CommonVM>>(settingsValue.DataVM.ToString()).FirstOrDefault();

                    vm.DecimalPlace = string.IsNullOrEmpty(data.SettingValue) ? 2 : Convert.ToInt32(data.SettingValue);
                }

                #endregion

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
        public JsonResult GetGridData(GridOptions options, string branchId, string isPost, string fromDate, string toDate)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new SaleRepo();

            try
            {
                options.vm.BranchId = branchId == "0" ? "" : branchId;
                options.vm.FromDate = fromDate;
                options.vm.IsPost = isPost;
                options.vm.ToDate = toDate;
                result = _repo.GetGridData(options);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<SaleVM>>(result.DataVM.ToString());

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
        public JsonResult GetDetailsGridData(GridOptions options, string isPost, string branchId, string fromDate, string toDate)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new SaleRepo();
            try
            {
                options.vm.BranchId = branchId == "0" ? "" : branchId;
                options.vm.IsPost = isPost;
                options.vm.FromDate = fromDate;
                options.vm.ToDate = toDate;
                result = _repo.GetDetailsGridData(options);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<SaleDetailVM>>(result.DataVM.ToString());

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

        //[HttpGet]
        //public ActionResult GetProductGroupList()
        //{
        //    _repo = new SaleRepo();
        //    try
        //    {
        //        var result = _repo.GetProductGroupList();
        //        return Json(result, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        //[HttpGet]
        //public ActionResult GetUOMList()
        //{
        //    _repo = new SaleRepo();
        //    try
        //    {
        //        var result = _repo.GetUOMList();
        //        return Json(result, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        //[HttpGet]
        //public ActionResult GetDeliveryList()
        //{
        //    try
        //    {
        //        var result = _repo.GetDeliveryList();
        //        return Json(result, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        [HttpGet]
        public ActionResult GetDriverList()
        {
            try
            {
                var result = _repo.GetDriverList();
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpPost]
        public ActionResult MultiplePost(SaleVM vm)
        {
            ResultModel<SaleVM> result = new ResultModel<SaleVM>();

            try
            {
                _repo = new SaleRepo();

                CommonVM param = new CommonVM();

                param.IDs = vm.IDs;
                param.ModifyBy = Session["UserId"].ToString();
                param.ModifyFrom = Ordinary.GetLocalIpAddress();

                ResultVM resultData = _repo.MultiplePost(param);

                Session["result"] = resultData.Status + "~" + resultData.Message;

                result = new ResultModel<SaleVM>()
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


        [HttpGet]
        public ActionResult getReport(string id)
        {
            try
            {
                var companyId = Session["CompanyId"];

                SaleVM vm = new SaleVM();
                CommonVM param = new CommonVM();
                param.Id = id;
                param.CompanyId = companyId.ToString();

                ResultVM result = _repo.GetSaleReport(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<SaleVM>>(result.DataVM.ToString()).FirstOrDefault();
                }
                else
                {
                    vm = new SaleVM();
                }

                //vm.ColunWidth = new Dictionary<string, string>
                //{
                //    { "Code", "5%" },
                //    { "CustomerName", "15%" },
                //    { "TailorMasterName", "15%" },
                //    { "FabricTotal", "15%" },
                //    { "MakingChargeTotal", "15%" },
                //    { "GrandTotal", "35%" },
                //    { "Advance", "35%" },
                //    { "Dues", "35%" }
                //};

                //vm.PageSize = new Dictionary<string, string>
                //{
                //    { "A4_Width", "210mm" },
                //    { "A4_Height", "297mm" },
                //    { "Letter_Width", "216mm" },
                //    { "Letter_Height", "279mm" },
                //    { "Orientation", "Portrait" },
                //    { "Default", "A4" }
                //};

                return View("SaleReport", vm);
            }
            catch (Exception e)
            {
                Session["result"] = "Fail" + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return RedirectToAction("Index");
            }
        }


        //[HttpPost]
        //public ActionResult MultiplePost(SaleVM vm)
        //{
        //    try
        //    {
        //        _repo = new SaleRepo();

        //        if (vm.IDs == null || !vm.IDs.Any())
        //        {
        //            return Json(new
        //            {
        //                Success = false,
        //                Status = 400,
        //                Message = "No sale selected for posting."
        //            });
        //        }

        //        CommonVM param = new CommonVM
        //        {
        //            IDs = vm.IDs,
        //            ModifyBy = Session["UserId"]?.ToString() ?? "System",
        //            ModifyFrom = Ordinary.GetLocalIpAddress()
        //        };

        //        ResultVM resultData = _repo.MultiplePost(param);

        //        // 🔥 THIS IS THE KEY FIX
        //        if (resultData.Status == "Fail")
        //        {
        //            return Json(new
        //            {
        //                Success = false,
        //                Status = 400,
        //                Message = resultData.Message   // ✅ EXACT validation message
        //            });
        //        }

        //        return Json(new
        //        {
        //            Success = true,
        //            Status = 200,
        //            Message = resultData.Message
        //        });
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);

        //        return Json(new
        //        {
        //            Success = false,
        //            Status = 500,
        //            Message = e.Message   // dev mode (change later)
        //        });
        //    }
        //}



        [HttpGet]
        public ActionResult GetBranchList()
        {
            try
            {
                var result = _repo.GetBranchList();
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        //[HttpGet]
        //public ActionResult GetCustomerList()
        //{
        //    try
        //    {
        //        var result = _repo.GetCustomerList();
        //        return Json(result, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}
        //[HttpGet]
        //public ActionResult GetSalePersonList()
        //{
        //    CommonRepo _common = new CommonRepo();
        //    try
        //    {
        //        var result = _repo.GetSalePersonList();
        //        return Json(result, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}
        [HttpGet]
        public ActionResult GetRouteList()
        {
            try
            {
                var result = _repo.GetRouteList();
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        //[HttpGet]
        //public ActionResult GetCurrencieList()
        //{
        //    try
        //    {
        //        var result = _repo.GetCurrencieList();
        //        return Json(result, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        [HttpPost]
        public async Task<ActionResult> ReportPreview(CommonVM param)
        {
            try
            {
                _repo = new SaleRepo();
                param.CompanyId = Session["CompanyId"] != null ? Session["CompanyId"].ToString() : "";
                var resultStream = _repo.ReportPreview(param);

                if (resultStream == null)
                {
                    throw new Exception("Failed to generate report: No data received.");
                }

                using (var memoryStream = new MemoryStream())
                {
                    await resultStream.CopyToAsync(memoryStream);
                    byte[] fileBytes = memoryStream.ToArray();

                    if (fileBytes.Length < 1000)
                    {
                        string errorContent = Encoding.UTF8.GetString(fileBytes);
                        throw new Exception("Failed to generate report!");
                    }

                    Response.Headers.Add("Content-Disposition", "inline; filename=Sale_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".pdf");

                    return File(fileBytes, "application/pdf");
                }
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                TempData["Message"] = e.Message.ToString();
                return RedirectToAction("Index", "Sale", new { area = "DMS", message = TempData["Message"] });
            }
        }


        [HttpGet]
        public JsonResult GetSaleDetailDataById(GridOptions options, int masterId)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new SaleRepo();

            try
            {
                result = _repo.GetSaleDetailDataById(options, masterId);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<SaleDetailVM>>(result.DataVM.ToString());

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



        [HttpGet]
        public ActionResult FromSaleOrder()
        {
            SaleOrderVM vm = new SaleOrderVM();
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
        public ActionResult GetFromSaleOrder(CommonVM vm)
        {
            try
            {
                SaleOrderRepo _repoo = new SaleOrderRepo();

                SaleVM purchase = new SaleVM();


                ResultVM result = _repoo.SaleOrderList(vm);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    purchase = JsonConvert.DeserializeObject<List<SaleVM>>(result.DataVM.ToString()).FirstOrDefault();
                }
                else
                {
                    TempData["message"] = result.Message;
                    return RedirectToAction("FromSaleOrder", "Sale", new { area = "DMS" });
                }

                purchase.Operation = "add";
                purchase.IsPost = false;
                purchase.IsManualSale = false;

                purchase.InvoiceDateTime = purchase.InvoiceDateTime = Convert.ToDateTime(purchase.OrderDate)
                                 .ToString("yyyy-MM-dd HH:mm:ss");
                #region DecimalPlace
                CommonVM commonVM = new CommonVM();
                 commonVM.Group = "SaleDecimalPlace";
                commonVM.Name = "SaleDecimalPlace";
                var settingsValue = _common.GetSettingsValue(commonVM);

                if (settingsValue.Status == "Success" && settingsValue.DataVM != null)
                {
                    var data = JsonConvert.DeserializeObject<List<CommonVM>>(settingsValue.DataVM.ToString()).FirstOrDefault();

                    purchase.DecimalPlace = string.IsNullOrEmpty(data.SettingValue) ? 2 : Convert.ToInt32(data.SettingValue);
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


        [HttpPost]
        public JsonResult FromSaleGridData(GridOptions options)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new SaleRepo();

            try
            {
                result = _repo.FromSaleGridData(options);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<SaleVM>>(result.DataVM.ToString());

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




        public ActionResult SaleIndex()
        {
            var vm = new SaleReportVM();
            vm.IsSummary = false;

            return View(vm);
        }


        //public ActionResult SaleReport(string customerId, string fromDate, string toDate, bool isSummary)
        //{
        //    List<SaleReportVM> vmList = new List<SaleReportVM>();

        //    SaleReportVM param = new SaleReportVM();

        //    param.CustomerId = string.IsNullOrEmpty(customerId) ? 0 : Convert.ToInt32(customerId);
        //    param.InvoiceFromDate = string.IsNullOrEmpty(fromDate) ? "01-01-2025" : fromDate;
        //    param.InvoiceToDate = string.IsNullOrEmpty(toDate) ? DateTime.Now.ToString("dd-MM-yyyy") : toDate;

        //    param.IsSummary = isSummary;

        //    ResultVM result = _repo.GetSaleByList(param);


        //    if (result.Status == "Success" && result.DataVM != null)
        //    {
        //        vmList = JsonConvert.DeserializeObject<List<SaleReportVM>>(result.DataVM.ToString());

        //    }

        //    return View("SaleListReport", vmList);
        //}



        public ActionResult SaleListReport(int? customerId,string fromDate,string toDate,int? reportType,bool isSummary)
        {
            List<SaleReportVM> vmList = new List<SaleReportVM>();

            SaleReportVM param = new SaleReportVM();

            //param.CustomerId = string.IsNullOrEmpty(customerId) ? 0 : Convert.ToInt32(customerId);
            param.CustomerId = customerId ?? 0;
            param.InvoiceFromDate = string.IsNullOrEmpty(fromDate) ? "01-01-2025" : fromDate;
            param.InvoiceToDate = string.IsNullOrEmpty(toDate) ? DateTime.Now.ToString("dd-MM-yyyy") : toDate;

            param.IsSummary = isSummary;
            param.ReportType = reportType ?? 0; // ✅ FIX

            ResultVM result = _repo.GetSaleByList(param);

            if (result.Status == "Success" && result.DataVM != null)
            {
                vmList = JsonConvert.DeserializeObject<List<SaleReportVM>>(result.DataVM.ToString());
            }

            ViewBag.IsSummary = isSummary; // ✅ IMPORTANT

            //return View("~/Views/Sale/SaleListReport.cshtml", vmList); // ✅ FORCE PATH

            return View("SaleListReport", vmList);

            //return View("~/Areas/DMS/Views/Sale/SaleListReport.cshtml", vmList);
        }



    }
}
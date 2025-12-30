using ExcelDataReader;
using Newtonsoft.Json;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using ShampanPOS.Models;
using ShampanPOS.Models.KendoCommon;
using ShampanPOS.Repo;
using ShampanPOS.Repo.Helper;
using ShampanPOSUI.Persistence;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
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
    public class PurchaseController : Controller
    {
        private readonly ApplicationDbContext _applicationDb;
        PurchaseRepo _repo = new PurchaseRepo();
        CommonRepo _commonRepo = new CommonRepo();

        // GET: DMS/Purchase
        public ActionResult Index()
        {
            PurchaseVM vm = new PurchaseVM();
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

        public ActionResult DetailsIndex()
        {
            PurchaseDetailVM vm = new PurchaseDetailVM();

            var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
            vm.BranchId = Convert.ToInt32(currentBranchId);
            //vm.Branchs = Convert.ToInt32(currentBranchId);
            DateTime currentDate = DateTime.Now;
            DateTime firstDayOfMonth = new DateTime(currentDate.Year, currentDate.Month, 1);
            DateTime lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);
            firstDayOfMonth = firstDayOfMonth.AddMonths(-5);
            //vm.FromDate = firstDayOfMonth.ToString("yyyy/MM/dd");
            //vm.ToDate = lastDayOfMonth.ToString("yyyy/MM/dd");

            #region  UserInfo

            #endregion
            return View(vm);
        }

        public ActionResult Create()
        {
            PurchaseVM vm = new PurchaseVM();
            vm.Operation = "add";
            vm.TransactionType = "Purchase";
            var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
            vm.BranchId = Convert.ToInt32(currentBranchId);
            //var currencyId = Session["CurrencyId"] != null ? Session["CurrencyId"].ToString() : "1";
            //vm.CurrencyId = Convert.ToInt32(currencyId);

            #region DecimalPlace
            CommonVM commonVM = new CommonVM();
            commonVM.Group = "SaleDecimalPlace";
            commonVM.Name = "SaleDecimalPlace";
            var settingsValue = _commonRepo.GetSettingsValue(commonVM);

            if (settingsValue.Status == "Success" && settingsValue.DataVM != null)
            {
                var data = JsonConvert.DeserializeObject<List<CommonVM>>(settingsValue.DataVM.ToString()).FirstOrDefault();

                vm.DecimalPlace = string.IsNullOrEmpty(data.SettingValue) ? 2 : Convert.ToInt32(data.SettingValue);
            }

            #endregion

            return View("Create", vm);
        }

        [HttpPost]
        public ActionResult CreateEdit(PurchaseVM model)
        {
            ResultModel<PurchaseVM> result = new ResultModel<PurchaseVM>();
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new PurchaseRepo();

            
                try
                {

                var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
                model.BranchId = Convert.ToInt32(currentBranchId);
                model.CompanyId = Convert.ToInt32(Session["CompanyId"] != null ? Session["CompanyId"].ToString() : "");


                if (model.Operation.ToLower() == "add")
                    {
                        model.CreatedBy = Session["UserId"].ToString();
                        model.CreatedOn = DateTime.Now.ToString();
                        model.CreatedFrom = Ordinary.GetLocalIpAddress();

                        resultVM = _repo.Insert(model);

                        if (resultVM.Status == ResultStatus.Success.ToString())
                        {
                            model = JsonConvert.DeserializeObject<PurchaseVM>(resultVM.DataVM.ToString());
                            model.Operation = "add";
                            Session["result"] = resultVM.Status + "~" + resultVM.Message;
                            result = new ResultModel<PurchaseVM>()
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

                            result = new ResultModel<PurchaseVM>()
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
                            result = new ResultModel<PurchaseVM>()
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

                            result = new ResultModel<PurchaseVM>()
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
                _repo = new PurchaseRepo();

                PurchaseVM vm = new PurchaseVM();
                CommonVM param = new CommonVM();
                param.Id = id;
                ResultVM result = _repo.List(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<PurchaseVM>>(result.DataVM.ToString()).FirstOrDefault();
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
                var settingsValue = _commonRepo.GetSettingsValue(commonVM);

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

        //Add
        //public ActionResult ImportExcel(PurchaseVM vm)
        //{
        //    ResultModel<PurchaseVM> result = new ResultModel<PurchaseVM>();
        //    try
        //    {
        //        vm.CreatedBy = Session["UserId"].ToString();
        //        vm.CreatedOn = DateTime.Now.ToString();
        //        vm.CreatedFrom = Ordinary.GetLocalIpAddress();
        //        vm.BranchId = Convert.ToInt32(Session["CurrentBranch"].ToString());
        //        vm.TransactionType = "Purchase";

        //        result = ImportExcelFile(vm);

        //        return Json(result);
        //        //return RedirectToAction("Index");
        //    }
        //    catch (Exception ex)
        //    {
        //        return RedirectToAction("Index");
        //    }
        //}


        //[HttpPost]
        //public ResultModel<PurchaseVM> ImportExcelFile(PurchaseVM paramVM)
        //{

        //    ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
        //    _repo = new PurchaseRepo();
        //    DataSet ds;
        //    DataTable dt;
        //    DataTable dtPurchaseM = new DataTable();
        //    string fileName = paramVM.File.FileName;
        //    string Transaction_Type = null;
        //    PurchaseVM vm = new PurchaseVM();
        //    PurchaseDetailExportVM DetailVM = new PurchaseDetailExportVM();
        //    string CustomeDateFormat = null;
        //    CustomeDateFormat = "dd.MM.yyyy";
        //    string pattern = CustomeDateFormat;


        //    try
        //    {

        //        using (var stream = paramVM.File.InputStream)
        //        {
        //            IExcelDataReader reader = null;

        //            if (fileName.EndsWith(".xls"))
        //            {
        //                reader = ExcelReaderFactory.CreateBinaryReader(stream);
        //            }
        //            else if (fileName.EndsWith(".xlsx"))
        //            {
        //                reader = ExcelReaderFactory.CreateOpenXmlReader(stream);
        //            }

        //            if (reader != null)
        //            {
        //                ds = reader.AsDataSet(new ExcelDataSetConfiguration()
        //                {
        //                    ConfigureDataTable = (_) => new ExcelDataTableConfiguration()
        //                    {
        //                        UseHeaderRow = true
        //                    }
        //                });

        //                dt = ds.Tables[0];
        //                reader.Close();

        //                //dtPurchaseM = ds.Tables["PurchaseM"];
        //                dtPurchaseM = ds.Tables["Purchase"];
        //            }

        //        }


        //        #region Invoice Date Check 

        //        string patternData = "yyyy-MM-dd";
        //        bool isFormat = true;

        //        if (!dtPurchaseM.Columns.Contains("Invoice_Date"))
        //        {
        //            throw new ArgumentNullException("", "Invoice Date Column Required in Excel Template");
        //        }

        //        if (dtPurchaseM.Columns.Contains("Invoice_Date"))
        //        {
        //            foreach (DataRow dataRow in dtPurchaseM.Rows)
        //            {
        //                DateTime parsedDate;

        //                if (DateTime.TryParseExact(dataRow["Invoice_Date"].ToString().Trim(), pattern, null, DateTimeStyles.None, out parsedDate))
        //                {
        //                    dataRow["Invoice_Date"] = parsedDate.ToString("yyyy-MM-dd");
        //                }

        //            }
        //        }

        //        if (dtPurchaseM.Columns.Contains("Invoice_Date"))
        //        {
        //            foreach (DataRow dataRow in dtPurchaseM.Rows)
        //            {
        //                if (!DateTime.TryParseExact(dataRow["Invoice_Date"].ToString().Trim(), patternData,
        //                                            CultureInfo.InvariantCulture, DateTimeStyles.None, out _))
        //                {
        //                    isFormat = false;

        //                    return new ResultModel<PurchaseVM>()
        //                    {
        //                        Success = false,
        //                        Status = Status.Fail,
        //                        Message = " Invalid Date Format!",
        //                        Data = null
        //                    };

        //                }
        //            }
        //        }

        //        #endregion

        //        #region Quantity

        //        bool isQuantityValid = true;

        //        if (!dtPurchaseM.Columns.Contains("Quantity"))
        //        {
        //            throw new ArgumentNullException("", "Invoice Quantity Column Required in Excel Template");
        //        }
        //        foreach (DataRow row in dtPurchaseM.Rows)
        //        {
        //            if (Convert.ToDecimal(row["Quantity"]) <= 0)
        //            {
        //                isQuantityValid = false;
        //                return new ResultModel<PurchaseVM>()
        //                {
        //                    Success = false,
        //                    Status = Status.Fail,
        //                    Message = "Please Provide Quantity!",
        //                    Data = null
        //                };
        //            }
        //        }

        //        #endregion


        //        DataRow dataRowM = dtPurchaseM.Rows[0];

        //        vm.BENumber = "";
        //        vm.BranchId = 0;
        //        vm.Code = null;
        //        vm.Comments = "";
        //        vm.CreatedBy = paramVM.CreatedBy;
        //        vm.CreatedOn = paramVM.CreatedOn;
        //        vm.CreatedFrom = paramVM.CreatedFrom;
        //        vm.CurrencyId = 0;
        //        vm.CustomHouse = "";
        //        vm.FromDate = "";
        //        vm.GrandTotalAmount = 0;
        //        vm.GrandTotalSDAmount = 0;
        //        vm.GrandTotalVATAmount = 0;
        //        vm.ImportIDExcel = "0";
        //        vm.Id = 0;
        //        vm.InvoiceDateTime = dataRowM["Invoice_Date"].ToString();
        //        vm.IsCompleted = false;
        //        vm.IsPost = false;
        //        vm.Operation = "add";
        //        vm.PurchaseDate = dataRowM["Invoice_Date"].ToString();
        //        vm.SupplierId = 0;
        //        vm.TransactionType = "Purchase";


        //        foreach (DataRow dataRow in dtPurchaseM.Rows)
        //        {
        //            DetailVM = new PurchaseDetailExportVM();

        //            DetailVM.BranchId = 0;
        //            DetailVM.Comments = "";
        //            DetailVM.Id = 0;
        //            DetailVM.IsFixedVAT = false;
        //            DetailVM.IsPost = false;
        //            DetailVM.LineTotal = 0;
        //            DetailVM.OthersAmount = 0;
        //            DetailVM.ProductId = 0;
        //            DetailVM.ProductName = "";
        //            DetailVM.Quantity = Convert.ToDecimal(dataRow["Quantity"].ToString());
        //            DetailVM.SD = 0;
        //            DetailVM.SDAmount = 0;
        //            DetailVM.SubTotal = 0;
        //            DetailVM.UOMId = 0;
        //            DetailVM.UOMName = "";
        //            DetailVM.UnitPrice = 0;
        //            DetailVM.VATAmount = 0;
        //            DetailVM.VATRate = 0;

        //            DetailVM.ProductCode = dataRow["Product_Code"].ToString();
        //            DetailVM.UOMCode = dataRow["UOM_Code"].ToString();
        //            DetailVM.PurchaseCode = dataRow["Purchase_Code"].ToString();
        //            DetailVM.BranchCode = dataRow["Branch_Code"].ToString();
        //            DetailVM.SupplierCode = dataRow["Supplier_Code"].ToString();
        //            DetailVM.InvoiceDateTime = dataRow["Invoice_Date"].ToString();

        //            vm.purchaseDetailExportList.Add(DetailVM);

        //        }

        //        resultVM = _repo.ImportExcelFileInsert(vm);

        //        if (resultVM.Status.ToLower() != "success")
        //        {
        //            return new ResultModel<PurchaseVM>()
        //            {
        //                Success = false,
        //                Status = Status.Fail,
        //                Message = resultVM.Message,
        //                Data = null
        //            };

        //        }

        //        return new ResultModel<PurchaseVM>()
        //        {
        //            Success = false,
        //            Status = Status.Success,
        //            Message = "Data Saved Successfully!",
        //            Data = null
        //        };

        //    }

        //    catch (Exception ex)
        //    {
        //        Console.WriteLine("Error: " + ex.Message);
        //    }

        //    return new ResultModel<PurchaseVM>()
        //    {
        //        Success = false,
        //        Status = Status.Fail,
        //        Message = "Fail!",
        //        Data = null
        //    };

        //}

        //End

        [HttpGet]
        public ActionResult GetPurchaseData(string id)
        {
            try
            {
                _repo = new PurchaseRepo();

                PurchaseVM vm = new PurchaseVM();
                CommonVM param = new CommonVM();
                param.Id = id;
                ResultVM result = _repo.List(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<PurchaseVM>>(result.DataVM.ToString()).FirstOrDefault();
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
                var settingsValue = _commonRepo.GetSettingsValue(commonVM);

                if (settingsValue.Status == "Success" && settingsValue.DataVM != null)
                {
                    var data = JsonConvert.DeserializeObject<List<CommonVM>>(settingsValue.DataVM.ToString()).FirstOrDefault();

                    vm.DecimalPlace = string.IsNullOrEmpty(data.SettingValue) ? 2 : Convert.ToInt32(data.SettingValue);
                }

                #endregion

                return Json(vm, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Session["result"] = "Fail" + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return RedirectToAction("Index");
            }
        }

        public ActionResult NextPrevious(int id, string status)
        {
            _commonRepo = new CommonRepo();
            try
            {
                CommonVM vm = new CommonVM();
                vm.Id = id.ToString();
                vm.Status = status;
                vm.Type = "transactional";
                vm.TableName = "Purchases";

                ResultVM result = _commonRepo.NextPrevious(vm);

                if (result.Id != "0")
                {
                    string url = Url.Action("Edit", "Purchase", new { area = "DMS", id = result.Id });
                    return Redirect(url);
                }
                else
                {
                    string url = Url.Action("Edit", "Purchase", new { area = "DMS", id = id });
                    return Redirect(url);
                }
            }
            catch (Exception e)
            {
                Session["result"] = "Fail" + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return RedirectToAction("Index");
            }
        }

        [HttpGet]
        public JsonResult GetPurchaseDetailDataById(GridOptions options, int masterId)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new PurchaseRepo();

            try
            {
                result = _repo.GetPurchaseDetailDataById(options, masterId);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<PurchaseOrderDetailVM>>(result.DataVM.ToString());

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
        public ActionResult Delete(PurchaseVM vm)
        {
            ResultModel<PurchaseVM> result = new ResultModel<PurchaseVM>();

            try
            {
                _repo = new PurchaseRepo();

                CommonVM param = new CommonVM();

                param.IDs = vm.IDs;
                param.ModifyBy = Session["UserId"].ToString();
                param.ModifyFrom = Ordinary.GetLocalIpAddress();

                ResultVM resultData = _repo.Delete(param);

                Session["result"] = resultData.Status + "~" + resultData.Message;

                if (resultData.Status == "Success")
                {
                    result = new ResultModel<PurchaseVM>()
                    {
                        Success = true,
                        Status = Status.Success,
                        Message = resultData.Message,
                        Data = null
                    };
                }
                else
                {
                    result = new ResultModel<PurchaseVM>()
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
        public ActionResult MultiplePost(PurchaseVM vm)
        {
            ResultModel<PurchaseVM> result = new ResultModel<PurchaseVM>();

            try
            {
                _repo = new PurchaseRepo();

                CommonVM param = new CommonVM();

                param.IDs = vm.IDs;
                param.ModifyBy = Session["UserId"].ToString();
                param.ModifyFrom = Ordinary.GetLocalIpAddress();

                ResultVM resultData = _repo.MultiplePost(param);

                Session["result"] = resultData.Status + "~" + resultData.Message;

                if (resultData.Status == "Success")
                {
                    result = new ResultModel<PurchaseVM>()
                    {
                        Success = true,
                        Status = Status.Success,
                        Message = resultData.Message,
                        Data = null
                    };
                }
                else
                {
                    result = new ResultModel<PurchaseVM>()
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
        public ActionResult MultipleIsCompleted(PurchaseVM vm)
        {
            ResultModel<PurchaseVM> result = new ResultModel<PurchaseVM>();

            try
            {
                _repo = new PurchaseRepo();

                CommonVM param = new CommonVM();

                param.IDs = vm.IDs;
                param.ModifyBy = Session["UserId"].ToString();
                param.ModifyFrom = Ordinary.GetLocalIpAddress();

                ResultVM resultData = _repo.MultipleIsCompleted(param);

                Session["result"] = resultData.Status + "~" + resultData.Message;

                if (resultData.Status == "Success")
                {
                    result = new ResultModel<PurchaseVM>()
                    {
                        Success = true,
                        Status = Status.Success,
                        Message = resultData.Message,
                        Data = null
                    };
                }
                else
                {
                    result = new ResultModel<PurchaseVM>()
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
        public JsonResult GetGridData(GridOptions options, string branchId, string isPost, string fromDate, string toDate)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new PurchaseRepo();

            try
            {
                options.vm.BranchId = branchId == "0" ? "" : branchId;
                options.vm.IsPost = isPost;
                options.vm.FromDate = fromDate;
                options.vm.ToDate = toDate;
                options.vm.CompanyId = Session["CompanyId"] != null ? Session["CompanyId"].ToString() : "";

                result = _repo.GetGridData(options);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<PurchaseVM>>(result.DataVM.ToString());

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
            _repo = new PurchaseRepo();

            try
            {
                options.vm.BranchId = branchId == "0" ? "" : branchId;
                options.vm.IsPost = isPost;
                options.vm.FromDate = fromDate;
                options.vm.ToDate = toDate;

                result = _repo.GetDetailsGridData(options);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<PurchaseDetailVM>>(result.DataVM.ToString());

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
        public JsonResult FromPurchaseGridData(GridOptions options)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new PurchaseRepo();

            try
            {
                result = _repo.FromPurchaseGridData(options);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<PurchaseVM>>(result.DataVM.ToString());

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
        public ActionResult FromPurchaseOrder()
        {
            PurchaseOrderVM vm = new PurchaseOrderVM();
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
        public ActionResult GetFromPurchaseOrder(CommonVM vm)
        {
            try
            {
                PurchaseOrderRepo _repoo = new PurchaseOrderRepo();

                PurchaseVM purchase = new PurchaseVM();
                ResultVM result = _repoo.PurchaseOrderList(vm);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    purchase = JsonConvert.DeserializeObject<List<PurchaseVM>>(result.DataVM.ToString()).FirstOrDefault();
                }
                else
                {
                    TempData["message"] = result.Message;
                    return RedirectToAction("FromPurchaseOrder", "Purchase", new { area = "DMS" });
                }

                purchase.Operation = "add";
                purchase.IsPost = false;

                #region DecimalPlace
                CommonVM commonVM = new CommonVM();
                commonVM.Group = "SaleDecimalPlace";
                commonVM.Name = "SaleDecimalPlace";
                var settingsValue = _commonRepo.GetSettingsValue(commonVM);

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
        public async Task<ActionResult> ReportPreview(CommonVM param)
        {
            try
            {
                _repo = new PurchaseRepo();
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

                    Response.Headers.Add("Content-Disposition", "inline; filename=Purchase_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".pdf");

                    return File(fileBytes, "application/pdf");
                }
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                TempData["Message"] = e.Message.ToString();
                return RedirectToAction("Index", "Purchase", new { area = "DMS", message = TempData["Message"] });
            }
        }

        private bool IsEmptyObject(object obj)
        {
            if (obj == null) return true;

            var type = obj.GetType();

            // Check all properties
            foreach (var property in type.GetProperties())
            {
                var value = property.GetValue(obj);

                // If any property has a non-null and non-default value, it's not empty
                if (value != null && !IsDefaultValue(value)) return false;

                // If property is a collection, check if it has elements
                if (value is IEnumerable<object> collection && collection.Any()) return false;
            }

            return true; // If no meaningful data found, return true (object is empty)
        }
        private bool IsDefaultValue(object value)
        {
            var type = value.GetType();

            // Handle value types (int, bool, etc.)
            if (type.IsValueType) return Activator.CreateInstance(type).Equals(value);

            // Handle empty strings
            if (value is string strValue) return string.IsNullOrWhiteSpace(strValue);

            return false;
        }

        //public async Task<FileResult> ExportPurchaseExcel(string branchId, string isPosted, string fromDate, string toDate)
        //{
        //    try
        //    {
        //        var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
        //        CommonVM commonVM = new CommonVM();
        //        commonVM.BranchId = branchId;
        //        commonVM.IsPost = isPosted;
        //        commonVM.FromDate = fromDate;
        //        commonVM.ToDate = toDate;

        //        DataTable dt = new DataTable();
        //        GridOptions options = new GridOptions();
        //        _repo = new PurchaseRepo();
        //        ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;

        //        var result = _repo.ExportPurchaseExcel(commonVM);

        //        if (result.Status == "Success" && result.DataVM != null)
        //        {
        //            var data = JsonConvert.DeserializeObject<List<PurchaseSummaryVM>>(result.DataVM.ToString());

        //            dt = Extensions.ConvertToDataTable(data);
        //        }

        //        // Rename columns directly within the function
        //        Dictionary<string, string> columnMappings = new Dictionary<string, string>
        //            {

        //                { "Code", "Purchase_Code" },
        //                { "BranchCode", "Branch_Code" },
        //                { "SupplierCode", "Supplier_Code" },
        //                { "InvoiceDate", "Invoice_Date" },
        //                { "ProductCode", "Product_Code" },
        //                { "UOMCode", "UOM_Code" },
        //                { "Quantity", "Quantity" }

        //                //{ "Code", "Purchase Code" },
        //                //{ "SupplierName", "Supplier Name" },
        //                //{ "InvoiceDate", "Invoice Date" },
        //                //{ "PurchaseDate", "Purchase Date" },
        //                //{ "BENumber", "BE Number" },
        //                //{ "FiscalYear", "Fiscal Year" },
        //                //{ "TransactionType", "Transaction Type" },
        //                //{ "CurrencyName", "Currency Name" },
        //                //{ "ProductGroupCode", "Product Group Code" },
        //                //{ "BranchCode", "Branch Code" },
        //                //{ "Quantity", "Quantity" },
        //                //{ "UnitPrice", "Unit Price" },
        //                //{ "SDRate", "SD Rate" },
        //                //{ "VATRate", "VAT Rate" }
        //            };
        //        foreach (var column in columnMappings)
        //        {
        //            if (dt.Columns.Contains(column.Key))
        //            {
        //                dt.Columns[column.Key].ColumnName = column.Value;
        //            }
        //        }

        //        if (dt.Rows.Count > 0)
        //        {
        //            using (var package = new ExcelPackage())
        //            {
        //                var worksheet = package.Workbook.Worksheets.Add("Purchase");
        //                var range = worksheet.Cells["A1"].LoadFromDataTable(dt, true);

        //                var headerRow = range.Worksheet.Row(1);
        //                headerRow.Style.Font.Bold = true;

        //                for (int col = 1; col <= dt.Columns.Count; col++)
        //                {
        //                    var cell = worksheet.Cells[1, col];
        //                    cell.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
        //                    cell.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.Gray);
        //                }

        //                var dataRange = range.Offset(1, 0, range.Rows - 1, range.Columns);
        //                dataRange.Style.Border.Top.Style = ExcelBorderStyle.Thin;
        //                dataRange.Style.Border.Left.Style = ExcelBorderStyle.Thin;
        //                dataRange.Style.Border.Right.Style = ExcelBorderStyle.Thin;
        //                dataRange.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;

        //                var totalAmountColumn = worksheet.Cells[2, 7, range.End.Row, 7];
        //                totalAmountColumn.Style.Numberformat.Format = "#,##0.00";

        //                using (var memoryStream = new MemoryStream())
        //                {
        //                    package.SaveAs(memoryStream);
        //                    memoryStream.Position = 0;
        //                    return File(memoryStream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Purchase-" + DateTime.Now.ToString("yyyy-MM-dd-HHmmss") + ".xlsx");
        //                }
        //            }
        //        }
        //        else
        //        {
        //            using (var package = new ExcelPackage())
        //            {
        //                var worksheet = package.Workbook.Worksheets.Add("Purchase");
        //                using (var memoryStream = new MemoryStream())
        //                {
        //                    package.SaveAs(memoryStream);
        //                    memoryStream.Position = 0;
        //                    return File(memoryStream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Purchase-" + DateTime.Now.ToString("yyyy-MM-dd-HHmmss") + ".xlsx");
        //                }
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //}


        //public ActionResult SummaryReport(string fromDate, string toDate, string branchId, string type, string isPost)
        //{
        //    _commonRepo = new CommonRepo();
        //    _repo = new PurchaseRepo();
        //    BranchProfileRepo _branchRepo = new BranchProfileRepo();
        //    try
        //    {
        //        string BranchName = "";
        //        string BranchAddress = "";
        //        string CompanyName = "";

        //        CommonVM vm = new CommonVM();
        //        vm.ToDate = toDate;
        //        vm.FromDate = fromDate;
        //        vm.Type = type;
        //        vm.Id = branchId == "0" ? "" : branchId;
        //        vm.IsPost = isPost.ToString();
        //        vm.BranchId = branchId == "0" ? "" : branchId;

        //        if (vm.BranchId == "")
        //        {
        //            BranchName = "ALL";
        //        }
        //        else
        //        {
        //            var branchResult = _branchRepo.List(vm);

        //            if (branchResult != null && branchResult.Status == "Success" && branchResult.DataVM != null)
        //            {
        //                var data = JsonConvert.DeserializeObject<List<BranchProfileVM>>(branchResult.DataVM.ToString());

        //                if (data.Count > 0)
        //                {
        //                    BranchName = data.FirstOrDefault()?.Name;
        //                    BranchAddress = data.FirstOrDefault()?.Address;
        //                }
        //            }
        //        }

        //        DataTable dt = new DataTable();
        //        GridOptions options = new GridOptions();
        //        options.vm.BranchId = branchId == "0" ? "" : branchId;
        //        options.vm.IsPost = isPost.ToString();
        //        options.vm.FromDate = fromDate;
        //        options.vm.ToDate = toDate;

        //        var result = _repo.SummaryReport(vm);

        //        if (result.Status == "Success" && result.DataVM != null)
        //        {
        //            var data = JsonConvert.DeserializeObject<List<PurchaseReportVM>>(result.DataVM.ToString());

        //            dt = Extensions.ConvertToDataTable(data);
        //        }


        //        dt.Columns["SL"].ColumnName = "Serial NO.";
        //        dt.Columns["ProductId"].ColumnName = "Product Id ";
        //        dt.Columns["ProductGroupName"].ColumnName = "Product Group Name ";
        //        dt.Columns["ProductCode"].ColumnName = "Product Code ";
        //        dt.Columns["ProductName"].ColumnName = "Product Name";
        //        dt.Columns["HSCodeNo"].ColumnName = "HS Code No";
        //        dt.Columns["UOMName"].ColumnName = "UOM Name";
        //        dt.Columns["Quantity"].ColumnName = "Quantity";

        //        #region Excel

        //        string filename = "Purchase Summary Report " + "-" + DateTime.Now.ToString("yyyyMMddHHmmss");
        //        ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;

        //        ExcelPackage excel = new ExcelPackage();
        //        var workSheet = excel.Workbook.Worksheets.Add("Purchase Summary Report");

        //        ExcelSheetFormat(dt, workSheet, fromDate, toDate, BranchName, BranchAddress, CompanyName);

        //        #region Excel Download
        //        using (var memoryStream = new MemoryStream())
        //        {
        //            excel.SaveAs(memoryStream);
        //            return File(memoryStream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", filename + ".xlsx");
        //        }
        //        #endregion

        //        #endregion
        //    }
        //    catch (Exception e)
        //    {
        //        throw;
        //    }
        //}

        //#region ExcelSheetFormat
        //public void ExcelSheetFormat(DataTable dt, ExcelWorksheet workSheet, string fromDate, string toDate, string BranchName, string BranchAddress, string CompanyName)
        //{
        //    // Add 4 additional headers
        //    string companyName = "Company Name: " + CompanyName;
        //    string branchName = "    Branch Name: " + BranchName;
        //    string branchAddress = "Branch Address: " + BranchAddress;
        //    string reportHeader = "Purchase Summary Report";

        //    // Update the length of the ReportHeaders array to accommodate the additional headers
        //    string[] ReportHeaders = new string[] { companyName, branchName, branchAddress, reportHeader };

        //    int TableHeadRow = ReportHeaders.Length + 4; // Add 4 additional headers and 2 rows for From Date and To Date

        //    int RowCount = dt.Rows.Count;
        //    int ColumnCount = dt.Columns.Count;
        //    int GrandTotalRow = TableHeadRow + RowCount + 1;

        //    workSheet.Cells[TableHeadRow, 1].LoadFromDataTable(dt, true);

        //    var format = new OfficeOpenXml.ExcelTextFormat();
        //    format.Delimiter = '~';
        //    format.TextQualifier = '"';
        //    format.DataTypes = new[] { eDataTypes.String };

        //    // Loop through the ReportHeaders array to format and load the headers into the worksheet
        //    for (int i = 0; i < ReportHeaders.Length; i++)
        //    {
        //        workSheet.Cells[i + 1, 1, i + 1, ColumnCount].Merge = true;
        //        workSheet.Cells[i + 1, 1, i + 1, ColumnCount].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
        //        workSheet.Cells[i + 1, 1, i + 1, ColumnCount].Style.Fill.PatternType = ExcelFillStyle.Solid;
        //        workSheet.Cells[i + 1, 1, i + 1, ColumnCount].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.Yellow);

        //        // Set the font size based on the header
        //        switch (i)
        //        {
        //            case 0: // Company Name
        //                workSheet.Cells[i + 1, 1].Style.Font.Size = 18;
        //                break;
        //            case 1: // Company Address
        //            case 2: // Branch Name
        //                workSheet.Cells[i + 1, 1].Style.Font.Size = 14;
        //                break;
        //            case 3: //  Report Type
        //                workSheet.Cells[i + 1, 1].Style.Font.Size = 16;
        //                break;
        //        }

        //        workSheet.Cells[i + 1, 1].LoadFromText(ReportHeaders[i], format);
        //    }

        //    // Add a row for From Date and To Date
        //    workSheet.Cells[ReportHeaders.Length + 2, 2].Value = "From Date:";
        //    workSheet.Cells[ReportHeaders.Length + 2, 3].Value = fromDate;
        //    workSheet.Cells[ReportHeaders.Length + 2, 4].Value = "To Date:";
        //    workSheet.Cells[ReportHeaders.Length + 2, 5].Value = toDate;
        //    int colNumber = 0;

        //    foreach (DataColumn col in dt.Columns)
        //    {
        //        colNumber++;
        //        if (col.DataType == typeof(DateTime))
        //        {
        //            workSheet.Column(colNumber).Style.Numberformat.Format = "dd-MMM-yyyy";
        //        }
        //        else if (col.DataType == typeof(Decimal))
        //        {
        //            if (col.ColumnName != "Balance")
        //            {
        //                workSheet.Column(colNumber).Style.Numberformat.Format = "#,##0.00_);[Red](#,##0.00)";
        //                workSheet.Cells[GrandTotalRow, colNumber].Formula = "=Sum(" + workSheet.Cells[TableHeadRow + 1, colNumber].Address + ":" + workSheet.Cells[(TableHeadRow + RowCount), colNumber].Address + ")";
        //            }
        //            else { workSheet.Column(colNumber).Style.Numberformat.Format = "#,##0.00_);[Red](#,##0.00)"; }
        //        }

        //        // Set the column width to fit the content
        //        workSheet.Column(colNumber).AutoFit();
        //    }

        //    workSheet.Cells[TableHeadRow, 1, TableHeadRow, ColumnCount].Style.Font.Bold = true;
        //    workSheet.Cells[GrandTotalRow, 1, GrandTotalRow, ColumnCount].Style.Font.Bold = true;

        //    workSheet.Cells["A" + TableHeadRow + ":" + Extensions.Alphabet[ColumnCount - 1] + (TableHeadRow + RowCount + 2)].Style.Border.Top.Style = ExcelBorderStyle.Thin;
        //    workSheet.Cells["A" + TableHeadRow + ":" + Extensions.Alphabet[ColumnCount] + (TableHeadRow + RowCount + 1)].Style.Border.Left.Style = ExcelBorderStyle.Thin;
        //    workSheet.Cells[GrandTotalRow, 1].LoadFromText("Grand Total");
        //}

        //#endregion



    }
}
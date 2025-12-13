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
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace ShampanPOSUI.Areas.DMS.Controllers
{
    [Authorize]
    [RouteArea("DMS")]
    public class SaleDeliveryReturnController : Controller
    {
        private readonly ApplicationDbContext _applicationDb;
        SaleDeliveryReturnRepo _repo = new SaleDeliveryReturnRepo();
        CommonRepo _commonRepo = new CommonRepo();

        // GET: DMS/SaleDeliveryReturn
        public ActionResult Index()
        {
            SaleDeliveryReturnVM vm = new SaleDeliveryReturnVM();
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
            SaleDeliveryReturnDetails vm = new SaleDeliveryReturnDetails();

            var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
            vm.BranchId = Convert.ToInt32(currentBranchId);
            vm.Branchs = Convert.ToInt32(currentBranchId);
            DateTime currentDate = DateTime.Now;
            DateTime firstDayOfMonth = new DateTime(currentDate.Year, currentDate.Month, 1);
            DateTime lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);
            firstDayOfMonth = firstDayOfMonth.AddMonths(-5);
            vm.FromDate = firstDayOfMonth.ToString("yyyy/MM/dd");
            vm.ToDate = lastDayOfMonth.ToString("yyyy/MM/dd");

            #region  UserInfo


            //string userName = User.Identity.Name;
            //ApplicationUser user = _applicationDb.Users.FirstOrDefault(model => model.UserName == userName);

            // vm.IsPushAllow = user.IsPushAllow;
            #endregion
            return View(vm);
        }

        public ActionResult Create()
        {
            SaleDeliveryReturnVM vm = new SaleDeliveryReturnVM();
            vm.Operation = "add";
			vm.TransactionType = "SaleDeliveryReturn";
			var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
            vm.BranchId = Convert.ToInt32(currentBranchId);
            vm.UOMId = Convert.ToInt32(0);
            var currencyId = Session["CurrencyId"] != null ? Session["CurrencyId"].ToString() : "1";
            vm.CurrencyId = Convert.ToInt32(currencyId);

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
        public ActionResult CreateEdit(SaleDeliveryReturnVM model)
        {
            ResultModel<SaleDeliveryReturnVM> result = new ResultModel<SaleDeliveryReturnVM>();
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new SaleDeliveryReturnRepo();
            
            
                try
                {
                    if (model.Operation.ToLower() == "add")
                    {
                        model.CreatedBy = Session["UserId"].ToString();
                        model.CreatedOn = DateTime.Now.ToString();
                        model.CreatedFrom = Ordinary.GetLocalIpAddress();                        

                        resultVM = _repo.Insert(model);

                        if (resultVM.Status == ResultStatus.Success.ToString())
                        {
                            model = JsonConvert.DeserializeObject<SaleDeliveryReturnVM>(resultVM.DataVM.ToString());
                            model.Operation = "add";
                            Session["result"] = resultVM.Status + "~" + resultVM.Message;
                            result =  new ResultModel<SaleDeliveryReturnVM>()
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

                            result = new ResultModel<SaleDeliveryReturnVM>()
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
                            result = new ResultModel<SaleDeliveryReturnVM>()
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

                            result = new ResultModel<SaleDeliveryReturnVM>()
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
                
                //return Json(result);
            
        }

        [HttpGet]
        public ActionResult Edit(string id)
        {
            try
            {
                _repo = new SaleDeliveryReturnRepo();

                SaleDeliveryReturnVM vm = new SaleDeliveryReturnVM();
                CommonVM param = new CommonVM();
                param.Id = id;
                ResultVM result = _repo.List(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<SaleDeliveryReturnVM>>(result.DataVM.ToString()).FirstOrDefault();
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

        [HttpPost]
        public ActionResult Delete(SaleDeliveryReturnVM vm)
        {
            ResultModel<SaleDeliveryReturnVM> result = new ResultModel<SaleDeliveryReturnVM>();

            try
            {
                _repo = new SaleDeliveryReturnRepo();

                CommonVM param = new CommonVM();

                param.IDs = vm.IDs;
                param.ModifyBy = Session["UserId"].ToString();
                param.ModifyFrom = Ordinary.GetLocalIpAddress();

                ResultVM resultData = _repo.Delete(param);

                Session["result"] = resultData.Status + "~" + resultData.Message;

                result = new ResultModel<SaleDeliveryReturnVM>()
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
        public JsonResult GetGridData(GridOptions options, string isPost, string branchId, string fromDate, string toDate)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new SaleDeliveryReturnRepo();

            try
            {
                options.vm.BranchId = branchId == "0" ? "" : branchId;
                options.vm.FromDate = fromDate;
                options.vm.IsPost = isPost;
                options.vm.ToDate = toDate;
                result = _repo.GetGridData(options);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<SaleDeliveryReturnVM>>(result.DataVM.ToString());

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




        public JsonResult GetDetailsGridData(GridOptions options, string isPost, string branchId, string fromDate, string toDate)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new SaleDeliveryReturnRepo();
            try
            {
                options.vm.BranchId = branchId == "0" ? "" : branchId;
                options.vm.FromDate = fromDate;
                options.vm.ToDate = toDate;
                options.vm.IsPost = isPost;

                result = _repo.GetDetailsGridData(options);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<SaleDeliveryReturnDetails>>(result.DataVM.ToString());

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
        public ActionResult MultiplePost(SaleDeliveryReturnVM vm)
        {
            ResultModel<SaleDeliveryReturnVM> result = new ResultModel<SaleDeliveryReturnVM>();

            try
            {
                _repo = new SaleDeliveryReturnRepo();

                CommonVM param = new CommonVM();

                param.IDs = vm.IDs;
                param.ModifyBy = Session["UserId"].ToString();
                param.ModifyFrom = Ordinary.GetLocalIpAddress();

                ResultVM resultData = _repo.MultiplePost(param);

                Session["result"] = resultData.Status + "~" + resultData.Message;

                result = new ResultModel<SaleDeliveryReturnVM>()
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
        public ActionResult FromSaleDelivery()
        {
            SaleDeliveryReturnVM vm = new SaleDeliveryReturnVM();
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
        public JsonResult FromSaleDeliveryGridData(GridOptions options)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new SaleDeliveryReturnRepo();

            try
            {
                result = _repo.FromSaleDeliveryGridData(options);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<SaleDeliveryVM>>(result.DataVM.ToString());

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
        public ActionResult GetFromSaleDelivery(CommonVM vm)
        {
            try
            {
                SaleDeliveryRepo _repoo = new SaleDeliveryRepo();

                SaleDeliveryReturnVM saleDeliveryReturn = new SaleDeliveryReturnVM();
                vm.Id = vm.IDs[0];
                ResultVM result = _repoo.SaleDeliveryList(vm);
                if (result.Status == "Success" && result.DataVM != null)
                {
                    saleDeliveryReturn = JsonConvert.DeserializeObject<List<SaleDeliveryReturnVM>>(result.DataVM.ToString()).FirstOrDefault();
                }

                saleDeliveryReturn.Operation = "add";
                saleDeliveryReturn.IsPost = false;
                saleDeliveryReturn.InvoiceDateTime = DateTime.Now.ToString("yyyy-MM-dd");
                saleDeliveryReturn.DeliveryDate = DateTime.Now.ToString("yyyy-MM-dd");
                saleDeliveryReturn.SaleDeliveryId = saleDeliveryReturn.Id;

                #region DecimalPlace
                CommonVM commonVM = new CommonVM();
                commonVM.Group = "SaleDecimalPlace";
                commonVM.Name = "SaleDecimalPlace";
                var settingsValue = _commonRepo.GetSettingsValue(commonVM);

                if (settingsValue.Status == "Success" && settingsValue.DataVM != null)
                {
                    var data = JsonConvert.DeserializeObject<List<CommonVM>>(settingsValue.DataVM.ToString()).FirstOrDefault();

                    saleDeliveryReturn.DecimalPlace = string.IsNullOrEmpty(data.SettingValue) ? 2 : Convert.ToInt32(data.SettingValue);
                }

                #endregion

                return View("Create", saleDeliveryReturn);
            }
            catch (Exception e)
            {
                Session["result"] = "Fail" + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return RedirectToAction("Index");
            }
        }

        [HttpGet]
        public JsonResult GetSaleDeliveryReturnDetailDataById(GridOptions options, int masterId)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new SaleDeliveryReturnRepo();

            try
            {
                result = _repo.GetSaleDeliveryReturnDetailDataById(options, masterId);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<SaleDeliveryDetailVM>>(result.DataVM.ToString());

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


        public ActionResult NextPrevious(int id, string status)
        {
            _commonRepo = new CommonRepo();
            try
            {
                CommonVM vm = new CommonVM();
                vm.Id = id.ToString();
                vm.Status = status;
                vm.Type = "transactional";
                vm.TableName = "SaleDeleveryReturns";

                ResultVM result = _commonRepo.NextPrevious(vm);

                if (result.Id != "0")
                {
                    string url = Url.Action("Edit", "SaleDeliveryReturn", new { area = "DMS", id = result.Id });
                    return Redirect(url);
                }
                else
                {
                    string url = Url.Action("Edit", "SaleDeliveryReturn", new { area = "DMS", id = id });
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

        [HttpPost]
        public async Task<ActionResult> ReportPreview(CommonVM param)
        {
            try
            {
                _repo = new SaleDeliveryReturnRepo();
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

                    Response.Headers.Add("Content-Disposition", "inline; filename=SaleDeliveryReturn_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".pdf");

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

        public ActionResult SummaryReport(string fromDate, string toDate, string branchId, string type, string isPost )
        {
            _commonRepo = new CommonRepo();
            _repo = new SaleDeliveryReturnRepo();
            BranchProfileRepo _branchRepo = new BranchProfileRepo();
            try
            {
                string BranchName = "";
                string BranchAddress = "";
                string CompanyName = "";

                CommonVM vm = new CommonVM();
                vm.ToDate = toDate;
                vm.FromDate = fromDate;
                vm.Type = type;
                vm.Id = branchId == "0" ? "" : branchId;
                vm.BranchId = branchId == "0" ? "" : branchId;
                vm.IsPost = isPost;

                if (vm.BranchId == "")
                {
                    BranchName = "ALL";
                }
                else
                {
                    var branchResult = _branchRepo.List(vm);

                    if (branchResult != null && branchResult.Status == "Success" && branchResult.DataVM != null)
                    {
                        var data = JsonConvert.DeserializeObject<List<BranchProfileVM>>(branchResult.DataVM.ToString());

                        if (data.Count > 0)
                        {
                            BranchName = data.FirstOrDefault()?.Name;
                            BranchAddress = data.FirstOrDefault()?.Address;
                        }
                    }
                }

                DataTable dt = new DataTable();
                GridOptions options = new GridOptions();
                options.vm.BranchId = branchId == "0" ? "" : branchId;
                options.vm.IsPost = isPost.ToString();
                options.vm.FromDate = fromDate;
                options.vm.ToDate = toDate;

                var result = _repo.SummaryReport(vm);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var data = JsonConvert.DeserializeObject<List<SaleDeliveryReportVM>>(result.DataVM.ToString());

                    dt = Extensions.ConvertToDataTable(data);
                }


                dt.Columns["SL"].ColumnName = "Serial NO.";
                dt.Columns["ProductId"].ColumnName = "Product Id ";
                dt.Columns["ProductGroupName"].ColumnName = "Product Group Name ";
                dt.Columns["ProductCode"].ColumnName = "Product Code ";
                dt.Columns["ProductName"].ColumnName = "Product Name";
                dt.Columns["HSCodeNo"].ColumnName = "HS Code No";
                dt.Columns["UOMName"].ColumnName = "UOM Name";
                dt.Columns["Quantity"].ColumnName = "Quantity";

                #region Excel

                string filename = "Sale Delivery Return Summary Report " + "-" + DateTime.Now.ToString("yyyyMMddHHmmss");
                ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;

                ExcelPackage excel = new ExcelPackage();
                var workSheet = excel.Workbook.Worksheets.Add("Sale Delivery Return Summary Report");

                ExcelSheetFormat(dt, workSheet, fromDate, toDate, BranchName, BranchAddress, CompanyName);

                #region Excel Download
                using (var memoryStream = new MemoryStream())
                {
                    excel.SaveAs(memoryStream);
                    return File(memoryStream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", filename + ".xlsx");
                }
                #endregion

                #endregion
            }
            catch (Exception e)
            {
                throw;
            }
        }

        #region ExcelSheetFormat
        public void ExcelSheetFormat(DataTable dt, ExcelWorksheet workSheet, string fromDate, string toDate, string BranchName, string BranchAddress, string CompanyName)
        {
            // Add 4 additional headers
            string companyName = "Company Name: " + CompanyName;
            string branchName = "    Branch Name: " + BranchName;
            string branchAddress = "Branch Address: " + BranchAddress;
            string reportHeader = "Sale Delivery Return Summary Report";

            // Update the length of the ReportHeaders array to accommodate the additional headers
            string[] ReportHeaders = new string[] { companyName, branchName, branchAddress, reportHeader };

            int TableHeadRow = ReportHeaders.Length + 4; // Add 4 additional headers and 2 rows for From Date and To Date

            int RowCount = dt.Rows.Count;
            int ColumnCount = dt.Columns.Count;
            int GrandTotalRow = TableHeadRow + RowCount + 1;

            workSheet.Cells[TableHeadRow, 1].LoadFromDataTable(dt, true);

            var format = new OfficeOpenXml.ExcelTextFormat();
            format.Delimiter = '~';
            format.TextQualifier = '"';
            format.DataTypes = new[] { eDataTypes.String };

            // Loop through the ReportHeaders array to format and load the headers into the worksheet
            for (int i = 0; i < ReportHeaders.Length; i++)
            {
                workSheet.Cells[i + 1, 1, i + 1, ColumnCount].Merge = true;
                workSheet.Cells[i + 1, 1, i + 1, ColumnCount].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Cells[i + 1, 1, i + 1, ColumnCount].Style.Fill.PatternType = ExcelFillStyle.Solid;
                workSheet.Cells[i + 1, 1, i + 1, ColumnCount].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.Yellow);

                // Set the font size based on the header
                switch (i)
                {
                    case 0: // Company Name
                        workSheet.Cells[i + 1, 1].Style.Font.Size = 18;
                        break;
                    case 1: // Company Address
                    case 2: // Branch Name
                        workSheet.Cells[i + 1, 1].Style.Font.Size = 14;
                        break;
                    case 3: //  Report Type
                        workSheet.Cells[i + 1, 1].Style.Font.Size = 16;
                        break;
                }

                workSheet.Cells[i + 1, 1].LoadFromText(ReportHeaders[i], format);
            }

            // Add a row for From Date and To Date
            workSheet.Cells[ReportHeaders.Length + 2, 2].Value = "From Date:";
            workSheet.Cells[ReportHeaders.Length + 2, 3].Value = fromDate;
            workSheet.Cells[ReportHeaders.Length + 2, 4].Value = "To Date:";
            workSheet.Cells[ReportHeaders.Length + 2, 5].Value = toDate;
            int colNumber = 0;

            foreach (DataColumn col in dt.Columns)
            {
                colNumber++;
                if (col.DataType == typeof(DateTime))
                {
                    workSheet.Column(colNumber).Style.Numberformat.Format = "dd-MMM-yyyy";
                }
                else if (col.DataType == typeof(Decimal))
                {
                    if (col.ColumnName != "Balance")
                    {
                        workSheet.Column(colNumber).Style.Numberformat.Format = "#,##0.00_);[Red](#,##0.00)";
                        workSheet.Cells[GrandTotalRow, colNumber].Formula = "=Sum(" + workSheet.Cells[TableHeadRow + 1, colNumber].Address + ":" + workSheet.Cells[(TableHeadRow + RowCount), colNumber].Address + ")";
                    }
                    else { workSheet.Column(colNumber).Style.Numberformat.Format = "#,##0.00_);[Red](#,##0.00)"; }
                }

                // Set the column width to fit the content
                workSheet.Column(colNumber).AutoFit();
            }

            workSheet.Cells[TableHeadRow, 1, TableHeadRow, ColumnCount].Style.Font.Bold = true;
            workSheet.Cells[GrandTotalRow, 1, GrandTotalRow, ColumnCount].Style.Font.Bold = true;

            workSheet.Cells["A" + TableHeadRow + ":" + Extensions.Alphabet[ColumnCount - 1] + (TableHeadRow + RowCount + 2)].Style.Border.Top.Style = ExcelBorderStyle.Thin;
            workSheet.Cells["A" + TableHeadRow + ":" + Extensions.Alphabet[ColumnCount] + (TableHeadRow + RowCount + 1)].Style.Border.Left.Style = ExcelBorderStyle.Thin;
            workSheet.Cells[GrandTotalRow, 1].LoadFromText("Grand Total");
        }

        #endregion

    }
}
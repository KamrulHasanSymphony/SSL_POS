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
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Data;
using ExcelDataReader;
using System.Globalization;
using DocumentFormat.OpenXml.EMMA;
using DocumentFormat.OpenXml.Wordprocessing;

namespace ShampanPOSUI.Areas.DMS.Controllers
{
    [Authorize]
    [RouteArea("DMS")]
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _applicationDb;
        ProductRepo _repo = new ProductRepo();
        CommonRepo _commonRepo = new CommonRepo();

        // GET: DMS/Product
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Create()
        {
            ProductVM vm = new ProductVM();
            vm.Operation = "add";
            vm.IsActive = true;

            return View("Create", vm);
        }

        [HttpPost]
        public ActionResult CreateEdit(ProductVM model, HttpPostedFileBase file)
        {
            ResultModel<ProductVM> result = new ResultModel<ProductVM>();
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new ProductRepo();



            if (ModelState.IsValid)
            {
                try
                {
                    if (file != null && file.ContentLength > 0)
                    {
                        string uploadsFolder = Server.MapPath("~/Content/Products");

                        if (!Directory.Exists(uploadsFolder))
                        {
                            Directory.CreateDirectory(uploadsFolder);
                        }

                        string fileExtension = Path.GetExtension(file.FileName).ToLower();
                        string[] validImageTypes = { ".jpg", ".jpeg", ".png", ".gif" };

                        if (!validImageTypes.Contains(fileExtension))
                        {
                            result.Message = "Invalid image file type.";
                            return Json(result);
                        }

                        string fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                        string filePath = Path.Combine(uploadsFolder, fileName);

                        file.SaveAs(filePath);

                        model.ImagePath = "/Content/Products/" + fileName;
                    }

                    if (model.Operation.ToLower() == "add")
                    {
                        model.CreatedBy = Session["UserId"].ToString();
                        model.CreatedOn = DateTime.Now.ToString();
                        model.CreatedFrom = Ordinary.GetLocalIpAddress();

                        resultVM = _repo.Insert(model);

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
                        model.LastModifiedOn = DateTime.Now.ToString();
                        model.LastUpdateFrom = Ordinary.GetLocalIpAddress();

                        resultVM = _repo.Update(model);

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
            else
            {
                result = new ResultModel<ProductVM>()
                {
                    Success = false,
                    Status = Status.Fail,
                    Message = "Model State Error!",
                    Data = model
                };
                return Json(result);
            }

        }

        [HttpGet]
        public ActionResult Edit(string id)
        {
            try
            {
                _repo = new ProductRepo();

                ProductVM vm = new ProductVM();
                CommonVM param = new CommonVM();
                param.Id = id;
                ResultVM result = _repo.List(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<ProductVM>>(result.DataVM.ToString()).FirstOrDefault();
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

        public ActionResult NextPrevious(int id, string status)
        {
            _commonRepo = new CommonRepo();
            try
            {
                CommonVM vm = new CommonVM();
                vm.Id = id.ToString();
                vm.Status = status;
                vm.Type = "single";
                vm.TableName = "Products";

                ResultVM result = _commonRepo.NextPrevious(vm);

                if (result.Id != "0")
                {
                    string url = Url.Action("Edit", "Product", new { area = "DMS", id = result.Id });
                    return Redirect(url);
                }
                else
                {
                    string url = Url.Action("Edit", "Product", new { area = "DMS", id = id });
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
        public ActionResult Delete(ProductVM vm)
        {
            ResultModel<ProductVM> result = new ResultModel<ProductVM>();

            try
            {
                _repo = new ProductRepo();

                CommonVM param = new CommonVM();

                param.IDs = vm.IDs;
                param.ModifyBy = Session["UserId"].ToString();
                param.ModifyFrom = Ordinary.GetLocalIpAddress();

                ResultVM resultData = _repo.Delete(param);

                Session["result"] = resultData.Status + "~" + resultData.Message;

                result = new ResultModel<ProductVM>()
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
            _repo = new ProductRepo();

            try
            {
                result = _repo.GetGridData(options);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<ProductVM>>(result.DataVM.ToString());

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
        public async Task<ActionResult> ReportPreview(CommonVM param)
        {
            try
            {
                _repo = new ProductRepo();
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

                    Response.Headers.Add("Content-Disposition", "inline; filename=Product_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".pdf");

                    return File(fileBytes, "application/pdf");
                }
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                TempData["Message"] = e.Message.ToString();
                return RedirectToAction("Index", "Product", new { area = "DMS", message = TempData["Message"] });
            }
        }

        public ActionResult ImportExcel(ProductFileVm vm)
        {
            ResultModel<ProductFileVm> result = new ResultModel<ProductFileVm>();
            try
            {
                CommonVM param = new CommonVM();
                BranchProfileRepo _repoBranchProfile = new BranchProfileRepo();
                List<BranchProfileVM> vmData = new List<BranchProfileVM>();
                ResultVM resultBranchProfile = _repoBranchProfile.List(param);


                vm.CreatedBy = Session["UserId"].ToString();
                vm.CreatedOn = DateTime.Now.ToString();
                vm.CreatedFrom = Ordinary.GetLocalIpAddress();
                //vm.BranchId = Convert.ToInt32(Session["CurrentBranch"].ToString());
                //vm.TransactionType = "Purchase";

                if (resultBranchProfile.Status == "Success" && resultBranchProfile.DataVM != null)
                {
                    vmData = JsonConvert.DeserializeObject<List<BranchProfileVM>>(resultBranchProfile.DataVM.ToString());

                    if (vmData != null && vmData.Count > 0)
                    {
                        vmData.RemoveAll(x => x.Id == 0);
                        vm.BranchProfileList = vmData;

                    }

                }
                else
                {
                    vm = null;
                }

                result = ImportExcelFile(vm);
                return Json(result);

            }
            catch (Exception ex)
            {
                return RedirectToAction("Index");
            }
        }
        [HttpPost]
        public ResultModel<ProductFileVm> ImportExcelFile(ProductFileVm paramVM)
        {

            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new ProductRepo();

            ProductPriceGroupRepo _repoProductPriceGroup = new ProductPriceGroupRepo();

            DataSet ds;
            DataTable dt;
            DataTable dtProductPriceGroupM = new DataTable();
            string fileName = paramVM.File.FileName;
            string Transaction_Type = null;
            ProductVM vm = new ProductVM();
            ProductImportVM productImport = new ProductImportVM();
            string CustomeDateFormat = null;
            CustomeDateFormat = "dd.MM.yyyy";
            string pattern = CustomeDateFormat;
            vm.BranchProfileList = paramVM.BranchProfileList;
            ProductPriceGroupVM ppg = new ProductPriceGroupVM();
            List<ProductPriceGroupDetailVM> ppgdVM = new List<ProductPriceGroupDetailVM>();
            CommonVM param = new CommonVM();
            param.Id = "";
            ppg.BranchProfileList = paramVM.BranchProfileList;
            int count = 0;

            try
            {

                ResultVM result = _repo.List(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    ppgdVM = JsonConvert.DeserializeObject<List<ProductPriceGroupDetailVM>>(result.DataVM.ToString());
                    if (ppgdVM != null && ppgdVM.Count > 0)
                    {
                        ppgdVM.RemoveAll(x => x.Id == 0);
                    }
                    if (ppgdVM != null)
                    {
                        foreach (var item in ppgdVM)
                        {
                            item.ProductId = item.Id;
                        }
                    }
                }
                else
                {
                    vm = null;
                }

                ppg.ProductPriceGroupDetailsExcel = ppgdVM;



                #region Get Excel Data


                using (var stream = paramVM.File.InputStream)
                {
                    IExcelDataReader reader = null;

                    if (fileName.EndsWith(".xls"))
                    {
                        reader = ExcelReaderFactory.CreateBinaryReader(stream);
                    }
                    else if (fileName.EndsWith(".xlsx"))
                    {
                        reader = ExcelReaderFactory.CreateOpenXmlReader(stream);
                    }

                    if (reader != null)
                    {
                        ds = reader.AsDataSet(new ExcelDataSetConfiguration()
                        {
                            ConfigureDataTable = (_) => new ExcelDataTableConfiguration()
                            {
                                UseHeaderRow = true
                            }
                        });

                        dt = ds.Tables[0];
                        reader.Close();

                        dtProductPriceGroupM = ds.Tables["ProductPriceGroup"];
                    }
                }

                #endregion



                #region Check EffectDate

                if (dtProductPriceGroupM.Rows.Count > 0)
                {
                    string referenceEffectDate = dtProductPriceGroupM.Rows[0]["EffectDate"].ToString();

                    foreach (DataRow row in dtProductPriceGroupM.Rows)
                    {
                        if (row["EffectDate"].ToString() != referenceEffectDate)
                        {
                            return new ResultModel<ProductFileVm>()
                            {
                                Success = false,
                                Status = Status.Fail,
                                Message = $"Excel Have Different Effect Date",
                                Data = null
                            };
                        }
                    }
                }

                #endregion


                #region Check Date Formate 

                string patternData = "yyyy-MM-dd";
                bool isFormat = true;

                if (!dtProductPriceGroupM.Columns.Contains("EffectDate"))
                {
                    throw new ArgumentNullException("", "Effect Date Column Required in Excel Template");
                }

                if (dtProductPriceGroupM.Columns.Contains("Invoice_Date"))
                {
                    foreach (DataRow dataRow in dtProductPriceGroupM.Rows)
                    {
                        DateTime parsedDate;

                        if (DateTime.TryParseExact(dataRow["EffectDate"].ToString().Trim(), pattern, null, DateTimeStyles.None, out parsedDate))
                        {
                            dataRow["EffectDate"] = parsedDate.ToString("yyyy-MM-dd");
                        }
                    }
                }

                if (dtProductPriceGroupM.Columns.Contains("EffectDate"))
                {
                    foreach (DataRow dataRow in dtProductPriceGroupM.Rows)
                    {
                        if (!DateTime.TryParseExact(dataRow["EffectDate"].ToString().Trim(), patternData,
                                                    CultureInfo.InvariantCulture, DateTimeStyles.None, out _))
                        {
                            isFormat = false;

                            return new ResultModel<ProductFileVm>()
                            {
                                Success = false,
                                Status = Status.Fail,
                                Message = " Invalid Date Format!",
                                Data = null
                            };

                        }
                    }
                }

                #endregion

                #region Check GroupName

                if (!dtProductPriceGroupM.Columns.Contains("GroupName"))
                {

                    return new ResultModel<ProductFileVm>()
                    {
                        Success = false,
                        Status = Status.Fail,
                        Message = "GroupName Column Required in Excel Template",
                        Data = null
                    };

                }

                bool hasValidGroupName = dtProductPriceGroupM.AsEnumerable().Any(row => !string.IsNullOrWhiteSpace(row["GroupName"]?.ToString()));

                if (!hasValidGroupName)
                {

                    return new ResultModel<ProductFileVm>()
                    {
                        Success = false,
                        Status = Status.Fail,
                        Message = "GroupName column is empty in all rows. Please fill it in the Excel template.",
                        Data = null
                    };

                }

                #endregion

                #region Code Check

                if (!dtProductPriceGroupM.Columns.Contains("ProductCode"))
                {

                    return new ResultModel<ProductFileVm>()
                    {
                        Success = false,
                        Status = Status.Fail,
                        Message = "ProductCode Column Required in Excel Template",
                        Data = null
                    };
                }

                bool hasEmptyProductCode = dtProductPriceGroupM.AsEnumerable()
                    .Any(row => string.IsNullOrWhiteSpace(row["ProductCode"]?.ToString()));

                if (hasEmptyProductCode)
                {

                    return new ResultModel<ProductFileVm>()
                    {
                        Success = false,
                        Status = Status.Fail,
                        Message = "ProductCode column contains empty or null values. Please correct the Excel template.",
                        Data = null
                    };

                }

                #endregion

                #region Excel Code Check  

                foreach (DataRow dataRow in dtProductPriceGroupM.Rows)
                {
                    var excelCode = dataRow["ProductCode"].ToString();
                    bool exists = ppg.ProductPriceGroupDetailsExcel.Any(x => x.Code == excelCode);
                    if (!exists)
                    {

                        return new ResultModel<ProductFileVm>()
                        {
                            Success = false,
                            Status = Status.Fail,
                            Message = $"Product code {excelCode} does not exist in the list.",
                            Data = null
                        };

                    }
                }

                #endregion


                #region Check Dublicate GroupName

                if (dtProductPriceGroupM.Rows.Count > 0)
                {
                    string referenceGroupName = dtProductPriceGroupM.Rows[0]["GroupName"].ToString();

                    foreach (DataRow row in dtProductPriceGroupM.Rows)
                    {
                        if (row["GroupName"].ToString() != referenceGroupName)
                        {
                            return new ResultModel<ProductFileVm>()
                            {
                                Success = false,
                                Status = Status.Fail,
                                Message = $"Excel Have Different GroupName",
                                Data = null
                            };
                        }
                    }
                }

                #endregion


                #region SetValue

                DataRow ProductPriceGroup = dtProductPriceGroupM.Rows[0];
                ppg.Name = ProductPriceGroup["GroupName"].ToString();
                ppg.EffectDate = ProductPriceGroup["EffectDate"].ToString();

                ppg.CreatedBy = paramVM.CreatedBy;
                ppg.CreatedOn = paramVM.CreatedOn;
                ppg.CreatedFrom = paramVM.CreatedFrom;

                foreach (DataRow dataRow in dtProductPriceGroupM.Rows)
                {

                    var ProducuPriceGroupdetailexcel = ppg.ProductPriceGroupDetailsExcel[count];
                    var productCode = ProducuPriceGroupdetailexcel.Code;

                    DataRow matchedRow = dtProductPriceGroupM.AsEnumerable().FirstOrDefault(row => row["ProductCode"].ToString() == productCode);

                    if (matchedRow != null)
                    {
                        ProducuPriceGroupdetailexcel.CosePrice = Convert.ToDecimal(matchedRow["CostPrice"]);
                        ProducuPriceGroupdetailexcel.SalePrice = Convert.ToDecimal(matchedRow["SalesPrice"]);
                        ppg.ProductPriceGroupDetails.Add(ProducuPriceGroupdetailexcel);

                    }

                    count++;

                }

                #endregion

                resultVM = _repoProductPriceGroup.Insert(ppg);
                //resultVM = _repo.ImportExcelFileInsert(vm);


                if (resultVM.Status.ToLower() != "success")
                {
                    return new ResultModel<ProductFileVm>()
                    {
                        Success = false,
                        Status = Status.Fail,
                        Message = resultVM.Message,
                        Data = null
                    };
                }

                return new ResultModel<ProductFileVm>()
                {
                    Success = false,
                    Status = Status.Success,
                    Message = "Data Saved Successfully!",
                    Data = null
                };
            }

            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
            }

            return new ResultModel<ProductFileVm>()
            {
                Success = false,
                Status = Status.Fail,
                Message = "Fail!",
                Data = null
            };

        }


        public async Task<FileResult> ExportProductExcel(string branchId, string isPosted, string fromDate, string toDate)
        {
            try
            {
                var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
                CommonVM commonVM = new CommonVM();
                commonVM.BranchId = branchId;
                commonVM.IsPost = isPosted;
                commonVM.FromDate = fromDate;
                commonVM.ToDate = toDate;

                DataTable dt = new DataTable();
                GridOptions options = new GridOptions();

                _repo = new ProductRepo();

                ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;

                var result = _repo.ExportProductExcel(commonVM);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var data = JsonConvert.DeserializeObject<List<ProductSummaryVM>>(result.DataVM.ToString());
                    dt = Extensions.ConvertToDataTable(data);
                }

                Dictionary<string, string> columnMappings = new Dictionary<string, string>
                    {

                        { "GroupName", "GroupName" },
                        { "ProductName", "ProductName" },
                        { "ProductCode", "ProductCode" },
                        { "EffectDate", "EffectDate" },
                        { "SalesPrice", "SalesPrice" },
                        { "CostPrice", "CostPrice" }

                    };
                foreach (var column in columnMappings)
                {
                    if (dt.Columns.Contains(column.Key))
                    {
                        dt.Columns[column.Key].ColumnName = column.Value;
                    }
                }

                if (dt.Rows.Count > 0)
                {
                    using (var package = new ExcelPackage())
                    {

                        var worksheet = package.Workbook.Worksheets.Add("ProductPriceGroup");
                        var range = worksheet.Cells["A1"].LoadFromDataTable(dt, true);

                        var headerRow = range.Worksheet.Row(1);
                        headerRow.Style.Font.Bold = true;

                        for (int col = 1; col <= dt.Columns.Count; col++)
                        {
                            var cell = worksheet.Cells[1, col];
                            cell.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                            cell.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.Gray);
                        }

                        var dataRange = range.Offset(1, 0, range.Rows - 1, range.Columns);
                        dataRange.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                        dataRange.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        dataRange.Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        dataRange.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;

                        var totalAmountColumn = worksheet.Cells[2, 7, range.End.Row, 7];
                        totalAmountColumn.Style.Numberformat.Format = "#,##0.00";

                        using (var memoryStream = new MemoryStream())
                        {
                            package.SaveAs(memoryStream);
                            memoryStream.Position = 0;

                            return File(memoryStream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ProductPriceGroup-" + DateTime.Now.ToString("yyyy-MM-dd-HHmmss") + ".xlsx");
                        }
                    }
                }
                else
                {
                    using (var package = new ExcelPackage())
                    {
                        var worksheet = package.Workbook.Worksheets.Add("Purchase");
                        using (var memoryStream = new MemoryStream())
                        {
                            package.SaveAs(memoryStream);
                            memoryStream.Position = 0;

                            return File(memoryStream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ProductPriceGroup-" + DateTime.Now.ToString("yyyy-MM-dd-HHmmss") + ".xlsx");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public async Task<FileResult> ExportProductStockExcel(string branchId, string isPosted, string fromDate, string toDate)
        {
            try
            {
                var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
                CommonVM commonVM = new CommonVM();
                commonVM.BranchId = branchId;
                commonVM.IsPost = isPosted;
                commonVM.FromDate = fromDate;
                commonVM.ToDate = toDate;

                DataTable dt = new DataTable();
                GridOptions options = new GridOptions();

                _repo = new ProductRepo();

                ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;

                var result = _repo.ExportProductStockExcel(commonVM);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var data = JsonConvert.DeserializeObject<List<ProductStockSummary>>(result.DataVM.ToString());
                    dt = Extensions.ConvertToDataTable(data);
                }

                Dictionary<string, string> columnMappings = new Dictionary<string, string>
                    {

                        { "ProductName", "ProductName" },
                        { "ProductCode", "ProductCode" },
                        { "OpeningDate", "OpeningDate" },
                        { "OpeningQuantity", "OpeningQuantity" },
                        { "OpeningValue", "OpeningValue" }

                    };
                foreach (var column in columnMappings)
                {
                    if (dt.Columns.Contains(column.Key))
                    {
                        dt.Columns[column.Key].ColumnName = column.Value;
                    }
                }

                if (dt.Rows.Count > 0)
                {
                    using (var package = new ExcelPackage())
                    {

                        var worksheet = package.Workbook.Worksheets.Add("ProductStock");
                        var range = worksheet.Cells["A1"].LoadFromDataTable(dt, true);

                        var headerRow = range.Worksheet.Row(1);
                        headerRow.Style.Font.Bold = true;

                        for (int col = 1; col <= dt.Columns.Count; col++)
                        {
                            var cell = worksheet.Cells[1, col];
                            cell.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                            cell.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.Gray);
                        }

                        var dataRange = range.Offset(1, 0, range.Rows - 1, range.Columns);
                        dataRange.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                        dataRange.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        dataRange.Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        dataRange.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;

                        var totalAmountColumn = worksheet.Cells[2, 7, range.End.Row, 7];
                        totalAmountColumn.Style.Numberformat.Format = "#,##0.00";

                        using (var memoryStream = new MemoryStream())
                        {
                            package.SaveAs(memoryStream);
                            memoryStream.Position = 0;

                            return File(memoryStream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ProductStock-" + DateTime.Now.ToString("yyyy-MM-dd-HHmmss") + ".xlsx");
                        }
                    }
                }
                else
                {
                    using (var package = new ExcelPackage())
                    {
                        var worksheet = package.Workbook.Worksheets.Add("ProductStock");
                        using (var memoryStream = new MemoryStream())
                        {
                            package.SaveAs(memoryStream);
                            memoryStream.Position = 0;

                            return File(memoryStream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ProductStock-" + DateTime.Now.ToString("yyyy-MM-dd-HHmmss") + ".xlsx");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<FileResult> ExportPurchasePriceHistoriesExcel(string branchId, string isPosted, string fromDate, string toDate)
        {
            try
            {
                var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
                CommonVM commonVM = new CommonVM();
                commonVM.BranchId = branchId;
                commonVM.IsPost = isPosted;
                commonVM.FromDate = fromDate;
                commonVM.ToDate = toDate;

                DataTable dt = new DataTable();
                GridOptions options = new GridOptions();

                _repo = new ProductRepo();

                ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;

                var result = _repo.ExportPurchasePriceHistoriesExcel(commonVM);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var data = JsonConvert.DeserializeObject<List<ProductPurchaseVM>>(result.DataVM.ToString());
                    dt = Extensions.ConvertToDataTable(data);
                }

                Dictionary<string, string> columnMappings = new Dictionary<string, string>
                    {

                        { "ProductCode", "ProductCode" },
                        { "ProductName", "ProductName" },
                        { "EffectDate", "EffectDate" },
                        { "CostPrice", "CostPrice" }

                    };
                foreach (var column in columnMappings)
                {
                    if (dt.Columns.Contains(column.Key))
                    {
                        dt.Columns[column.Key].ColumnName = column.Value;
                    }
                }

                if (dt.Rows.Count > 0)
                {
                    using (var package = new ExcelPackage())
                    {

                        var worksheet = package.Workbook.Worksheets.Add("ProductsPurchasePriceHistories");
                        var range = worksheet.Cells["A1"].LoadFromDataTable(dt, true);

                        var headerRow = range.Worksheet.Row(1);
                        headerRow.Style.Font.Bold = true;

                        for (int col = 1; col <= dt.Columns.Count; col++)
                        {
                            var cell = worksheet.Cells[1, col];
                            cell.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                            cell.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.Gray);
                        }

                        var dataRange = range.Offset(1, 0, range.Rows - 1, range.Columns);
                        dataRange.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                        dataRange.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        dataRange.Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        dataRange.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;

                        var totalAmountColumn = worksheet.Cells[2, 7, range.End.Row, 7];
                        totalAmountColumn.Style.Numberformat.Format = "#,##0.00";

                        using (var memoryStream = new MemoryStream())
                        {
                            package.SaveAs(memoryStream);
                            memoryStream.Position = 0;

                            return File(memoryStream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ProductsPurchasePriceHistories-" + DateTime.Now.ToString("yyyy-MM-dd-HHmmss") + ".xlsx");
                        }
                    }
                }
                else
                {
                    using (var package = new ExcelPackage())
                    {
                        var worksheet = package.Workbook.Worksheets.Add("ProductsPurchasePriceHistories");
                        using (var memoryStream = new MemoryStream())
                        {
                            package.SaveAs(memoryStream);
                            memoryStream.Position = 0;

                            return File(memoryStream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ProductStock-" + DateTime.Now.ToString("yyyy-MM-dd-HHmmss") + ".xlsx");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        [HttpPost]
        public ResultModel<ProductStockFileVM> ImportProductStockExcelFile(ProductStockFileVM paramVM)
        {
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new ProductRepo();
            ProductStockRepo _productStockRepo = new ProductStockRepo();

            DataSet ds;
            DataTable dtProductStock = new DataTable();
            string fileName = paramVM.File.FileName;
            List<ProductStockVM> psVM = new List<ProductStockVM>();
            CommonVM param = new CommonVM();
            param.Id = "";
            ResultVM result = _repo.List(param);
            var allProducts = JsonConvert.DeserializeObject<List<ProductVM>>(result.DataVM.ToString());

            try
            {
                #region Get Excel Data

                using (var stream = paramVM.File.InputStream)
                {
                    IExcelDataReader reader = null;

                    if (fileName.EndsWith(".xls"))
                    {
                        reader = ExcelReaderFactory.CreateBinaryReader(stream);
                    }
                    else if (fileName.EndsWith(".xlsx"))
                    {
                        reader = ExcelReaderFactory.CreateOpenXmlReader(stream);
                    }

                    if (reader != null)
                    {
                        ds = reader.AsDataSet(new ExcelDataSetConfiguration()
                        {
                            ConfigureDataTable = (_) => new ExcelDataTableConfiguration()
                            {
                                UseHeaderRow = true
                            }
                        });

                        dtProductStock = ds.Tables[0];
                        reader.Close();
                    }
                }

                #endregion

                #region Check Data Validity (Excel Columns)

                if (!dtProductStock.Columns.Contains("ProductCode"))
                {
                    return new ResultModel<ProductStockFileVM>()
                    {
                        Success = false,
                        Status = Status.Fail,
                        Message = "ProductCode Column Required in Excel Template",
                        Data = null
                    };
                }

                if (!dtProductStock.Columns.Contains("ProductName"))
                {
                    return new ResultModel<ProductStockFileVM>()
                    {
                        Success = false,
                        Status = Status.Fail,
                        Message = "ProductName Column Required in Excel Template",
                        Data = null
                    };
                }

                #endregion



                #region Check OpeningDate

                if (dtProductStock.Rows.Count > 0)
                {
                    string referenceOpeningDate = dtProductStock.Rows[0]["OpeningDate"].ToString();

                    foreach (DataRow row in dtProductStock.Rows)
                    {
                        if (row["OpeningDate"].ToString() != referenceOpeningDate)
                        {
                            return new ResultModel<ProductStockFileVM>()
                            {
                                Success = false,
                                Status = Status.Fail,
                                Message = $"Excel Have Different Opening Date",
                                Data = null
                            };
                        }
                    }
                }

                #endregion


                #region Mapping Excel Data to ProductStockVM

                foreach (DataRow row in dtProductStock.Rows)
                {
                    if (string.IsNullOrWhiteSpace(row["ProductCode"]?.ToString()) || string.IsNullOrWhiteSpace(row["ProductName"]?.ToString()))
                        continue;

                    ProductStockVM productStock = new ProductStockVM
                    {
                        ProductCode = row["ProductCode"].ToString(),
                        ProductName = row["ProductName"].ToString(),
                        OpeningDate = row["OpeningDate"] != DBNull.Value ? Convert.ToDateTime(row["OpeningDate"]).ToString("yyyy-MM-dd") : null,
                        OpeningQuantity = row["OpeningQuantity"] != DBNull.Value ? Convert.ToInt32(row["OpeningQuantity"]) : 0,
                        OpeningValue = row["OpeningValue"] != DBNull.Value ? Convert.ToDecimal(row["OpeningValue"]) : 0,
                        BranchId = Convert.ToInt32(Session["CurrentBranch"].ToString()),
                        CreatedBy = Session["UserId"]?.ToString(),
                        CreatedFrom = Ordinary.GetLocalIpAddress(),
                        CreatedOn = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")
                    };

                    var matchingProduct = allProducts.FirstOrDefault(p => p.Code == productStock.ProductCode);
                    if (matchingProduct != null)
                    {
                        productStock.ProductId = matchingProduct.Id;
                    }
                    else
                    {
                        productStock.ProductId = null;
                    }

                    psVM.Add(productStock);
                }

                #endregion

                #region Insert Data into ProductStock Repo

                resultVM = _productStockRepo.Insert(psVM);

                if (resultVM.Status.ToLower() != "success")
                {
                    return new ResultModel<ProductStockFileVM>()
                    {
                        Success = false,
                        Status = Status.Fail,
                        Message = resultVM.Message,
                        Data = null
                    };
                }

                #endregion

                return new ResultModel<ProductStockFileVM>()
                {
                    Success = true,
                    Status = Status.Success,
                    Message = "Data Saved Successfully!",
                    Data = null
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
                return new ResultModel<ProductStockFileVM>()
                {
                    Success = false,
                    Status = Status.Fail,
                    Message = "An error occurred while processing the file.",
                    Data = null
                };
            }
        }

        public ActionResult ImportProductStockExcel(ProductStockFileVM vm)
        {
            ResultModel<ProductStockFileVM> result = new ResultModel<ProductStockFileVM>();
            try
            {
                CommonVM param = new CommonVM();
                vm.CreatedBy = Session["UserId"].ToString();
                vm.CreatedOn = DateTime.Now.ToString();
                vm.CreatedFrom = Ordinary.GetLocalIpAddress();
                result = ImportProductStockExcelFile(vm);
                return Json(result);
            }
            catch (Exception ex)
            {
                return RedirectToAction("Index");
            }
        }


        [HttpPost]
        public JsonResult GetGridDataofProductStock(GridOptions options, string getProductId)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new ProductRepo();

            try
            {

                var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
                options.vm.BranchId = (currentBranchId).ToString();

                result = _repo.GridDataListofProductStock(options, getProductId);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<ProductStockVM>>(result.DataVM.ToString());

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


        public ActionResult PurchaseImportExcel(ProductFileVm vm)
        {
            ResultModel<ProductFileVm> result = new ResultModel<ProductFileVm>();
            try
            {
                CommonVM param = new CommonVM();
                BranchProfileRepo _repoBranchProfile = new BranchProfileRepo();
                List<BranchProfileVM> vmData = new List<BranchProfileVM>();
                ResultVM resultBranchProfile = _repoBranchProfile.List(param);


                vm.CreatedBy = Session["UserId"].ToString();
                vm.CreatedOn = DateTime.Now.ToString();
                vm.CreatedFrom = Ordinary.GetLocalIpAddress();
                //vm.BranchId = Convert.ToInt32(Session["CurrentBranch"].ToString());
                //vm.TransactionType = "Purchase";

                if (resultBranchProfile.Status == "Success" && resultBranchProfile.DataVM != null)
                {
                    vmData = JsonConvert.DeserializeObject<List<BranchProfileVM>>(resultBranchProfile.DataVM.ToString());

                    if (vmData != null && vmData.Count > 0)
                    {
                        vmData.RemoveAll(x => x.Id == 0);
                        vm.BranchProfileList = vmData;

                    }

                }
                else
                {
                    vm = null;
                }

                result = PurchaseImportExcelFile(vm);
                return Json(result);

            }
            catch (Exception ex)
            {
                return RedirectToAction("Index");
            }
        }
        [HttpPost]
        public ResultModel<ProductFileVm> PurchaseImportExcelFile(ProductFileVm paramVM)
        {

            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new ProductRepo();

            ProductPriceGroupRepo _repoProductPriceGroup = new ProductPriceGroupRepo();

            DataSet ds;
            DataTable dt;
            DataTable dtProductPriceGroupM = new DataTable();
            string fileName = paramVM.File.FileName;
            string Transaction_Type = null;
            ProductVM vm = new ProductVM();
            ProductImportVM productImport = new ProductImportVM();
            string CustomeDateFormat = null;
            CustomeDateFormat = "dd.MM.yyyy";
            string pattern = CustomeDateFormat;
            vm.BranchProfileList = paramVM.BranchProfileList;
            ProductPriceGroupVM ppg = new ProductPriceGroupVM();
            List<ProductPriceGroupDetailVM> ppgdVM = new List<ProductPriceGroupDetailVM>();
            CommonVM param = new CommonVM();
            param.Id = "";
            ppg.BranchProfileList = paramVM.BranchProfileList;
            int count = 0;

            try
            {

                ResultVM result = _repo.List(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    ppgdVM = JsonConvert.DeserializeObject<List<ProductPriceGroupDetailVM>>(result.DataVM.ToString());
                    if (ppgdVM != null && ppgdVM.Count > 0)
                    {
                        ppgdVM.RemoveAll(x => x.Id == 0);
                    }
                    if (ppgdVM != null)
                    {
                        foreach (var item in ppgdVM)
                        {
                            item.ProductId = item.Id;
                        }
                    }
                }
                else
                {
                    vm = null;
                }

                ppg.ProductPriceGroupDetailsExcel = ppgdVM;



                #region Get Excel Data


                using (var stream = paramVM.File.InputStream)
                {
                    IExcelDataReader reader = null;

                    if (fileName.EndsWith(".xls"))
                    {
                        reader = ExcelReaderFactory.CreateBinaryReader(stream);
                    }
                    else if (fileName.EndsWith(".xlsx"))
                    {
                        reader = ExcelReaderFactory.CreateOpenXmlReader(stream);
                    }

                    if (reader != null)
                    {
                        ds = reader.AsDataSet(new ExcelDataSetConfiguration()
                        {
                            ConfigureDataTable = (_) => new ExcelDataTableConfiguration()
                            {
                                UseHeaderRow = true
                            }
                        });

                        dt = ds.Tables[0];
                        reader.Close();

                        dtProductPriceGroupM = ds.Tables["ProductsPurchasePriceHistories"];
                    }
                }

                #endregion



                #region Check EffectDate

                if (dtProductPriceGroupM.Rows.Count > 0)
                {
                    string referenceEffectDate = dtProductPriceGroupM.Rows[0]["EffectDate"].ToString();

                    foreach (DataRow row in dtProductPriceGroupM.Rows)
                    {
                        if (row["EffectDate"].ToString() != referenceEffectDate)
                        {
                            return new ResultModel<ProductFileVm>()
                            {
                                Success = false,
                                Status = Status.Fail,
                                Message = $"Excel Have Different Effect Date",
                                Data = null
                            };
                        }
                    }
                }

                #endregion


                #region Check Date Formate 

                string patternData = "yyyy-MM-dd";
                bool isFormat = true;

                if (!dtProductPriceGroupM.Columns.Contains("EffectDate"))
                {
                    throw new ArgumentNullException("", "Effect Date Column Required in Excel Template");
                }

                

                if (dtProductPriceGroupM.Columns.Contains("EffectDate"))
                {
                    foreach (DataRow dataRow in dtProductPriceGroupM.Rows)
                    {
                        if (!DateTime.TryParseExact(dataRow["EffectDate"].ToString().Trim(), patternData,
                                                    CultureInfo.InvariantCulture, DateTimeStyles.None, out _))
                        {
                            isFormat = false;

                            return new ResultModel<ProductFileVm>()
                            {
                                Success = false,
                                Status = Status.Fail,
                                Message = " Invalid Date Format!",
                                Data = null
                            };

                        }
                    }
                }

                #endregion


                #region Code Check

                if (!dtProductPriceGroupM.Columns.Contains("ProductCode"))
                {

                    return new ResultModel<ProductFileVm>()
                    {
                        Success = false,
                        Status = Status.Fail,
                        Message = "ProductCode Column Required in Excel Template",
                        Data = null
                    };
                }

                bool hasEmptyProductCode = dtProductPriceGroupM.AsEnumerable()
                    .Any(row => string.IsNullOrWhiteSpace(row["ProductCode"]?.ToString()));

                if (hasEmptyProductCode)
                {

                    return new ResultModel<ProductFileVm>()
                    {
                        Success = false,
                        Status = Status.Fail,
                        Message = "ProductCode column contains empty or null values. Please correct the Excel template.",
                        Data = null
                    };

                }

                #endregion

                #region Excel Code Check  

                foreach (DataRow dataRow in dtProductPriceGroupM.Rows)
                {
                    var excelCode = dataRow["ProductCode"].ToString();
                    bool exists = ppg.ProductPriceGroupDetailsExcel.Any(x => x.Code == excelCode);
                    if (!exists)
                    {

                        return new ResultModel<ProductFileVm>()
                        {
                            Success = false,
                            Status = Status.Fail,
                            Message = $"Product code {excelCode} does not exist in the list.",
                            Data = null
                        };

                    }
                }

                #endregion




                #region SetValue

                DataRow ProductPriceGroup = dtProductPriceGroupM.Rows[0];
                ppg.EffectDate = ProductPriceGroup["EffectDate"].ToString();

                ppg.CreatedBy = paramVM.CreatedBy;
                ppg.CreatedOn = paramVM.CreatedOn;
                ppg.CreatedFrom = paramVM.CreatedFrom;

                foreach (DataRow dataRow in dtProductPriceGroupM.Rows)
                {

                    var ProducuPriceGroupdetailexcel = ppg.ProductPriceGroupDetailsExcel[count];
                    var productCode = ProducuPriceGroupdetailexcel.Code;

                    DataRow matchedRow = dtProductPriceGroupM.AsEnumerable().FirstOrDefault(row => row["ProductCode"].ToString() == productCode);

                    if (matchedRow != null)
                    {
                        ProducuPriceGroupdetailexcel.CosePrice = Convert.ToDecimal(matchedRow["CostPrice"]);
                        ppg.ProductPriceGroupDetails.Add(ProducuPriceGroupdetailexcel);

                    }

                    count++;

                }

                #endregion

                resultVM = _repo.PurchaseImportExcelFileInsert(ppg);
                //resultVM = _repo.ImportExcelFileInsert(vm);


                if (resultVM.Status.ToLower() != "success")
                {
                    return new ResultModel<ProductFileVm>()
                    {
                        Success = false,
                        Status = Status.Fail,
                        Message = resultVM.Message,
                        Data = null
                    };
                }

                return new ResultModel<ProductFileVm>()
                {
                    Success = false,
                    Status = Status.Success,
                    Message = "Data Saved Successfully!",
                    Data = null
                };
            }

            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
            }

            return new ResultModel<ProductFileVm>()
            {
                Success = false,
                Status = Status.Fail,
                Message = "Fail!",
                Data = null
            };

        }

    }
}
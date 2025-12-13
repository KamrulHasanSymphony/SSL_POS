using Newtonsoft.Json;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using ShampanPOS.Models;
using ShampanPOS.Models.KendoCommon;
using ShampanPOS.Repo;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Security.Cryptography.Xml;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace ShampanPOSUI.Areas.DMS.Controllers
{

    public class MISReportController : Controller
    {
        MISReportRepo _repo = new MISReportRepo();
        CommonRepo _commonRepo = new CommonRepo();
        // GET: DMS/MISReport
        public ActionResult Index()
        {
            return View();
        }

        public async Task<FileResult> ExportSaleAndPayment(string CustomerId, string DateTo, string DateFrom)
        {
            try
            {
                SalePaymentVM vm = new SalePaymentVM();
                vm.CustomerId = CustomerId;
                vm.Date = DateFrom;
                vm.DateTo = DateTo;
                vm.DateFrom = DateFrom;
                var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
                CommonVM commonVM = new CommonVM();
                vm.BranchId = currentBranchId;

                DataTable dt = new DataTable();
                GridOptions options = new GridOptions();

                _repo = new MISReportRepo();

                ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;

                var result = _repo.ExportSaleAndPayment(vm);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var data = JsonConvert.DeserializeObject<List<SalePaymentReportVM>>(result.DataVM.ToString());
                    dt = Extensions.ConvertToDataTable(data);
                }

                Dictionary<string, string> columnMappings = new Dictionary<string, string>
                    {

                        { "CustomerName", "CustomerName" }

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

                        var worksheet = package.Workbook.Worksheets.Add("SaleAndPayment");
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

                            return File(memoryStream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "SaleAndPayment-" + DateTime.Now.ToString("yyyy-MM-dd-HHmmss") + ".xlsx");
                        }
                    }
                }
                else
                {
                    using (var package = new ExcelPackage())
                    {
                        var worksheet = package.Workbook.Worksheets.Add("SaleAndPayment");
                        using (var memoryStream = new MemoryStream())
                        {
                            package.SaveAs(memoryStream);
                            memoryStream.Position = 0;

                            return File(memoryStream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "SaleAndPayment-" + DateTime.Now.ToString("yyyy-MM-dd-HHmmss") + ".xlsx");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<FileResult> ExportSaleAndPaymentSummary(string CustomerId, string DateTo, string DateFrom)
        {
            try
            {
                SalePaymentVM vm = new SalePaymentVM();
                vm.CustomerId = CustomerId;
                vm.Date = DateFrom;
                vm.DateTo = DateTo;
                vm.DateFrom = DateFrom;
                var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
                CommonVM commonVM = new CommonVM();
                vm.BranchId = currentBranchId;

                DataTable dt = new DataTable();
                GridOptions options = new GridOptions();

                _repo = new MISReportRepo();

                ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;

                var result = _repo.ExportSaleAndPaymentSummary(vm);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var data = JsonConvert.DeserializeObject<List<SaleAndPaymentSummaryReportVM>>(result.DataVM.ToString());
                    dt = Extensions.ConvertToDataTable(data);
                }

                Dictionary<string, string> columnMappings = new Dictionary<string, string>
                    {

                        { "CustomerName", "CustomerName" }

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

                        var worksheet = package.Workbook.Worksheets.Add("SaleAndPayment");
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

                            return File(memoryStream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "SaleAndPaymentSummary-" + DateTime.Now.ToString("yyyy-MM-dd-HHmmss") + ".xlsx");
                        }
                    }
                }
                else
                {
                    using (var package = new ExcelPackage())
                    {
                        var worksheet = package.Workbook.Worksheets.Add("SaleAndPaymentSummary");
                        using (var memoryStream = new MemoryStream())
                        {
                            package.SaveAs(memoryStream);
                            memoryStream.Position = 0;

                            return File(memoryStream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "SaleAndPaymentSummary-" + DateTime.Now.ToString("yyyy-MM-dd-HHmmss") + ".xlsx");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        [HttpGet]
        public ActionResult CreatePartial()
        {
            SalePaymentVM vm = new SalePaymentVM();
            return PartialView("~/Areas/DMS/Views/MISReport/_SaleAndPayment.cshtml", vm);
        }


        [HttpGet]
        public ActionResult SaleDeleveryInformtion()
        {
            MISReportVM vm = new MISReportVM();
            vm.IsDetail = true;
            return PartialView("~/Areas/DMS/Views/MISReport/_SaleDeleveryInformation.cshtml", vm);
        }

        public async Task<FileResult> SaleDeleveryInfo(MISReportVM vm)
        {
            try
            {
                var currentBranchId = Session["CurrentBranch"]?.ToString() ?? "0";
                vm.BranchId = currentBranchId;

                _repo = new MISReportRepo();
                var result = _repo.SaleDeleveryInfo(vm);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var data = JsonConvert.DeserializeObject<List<SaleDeleveryInformationVM>>(result.DataVM.ToString());
                    var dt = Extensions.ConvertToDataTable(data);

                    // One line Excel generation!
                    var customHeaders = new Dictionary<string, string>
            {
                { "CustomerName", "Customer Name" },
                { "BranchName", "Branch Name" },
                { "BranchAddress", "Branch Address" },
                { "SaleDate", "Sale Date" },
                { "DeliveryDate", "Delivery Date" },

                { "DeliveryStatus", "Delivery Status" }
            };
                    return Extensions.GenerateExcel(dt, "SaleInformation", customHeaders, "Sale Information", false);
                }

                // Empty Excel if no data
                return Extensions.GenerateExcel(new DataTable(), "SaleInformation");
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public async Task<ActionResult> SaleDeleveryReportPreview(MISReportVM param)
        {
            try
            {
                param.CompanyId = Session["CompanyId"] != null ? Session["CompanyId"].ToString() : "";
                if (param.BranchId == "0")
                {
                    param.BranchId = null;
                }
                if (param.CustomerId == "0")
                {
                    param.CustomerId = null;
                }
                var resultStream = _repo.SaleDeleveryReportPreview(param);

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

                    Response.Headers.Add("Content-Disposition", "inline; filename=SaleDelivery_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".pdf");

                    return File(fileBytes, "application/pdf");
                }
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                TempData["Message"] = e.Message.ToString();
                Session["result"] = "Fail" + "~" + e.Message;
                return RedirectToAction("Index", "Sale", new { area = "DMS", message = TempData["Message"] });
            }
        }


        [HttpGet]
        public ActionResult MISSalesView()
        {
            MISReportVM vm = new MISReportVM();
            var currentBranchId = Session["CurrentBranch"]?.ToString() ?? "0";
            vm.BranchId = currentBranchId;

            return PartialView("~/Areas/DMS/Views/MISReport/_MISSales.cshtml", vm);
        }

        public async Task<FileResult> MISSalesReport(MISReportVM vm)
        {
            try
            {
                BranchProfileRepo _branchRepo = new BranchProfileRepo();
                ResultVM result = new ResultVM();
                DataTable dt = new DataTable();
                CommonVM common = new CommonVM();
                List<BranchProfileVM> lst = new List<BranchProfileVM>();
                common.Id = vm.BranchId;

                string BranchName = "";
                string BranchAddress = "";
                var currentBranchId = Session["CurrentBranch"]?.ToString() ?? "0";
                //vm.BranchId = currentBranchId;

                var branchProfile = _branchRepo.List(common);


                _repo = new MISReportRepo();

                if (vm.IsProductWise)
                {
                    result = _repo.MonthlySalesAndAmountReportProductWise(vm);
                }
                else if (vm.IsCustomerWise)
                {
                    result = _repo.MonthlySalesAndAmountReportCustomerWise(vm);
                }
                else if (vm.IsSalesReport)
                {
                    result = _repo.ProductSalesReport(vm);
                }
                else if (vm.IsInventoryReport)
                {
                    result = _repo.ProductInventoryReport(vm);
                }
                else if (vm.IsCustomerBill)
                {
                    result = _repo.CustomerBillReport(vm);
                }
                else if (vm.IsSinglePorductInventory)
                {
                    result = _repo.SinglePorductInventoryReport(vm);
                }
                else if (vm.IsCustomerDueList)
                {
                    result = _repo.CustomerDueListReport(vm);
                }
                else if (vm.IsCustomerDueListCustomerWise)
                {
                    result = _repo.CustomerDueListCustomerWiseReport(vm);
                }

                if (result != null)
                {
                    if (result.Status == "Success" && result.DataVM != null)
                    {
                        if (branchProfile != null)
                        {
                            lst = JsonConvert.DeserializeObject<List<BranchProfileVM>>(branchProfile.DataVM.ToString());
                        }

                        if (vm.IsProductWise)
                        {
                            var ProductData = JsonConvert.DeserializeObject<List<MonthlySalesAndAmountProductWiseVM>>(result.DataVM.ToString());
                            dt = Extensions.ConvertToDataTable(ProductData);
                        }
                        else if (vm.IsCustomerWise)
                        {
                            var CustomerData = JsonConvert.DeserializeObject<List<MonthlySalesAndAmountCustomerWiseVM>>(result.DataVM.ToString());
                            dt = Extensions.ConvertToDataTable(CustomerData);
                        }
                        else if (vm.IsSalesReport)
                        {
                            var ProductSalesData = JsonConvert.DeserializeObject<List<ProductSalesReportVM>>(result.DataVM.ToString());
                            dt = Extensions.ConvertToDataTable(ProductSalesData);
                        }
                        else if (vm.IsInventoryReport)
                        {
                            var ProductInventoryData = JsonConvert.DeserializeObject<List<ProductInventoryReportVM>>(result.DataVM.ToString());
                            dt = Extensions.ConvertToDataTable(ProductInventoryData);
                        }
                        else if (vm.IsCustomerBill)
                        {
                            var CustomerBillData = JsonConvert.DeserializeObject<List<CustomerBillVM>>(result.DataVM.ToString());
                            dt = Extensions.ConvertToDataTable(CustomerBillData);
                        }
                        else if (vm.IsSinglePorductInventory)
                        {
                            var SinglePorductInventoryData = JsonConvert.DeserializeObject<List<SinglePorductInventoryVM>>(result.DataVM.ToString());
                            dt = Extensions.ConvertToDataTable(SinglePorductInventoryData);
                        }
                        else if (vm.IsCustomerDueList)
                        {
                            var CustomerDueListData = JsonConvert.DeserializeObject<List<CustomerDueListVM>>(result.DataVM.ToString());
                            dt = Extensions.ConvertToDataTable(CustomerDueListData);
                        }
                        else if (vm.IsCustomerDueListCustomerWise)
                        {
                            var CustomerDueListData = JsonConvert.DeserializeObject<List<CustomerDueListCustomerWiseVM>>(result.DataVM.ToString());
                            dt = Extensions.ConvertToDataTable(CustomerDueListData);
                        }


                        //if (vm.BranchId != "0")
                        //{
                        //    if (dt.Rows.Count > 0)
                        //    {
                        //        var firstRow = dt.Rows[0];
                        //        BranchName = firstRow["BranchName"].ToString();
                        //        BranchAddress = firstRow["BranchAddress"].ToString();
                        //    }
                        //}
                        //else
                        //{
                        //    BranchName = "ALL";
                        //    BranchAddress = "ALL";
                        //}

                        // One line Excel generation!
                        var customHeaders = new Dictionary<string, string>
                            {
                           
                                { "Branch Name",   lst.FirstOrDefault().Name },
                                { "Branch Address", lst.FirstOrDefault().Address },
                                { "From Date", vm.DateFrom },
                                { "To Date", vm.DateTo },
                            };



                        if (vm.IsProductWise)
                        {
                            return Extensions.GenerateExcel(dt, "MonthlySalesAndAmountReportProductWise", customHeaders, "Monthly Sales And Amount Report Product Wise", true);
                        }
                        else if (vm.IsCustomerWise)
                        {
                            return Extensions.GenerateExcel(dt, "MonthlySalesAndAmountReportCustomerWise", customHeaders, "Monthly Sales And Amount Report Customer Wise", true);
                        }
                        else if (vm.IsSalesReport)
                        {
                            return Extensions.GenerateExcel(dt, "ProductSalesReport", customHeaders, "Product Sales Report", true);
                        }
                        else if (vm.IsInventoryReport)
                        {
                            return Extensions.GenerateExcel(dt, "ProductInventoryReport", customHeaders, "Product Inventory Report", true);
                        }
                        else if (vm.IsCustomerBill)
                        {
                            return Extensions.GenerateExcel(dt, "CustomerBillReport", customHeaders, "Customer Bill Report", true);
                        }
                        else if (vm.IsSinglePorductInventory)
                        {
                            return Extensions.GenerateExcel(dt, "SinglePorductInventoryReport", customHeaders, "Single Porduct Inventory Report", true);
                        }
                        else if (vm.IsCustomerDueList)
                        {
                            return Extensions.GenerateExcel(dt, "CustomerDueListReport", customHeaders, "Customer Due List Report", true);
                        }
                        else if (vm.IsCustomerDueListCustomerWise)
                        {
                            return Extensions.GenerateExcel(dt, "CustomerDueListCustomerWiseReport", customHeaders, "Customer Due List Customer Wise Report", true);
                        }

                    }
                }

                // Empty Excel if no data
                return Extensions.GenerateExcel(new DataTable(), "MonthlySalesAndAmountReport");
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                DataTable table = new DataTable();
                table.Columns.Add("Message", typeof(string));
                table.Columns.Add("StackTrace", typeof(string));

                table.Rows.Add(ex.Message.ToString(), ex.StackTrace.ToString());

                return Extensions.GenerateExcel(table, "MonthlySalesAndAmountReport");

            }
        }




        [HttpGet]
        public ActionResult ProductLeatestPriceView()
        {
            MISReportVM vm = new MISReportVM();
            vm.IsDetail = true;
            return PartialView("~/Areas/DMS/Views/MISReport/_ProductLeatestPriceView.cshtml", vm);
        }

        public async Task<FileResult> ProductLeatestPriceInfo(MISReportVM vm)
        {
            try
            {
                var currentBranchId = Session["CurrentBranch"]?.ToString() ?? "0";
                vm.BranchId = currentBranchId;

                _repo = new MISReportRepo();
                var result = _repo.ProductLeatestPriceInfo(vm);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var data = JsonConvert.DeserializeObject<List<ProductBatchHistoryVM>>(result.DataVM.ToString());
                    var dt = Extensions.ConvertToDataTable(data);

                    // One line Excel generation!
                    var customHeaders = new Dictionary<string, string>
            {
                { "CustomerName", "Customer Name" },
                { "BranchName", "Branch Name" },
                { "BranchAddress", "Branch Address" },
                { "SaleDate", "Sale Date" },
                { "DeliveryDate", "Delivery Date" },

                { "DeliveryStatus", "Delivery Status" }
            };
                    return Extensions.GenerateExcel(dt, "SaleInformation", customHeaders, "Sale Information", false);
                }

                // Empty Excel if no data
                return Extensions.GenerateExcel(new DataTable(), "SaleInformation");
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ActionResult> ProductLeatestPricePreview(MISReportVM param)
        {
            try
            {
                param.CompanyId = Session["CompanyId"] != null ? Session["CompanyId"].ToString() : "";
                param.BranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "";
                //if (param.BranchId == "0")
                //{
                //    param.BranchId = null;
                //}
                //if (param.CustomerId == "0")
                //{
                //    param.CustomerId = null;
                //}
                var resultStream = _repo.ProductLeatestPricePreview(param);

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

                    Response.Headers.Add("Content-Disposition", "inline; filename=SaleDelivery_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".pdf");

                    return File(fileBytes, "application/pdf");
                }
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                TempData["Message"] = e.Message.ToString();
                Session["result"] = "Fail" + "~" + e.Message;
                return RedirectToAction("Index", "Sale", new { area = "DMS", message = TempData["Message"] });
            }
        }

    }
}
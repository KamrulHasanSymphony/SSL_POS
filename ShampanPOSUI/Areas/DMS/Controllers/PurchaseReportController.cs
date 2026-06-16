using DocumentFormat.OpenXml.Drawing.Charts;
using DocumentFormat.OpenXml.ExtendedProperties;
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
    public class PurchaseReportController : Controller
    {
        private readonly ApplicationDbContext _applicationDb;
        PurchaseReportRepo _repo = new PurchaseReportRepo();
        CommonRepo _commonRepo = new CommonRepo();

        // GET: DMS/Purchase

        public ActionResult PurchaseReturnvsPurchaseReportIndex()
        {
            var vm = new PurchaseReportVM();
            vm.IsSummary = false;

            return View(vm);
        }

        public ActionResult PurchaseReturnvsPurchaseReportList(int? supplierId, string fromDate, string toDate, string purchaseFromDate, string purchaseToDate, bool isSummary, int? productId, int? purchaseId, int? purchasesReturnId, string supplierCode, string supplierName, string productName, int? companyId)
        {
            List<PurchaseReportVM> vmList = new List<PurchaseReportVM>();
            var company = Session["CompanyId"] != null ? Session["CompanyId"].ToString() : "0";
            PurchaseReportVM param = new PurchaseReportVM();

            param.SupplierId = supplierId ?? 0;
            param.ProductId = productId ?? 0;
            param.CompanyId = Convert.ToInt32(company);
            param.PurchaseId = purchaseId ?? 0;
            param.PurchasesReturnId = purchasesReturnId ?? 0;
            param.ProductName = productName ?? "";
            param.InvoiceFromDate = string.IsNullOrEmpty(fromDate)
                ? ""
                : fromDate;

            param.InvoiceToDate = string.IsNullOrEmpty(toDate)
                ? ""
                : toDate;

            param.PurchaseFromDate = string.IsNullOrEmpty(purchaseFromDate)
                ? ""
                : purchaseFromDate;

            param.PurchaseToDate = string.IsNullOrEmpty(purchaseToDate)
                ? DateTime.Now.ToString("yyyy-MM-dd")
                : purchaseToDate;

            param.IsSummary = isSummary;

            param.Code = string.IsNullOrEmpty(supplierCode)
                ? ""
                : supplierCode;

            param.SupplierName = string.IsNullOrEmpty(supplierName)
                ? ""
                : supplierName;

            ResultVM result = _repo.PurchaseReturnvsPurchaseReportList(param);

            if (result.Status == "Success" && result.DataVM != null)
            {
                vmList = JsonConvert.DeserializeObject<List<PurchaseReportVM>>
                (
                    result.DataVM.ToString()
                );
            }

            // ViewBag
            ViewBag.SupplierId = supplierId;
            ViewBag.SupplierName = supplierName ?? "All";

            ViewBag.ProductId = productId ?? 0;
            ViewBag.ProductName = productName ?? "All";

            ViewBag.PurchaseId = purchaseId ?? 0;
            ViewBag.PurchasesReturnId = purchasesReturnId ?? 0;

            ViewBag.InvoiceFromDate = fromDate ?? "All";
            ViewBag.InvoiceToDate = toDate ?? "All";

            ViewBag.PurchaseFromDate = purchaseFromDate ?? "All";
            ViewBag.PurchaseToDate = purchaseToDate ?? "All";

            ViewBag.IsSummary = isSummary;

            ViewBag.CompanyName = vmList.FirstOrDefault()?.CompanyName ?? "N/A";
            ViewBag.BranchName = vmList.FirstOrDefault()?.BranchName ?? "N/A";


            // ==========================
            // Summary / Details View
            // ==========================

            string viewName = isSummary
                ? "Reports/PurchaseReturnvsPurchaseSummary"
                : "Reports/PurchaseReturnvsPurchaseDetails";

            return View(viewName, vmList);


        }

    }
}
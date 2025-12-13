using Newtonsoft.Json;
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
using System.Web.Mvc;

namespace ShampanPOSUI.Areas.DMS.Controllers
{
    [Authorize]
    [RouteArea("DMS")]
    public class CustomerJournalController : Controller
    {
        private readonly ApplicationDbContext _applicationDb;
        CustomerJournalRepo _repo = new CustomerJournalRepo();
        CommonRepo _commonRepo = new CommonRepo();

        // GET: DMS/CustomerJournal
        public ActionResult ReportPreview()
        {
            return View();
        }
        [HttpPost]
        public async Task<ActionResult> ReportPreview(CommonVM param)
        {
            param.CompanyId = Session["CompanyId"]?.ToString() ?? "";
            var resultStream = _repo.ReportPreview(param);

            if (resultStream == null) return Content("Failed to generate report.");

            using (var memoryStream = new MemoryStream())
            {
                await resultStream.CopyToAsync(memoryStream);
                return File(memoryStream.ToArray(), "application/pdf", "CustomerJournal.pdf");
            }
        }
    }
}
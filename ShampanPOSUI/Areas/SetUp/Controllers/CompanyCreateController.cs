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

namespace ShampanPOSUI.Areas.SetUp.Controllers
{
    public class CompanyCreateController : Controller
    {
        private readonly ApplicationDbContext _applicationDb;
        CompanyProfileRepo _repo = new CompanyProfileRepo();
        CommonRepo _commonRepo = new CommonRepo();

        // GET: SetUp/CompanyProfile
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Create(string id)
        {
            CompanyProfileVM vm = new CompanyProfileVM();
            vm.Operation = "add";
            vm.IsActive = true;
            vm.UserId = id;
            vm.FYearStart = null;
            vm.FYearEnd = null;
            DateTime currentDate = DateTime.Now;
            DateTime firstDayOfMonth = new DateTime(currentDate.Year, currentDate.Month, 1);
            DateTime lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);
            firstDayOfMonth = firstDayOfMonth.AddMonths(-5);

            DateTime startDate = Convert.ToDateTime("01/Jan/" + DateTime.Now.Year.ToString());
            DateTime endDate = Convert.ToDateTime("31/Dec/" + DateTime.Now.Year.ToString());

            return View("CompanyCreate", vm);
        }



        [HttpPost]
        public ActionResult CreateEdit(CompanyProfileVM model)
        {
            ResultModel<CompanyProfileVM> result = new ResultModel<CompanyProfileVM>();
            ResultVM resultVM = new ResultVM {Status = "Fail",Message = "Error",Id = "0",DataVM = null };

            _repo = new CompanyProfileRepo();

            try
            {
                // ✅ Basic null check (instead of ModelState)
                if (model == null)
                {
                    return Json(new ResultModel<CompanyProfileVM>{ Success = false,Status = Status.Fail, Message = "Invalid request data",});
                }

                string operation = model.Operation?.ToLower();

                // ================= ADD =================
                if (operation == "add")
                {
                   // model.CreatedBy = Session["UserId"]?.ToString();
                    model.CreatedBy = model.UserId;
                    model.CreatedFrom = Ordinary.GetLocalIpAddress();

                    resultVM = _repo.Insert(model);

                    if (resultVM != null && resultVM.Status == ResultStatus.Success.ToString())
                    {
                        // ✅ Safe deserialize
                        if (!string.IsNullOrEmpty(resultVM.DataVM?.ToString()))
                        {
                            model = JsonConvert.DeserializeObject<CompanyProfileVM>(resultVM.DataVM.ToString());
                        }

                        // 🔥 After insert, switch to update
                        model.Operation = "update";

                        Session["result"] = resultVM.Status + "~" + resultVM.Message;

                        return Json(new ResultModel<CompanyProfileVM>
                        {
                            Success = true,
                            Status = Status.Success,
                            Message = resultVM.Message,
                            Data = model
                        });
                    }
                    else
                    {
                        Session["result"] = "Fail~" + resultVM?.Message;

                        return Json(new ResultModel<CompanyProfileVM>
                        {
                            Success = false,
                            Status = Status.Fail,
                            Message = resultVM?.Message ?? "Insert failed",
                            Data = model
                        });
                    }
                }

                // ================= UPDATE =================
                else if (operation == "update")
                {
                    model.LastModifiedBy = Session["UserId"]?.ToString();
                    model.LastUpdateFrom = Ordinary.GetLocalIpAddress();

                    resultVM = _repo.Update(model);

                    if (resultVM != null && resultVM.Status == ResultStatus.Success.ToString())
                    {
                        Session["result"] = resultVM.Status + "~" + resultVM.Message;

                        return Json(new ResultModel<CompanyProfileVM>
                        {
                            Success = true,
                            Status = Status.Success,
                            Message = resultVM.Message,
                            Data = model
                        });
                    }
                    else
                    {
                        Session["result"] = "Fail~" + resultVM?.Message;

                        return Json(new ResultModel<CompanyProfileVM>
                        {
                            Success = false,
                            Status = Status.Fail,
                            Message = resultVM?.Message ?? "Update failed",
                            Data = model
                        });
                    }
                }

                // ================= INVALID =================
                else
                {
                    return Json(new ResultModel<CompanyProfileVM>
                    {
                        Success = false,
                        Status = Status.Fail,
                        Message = "Invalid operation",
                        Data = model
                    });
                }
            }
            catch (Exception e)
            {
                Session["result"] = "Fail~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);

                return Json(new ResultModel<CompanyProfileVM>
                {
                    Success = false,
                    Status = Status.Fail,
                    Message = e.Message,
                    Data = model
                });
            }
        }

    }
}
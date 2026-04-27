using Newtonsoft.Json;
using ShampanPOS.Models;
using ShampanPOS.Models.Helper;
using ShampanPOS.Models.KendoCommon;
using ShampanPOS.Repo;
using ShampanPOSUI.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ShampanPOSUI.Areas.DMS.Controllers
{

    [Authorize]
    [RouteArea("DMS")]
    public class TableInfoController : Controller
    {
        private readonly ApplicationDbContext _applicationDb;
        TableInfoRepo _repo = new TableInfoRepo();
        CommonRepo _commonRepo = new CommonRepo();

        // GET: DMS/BankInformation
        public ActionResult Index()
        {
            TableInfoVM vm = new TableInfoVM();
            var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
            vm.BranchId = Convert.ToInt32(currentBranchId);

            return View(vm);
        }

        public ActionResult Create()
        {
            TableInfoVM vm = new TableInfoVM();
            vm.Operation = "add";
            vm.IsActive = true;
            var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
            //vm.BranchId = Convert.ToInt32(currentBranchId);
            //vm.RegularDiscountRate = 0;

            return View("Create", vm);
        }
        [HttpPost]
        public ActionResult CreateEdit(TableInfoVM model)
        {
            ResultModel<TableInfoVM> result = new ResultModel<TableInfoVM>();
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new TableInfoRepo();

            try
            {
                var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
                model.BranchId = Convert.ToInt32(currentBranchId);
                model.CompanyId = Convert.ToInt32(Session["CompanyId"] != null ? Session["CompanyId"].ToString() : "");

                //model.LastModifiedBy = Session["UserId"].ToString();
                //model.LastModifiedOn = DateTime.Now.ToString();
                //model.LastUpdateFrom = Ordinary.GetLocalIpAddress();

                if (model.Operation.ToLower() == "add")
                {
                    model.CreatedBy = Session["UserId"].ToString();
                   // model.UserId = Session["UserHashId"]?.ToString();

                    model.CreatedOn = DateTime.Now.ToString();
                    model.CreatedFrom = Ordinary.GetLocalIpAddress();

                    resultVM = _repo.Insert(model);

                    if (resultVM.Status == ResultStatus.Success.ToString())
                    {
                        model = JsonConvert.DeserializeObject<TableInfoVM>(resultVM.DataVM.ToString());
                        model.Operation = "add";

                        Session["result"] = resultVM.Status + "~" + resultVM.Message;

                        result = new ResultModel<TableInfoVM>()
                        {
                            Success = true,
                            Status = Status.Success,
                            Message = resultVM.Message,
                            Data = model
                        };
                    }
                    else
                    {
                        Session["result"] = "Fail~" + resultVM.Message;

                        result = new ResultModel<TableInfoVM>()
                        {
                            Status = Status.Fail,
                            Message = resultVM.Message,
                            Data = model
                        };
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

                        result = new ResultModel<TableInfoVM>()
                        {
                            Success = true,
                            Status = Status.Success,
                            Message = resultVM.Message,
                            Data = model
                        };
                    }
                    else
                    {
                        Session["result"] = "Fail~" + resultVM.Message;

                        result = new ResultModel<TableInfoVM>()
                        {
                            Status = Status.Fail,
                            Message = resultVM.Message,
                            Data = model
                        };
                    }
                }
                else
                {
                    return RedirectToAction("Index");
                }
            }
            catch (Exception e)
            {
                Session["result"] = "Fail~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return View("Create", model);
            }

            return Json(result);
        }


        [HttpGet]
        public ActionResult Edit(string id)
        {
            try
            {
                _repo = new TableInfoRepo();

                TableInfoVM vm = new TableInfoVM();
                CommonVM param = new CommonVM();
                param.Id = id;
                ResultVM result = _repo.List(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<TableInfoVM>>(result.DataVM.ToString()).FirstOrDefault();
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
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                Session["result"] = "Fail" + "~" + e.Message;
                return RedirectToAction("Index");
            }
        }


        [HttpPost]
        public JsonResult GetGridData(GridOptions options)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new TableInfoRepo();

            try
            {
                result = _repo.GetGridData(options);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<TableInfoVM>>(result.DataVM.ToString());

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
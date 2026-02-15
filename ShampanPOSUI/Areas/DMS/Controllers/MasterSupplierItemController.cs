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
    public class MasterSupplierItemController : Controller
    {

        private readonly ApplicationDbContext _applicationDb;
        MasterSupplierItemRepo _repo = new MasterSupplierItemRepo();
        CommonRepo _commonRepo = new CommonRepo();

        public ActionResult Index()
        {
            return View();
        }


        public ActionResult Create()
        {
            MasterSupplierItemVM vm = new MasterSupplierItemVM();
            vm.Operation = "add";
            var companyId = Session["CompanyId"];
            vm.CompanyId = Convert.ToInt32(companyId);
            var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";


            return View("Create", vm);
        }


        public ActionResult CreateSupplier()
        {
            MasterSupplierItemVM vm = new MasterSupplierItemVM();
            vm.Operation = "add";
            var companyId = Session["CompanyId"];
            vm.CompanyId = Convert.ToInt32(companyId);

            vm.IsActive = true;

            return View("Create", vm);

        }



        [HttpPost]
        public ActionResult CreateEdit(MasterSupplierItemVM model)
        {
            ResultModel<MasterSupplierItemVM> result = new ResultModel<MasterSupplierItemVM>();
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new MasterSupplierItemRepo();


            try
            {
                model.CompanyId = Convert.ToInt32(Session["CompanyId"] != null ? Session["CompanyId"].ToString() : "");

                var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
                //model.BranchId = Convert.ToInt32(currentBranchId);
                //model.CompanyId = Convert.ToInt32(Session["CompanyId"] != null ? Session["CompanyId"].ToString() : "");


                if (model.Operation.ToLower() == "add")
                {
                    model.CreatedBy = Session["UserId"].ToString();
                    model.UserId = Session["UserHashId"]?.ToString();
                    model.CreatedOn = DateTime.Now.ToString();
                    model.CreatedFrom = Ordinary.GetLocalIpAddress();

                    resultVM = _repo.Insert(model);

                    if (resultVM.Status == ResultStatus.Success.ToString())
                    {
                        model = JsonConvert.DeserializeObject<MasterSupplierItemVM>(resultVM.DataVM.ToString());
                        model.Operation = "add";
                        Session["result"] = resultVM.Status + "~" + resultVM.Message;
                        result = new ResultModel<MasterSupplierItemVM>()
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

                        result = new ResultModel<MasterSupplierItemVM>()
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
                    model.CreatedBy = Session["UserId"].ToString();
                    model.UserId = Session["UserHashId"]?.ToString();
                    model.CreatedOn = DateTime.Now.ToString();
                    model.CreatedFrom = Ordinary.GetLocalIpAddress();

                    resultVM = _repo.Update(model);

                    if (resultVM.Status == ResultStatus.Success.ToString())
                    {
                        Session["result"] = resultVM.Status + "~" + resultVM.Message;
                        result = new ResultModel<MasterSupplierItemVM>()
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

                        result = new ResultModel<MasterSupplierItemVM>()
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
                _repo = new MasterSupplierItemRepo();

                MasterSupplierItemVM vm = new MasterSupplierItemVM();
                CommonVM param = new CommonVM();
                param.Id = id;
                ResultVM result = _repo.List(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<MasterSupplierItemVM>>(result.DataVM.ToString()).FirstOrDefault();
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
                vm.TableName = "BranchProfiles";

                ResultVM result = _commonRepo.NextPrevious(vm);

                if (result.Id != "0")
                {
                    string url = Url.Action("Edit", "BranchProfile", new { area = "DMS", id = result.Id });
                    return Redirect(url);
                }
                else
                {
                    string url = Url.Action("Edit", "BranchProfile", new { area = "DMS", id = id });
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
        public ActionResult Delete(MasterSupplierItemVM vm)
        {
            ResultModel<MasterSupplierItemVM> result = new ResultModel<MasterSupplierItemVM>();

            try
            {
                _repo = new MasterSupplierItemRepo();
                CommonVM param = new CommonVM();
                //param.IDs = vm.IDs;
                param.ModifyBy = Session["UserId"].ToString();
                param.ModifyFrom = Ordinary.GetLocalIpAddress();

                ResultVM resultData = _repo.Delete(param);

                Session["result"] = resultData.Status + "~" + resultData.Message;

                result = new ResultModel<MasterSupplierItemVM>()
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
            _repo = new MasterSupplierItemRepo();

            try
            {
                result = _repo.GetGridData(options);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<MasterSupplierItemVM>>(result.DataVM.ToString());

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
using Newtonsoft.Json;
using ShampanPOS.Models;
using ShampanPOS.Models.KendoCommon;
using ShampanPOS.Repo;
using ShampanPOS.Repo.Helper;
using ShampanPOSUI.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace ShampanPOSUI.Areas.DMS.Controllers
{
    [Authorize]
    [RouteArea("DMS")]
    public class BranchCreditLimitController : Controller
    {
        private readonly ApplicationDbContext _applicationDb;
        BranchCreditLimitRepo _repo = new BranchCreditLimitRepo();

        // GET: DMS/BranchCreditLimit
        public ActionResult Index(int? id)
        {
            if (id == 0 || id == null)
            {
                return View();
            }
            else
            {
                BranchCreditLimitVM BranchCreditLimit = new BranchCreditLimitVM()
                {
                    IsIndex = true,
                    BranchId = id.Value
                };
                return View("Index", BranchCreditLimit);
            }
        }

        public ActionResult Create(int BranchId)
        {

            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            BranchCreditLimitVM vm = new BranchCreditLimitVM();
            BranchCreditLimitRepo _repo = new BranchCreditLimitRepo();
            BranchProfileRepo _branchProfilerepo = new BranchProfileRepo();
            vm.Operation = "add";
            vm.BranchId = BranchId;
            vm.IsIndex = false;
            if (vm != null && vm.BranchId != 0)
            {
                BranchProfileVM BranchProfilevm = new BranchProfileVM();
                CommonVM param = new CommonVM();
                param.Id = vm.BranchId.ToString();
                ResultVM result = _branchProfilerepo.List(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    // Deserialize DataVM into a List
                    List<BranchProfileVM> branchList = JsonConvert.DeserializeObject<List<BranchProfileVM>>(result.DataVM.ToString());
                    BranchProfilevm = branchList.FirstOrDefault();

                    if (branchList != null && branchList.Any())
                    {
                        // Deserialize DataVM correctly if it's a JSON array
                        List<BranchCreditLimitVM> branchCreditLimitList = JsonConvert.DeserializeObject<List<BranchCreditLimitVM>>(result.DataVM.ToString());
                        var data = branchCreditLimitList.FirstOrDefault(); // Get first item

                        if (data != null)
                        {
                            vm.BranchName = BranchProfilevm.Name;
                            vm.BranchCode = BranchProfilevm.Code;
                        }
                    }
                }
            }

            return View("Create", vm);
        }        

        [HttpPost]
        public ActionResult CreateEdit(BranchCreditLimitVM model)
        {
            ResultModel<BranchCreditLimitVM> result = new ResultModel<BranchCreditLimitVM>();
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new BranchCreditLimitRepo();

            if (ModelState.IsValid)
            {
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
                            model = JsonConvert.DeserializeObject<BranchCreditLimitVM>(resultVM.DataVM.ToString());
                            model.Operation = "add";
                            Session["result"] = resultVM.Status + "~" + resultVM.Message;
                            result =  new ResultModel<BranchCreditLimitVM>()
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

                            result = new ResultModel<BranchCreditLimitVM>()
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
                            result = new ResultModel<BranchCreditLimitVM>()
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

                            result = new ResultModel<BranchCreditLimitVM>()
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
                string msg = string.Empty;
                foreach (var entry in ModelState.Values)
                {
                    if (entry.Errors.Count > 0)
                    {
                        foreach (var error in entry.Errors)
                        {
                            msg += "," + error.ErrorMessage;
                        }
                    }
                }

                result = new ResultModel<BranchCreditLimitVM>()
                {
                    Success = false,
                    Status = Status.Fail,
                    Message = msg + " Model State Error!",
                    Data = model
                };
                return Json(result);
            }
            //return View("Create", model);

        }

        [HttpGet]
        public ActionResult Edit(int id)
        {
            try
            {
                _repo = new BranchCreditLimitRepo();

                BranchCreditLimitVM vm = new BranchCreditLimitVM();
                vm.Id = id;
                ResultVM result = _repo.List(vm);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<BranchCreditLimitVM>>(result.DataVM.ToString()).FirstOrDefault();
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

        [HttpPost]
        public ActionResult Delete(BranchCreditLimitVM vm)
        {
            ResultModel<BranchCreditLimitVM> result = new ResultModel<BranchCreditLimitVM>();

            try
            {
                _repo = new BranchCreditLimitRepo();                

                ResultVM resultData = _repo.Delete(vm);

                Session["result"] = resultData.Status + "~" + resultData.Message;

                result = new ResultModel<BranchCreditLimitVM>()
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
        public JsonResult GetGridData(GridOptions options,string getBranchId)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new BranchCreditLimitRepo();

            try
            {
                result = _repo.GetGridData(options,getBranchId);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<BranchCreditLimitVM>>(result.DataVM.ToString());

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


        [HttpPost]
        public ActionResult MultiplePost(BranchCreditLimitVM vm)
        {
            ResultModel<BranchCreditLimitVM> result = new ResultModel<BranchCreditLimitVM>();

            try
            {
                _repo = new BranchCreditLimitRepo();

                CommonVM param = new CommonVM();

                param.IDs = vm.IDs;
                param.ModifyBy = Session["UserId"].ToString();
                param.ModifyFrom = Ordinary.GetLocalIpAddress();

                ResultVM resultData = _repo.MultiplePost(param);


                Session["result"] = resultData.Status + "~" + resultData.Message;

                result = new ResultModel<BranchCreditLimitVM>()
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





    }
}
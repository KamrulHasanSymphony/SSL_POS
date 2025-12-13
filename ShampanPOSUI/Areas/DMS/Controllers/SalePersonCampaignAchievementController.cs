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
    public class SalePersonCampaignAchievementController : Controller
    {
        private readonly ApplicationDbContext _applicationDb;
        SalePersonCampaignAchievementRepo _repo = new SalePersonCampaignAchievementRepo();

        // GET: DMS/SalePersonCampaignAchievement
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Create()
        {
            SalePersonCampaignAchievementVM vm = new SalePersonCampaignAchievementVM();
            vm.Operation = "add";
            var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
            vm.BranchId = Convert.ToInt32(currentBranchId);

            return View("Create", vm);
        }        

        [HttpPost]
        public ActionResult CreateEdit(SalePersonCampaignAchievementVM model)
        {
            ResultModel<SalePersonCampaignAchievementVM> result = new ResultModel<SalePersonCampaignAchievementVM>();
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new SalePersonCampaignAchievementRepo();

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
                            model = JsonConvert.DeserializeObject<SalePersonCampaignAchievementVM>(resultVM.DataVM.ToString());
                            model.Operation = "add";
                            Session["result"] = resultVM.Status + "~" + resultVM.Message;
                            result =  new ResultModel<SalePersonCampaignAchievementVM>()
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

                            result = new ResultModel<SalePersonCampaignAchievementVM>()
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
                            result = new ResultModel<SalePersonCampaignAchievementVM>()
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

                            result = new ResultModel<SalePersonCampaignAchievementVM>()
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
                            msg += " " + error.ErrorMessage;
                        }
                    }
                }

                result = new ResultModel<SalePersonCampaignAchievementVM>()
                {
                    Success = false,
                    Status = Status.Fail,
                    Message = msg + " Model State Error!",
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
                _repo = new SalePersonCampaignAchievementRepo();

                SalePersonCampaignAchievementVM vm = new SalePersonCampaignAchievementVM();
                CommonVM param = new CommonVM();
                param.Id = id;
                ResultVM result = _repo.List(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<SalePersonCampaignAchievementVM>>(result.DataVM.ToString()).FirstOrDefault();
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
        public ActionResult Delete(SalePersonCampaignAchievementVM vm)
        {
            ResultModel<SalePersonCampaignAchievementVM> result = new ResultModel<SalePersonCampaignAchievementVM>();

            try
            {
                _repo = new SalePersonCampaignAchievementRepo();

                CommonVM param = new CommonVM();

                param.IDs = vm.IDs;
                param.ModifyBy = Session["UserId"].ToString();
                param.ModifyFrom = Ordinary.GetLocalIpAddress();

                ResultVM resultData = _repo.Delete(param);

                Session["result"] = resultData.Status + "~" + resultData.Message;

                result = new ResultModel<SalePersonCampaignAchievementVM>()
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
        public ActionResult MultiplePost(PurchaseReturnVM vm)
        {
            ResultModel<PurchaseReturnVM> result = new ResultModel<PurchaseReturnVM>();

            try
            {
                _repo = new SalePersonCampaignAchievementRepo();

                CommonVM param = new CommonVM();

                param.IDs = vm.IDs;
                param.ModifyBy = Session["UserId"].ToString();
                param.ModifyFrom = Ordinary.GetLocalIpAddress();

                ResultVM resultData = _repo.MultiplePost(param);

                Session["result"] = resultData.Status + "~" + resultData.Message;

                result = new ResultModel<PurchaseReturnVM>()
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
            _repo = new SalePersonCampaignAchievementRepo();

            try
            {
                result = _repo.GetGridData(options);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<SalePersonCampaignAchievementVM>>(result.DataVM.ToString());

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
        public ActionResult ProcessData(int salePersonId, string startDate,int? branchId)
        {
            ResultModel<SalePersonCampaignAchievementVM> result = new ResultModel<SalePersonCampaignAchievementVM>();
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new SalePersonCampaignAchievementRepo();

            var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
            branchId = Convert.ToInt32(currentBranchId);
            try
            {
                resultVM = _repo.ProcessData(salePersonId, startDate, branchId);

                if (resultVM.Status == ResultStatus.Success.ToString())
                {
                    var data = JsonConvert.DeserializeObject<SalePersonCampaignAchievementVM>(resultVM.DataVM.ToString());
                    
                    Session["result"] = resultVM.Status + "~" + resultVM.Message;
                    result = new ResultModel<SalePersonCampaignAchievementVM>()
                    {
                        Success = true,
                        Status = Status.Success,
                        Message = resultVM.Message,
                        Data = data
                    };
                    return Json(result);
                }
                else
                {
                    Session["result"] = "Fail" + "~" + resultVM.Message;

                    result = new ResultModel<SalePersonCampaignAchievementVM>()
                    {
                        Status = Status.Fail,
                        Message = resultVM.Message,
                        Data = null
                    };
                    return Json(result);
                }
            }
            catch (Exception ex)
            {

                throw ex.InnerException;
            }
                    

        }


    }
}
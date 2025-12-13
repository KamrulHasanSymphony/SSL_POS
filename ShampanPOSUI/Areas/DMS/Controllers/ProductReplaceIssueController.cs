using Newtonsoft.Json;
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
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace ShampanPOSUI.Areas.DMS.Controllers
{
    [Authorize]
    [RouteArea("DMS")]
    public class ProductReplaceIssueController : Controller
    {
        private readonly ApplicationDbContext _applicationDb;
        ProductReplaceIssueRepo _repo = new ProductReplaceIssueRepo();
        CommonRepo _commonRepo = new CommonRepo();

        // GET: DMS/ProductReplaceIssue
        public ActionResult Index()
        {
            ProductReplaceIssueVM vm = new ProductReplaceIssueVM();
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

        public ActionResult Create()
        {
            ProductReplaceIssueVM vm = new ProductReplaceIssueVM();
            vm.Operation = "add";
            var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
            vm.BranchId = Convert.ToInt32(currentBranchId);
            var currencyId = Session["CurrencyId"] != null ? Session["CurrencyId"].ToString() : "1";

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
        public ActionResult CreateEdit(ProductReplaceIssueVM model)
        {
            ResultModel<ProductReplaceIssueVM> result = new ResultModel<ProductReplaceIssueVM>();
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new ProductReplaceIssueRepo();

            if (ModelState.IsValid)
            {
                try
                {
                    if (model.Operation.ToLower() == "add")
                    {
                        model.CreatedBy = Session["UserId"].ToString();
                        model.CreatedOn = DateTime.Now.ToString();
                        model.CreatedFrom = Ordinary.GetLocalIpAddress();
                        var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
                        model.BranchId = Convert.ToInt32(currentBranchId);
                        resultVM = _repo.Insert(model);

                        if (resultVM.Status == ResultStatus.Success.ToString())
                        {
                            model = JsonConvert.DeserializeObject<ProductReplaceIssueVM>(resultVM.DataVM.ToString());
                            model.Operation = "add";
                            Session["result"] = resultVM.Status + "~" + resultVM.Message;
                            result = new ResultModel<ProductReplaceIssueVM>()
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

                            result = new ResultModel<ProductReplaceIssueVM>()
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
                            result = new ResultModel<ProductReplaceIssueVM>()
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

                            result = new ResultModel<ProductReplaceIssueVM>()
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
            return View("Create", model);
        }

        [HttpGet]
        public ActionResult Edit(string id)
        {
            try
            {
                _repo = new ProductReplaceIssueRepo();

                ProductReplaceIssueVM vm = new ProductReplaceIssueVM();
                CommonVM param = new CommonVM();
                param.Id = id;
                ResultVM result = _repo.List(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<ProductReplaceIssueVM>>(result.DataVM.ToString()).FirstOrDefault();
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
        public ActionResult Delete(ProductReplaceIssueVM vm)
        {
            ResultModel<ProductReplaceIssueVM> result = new ResultModel<ProductReplaceIssueVM>();

            try
            {
                _repo = new ProductReplaceIssueRepo();

                ResultVM resultData = _repo.Delete(vm);

                Session["result"] = resultData.Status + "~" + resultData.Message;

                result = new ResultModel<ProductReplaceIssueVM>()
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
        public JsonResult GetGridData(GridOptions options, string branchId, string fromDate, string toDate)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new ProductReplaceIssueRepo();
            try
            {
                options.vm.BranchId = branchId == "0" ? "" : branchId;
                options.vm.FromDate = fromDate;
                options.vm.ToDate = toDate;
                options.vm.UserId = Session["UserId"].ToString();

                result = _repo.GetGridData(options);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<ProductReplaceIssueVM>>(result.DataVM.ToString());

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
                vm.TableName = "ProductReplaceReceive";

                ResultVM result = _commonRepo.NextPrevious(vm);

                if (result.Id != "0")
                {
                    string url = Url.Action("Edit", "ProductReplaceReceive", new { area = "DMS", id = result.Id });
                    return Redirect(url);
                }
                else
                {
                    string url = Url.Action("Edit", "ProductReplaceReceive", new { area = "DMS", id = id });
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
        public ActionResult MultiplePost(ProductReplaceIssueVM vm)
        {
            ResultModel<ProductReplaceIssueVM> result = new ResultModel<ProductReplaceIssueVM>();

            try
            {
                _repo = new ProductReplaceIssueRepo();

                CommonVM param = new CommonVM();

                param.IDs = vm.IDs;
                param.ModifyBy = Session["UserId"].ToString();
                param.ModifyFrom = Ordinary.GetLocalIpAddress();

                ResultVM resultData = _repo.MultiplePost(param);

                Session["result"] = resultData.Status + "~" + resultData.Message;

                if (resultData.Status == "Success")
                {
                    result = new ResultModel<ProductReplaceIssueVM>()
                    {
                        Success = true,
                        Status = Status.Success,
                        Message = resultData.Message,
                        Data = null
                    };
                }
                else
                {
                    result = new ResultModel<ProductReplaceIssueVM>()
                    {
                        Success = false,
                        Status = Status.Fail,
                        Message = resultData.Message,
                        Data = null
                    };
                }

                return Json(result);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return RedirectToAction("Index");
            }
        }


        [HttpGet]
        public ActionResult FromProductReplaceReceive()
        {
            ProductReplaceIssueVM vm = new ProductReplaceIssueVM();
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
        public JsonResult FromProductReplaceReceiveGridData(GridOptions options)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new ProductReplaceIssueRepo();

            try
            {
                result = _repo.FromProductReplaceReceiveGridData(options);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<ProductReplaceReceiveVM>>(result.DataVM.ToString());

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
        public ActionResult GetFromProductReplaceReceive(CommonVM vm)
        {
            try
            {
                ProductReplaceReceiveRepo _repo = new ProductReplaceReceiveRepo();
                ProductReplaceIssueVM productReplaceIssue = new ProductReplaceIssueVM();
                vm.Id = vm.IDs[0];

                ResultVM result = _repo.ProductReplaceReceiveList(vm);
              

                if (result.Status == "Success" && result.DataVM != null)
                {
                    productReplaceIssue = JsonConvert.DeserializeObject<List<ProductReplaceIssueVM>>(result.DataVM.ToString()).FirstOrDefault();
                }

                productReplaceIssue.Operation = "add";
                productReplaceIssue.IsPost = false;
                productReplaceIssue.IssueDate = DateTime.Now.ToString("yyyy-MM-dd");
    

                #region DecimalPlace
                CommonVM commonVM = new CommonVM();
                commonVM.Group = "SaleDecimalPlace";
                commonVM.Name = "SaleDecimalPlace";

                var settingsValue = _commonRepo.GetSettingsValue(commonVM);

                if (settingsValue.Status == "Success" && settingsValue.DataVM != null)
                {
                    var data = JsonConvert.DeserializeObject<List<CommonVM>>(settingsValue.DataVM.ToString()).FirstOrDefault();
                    productReplaceIssue.DecimalPlace = string.IsNullOrEmpty(data.SettingValue) ? 2 : Convert.ToInt32(data.SettingValue);
                }

                #endregion

                return View("Create", productReplaceIssue);
            }
            catch (Exception e)
            {
                Session["result"] = "Fail" + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return RedirectToAction("Index");
            }
        }




        [HttpGet]
        public JsonResult GetProductReplaceIssueDetailDataById(GridOptions options, int masterId)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new ProductReplaceIssueRepo();

            try
            {
                result = _repo.GetProductReplaceIssueDetailDataById(options, masterId);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<ProductReplaceIssueDetailsVM>>(result.DataVM.ToString());

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

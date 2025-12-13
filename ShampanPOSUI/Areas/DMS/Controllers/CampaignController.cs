using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
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
    public class CampaignController : Controller
    {
        private readonly ApplicationDbContext _applicationDb;
        CampaignRepo _repo = new CampaignRepo();

        // GET: DMS/Campaign
        public ActionResult Index(string Type)
        {
            CampaignVM vm = new CampaignVM();
            _repo = new CampaignRepo();

            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };

            var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
            vm.BranchId = Convert.ToInt32(currentBranchId);
            vm.Branchs = Convert.ToInt32(currentBranchId);
            DateTime currentDate = DateTime.Now;
            DateTime firstDayOfMonth = new DateTime(currentDate.Year, currentDate.Month, 1);
            DateTime lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);
            firstDayOfMonth = firstDayOfMonth.AddMonths(-5);
            vm.FromDate = firstDayOfMonth.ToString("yyyy/MM/dd");
            vm.ToDate = lastDayOfMonth.ToString("yyyy/MM/dd");

            resultVM = _repo.EnumList(new CommonVM() { Value = "Campaign" });
            if (resultVM.Status == ResultStatus.Success.ToString())
            {
                List<EnumTypeVM> enumvm = JsonConvert.DeserializeObject<List<EnumTypeVM>>(resultVM.DataVM.ToString());
                var result  = enumvm.FirstOrDefault(e => e.Name == Type);
                vm.EnumTypeId = result.Id;
                vm.EnumName = result.Name;


            }
            return View(vm);
        }

        public ActionResult DetailsIndex(string Type)
        {
            CampaignDetail vm = new CampaignDetail();
            _repo = new CampaignRepo();

            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };

            var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
            vm.BranchId = Convert.ToInt32(currentBranchId);
            vm.Branchs = Convert.ToInt32(currentBranchId);
            DateTime currentDate = DateTime.Now;
            DateTime firstDayOfMonth = new DateTime(currentDate.Year, currentDate.Month, 1);
            DateTime lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);
            firstDayOfMonth = firstDayOfMonth.AddMonths(-5);
            vm.FromDate = firstDayOfMonth.ToString("yyyy/MM/dd");
            vm.ToDate = lastDayOfMonth.ToString("yyyy/MM/dd");

            resultVM = _repo.EnumList(new CommonVM() { Value = "Campaign" });
            if (resultVM.Status == ResultStatus.Success.ToString())
            {
                List<EnumTypeVM> enumvm = JsonConvert.DeserializeObject<List<EnumTypeVM>>(resultVM.DataVM.ToString());
                var result = enumvm.FirstOrDefault(e => e.Name == Type);
                vm.EnumTypeId = result.Id;
                vm.EnumName = result.Name;


            }

            return View(vm);
        }

        public ActionResult Create(CampaignVM vm )
        {
            vm.Operation = "add";
            vm.IsActive = true;
            var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
            vm.BranchId = Convert.ToInt32(currentBranchId);
     
        
            return View("Create", vm);
        }

        [HttpPost]
        public ActionResult CreateEdit(CampaignVM model)
        {
            ResultModel<CampaignVM> result = new ResultModel<CampaignVM>();
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new CampaignRepo();

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
                            model = JsonConvert.DeserializeObject<CampaignVM>(resultVM.DataVM.ToString());
                            model.Operation = "add";
                            Session["result"] = resultVM.Status + "~" + resultVM.Message;
                            result = new ResultModel<CampaignVM>()
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

                            result = new ResultModel<CampaignVM>()
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
                            result = new ResultModel<CampaignVM>()
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

                            result = new ResultModel<CampaignVM>()
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
                _repo = new CampaignRepo();

                CampaignVM vm = new CampaignVM();
                CommonVM param = new CommonVM();
                param.Id = id;
                ResultVM result = _repo.List(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<CampaignVM>>(result.DataVM.ToString()).FirstOrDefault();
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
        public ActionResult MultiplePost(SaleVM vm)
        {
            ResultModel<SaleVM> result = new ResultModel<SaleVM>();

            try
            {
                _repo = new CampaignRepo();

                CommonVM param = new CommonVM();

                param.IDs = vm.IDs;
                param.ModifyBy = Session["UserId"].ToString();
                param.ModifyFrom = Ordinary.GetLocalIpAddress();

                ResultVM resultData = _repo.MultiplePost(param);

                Session["result"] = resultData.Status + "~" + resultData.Message;

                result = new ResultModel<SaleVM>()
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

        //[HttpPost]
        //public ActionResult Delete(CampaignVM vm)
        //{
        //    ResultModel<CampaignVM> result = new ResultModel<CampaignVM>();

        //    try
        //    {
        //        _repo = new CampaignRepo();

        //        CommonVM param = new CommonVM();
        //        param.IDs = vm.IDs;
        //        param.ModifyBy = Session["UserId"].ToString();
        //        param.ModifyFrom = Ordinary.GetLocalIpAddress();

        //        ResultVM resultData = _repo.Delete(param);

        //        Session["result"] = resultData.Status + "~" + resultData.Message;

        //        result = new ResultModel<CampaignVM>()
        //        {
        //            Success = true,
        //            Status = Status.Success,
        //            Message = resultData.Message,
        //            Data = null
        //        };

        //        return Json(result);
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return RedirectToAction("Index");
        //    }
        //}

        //[HttpPost]
        //public JsonResult GetGridData(GridOptions options ,string EnumId, string isPost, string branchId, string fromDate, string toDate)
        //{
        //    ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
        //    _repo = new CampaignRepo();

        //    try
        //    {
        //        options.vm.BranchId = branchId == "0" ? Session["CurrentBranch"].ToString() : branchId;
        //        options.vm.FromDate = fromDate;
        //        options.vm.IsPost = isPost;
        //        options.vm.ToDate = toDate;
        //        result = _repo.GetGridData(options, EnumId);

        //        if (result.Status == "Success" && result.DataVM != null)
        //        {
        //            var gridData = JsonConvert.DeserializeObject<GridEntity<CampaignVM>>(result.DataVM.ToString());

        //            return Json(new
        //            {
        //                Items = gridData.Items,
        //                TotalCount = gridData.TotalCount
        //            }, JsonRequestBehavior.AllowGet);
        //        }

        //        return Json(new { Error = true, Message = "No data found." }, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}
        [HttpPost]
        public JsonResult GetGridData(GridOptions options, string EnumId, string isPost, string branchId, string fromDate, string toDate)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new CampaignRepo();

            try
            {
                options.vm.BranchId = branchId == "0" ? Session["CurrentBranch"].ToString() : branchId;
                options.vm.FromDate = fromDate;
                options.vm.IsPost = isPost;
                options.vm.ToDate = toDate;

                result = _repo.GetGridData(options, EnumId);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<CampaignVM>>(result.DataVM.ToString());

                    foreach (var item in gridData.Items)
                    {
                        if (!string.IsNullOrEmpty(item.Description))
                        {
                            // Decode HTML entities if they exist
                            item.Description = System.Net.WebUtility.HtmlDecode(item.Description);
                        }
                    }

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
        public JsonResult GetDetailsGridData(GridOptions options, string EnumId, string isPost, string branchId, string fromDate, string toDate)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new CampaignRepo();

            try
            {
                options.vm.BranchId = branchId == "0" ? Session["CurrentBranch"].ToString() : branchId;
                options.vm.FromDate = fromDate;
                options.vm.IsPost = isPost;
                options.vm.ToDate = toDate;
                result = _repo.GetDetailsGridData(options, EnumId);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<CampaignDetail>>(result.DataVM.ToString());

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

        //[HttpGet]
        //public ActionResult GetEnumTypeList()
        //{
        //    try
        //    {
        //        var result = _repo.GetEnumTypeList();
        //        return Json(result, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}


        [HttpPost]
        public async Task<ActionResult> ReportPreview(CommonVM param)
        {
            try
            {
                _repo = new CampaignRepo();
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

                    Response.Headers.Add("Content-Disposition", "inline; filename=SaleOrder_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".pdf");

                    return File(fileBytes, "application/pdf");
                }
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                TempData["Message"] = e.Message.ToString();
                return RedirectToAction("Index", "SaleOrder", new { area = "DMS", message = TempData["Message"] });
            }
        }
    }
}

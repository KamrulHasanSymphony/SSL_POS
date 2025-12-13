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
    public class SalePersonRouteController : Controller
    {
        private readonly ApplicationDbContext _applicationDb;
        SalePersonRouteRepo _repo = new SalePersonRouteRepo();

        // GET: DMS/SalePersonRoute
        public ActionResult Index(int? id)
        {

            if(id == 0 || id == null)
            {               
                return View();
            }
            else
            {
                SalePersonRouteVM salePersonRoute = new SalePersonRouteVM()
                {
                    IsIndex = true,
                    SalePersonId = id.Value
                };
                return View("Index", salePersonRoute);
            }
            
        }

        public ActionResult Create(int SalePersonId , string SalePersonName)
        {
            SalePersonRouteVM vm = new SalePersonRouteVM();
            vm.Operation = "add";
            vm.IsIndex = false;
            vm.IsActive = true;
            vm.SalePersonId = SalePersonId;
            vm.SalePersonName = SalePersonName;
            var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
            vm.BranchId = Convert.ToInt32(currentBranchId);

            return View("Create", vm);
        }

        [HttpPost]
        public ActionResult CreateEdit(SalePersonRouteVM model)
        {
            ResultModel<SalePersonRouteVM> result = new ResultModel<SalePersonRouteVM>();
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new SalePersonRouteRepo();

            
                try
                {
                    var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
                    model.BranchId = int.Parse(currentBranchId);
                    if (model.Operation.ToLower() == "add")
                    {
                        model.CreatedBy = Session["UserId"].ToString();
                        model.CreatedOn = DateTime.Now.ToString();
                        model.CreatedFrom = Ordinary.GetLocalIpAddress();

                        resultVM = _repo.Insert(model);

                        if (resultVM.Status == ResultStatus.Success.ToString())
                        {
                            model = JsonConvert.DeserializeObject<SalePersonRouteVM>(resultVM.DataVM.ToString());
                            model.Operation = "add";
                            Session["result"] = resultVM.Status + "~" + resultVM.Message;
                            result = new ResultModel<SalePersonRouteVM>()
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

                            result = new ResultModel<SalePersonRouteVM>()
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
                            result = new ResultModel<SalePersonRouteVM>()
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

                            result = new ResultModel<SalePersonRouteVM>()
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
            
            //else
            //{
            //    result = new ResultModel<SalePersonRouteVM>()
            //    {
            //        Success = false,
            //        Status = Status.Fail,
            //        Message = "Model State Error!",
            //        Data = model
            //    };
            //    return Json(result);
            //}
        }

        [HttpGet]
        public ActionResult Edit(string id)
        {
            try
            {
                _repo = new SalePersonRouteRepo();

                SalePersonRouteVM vm = new SalePersonRouteVM();
                CommonVM param = new CommonVM();
                param.Id = id;
                ResultVM result = _repo.List(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<SalePersonRouteVM>>(result.DataVM.ToString()).FirstOrDefault();
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
        public ActionResult Delete(SalePersonRouteVM vm)
        {
            ResultModel<SalePersonRouteVM> result = new ResultModel<SalePersonRouteVM>();

            try
            {
                _repo = new SalePersonRouteRepo();

                CommonVM param = new CommonVM();

                param.IDs = vm.IDs;
                param.ModifyBy = Session["UserId"].ToString();
                param.ModifyFrom = Ordinary.GetLocalIpAddress();

                ResultVM resultData = _repo.Delete(param);

                Session["result"] = resultData.Status + "~" + resultData.Message;

                result = new ResultModel<SalePersonRouteVM>()
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
        public JsonResult GetGridData(GridOptions options,string getSalePersonId)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new SalePersonRouteRepo();

            try
            {
                result = _repo.GetGridData(options,getSalePersonId);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<SalePersonRouteVM>>(result.DataVM.ToString());

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
        public ActionResult GetRouteList()
        {
            try
            {
                var result = _repo.GetRouteList();
                return Json(result, JsonRequestBehavior.AllowGet);
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
        //public ActionResult GetSalePersonList()
        //{
        //    CommonRepo _common = new CommonRepo();
        //    try
        //    {
        //        //var result = _repo.GetSalePersonList();
        //        var result = _common.GetSalePersonList();
        //        return Json(result, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}
    }
}

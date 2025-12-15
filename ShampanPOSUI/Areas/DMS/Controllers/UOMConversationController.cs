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
    public class UOMConversationController : Controller
    {
        private readonly ApplicationDbContext _applicationDb;
        UOMConversationRepo _repo = new UOMConversationRepo();

        // GET: DMS/UOMConversation
        public ActionResult Index(int? id)
        {
            if (id == 0 || id == null)
            {
                return View();
            }
            else
            {
                UOMConversationVM UOMConversation = new UOMConversationVM()
                {
                    //IsIndex = true,
                    FromId = id.Value
                };
                return View("Index", UOMConversation);
            }
        }

        public ActionResult Create(int FromId)
        {
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };

            UOMConversationVM vm = new UOMConversationVM();
            UOMConversationRepo _repo = new UOMConversationRepo();
            UOMRepo _uomrepo = new UOMRepo();
            vm.Operation = "add";
            vm.IsActive = true;
            //vm.IsIndex = false;
            vm.FromId = FromId;
            if (vm != null && vm.FromId != 0)
            {
                UOMVM UOMvm = new UOMVM();
                CommonVM param = new CommonVM();
                param.Id = vm.FromId.ToString();
                ResultVM result = _uomrepo.List(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    // Deserialize DataVM into a List
                    List<UOMVM> uomList = JsonConvert.DeserializeObject<List<UOMVM>>(result.DataVM.ToString());
                    UOMvm = uomList.FirstOrDefault();

                    if (uomList != null && uomList.Any())
                    {
                        // Deserialize DataVM correctly if it's a JSON array
                        List<UOMConversationVM> uomConversationList = JsonConvert.DeserializeObject<List<UOMConversationVM>>(result.DataVM.ToString());
                        var data = uomConversationList.FirstOrDefault(); // Get first item

                        if (data != null)
                        {
                            vm.FromName = UOMvm.Name;
                            
                        }
                    }
                }
            }


            return View("Create", vm);
        }

        [HttpPost]
        public ActionResult CreateEdit(UOMConversationVM model)
        {
            ResultModel<UOMConversationVM> result = new ResultModel<UOMConversationVM>();
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new UOMConversationRepo();

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
                            model = JsonConvert.DeserializeObject<UOMConversationVM>(resultVM.DataVM.ToString());
                            model.Operation = "add";
                            Session["result"] = resultVM.Status + "~" + resultVM.Message;
                            result = new ResultModel<UOMConversationVM>()
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

                            result = new ResultModel<UOMConversationVM>()
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
                            result = new ResultModel<UOMConversationVM>()
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

                            result = new ResultModel<UOMConversationVM>()
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
                result = new ResultModel<UOMConversationVM>()
                {
                    Success = false,
                    Status = Status.Fail,
                    Message = "Model State Error!",
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
                _repo = new UOMConversationRepo();

                UOMConversationVM vm = new UOMConversationVM();
                CommonVM param = new CommonVM();
                param.Id = id;
                ResultVM result = _repo.List(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<UOMConversationVM>>(result.DataVM.ToString()).FirstOrDefault();
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
        public ActionResult Delete(ProductVM vm)
        {
            ResultModel<UOMConversationVM> result = new ResultModel<UOMConversationVM>();

            try
            {
                _repo = new UOMConversationRepo();
                CommonVM param = new CommonVM();

                param.IDs = vm.IDs;
                param.ModifyBy = Session["UserId"].ToString();
                param.ModifyFrom = Ordinary.GetLocalIpAddress();

                ResultVM resultData = _repo.Delete(param);

                Session["result"] = resultData.Status + "~" + resultData.Message;

                result = new ResultModel<UOMConversationVM>()
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
        public JsonResult GetGridData(GridOptions options, string getFromId)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new UOMConversationRepo();

            try
            {
                result = _repo.GetGridData(options, getFromId);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<UOMConversationVM>>(result.DataVM.ToString());

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

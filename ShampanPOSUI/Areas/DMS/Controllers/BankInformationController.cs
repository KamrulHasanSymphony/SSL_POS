using Newtonsoft.Json;
using ShampanPOS.Models;
using ShampanPOS.Models.Helper;
using ShampanPOS.Models.KendoCommon;
using ShampanPOS.Repo;
using ShampanPOSUI.Persistence;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ShampanPOSUI.Areas.DMS.Controllers
{
    [Authorize]
    [RouteArea("DMS")]
    public class BankInformationController : Controller
    {

        private readonly ApplicationDbContext _applicationDb;
        BankInformationRepo _repo = new BankInformationRepo();
        CommonRepo _commonRepo = new CommonRepo();

        // GET: DMS/BankInformation
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Create()
        {
            BankInformationVM vm = new BankInformationVM();
            vm.Operation = "add";
            vm.IsActive = true;
            var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
            //vm.BranchId = Convert.ToInt32(currentBranchId);
            //vm.RegularDiscountRate = 0;

            return View("Create", vm);
        }
        [HttpPost]
        public ActionResult CreateEdit(BankInformationVM model)
        {
            ResultModel<BankInformationVM> result = new ResultModel<BankInformationVM>();
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new BankInformationRepo();

            if (ModelState.IsValid)
            {
                try
                {                    

                    model.LastModifiedBy = Session["UserId"].ToString();
                    model.LastModifiedOn = DateTime.Now.ToString();
                    model.LastUpdateFrom = Ordinary.GetLocalIpAddress();

                    if (model.Operation.ToLower() == "add")
                    {
                        model.CreatedBy = Session["UserId"].ToString();
                        model.UserId = Session["UserHashId"]?.ToString();

                        model.CreatedOn = DateTime.Now.ToString();
                        model.CreatedFrom = Ordinary.GetLocalIpAddress();

                        resultVM = _repo.Insert(model);

                        if (resultVM.Status == ResultStatus.Success.ToString())
                        {
                            model = JsonConvert.DeserializeObject<BankInformationVM>(resultVM.DataVM.ToString());
                            model.Operation = "add";
                            //model.ImagePath = model.ImagePath;
                            Session["result"] = resultVM.Status + "~" + resultVM.Message;
                            //model.ImagePath = resultVM.ImagePath;
                            result = new ResultModel<BankInformationVM>()
                            {
                                Success = true,
                                Status = Status.Success,
                                Message = resultVM.Message,
                                Data = model
                            };
                        }
                        else
                        {
                            Session["result"] = "Fail" + "~" + resultVM.Message;
                            result = new ResultModel<BankInformationVM>()
                            {
                                Status = Status.Fail,
                                Message = resultVM.Message,
                                Data = model
                            };
                        }
                    }
                    else if (model.Operation.ToLower() == "update")
                    {
                        resultVM = _repo.Update(model);

                        if (resultVM.Status == ResultStatus.Success.ToString())
                        {
                            Session["result"] = resultVM.Status + "~" + resultVM.Message;
                            result = new ResultModel<BankInformationVM>()
                            {
                                Success = true,
                                Status = Status.Success,
                                Message = resultVM.Message,
                                Data = model
                            };
                        }
                        else
                        {
                            Session["result"] = "Fail" + "~" + resultVM.Message;
                            result = new ResultModel<BankInformationVM>()
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

                result = new ResultModel<BankInformationVM>()
                {
                    Success = false,
                    Status = Status.Fail,
                    Message = msg + " Model State Error!",
                    Data = model
                };
                return Json(result);
            }

            return Json(result);  // Return the result to the front-end
        }


        [HttpGet]
        public ActionResult Edit(string id)
        {
            try
            {
                _repo = new BankInformationRepo();

                BankInformationVM vm = new BankInformationVM();
                CommonVM param = new CommonVM();
                param.Id = id;
                ResultVM result = _repo.List(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<BankInformationVM>>(result.DataVM.ToString()).FirstOrDefault();
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
            _repo = new BankInformationRepo();

            try
            {
                result = _repo.GetGridData(options);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<BankInformationVM>>(result.DataVM.ToString());

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
                vm.Type = "single";
                vm.TableName = "Customers";

                ResultVM result = _commonRepo.NextPrevious(vm);

                if (result.Id != "0")
                {
                    string url = Url.Action("Edit", "Customer", new { area = "DMS", id = result.Id });
                    return Redirect(url);
                }
                else
                {
                    string url = Url.Action("Edit", "Customer", new { area = "DMS", id = id });
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


        public ActionResult DevitCredit()
        {
            return View();
        }




    }
}
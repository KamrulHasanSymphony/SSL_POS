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
    public class CustomerCreditLimitController : Controller
    {
        private readonly ApplicationDbContext _applicationDb;
        CustomerCreditLimitRepo _repo = new CustomerCreditLimitRepo();
        CommonRepo _commonRepo = new CommonRepo();

        // GET: DMS/CustomerCreditLimit
        public ActionResult Index(int? id,string Name,string Code)
        {
            if (id == 0 || id == null)
            {
                return View();
            }
            else
            {
                CustomerCreditLimitVM customerCreditLimit = new CustomerCreditLimitVM()
                {
                    IsIndex = true,
                    CustomerId = id.Value,
                    CustomerCode = Code,
                    CustomerName = Name

                };
                return View("Index", customerCreditLimit);
            }
        }

        public ActionResult Create(int? CustomerId)
        {
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };

            CustomerCreditLimitVM vm = new CustomerCreditLimitVM();
            CustomerCreditLimitRepo _repo = new CustomerCreditLimitRepo();
            CustomerRepo _customerrepo = new CustomerRepo();

            vm.Operation = "add";
            vm.IsIndex = false;
            vm.CustomerId = CustomerId??0;

            if (vm != null && vm.CustomerId != 0)
            {
                CustomerVM Customervm = new CustomerVM();
                CommonVM param = new CommonVM();
                param.Id = vm.CustomerId.ToString();
                ResultVM result = _customerrepo.List(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    // Deserialize DataVM into a List
                    List<CustomerVM> customerList = JsonConvert.DeserializeObject<List<CustomerVM>>(result.DataVM.ToString());
                    Customervm = customerList.FirstOrDefault();

                    if (customerList != null && customerList.Any())
                    {
                        // Deserialize DataVM correctly if it's a JSON array
                        List<CustomerCreditLimitVM> creditLimitList = JsonConvert.DeserializeObject<List<CustomerCreditLimitVM>>(result.DataVM.ToString());
                        var data = creditLimitList.FirstOrDefault(); // Get first item

                        if (data != null)
                        {
                            vm.CustomerName = Customervm.Name;
                            vm.CustomerCode = Customervm.Code;
                        }
                    }
                }
            }

            // Get the current branch ID from the session
            var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
            vm.BranchId = int.Parse(currentBranchId);

            return View("Create", vm);
        }

        [HttpPost]
        public ActionResult CreateEdit(CustomerCreditLimitVM model)
        {
            ResultModel<CustomerCreditLimitVM> result = new ResultModel<CustomerCreditLimitVM>();
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new CustomerCreditLimitRepo();

            if (ModelState.IsValid)
            {
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
                            model = JsonConvert.DeserializeObject<CustomerCreditLimitVM>(resultVM.DataVM.ToString());
                            model.Operation = "add";
                            Session["result"] = resultVM.Status + "~" + resultVM.Message;
                            result =  new ResultModel<CustomerCreditLimitVM>()
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

                            result = new ResultModel<CustomerCreditLimitVM>()
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
                            result = new ResultModel<CustomerCreditLimitVM>()
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

                            result = new ResultModel<CustomerCreditLimitVM>()
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

                result = new ResultModel<CustomerCreditLimitVM>()
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
        public ActionResult Edit(int id)
        {
            try
            {
                _repo = new CustomerCreditLimitRepo();

                CustomerCreditLimitVM vm = new CustomerCreditLimitVM();
                vm.Id = id;
                ResultVM result = _repo.List(vm);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<CustomerCreditLimitVM>>(result.DataVM.ToString()).FirstOrDefault();
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
                vm.TableName = "CustomerCreditLimits";

                ResultVM result = _commonRepo.NextPrevious(vm);

                if (result.Id != "0")
                {
                    string url = Url.Action("Edit", "CustomerCreditLimit", new { area = "DMS", id = result.Id });
                    return Redirect(url);
                }
                else
                {
                    string url = Url.Action("Edit", "CustomerCreditLimit", new { area = "DMS", id = id });
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
        public ActionResult Delete(CustomerCreditLimitVM vm)
        {
            ResultModel<CustomerCreditLimitVM> result = new ResultModel<CustomerCreditLimitVM>();

            try
            {
                _repo = new CustomerCreditLimitRepo();                

                ResultVM resultData = _repo.Delete(vm);

                Session["result"] = resultData.Status + "~" + resultData.Message;

                result = new ResultModel<CustomerCreditLimitVM>()
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
        public JsonResult GetGridData(GridOptions options, string getCustomerId)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new CustomerCreditLimitRepo();

            try
            {
                result = _repo.GetGridData(options, getCustomerId);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<CustomerCreditLimitVM>>(result.DataVM.ToString());

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
        //public ActionResult GetCustomerList()
        //{
        //    try
        //    {
        //        var result = _repo.GetCustomerList();
        //        return Json(result, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}


        [HttpPost]
        public ActionResult MultiplePost(CustomerCreditLimitVM vm)
        {
            ResultModel<CustomerCreditLimitVM> result = new ResultModel<CustomerCreditLimitVM>();

            try
            {
                _repo = new CustomerCreditLimitRepo();

                CommonVM param = new CommonVM();

                param.IDs = vm.IDs;
                param.ModifyBy = Session["UserId"].ToString();
                param.ModifyFrom = Ordinary.GetLocalIpAddress();

                ResultVM resultData = _repo.MultiplePost(param);


                Session["result"] = resultData.Status + "~" + resultData.Message;

                result = new ResultModel<CustomerCreditLimitVM>()
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
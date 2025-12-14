using DocumentFormat.OpenXml.EMMA;
using Newtonsoft.Json;
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
using System.Web;
using System.Web.Mvc;

namespace ShampanPOSUI.Areas.DMS.Controllers
{
    [Authorize]
    [RouteArea("DMS")]
    public class CustomerPaymentCollectionController : Controller
    {
        private readonly ApplicationDbContext _applicationDb;
        CustomerPaymentCollectionRepo _repo = new CustomerPaymentCollectionRepo();
        CommonRepo _commonRepo = new CommonRepo();

        // GET: DMS/UOM
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult TabIndex()
        {
            return View();
        }

        public ActionResult Create()
        {
            CustomerPaymentCollectionVM vm = new CustomerPaymentCollectionVM();
            vm.Operation = "add";
            //vm.IsActive = true;
            var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
            vm.BranchId = Convert.ToInt32(currentBranchId);

            return View("Create", vm);
        }

        [HttpPost]
        public ActionResult CreateEdit(CustomerPaymentCollectionVM model, HttpPostedFileBase file)
        {
            ResultModel<CustomerPaymentCollectionVM> result = new ResultModel<CustomerPaymentCollectionVM>();
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new CustomerPaymentCollectionRepo();

            //if (ModelState.IsValid)
            //{
            try
            {
                // Handle Image Upload
                if (file != null && file.ContentLength > 0)
                {
                    string uploadsFolder = Server.MapPath("~/Content/CustomerPaymentCollection");

                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }

                    string fileExtension = Path.GetExtension(file.FileName).ToLower();
                    string[] validImageTypes = { ".jpg", ".jpeg", ".png", ".gif" };

                    if (!validImageTypes.Contains(fileExtension))
                    {
                        result.Message = "Invalid image file type.";
                        return Json(result);
                    }

                    string fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                    string filePath = Path.Combine(uploadsFolder, fileName);

                    file.SaveAs(filePath);

                    model.ImagePath = "/Content/CustomerPaymentCollection/" + fileName;
                }
                if (model.Operation.ToLower() == "add")
                {
                    model.CreatedBy = Session["UserId"].ToString();
                    model.CreatedOn = DateTime.Now.ToString();

                    // model.CreatedFrom = Ordinary.GetLocalIpAddress();

                    resultVM = _repo.Insert(model);

                    if (resultVM.Status == ResultStatus.Success.ToString())
                    {
                        model = JsonConvert.DeserializeObject<CustomerPaymentCollectionVM>(resultVM.DataVM.ToString());
                        model.Operation = "add";
                        Session["result"] = resultVM.Status + "~" + resultVM.Message;
                        result = new ResultModel<CustomerPaymentCollectionVM>()
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

                        result = new ResultModel<CustomerPaymentCollectionVM>()
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
                    // model.LastUpdateFrom = Ordinary.GetLocalIpAddress();

                    resultVM = _repo.Update(model);

                    if (resultVM.Status == ResultStatus.Success.ToString())
                    {
                        Session["result"] = resultVM.Status + "~" + resultVM.Message;
                        result = new ResultModel<CustomerPaymentCollectionVM>()
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

                        result = new ResultModel<CustomerPaymentCollectionVM>()
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
            //}
            //return View("Create", model);

        }

        [HttpGet]
        public ActionResult Edit(string id)
        {
            try
            {
                _repo = new CustomerPaymentCollectionRepo();

                CustomerPaymentCollectionVM vm = new CustomerPaymentCollectionVM();
                CommonVM param = new CommonVM();
                param.Id = id;
                ResultVM result = _repo.List(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<CustomerPaymentCollectionVM>>(result.DataVM.ToString()).FirstOrDefault();
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
                vm.TableName = "UOMs";

                ResultVM result = _commonRepo.NextPrevious(vm);

                if (result.Id != "0")
                {
                    string url = Url.Action("Edit", "UOM", new { area = "DMS", id = result.Id });
                    return Redirect(url);
                }
                else
                {
                    string url = Url.Action("Edit", "UOM", new { area = "DMS", id = id });
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
        public ActionResult Delete(CustomerPaymentCollectionVM vm)
        {
            ResultModel<CustomerPaymentCollectionVM> result = new ResultModel<CustomerPaymentCollectionVM>();

            try
            {
                _repo = new CustomerPaymentCollectionRepo();

                CommonVM param = new CommonVM();
                param.IDs = vm.IDs;
                param.ModifyBy = Session["UserId"].ToString();
                param.ModifyFrom = Ordinary.GetLocalIpAddress();

                ResultVM resultData = _repo.Delete(param);

                Session["result"] = resultData.Status + "~" + resultData.Message;

                result = new ResultModel<CustomerPaymentCollectionVM>()
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
            _repo = new CustomerPaymentCollectionRepo();

            try
            {
                result = _repo.GetGridData(options);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<CustomerPaymentCollectionVM>>(result.DataVM.ToString());

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

        //[HttpPost]

        //public JsonResult GetTabGridData(GridOptions options)
        //{
        //    ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
        //    _repo = new CustomerPaymentCollectionRepo();

        //    try
        //    {
        //        var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
        //        options.vm.BranchId = currentBranchId;
        //        result = _repo.GetTabGridData(options);

        //        if (result.Status == "Success" && result.DataVM != null)
        //        {
        //            var gridData = JsonConvert.DeserializeObject<GridEntity<SaleDeliveryVM>>(result.DataVM.ToString());

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
        public async Task<ActionResult> ReportPreview(CommonVM param)
        {
            try
            {
                _repo = new CustomerPaymentCollectionRepo();
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

                    Response.Headers.Add("Content-Disposition", "inline; filename=UOM_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".pdf");

                    return File(fileBytes, "application/pdf");
                }
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                TempData["Message"] = e.Message.ToString();
                return RedirectToAction("Index", "CustomerPaymentCollection", new { area = "DMS", message = TempData["Message"] });
            }
        }

        [HttpPost]
        public ActionResult MultiplePost(CustomerPaymentCollectionVM vm)
        {
            ResultModel<CustomerPaymentCollectionVM> result = new ResultModel<CustomerPaymentCollectionVM>();

            try
            {
                _repo = new CustomerPaymentCollectionRepo();

                CommonVM param = new CommonVM();

                param.IDs = vm.IDs;
                param.ModifyBy = Session["UserId"].ToString();
                param.ModifyFrom = Ordinary.GetLocalIpAddress();

                ResultVM resultData = _repo.MultiplePost(param);

                Session["result"] = resultData.Status + "~" + resultData.Message;

                if (resultData.Status == "Success")
                {
                    result = new ResultModel<CustomerPaymentCollectionVM>()
                    {
                        Success = true,
                        Status = Status.Success,
                        Message = resultData.Message,
                        Data = null
                    };
                }
                else
                {
                    result = new ResultModel<CustomerPaymentCollectionVM>()
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


        //[HttpPost]
        //public ActionResult PaymentSettlementProcess(CustomerPaymentCollectionVM vm)
        //{
        //    ResultModel<CustomerPaymentCollectionVM> result = new ResultModel<CustomerPaymentCollectionVM>();

        //    try
        //    {
        //        _repo = new CustomerPaymentCollectionRepo();

        //        CommonVM param = new CommonVM();

        //        param.IDs = vm.IDs;
        //        param.Id = vm.SaleDeleveryId.ToString();
        //        param.ModifyBy = Session["UserId"].ToString();
        //        param.ModifyFrom = Ordinary.GetLocalIpAddress();

        //        ResultVM resultData = _repo.MultiplePaymentSettlementProcess(param);

        //        Session["result"] = resultData.Status + "~" + resultData.Message;

        //        if (resultData.Status == "Success")
        //        {
        //            result = new ResultModel<CustomerPaymentCollectionVM>()
        //            {
        //                Success = true,
        //                Status = Status.Success,
        //                Message = resultData.Message,
        //                Data = null
        //            };
        //        }
        //        else
        //        {
        //            result = new ResultModel<CustomerPaymentCollectionVM>()
        //            {
        //                Success = false,
        //                Status = Status.Fail,
        //                Message = resultData.Message,
        //                Data = null
        //            };
        //        }

        //        return Json(result);
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return RedirectToAction("Index");
        //    }
        //}

    }
}
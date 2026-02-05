using DocumentFormat.OpenXml.EMMA;
using Elmah;
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
    public class SupplierController : Controller
    {
        private readonly ApplicationDbContext _applicationDb;
        SupplierRepo _repo = new SupplierRepo();
        CommonRepo _commonRepo = new CommonRepo();

        // GET: DMS/Supplier
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Create()
        {
            SupplierVM vm = new SupplierVM();
            vm.Operation = "add";
            var companyId = Session["CompanyId"];
            vm.CompanyId = Convert.ToInt32(companyId);

            vm.IsActive = true;

            return View("Create", vm);
        }        

        [HttpPost]
        public ActionResult CreateEdit(SupplierVM model, HttpPostedFileBase file)
        {
            ResultModel<SupplierVM> result = new ResultModel<SupplierVM>();
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new SupplierRepo();

            if (ModelState.IsValid)
            {
                try
                {
                    // Handle Image Upload
                    if (file != null && file.ContentLength > 0)
                    {
                        string uploadsFolder = Server.MapPath("~/Content/Suppliers");

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

                        model.ImagePath = "/Content/Suppliers/" + fileName;
                    }

                    if (model.Operation.ToLower() == "add")
                    {
                        model.CreatedBy = Session["UserId"].ToString();
                        model.UserId = Session["UserHashId"].ToString();
                        model.CreatedOn = DateTime.Now.ToString();
                        model.CreatedFrom = Ordinary.GetLocalIpAddress();

						resultVM = _repo.Insert(model);

                        if (resultVM.Status == ResultStatus.Success.ToString())
                        {
                            model = JsonConvert.DeserializeObject<SupplierVM>(resultVM.DataVM.ToString());
                            model.Operation = "add";
                            Session["result"] = resultVM.Status + "~" + resultVM.Message;
                            result =  new ResultModel<SupplierVM>()
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

                            result = new ResultModel<SupplierVM>()
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
                            result = new ResultModel<SupplierVM>()
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

                            result = new ResultModel<SupplierVM>()
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

                result = new ResultModel<SupplierVM>()
                {
                    Success = false,
                    Status = Status.Fail,
                    Message = msg,
                    Data = model
                };
                return Json(result);
            }
            return View("Create", model);

        }

        [HttpGet]
        public ActionResult Edit(string id)
        {
            try
            {
                _repo = new SupplierRepo();

                SupplierVM vm = new SupplierVM();
                CommonVM param = new CommonVM();
                param.Id = id;
                ResultVM result = _repo.List(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<SupplierVM>>(result.DataVM.ToString()).FirstOrDefault();
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
                vm.TableName = "Suppliers";

                ResultVM result = _commonRepo.NextPrevious(vm);

                if (result.Id != "0")
                {
                    string url = Url.Action("Edit", "Supplier", new { area = "DMS", id = result.Id });
                    return Redirect(url);
                }
                else
                {
                    string url = Url.Action("Edit", "Supplier", new { area = "DMS", id = id });
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
        public ActionResult Delete(SupplierVM vm)
        {
            ResultModel<SupplierVM> result = new ResultModel<SupplierVM>();

            try
            {
                _repo = new SupplierRepo();
                CommonVM param = new CommonVM();
                param.IDs = vm.IDs;
                param.ModifyBy = Session["UserId"].ToString();
                param.ModifyFrom = Ordinary.GetLocalIpAddress();

                ResultVM resultData = _repo.Delete(param);

                Session["result"] = resultData.Status + "~" + resultData.Message;

                result = new ResultModel<SupplierVM>()
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
            _repo = new SupplierRepo();

            try
            {
                result = _repo.GetGridData(options);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<SupplierVM>>(result.DataVM.ToString());

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
        public async Task<ActionResult> ReportPreview(CommonVM param)
        {
            try
            {
                _repo = new SupplierRepo();
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

                    Response.Headers.Add("Content-Disposition", "inline; filename=Supplier_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".pdf");

                    return File(fileBytes, "application/pdf");
                }
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                TempData["Message"] = e.Message.ToString();
                return RedirectToAction("Index", "Supplier", new { area = "DMS", message = TempData["Message"] });
            }
        }

        [HttpGet]
        public ActionResult getReport(string id)
        {
            try
            {
                SupplierVM vm = new SupplierVM();
                CommonVM param = new CommonVM();
                param.Id = id;
                ResultVM result = _repo.GetSupplierReport(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<SupplierVM>>(result.DataVM.ToString()).FirstOrDefault();
                }
                else
                {
                    vm = new SupplierVM();
                }

                //vm.ColunWidth = new Dictionary<string, string>
                //{
                //    { "Code", "5%" },
                //    { "CustomerName", "15%" },
                //    { "TailorMasterName", "15%" },
                //    { "FabricTotal", "15%" },
                //    { "MakingChargeTotal", "15%" },
                //    { "GrandTotal", "35%" },
                //    { "Advance", "35%" },
                //    { "Dues", "35%" }
                //};

                vm.PageSize = new Dictionary<string, string>
                {
                    { "A4_Width", "210mm" },
                    { "A4_Height", "297mm" },
                    { "Letter_Width", "216mm" },
                    { "Letter_Height", "279mm" },
                    { "Orientation", "Portrait" },
                    { "Default", "A4" }
                };

                return View("SupplierReport", vm);
            }
            catch (Exception e)
            {
                Session["result"] = "Fail" + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return RedirectToAction("Index");
            }
        }

    }
}
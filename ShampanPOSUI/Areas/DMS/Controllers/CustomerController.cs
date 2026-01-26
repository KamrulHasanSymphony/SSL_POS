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
using System.Web;
using System.Web.Mvc;
using iTextSharp.text.pdf;
using iTextSharp.text;
using PageSize = iTextSharp.text.PageSize;
using Document = iTextSharp.text.Document;

namespace ShampanPOSUI.Areas.DMS.Controllers
{
    [Authorize]
    [RouteArea("DMS")]
    public class CustomerController : Controller
    {
        private readonly ApplicationDbContext _applicationDb;
        CustomerRepo _repo = new CustomerRepo();
        CommonRepo _commonRepo = new CommonRepo();

        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Create()
        {
            CustomerVM vm = new CustomerVM();
            vm.Operation = "add";
            vm.IsActive = true;
            var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
            vm.BranchId = Convert.ToInt32(currentBranchId);
            //vm.RegularDiscountRate = 0;

            return View("Create", vm);
        }
        [HttpPost]
        public ActionResult CreateEdit(CustomerVM model, HttpPostedFileBase file)
        {
            ResultModel<CustomerVM> result = new ResultModel<CustomerVM>();
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new CustomerRepo();

            if (ModelState.IsValid)
            {
                try
                {
                    // Handle Image Upload
                    if (file != null && file.ContentLength > 0)
                    {
                        string uploadsFolder = Server.MapPath("~/Content/Customers");

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

                        model.ImagePath = "/Content/Customers/" + fileName;
                    }

                    model.LastModifiedBy = Session["UserId"].ToString();
                    model.LastModifiedOn = DateTime.Now.ToString();
                    model.LastUpdateFrom = Ordinary.GetLocalIpAddress();

                    if (model.Operation.ToLower() == "add")
                    {
                        model.CreatedBy = Session["UserId"].ToString();
                        model.CreatedOn = DateTime.Now.ToString();
                        model.CreatedFrom = Ordinary.GetLocalIpAddress();

                        resultVM = _repo.Insert(model);

                        if (resultVM.Status == ResultStatus.Success.ToString())
                        {
                            model = JsonConvert.DeserializeObject<CustomerVM>(resultVM.DataVM.ToString());
                            model.Operation = "add";
                            model.ImagePath = model.ImagePath;
                            Session["result"] = resultVM.Status + "~" + resultVM.Message;
                            //model.ImagePath = resultVM.ImagePath;
                            result = new ResultModel<CustomerVM>()
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
                            result = new ResultModel<CustomerVM>()
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
                            result = new ResultModel<CustomerVM>()
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
                            result = new ResultModel<CustomerVM>()
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

                result = new ResultModel<CustomerVM>()
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
                _repo = new CustomerRepo();

                CustomerVM vm = new CustomerVM();
                CommonVM param = new CommonVM();
                param.Id = id;
                ResultVM result = _repo.List(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<CustomerVM>>(result.DataVM.ToString()).FirstOrDefault();
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
            _repo = new CustomerRepo();

            try
            {
                result = _repo.GetGridData(options);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<CustomerVM>>(result.DataVM.ToString());

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


        //[HttpPost]
        //public ActionResult Delete(CustomerVM vm)
        //{
        //    ResultModel<CustomerVM> result = new ResultModel<CustomerVM>();

        //    try
        //    {
        //        _repo = new CustomerRepo();
        //        CommonVM param = new CommonVM();

        //        param.IDs = vm.IDs;
        //        param.ModifyBy = Session["UserId"].ToString();
        //        param.ModifyFrom = Ordinary.GetLocalIpAddress();

        //        ResultVM resultData = _repo.Delete(param);

        //        Session["result"] = resultData.Status + "~" + resultData.Message;

        //        result = new ResultModel<CustomerVM>()
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
        //public JsonResult GetGridData(GridOptions options)
        //{
        //    ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
        //    _repo = new CustomerRepo();

        //    try
        //    {
        //        CustomerVM vm = new CustomerVM();
        //        var branchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
        //        vm.BranchId = int.Parse(branchId);
        //        options.vm.BranchId = branchId == "0" ? "" : branchId;
        //        result = _repo.GetGridData(options);

        //        if (result.Status == "Success" && result.DataVM != null)
        //        {
        //            var gridData = JsonConvert.DeserializeObject<GridEntity<CustomerVM>>(result.DataVM.ToString());

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
        //[HttpPost]
        //public async Task<ActionResult> ReportPreview(CommonVM param)
        //{
        //    try
        //    {
        //        _repo = new CustomerRepo();
        //        param.CompanyId = Session["CompanyId"] != null ? Session["CompanyId"].ToString() : "";
        //        var resultStream = _repo.ReportPreview(param);

        //        if (resultStream == null)
        //        {
        //            throw new Exception("Failed to generate report: No data received.");
        //        }

        //        using (var memoryStream = new MemoryStream())
        //        {
        //            await resultStream.CopyToAsync(memoryStream);
        //            byte[] fileBytes = memoryStream.ToArray();

        //            if (fileBytes.Length < 1000)
        //            {
        //                string errorContent = Encoding.UTF8.GetString(fileBytes);
        //                throw new Exception("Failed to generate report!");
        //            }

        //            Response.Headers.Add("Content-Disposition", "inline; filename=Customer_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".pdf");

        //            return File(fileBytes, "application/pdf");
        //        }
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        TempData["Message"] = e.Message.ToString();
        //        return RedirectToAction("Index", "Customer", new { area = "DMS", message = TempData["Message"] });
        //    }
        //}


        public ActionResult DevitCredit()
        {
            return View();
        }

        //[HttpGet]
        //public async Task<ActionResult> DevitCreditData(string fromDate, string toDate, string branchId)
        //{
        //    _commonRepo = new CommonRepo();
        //    _repo = new CustomerRepo();
        //    BranchProfileRepo _branchRepo = new BranchProfileRepo();
        //    try
        //    {
        //        string BranchName = "";
        //        string BranchAddress = "";
        //        string CompanyName = "";

        //        CommonVM vm = new CommonVM();
        //        vm.ToDate = toDate;
        //        vm.FromDate = fromDate;
        //        vm.Id = branchId == "0" ? "" : branchId;
        //        vm.BranchId = branchId == "0" ? "" : branchId;

        //        if (vm.BranchId == "")
        //        {
        //            BranchName = "ALL";
        //        }
        //        else
        //        {
        //            var branchResult = _branchRepo.List(vm);

        //            if (branchResult != null && branchResult.Status == "Success" && branchResult.DataVM != null)
        //            {
        //                var data = JsonConvert.DeserializeObject<List<BranchProfileVM>>(branchResult.DataVM.ToString());

        //                if (data.Count > 0)
        //                {
        //                    BranchName = data.FirstOrDefault()?.Name;
        //                    BranchAddress = data.FirstOrDefault()?.Address;
        //                }
        //            }
        //        }

        //        DataTable dt = new DataTable();
        //        vm = new CommonVM();
        //        vm.BranchId = branchId == "0" ? "" : branchId;
        //        vm.FromDate = fromDate;
        //        vm.ToDate = toDate;

        //        var result = _repo.DevitCredit(vm);

        //        if (result.Status == "Success" && result.DataVM != null)
        //        {
        //            var data = JsonConvert.DeserializeObject<List<CustomerVM>>(result.DataVM.ToString());

        //            dt = Extensions.ConvertToDataTable(data);
        //        }

        //        dt.Columns["Id"].ColumnName = "Id ";
        //        dt.Columns["Code"].ColumnName = "Code ";
        //        dt.Columns["Name"].ColumnName = "Name ";
        //        dt.Columns["BranchId"].ColumnName = "Branch Id ";

        //        // Generate PDF from DataTable
        //        using (var memoryStream = new MemoryStream())
        //        {
        //            var document = new Document(PageSize.A4);
        //            var writer = PdfWriter.GetInstance(document, memoryStream);
        //            document.Open();

        //            // Create a table for the data
        //            var table = new PdfPTable(dt.Columns.Count);
        //            foreach (DataColumn column in dt.Columns)
        //            {
        //                table.AddCell(new Phrase(column.ColumnName));
        //            }

        //            foreach (DataRow row in dt.Rows)
        //            {
        //                foreach (var cell in row.ItemArray)
        //                {
        //                    table.AddCell(new Phrase(cell.ToString()));
        //                }
        //            }

        //            document.Add(table);
        //            document.Close();

        //            // Get the byte array for the PDF file
        //            byte[] fileBytes = memoryStream.ToArray();

        //            // Return the file as a PDF
        //            Response.Headers.Add("Content-Disposition", "inline; filename=Customer_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".pdf");
        //            return File(fileBytes, "application/pdf");
        //        }
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        TempData["Message"] = e.Message.ToString();
        //        return RedirectToAction("Index", "Customer", new
        //        {
        //            area = "DMS",
        //            message = TempData["Message"]
        //        });
        //    }
        //}

    }
}
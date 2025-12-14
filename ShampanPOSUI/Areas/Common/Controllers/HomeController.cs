using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using ShampanPOS.Models;
using ShampanPOS.Repo;
using ShampanPOSUI.Persistence;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace ShampanPOSUI.Areas.Common.Controllers
{
    public class HomeController : Controller
    {
        CommonRepo _repo = new CommonRepo();
        // GET: Common/Home
        public ActionResult Index(bool branchChange)
        {
            try
            {
                if (User.Identity.IsAuthenticated || (Session["UserId"] != null && !string.IsNullOrEmpty(Session["UserId"].ToString())))
                {
                    List<BranchProfile> branchProfiles = new List<BranchProfile>();

                    Session["BranchChanged"] = branchChange ? "1" : "0";

                    if (branchChange)
                    {
                        TempData["BranchChanged"] = true;
                        return View(branchProfiles);
                    }

                    if (Session["UserId"] != null)
                    {
                        if (Session["CurrentBranch"] == null)
                        {
                            branchProfiles = new List<BranchProfile>();
                        }
                        else
                        {
                            BranchProfile branch = new BranchProfile
                            {
                                BranchID = 0,
                                BranchCode = "",
                            };
                            branchProfiles.Add(branch);
                        }
                    }

                    return View(branchProfiles);
                }


                else
                {
                    return RedirectToAction("Index", "Login", new { area = (string)null });
                }
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return RedirectToAction("Index", "Login", new { area = (string)null });
            }
        }
        [HttpGet]
        public JsonResult LoadBranchProfiles()
        {
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };

            try
            {
                BranchProfileRepo _branchRepo = new BranchProfileRepo();
                CommonVM vm = new CommonVM();
                List<BranchProfileVM> lst = new List<BranchProfileVM>();

                if (Session["UserId"] != null && Session["UserId"].ToString().ToLower() == "erp")
                {

                    vm.UserId = Session["UserId"].ToString();
                    resultVM = _branchRepo.List(vm);
                }
                else
                {
                    UserBranchProfileRepo userBranchProfileRepo = new UserBranchProfileRepo();
                    vm.UserId = Session["UserId"].ToString();
                    resultVM = userBranchProfileRepo.List(vm);
                }


                if (resultVM.Status == ResultStatus.Success.ToString())
                {
                    lst = JsonConvert.DeserializeObject<List<BranchProfileVM>>(resultVM.DataVM.ToString());
                    lst = lst.Where(b => b.IsActive == true).ToList();
                }

                return Json(new
                {
                    data = lst,
                    draw = "",
                    recordsTotal = lst.Count,
                    recordsFiltered = lst.Count
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json(new
                {
                    data = "",
                    draw = "",
                    recordsTotal = 0,
                    recordsFiltered = 0
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public async Task<ActionResult> AssignBranch(BranchProfile branch)
        {
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };


            try
            {
                if (!string.IsNullOrEmpty(branch.BranchCode))
                {
                    BranchProfileRepo _branchRepo = new BranchProfileRepo();
                    CommonVM vm = new CommonVM();
                    List<BranchProfileVM> lst = new List<BranchProfileVM>();
                    vm.UserId = branch.UserId;
                    resultVM = _branchRepo.List(vm);

                    if (resultVM.Status == ResultStatus.Success.ToString())
                    {
                        lst = JsonConvert.DeserializeObject<List<BranchProfileVM>>(resultVM.DataVM.ToString());
                    }

                    branch.BranchID = lst.FirstOrDefault(x => x.Code == branch.BranchCode).Id;
                    branch.BranchName = lst.FirstOrDefault(x => x.Code == branch.BranchCode).Name;
                    branch.CurrencyId = lst.FirstOrDefault(x => x.Code == branch.BranchCode).CurrencyId;
                }
                //var tt = Session["UserId"].ToString(); // Username

                if (branch.BranchID == 0) return RedirectToAction("Index");

                var identity = new ClaimsIdentity(User.Identity);
                identity.AddClaim(new Claim(ClaimNames.CurrencyId, branch.CurrencyId.ToString()));
                identity.AddClaim(new Claim(ClaimNames.CurrentBranch, branch.BranchID.ToString()));
                identity.AddClaim(new Claim(ClaimNames.CurrentBranchCode, branch.BranchCode.ToString()));
                identity.AddClaim(new Claim(ClaimNames.CurrentBranchName, branch.BranchName.ToString().Trim()));

                var principal = new ClaimsPrincipal(identity);

                var ticket = new FormsAuthenticationTicket(
                    1, // Ticket version
                    branch.UserId.ToString(), // Username
                    DateTime.Now, // Issue time
                    DateTime.Now.AddMinutes(30), // Expiration time
                    false, // Is persistent (for remember me)
                    $"{branch.BranchID}|{branch.BranchCode}|{branch.BranchName}",
                    FormsAuthentication.FormsCookiePath);

                string encryptedTicket = FormsAuthentication.Encrypt(ticket);

                var cookie = new HttpCookie(FormsAuthentication.FormsCookieName, encryptedTicket)
                {
                    Expires = ticket.Expiration,
                    Path = FormsAuthentication.FormsCookiePath
                };

                Response.Cookies.Add(cookie);

                Session["CurrentBranch"] = branch.BranchID.ToString();
                Session["CurrencyId"] = branch.CurrencyId.ToString();
                Session["CurrentBranchCode"] = branch.BranchCode;
                Session["CurrentBranchName"] = branch.BranchName;
                Session["UserId"] = branch.UserId.ToString();

            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                System.Diagnostics.Trace.TraceError($"Error: {e.Message}\nStack Trace: {e.StackTrace}");
            }

            return RedirectToAction("Index", "Home", new { area = "Common", branchChange = false });
        }



        //[HttpGet]
        //public ActionResult GetTop10Customers(string value)
        //{
        //    try
        //    {
        //        List<CustomerSalesModel> lst = new List<CustomerSalesModel>();
        //        CommonVM param = new CommonVM
        //        {
        //            BranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0",
        //            Value = value
        //        };

        //        ResultVM result = _repo.GetTop10Customers(param);

        //        if (result.Status == "Success" && result.DataVM != null)
        //        {

        //            lst = JsonConvert.DeserializeObject<List<CustomerSalesModel>>(result.DataVM.ToString());

        //        }

        //        return Json(lst, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        //[HttpGet]
        //public ActionResult GetBottom10Customers(string value)
        //{
        //    try
        //    {
        //        List<CustomerSalesModel> lst = new List<CustomerSalesModel>();
        //        CommonVM param = new CommonVM
        //        {
        //            BranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0",
        //            Value = value
        //        };

        //        ResultVM result = _repo.GetBottom10Customers(param);


        //        if (result.Status == "Success" && result.DataVM != null)
        //        {

        //            lst = JsonConvert.DeserializeObject<List<CustomerSalesModel>>(result.DataVM.ToString());

        //        }

        //        return Json(lst, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        //[HttpGet]
        //public ActionResult GetTop10Products(string value)
        //{
        //    try
        //    {
        //        List<ProductSaleModel> lst = new List<ProductSaleModel>();
        //        CommonVM param = new CommonVM
        //        {
        //            BranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0",
        //            Value = value
        //        };

        //        ResultVM result = _repo.GetTop10Products(param);


        //        if (result.Status == "Success" && result.DataVM != null)
        //        {

        //            lst = JsonConvert.DeserializeObject<List<ProductSaleModel>>(result.DataVM.ToString());

        //        }

        //        return Json(lst, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        //[HttpGet]
        //public ActionResult GetBottom10Products(string value)
        //{
        //    try
        //    {
        //        List<ProductSaleModel> lst = new List<ProductSaleModel>();
        //        CommonVM param = new CommonVM
        //        {
        //            BranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0",
        //            Value = value
        //        };

        //        ResultVM result = _repo.GetBottom10Products(param);


        //        if (result.Status == "Success" && result.DataVM != null)
        //        {

        //            lst = JsonConvert.DeserializeObject<List<ProductSaleModel>>(result.DataVM.ToString());

        //        }

        //        return Json(lst, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}



        //[HttpGet]
        //public ActionResult GetTop10SalePersons(string value)
        //{
        //    try
        //    {
        //        List<SalePersonDataModel> lst = new List<SalePersonDataModel>();
        //        CommonVM param = new CommonVM
        //        {
        //            BranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0",
        //            Value = value
        //        };

        //        ResultVM result = _repo.GetTop10SalePersons(param);


        //        if (result.Status == "Success" && result.DataVM != null)
        //        {

        //            lst = JsonConvert.DeserializeObject<List<SalePersonDataModel>>(result.DataVM.ToString());

        //        }

        //        return Json(lst, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}



        //[HttpGet]
        //public ActionResult GetBottom10SalePersons(string value)
        //{
        //    try
        //    {
        //        List<SalePersonDataModel> lst = new List<SalePersonDataModel>();
        //        CommonVM param = new CommonVM
        //        {
        //            BranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0",
        //            Value = value
        //        };

        //        ResultVM result = _repo.GetBottom10SalePersons(param);


        //        if (result.Status == "Success" && result.DataVM != null)
        //        {

        //            lst = JsonConvert.DeserializeObject<List<SalePersonDataModel>>(result.DataVM.ToString());

        //        }

        //        return Json(lst, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}



        //[HttpGet]
        //public ActionResult GetOrderPurchasePOReturnData(string value)
        //{
        //    try
        //    {
        //        List<PurchaseDataModel> lst = new List<PurchaseDataModel>();
        //        CommonVM param = new CommonVM
        //        {
        //            BranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0",
        //            Value = value
        //        };

        //        ResultVM result = _repo.GetOrderPurchasePOReturnData(param);

        //        if (result.Status == "Success" && result.DataVM != null)
        //        {
        //            lst = JsonConvert.DeserializeObject<List<PurchaseDataModel>>(result.DataVM.ToString());
        //        }

        //        if (lst.Count > 0)
        //        {
        //            return Json(lst[0], JsonRequestBehavior.AllowGet); // ✅ Return a single object
        //        }

        //        return Json(new { Ordered = 0, Purchase = 0, POReturn = 0 }, JsonRequestBehavior.AllowGet); // Return default object if empty
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        //[HttpGet]
        //public ActionResult GetSalesData(string value)
        //{
        //    try
        //    {
        //        List<SalesDataModel> lst = new List<SalesDataModel>();
        //        CommonVM param = new CommonVM
        //        {
        //            BranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0",
        //            Value = value
        //        };

        //        ResultVM result = _repo.GetSalesData(param);

        //        if (result.Status == "Success" && result.DataVM != null)
        //        {
        //            lst = JsonConvert.DeserializeObject<List<SalesDataModel>>(result.DataVM.ToString());
        //        }

        //        if (lst.Count > 0)
        //        {
        //            return Json(lst[0], JsonRequestBehavior.AllowGet); // ✅ Return a single object
        //        }

        //        return Json(new { Ordered = 0, Purchase = 0, POReturn = 0 }, JsonRequestBehavior.AllowGet); // Return default object if empty
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        //[HttpGet]
        //public ActionResult GetPendingSalesData(string value)
        //{
        //    try
        //    {
        //        List<PendingSalesDataModel> lst = new List<PendingSalesDataModel>();
        //        CommonVM param = new CommonVM
        //        {
        //            BranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0",
        //            Value = value
        //        };

        //        ResultVM result = _repo.GetPendingSales(param);


        //        if (result.Status == "Success" && result.DataVM != null)
        //        {

        //            lst = JsonConvert.DeserializeObject<List<PendingSalesDataModel>>(result.DataVM.ToString());

        //        }

        //        return Json(lst, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}


        [HttpGet]
        public ActionResult HasDayEndData(string branchId)
        {
            try
            {
                if (string.IsNullOrEmpty(branchId))
                    return Json(new { Success = false, Message = "Branch ID is required.", Dates = new string[0] }, JsonRequestBehavior.AllowGet);

                var result = _repo.HasDayEndData(branchId);

                var dates = new List<string>();

                if (result != null && result.Status == "Success" && result.DataVM != null)
                {
                    // Convert DataVM to JArray
                    JArray arr = result.DataVM as JArray;
                    if (arr == null)
                    {
                        // Maybe it's a JSON string
                        arr = JArray.Parse(result.DataVM.ToString());
                    }

                    foreach (var item in arr)
                    {
                        string dateStr = item["dateValue"]?.ToString(); // lowercase as in your repo
                        if (!string.IsNullOrEmpty(dateStr))
                            dates.Add(dateStr);
                    }
                }

                return Json(new { Success = true, Dates = dates }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Success = false, Message = e.Message, Dates = new string[0] }, JsonRequestBehavior.AllowGet);
            }
        }





        //[HttpGet]
        //public ActionResult HasDayEndData(string branchId)
        //{
        //    try
        //    {
        //        if (string.IsNullOrEmpty(branchId))
        //            return Json(new { Success = false, Message = "Branch ID is required." }, JsonRequestBehavior.AllowGet);

        //        // Call async repo method
        //        ResultVM result = _repo.HasDayEndData(branchId);

        //        bool hasData = false;
        //        if (result != null && result.Status == "Success" && result.DataVM != null)
        //        {
        //            hasData = ((List<dynamic>)result.DataVM).Any(d => !(bool)d.ExistsInDayEnd);
        //        }

        //        return Json(new { Success = true, HasData = hasData }, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new { Success = false, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}

    }
}
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OfficeOpenXml.Style;
using OfficeOpenXml;
using ShampanPOS.Models;
using ShampanPOS.Repo;
using ShampanPOS.Service.ViewModel;
using ShampanPOSUI.Persistence;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net.PeerToPeer;
using System.Reflection;
using System.Web;
using System.Web.Mvc;
using static OfficeOpenXml.ExcelErrorValue;

namespace ShampanPOSUI.Areas.Common.Controllers
{
    [Authorize]
    public class CommonController : Controller
    {
        private readonly ApplicationDbContext _applicationDb;
        CommonRepo _repo = new CommonRepo();

        // GET: Common/Common
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public ActionResult SettingsValue(string value)
        {
            try
            {
                List<CommonVM> lst = new List<CommonVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                ResultVM result = _repo.GetSettingsValue(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<CommonVM>>(result.DataVM.ToString());
                }
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult GetProductDataPurchase()
        {
            return PartialView("_getProductDataPurchase");
        }

        [HttpGet]
        public ActionResult GetProductData()
        {
            return PartialView("_getProductData");
        }
        [HttpGet]
        public ActionResult GetSaleDeliveryData()
        {
            return PartialView("_getSaleDeliveryData");
        }
        [HttpGet]
        public ActionResult GetProductDataCampaign()
        {
            return PartialView("_getProductDataCampaign");
        }
        
        [HttpPost]
        public ActionResult _getProductDataForSale()
        {
            try
            {
                _repo = new CommonRepo();

                ProductDataVM vm = new ProductDataVM();
                var search = Request.Form["search[value]"].Trim();

                var startRec = Request.Form["start"].ToString();
                var pageSize = Request.Form["length"].ToString();
                var orderColumnIndex = Request.Form["order[0][column]"].ToString();
                var orderDir = Request.Form["order[0][dir]"].ToString();
                var orderName = Request.Form[$"columns[{orderColumnIndex}][name]"].ToString();

                vm.PeramModel.SearchValue = search;
                vm.PeramModel.OrderName = orderName == "" ? "P.Id" : orderName;
                vm.PeramModel.orderDir = orderDir;
                vm.PeramModel.startRec = Convert.ToInt32(startRec);
                vm.PeramModel.pageSize = Convert.ToInt32(pageSize);
                if (vm.PeramModel.pageSize == -1)
                {
                    vm.PeramModel.pageSize = int.MaxValue; // fetch all records
                }
                vm.PeramModel.BranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
                vm.PeramModel.FromDate = Request.Form["FromDate"];

                if (!string.IsNullOrEmpty(Request.Form["CustomerId"]))
                {
                    vm.PeramModel.CustomerId = Convert.ToInt32(Request.Form["CustomerId"]);
                }
                else
                {
                    vm.PeramModel.CustomerId = -1;
                }

                vm.ProductCode = search;
                vm.ProductName = search;
                vm.BanglaName = search;
                vm.HSCodeNo = search;
                vm.ProductGroupName = search;
                vm.UOMName = search;
                vm.Status = search;
                vm.ImagePath = search;

                ResultVM result = _repo.GetProductModalForSaleData(vm);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var jArray = result.DataVM as JArray;
                    if (jArray != null)
                    {
                        var data = jArray.ToObject<List<ProductDataVM>>();
                        return Json(new
                        {
                            draw = Request.Form["draw"],
                            recordsTotal = result.Count,
                            recordsFiltered = result.Count,
                            data = data
                        }, JsonRequestBehavior.AllowGet);
                    }
                }

                return Json(new
                {
                    draw = Request.Form["draw"],
                    recordsTotal = 0,
                    recordsFiltered = 0,
                    data = new List<ProductDataVM>()
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Session["result"] = "Fail" + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new
                {
                    draw = Request.Form["draw"],
                    recordsTotal = 0,
                    recordsFiltered = 0,
                    data = new List<ProductDataVM>()
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult _getProductForPurchaseData()
        {
            try
            {
                _repo = new CommonRepo();

                ProductDataVM vm = new ProductDataVM();
                var search = Request.Form["search[value]"].Trim();

                var startRec = Request.Form["start"].ToString();
                var pageSize = Request.Form["length"].ToString();
                var orderColumnIndex = Request.Form["order[0][column]"].ToString();
                var orderDir = Request.Form["order[0][dir]"].ToString();
                var orderName = Request.Form[$"columns[{orderColumnIndex}][name]"].ToString();

                vm.PeramModel.SearchValue = search;
                vm.PeramModel.OrderName = orderName == "" ? "P.Id" : orderName;
                vm.PeramModel.orderDir = orderDir;
                vm.PeramModel.startRec = Convert.ToInt32(startRec);
                vm.PeramModel.pageSize = Convert.ToInt32(pageSize);
                if (vm.PeramModel.pageSize == -1)
                {
                    vm.PeramModel.pageSize = int.MaxValue; // fetch all records
                }
                vm.PeramModel.BranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
                vm.PeramModel.FromDate = Request.Form["FromDate"];

                vm.ProductCode = search;
                vm.ProductName = search;
                vm.BanglaName = search;
                vm.HSCodeNo = search;
                vm.ProductGroupName = search;
                vm.UOMName = search;
                vm.Status = search;

                ResultVM result = _repo.GetProductModalForPurchaseData(vm);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var jArray = result.DataVM as JArray;
                    if (jArray != null)
                    {
                        var data = jArray.ToObject<List<ProductDataVM>>();
                        return Json(new
                        {
                            draw = Request.Form["draw"],
                            recordsTotal = result.Count,
                            recordsFiltered = result.Count,
                            data = data
                        }, JsonRequestBehavior.AllowGet);
                    }
                }

                return Json(new
                {
                    draw = Request.Form["draw"],
                    recordsTotal = 0,
                    recordsFiltered = 0,
                    data = new List<ProductDataVM>()
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Session["result"] = "Fail" + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new
                {
                    draw = Request.Form["draw"],
                    recordsTotal = 0,
                    recordsFiltered = 0,
                    data = new List<ProductDataVM>()
                }, JsonRequestBehavior.AllowGet);
            }
        }

        //[HttpPost]
        //public ActionResult _getProductCode()
        //{
        //    try
        //    {
        //        _repo = new CommonRepo();

        //        ProductDataVM vm = new ProductDataVM();
        //        var search = Request.Form["search[value]"].Trim();

        //        var startRec = Request.Form["start"].ToString();
        //        var pageSize = Request.Form["length"].ToString();
        //        var orderColumnIndex = Request.Form["order[0][column]"].ToString();
        //        var orderDir = Request.Form["order[0][dir]"].ToString();
        //        var orderName = Request.Form[$"columns[{orderColumnIndex}][name]"].ToString();
        //        vm.PeramModel.pageSize = Convert.ToInt32(pageSize);
        //        if (vm.PeramModel.pageSize == -1)
        //        {
        //            vm.PeramModel.pageSize = int.MaxValue; // or just don't apply skip/take in your SQL
        //        }
        //        vm.PeramModel.SearchValue = search;
        //        vm.PeramModel.OrderName = orderName == "" ? "P.Id" : orderName;
        //        vm.PeramModel.orderDir = orderDir;
        //        vm.PeramModel.startRec = Convert.ToInt32(startRec);
        //        vm.PeramModel.pageSize = Convert.ToInt32(pageSize);
        //        vm.PeramModel.BranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
        //        vm.PeramModel.FromDate = Request.Form["FromDate"];

        //        vm.ProductCode = search;
        //        vm.ProductName = search;
        //        vm.BanglaName = search;
        //        vm.HSCodeNo = search;
        //        vm.ProductGroupName = search;
        //        vm.UOMName = search;
        //        vm.Status = search;

        //        ResultVM result = _repo.GetProductModalData(vm);

        //        if (result.Status == "Success" && result.DataVM != null)
        //        {
        //            var jArray = result.DataVM as JArray;
        //            if (jArray != null)
        //            {
        //                var data = jArray.ToObject<List<ProductDataVM>>();
        //                return Json(new
        //                {
        //                    draw = Request.Form["draw"],
        //                    recordsTotal = result.Count,
        //                    recordsFiltered = result.Count,
        //                    data = data
        //                }, JsonRequestBehavior.AllowGet);
        //            }
        //        }

        //        return Json(new
        //        {
        //            draw = Request.Form["draw"],
        //            recordsTotal = 0,
        //            recordsFiltered = 0,
        //            data = new List<ProductDataVM>()
        //        }, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Session["result"] = "Fail" + "~" + e.Message;
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new
        //        {
        //            draw = Request.Form["draw"],
        //            recordsTotal = 0,
        //            recordsFiltered = 0,
        //            data = new List<ProductDataVM>()
        //        }, JsonRequestBehavior.AllowGet);
        //    }
        //}
        [HttpPost]
        public ActionResult _getProductCode()
        {
            try
            {
                _repo = new CommonRepo();

                ProductDataVM vm = new ProductDataVM();
                var search = Request.Form["search[value]"].Trim();

                var startRec = Request.Form["start"].ToString();
                var pageSize = Request.Form["length"].ToString();
                var orderColumnIndex = Request.Form["order[0][column]"].ToString();
                var orderDir = Request.Form["order[0][dir]"].ToString();
                var orderName = Request.Form[$"columns[{orderColumnIndex}][name]"].ToString();

                vm.PeramModel.SearchValue = search;
                vm.PeramModel.OrderName = string.IsNullOrEmpty(orderName) ? "P.Id" : orderName;
                vm.PeramModel.orderDir = orderDir;
                vm.PeramModel.startRec = Convert.ToInt32(startRec);

                // Handle "All" option
                vm.PeramModel.pageSize = Convert.ToInt32(pageSize);
                if (vm.PeramModel.pageSize == -1)
                {
                    vm.PeramModel.pageSize = int.MaxValue; // fetch all records
                }

                vm.PeramModel.BranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
                vm.PeramModel.FromDate = Request.Form["FromDate"];

                // Apply search values
                vm.ProductCode = search;
                vm.ProductName = search;
                vm.BanglaName = search;
                vm.HSCodeNo = search;
                vm.ProductGroupName = search;
                vm.UOMName = search;
                vm.Status = search;

                ResultVM result = _repo.GetProductModalData(vm);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var jArray = result.DataVM as JArray;
                    if (jArray != null)
                    {
                        var data = jArray.ToObject<List<ProductDataVM>>();
                        return Json(new
                        {
                            draw = Request.Form["draw"],
                            recordsTotal = result.Count,
                            recordsFiltered = result.Count,
                            data = data
                        }, JsonRequestBehavior.AllowGet);
                    }
                }

                return Json(new
                {
                    draw = Request.Form["draw"],
                    recordsTotal = 0,
                    recordsFiltered = 0,
                    data = new List<ProductDataVM>()
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Session["result"] = "Fail" + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new
                {
                    draw = Request.Form["draw"],
                    recordsTotal = 0,
                    recordsFiltered = 0,
                    data = new List<ProductDataVM>()
                }, JsonRequestBehavior.AllowGet);
            }
        }



        //[HttpPost]
        //public ActionResult _getCampaignMudularityCalculation(CampaignUtilty vm)
        //{
        //    try
        //    {
        //        _repo = new CommonRepo();


        //        vm.BranchId = Convert.ToInt32(Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0");


        //        ResultVM result = _repo.CampaignMudularityCalculation(vm);

        //        if (result.Status == "Success" && result.DataVM != null)
        //        {
        //            var result1 = JsonConvert.DeserializeObject<CampaignManagerVM>(result.DataVM.ToString());
        //            return Json(new
        //            {
        //                data = result1
        //            }, JsonRequestBehavior.AllowGet);
        //        }

        //        return Json(new
        //        {
        //            data = new CampaignManagerVM()
        //        }, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Session["result"] = "Fail" + "~" + e.Message;
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new
        //        {
        //            draw = Request.Form["draw"],
        //            recordsTotal = 0,
        //            recordsFiltered = 0,
        //            data = new CampaignManagerVM()
        //        }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        //[HttpPost]
        //public ActionResult _getCampaignInvoiceCalculation(CampaignUtilty vm)
        //{
        //    try
        //    {
        //        _repo = new CommonRepo();


        //        vm.BranchId = Convert.ToInt32(Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0");


        //        ResultVM result = _repo.CampaignInvoiceCalculation(vm);

        //        if (result.Status == "Success" && result.DataVM != null)
        //        {
        //            var result1 = JsonConvert.DeserializeObject<CampaignDetailByInvoiceValueVM>(result.DataVM.ToString());
        //            return Json(new
        //            {
        //                data = result1
        //            }, JsonRequestBehavior.AllowGet);
        //        }

        //        return Json(new
        //        {
        //            data = new CampaignDetailByInvoiceValueVM()
        //        }, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Session["result"] = "Fail" + "~" + e.Message;
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new
        //        {
        //            draw = Request.Form["draw"],
        //            recordsTotal = 0,
        //            recordsFiltered = 0,
        //            data = new CampaignManagerVM()
        //        }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        [HttpGet]
        public ActionResult GetCustomerData()
        {
            return PartialView("_getCustomerData");
        }


        [HttpPost]
        public ActionResult _getCustomerData()
        {
            try
            {
                _repo = new CommonRepo();

                CustomerDataVM vm = new CustomerDataVM();
                //vm.ProductGroupId = Convert.ToInt32(Request.Form["ProductGroupId"]);
                var search = Request.Form["search[value]"].Trim();

                vm.CustomerName = search;
                vm.CustomerCode = search;
                vm.BanglaName = search;

                vm.Status = search;
                vm.BranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";

                ResultVM result = _repo.GetCustomerModalData(vm);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var jArray = result.DataVM as JArray;
                    if (jArray != null)
                    {
                        var data = jArray.ToObject<List<CustomerDataVM>>();
                        return Json(new
                        {
                            draw = Request.Form["draw"],
                            recordsTotal = data.Count,
                            recordsFiltered = data.Count,
                            data = data
                        }, JsonRequestBehavior.AllowGet);
                    }
                }

                return Json(new
                {
                    draw = Request.Form["draw"],
                    recordsTotal = 0,
                    recordsFiltered = 0,
                    data = new List<ProductDataVM>()
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Session["result"] = "Fail" + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new
                {
                    draw = Request.Form["draw"],
                    recordsTotal = 0,
                    recordsFiltered = 0,
                    data = new List<ProductDataVM>()
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult GetUOMFromNameData()
        {
            return PartialView("_getUOMFromNameData");
        }

        [HttpPost]
        public ActionResult _getUOMFromNameData()
        {
            try
            {
                _repo = new CommonRepo();

                ProductDataVM vm = new ProductDataVM();
                vm.UOMId = Convert.ToInt32(Request.Form["UOMId"]);
                var search = Request.Form["search[value]"].Trim();
                vm.UOMId = vm.UOMId;
                vm.UOMFromName = search;
                vm.UOMConversion = search;

                ResultVM result = _repo.GetUOMFromNameData(vm);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var jArray = result.DataVM as JArray;
                    if (jArray != null)
                    {
                        var data = jArray.ToObject<List<ProductDataVM>>();
                        return Json(new
                        {
                            draw = Request.Form["draw"],
                            recordsTotal = data.Count,
                            recordsFiltered = data.Count,
                            data = data
                        }, JsonRequestBehavior.AllowGet);
                    }
                }

                return Json(new
                {
                    draw = Request.Form["draw"],
                    recordsTotal = 0,
                    recordsFiltered = 0,
                    data = new List<ProductDataVM>()
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Session["result"] = "Fail" + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new
                {
                    draw = Request.Form["draw"],
                    recordsTotal = 0,
                    recordsFiltered = 0,
                    data = new List<ProductDataVM>()
                }, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpGet]
        public ActionResult GetProductGroupData()
        {
            return PartialView("_getProductGroupData");
        }

        [HttpPost]
        public ActionResult _getProductGroupData()
        {
            try
            {
                _repo = new CommonRepo();

                ProductDataVM vm = new ProductDataVM();
                var search = Request.Form["search[value]"].FirstOrDefault();

                ResultVM result = _repo.GetProductGroupModalData(vm);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var jArray = result.DataVM as JArray;
                    if (jArray != null)
                    {
                        var data = jArray.ToObject<List<ProductDataVM>>();
                        return Json(new
                        {
                            draw = Request.Form["draw"],
                            recordsTotal = data.Count,
                            recordsFiltered = data.Count,
                            data = data
                        }, JsonRequestBehavior.AllowGet);
                    }
                }

                return Json(new
                {
                    draw = Request.Form["draw"],
                    recordsTotal = 0,
                    recordsFiltered = 0,
                    data = new List<ProductDataVM>()
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Session["result"] = "Fail" + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new
                {
                    draw = Request.Form["draw"],
                    recordsTotal = 0,
                    recordsFiltered = 0,
                    data = new List<ProductDataVM>()
                }, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpGet]
        public ActionResult GetBooleanDropDown()
        {
            _repo = new CommonRepo();
            try
            {
                var result = _repo.GetBooleanDropDown();
                return Json(result.Data, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        

        //[HttpGet]
        //public ActionResult GetProductList()
        //{
        //    try
        //    {
        //        var result = _repo.GetProductList();
        //        return Json(result, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        [HttpGet]
        public ActionResult GetProductGroupList(string value)
        {
            try
            {
                List<ProductGroupVM> lst = new List<ProductGroupVM>();
                CommonVM param = new CommonVM();
                //param.Value = value;
                ResultVM result = _repo.GetProductGroupList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<ProductGroupVM>>(result.DataVM.ToString());
                }
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpGet]
        public ActionResult GetUOMList(string value)
        {
            try
            {
                List<UOMVM> lst = new List<UOMVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                ResultVM result = _repo.GetUOMList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<UOMVM>>(result.DataVM.ToString());
                }
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        //[HttpGet]
        //public ActionResult GetUOMList()
        //{
        //    try
        //    {
        //        var result = _repo.GetUOMList();
        //        return Json(result, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        [HttpGet]
        public ActionResult GetCustomerList(string value)
        {
            try
            {
               // var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
        
                List<CustomerVM> lst = new List<CustomerVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                //param.BranchId = currentBranchId;
                ResultVM result = _repo.GetCustomerList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<CustomerVM>>(result.DataVM.ToString());
                }
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpGet]
        public ActionResult GetProductList(string value)
        {

            try
            {
                List<ProductVM> lst = new List<ProductVM>();
                CommonVM param = new CommonVM();
                param.Value = value;

                ResultVM result = _repo.GetProductList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<ProductVM>>(result.DataVM.ToString());
                }
                return Json(lst, JsonRequestBehavior.AllowGet);
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
        //        CommonVM param = new CommonVM();
        //        param.BranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
        //        var result = _repo.GetCustomerList(param);
        //        return Json(result, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        [HttpGet]
        public ActionResult GetEnumTypeList(string value)
        {
            try
            {
                List<EnumTypeVM> lst = new List<EnumTypeVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                ResultVM result = _repo.GetEnumTypeList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<EnumTypeVM>>(result.DataVM.ToString());
                }
                return Json(lst, JsonRequestBehavior.AllowGet);
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

        [HttpGet]
        public ActionResult GetAreaList()
        {
            try
            {
                List<AreaVM> lst = new List<AreaVM>();
                CommonVM vm = new CommonVM();

                var result = _repo.GetAreaList(vm);
                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<AreaVM>>(result.DataVM.ToString());
                }
                return Json(lst, JsonRequestBehavior.AllowGet);
                //return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        //public ActionResult GetCurrencieList(string value)
        //{
        //    try
        //    {
        //        List<CurrencieVM> lst = new List<CurrencieVM>();
        //        CommonVM param = new CommonVM();
        //        param.Value = value;
        //        ResultVM result = _repo.GetCurrencieList(param);

        //        if (result.Status == "Success" && result.DataVM != null)
        //        {
        //            lst = JsonConvert.DeserializeObject<List<CurrencieVM>>(result.DataVM.ToString());
        //        }
        //        return Json(lst, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}
        public ActionResult GetCustomerCategoryList(string value)
        {
            try
            {
                List<CustomerCategoryVM> lst = new List<CustomerCategoryVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                ResultVM result = _repo.GetCustomerCategoryList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<CustomerCategoryVM>>(result.DataVM.ToString());
                }
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        //[HttpGet]
        //public ActionResult GetCurrencieList()
        //{
        //    try
        //    {
        //        var result = _repo.GetCurrencieList();
        //        return Json(result, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}


        //[HttpGet]
        //public ActionResult GetPaymentEnumTypeList()
        //{
        //    try
        //    {
        //        var result = _repo.GetPaymentEnumTypeList();
        //        return Json(result, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        //[HttpGet]
        //public ActionResult GetReceiveByEnumTypeList()
        //{
        //    try
        //    {
        //        var result = _repo.GetReceiveByEnumTypeList();
        //        return Json(result, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        //[HttpGet]
        //public ActionResult GetDeliveryPersonEnumTypeList()
        //{
        //    try
        //    {
        //        var result = _repo.GetDeliveryPersonEnumTypeList();
        //        return Json(result, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}



        //[HttpGet]
        //public ActionResult GetDeliveryList(string value)
        //{
        //    try
        //    {
        //        List<DeliveryPersonVM> lst = new List<DeliveryPersonVM>();
        //        CommonVM param = new CommonVM();
        //        param.Value = value;
        //        ResultVM result = _repo.GetDeliveryList(param);

        //        if (result.Status == "Success" && result.DataVM != null)
        //        {
        //            lst = JsonConvert.DeserializeObject<List<DeliveryPersonVM>>(result.DataVM.ToString());
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
        //public ActionResult GetDeliveryList()
        //{
        //    try
        //    {
        //        var result = _repo.GetDeliveryList();
        //        return Json(result, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}
        //[HttpGet]
        //public ActionResult GetDriverList(string value)
        //{
        //    try
        //    {
        //        List<EnumTypeVM> lst = new List<EnumTypeVM>();
        //        CommonVM param = new CommonVM();
        //        param.Value = value;
        //        ResultVM result = _repo.GetDriverList(param);

        //        if (result.Status == "Success" && result.DataVM != null)
        //        {
        //            lst = JsonConvert.DeserializeObject<List<EnumTypeVM>>(result.DataVM.ToString());
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
        public ActionResult GetDriverList()
        {
            try
            {
                var result = _repo.GetDriverList();
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpGet]
        public ActionResult GetSupplierList(string value)
        {
            try
            {
                List<SupplierVM> lst = new List<SupplierVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                ResultVM result = _repo.GetSupplierList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<SupplierVM>>(result.DataVM.ToString());
                }
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        //[HttpGet]
        //public ActionResult GetSupplierList()
        //{
        //    try
        //    {
        //        var result = _repo.GetSupplierList();
        //        return Json(result, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        //[HttpGet]
        //public ActionResult GetSupplierGroupList()
        //{
        //    try
        //    {
        //        var result = _repo.GetSupplierGroupList();
        //        return Json(result, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}


        //[HttpGet]
        //public ActionResult GetCampaignList()
        //{
        //    try
        //    {
        //        var result = _repo.GetCampaignList();
        //        return Json(result, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}


        //[HttpGet]
        //public ActionResult GetCampaignList()
        //{
        //    try
        //    {
        //        List<CampaignVM> lst = new List<CampaignVM>();
        //        CommonVM vm = new CommonVM();

        //        var result = _repo.GetCampaignList(vm);
        //        if (result.Status == "Success" && result.DataVM != null)
        //        {
        //            lst = JsonConvert.DeserializeObject<List<CampaignVM>>(result.DataVM.ToString());
        //        }
        //        return Json(lst, JsonRequestBehavior.AllowGet);
        //        //return Json(result, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}



        //[HttpGet]
        //public ActionResult GetCampaignTargetList(string value)
        //{
        //    try
        //    {
        //        List<SalePersonCampaignTargetVM> lst = new List<SalePersonCampaignTargetVM>();
        //        CommonVM param = new CommonVM();
        //        param.Value = value;
        //        ResultVM result = _repo.GetCampaignTargetList(param);

        //        if (result.Status == "Success" && result.DataVM != null)
        //        {
        //            lst = JsonConvert.DeserializeObject<List<SalePersonCampaignTargetVM>>(result.DataVM.ToString());
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
        //public ActionResult GetCampaignTargetList()
        //{
        //    try
        //    {
        //        var result = _repo.GetCampaignTargetList();
        //        return Json(result, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        [HttpGet]
        public ActionResult GetReceiveByDeliveryPersonList(string value)
        {
            try
            {
                List<CustomerAdvanceVM> lst = new List<CustomerAdvanceVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                ResultVM result = _repo.GetReceiveByDeliveryPersonList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<CustomerAdvanceVM>>(result.DataVM.ToString());
                }
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        //[HttpGet]
        //public ActionResult GetReceiveByDeliveryPersonList()
        //{
        //    try
        //    {
        //        var result = _repo.GetReceiveByDeliveryPersonList();
        //        return Json(result, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}



        //[HttpGet]
        //public ActionResult GetFiscalYearForSaleList()
        //{
        //    try
        //    {
        //        var result = _repo.GetFiscalYearForSaleList();
        //        return Json(result, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        //[HttpGet]
        //public ActionResult GetFiscalYearForSaleList()
        //{
        //    try
        //    {
        //        List<FiscalYearForSaleVM> lst = new List<FiscalYearForSaleVM>();
        //        CommonVM vm = new CommonVM();

        //        var result = _repo.GetFiscalYearForSaleList(vm);
        //        if (result.Status == "Success" && result.DataVM != null)
        //        {
        //            lst = JsonConvert.DeserializeObject<List<FiscalYearForSaleVM>>(result.DataVM.ToString());
        //        }
        //        return Json(lst, JsonRequestBehavior.AllowGet);
        //        //return Json(result, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}


        [HttpGet]
        public ActionResult GetCompanyTypeList(string value)
        {
            try
            {
                List<EnumTypeVM> lst = new List<EnumTypeVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                ResultVM result = _repo.EnumList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<EnumTypeVM>>(result.DataVM.ToString());
                }
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpGet]
        public ActionResult GetBranchProfileList(string value)
        {
            try
            {
                List<BranchProfileVM> lst = new List<BranchProfileVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                ResultVM result = _repo.EnumList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<BranchProfileVM>>(result.DataVM.ToString());
                }
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult GetAreaEnumTypeList(string value)
        {
            try
            {
                List<EnumTypeVM> lst = new List<EnumTypeVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                ResultVM result = _repo.EnumList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<EnumTypeVM>>(result.DataVM.ToString());
                }
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }



        //[HttpGet]
        //public ActionResult GetAreaLocationList(string EnumType, string ParentId)
        //{
        //    try
        //    {
        //        List<LocationVM> lst = new List<LocationVM>();
        //        CommonVM param = new CommonVM
        //        {
        //            Value = string.IsNullOrEmpty(EnumType) ? "" : EnumType, // Handle null or empty case
        //            ParentId = ParentId
        //        };
        //        ResultVM result = _repo.GetAreaLocationList(param);

        //        if (result.Status == "Success" && result.DataVM != null)
        //        {
        //            lst = JsonConvert.DeserializeObject<List<LocationVM>>(result.DataVM.ToString(),
        //                new JsonSerializerSettings
        //                {
        //                    NullValueHandling = NullValueHandling.Ignore
        //                });
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
        public ActionResult GetParentAreaList(string value)
        {
            try
            {
                List<AreaVM> lst = new List<AreaVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
               
                ResultVM result = _repo.GetParentAreaList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<AreaVM>>(result.DataVM.ToString());
                }
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }



        [HttpGet]
        public ActionResult GetParentBranchProfileList(string value)
        {
            try
            {
                List<BranchProfileVM> lst = new List<BranchProfileVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                ResultVM result = _repo.GetParentBranchProfileList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<BranchProfileVM>>(result.DataVM.ToString());
                }
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult GetBranchList(string value)
        {
            try
            {
                List<BranchProfileVM> lst = new List<BranchProfileVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                param.UserId = Session["UserId"] != null ? Session["UserId"].ToString() : "";
                ResultVM result = _repo.GetParentBranchProfileList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<BranchProfileVM>>(result.DataVM.ToString());
                }

                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult GetCustomerGroupList(string value)
        {
            try
            {
                List<CustomerGroupVM> lst = new List<CustomerGroupVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                ResultVM result = _repo.GetCustomerGroupList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<CustomerGroupVM>>(result.DataVM.ToString());
                }
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult GetCustomerRouteList(string value)
        {
            try
            {
                List<CustomerGroupVM> lst = new List<CustomerGroupVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                param.BranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
                ResultVM result = _repo.GetCustomerRouteList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<CustomerGroupVM>>(result.DataVM.ToString());
                }
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult GetSupplierGroupList(string value)
        {
            try
            {
                List<SupplierGroupVM> lst = new List<SupplierGroupVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                ResultVM result = _repo.GetSupplierGroupList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<SupplierGroupVM>>(result.DataVM.ToString());
                }
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }


        //[HttpGet]
        //public ActionResult GetSalePersonList(CommonVM param)
        //{
        //    try
        //    {
        //        var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
        //        param.BranchId = currentBranchId;

        //        List<SalesPersonVM> lst = new List<SalesPersonVM>();
        //        ResultVM result = _repo.GetSalePersonList(param);

        //        if (result.Status == "Success" && result.DataVM != null)
        //        {
        //            lst = JsonConvert.DeserializeObject<List<SalesPersonVM>>(result.DataVM.ToString());
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
        public ActionResult GetSaleOrderList(CommonVM param)
        {
            try
            {
                var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
                param.BranchId = currentBranchId;

                List<SaleVM> lst = new List<SaleVM>();
                ResultVM result = _repo.GetSaleOrderList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<SaleVM>>(result.DataVM.ToString());
                }
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }



        //[HttpGet]
        //public ActionResult GetSalePersonParentList(CommonVM param)
        //{
        //    try
        //    {
        //        var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
        //        param.BranchId = currentBranchId;

        //        List<SalesPersonVM> lst = new List<SalesPersonVM>();
        //        ResultVM result = _repo.GetSalePersonParentList(param);

        //        if (result.Status == "Success" && result.DataVM != null)
        //        {
        //            lst = JsonConvert.DeserializeObject<List<SalesPersonVM>>(result.DataVM.ToString());
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
        //public ActionResult GetSalePersonList(string value)
        //{
        //    try
        //    {
        //        List<SalesPersonVM> lst = new List<SalesPersonVM>();
        //        CommonVM param = new CommonVM();
        //        param.Value = value;
        //        param.BranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
        //        ResultVM result = _repo.SalePersonList(param);

        //        if (result.Status == "Success" && result.DataVM != null)
        //        {
        //            lst = JsonConvert.DeserializeObject<List<SalesPersonVM>>(result.DataVM.ToString());
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
        //public ActionResult GetSalePersonRouteList(string value)
        //{
        //    try
        //    {
        //        List<SalePersonRouteVM> lst = new List<SalePersonRouteVM>();
        //        CommonVM param = new CommonVM();
        //        param.Value = value;
        //        ResultVM result = _repo.SalePersonList(param);

        //        if (result.Status == "Success" && result.DataVM != null)
        //        {
        //            lst = JsonConvert.DeserializeObject<List<SalePersonRouteVM>>(result.DataVM.ToString());
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
        public ActionResult GetCustomersBySalePersonAndBranch(int salePersonId, int branchId)
        {
            try
            {
                List<CustomerVM> lst = new List<CustomerVM>();

                // Directly call the repository with SalePersonId and BranchId as parameters
                ResultVM result = _repo.GetCustomersBySalePersonAndBranch(salePersonId, branchId);

                // Check if the result is successful and contains data
                if (result.Status == "Success" && result.DataVM != null)
                {
                    // Deserialize the customer data into a list of CustomerVM
                    lst = JsonConvert.DeserializeObject<List<CustomerVM>>(result.DataVM.ToString());
                }

                // Return the customer list as JSON
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                // Log the error using Elmah
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);

                // Return the error message in JSON format
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }


        //[HttpGet]
        //public ActionResult GetRouteBySalePersonAndBranch(int salePersonId, int branchId)
        //{
        //    try
        //    {
        //        List<SalePersonRouteVM> lst = new List<SalePersonRouteVM>();

        //        ResultVM result = _repo.GetRouteBySalePersonAndBranch(salePersonId, branchId);

        //        if (result.Status == "Success" && result.DataVM != null)
        //        {
        //            lst = JsonConvert.DeserializeObject<List<SalePersonRouteVM>>(result.DataVM.ToString());
        //        }

        //        // Return the customer list as JSON
        //        return Json(lst, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        // Log the error using Elmah
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);

        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}


        public ActionResult BranchLoading(string UserId)
        {
            UserBranchProfileVM model = new UserBranchProfileVM();
            model.Operation = "add";
            model.UserId = UserId;
            return PartialView("_branchLoading", model);
        }

        [HttpGet]
        public ActionResult GetPaymentTypeList(string value)
        {
            try
            {
                var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";

                List<PaymentTypeVM> lst = new List<PaymentTypeVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                param.BranchId = currentBranchId;
                ResultVM result = _repo.GetPaymentTypeList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<PaymentTypeVM>>(result.DataVM.ToString());
                }
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        //[HttpGet]
        //public ActionResult GetSaleDeleveryByCustomerAndBranch(int CustomerId, int branchId)
        //{
        //    try
        //    {
        //        List<SaleDeliveryVM> lst = new List<SaleDeliveryVM>();

        //        // Directly call the repository with SalePersonId and BranchId as parameters
        //        ResultVM result = _repo.GetSaleDeleveryByCustomerAndBranch(CustomerId, branchId);

        //        // Check if the result is successful and contains data
        //        if (result.Status == "Success" && result.DataVM != null)
        //        {
        //            // Deserialize the customer data into a list of CustomerVM
        //            lst = JsonConvert.DeserializeObject<List<SaleDeliveryVM>>(result.DataVM.ToString());
        //        }

        //        // Return the customer list as JSON
        //        return Json(lst, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        // Log the error using Elmah
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);

        //        // Return the error message in JSON format
        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        //[HttpGet]
        //public ActionResult GetSaleDeleveryList(string value)
        //{
        //    try
        //    {
        //        // var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";

        //        List<SaleDeliveryVM> lst = new List<SaleDeliveryVM>();
        //        CommonVM param = new CommonVM();
        //        param.Value = value;
        //        //param.BranchId = currentBranchId;
        //        ResultVM result = _repo.GetSaleDeleveryList(param);

        //        if (result.Status == "Success" && result.DataVM != null)
        //        {
        //            lst = JsonConvert.DeserializeObject<List<SaleDeliveryVM>>(result.DataVM.ToString());
        //        }
        //        return Json(lst, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        //[HttpPost]
        //public ActionResult _getSaleDelevery()
        //{
        //    try
        //    {
        //        _repo = new CommonRepo();

        //        SaleDeliveryVM vm = new SaleDeliveryVM();
        //        var search = Request.Form["search[value]"].Trim();

        //        var startRec = Request.Form["start"].ToString();
        //        var pageSize = Request.Form["length"].ToString();
        //        var orderColumnIndex = Request.Form["order[0][column]"].ToString();
        //        var orderDir = Request.Form["order[0][dir]"].ToString();
        //        var orderName = Request.Form[$"columns[{orderColumnIndex}][name]"].ToString();

        //        vm.PeramModel.SearchValue = search;
        //        vm.PeramModel.OrderName = orderName == "" ? "P.Id" : orderName;
        //        vm.PeramModel.orderDir = orderDir;
        //        vm.PeramModel.startRec = Convert.ToInt32(startRec);
        //        vm.PeramModel.pageSize = Convert.ToInt32(pageSize);
        //        if (vm.PeramModel.pageSize == -1)
        //        {
        //            vm.PeramModel.pageSize = int.MaxValue; // fetch all records
        //        }
        //        vm.PeramModel.BranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
        //        vm.PeramModel.FromDate = Request.Form["FromDate"];

        //        if (!string.IsNullOrEmpty(Request.Form["CustomerId"]))
        //        {
        //            vm.PeramModel.CustomerId = Convert.ToInt32(Request.Form["CustomerId"]);
        //        }
        //        else
        //        {
        //            vm.PeramModel.CustomerId = -1;
        //        }

        //        vm.CustomerId = vm.CustomerId;
                
        //        vm.DeliveryPersonId = vm.DriverPersonId;
        //        vm.SalePersonId = vm.SalePersonId;
        //        vm.DeliveryAddress = vm.DeliveryAddress;
        //        vm.DeliveryDate = vm.DeliveryDate;
        //        vm.GrandTotalAmount = vm.GrandTotalAmount;
                

        //        ResultVM result = _repo.GetSaleDeleveryModal(vm);

        //        if (result.Status == "Success" && result.DataVM != null)
        //        {
        //            var jArray = result.DataVM as JArray;
        //            if (jArray != null)
        //            {
        //                var data = jArray.ToObject<List<SaleDeliveryVM>>();
        //                return Json(new
        //                {
        //                    draw = Request.Form["draw"],
        //                    recordsTotal = result.Count,
        //                    recordsFiltered = result.Count,
        //                    data = data
        //                }, JsonRequestBehavior.AllowGet);
        //            }
        //        }

        //        return Json(new
        //        {
        //            draw = Request.Form["draw"],
        //            recordsTotal = 0,
        //            recordsFiltered = 0,
        //            data = new List<SaleDeliveryVM>()
        //        }, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Session["result"] = "Fail" + "~" + e.Message;
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new
        //        {
        //            draw = Request.Form["draw"],
        //            recordsTotal = 0,
        //            recordsFiltered = 0,
        //            data = new List<SaleDeliveryVM>()
        //        }, JsonRequestBehavior.AllowGet);
        //    }
        //}



        //[HttpGet]
        //public ActionResult GetAreaLocationListByEnumType(string EnumType)
        //{
        //    try
        //    {
        //        List<LocationVM> lst = new List<LocationVM>();
        //        CommonVM param = new CommonVM
        //        {
        //            Value = string.IsNullOrEmpty(EnumType) ? "" : EnumType
        //        };
        //        ResultVM result = _repo.GetAreaLocationList(param);

        //        if (result.Status == "Success" && result.DataVM != null)
        //        {
        //            lst = JsonConvert.DeserializeObject<List<LocationVM>>(result.DataVM.ToString(),
        //                new JsonSerializerSettings
        //                {
        //                    NullValueHandling = NullValueHandling.Ignore
        //                });
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
        //public ActionResult GetFocalPointList(CommonVM param)
        //{
        //    try
        //    {
        //        var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
        //        param.BranchId = currentBranchId;

        //        List<FocalPointVM> lst = new List<FocalPointVM>();
        //        ResultVM result = _repo.GetFocalPointList(param);

        //        if (result.Status == "Success" && result.DataVM != null)
        //        {
        //            lst = JsonConvert.DeserializeObject<List<FocalPointVM>>(result.DataVM.ToString());
        //        }
        //        return Json(lst, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}


    }
}
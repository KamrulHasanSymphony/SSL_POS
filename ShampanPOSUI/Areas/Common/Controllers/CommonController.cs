using DocumentFormat.OpenXml.EMMA;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using ShampanPOS.Models;
using ShampanPOS.Repo;
using ShampanPOSUI.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace ShampanPOSUI.Areas.Common.Controllers
{
    //[Authorize]
    public class CommonController : Controller
    {
        private readonly ApplicationDbContext _applicationDb;
        CommonRepo _repo = new CommonRepo();
        // GET: C
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
        public ActionResult GetProductDataSale()
        {
            return PartialView("_getProductDataSale");
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
        
        [HttpGet]
        public ActionResult GetCustomerData()
        {
            return PartialView("_getCustomerData");
        }

        [HttpGet]
        public ActionResult GetUOMFromNameData()
        {
            return PartialView("_getUOMFromNameData");
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

        [HttpGet]
        public ActionResult GetProductGroupList(string value)
        {
            try
            {
                if (Session["CurrentBranch"] == null)
                {
                    return Json(new { Status = "Error", Message = "Current Branch session is missing." }, JsonRequestBehavior.AllowGet);
                }

                if (Session["CompanyId"] == null)
                {
                    return Json(new { Status = "Error", Message = "Company ID session is missing." }, JsonRequestBehavior.AllowGet);
                }
                List<ProductGroupVM> lst = new List<ProductGroupVM>();
                CommonVM param = new CommonVM();
                //param.Value = value;

                param.BranchId = Session["CurrentBranch"].ToString();
                param.CompanyId = Session["CompanyId"].ToString();

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
        public ActionResult GetMasterItemGroupList(string value)
        {
            try
            {
                List<MasterItemGroupVM> lst = new List<MasterItemGroupVM>();
                CommonVM param = new CommonVM();
                //param.Value = value;
                ResultVM result = _repo.GetMasterItemGroupList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<MasterItemGroupVM>>(result.DataVM.ToString());
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

        [HttpGet]
        public ActionResult GetCustomerList(string value)
        {
            try
            {
                if (Session["CurrentBranch"] == null)
                {
                    return Json(new { Status = "Error", Message = "Current Branch session is missing." }, JsonRequestBehavior.AllowGet);
                }

                if (Session["CompanyId"] == null)
                {
                    return Json(new { Status = "Error", Message = "Company ID session is missing." }, JsonRequestBehavior.AllowGet);
                }

                List<CustomerVM> lst = new List<CustomerVM>();
                CommonVM param = new CommonVM();
                param.Value = value;

                param.BranchId = Session["CurrentBranch"].ToString();
                param.CompanyId = Session["CompanyId"].ToString();

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
                List<ProductNewVM> lst = new List<ProductNewVM>();
                CommonVM param = new CommonVM();
                param.Value = value;

                ResultVM result = _repo.GetProductList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<ProductNewVM>>(result.DataVM.ToString());
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
        public ActionResult GetMasterProductList(string value)
        {

            try
            {
                List<MasterItemVM> lst = new List<MasterItemVM>();
                CommonVM param = new CommonVM();
                param.Value = value;

                ResultVM result = _repo.GetMasterProductList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<MasterItemVM>>(result.DataVM.ToString());
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
                if (Session["CurrentBranch"] == null)
                {
                    return Json(new { Status = "Error", Message = "Current Branch session is missing." }, JsonRequestBehavior.AllowGet);
                }

                if (Session["CompanyId"] == null)
                {
                    return Json(new { Status = "Error", Message = "Company session is missing." }, JsonRequestBehavior.AllowGet);
                }

                List<SupplierVM> lst = new List<SupplierVM>();
                CommonVM param = new CommonVM();
                param.Value = value; 
                param.BranchId = Session["CurrentBranch"].ToString();
                param.CompanyId = Session["CompanyId"].ToString();
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

        [HttpGet]
        public ActionResult GetMasterSupplierList(string value)
        {
            try
            {
                List<MasterSupplierVM> lst = new List<MasterSupplierVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                ResultVM result = _repo.GetMasterSupplierList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<MasterSupplierVM>>(result.DataVM.ToString());
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
        public ActionResult GetSupplierProductList(string value)
        {
            try
            {
                List<MasterSupplierVM> lst = new List<MasterSupplierVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                ResultVM result = _repo.GetSupplierProductList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<MasterSupplierVM>>(result.DataVM.ToString());
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
                if (Session["CurrentBranch"] == null)
                {
                    return Json(new { Status = "Error", Message = "Current Branch session is missing." }, JsonRequestBehavior.AllowGet);
                }

                if (Session["CompanyId"] == null)
                {
                    return Json(new { Status = "Error", Message = "Company session is missing." }, JsonRequestBehavior.AllowGet);
                }

                List<SupplierGroupVM> lst = new List<SupplierGroupVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                param.BranchId = Session["CurrentBranch"].ToString();
                param.CompanyId = Session["CompanyId"].ToString();

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


        [HttpGet]
        public ActionResult GetMasterSupplierGroupList(string value)
        {
            try
            {
                List<MasterSupplierGroupVM> lst = new List<MasterSupplierGroupVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                ResultVM result = _repo.GetMasterSupplierGroupList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<MasterSupplierGroupVM>>(result.DataVM.ToString());
                }
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult BranchLoading(string UserId)
        {
            UserBranchProfileVM model = new UserBranchProfileVM();
            model.Operation = "add";
            model.UserId = UserId;
            return PartialView("_branchLoading", model);
        }

        //[HttpGet]
        //public ActionResult GetPaymentTypeList(string value)
        //{
        //    try
        //    {
        //        var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";

        //        List<PaymentTypeVM> lst = new List<PaymentTypeVM>();
        //        CommonVM param = new CommonVM();
        //        param.Value = value;
        //        param.BranchId = currentBranchId;
        //        ResultVM result = _repo.GetPaymentTypeList(param);

        //        if (result.Status == "Success" && result.DataVM != null)
        //        {
        //            lst = JsonConvert.DeserializeObject<List<PaymentTypeVM>>(result.DataVM.ToString());
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
        public ActionResult GetPaymentTypeList(string value)
        {
            try
            {
                List<PaymentTypeVM> lst = new List<PaymentTypeVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
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

        [HttpPost]
        public ActionResult _getProductForSaleData()
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


        [HttpGet]
        public ActionResult GetSaleOrderList(CommonVM param)
        {
            try
            {
                var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
                param.BranchId = currentBranchId;

                List<SaleOrderVM> lst = new List<SaleOrderVM>();
                ResultVM result = _repo.GetSaleOrderList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<SaleOrderVM>>(result.DataVM.ToString());
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
        public ActionResult GetSectionList(string value)
        {
            try
            {
                List<SectionVM> lst = new List<SectionVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                ResultVM result = _repo.GetSectionList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<SectionVM>>(result.DataVM.ToString());
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
        public ActionResult GetStatusList(string value)
        {
            try
            {
                List<EnumTypeVM> lst = new List<EnumTypeVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                ResultVM result = _repo.GetStatusList(param);

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
        public ActionResult GetReportTypeList(string value)
        {
            try
            {
                List<EnumTypeVM> lst = new List<EnumTypeVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                ResultVM result = _repo.GetReportTypeList(param);

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
        public ActionResult GetTableList(string value)
        {
            try
            {
                List<TableInfoVM> lst = new List<TableInfoVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                ResultVM result = _repo.GetTableList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<TableInfoVM>>(result.DataVM.ToString());
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
        public ActionResult GetPurchaseOrder()
        {
            return PartialView("_getPurchaseOrderIdData");
        }


        [HttpPost]
        public ActionResult _getPurchaseOrderIdData()
        {
            try
            {
                _repo = new CommonRepo();

                var search = Request.Form["search[value]"]?.Trim() ?? "";

                PurchaseOrderVM vm = new PurchaseOrderVM
                {
                    Code = search,
                    SupplierName = search,
                    SupplierAddress = search,
                    OrderDate = search,
                    DeliveryDateTime = search,
                    Status = search
                };

                ResultVM result = _repo.GetPurchaseOrderIdData(vm);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var jArray = result.DataVM as JArray;
                    var data = jArray?.ToObject<List<PurchaseOrderVM>>() ?? new List<PurchaseOrderVM>();

                    return Json(new
                    {
                        draw = Request.Form["draw"],
                        recordsTotal = data.Count,
                        recordsFiltered = data.Count,
                        data = data
                    }, JsonRequestBehavior.AllowGet);
                }

                return Json(new
                {
                    draw = Request.Form["draw"],
                    recordsTotal = 0,
                    recordsFiltered = 0,
                    data = new List<PurchaseOrderVM>()
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new
                {
                    draw = Request.Form["draw"],
                    recordsTotal = 0,
                    recordsFiltered = 0,
                    data = new List<PurchaseOrderVM>()
                }, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpGet]

        public ActionResult GetPurchaseOrderList()
        {
            try
            {
                List<PurchaseOrderVM> lst = new List<PurchaseOrderVM>();
                CommonVM param = new CommonVM();

                ResultVM result = _repo.GetPurchaseOrderList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<PurchaseOrderVM>>(result.DataVM.ToString());
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
        public ActionResult GetBankAccountList(string value)
        {
            try
            {
                List<BankAccountVM> lst = new List<BankAccountVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                ResultVM result = _repo.GetBankAccountList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<BankAccountVM>>(result.DataVM.ToString());
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
        public ActionResult GetPurchase()
        {
            return PartialView("_getPurchase");
        }




        [HttpPost]
        public ActionResult _getPurchaseData()
        {
            try
            {
                _repo = new CommonRepo();

                PurchaseDataVM vm = new PurchaseDataVM();
                var search = Request.Form["search[value]"].Trim();

                var startRec = Request.Form["start"].ToString();
                var pageSize = Request.Form["length"].ToString();
                var orderColumnIndex = Request.Form["order[0][column]"].ToString();
                var orderDir = Request.Form["order[0][dir]"].ToString();
                var orderName = Request.Form[$"columns[{orderColumnIndex}][name]"].ToString();

                vm.PeramModel.SearchValue = search;
                vm.PeramModel.OrderName = orderName == "" ? "M.Id" : orderName;
                vm.PeramModel.orderDir = orderDir;
                vm.PeramModel.startRec = Convert.ToInt32(startRec);
                vm.PeramModel.pageSize = Convert.ToInt32(pageSize);
                if (vm.PeramModel.pageSize == -1)
                {
                    vm.PeramModel.pageSize = int.MaxValue; // fetch all records
                }
                vm.PeramModel.BranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
                vm.PeramModel.FromDate = Request.Form["FromDate"];

                

                vm.Code = search;
                vm.PurchaseOrderCode = search;
                vm.SupplierName = search;
                vm.Comments = search;

                ResultVM result = _repo.GetPurchaseData(vm);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var jArray = result.DataVM as JArray;
                    if (jArray != null)
                    {
                        var data = jArray.ToObject<List<PurchaseDataVM>>();
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
                    data = new List<PurchaseDataVM>()
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
                    data = new List<PurchaseDataVM>()
                }, JsonRequestBehavior.AllowGet);
            }
        }



        [HttpGet]
        public ActionResult GetSale()
        {
            return PartialView("_getSale");
        }




        [HttpPost]
        public ActionResult _getSaleData()
        {
            try
            {
                _repo = new CommonRepo();

                SaleDataVM vm = new SaleDataVM();
                vm.PeramModel = new PeramModel();

                var search = Request.Form["search[value]"] != null ? Request.Form["search[value]"].Trim() : "";

                var startRec = Request.Form["start"] != null ? Request.Form["start"].ToString() : "0";
                var pageSize = Request.Form["length"] != null ? Request.Form["length"].ToString() : "10";
                var orderColumnIndex = Request.Form["order[0][column]"] != null ? Request.Form["order[0][column]"].ToString() : "0";
                var orderDir = Request.Form["order[0][dir]"] != null ? Request.Form["order[0][dir]"].ToString() : "asc";
                var orderName = Request.Form[$"columns[{orderColumnIndex}][name]"] != null ? Request.Form[$"columns[{orderColumnIndex}][name]"].ToString() : "M.Id";

                vm.PeramModel.SearchValue = search;
                vm.PeramModel.OrderName = orderName == "" ? "M.Id" : orderName;
                vm.PeramModel.orderDir = orderDir;
                vm.PeramModel.startRec = Convert.ToInt32(startRec);
                vm.PeramModel.pageSize = Convert.ToInt32(pageSize);

                if (vm.PeramModel.pageSize == -1)
                {
                    vm.PeramModel.pageSize = int.MaxValue;
                }

                vm.PeramModel.BranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
                vm.PeramModel.FromDate = Request.Form["FromDate"];

                vm.Code = search;
                vm.SaleOrderCode = search;
                vm.CustomerName = search;
                vm.Comments = search;

                ResultVM result = _repo.GetSaleData(vm);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var jArray = result.DataVM as JArray;
                    if (jArray != null)
                    {
                        var data = jArray.ToObject<List<SaleDataVM>>();
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
                    data = new List<SaleDataVM>()
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
                    data = new List<SaleDataVM>()
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult _getPurchaseDatabySupplier()
        {
            try
            {
                _repo = new CommonRepo();
                PurchaseDataVM vm = new PurchaseDataVM();

                var search = Request.Form["search[value]"].Trim();
                var supplierId = Request.Form["SupplierId"];

                vm.PeramModel.SearchValue = search;
                vm.PeramModel.startRec = Convert.ToInt32(Request.Form["start"]);
                vm.PeramModel.pageSize = Convert.ToInt32(Request.Form["length"]);
                vm.PeramModel.orderDir = Request.Form["order[0][dir]"];
                vm.PeramModel.OrderName =
                    Request.Form[$"columns[{Request.Form["order[0][column]"]}][name]"] ?? "M.Id";

                vm.PeramModel.BranchId = Session["CurrentBranch"]?.ToString() ?? "0";
                vm.PeramModel.FromDate = Request.Form["FromDate"];

                // 🔥 Supplier filter
                vm.SupplierId = string.IsNullOrEmpty(supplierId) ? 0 : Convert.ToInt32(supplierId);

                // search bindings
                vm.Code = search;
                vm.PurchaseOrderCode = search;
                vm.SupplierName = search;
                vm.Comments = search;

                ResultVM result = _repo.GetPurchaseDatabysupplier(vm);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var data = ((JArray)result.DataVM).ToObject<List<PurchaseDataVM>>();

                    return Json(new
                    {
                        draw = Request.Form["draw"],
                        recordsTotal = result.Count,
                        recordsFiltered = result.Count,
                        data = data
                    }, JsonRequestBehavior.AllowGet);
                }

                return Json(new { draw = Request.Form["draw"], recordsTotal = 0, recordsFiltered = 0, data = new List<PurchaseDataVM>() });
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { draw = Request.Form["draw"], recordsTotal = 0, recordsFiltered = 0, data = new List<PurchaseDataVM>() });
            }
        }


        [HttpGet]
        public ActionResult GetItemList(string value = "")
        {
            try
            {
                List<MasterItemVM> lst = new List<MasterItemVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                ResultVM result = _repo.GetItemList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<MasterItemVM>>(result.DataVM.ToString());
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
        public ActionResult GetSupplierListByGroup(string value = "")
        {
            try
            {
                List<MasterSupplierVM> lst = new List<MasterSupplierVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                ResultVM result = _repo.GetSupplierListByGroup(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<MasterSupplierVM>>(result.DataVM.ToString());
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
        public ActionResult GetProductModal(string productGroupId)
        {
            try
            {
                List<ProductDataVM> lst = new List<ProductDataVM>();
                CommonVM param = new CommonVM();
                param.Value = productGroupId;

                // add company id from session
                param.CompanyId = Session["CompanyId"] != null
                    ? Session["CompanyId"].ToString()
                    : "";
                ResultVM result = _repo.GetProductModal(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<ProductDataVM>>(result.DataVM.ToString());
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
        public ActionResult GetProductByBarcode(string code)
        {
            try
            {
                CommonVM param = new CommonVM();
                param.Value = code;

                // add company id from session
                param.CompanyId = Session["CompanyId"] != null
                    ? Session["CompanyId"].ToString()
                    : "";
                ResultVM result = _repo.GetProductByBarcode(param);

                ProductDataVM product = null;

                if (result.Status == "Success" && result.DataVM != null)
                {
                    product = JsonConvert.DeserializeObject<ProductDataVM>(
                        result.DataVM.ToString()
                    );
                }

                return Json(product, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }




        [HttpGet]
        public ActionResult ProductModal(string productGroupId)
        {
            try
            {
                List<ProductDataVM> lst = new List<ProductDataVM>();

                CommonVM param = new CommonVM();
                param.Value = productGroupId; // 🔥 pass value

                ResultVM result = _repo.ProductModal(param); // ✅ correct call

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<ProductDataVM>>(result.DataVM.ToString());
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
        public ActionResult GetProductModalPurchase(string value)
        {
            try
            {
                List<ProductDataVM> lst = new List<ProductDataVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                ResultVM result = _repo.GetProductModalPurchase(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<ProductDataVM>>(result.DataVM.ToString());
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
        public ActionResult SaleModal(string value)
        {
            try
            {
                List<SaleDataVM> lst = new List<SaleDataVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                ResultVM result = _repo.SaleModal(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<SaleDataVM>>(result.DataVM.ToString());
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
        public ActionResult PurchaseModal(string value)
        {
            try
            {
                List<PurchaseDataVM> lst = new List<PurchaseDataVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                ResultVM result = _repo.PurchaseModal(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<PurchaseDataVM>>(result.DataVM.ToString());
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
        public ActionResult GetPurchaseModal(string supplierId)
        {
            try
            {
                if (Session["CurrentBranch"] == null)
                {
                    return Json(new { Status = "Error", Message = "Current Branch session is missing." }, JsonRequestBehavior.AllowGet);
                }

                if (Session["CompanyId"] == null)
                {
                    return Json(new { Status = "Error", Message = "Company session is missing." }, JsonRequestBehavior.AllowGet);
                }

                CommonVM param = new CommonVM
                {
                    Value = supplierId
                };

                param.BranchId = Session["CurrentBranch"].ToString();
                param.CompanyId = Session["CompanyId"].ToString();


                ResultVM result = _repo.GetPurchaseModal(param);

                List<PurchaseDataVM> lst = new List<PurchaseDataVM>();

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<PurchaseDataVM>>(result.DataVM.ToString());

                    foreach (var item in lst)
                    {
                        item.PurchaseDateString = item.PurchaseDate.HasValue
                            ? item.PurchaseDate.Value.ToString("dd-MM-yyyy")
                            : "";
                    }
                }

                return Content(
                    JsonConvert.SerializeObject(lst),
                    "application/json"
                );
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);

                return Json(new
                {
                    Error = true,
                    Message = e.Message
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult GetPurchaseOrderModal(string supplierId)
        {
            try
            {
                if (Session["CurrentBranch"] == null)
                {
                    return Json(new { Status = "Error", Message = "Current Branch session is missing." }, JsonRequestBehavior.AllowGet);
                }

                if (Session["CompanyId"] == null)
                {
                    return Json(new { Status = "Error", Message = "Company session is missing." }, JsonRequestBehavior.AllowGet);
                }
                List<PurchaseOrderDataVM> lst = new List<PurchaseOrderDataVM>();
                CommonVM param = new CommonVM();
                param.Value = supplierId;

                param.BranchId = Session["CurrentBranch"].ToString();
                param.CompanyId = Session["CompanyId"].ToString();

                ResultVM result = _repo.GetPurchaseOrderModal(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<PurchaseOrderDataVM>>(result.DataVM.ToString());
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
        public ActionResult GetBankIdList(string value)
        {
            try
            {
                if (Session["CurrentBranch"] == null)
                {
                    return Json(new { Status = "Error", Message = "Current Branch session is missing." }, JsonRequestBehavior.AllowGet);
                }

                if (Session["CompanyId"] == null)
                {
                    return Json(new { Status = "Error", Message = "Company session is missing." }, JsonRequestBehavior.AllowGet);
                }

                List<BankInformationVM> lst = new List<BankInformationVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                param.BranchId = Session["CurrentBranch"].ToString();
                param.CompanyId = Session["CompanyId"].ToString();

                ResultVM result = _repo.GetBankIdList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<BankInformationVM>>(result.DataVM.ToString());
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
        public ActionResult GetBankAccountModal(string bankId)
        {
            try
            {
                if (Session["CurrentBranch"] == null)
                {
                    return Json(new { Status = "Error", Message = "Current Branch session is missing." }, JsonRequestBehavior.AllowGet);
                }

                if (Session["CompanyId"] == null)
                {
                    return Json(new { Status = "Error", Message = "Company session is missing." }, JsonRequestBehavior.AllowGet);
                }

                List<BankAccountDataVM> lst = new List<BankAccountDataVM>();
                CommonVM param = new CommonVM();
                param.Value = bankId;
                param.Value2 = null;
                param.BranchId = Session["CurrentBranch"].ToString();
                param.CompanyId = Session["CompanyId"].ToString();

                ResultVM result = _repo.GetBankAccountModal(param);
                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<BankAccountDataVM>>(result.DataVM.ToString());
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
        public ActionResult GetDepositModal(string bankId, string bankAccountId)
        {
            try
            {
                List<DepositDataVM> lst = new List<DepositDataVM>();
                CommonVM param = new CommonVM();
                param.Value = bankId;
                param.Value2 = bankAccountId;
                ResultVM result = _repo.GetDepositModal(param);
                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<DepositDataVM>>(result.DataVM.ToString());
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
        public ActionResult GetWithdrawalModal(string bankId, string bankAccountId)
        {
            try
            {
                List<WithdrawalDataVM> lst = new List<WithdrawalDataVM>();
                CommonVM param = new CommonVM();
                param.Value = bankId;
                param.Value2 = bankAccountId;
                ResultVM result = _repo.GetWithdrawalModal(param);
                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<WithdrawalDataVM>>(result.DataVM.ToString());
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
        public ActionResult GetCustomerModal(string groupId)
        {
            try
            {
                List<CustomerVM> lst = new List<CustomerVM>();
                CommonVM param = new CommonVM();
                param.Value = groupId;
                ResultVM result = _repo.GetCustomerModal(param);
                if (result.Status == "Success" && result.DataVM != null)
                    lst = JsonConvert.DeserializeObject<List<CustomerVM>>(result.DataVM.ToString());
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult GetNewProductModal(string groupId)
        {
            try
            {
                int branchId = Convert.ToInt32(Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0");

                List<ProductVM> lst = new List<ProductVM>();
                CommonVM param = new CommonVM();
                param.Value = groupId;   // group filter (optional)
                param.Value2 = branchId.ToString();  // BranchId — Session থেকে
                ResultVM result = _repo.GetNewProductModal(param);
                if (result.Status == "Success" && result.DataVM != null)
                    lst = JsonConvert.DeserializeObject<List<ProductVM>>(result.DataVM.ToString());
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult GetSupplierModal(string groupId)
        {
            try
            {
                List<SupplierVM> lst = new List<SupplierVM>();
                CommonVM param = new CommonVM();
                param.Value = groupId;
                ResultVM result = _repo.GetSupplierModal(param);
                if (result.Status == "Success" && result.DataVM != null)
                    lst = JsonConvert.DeserializeObject<List<SupplierVM>>(result.DataVM.ToString());
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpGet]
        public ActionResult GetPurchaseReturnModal(string supplierId)
        {
            try
            {
                List<PurchaseReturnDataVM> lst = new List<PurchaseReturnDataVM>();
                CommonVM param = new CommonVM();
                param.Value = supplierId;
                ResultVM result = _repo.GetPurchaseReturnModal(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<PurchaseReturnDataVM>>(result.DataVM.ToString());
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
        public ActionResult GetSaleOrderModal()
        {
            try
            {
                int branchId = Convert.ToInt32(Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0");

                List<SaleOrderVM> lst = new List<SaleOrderVM>();
                CommonVM param = new CommonVM();
                param.Value = branchId.ToString(); // BranchId pass করছি
                ResultVM result = _repo.GetSaleOrderModal(param);
                if (result.Status == "Success" && result.DataVM != null)
                    lst = JsonConvert.DeserializeObject<List<SaleOrderVM>>(result.DataVM.ToString());
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

    }
}
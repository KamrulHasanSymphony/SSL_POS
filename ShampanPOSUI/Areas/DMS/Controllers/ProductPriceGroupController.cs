using DocumentFormat.OpenXml.EMMA;
using DocumentFormat.OpenXml.Office2010.Excel;
using Newtonsoft.Json;
using ShampanPOS.Models;
using ShampanPOS.Models.KendoCommon;
using ShampanPOS.Repo;
using ShampanPOS.Repo.Helper;
using ShampanPOS.Service.ViewModel;
using ShampanPOSUI.Persistence;
using System;
using System.CodeDom.Compiler;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web.Mvc;
using System.Web.WebPages;

namespace ShampanPOSUI.Areas.DMS.Controllers
{
    [Authorize]
    [RouteArea("DMS")]
    public class ProductPriceGroupController : Controller
    {
        private readonly ApplicationDbContext _applicationDb;
        ProductPriceGroupRepo _repo = new ProductPriceGroupRepo();
        public string YearEnd { get; set; }


        // GET: DMS/ProductPriceGroup
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Create()
        {
            ProductPriceGroupRepo _fiscalRepo = new ProductPriceGroupRepo();
            CompanyProfileRepo _repo = new CompanyProfileRepo();
            CommonVM param = new CommonVM();
            ProductPriceGroupVM vm = new ProductPriceGroupVM();
            CompanyProfileVM companyVm = new CompanyProfileVM();
            List<ProductPriceGroupVM> fiscalYearLists = new List<ProductPriceGroupVM>();

            var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
            vm.BranchId = Convert.ToInt32(currentBranchId);
            var companyId = Session["CompanyId"];
            param.Id = companyId.ToString();

            ResultVM companyData = _repo.List(param);

            if (companyData.Status == "Success" && companyData.DataVM != null)
            {
                companyVm = JsonConvert.DeserializeObject<List<CompanyProfileVM>>(companyData.DataVM.ToString()).FirstOrDefault();
            }
            else
            {
                vm = null;
            }

            List<ProductPriceGroupDetailVM> detailVMs = new List<ProductPriceGroupDetailVM>();
            ProductPriceGroupDetailVM dvm;

            vm = DesignFiscalYear(vm);
            vm.Operation = "add";

            return View("Create", vm);
        }
        private ProductPriceGroupVM DesignFiscalYear(ProductPriceGroupVM model)
        {
            try
            {
                DateTime start_date;
                return model;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpGet]
        public ActionResult ProductPriceGroupSet(ProductPriceGroupVM model)
        {
            try
            {

                ProductRepo _repo = new ProductRepo();
                List<ProductPriceGroupDetailVM> vm = new List<ProductPriceGroupDetailVM>();
                CommonVM param = new CommonVM();
                param.Id = "";

                ResultVM result = _repo.List(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<ProductPriceGroupDetailVM>>(result.DataVM.ToString());
                    if (vm != null && vm.Count > 0)
                    {
                        vm.RemoveAll(x => x.Id == 0);
                        //vm.RemoveAt(0);
                    }
                    if (vm != null)
                    {
                        foreach (var item in vm)
                        {
                            item.ProductId = item.Id;
                        }
                    }
                }
                else
                {
                    vm = null;
                }

                model.ProductPriceGroupDetails = vm;
                model.Operation = "add";
                return PartialView("_period", model.ProductPriceGroupDetails);

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost]
        public ActionResult CreateEdit(ProductPriceGroupVM model)
        {
            ResultModel<ProductPriceGroupVM> result = new ResultModel<ProductPriceGroupVM>();
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new ProductPriceGroupRepo();

            BranchProfileRepo _repoBranchProfile = new BranchProfileRepo();
            List<BranchProfileVM> vm = new List<BranchProfileVM>();
            CommonVM param = new CommonVM();


            try
            {
                var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
                model.BranchId = Convert.ToInt32(currentBranchId);

                ResultVM resultBranchProfile = _repoBranchProfile.List(param);

                if (resultBranchProfile.Status == "Success" && resultBranchProfile.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<BranchProfileVM>>(resultBranchProfile.DataVM.ToString());
                    model.BranchProfileList = vm;

                    if (vm != null && vm.Count > 0)
                    {
                        vm.RemoveAll(x => x.Id == 0);
                        //vm.RemoveAt(0);
                    }

                }
                else
                {
                    vm = null;
                }



                if (model.Operation.ToLower() == "add")
                {
                    model.CreatedBy = Session["UserId"].ToString();
                    model.CreatedOn = DateTime.Now.ToString();
                    model.CreatedFrom = Ordinary.GetLocalIpAddress();

                    resultVM = _repo.Insert(model);

                    if (resultVM.Status == "Success")
                    {
                        model = JsonConvert.DeserializeObject<ProductPriceGroupVM>(resultVM.DataVM.ToString());
                        model.Operation = "add";
                        Session["result"] = resultVM.Status + "~" + resultVM.Message;
                        result = new ResultModel<ProductPriceGroupVM>()
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

                        result = new ResultModel<ProductPriceGroupVM>()
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
                        result = new ResultModel<ProductPriceGroupVM>()
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

                        result = new ResultModel<ProductPriceGroupVM>()
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

        [HttpGet]
        public ActionResult Edit(int id)
        {
            try
            {
                _repo = new ProductPriceGroupRepo();
                ProductRepo _repoProduct = new ProductRepo();
                ProductPriceGroupVM vm = new ProductPriceGroupVM();
                CommonVM param = new CommonVM();
                List<ProductVM> vmList = new List<ProductVM>();

                param.Id = id.ToString();

                ResultVM result = _repo.List(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<ProductPriceGroupVM>>(result.DataVM.ToString()).FirstOrDefault();
                }
                else
                {
                    vm = null;
                }

                #region NewProductListShowing

                param.Id = "";
                ResultVM resultProduct = _repoProduct.List(param);

                if (resultProduct.Status == "Success" && resultProduct.DataVM != null)
                {
                    vmList = JsonConvert.DeserializeObject<List<ProductVM>>(resultProduct.DataVM.ToString());
                    if (vmList != null && vmList.Count > 0)
                    {
                        vmList.RemoveAll(x => x.Id == 0);
                    }
                }
                else
                {
                    vmList = null;
                }

                if (vmList != null)
                {
                    //MainProductList
                    var ProductCodeList = vmList.Select(x => new { x.Code }).ToList();

                    //ProductPriceGroup
                    var ProductPriceGroupDetailCodeList = vm.ProductPriceGroupDetails.Select(x => new { x.Code }).ToList();

                    //GetUniqueList
                    var differentCodesAndName = ProductCodeList.Union(ProductPriceGroupDetailCodeList).Except(ProductCodeList.Intersect(ProductPriceGroupDetailCodeList)).ToList();

                    //Adding Items in a List
                    var productIdList = differentCodesAndName.Select(x => new
                    {

                        Code = x.Code,
                        ProductId = vmList.FirstOrDefault(p => p.Code == x.Code)?.Id,
                        Name = vmList.FirstOrDefault(p => p.Code == x.Code)?.Name,
                        BanglaName = vmList.FirstOrDefault(p => p.Code == x.Code)?.BanglaName

                    }).Where(x => x.ProductId.HasValue).ToList();

                    //CreatingListOfObject
                    var newItemsWithCodeName = productIdList.Select(code => new ProductPriceGroupDetailVM
                    {

                        Code = code.Code,
                        Name = code.Name,
                        BanglaName = code.BanglaName,
                        ProductPriceGroupId = vm.Id,
                        ProductId = code.ProductId

                    }).ToList();

                    //AddInDetails
                    vm.ProductPriceGroupDetails.AddRange(newItemsWithCodeName);

                }

                //RemoveingDataWithoutCodeProperty
                vm.ProductPriceGroupDetails.RemoveAll(x => string.IsNullOrWhiteSpace(x.Code));

                #endregion


                vm.Operation = "update";
                return View("CreateEdit", vm);

            }
            catch (Exception e)
            {
                Session["result"] = "Fail" + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return RedirectToAction("Index");
            }
        }


        [HttpPost]
        public JsonResult GetProductPriceGroupGrid(GridOptions options)
        {

            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new ProductPriceGroupRepo();

            try
            {
                result = _repo.GetGridData(options);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<ProductPriceGroupVM>>(result.DataVM.ToString());

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
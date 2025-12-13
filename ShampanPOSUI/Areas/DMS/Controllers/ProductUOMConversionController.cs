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
    public class ProductUOMConversionController : Controller
    {
        private readonly ApplicationDbContext _applicationDb;
        ProductUOMConversionRepo _repo = new ProductUOMConversionRepo();

        // GET: DMS/ProductUOMConversion
        public ActionResult Index(int? id, string Name, string Code)
        {
            if (id == 0 || id == null)
            {
                return View();
            }
            else
            {
                ProductUOMFactorsVM ProductUOMFactorsVM = new ProductUOMFactorsVM()
                {
                    ProductId = id.Value,
                };
                return View("Index", ProductUOMFactorsVM);
            }
        }



        public ActionResult Create(int ProductId)
        {
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };

            ProductUOMFactorsVM vm = new ProductUOMFactorsVM();
            ProductUOMConversionRepo _repo = new ProductUOMConversionRepo();
            ProductRepo _productrepo = new ProductRepo();

            vm.Operation = "add";
            vm.ProductId = ProductId;

            if (vm != null && vm.ProductId != 0)
            {
                ProductVM Productvm = new ProductVM();
                CommonVM param = new CommonVM();
                param.Id = vm.ProductId.ToString();
                ResultVM result = _productrepo.List(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    List<ProductVM> productList = JsonConvert.DeserializeObject<List<ProductVM>>(result.DataVM.ToString());
                    Productvm = productList.FirstOrDefault();

                    if (productList != null && productList.Any())
                    {
                        List<ProductUOMFactorsVM> batchHistoryList = JsonConvert.DeserializeObject<List<ProductUOMFactorsVM>>(result.DataVM.ToString());
                        var data = batchHistoryList.FirstOrDefault(); 

                        if (data != null)
                        {
                            vm.ProductName = Productvm.Name;
                            vm.ProductCode = Productvm.Code;
                        }
                    }
                }
            }

            var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
            vm.BranchId = int.Parse(currentBranchId);

            return View("Create", vm);
        }



        [HttpPost]
        public ActionResult CreateEdit(ProductUOMFactorsVM model)
        {
            ResultModel<ProductUOMFactorsVM> result = new ResultModel<ProductUOMFactorsVM>();
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new ProductUOMConversionRepo();

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
                            model = JsonConvert.DeserializeObject<ProductUOMFactorsVM>(resultVM.DataVM.ToString());
                            model.Operation = "add";

                            Session["result"] = resultVM.Status + "~" + resultVM.Message;
                            result = new ResultModel<ProductUOMFactorsVM>()
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

                            result = new ResultModel<ProductUOMFactorsVM>()
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
                            result = new ResultModel<ProductUOMFactorsVM>()
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

                            result = new ResultModel<ProductUOMFactorsVM>()
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
            return View("Create", model);

        }

        [HttpGet]
        public ActionResult Edit(int id)
        {
            try
            {
                _repo = new ProductUOMConversionRepo();

                ProductUOMFactorsVM vm = new ProductUOMFactorsVM();
                vm.Id = id;
                ResultVM result = _repo.List(vm);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<ProductUOMFactorsVM>>(result.DataVM.ToString()).FirstOrDefault();
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
        public ActionResult Delete(ProductUOMFactorsVM vm)
        {
            ResultModel<ProductUOMFactorsVM> result = new ResultModel<ProductUOMFactorsVM>();

            try
            {
                _repo = new ProductUOMConversionRepo();
                CommonVM param = new CommonVM();

                //param.IDs = vm.IDs;
                param.ModifyBy = Session["UserId"].ToString();
                param.ModifyFrom = Ordinary.GetLocalIpAddress();

                ResultVM resultData = _repo.Delete(param);

                Session["result"] = resultData.Status + "~" + resultData.Message;

                result = new ResultModel<ProductUOMFactorsVM>()
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
        public JsonResult GetGridData(GridOptions options, string getProductId)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new ProductUOMConversionRepo();

            try
            {
                var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
                options.vm.BranchId = (currentBranchId).ToString();

                result = _repo.GetGridData(options, getProductId);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<ProductUOMFactorsVM>>(result.DataVM.ToString());

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
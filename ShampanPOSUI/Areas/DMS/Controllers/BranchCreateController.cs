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
using System.Web.Mvc;

namespace ShampanPOSUI.Areas.DMS.Controllers
{
    
    public class BranchCreateController : Controller
    {
        private readonly ApplicationDbContext _applicationDb;
        BranchProfileRepo _repo = new BranchProfileRepo();
        CommonRepo _commonRepo = new CommonRepo();

        // GET: DMS/BranchProfile
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult BranchCreate(string companyId,string userId)
        {
            BranchProfileVM vm = new BranchProfileVM();
            vm.Operation = "add";
            vm.IsActive = true;
            vm.UserId = userId;
            vm.CompanyId = Convert.ToInt32(companyId);

            return View("BranchCreate", vm);
        }



        [HttpPost]
        public ActionResult BranchCreateEdit(BranchProfileVM model)
        {
            ResultModel<BranchProfileVM> result = new ResultModel<BranchProfileVM>();
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new BranchProfileRepo();

            try
            {
                if (model.Operation.ToLower() == "add")
                {
                    model.CreatedBy = model.UserId;
                    model.CreatedOn = DateTime.Now.ToString();
                    model.CreatedFrom = Ordinary.GetLocalIpAddress();

                    resultVM = _repo.BranchInsert(model);

                    if (resultVM.Status == ResultStatus.Success.ToString())
                    {
                        model = JsonConvert.DeserializeObject<BranchProfileVM>(resultVM.DataVM.ToString());
                        model.Operation = "add";

                        result = new ResultModel<BranchProfileVM>()
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
                        result = new ResultModel<BranchProfileVM>()
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
                    model.LastModifiedBy = Session["UserId"]?.ToString();
                    model.LastModifiedOn = DateTime.Now.ToString();
                    model.LastUpdateFrom = Ordinary.GetLocalIpAddress();

                    resultVM = _repo.Update(model);

                    if (resultVM.Status == ResultStatus.Success.ToString())
                    {
                        result = new ResultModel<BranchProfileVM>()
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
                        result = new ResultModel<BranchProfileVM>()
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
                    return Json(new { Status = "Fail", Message = "Invalid Operation" });
                }
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Status = "Fail", Message = e.Message });
            }
        }



    }
}
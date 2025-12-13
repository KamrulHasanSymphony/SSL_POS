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
    [Authorize]
    [RouteArea("DMS")]
    public class DayEndController : Controller
    {
        private readonly ApplicationDbContext _applicationDb;
        UOMRepo _repo = new UOMRepo();
        DayEndRepo _dayEndRepo = new DayEndRepo();
        CommonRepo _commonRepo = new CommonRepo();

        // GET: DMS/UOM
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Create()
        {

            return View("Create");
        }        

        [HttpPost]
        public ActionResult DayEndProcess(string Date)
        {
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new UOMRepo();

          
                try
                {

						//resultVM = _repo.Insert();

      //                  if (resultVM.Status == ResultStatus.Success.ToString())
      //                  {
                            
      //                  }
      //                  else
      //                  {                            
      //                      Session["result"] = "Fail" + "~" + resultVM.Message;

                           
      //                  }

                   
                }
                catch (Exception e)
                {
                    Session["result"] = "Fail" + "~" + e.Message;
                    Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                    return View("Index");
                }
       
            return View("Index");

        }



        [HttpPost]
        public ActionResult ProcessData(string startDate, int? branchId)
        {
            ResultModel<DayEndHeadersVM> result = new ResultModel<DayEndHeadersVM>();
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _dayEndRepo = new DayEndRepo();

            var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
            branchId = Convert.ToInt32(currentBranchId);

            try
            {
                resultVM = _dayEndRepo.ProcessData(startDate, branchId);

                if (resultVM.Status == ResultStatus.Success.ToString())
                {
                    Session["result"] = resultVM.Status + "~" + resultVM.Message;

                    result = new ResultModel<DayEndHeadersVM>
                    {
                        Success = true,
                        Status = Status.Success,
                        Message = resultVM.Message,
                        Data = resultVM.DataVM as DayEndHeadersVM // No need for deserialization
                    };
                }
                else
                {
                    Session["result"] = "Fail" + "~" + resultVM.Message;

                    result = new ResultModel<DayEndHeadersVM>
                    {
                        Status = Status.Fail,
                        Message = resultVM.Message,
                        Data = null
                    };
                }

                return Json(result);
            }
            catch (Exception ex)
            {
                return Json(new { Status = "Error", Message = ex.Message });
            }
        }


        //[HttpPost]
        //public ActionResult ProcessData(string startDate, int? branchId)
        //{
        //    ResultModel<DayEndHeadersVM> result = new ResultModel<DayEndHeadersVM>();
        //    ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
        //    _dayEndRepo = new DayEndRepo();

        //    var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
        //    branchId = Convert.ToInt32(currentBranchId);
        //    try
        //    {
        //        resultVM = _dayEndRepo.ProcessData(startDate, branchId);

        //        if (resultVM.Status == ResultStatus.Success.ToString())
        //        {
        //            var data = JsonConvert.DeserializeObject<DayEndHeadersVM>(resultVM.DataVM.ToString());

        //            Session["result"] = resultVM.Status + "~" + resultVM.Message;
        //            result = new ResultModel<DayEndHeadersVM>()
        //            {
        //                Success = true,
        //                Status = Status.Success,
        //                Message = resultVM.Message,
        //                Data = data
        //            };
        //            return Json(result);
        //        }
        //        else
        //        {
        //            Session["result"] = "Fail" + "~" + resultVM.Message;

        //            result = new ResultModel<DayEndHeadersVM>()
        //            {
        //                Status = Status.Fail,
        //                Message = resultVM.Message,
        //                Data = null
        //            };
        //            return Json(result);
        //        }
        //    }
        //    catch (Exception ex)
        //    {

        //        throw ex.InnerException;
        //    }


        //}

    }
}
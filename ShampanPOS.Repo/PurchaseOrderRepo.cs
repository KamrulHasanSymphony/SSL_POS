using Newtonsoft.Json;
using Shampan.Services.CommonKendo;
using ShampanPOS.Models;
using ShampanPOS.Models.KendoCommon;
using ShampanPOS.Repo.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Runtime.InteropServices.ComTypes;
using static ShampanPOS.Models.CommonModel;

namespace ShampanPOS.Repo
{
    public class PurchaseOrderRepo
    {
        public ResultVM Dropdown()
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };

                #region Invoke API
                var data = httpRequestHelper.PostData("/api/ProductGroup/Dropdown", authModel, JsonConvert.SerializeObject(authModel));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion

                return result;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public ResultVM List(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/PurchaseOrder/List", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM GetPurchaseDetailDataById(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/PurchaseOrder/GetPurchaseDetailDataById", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }


        public GridEntity<PurchaseOrderDetailVM> GetAllPurchaseDetailData(GridOptions options, int masterId)
        {
            try
            {
                var result = new GridEntity<PurchaseOrderDetailVM>();

                // Define your SQL query string
                string sqlQuery = @"
        -- Count query
        SELECT COUNT(DISTINCT H.Id) AS totalcount
        FROM PurchaseOrderDetails h
        WHERE 1=1 
        AND h.PurchaseOrderId = @masterId
        -- Add the filter condition
        " + (options.filter != null ? " AND (" + GridQueryBuilder<PurchaseOrderDetailVM>.FilterCondition(options.filter) + ")" : "") + @"

        -- Data query with pagination and sorting
        SELECT * 
        FROM (
            SELECT 
            ROW_NUMBER() OVER(ORDER BY " + (options.sort != null ? options.sort[0].field + " " + options.sort[0].dir : "H.Id DESC") + @") AS rowindex,
            ISNULL(H.Id, 0) AS Id,
            ISNULL(H.ProductId, 0) AS ProductId,
            ISNULL(H.UOMId, 0) AS UOMId,
            ISNULL(H.UOMFromId, 0) AS UOMFromId,
            ISNULL(H.PurchaseOrderId, 0) AS PurchaseOrderId,
            ISNULL(P.Name, '') AS ProductName,
            ISNULL(H.Line, '') AS Line,
            ISNULL(H.Quantity, 0) AS Quantity,
            ISNULL(H.UnitPrice, 0) AS UnitPrice,
            ISNULL(H.SubTotal, 0) AS SubTotal,
            ISNULL(H.SD, 0) AS SD,
            ISNULL(H.SDAmount, 0) AS SDAmount,
            ISNULL(H.VATRate, 0) AS VATRate,
            ISNULL(H.VATAmount, 0) AS VATAmount,
            ISNULL(H.OthersAmount, 0) AS OthersAmount,
            ISNULL(H.LineTotal, 0) AS LineTotal,
            ISNULL(u.Name, '') AS UOMName,
            ISNULL(H.UOMconversion, '') AS UOMconversion,
            ISNULL(H.Comments, '') AS Comments,
            ISNULL(H.IsPost, 'N') AS IsPost,
            ISNULL(H.VATType, '') AS VATType,
            ISNULL(H.TransactionType, '') AS TransactionType,
            ISNULL(FORMAT(H.InvoiceDateTime, 'yyyy-MM-dd HH:mm'), '1900-01-01') AS InvoiceDateTime,
            ISNULL(H.IsFixedVAT, 'N') AS IsFixedVAT,
            ISNULL(H.FixedVATAmount, 0) AS FixedVATAmount

            FROM PurchaseOrderDetails h
            LEFT OUTER JOIN Products p ON h.ProductId = p.Id
            LEFT OUTER JOIN UOMs u ON h.UOMId = u.Id
            WHERE 1=1
            AND h.PurchaseOrderId = @masterId
            -- Add the filter condition
            " + (options.filter != null ? " AND (" + GridQueryBuilder<PurchaseOrderDetailVM>.FilterCondition(options.filter) + ")" : "") + @"
        ) AS a
        WHERE rowindex > @skip AND (@take = 0 OR rowindex <= @take)";

                sqlQuery = sqlQuery.Replace("@masterId", "'" + masterId + "'");

                // Pass the parameters as a string (as expected by GetGridData_CMD)
                result = KendoGrid<PurchaseOrderDetailVM>.GetGridData_CMD(options, sqlQuery, "H.Id", masterId.ToString());

                return result;
            }
            catch (Exception ex)
            {
                // Log or throw the exception with a more informative message
                throw new Exception("An error occurred while fetching purchase order details.", ex);
            }
        }

        public ResultVM Insert(PurchaseOrderVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/PurchaseOrder/Insert", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM Update(PurchaseOrderVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/PurchaseOrder/Update", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM Delete(PurchaseOrderVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/ProductGroup/Delete", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }
     
        public ResultVM GetGridData(GridOptions options)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };

                #region Invoke API 

                var data = httpRequestHelper.PostData("api/PurchaseOrder/GetGridData", authModel, JsonConvert.SerializeObject(options,
                    new JsonSerializerSettings
                    {
                        NullValueHandling = NullValueHandling.Ignore
                    }));

                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);

                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM GetDetailsGridData(GridOptions options)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };

                #region Invoke API 

                var data = httpRequestHelper.PostData("api/PurchaseOrder/GetDetailsGridData", authModel, JsonConvert.SerializeObject(options,
                    new JsonSerializerSettings
                    {
                        NullValueHandling = NullValueHandling.Ignore
                    }));

                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);

                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        public ResultVM FromPurchaseOrderGridData(GridOptions options)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };

                #region Invoke API 

                var data = httpRequestHelper.PostData("api/PurchaseOrder/FromPurchaseOrderGridData", authModel, JsonConvert.SerializeObject(options,
                    new JsonSerializerSettings
                    {
                        NullValueHandling = NullValueHandling.Ignore
                    }));

                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);

                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM PurchaseOrderList(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/PurchaseOrder/PurchaseOrderList", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM GetPurchaseOrderDetailDataById(GridOptions options, int masterId)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };

                #region Invoke API 

                var data = httpRequestHelper.PostData($"api/PurchaseOrder/GetPurchaseOrderDetailDataById?masterId={masterId}", authModel, JsonConvert.SerializeObject(options,
                    new JsonSerializerSettings
                    {
                        NullValueHandling = NullValueHandling.Ignore
                    }));

                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);

                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        //public object GetProductList()
        //{
        //    throw new NotImplementedException();
        //}

        public ResultVM MultiplePost(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/PurchaseOrder/MultiplePost", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        public ResultVM MultipleIsCompleted(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/PurchaseOrder/MultipleIsCompleted", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }


        public Stream ReportPreview(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                var result = httpRequestHelper.PostDataReport("api/PurchaseOrder/ReportPreview", authModel, JsonConvert.SerializeObject(model));               

                return result;                
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM SummaryReport(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/PurchaseOrder/SummaryReport", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

    }
}

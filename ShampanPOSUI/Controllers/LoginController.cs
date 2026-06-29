using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.Extensions.Configuration;
using Microsoft.Owin.Security;
using Newtonsoft.Json;
using ShampanPOS.Models;
using ShampanPOS.Repo;
using ShampanPOSUI.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using static ShampanPOS.Models.CommonModel;
using static ShampanPOSUI.App_Start.IdentityConfig;
using System.Security.Claims;

namespace ShampanPOSUI.Controllers
{
    public class LoginController : Controller
    {
        private ApplicationSignInManager _signInManager;
        private ApplicationUserManager _userManager;

        CommonRepo _repo = new CommonRepo();
        CompanyProfileRepo _companyRepo = new CompanyProfileRepo();
        UserProfileRepo _userRepo = new UserProfileRepo();

        public LoginController()
        {
        }

        public LoginController(ApplicationUserManager userManager, ApplicationSignInManager signInManager)
        {
            UserManager = userManager;
            SignInManager = signInManager;
        }

        public ApplicationSignInManager SignInManager
        {
            get
            {
                return _signInManager ?? HttpContext.GetOwinContext().Get<ApplicationSignInManager>();
            }
            private set
            {
                _signInManager = value;
            }
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        [HttpGet]
        public ActionResult Index()
        {
            LoginResource loginModel = new LoginResource();
            //List<CompanyInfo> companyInfos = new List<CompanyInfo>();
            try
            {
                //_companyRepo = new CompanyProfileRepo();
                //CommonVM commonVM = new CommonVM();
                //CompanyInfo companyInfo = new CompanyInfo();
                SessionClear();

                //var result = _companyRepo.List(commonVM);

                //if (result != null && result.Status == "Success" && result.DataVM != null)
                //{
                //    var data = JsonConvert.DeserializeObject<List<CompanyInfo>>(result.DataVM.ToString());

                //    foreach (var item in data)
                //    {
                //        companyInfo = new CompanyInfo();
                //        companyInfo.CompanyId = item.Id;
                //        companyInfo.CompanyName = item.CompanyName;
                //        companyInfos.Add(companyInfo);
                //    }
                //}

                //loginModel.CompanyInfos = companyInfos;

                loginModel.Message = TempData["ErrorMessage"]?.ToString();

                if (User.Identity.IsAuthenticated)
                {
                    return RedirectToAction("Index", "Home", new { area = "Common", branchChange = false });
                }
                else
                {
                    SessionClear();
                }

                return View(loginModel);
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                //CompanyInfo selectOption = new CompanyInfo
                //{
                //    CompanyId = 0,
                //    CompanyName = "--Select Company--"
                //};
                //companyInfos.Add(selectOption);
                //loginModel.CompanyInfos = companyInfos;

                loginModel.Message = "Something went wrong!";

                return View(loginModel);
            }
        }

        [HttpPost]
        public async Task<ActionResult> xxxIndex(LoginResource model)
        
        {
            //_companyRepo = new CompanyProfileRepo();
            _userRepo = new UserProfileRepo();
            //List<CompanyInfo> companyInfos = new List<CompanyInfo>();
            List<UserProfileVM> userInfos = new List<UserProfileVM>();
            try
            {
                _repo = new CommonRepo();
                CommonVM commonVM = new CommonVM();
                //CompanyInfo companyInfo = new CompanyInfo();
                UserProfileVM userInfo = new UserProfileVM();

                var userName = model.UserName;
                commonVM.Name = userName;


                var userResult = _userRepo.LList(commonVM);
                if (userResult != null && userResult.Status == "Success" && userResult.DataVM != null)
                {
                    var data = JsonConvert.DeserializeObject<List<UserProfileVM>>(userResult.DataVM.ToString());

                    foreach (var item in data)
                    {
                        userInfo = new UserProfileVM();
                        userInfo.Id = item.Id;
                        userInfo.UserName = item.UserName;
                        userInfo.ImagePath = item.ImagePath;

                        userInfo.CompanyId = item.CompanyId;
                        userInfo.CompanyName = item.CompanyName;

                        userInfo.BranchId = item.BranchId;
                        userInfo.BranchName = item.BranchName;
                        userInfos.Add(userInfo);
                    }
                }

                //model.UserInfos = userInfos;
                //var currentUserImage = model.UserInfos.FirstOrDefault(x => x.UserName == model.UserName)?.ImagePath;
                //Session["UserImage"] = currentUserImage;
                //var userHashId = model.UserInfos .FirstOrDefault(x => x.UserName == model.UserName)?.Id;

                //Session["UserHashId"] = userHashId;

                model.UserInfos = userInfos;

                var currentUser = model.UserInfos
                    .FirstOrDefault(x => x.UserName == model.UserName);

                if (currentUser != null)
                {
                    Session["UserImage"] = currentUser.ImagePath;
                    Session["UserHashId"] = currentUser.Id;

                    // Company Information
                    Session["CompanyId"] = currentUser.CompanyId;
                    Session["CompanyName"] = currentUser.CompanyName;

                    // Branch (NEW)
                    Session["BranchId"] = currentUser.BranchId;
                    Session["BranchName"] = currentUser.BranchName;
                }


               // var companyResult = _companyRepo.List(commonVM);

               // if (companyResult != null && companyResult.Status == "Success" && companyResult.DataVM != null)
               // {
               //     var data = JsonConvert.DeserializeObject<List<CompanyInfo>>(companyResult.DataVM.ToString());

               //     foreach (var item in data)
               //     { 
               //         companyInfo = new CompanyInfo();
               //         companyInfo.CompanyId = item.Id;
               //         companyInfo.CompanyName = item.CompanyName;
               //         //companyInfo.CompanyName = "Bata";
               //         companyInfos.Add(companyInfo);
               //     }
               // }

               //model.CompanyInfos = companyInfos;







                //if (string.IsNullOrWhiteSpace(model.UserName) || string.IsNullOrWhiteSpace(model.Password))
                //{
                //    return View(model);
                //}

                if (string.IsNullOrWhiteSpace(model.UserName))
                {
                    ModelState.AddModelError("UserName",
                        "The User Name field is required.");
                }

                if (string.IsNullOrWhiteSpace(model.Password))
                {
                    ModelState.AddModelError("Password",
                        "The Password field is required.");
                }

                if (!ModelState.IsValid)
                {
                    return View(model);
                }


                //if (model.CompanyId == 0)
                //{
                //    model.Message = "Please Select Company.";
                //    ModelState.AddModelError("Message", "Please Select Company.");
                //    return View(model);
                //}

                var result = _repo.SignInAuthentication(model);

                //AuthModel tokens = JsonConvert.DeserializeObject<AuthModel>(result.Data.ToString());

                //ClaimNames.token = tokens.token.ToString();


                if (result != null && result.Status == "Success")

                //if (result.Status == "Success")
                {

                    AuthModel tokens = JsonConvert.DeserializeObject<AuthModel>(result.Data.ToString());

                    ClaimNames.token = tokens.token.ToString();

                    //var companyName = model.CompanyInfos
                    //    .FirstOrDefault(x => x.CompanyId == model.CompanyId)?.CompanyName;

                    var companyName = Session["CompanyName"]?.ToString() ?? "";
                    var companyId = Session["CompanyId"]?.ToString() ?? "0";

                    var branchId = Session["BranchId"]?.ToString()
                       ?? currentUser?.BranchId?.ToString()
                       ?? "0";

                    var branchName = Session["BranchName"]?.ToString()
                                     ?? currentUser?.BranchName
                                     ?? "";
                    // Create a new ClaimsIdentity
                    var identity = new ClaimsIdentity(CookieAuthenticationDefaults.AuthenticationScheme);
                    identity.AddClaim(new Claim(ClaimTypes.Name, model.UserName));
                    identity.AddClaim(new Claim(ClaimNames.UserId, model.UserName));
                    //identity.AddClaim(new Claim(ClaimNames.CompanyId, model.CompanyId.ToString()));
                    //identity.AddClaim(new Claim(ClaimNames.CompanyName, companyName ?? ""));
                    identity.AddClaim(new Claim(ClaimNames.CompanyId, companyId));
                    identity.AddClaim(new Claim(ClaimNames.CompanyName, companyName));


                    identity.AddClaim(new Claim(ClaimNames.BranchId, branchId));
                    identity.AddClaim(new Claim(ClaimNames.BranchName, branchName));


                    var authenticationManager = HttpContext.GetOwinContext().Authentication;
                    authenticationManager.SignIn(new AuthenticationProperties { IsPersistent = true }, identity);

                    // ✅ Store values in Session
                    //Session["UserId"] = model.UserName;
                    //Session["UserName"] = model.UserName;
                    //Session["CompanyId"] = model.CompanyId.ToString();

                    Session["UserId"] = model.UserName;
                    Session["UserName"] = model.UserName;

                    Session["CompanyId"] = companyId;
                    Session["CompanyName"] = companyName;


                    Session["BranchId"] = branchId;
                    Session["BranchName"] = branchName;
                    return RedirectToAction("Index", "Home", new { area = "Common", branchChange = false });
                }
                //else
                //{
                //    model.Message = "Wrong user name or password!";
                //    ModelState.AddModelError("Message", "Wrong user name or password!");
                //    return View(model);
                //}

                else
                {
                    TempData["ErrorMessage"] = "Wrong user name or password!";

                    return RedirectToAction("Index");
                }
            }
            //catch (Exception e)
            //{
            //    Elmah.ErrorSignal.FromCurrentContext().Raise(e);
            //    model.Message = "Wrong user name or password!";
            //    ModelState.AddModelError("Message", "Wrong user name or password!");
            //    //return RedirectToAction("Index");

            //    return View(model);
            //}

            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);

                TempData["ErrorMessage"] = "Wrong user name or password!";

                return RedirectToAction("Index");
            }

        }





        [HttpPost]
        public async Task<ActionResult> Index(LoginResource model)

        {
            _userRepo = new UserProfileRepo();
            List<UserProfileVM> userInfos = new List<UserProfileVM>();
            try
            {
                _repo = new CommonRepo();
                CommonVM commonVM = new CommonVM();
                UserProfileVM userInfo = new UserProfileVM();

                var userName = model.UserName;
                commonVM.Name = userName;



                var result = _repo.SignInAuthentication(model);

                if (result != null && result.Status == "Success")
                {
                    AuthModel tokens = JsonConvert.DeserializeObject<AuthModel>(result.Data.ToString());
                    ClaimNames.token = tokens.token.ToString();

                    UserProfileVM userProfile = result.DataVM != null
                        ? JsonConvert.DeserializeObject<UserProfileVM>(result.DataVM.ToString())
                        : null;

                    var companyName = userProfile?.CompanyName ?? Session["CompanyName"]?.ToString() ?? ""; 
                    var companyId = userProfile != null ? userProfile.CompanyId.ToString() : Session["CompanyId"]?.ToString() ?? "0"; 
                    var branchId = userProfile != null ? userProfile.BranchId.ToString() : Session["BranchId"]?.ToString() ?? "0";
                    var branchName = userProfile?.BranchName ?? Session["BranchName"]?.ToString() ?? "";

                    // Create a new ClaimsIdentity
                    var identity = new ClaimsIdentity(CookieAuthenticationDefaults.AuthenticationScheme);
                    identity.AddClaim(new Claim(ClaimTypes.Name, model.UserName));
                    identity.AddClaim(new Claim(ClaimNames.UserId, model.UserName));
         
                    identity.AddClaim(new Claim(ClaimNames.CompanyId, companyId));
                    identity.AddClaim(new Claim(ClaimNames.CompanyName, companyName));


                    identity.AddClaim(new Claim(ClaimNames.BranchId, branchId));
                    identity.AddClaim(new Claim(ClaimNames.BranchName, branchName));


                    var authenticationManager = HttpContext.GetOwinContext().Authentication;
                    authenticationManager.SignIn(new AuthenticationProperties { IsPersistent = true }, identity);


                    Session["UserImage"] = userProfile.ImagePath;
                    Session["UserHashId"] = userProfile.Id;

                    Session["UserId"] = model.UserName;
                    Session["UserName"] = model.UserName;

                    Session["CompanyId"] = companyId;
                    Session["CompanyName"] = companyName;


                    Session["BranchId"] = branchId;
                    Session["BranchName"] = branchName;
                    return RedirectToAction("Index", "Home", new { area = "Common", branchChange = false });
                }
                

                else
                {
                    TempData["ErrorMessage"] = "Wrong user name or password!";

                    return RedirectToAction("Index");
                }
            }
       

            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);

                TempData["ErrorMessage"] = "Wrong user name or password!";

                return RedirectToAction("Index");
            }

        }





        private ActionResult RedirectToLocal(string returnUrl)
        {
            try
            {
                if (Url.IsLocalUrl(returnUrl))
                {
                    return Redirect(returnUrl);
                }
                else
                {
                    return RedirectToAction("Index", "Home");
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                throw ex;
            }
        }

        [HttpGet]
        public ActionResult LogOff()
        {
            try
            {
                SessionClear();

                return RedirectToAction("Index", "Login");
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                System.Diagnostics.Trace.TraceError($"Error: {e.Message}\nStack Trace: {e.StackTrace}");
                return RedirectToAction("Index", "Login");
            }
        }

        public void SessionClear()
        {
            try
            {
                HttpContext.GetOwinContext().Authentication.SignOut(DefaultAuthenticationTypes.ApplicationCookie);
                SignInManager?.Dispose();
                FormsAuthentication.SignOut();
                Session.Abandon();
                DatabaseHelper.GetConnectionString();

                if (Request.Cookies[FormsAuthentication.FormsCookieName] != null)
                {
                    var authCookie = new HttpCookie(FormsAuthentication.FormsCookieName)
                    {
                        Expires = DateTime.Now.AddDays(-1),
                        Value = null
                    };
                    Response.Cookies.Add(authCookie);
                }

                foreach (string cookieName in Request.Cookies.AllKeys)
                {
                    var cookie = new HttpCookie(cookieName)
                    {
                        Expires = DateTime.Now.AddDays(-1),
                        Value = null
                    };
                    Response.Cookies.Add(cookie);
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                ex.Message.ToString();
            }
        }

        [HttpGet]
        public ActionResult _leftSideBar()
        {
            try
            {
                if (Session["UserName"] != null)
                {
                    CommonRepo _repo = new CommonRepo();

                    var result = _repo.GetAssignedMenuList(Session["UserName"] != null ? Session["UserName"].ToString() : "");

                    var model = result.ToList();
                    ViewBag.ShouldRenderMenu = model.Any();
                    return PartialView("_leftSideBar", model);
                }
                else
                {
                    return View("Error");
                }
            }
            catch (Exception e)
            {
                Session["result"] = "Fail" + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
            }

            return RedirectToAction("Index");
        }

        [HttpPost]
        public async Task<ActionResult> Register(LoginResource model)
        {
            try
            {
                List<CompanyInfo> companyInfos = new List<CompanyInfo>();
                LoginResource loginModel = new LoginResource();

                if (ModelState.IsValid)
                {
                    loginModel.CompanyInfos = companyInfos;

                    var claims = new List<Claim>
                {
                                new Claim("Database", "ShampanPOS_DB"),
                             };

                    var user = new ApplicationUser
                    {
                        UserName = "ERP",
                        FullName = "ERP",
                        EmailConfirmed = true,
                        PhoneNumberConfirmed = true,
                        TwoFactorEnabled = false,
                        LockoutEnabled = false,
                        AccessFailedCount = 0,
                        Email = "admin@admin.com"
                    };

                    var result = await UserManager.CreateAsync(user, "123456");

                    if (result.Succeeded)
                    {
                        foreach (var claim in claims)
                        {
                            var claimResult = await UserManager.AddClaimAsync(user.Id, claim);
                            if (!claimResult.Succeeded)
                            {
                                // Handle errors if adding claim fails
                                Console.WriteLine(string.Join(", ", claimResult.Errors));
                            }
                        }

                        // Ensure the default role exists
                        await EnsureRoleExistsAsync(DefaultRoles.User);
                        // Assign the default role to the new user

                        var users = await UserManager.FindByNameAsync(user.UserName);
                        if (users != null)
                        {
                            var addRolesResult = await UserManager.AddToRoleAsync(users.Id, DefaultRoles.User);
                            if (addRolesResult.Succeeded)
                            {
                                // Role assignment successful
                            }
                        }
                        else
                        {
                            // Handle user not found
                            Console.WriteLine("User not found.");
                        }
                    }
                    else
                    {
                        Console.WriteLine(string.Join(", ", result.Errors));
                    }

                    // Assuming userManager is already configured
                    var loginuser = await UserManager.FindByNameAsync(user.UserName); // Find the user

                    if (loginuser != null)
                    {
                        var userLoginInfo = new Microsoft.AspNet.Identity.UserLoginInfo(
                            loginProvider: "Google",
                            providerKey: DateTime.Now.ToString("yyyMMddHHmmss")
                        );

                        var addLoginResult = await UserManager.AddLoginAsync(user.Id, userLoginInfo);

                        if (addLoginResult.Succeeded)
                        {
                            Console.WriteLine("Login added successfully.");
                        }
                        else
                        {
                            Console.WriteLine("Error: " + string.Join(", ", addLoginResult.Errors));
                        }
                    }
                    else
                    {
                        Console.WriteLine("User not found.");
                    }

                    if (result.Succeeded)
                    {
                        // Optionally sign in the user
                        await SignInManager.SignInAsync(user, isPersistent: false, rememberBrowser: false);

                        // Redirect to another page after registration
                        return RedirectToAction("Index", "Home");
                    }

                    // Add errors to the ModelState
                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError("", error);
                    }
                }

                // If we got this far, something failed; redisplay the form
                return View(loginModel);
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                throw ex;
            }
        }

        private async Task EnsureRoleExistsAsync(string roleName)
        {
            try
            {
                var roleManager = new Microsoft.AspNet.Identity.RoleManager<IdentityRole>(new RoleStore<IdentityRole>(new ApplicationDbContext()));

                if (!await roleManager.RoleExistsAsync("Admin"))
                {
                    var roleResult = await roleManager.CreateAsync(new IdentityRole("Admin"));
                    if (!roleResult.Succeeded)
                    {
                        Console.WriteLine(string.Join(", ", roleResult.Errors));
                    }
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                throw ex;
            }
        }


        [HttpPost]
        public async Task<ActionResult> SignIn(LoginResource model)
        {
            try
            {
                _repo = new CommonRepo();
                AuthRepo _authRepo = new AuthRepo();

                if (string.IsNullOrWhiteSpace(model.UserName) || string.IsNullOrWhiteSpace(model.Password))
                {
                    return View(model);
                }

                var result = _authRepo.SignInAuthentication(model);


                if (!string.IsNullOrEmpty(result.token))
                {
                    var identity = new ClaimsIdentity(User.Identity);
                    identity.AddClaim(new Claim(ClaimNames.UserId, model.UserName));
                    identity.AddClaim(new Claim(ClaimNames.CompanyId, model.CompanyId.ToString()));
                    identity.AddClaim(new Claim(ClaimNames.token, result.token.ToString()));
                    identity.AddClaim(new Claim(ClaimNames.Expires_in, result.Expires_in.ToString()));
                    identity.AddClaim(new Claim(ClaimNames.Token_type, result.Token_type.ToString()));
                    Session["UserId"] = model.UserName;
                    Session["CompanyId"] = model.CompanyId.ToString();
                    Session["token"] = result.token;
                    Session["Expires_in"] = result.Expires_in;
                    Session["Token_type"] = result.Token_type;
                    return RedirectToAction("Index", "Home", new { area = "Common", branchChange = false });
                }
                else
                {
                    model.Message = "Wrong user name or password!";
                    ModelState.AddModelError("Message", "Wrong user name or password!");
                    return View(model);
                }
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                model.Message = "Wrong user name or password!";
                ModelState.AddModelError("Message", "Wrong user name or password!");
                return View(model);
            }
        }


        public ActionResult SignUp()
        {
            return RedirectToAction("SignUpCreate", "SignUp", new { area = "SetUp" });
        }


    }

}
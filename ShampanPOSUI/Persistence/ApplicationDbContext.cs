using Microsoft.AspNet.Identity.EntityFramework;
using ShampanPOS.Models;
using System.Configuration;
using System;
using System.Data.Entity;

namespace ShampanPOSUI.Persistence
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext() : base("name=AuthContext")
        {
            Database.SetInitializer<ApplicationDbContext>(null);
        }

        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<ApplicationDbContext>(null);
            base.OnModelCreating(modelBuilder);
        }
    }

    public class DatabaseHelper
    {
        public static string GetConnectionString()
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
                SessionClass.ConnectionString = connectionString;
                return connectionString;
            }
            catch (Exception ex)
            {
                throw new Exception("Error fetching connection string", ex);
            }
        }

    }

}

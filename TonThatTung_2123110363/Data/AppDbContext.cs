using Microsoft.EntityFrameworkCore;
using TonThatTung_2123110363.Models;
namespace TonThatTung_2123110363.Data
{
    public class AppDbContext : DbContext
    {
        // Constructor này bắt buộc phải có để nhận Connection String từ Program.cs
     public AppDbContext(DbContextOptions<AppDbContext> options) :
    base(options)
        {
        }
        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }
        public DbSet<User> Users { get; set; }
    }
}

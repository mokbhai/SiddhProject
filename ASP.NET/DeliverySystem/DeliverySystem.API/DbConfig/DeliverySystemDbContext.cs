using DeliverySystem.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace DeliverySystem.API.DbConfig;

public class DeliverySystemDbContext : DbContext
{
    public DbSet<Order> Orders { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Payment> Payments { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        string connectionString = "Server=localhost;Port=5432;Database=DeliverySystem;User Id=postgres;Password=12345;";

        optionsBuilder.UseNpgsql(connectionString);
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        #region Orders
        modelBuilder.Entity<Order>()
            .HasKey(c => c.OrderId);

        modelBuilder.Entity<Order>()
            .Property(c => c.CreatedAtUtc)
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .ValueGeneratedOnAdd();

        modelBuilder.Entity<Order>()
            .Property(c => c.UpdatedAtUtc)
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .ValueGeneratedOnUpdate();

        #endregion
        // other configurations
    }

}

using Ecommerce.Api.Entities;
using Ecommerce.Api.Options;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Ecommerce.Api.DbConfig;

public class EcommerceDbContext : DbContext
{
    private readonly IOptions<DatabaseConfig> _options;

    public EcommerceDbContext(IOptions<DatabaseConfig> options)
    {
        _options = options;
    }
    public DbSet<Product> Products { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        string connectionString = _options.Value.PostgresConnectionString;

        optionsBuilder.UseNpgsql(connectionString);
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        #region Products

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.HasOne(x => x.Seller);
            entity.Property(c => c.CreatedAtUtc).HasDefaultValueSql("CURRENT_TIMESTAMP").ValueGeneratedOnAdd(); 
            entity.Property(c => c.UpdatedAtUtc).HasDefaultValueSql("CURRENT_TIMESTAMP").ValueGeneratedOnUpdate();
        });

        #endregion

        #region Order


        #endregion
    }
}
using Ecommerce.Api.Options;
using LibraryManagement.API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace LibraryManagement.API.DBConfig;

public class AppDbContext  : DbContext
{
    private readonly IOptions<DatabaseConfig> _options;

    public AppDbContext(IOptions<DatabaseConfig> options)
    {
        _options = options;
    }
    public DbSet<Book> Books { get; set; }
    public DbSet<Author> Authors { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<UserBook> UserBooks { get; set; }
    
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        string connectionString = _options.Value.PostgresConnectionString;

        optionsBuilder.UseNpgsql(connectionString);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Book>().HasKey(x => x.Id);
        modelBuilder.Entity<Book>()
            .HasOne(x => x.Author)
            .WithMany(s => s.Books).HasForeignKey(x => x.AuthorId);          
            
    }
}

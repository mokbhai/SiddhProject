
//using Microsoft.EntityFrameworkCore;
//using Microsoft.Extensions.Options;

//using TimeTable.Data.Entities;

//namespace TimeTable.DbContext;

//public class TimeTableDbContext : DbContext
//{
//    private readonly IOptions<DatabaseConfig> _options;

//    public DbContext(IOptions<DatabaseConfig> options)
//    {
//        _options = options;

//    }

//    public DbSet<TaskEntity> Tasks { get; set; }

//    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
//    {
//        string connectionString = _options.Value.PostgresConnectionString;

//        optionsBuilder.UseNpgsql(connectionString);
//    }
//    protected override void OnModelCreating(ModelBuilder modelBuilder)
//    {
//        #region Products

//        modelBuilder.Entity<TaskEntity>(entity =>
//        {
//            entity.HasKey(p => p.Id);
//            entity.Property(c => c.CreatedAtUtc).HasDefaultValueSql("CURRENT_TIMESTAMP").ValueGeneratedOnAdd();
//        });

//        #endregion

//        #region Order


//        #endregion
//    }
//}


using Microsoft.EntityFrameworkCore;
using MyApp.Data.Configurations;
using MyApp.Domain.Entities;

namespace MyApp.Data.Context;

public sealed class AppDbContext : DbContext
{
    // ===============================
    // DbSets (Tables)
    // ===============================
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Test> Tests => Set<Test>();
    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();

    // ===============================
    // Constructor
    // ===============================
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    // ===============================
    // Model Configuration
    // ===============================
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Apply entity configurations
        modelBuilder.ApplyConfiguration(new CategoryConfig());
        modelBuilder.ApplyConfiguration(new TestConfig());
        modelBuilder.ApplyConfiguration(new AdminUserConfig());

        base.OnModelCreating(modelBuilder);
    }
}


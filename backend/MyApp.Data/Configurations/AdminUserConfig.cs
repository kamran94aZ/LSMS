using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyApp.Domain.Entities;

namespace MyApp.Data.Configurations;

public sealed class AdminUserConfig : IEntityTypeConfiguration<AdminUser>
{
    public void Configure(EntityTypeBuilder<AdminUser> builder)
    {
        builder.ToTable("AdminUsers");

        // ===============================
        // Primary Key
        // ===============================
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
               .HasColumnName("AdminUserID");

        // ===============================
        // Core Fields
        // ===============================
        builder.Property(x => x.AdminUserName)
               .HasColumnName("AdminUserName")
               .IsRequired()
               .HasMaxLength(100);

        builder.Property(x => x.FullName)
               .HasMaxLength(200);

        builder.Property(x => x.JobTitle)
               .HasMaxLength(100);

        builder.Property(x => x.IsActive)
               .IsRequired();

        builder.Property(x => x.PasswordHash)
               .IsRequired()
               .HasMaxLength(500);

       
        builder.Property(x => x.MustChangePassword)
               .HasColumnName("MustChangePassword")
               .IsRequired();

        // ===============================
        // Audit Fields
        // ===============================
        builder.Property(x => x.CreatedAt);
        builder.Property(x => x.UpdatedAt);
        builder.Property(x => x.LastLoginAt);

        // ===============================
        // Indexes
        // ===============================
        builder.HasIndex(x => x.AdminUserName)
               .IsUnique();
    }
}



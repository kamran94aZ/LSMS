using MyApp.Domain.Enums;

namespace MyApp.Domain.Entities;

public class AdminUser
{
    public int Id { get; private set; }

    public string AdminUserName { get; private set; } = string.Empty;

    public string? FullName { get; private set; }

    public string? JobTitle { get; private set; }

    public bool IsActive { get; private set; }

    public string PasswordHash { get; private set; } = string.Empty;

    public bool MustChangePassword { get; private set; }

    public DateTime CreatedAt { get; private set; }

    public DateTime? UpdatedAt { get; private set; }

    public DateTime? LastLoginAt { get; private set; }

    private AdminUser() { }

    public AdminUser(
        string adminUserName,
        string passwordHash,
        string? fullName = null,
        string? jobTitle = null)
    {
        AdminUserName = adminUserName?.Trim() ?? string.Empty;
        PasswordHash = passwordHash ?? string.Empty;
        FullName = fullName;
        JobTitle = jobTitle;
        IsActive = true;
        MustChangePassword = true;
        CreatedAt = DateTime.UtcNow;
    }

    public void Disable()
    {
        IsActive = false;
        UpdatedAt = DateTime.UtcNow;
    }

    public void RequirePasswordChange()
    {
        MustChangePassword = true;
        UpdatedAt = DateTime.UtcNow;
    }

    public void PasswordChanged()
    {
        MustChangePassword = false;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetPassword(string newPasswordHash)
    {
        PasswordHash = newPasswordHash;
        PasswordChanged();
    }

    public void TouchLogin()
    {
        LastLoginAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }
}

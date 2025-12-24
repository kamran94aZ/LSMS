using MyApp.Domain.Enums;

namespace MyApp.Application.DTOs.Auth;

public sealed class LoginResult
{
    public bool Success { get; set; }
    public int UserId { get; set; }
    public UserRole Role { get; set; }

    public bool MustChangePassword { get; set; }
}



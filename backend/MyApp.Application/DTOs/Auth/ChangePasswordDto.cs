namespace MyApp.Application.DTOs.Auth;

public sealed class ChangePasswordDto
{
    public string NewPassword { get; init; } = string.Empty;
}


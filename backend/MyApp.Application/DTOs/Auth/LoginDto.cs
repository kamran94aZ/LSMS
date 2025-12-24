namespace MyApp.Application.DTOs.Auth;

public sealed class LoginDto
{
    public string Username { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
}



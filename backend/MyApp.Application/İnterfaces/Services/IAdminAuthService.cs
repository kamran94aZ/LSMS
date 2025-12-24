using MyApp.Application.DTOs.Auth;

namespace MyApp.Application.Interfaces.Services;

public interface IAdminAuthService
{
    LoginResult Login(LoginDto dto);
    bool ChangePassword(int userId, string newPassword);
}

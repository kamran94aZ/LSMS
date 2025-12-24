using MyApp.Application.DTOs.Auth;
using MyApp.Application.Interfaces.Services;
using MyApp.Domain.Enums;
using MyApp.Domain.Interfaces.Repositories;
using MyApp.Domain.Interfaces.Security;

namespace MyApp.Application.Services;

public sealed class AdminAuthService : IAdminAuthService
{
    private readonly IAdminUserRepository _repo;
    private readonly IPasswordHasher _hasher;

    public AdminAuthService(
        IAdminUserRepository repo,
        IPasswordHasher hasher)
    {
        _repo = repo;
        _hasher = hasher;
    }

    public LoginResult Login(LoginDto dto)
    {
        var user = _repo.GetByUserName(dto.Username);

        if (user == null || !user.IsActive)
        {
            return new LoginResult
            {
                Success = false
            };
        }

        if (!_hasher.Verify(dto.Password, user.PasswordHash))
        {
            return new LoginResult
            {
                Success = false
            };
        }

        user.TouchLogin();
        _repo.Update(user);

        return new LoginResult
        {
            Success = true,
            UserId = user.Id,
            Role = UserRole.Admin,
            MustChangePassword = user.MustChangePassword
        };
    }

    public bool ChangePassword(int userId, string newPassword)
    {
        var user = _repo.GetById(userId);

        if (user == null || !user.IsActive)
            return false;

        var newHash = _hasher.Hash(newPassword);

        user.SetPassword(newHash);

        _repo.Update(user);
        return true;
    }
}


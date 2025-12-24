using System.Security.Claims;
using MyApp.Application.Interfaces.Security;
using MyApp.Domain.Enums;

namespace MyApp.API.Security;

public sealed class CurrentUser : ICurrentUser
{
    public int UserId { get; }
    public UserRole Role { get; }
    public bool IsAuthenticated { get; }
    public bool MustChangePassword { get; }

    public CurrentUser(IHttpContextAccessor accessor)
    {
        var user = accessor.HttpContext?.User;
        IsAuthenticated = user?.Identity?.IsAuthenticated ?? false;

        if (!IsAuthenticated)
        {
            UserId = 0;
            Role = UserRole.None;
            MustChangePassword = false;
            return;
        }

        UserId = int.Parse(
            user!.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0"
        );

        Role = Enum.TryParse(
            user.FindFirstValue(ClaimTypes.Role),
            out UserRole role
        ) ? role : UserRole.None;

        MustChangePassword = bool.TryParse(
            user.FindFirstValue("MustChangePassword"),
            out var mustChange
        ) && mustChange;
    }

    public bool IsAdmin()
    {
        return Role == UserRole.Admin;
    }
}



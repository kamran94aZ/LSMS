using MyApp.Domain.Enums;

namespace MyApp.Application.Interfaces.Security;

public interface ICurrentUser
{
    int UserId { get; }
    UserRole Role { get; }
    bool IsAuthenticated { get; }
    bool MustChangePassword { get; }

    bool IsAdmin();
}



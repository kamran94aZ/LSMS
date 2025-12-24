using MyApp.Domain.Enums;

namespace MyApp.Domain.Interfaces.Security;

public interface ISecurityContext
{
    int UserId { get; }
    UserRole Role { get; }
    bool IsAuthenticated { get; }
}


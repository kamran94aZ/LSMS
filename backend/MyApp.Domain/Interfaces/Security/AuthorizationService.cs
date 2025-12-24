using MyApp.Domain.Enums;
using MyApp.Domain.Exceptions;
using MyApp.Domain.Interfaces.Security;

namespace MyApp.Domain.Security;

public sealed class AuthorizationService : IAuthorizationService
{
    public void EnsureAdmin(ISecurityContext context)
    {
        if (!context.IsAuthenticated)
            throw new SecurityViolationException("Unauthenticated");

        if (context.Role != UserRole.Admin)
            throw new ForbiddenException("Admin only");
    }
}

namespace MyApp.Domain.Interfaces.Security;

public interface IAuthorizationService
{
    void EnsureAdmin(ISecurityContext context);
}

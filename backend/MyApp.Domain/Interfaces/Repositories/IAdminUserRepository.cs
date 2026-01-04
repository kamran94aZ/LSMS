using MyApp.Domain.Entities;

namespace MyApp.Domain.Interfaces.Repositories;

public interface IAdminUserRepository
{
    AdminUser? GetByUserName(string adminUserName);
    AdminUser? GetById(int id);
    void Update(AdminUser user);
    void UpdateLoginMeta(int id);
}

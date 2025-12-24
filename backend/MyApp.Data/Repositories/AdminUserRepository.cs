using MyApp.Data.Context;
using MyApp.Domain.Entities;
using MyApp.Domain.Interfaces.Repositories;

namespace MyApp.Data.Repositories;

public sealed class AdminUserRepository : IAdminUserRepository
{
    private readonly AppDbContext _ctx;

    public AdminUserRepository(AppDbContext ctx)
    {
        _ctx = ctx;
    }

    public AdminUser? GetByUserName(string adminUserName)
    {
        return _ctx.AdminUsers
            .SingleOrDefault(x => x.AdminUserName == adminUserName);
    }

    public AdminUser? GetById(int id)
    {
        return _ctx.AdminUsers
            .SingleOrDefault(x => x.Id == id);
    }

    public void Update(AdminUser user)
    {
        _ctx.AdminUsers.Update(user);
        _ctx.SaveChanges();
    }
}


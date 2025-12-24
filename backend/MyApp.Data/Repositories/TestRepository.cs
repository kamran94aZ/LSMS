using Microsoft.EntityFrameworkCore;
using MyApp.Data.Context;
using MyApp.Domain.Entities;
using MyApp.Domain.Interfaces.Repositories;

namespace MyApp.Data.Repositories;

public sealed class TestRepository : ITestRepository
{
    private readonly AppDbContext _ctx;
    public TestRepository(AppDbContext ctx) => _ctx = ctx;

    public Test? GetById(int id)
        => _ctx.Tests.AsNoTracking().SingleOrDefault(x => x.Id == id);

    public IReadOnlyList<Test> GetAll()
        => _ctx.Tests.AsNoTracking().OrderBy(x => x.Id).ToList();

    public void Add(Test test)
    {
        _ctx.Tests.Add(test);
        _ctx.SaveChanges();
    }


    public void Delete(Test test)
    {
        _ctx.Tests.Remove(test);
        _ctx.SaveChanges();
    }
}


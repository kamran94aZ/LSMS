using Microsoft.EntityFrameworkCore;
using MyApp.Data.Context;
using MyApp.Domain.Entities;
using MyApp.Domain.Interfaces.Repositories;
using System;

namespace MyApp.Data.Repositories;

public sealed class CategoryRepository : ICategoryRepository
{
    private readonly AppDbContext _ctx;

    public CategoryRepository(AppDbContext ctx)
    {
        _ctx = ctx;
    }

    public IReadOnlyList<Category> GetAll()
        => _ctx.Categories.AsNoTracking().OrderBy(x => x.Id).ToList();

    public Category? GetById(int id)
        => _ctx.Categories.SingleOrDefault(x => x.Id == id);

    public void Add(Category category)
    {
        _ctx.Categories.Add(category);
        _ctx.SaveChanges();
    }

    public void Delete(Category category)
    {
        _ctx.Categories.Remove(category);
        _ctx.SaveChanges();
    }
}


using MyApp.Domain.Entities;

namespace MyApp.Domain.Interfaces.Repositories;

public interface ICategoryRepository
{
    IReadOnlyList<Category> GetAll();
    Category? GetById(int id);
    void Add(Category category);
    void Delete(Category category);
}


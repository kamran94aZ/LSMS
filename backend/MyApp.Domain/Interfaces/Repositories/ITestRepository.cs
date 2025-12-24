using MyApp.Domain.Entities;

namespace MyApp.Domain.Interfaces.Repositories;

public interface ITestRepository
{
    Test? GetById(int id);
    IReadOnlyList<Test> GetAll();
    void Add(Test test);
    void Delete(Test test);
}

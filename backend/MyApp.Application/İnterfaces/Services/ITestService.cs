using MyApp.Application.DTOs.Tests;

namespace MyApp.Application.Interfaces.Services;

public interface ITestService
{
    IReadOnlyList<TestDto> GetAll();
    void Create(CreateTestDto dto);
    void Delete(int testId);
}


using MyApp.Application.DTOs.Tests;
using MyApp.Application.Interfaces.Security;
using MyApp.Application.Interfaces.Services;
using MyApp.Data.Repositories;
using MyApp.Domain.Entities;
using MyApp.Domain.Exceptions;
using MyApp.Domain.Interfaces.Repositories;

namespace MyApp.Application.Services;

public sealed class TestService : ITestService
{
    private readonly ITestRepository _repo;
    private readonly ICurrentUser _currentUser;

    public TestService(ITestRepository repo, ICurrentUser currentUser)
    {
        _repo = repo;
        _currentUser = currentUser;
    }

    public IReadOnlyList<TestDto> GetAll()
    {
        return _repo.GetAll()
            .Select(t => new TestDto
            {
                Id = t.Id,
                Name = t.Name,
                CategoryId = t.CategoryId
            })
            .ToList();
    }

    public void Create(CreateTestDto dto)
    {
        if (!_currentUser.IsAuthenticated || !_currentUser.IsAdmin())
            throw new ForbiddenException("Admin only");

        var test = new Test(dto.Name, dto.CategoryId);
        _repo.Add(test);
    }

    public void Delete(int testId)
    {
        if (!_currentUser.IsAuthenticated || !_currentUser.IsAdmin())
            throw new ForbiddenException("Admin only");

        var test = _repo.GetById(testId)
            ?? throw new NotFoundException("Test not found");

        if (test.IsLocked)
            throw new SecurityViolationException("Locked");

        _repo.Delete(test);
    }
}

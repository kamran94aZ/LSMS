using MyApp.Application.DTOs.Categories;
using MyApp.Application.Interfaces.Security;
using MyApp.Application.Interfaces.Services;
using MyApp.Domain.Entities;
using MyApp.Domain.Exceptions;
using MyApp.Domain.Interfaces.Repositories;

namespace MyApp.Application.Services;

public sealed class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _repo;
    private readonly ICurrentUser _currentUser;

    public CategoryService(
        ICategoryRepository repo,
        ICurrentUser currentUser)
    {
        _repo = repo;
        _currentUser = currentUser;
    }

    public IReadOnlyList<CategoryDto> GetAll()
    {
        return _repo.GetAll()
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name
            })
            .ToList();
    }

    public void Create(CreateCategoryDto dto)
    {
        if (!_currentUser.IsAuthenticated || !_currentUser.IsAdmin())
            throw new ForbiddenException("Admin only");

        var category = new Category(dto.Name);
        _repo.Add(category);
    }

    public void Delete(int id)
    {
        if (!_currentUser.IsAuthenticated || !_currentUser.IsAdmin())
            throw new ForbiddenException("Admin only");

        var category = _repo.GetById(id)
            ?? throw new NotFoundException("Category not found");

        if (category.IsLocked)
            throw new SecurityViolationException("Category is locked");

        _repo.Delete(category);
    }
}


using MyApp.Application.DTOs.Categories;

namespace MyApp.Application.Interfaces.Services;

public interface ICategoryService
{
    IReadOnlyList<CategoryDto> GetAll();
    void Create(CreateCategoryDto dto);
    void Delete(int id);
}


using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyApp.API.Filters;
using MyApp.Application.DTOs.Categories;
using MyApp.Application.Interfaces.Services;

namespace MyApp.API.Controllers;

[Authorize(Roles = "Admin")]
[TypeFilter(typeof(RequirePasswordChangeAttribute))]
[ApiController]
[Route("api/admin/categories")]
public sealed class AdminCategoriesController : ControllerBase
{
    private readonly ICategoryService _service;

    public AdminCategoriesController(ICategoryService service)
    {
        _service = service;
    }

    // GET: /api/admin/categories
    [HttpGet]
    public IActionResult GetAll()
    {
        var categories = _service.GetAll();
        return Ok(categories);
    }

    // POST: /api/admin/categories
    [HttpPost]
    public IActionResult Create([FromBody] CreateCategoryDto dto)
    {
        _service.Create(dto);
        return Ok();
    }

    // DELETE: /api/admin/categories/{id}
    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
    {
        _service.Delete(id);
        return NoContent();
    }

    // GET: /api/admin/categories/ping
    [HttpGet("ping")]
    public IActionResult Ping()
    {
        return Ok();
    }
}

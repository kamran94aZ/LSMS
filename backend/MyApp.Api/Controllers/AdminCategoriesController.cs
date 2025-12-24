/*
 * File: AdminCategoriesController.cs
 *
 * Purpose:
 * This controller provides administrative endpoints for managing category entities.
 * It is designed exclusively for authorized administrative users and enforces
 * additional security constraints at the API level.
 *
 * Responsibilities:
 * - Expose category management endpoints (CRUD operations)
 * - Enforce role-based authorization (Admin only)
 * - Ensure password policy compliance before request execution
 *
 * Security Considerations:
 * - Access is restricted to users with the "Admin" role.
 * - Requests are filtered to ensure mandatory password change requirements
 *   are satisfied before allowing any operation.
 *
 * Architectural Notes:
 * - This controller acts as a thin layer and delegates all business logic
 *   to the application service layer via ICategoryService.
 * - No business rules or data access logic are implemented here.
 */

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

    /// <summary>
    /// Initializes the controller with the required category service dependency.
    /// The service abstraction ensures loose coupling and testability.
    /// </summary>
    public AdminCategoriesController(ICategoryService service)
    {
        _service = service;
    }

    /// <summary>
    /// Retrieves all category records available in the system.
    /// </summary>
    /// <remarks>
    /// This endpoint is intended for administrative overview and management purposes.
    /// No filtering or pagination logic is applied at the controller level.
    /// </remarks>
    /// <returns>HTTP 200 with a collection of category DTOs.</returns>
    [HttpGet]
    public IActionResult GetAll()
    {
        var categories = _service.GetAll();
        return Ok(categories);
    }

    /// <summary>
    /// Creates a new category based on the provided input data.
    /// </summary>
    /// <param name="dto">
    /// Data transfer object containing category creation parameters.
    /// </param>
    /// <returns>
    /// HTTP 200 upon successful creation.
    /// </returns>
    [HttpPost]
    public IActionResult Create([FromBody] CreateCategoryDto dto)
    {
        _service.Create(dto);
        return Ok();
    }

    /// <summary>
    /// Deletes an existing category by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the category.</param>
    /// <returns>
    /// HTTP 204 if the deletion is successful.
    /// </returns>
    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
    {
        _service.Delete(id);
        return NoContent();
    }

    /// <summary>
    /// Health-check endpoint used to verify service availability
    /// and authorization pipeline integrity.
    /// </summary>
    /// <returns>HTTP 200 if the service is reachable.</returns>
    [HttpGet("ping")]
    public IActionResult Ping()
    {
        return Ok();
    }
}

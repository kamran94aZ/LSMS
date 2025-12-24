/*
 * File: AdminTestsController.cs
 *
 * Purpose:
 * This controller exposes administrative endpoints for managing test entities
 * within the system. It is restricted to authorized administrative users and
 * enforces additional security validation through request filters.
 *
 * Responsibilities:
 * - Provide administrative CRUD operations for test definitions
 * - Enforce role-based access control (Admin)
 * - Ensure password policy compliance before executing any action
 *
 * Architectural Notes:
 * - Acts as a thin API layer that delegates all business logic to the
 *   application service layer via ITestService.
 * - Does not contain business rules or data persistence logic.
 */

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyApp.API.Filters;
using MyApp.Application.DTOs.Tests;
using MyApp.Application.Interfaces.Services;

namespace MyApp.API.Controllers;

[Authorize(Roles = "Admin")]
[TypeFilter(typeof(RequirePasswordChangeAttribute))]
[ApiController]
[Route("api/admin/tests")]
public sealed class AdminTestsController : ControllerBase
{
    private readonly ITestService _service;

    /// <summary>
    /// Initializes the controller with the required test service dependency.
    /// </summary>
    public AdminTestsController(ITestService service)
    {
        _service = service;
    }

    /// <summary>
    /// Retrieves all test definitions available in the system.
    /// </summary>
    /// <returns>HTTP 200 with a collection of test DTOs.</returns>
    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(_service.GetAll());
    }

    /// <summary>
    /// Creates a new test definition based on the provided input data.
    /// </summary>
    /// <param name="dto">Test creation data transfer object.</param>
    /// <returns>HTTP 200 upon successful creation.</returns>
    [HttpPost]
    public IActionResult Create([FromBody] CreateTestDto dto)
    {
        _service.Create(dto);
        return Ok();
    }

    /// <summary>
    /// Deletes an existing test definition by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the test.</param>
    /// <returns>HTTP 204 if deletion is successful.</returns>
    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
    {
        _service.Delete(id);
        return NoContent();
    }

    /// <summary>
    /// Health-check endpoint used to verify controller availability
    /// and authorization pipeline integrity.
    /// </summary>
    /// <returns>HTTP 200 if the service is reachable.</returns>
    [HttpGet("ping")]
    public IActionResult Ping()
    {
        return Ok();
    }
}

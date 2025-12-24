/*
 * File: AuthController.cs
 *
 * Purpose:
 * This controller manages authentication and session-related operations
 * for administrative users within the system.
 *
 * Responsibilities:
 * - Handle login and logout workflows
 * - Enforce password change policies
 * - Establish and terminate authenticated sessions
 * - Expose identity-related endpoints for authenticated users
 *
 * Security Considerations:
 * - Uses cookie-based authentication for session management
 * - Applies role and identity claims to control access
 * - Explicitly enforces mandatory password change flows
 *
 * Architectural Notes:
 * - Delegates all authentication and authorization logic to the
 *   application service layer via IAdminAuthService.
 * - Does not perform credential validation or persistence directly.
 */

using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyApp.Application.DTOs.Auth;
using MyApp.Application.Interfaces.Services;
using System.Security.Claims;

[ApiController]
[Route("api/auth")]
public sealed class AuthController : ControllerBase
{
    private readonly IAdminAuthService _auth;

    /// <summary>
    /// Initializes the authentication controller with the required
    /// authentication service dependency.
    /// </summary>
    public AuthController(IAdminAuthService auth)
    {
        _auth = auth;
    }

    /// <summary>
    /// Authenticates an administrative user and establishes
    /// a cookie-based authentication session.
    /// </summary>
    /// <remarks>
    /// - Returns 401 if credentials are invalid
    /// - Returns 403 if a password change is required
    /// - Creates an authenticated identity with role and policy claims
    /// </remarks>
    /// <param name="dto">Login credentials.</param>
    /// <returns>HTTP 200 upon successful authentication.</returns>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var result = _auth.Login(dto);

        if (!result.Success)
            return Unauthorized();

        if (result.MustChangePassword)
            return StatusCode(403, new { code = "PASSWORD_CHANGE_REQUIRED" });

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, result.UserId.ToString()),
            new Claim(ClaimTypes.Role, result.Role.ToString()),
            new Claim("MustChangePassword", "false")
        };

        var identity = new ClaimsIdentity(
            claims,
            CookieAuthenticationDefaults.AuthenticationScheme
        );

        await HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            new ClaimsPrincipal(identity)
        );

        return Ok();
    }

    /// <summary>
    /// Allows an authenticated user to change their password.
    /// </summary>
    /// <remarks>
    /// - Requires an active authenticated session
    /// - Invalidates the current session upon successful password change
    /// </remarks>
    /// <param name="dto">New password data.</param>
    /// <returns>HTTP 200 if the password is successfully changed.</returns>
    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdStr))
            return Unauthorized();

        var userId = int.Parse(userIdStr);

        var success = _auth.ChangePassword(userId, dto.NewPassword);
        if (!success)
            return BadRequest();

        await HttpContext.SignOutAsync(
            CookieAuthenticationDefaults.AuthenticationScheme
        );

        return Ok();
    }

    /// <summary>
    /// Terminates the current authenticated session.
    /// </summary>
    /// <returns>HTTP 200 upon successful logout.</returns>
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(
            CookieAuthenticationDefaults.AuthenticationScheme
        );

        return Ok();
    }

    /// <summary>
    /// Returns basic information about the currently authenticated user.
    /// </summary>
    /// <returns>HTTP 200 if the user is authenticated; otherwise 401.</returns>
    [HttpGet("me")]
    public IActionResult Me()
    {
        if (!User.Identity?.IsAuthenticated ?? true)
            return Unauthorized();

        return Ok();
    }
}

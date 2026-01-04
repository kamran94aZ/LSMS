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

    public AuthController(IAdminAuthService auth)
    {
        _auth = auth;
    }

    // ===============================
    // LOGIN
    // ===============================
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var result = _auth.Login(dto);

        if (!result.Success)
            return Unauthorized();

      
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, result.UserId.ToString()),
            new Claim("uid", result.UserId.ToString()),
            new Claim(ClaimTypes.Role, result.Role.ToString()),
            new Claim("MustChangePassword", result.MustChangePassword.ToString())
        };

        var identity = new ClaimsIdentity(
            claims,
            CookieAuthenticationDefaults.AuthenticationScheme
        );

       
        await HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            new ClaimsPrincipal(identity)
        );

       
        return Ok(new
        {
            mustChangePassword = result.MustChangePassword
        });
    }

    // ===============================
    // CHANGE PASSWORD
    // ===============================
    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        
        var userIdStr =
            User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("uid");

        if (string.IsNullOrEmpty(userIdStr))
            return Unauthorized("UserId claim not found");

        var userId = int.Parse(userIdStr);

        var success = _auth.ChangePassword(userId, dto.NewPassword);
        if (!success)
            return BadRequest();


        await HttpContext.SignOutAsync(
            CookieAuthenticationDefaults.AuthenticationScheme
        );

        return Ok();
    }

    // ===============================
    // LOGOUT
    // ===============================
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(
            CookieAuthenticationDefaults.AuthenticationScheme
        );

        return Ok();
    }

    // ===============================
    // ME
    // ===============================
    [HttpGet("me")]
    public IActionResult Me()
    {
        if (!User.Identity?.IsAuthenticated ?? true)
            return Unauthorized();

        return Ok();
    }
}

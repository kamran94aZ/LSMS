using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using MyApp.API.Filters;
using MyApp.API.Security;
using MyApp.Application.Interfaces.Security;
using MyApp.Application.Interfaces.Services;
using MyApp.Application.Services;
using MyApp.Data.Context;
using MyApp.Data.Repositories;
using MyApp.Domain.Interfaces.Repositories;
using MyApp.Domain.Interfaces.Security;
using System.Security.Cryptography;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers(options =>
{
    options.Filters.Add<ExceptionFilter>();
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUser, CurrentUser>();

builder.Services.AddScoped<RequirePasswordChangeAttribute>();

builder.Services.AddSingleton<IPasswordHasher, Pbkdf2PasswordHasher>();

// ===============================
// APPLICATION SERVICES
// ===============================
builder.Services.AddScoped<IAdminAuthService, AdminAuthService>();
builder.Services.AddScoped<ITestService, TestService>();
builder.Services.AddScoped<ICategoryService, CategoryService>(); 

// ===============================
// REPOSITORIES
// ===============================
builder.Services.AddScoped<IAdminUserRepository, AdminUserRepository>();
builder.Services.AddScoped<ITestRepository, TestRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>(); 

// ===============================
// DB CONTEXT
// ===============================
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("Default"))
);

// ===============================
// AUTH
// ===============================
builder.Services
    .AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(opt =>
    {
        opt.Cookie.HttpOnly = true;
        opt.Cookie.SecurePolicy = CookieSecurePolicy.None;
        opt.Cookie.SameSite = SameSiteMode.Lax;

        opt.LoginPath = "/public/login.html";
        opt.AccessDeniedPath = "/public/login.html";

        opt.Events.OnRedirectToLogin = ctx =>
        {
            ctx.Response.Redirect("/public/login.html");
            return Task.CompletedTask;
        };

        opt.Events.OnRedirectToAccessDenied = ctx =>
        {
            ctx.Response.Redirect("/public/login.html");
            return Task.CompletedTask;
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(builder.Environment.ContentRootPath, "wwwroot")
    ),
    RequestPath = ""
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapFallbackToFile("/public/login.html");

app.Run();

// ===============================
// PASSWORD HASHER
// ===============================
public sealed class Pbkdf2PasswordHasher : IPasswordHasher
{
    private const int SaltSize = 16;
    private const int KeySize = 32;
    private const int Iterations = 310_000;

    public string Hash(string password)
    {
        var salt = RandomNumberGenerator.GetBytes(SaltSize);
        using var derive = new Rfc2898DeriveBytes(
            password,
            salt,
            Iterations,
            HashAlgorithmName.SHA256
        );

        var key = derive.GetBytes(KeySize);

        return $"PBKDF2.{Iterations}.{Convert.ToBase64String(salt)}.{Convert.ToBase64String(key)}";
    }

    public bool Verify(string password, string hash)
    {
        var parts = hash.Split('.');
        if (parts.Length != 4) return false;

        var iterations = int.Parse(parts[1]);
        var salt = Convert.FromBase64String(parts[2]);
        var expected = Convert.FromBase64String(parts[3]);

        using var derive = new Rfc2898DeriveBytes(
            password,
            salt,
            iterations,
            HashAlgorithmName.SHA256
        );

        var actual = derive.GetBytes(KeySize);

        return CryptographicOperations.FixedTimeEquals(expected, actual);
    }
}



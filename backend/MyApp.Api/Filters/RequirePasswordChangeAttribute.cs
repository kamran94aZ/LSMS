using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using MyApp.Application.Interfaces.Security;

namespace MyApp.API.Filters;

public sealed class RequirePasswordChangeAttribute : ActionFilterAttribute
{
    public override void OnActionExecuting(ActionExecutingContext context)
    {
        var currentUser = context.HttpContext.RequestServices
            .GetService<ICurrentUser>();

        if (currentUser == null)
            return;

        if (currentUser.IsAuthenticated && currentUser.MustChangePassword)
        {
            context.Result = new ObjectResult(new
            {
                code = "PASSWORD_CHANGE_REQUIRED"
            })
            {
                StatusCode = 403
            };
        }
    }
}



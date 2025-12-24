using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using MyApp.Domain.Exceptions;

namespace MyApp.API.Filters;

public sealed class ExceptionFilter : IExceptionFilter
{
    public void OnException(ExceptionContext context)
    {
        if (context.Exception is ForbiddenException)
        {
            context.Result = new ObjectResult(new
            {
                code = "FORBIDDEN"
            })
            {
                StatusCode = StatusCodes.Status403Forbidden
            };

            context.ExceptionHandled = true;
            return;
        }

        if (context.Exception is NotFoundException)
        {
            context.Result = new NotFoundResult();
            context.ExceptionHandled = true;
            return;
        }

        if (context.Exception is SecurityViolationException)
        {
            context.Result = new ObjectResult("Bad request")
            {
                StatusCode = StatusCodes.Status400BadRequest
            };
            context.ExceptionHandled = true;
            return;
        }

        context.Result = new ObjectResult(new
        {
            error = context.Exception.GetType().Name,
            message = context.Exception.Message,
            stack = context.Exception.StackTrace
        })
        {
            StatusCode = StatusCodes.Status500InternalServerError
        };

        context.ExceptionHandled = true;

    }
}


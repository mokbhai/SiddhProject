using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;

using Shared.Sdk.Error.Exceptions;

using System.Net;
using System.Text.Json;

namespace Shared.Sdk.Error;
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ProblemDetailsFactory _problemDetailsFactory;

    public ExceptionHandlingMiddleware(RequestDelegate next, ProblemDetailsFactory problemDetailsFactory)
    {
        _next = next;
        _problemDetailsFactory = problemDetailsFactory;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.Clear();
        context.Response.ContentType = "application/json";

        ProblemDetails problemDetails;

        switch (exception)
        {
            case BadRequestException badValidationException:
                problemDetails = _problemDetailsFactory.CreateProblemDetails(
                    context,
                    (int)HttpStatusCode.BadRequest,
                    "Bad Request",
                    null,
                    badValidationException.Message,
                    null);
                break;

            case NotFoundException notFoundException:
                problemDetails = _problemDetailsFactory.CreateProblemDetails(
                    context,
                    (int)HttpStatusCode.NotFound,
                    "Not Found",
                    null,
                    notFoundException.Message,
                    null);
                break;

            default:
                problemDetails = _problemDetailsFactory.CreateProblemDetails(
                    context,
                    context.Response.StatusCode,
                    "Internal Server Error",
                    null,
                    exception.Message,
                    null);
                break;
        }

        context.Response.StatusCode = problemDetails.Status ?? (int)HttpStatusCode.InternalServerError;
        await context.Response.WriteAsync(JsonSerializer.Serialize(problemDetails));
    }
}

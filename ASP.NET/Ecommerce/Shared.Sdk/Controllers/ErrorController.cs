using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;

using Shared.Sdk.Error.Exceptions;

namespace Shared.Sdk.Controllers;

[ApiController]
[Route("[controller]")]
public class ErrorController : ControllerBase
{
    [Route("/error-development")]
    [ApiExplorerSettings(IgnoreApi = true)]
    public IActionResult HandleErrorDevelopment([FromServices] IHostEnvironment hostEnvironment)
    {
        if (!hostEnvironment.IsDevelopment())
        {
            return NotFound();
        }

        var exceptionHandlerFeature =
            HttpContext.Features.Get<IExceptionHandlerFeature>()!;

        return Problem(
            detail: exceptionHandlerFeature.Error.StackTrace,
            title: exceptionHandlerFeature.Error.Message);
    }

    // Map the "/error" URL path to the "Error" action method
    [Route("/error")]
    [ApiExplorerSettings(IgnoreApi = true)]
    public IActionResult HandleError() =>
        Problem();

    [Route("/test400error")]
    [HttpGet]
    public IActionResult Test400Error()
    {
        throw new BadRequestException("Bad error occurred");
    }

    [Route("/test404error")]
    [HttpGet]
    public IActionResult Test404Error()
    {
        throw new NotFoundException("Bad error occurred");
    }
}
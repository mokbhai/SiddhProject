using Microsoft.AspNetCore.Mvc;

using Shared.Sdk.Logger;

namespace Shared.SDK.Controllers;

public class BaseController : ControllerBase
{
    protected readonly ILoggerAdapter<BaseController> _logger;

    public BaseController(ILoggerAdapter<BaseController> logger)
    {
        _logger = logger;
    }
}
